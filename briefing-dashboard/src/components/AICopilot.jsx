import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Settings, 
  X, 
  Bot, 
  User, 
  Key, 
  Sparkles, 
  Trash2, 
  ArrowRight
} from 'lucide-react';

// Elegant inline parser for rendering rich markdown-like text securely
const formatResponseText = (text) => {
  if (!text) return '';
  const lines = text.split('\n');
  let isInsideList = false;
  const resultHtml = [];

  const parseBoldAndInline = (str) => {
    // Escape simple HTML chars to prevent XSS
    let escaped = str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Render bold text: **text** -> <strong>text</strong>
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Render inline code or highlight: `text` -> <code class="chat-code">text</code>
    escaped = escaped.replace(/`(.*?)`/g, '<code class="chat-code">$1</code>');
    // Render markdown links: [Link Text](URL) -> <a href="$2" target="_blank" rel="noreferrer" class="chat-link">$1</a>
    escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="chat-link">$1</a>');
    return escaped;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    
    // Bullet lists starting with '-' or '*'
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!isInsideList) {
        resultHtml.push('<ul class="chat-ul">');
        isInsideList = true;
      }
      const itemContent = parseBoldAndInline(trimmed.substring(2));
      resultHtml.push(`<li class="chat-li">${itemContent}</li>`);
    } else {
      if (isInsideList) {
        resultHtml.push('</ul>');
        isInsideList = false;
      }
      
      // Horizontal dividers
      if (trimmed === '---') {
        resultHtml.push('<hr class="chat-hr" />');
      } 
      else if (/^\d+\.\s/.test(trimmed)) {
        const index = trimmed.indexOf(' ');
        const num = trimmed.substring(0, index);
        const itemContent = parseBoldAndInline(trimmed.substring(index + 1));
        resultHtml.push(`<div class="chat-numbered-item"><span class="chat-num-label">${num}</span><span class="chat-item-content">${itemContent}</span></div>`);
      } 
      // Headings e.g. "### Heading" or "## Heading"
      else if (trimmed.startsWith('### ')) {
        resultHtml.push(`<h4 class="chat-h4">${parseBoldAndInline(trimmed.substring(4))}</h4>`);
      } else if (trimmed.startsWith('## ')) {
        resultHtml.push(`<h3 class="chat-h3">${parseBoldAndInline(trimmed.substring(3))}</h3>`);
      } 
      // Normal paragraph line
      else {
        if (trimmed !== '') {
          resultHtml.push(`<p class="chat-p">${parseBoldAndInline(line)}</p>`);
        } else {
          resultHtml.push('<div class="chat-spacing"></div>');
        }
      }
    }
  });

  if (isInsideList) {
    resultHtml.push('</ul>');
  }

  return resultHtml.join('');
};

export default function AICopilot({ report }) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempKey, setTempKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const chatEndRef = useRef(null);

  // Load saved API key on mount and set up initial greeting
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setTempKey(savedKey);
    } else {
      setShowSettings(true);
    }

    // Set initial custom welcoming message
    setMessages([
      {
        role: 'model',
        parts: [{ text: `반갑습니다! 📊 사용자님의 **스마트 자산 포트폴리오 전용 AI 코파일럿**입니다.

오늘 아침 수집된 **HL만도, 삼성전자 등 국내 핵심 주식 5종**과 **테슬라(TSLA), 로켓랩(RKLB), AST 스페이스모바일 등 미국/우주 혁신 자산 6종**의 실시간 야후 파이낸스 주가 정보 및 매일 아침 분석된 경제 뉴스를 모두 숙지하고 있습니다.

포트폴리오에 대해 궁금한 점이 있으시다면 언제든 편하게 질문해 주세요! 아래 단축 버튼을 누르시면 빠르게 시작하실 수 있습니다.` }]
      }
    ]);
  }, []);

  // Auto scroll to latest chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Handle saving API key in localStorage safely
  const handleSaveKey = (e) => {
    e.preventDefault();
    if (!tempKey.trim()) {
      setErrorMsg('API 키를 입력해 주세요.');
      return;
    }
    localStorage.setItem('gemini_api_key', tempKey.trim());
    setApiKey(tempKey.trim());
    setShowSettings(false);
    setErrorMsg('');
  };

  // Clear chat logs
  const handleClearChat = () => {
    if (window.confirm('대화 기록을 초기화하시겠습니까?')) {
      setMessages([
        {
          role: 'model',
          parts: [{ text: '대화 기록이 초기화되었습니다. 궁금하신 점을 다시 질문해 주세요!' }]
        }
      ]);
    }
  };

  // Quick prompt triggers
  const handleQuickPrompt = (promptText) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    setInputValue(promptText);
    sendMessage(promptText);
  };

  // Direct Browser to Gemini API Call using dynamic context injection
  const sendMessage = async (overrideText = '') => {
    const textToSend = (overrideText || inputValue).trim();
    if (!textToSend) return;
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    setInputValue('');
    setIsLoading(true);
    setErrorMsg('');

    // Append user message to state
    const updatedMessages = [...messages, { role: 'user', parts: [{ text: textToSend }] }];
    setMessages(updatedMessages);

    // Prepare system instructions grounded in the current dashboard's active report context
    const reportDate = report?.date || '오늘';
    const systemInstruction = `You are a professional investment co-pilot assistant integrated inside the "Smart Economic Intelligence Dashboard".
Your primary goal is to help the user interpret today's portfolio report, financial indicators, and macroeconomic news.

Here is the exact real-time portfolio data and macroeconomic briefing generated for today (${reportDate}):
--------------------------------------------------
${JSON.stringify(report, null, 2)}
--------------------------------------------------

[IMPORTANT NEWS SOURCES AND CITATIONS]
- When asked about news or stock events, you MUST refer to the specific news items and their actual clickable reference URLs provided in the JSON data above.
- You must cite them beautifully using standard markdown link format: [Source Name](URL) (e.g. [네이버 뉴스](https://news.naver.com/...) or [CNBC](https://www.cnbc.com/...)) so the user can easily click them to verify and explore.
- Always use the exact URLs present in today's report JSON. Do NOT guess or hallucinate any link URLs.

[IMPORTANT COMPLIANCE GUIDELINES]
- Avoid giving definitive individual financial predictions or direct advisory statements (which might trigger safety blocks and cause mid-sentence truncation). 
- Instead, present the objective data, risk factors, multiple perspectives (e.g. bulls vs bears), and institutional opinions in a balanced, highly educational, and analytical manner.
- Ground your analysis heavily in the stock prices, PBR/PER, and supply trends provided in the JSON data above.
- Format your output beautifully with markdown (headers, bolding, bullet points, horizontal lines) to make it visually engaging and readable.
- All responses MUST be written in Korean. Use clear terms and separate paragraphs with spaces.
`;

    // Map conversation logs to Gemini API structure
    const apiContents = updatedMessages.map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: apiContents,
      systemInstruction: {
        parts: [
          {
            text: systemInstruction
          }
        ]
      },
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 2048
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }
      ]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 오류 (코드: ${response.status}). 설정에서 API 키를 재설정해 주세요.`);
      }

      const data = await response.json();
      const modelReply = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: modelReply }] }]);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setErrorMsg(err.message || '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Floating Action Button (FAB) - Gorgeous Glassmorphic Pulsing Bubble */}
      <button 
        className={`fab-chat-bubble ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="AI 코파일럿과 대화하기"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className="chat-badge-pulse"></span>}
      </button>

      {/* 2. Slide-out Chat Panel - Clean Ink Editorial Glass Drawer */}
      <div className={`copilot-drawer ${isOpen ? 'open' : ''}`}>
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="header-title-area">
            <div className="icon-badge">
              <Bot size={20} color="white" />
            </div>
            <div>
              <h3>Portfolio Co-Pilot</h3>
              <p className="status-sub"><span className="status-dot"></span> Gemini 2.5 Flash 활성화</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowSettings(!showSettings)} title="API 키 설정">
              <Settings size={18} />
            </button>
            <button className="icon-btn" onClick={handleClearChat} title="대화 초기화">
              <Trash2 size={18} />
            </button>
            <button className="icon-btn close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Inner Container */}
        <div className="drawer-body">
          
          {/* A. Settings Overlay (API Key input) */}
          {showSettings && (
            <div className="settings-overlay">
              <div className="settings-card">
                <div className="settings-icon-wrap">
                  <Key size={24} color="var(--colors-sig-coral)" />
                </div>
                <h4>Gemini API 설정</h4>
                <p>
                  질문에 답변을 생성하기 위해 구글 **Gemini API Key**가 필요합니다. 입력된 키는 외부 서버에 절대 업로드되지 않고, 
                  오직 **사용자님의 브라우저(LocalStorage)**에만 보관됩니다.
                </p>
                <form onSubmit={handleSaveKey} className="settings-form">
                  <div className="input-group">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      className="key-input"
                    />
                  </div>
                  {errorMsg && <p className="form-error">{errorMsg}</p>}
                  <div className="settings-btn-wrap">
                    <button type="submit" className="btn-save">
                      저장하기 <ArrowRight size={14} />
                    </button>
                    {apiKey && (
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => {
                          setShowSettings(false);
                          setTempKey(apiKey);
                          setErrorMsg('');
                        }}
                      >
                        취소
                      </button>
                    )}
                  </div>
                </form>
                <span className="key-guide-text">
                  ※ API 키가 없다면 <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer">Google AI Studio</a>에서 10초 만에 무료로 발급받으실 수 있습니다.
                </span>
              </div>
            </div>
          )}

          {/* B. Message Log */}
          <div className="messages-log">
            {messages.map((msg, index) => {
              const isBot = msg.role === 'model';
              const textContent = msg.parts[0].text;
              return (
                <div key={index} className={`message-bubble-wrapper ${isBot ? 'bot-wrap' : 'user-wrap'}`}>
                  <div className="avatar-area">
                    {isBot ? <div className="bot-avatar"><Bot size={14} color="var(--colors-ink)" /></div> : <div className="user-avatar"><User size={14} color="white" /></div>}
                  </div>
                  <div className="bubble-content-area">
                    <div className="bubble-sender-name">
                      {isBot ? 'Portfolio Co-Pilot' : '나'}
                    </div>
                    {isBot ? (
                      <div 
                        className="message-bubble bot-bubble"
                        dangerouslySetInnerHTML={{ __html: formatResponseText(textContent) }}
                      />
                    ) : (
                      <div className="message-bubble user-bubble">
                        {textContent}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Loader animation */}
            {isLoading && (
              <div className="message-bubble-wrapper bot-wrap">
                <div className="avatar-area">
                  <div className="bot-avatar"><Bot size={14} color="var(--colors-ink)" /></div>
                </div>
                <div className="bubble-content-area">
                  <div className="bubble-sender-name">Portfolio Co-Pilot</div>
                  <div className="message-bubble bot-bubble typing-indicator-bubble">
                    <span className="typing-sparkle"><Sparkles size={12} className="rotating-icon" /></span>
                    <span className="dot-bounce"></span>
                    <span className="dot-bounce"></span>
                    <span className="dot-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Error notifications */}
            {errorMsg && !showSettings && (
              <div className="chat-error-toast">
                <p>⚠️ {errorMsg}</p>
                <button className="btn-fix-key" onClick={() => setShowSettings(true)}>API 설정하기</button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* C. Quick Prompt Buttons */}
          <div className="quick-prompts-area">
            <span className="quick-title">💡 자주 묻는 추천 질문</span>
            <div className="quick-buttons-row">
              <button 
                onClick={() => handleQuickPrompt('오늘 수급이 가장 강력하게 쏠리는 한국 종목과 그 근거를 요약해줘.')}
                className="btn-quick"
              >
                🔥 한국 수급 쏠림 종목 분석
              </button>
              <button 
                onClick={() => handleQuickPrompt('테슬라(TSLA)와 우주 혁신주(RKLB, ASTS, LUNR)들의 실시간 분석 의견을 바벨 전략 기준으로 제안해줘.')}
                className="btn-quick"
              >
                🚀 테슬라/우주 자산 분석 제언
              </button>
              <button 
                onClick={() => handleQuickPrompt('오늘 수집된 모든 리포트를 아울러 개장 전 한 줄 요약 팩트를 뽑아줘.')}
                className="btn-quick"
              >
                📰 개장 전 핵심 한 줄 브리핑
              </button>
            </div>
          </div>

          {/* D. Input Bar */}
          <div className="chat-input-bar">
            <input
              type="text"
              placeholder={apiKey ? "포트폴리오나 경제 정보에 대해 물어보세요..." : "먼저 우측 상단 ⚙️을 눌러 API 키를 등록하세요."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              disabled={!apiKey || isLoading}
              className="chat-field"
            />
            <button 
              onClick={() => sendMessage()}
              disabled={!apiKey || isLoading || !inputValue.trim()}
              className="btn-send-message"
              title="질문 전송"
            >
              <Send size={16} color="white" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
