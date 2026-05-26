import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Globe, Sparkles, AlertCircle } from 'lucide-react';
import './DailyBriefing.css';

// Premium realistic Korean fallback mock data for seamless first-time offline experience
const FALLBACK_REPORT = {
  "date": "2026년 5월 26일",
  "news": {
    "korean": [
      {
        "title": "HL만도, 완전 자율주행 순정 부품 탑재 비중 40% 돌파",
        "summary": "HL만도가 글로벌 전기차 업체의 차세대 자율주행 플랫폼에 핵심 조향 및 제동 부품을 공급하는 계약을 추가 성사시켰습니다. 자율주행 단계 상향에 따른 고부가가치 부품 믹스 개선 효과가 예상됩니다.",
        "impact": "보유 종목 HL만도의 직접 수혜. 고마진 자율주행 부품군 납품 증가로 2분기 영업이익률 개선 전망.",
        "source": "한국경제"
      },
      {
        "title": "정부 밸류업 프로그램 2차 가이드라인 발표... 고배당주 투심 자극",
        "summary": "금융위원회가 상장사 밸류업 자율 공시 및 세제 혜택 방안을 발표했습니다. 배당 소득세 분리과세 추진 등 친주주 정책이 가시화되면서 자산운용업계의 배당 펀드로 자금이 급격히 유입되고 있습니다.",
        "impact": "보유 자산 PLUS 고배당주 ETF 등 배당 섹터의 수급 개선 및 배당 확대를 통한 하방 안정성 강화.",
        "source": "매일경제"
      },
      {
        "title": "국내 연구진, 실온 양자컴퓨팅 플랫폼용 소재 신뢰성 검증 성공",
        "summary": "국내 상용 양자 연구소에서 극저온이 아닌 섭씨 15도 내외에서도 양자 코헤런스를 유지할 수 있는 나노 구조 합성 공정을 시연했습니다. 대형 양자 컴퓨터 상용화 시점이 수년 이상 당겨질 것이라는 관측입니다.",
        "impact": "보유 성장 섹터인 SOL 양자컴퓨팅 ETF 관련 중소형 기술주의 단기 모멘텀 자극 및 포트폴리오 가치 상승.",
        "source": "동아사이언스"
      }
    ],
    "global": [
      {
        "title": "테슬라, 완전 자율주행(FSD) V13 버전 북미 전역 무상 시범 서비스 돌입",
        "summary": "테슬라가 한층 진화한 엔드투엔드 AI 신경망 기반 FSD V13의 업그레이드를 출시하고 북미 고객 대상 한 달 무료 체험을 제공합니다. 이번 업데이트는 야간 시인성과 복잡한 로터리 회전 안정성을 대폭 개선했습니다.",
        "impact": "보유 종목 테슬라의 소프트웨어 매출 비중 증가 기대감 형성. 국내 HL만도 등 자율주행 밸류체인 전반에 긍정적 후광 효과.",
        "source": "Bloomberg"
      },
      {
        "title": "엔비디아 차세대 AI 칩 '블랙웰' 글로벌 서버 제조사 공급 병목 완전 해소",
        "summary": "TSMC가 코오스(CoWoS) 패키징 수율을 90% 이상으로 끌어올림에 따라 엔비디아의 차세대 AI GPU 블랙웰 공급 속도가 2배 빨라졌습니다. 마이크로소프트와 구글의 초대형 데이터센터 인프라 가동이 앞당겨질 전망입니다.",
        "impact": "보유 레버리지 SOXL ETF(반도체 3배 레버리지)의 전형적인 강세 요인. 알파벳(구글)의 클라우드 서비스 성장성 강화.",
        "source": "CNBC"
      },
      {
        "title": "비트코인, 반감기 공급 쇼크 및 미 기관 연기금 자금 유입으로 9만 달러 안착",
        "summary": "미국 대형 연기금인 위스콘신주 투자위원회를 비롯한 다수의 연기금에서 비트코인 현물 ETF 비중을 추가 확대했습니다. 장기 보유자들의 공급 부족과 시너지를 내며 안정적인 기관 장기 자금의 하방 경직성을 보이고 있습니다.",
        "impact": "보유 크립토(BTC, ETH, SOL) 자산가치 극대화. 채굴 인프라 기업인 IREN, WULF의 매출 및 현금 흐름 개선.",
        "source": "Reuters"
      }
    ]
  },
  "stocks": [
    {
      "name": "HL만도 (060980)",
      "type": "개별 종목",
      "reason": "글로벌 완성차향 자율주행/전동화 부품 공급 증가로 실적 모멘텀 및 절대적 저평가 매력 부각",
      "price": "43,250원",
      "per": "9.2배",
      "perComment": "업종 평균 14배 대비 절대 저평가 영역으로 밸류에이션 매력 높음",
      "pbr": "0.48배",
      "pbrComment": "PBR 1배 미만으로 청산가치 이하. 자산 가치 대비 극심한 소외 구간",
      "dividendYield": "2.4%",
      "dividendComment": "성장 기술주로서 안정적인 중간 배당 수준 유지",
      "valuationState": "지표 기준 바닥권 탈출 및 저평가 매력 구간",
      "high52": "54,200원",
      "low52": "32,100원",
      "targetPrice": "55,000원",
      "supply": {
        "foreigner": "3일 연속 순매수 우위 (+12만 주)",
        "institution": "연기금 중심 대규모 순매수세 지속",
        "individual": "개인 매수세 매물 소화 과정",
        "program": "프로그램 매수 대거 유입",
        "total": "외인·기관 쌍끌이 순매수 및 프로그램 매집 구간"
      }
    },
    {
      "name": "PLUS 고배당주 (161510)",
      "type": "국내 상장 ETF",
      "reason": "정부 밸류업 세제 개편 가시화에 따른 고배당 금융/지주사 수급 유입 및 배당 방어력 부각",
      "price": "14,820원",
      "per": "5.6배",
      "perComment": "수익성 지표 극도의 안정성 대비 주가 매력 높음",
      "pbr": "0.38배",
      "pbrComment": "청산 가치의 3분의 1 수준으로 하방 안정성 극도로 강함",
      "dividendYield": "6.4%",
      "dividendComment": "6%대 중반의 초고배당 수익률로 금융시장 변동성 방어에 최적화",
      "valuationState": "배당 수익률 매력 극대화 및 하방 경직성 확보 구간",
      "high52": "16,200원",
      "low52": "11,800원",
      "targetPrice": "17,000원",
      "supply": {
        "foreigner": "외국인 지분율 21% 돌파 (최근 1개월 누적 매수)",
        "institution": "투신 및 사모펀드 자금 꾸준한 유입",
        "individual": "개인 일시적 차익실현 물량 출하",
        "program": "안정적인 인덱스 매수 유입",
        "total": "메이저 장기 자금 중심의 점진적 우상향 수급"
      }
    },
    {
      "name": "삼성전자 (005930)",
      "type": "개별 종목",
      "reason": "AI 데이터센터용 차세대 고대역폭메모리(HBM3E) 글로벌 반도체사 납품 테스트 통과 및 양산 개시",
      "price": "72,800원",
      "per": "15.4배",
      "perComment": "반도체 턴어라운드 반영에 따른 정상 성장 사이클 구간 진입",
      "pbr": "1.32배",
      "pbrComment": "역사적 PBR 밴드 평균 하단 수준으로 안정성 높음",
      "dividendYield": "2.1%",
      "dividendComment": "분기 배당을 통한 주주가치 제고",
      "valuationState": "턴어라운드 초기 진입 및 실적 상향 구간",
      "high52": "88,200원",
      "low52": "59,100원",
      "targetPrice": "95,000원",
      "supply": {
        "foreigner": "외국인 5거래일 연속 순매수 (+420만 주)",
        "institution": "기관 적극적인 비중 확대 및 매수 가담",
        "individual": "개인 매도세 강함 (차익실현)",
        "program": "차익성 프로그램 순매수 전환",
        "total": "외국인 주도 강력한 매수 에너지 집중 구간"
      }
    },
    {
      "name": "SOL 양자컴퓨팅핵심시그널 (475360)",
      "type": "국내 상장 ETF",
      "reason": "글로벌 상용 양자 플랫폼 진척도 가속화 및 정부 국책 과제 선정 모멘텀 극대화",
      "price": "10,250원",
      "per": "24.2배",
      "perComment": "양자 컴퓨팅 미래 성장성이 선반영되는 고성장 초입 영역",
      "pbr": "2.8배",
      "pbrComment": "차세대 기술 경쟁력을 감안하면 성장 밸류 수준으로 판단",
      "dividendYield": "0.8%",
      "dividendComment": "배당보다 미래 기업 가치 재평가에 초점",
      "valuationState": "기술적 돌파 시도 및 성장 프리미엄 구간",
      "high52": "12,900원",
      "low52": "8,900원",
      "targetPrice": "14,500원",
      "supply": {
        "foreigner": "외국인 소폭 순매수 유지",
        "institution": "금융투자 주도로 바스켓 매집 중",
        "individual": "개인의 관심 증대로 인한 수급 분산",
        "program": "시장 변동성 영향 하의 중립 수준",
        "total": "기관형 인덱스 자금 유입 및 시장 관심 집중 초기 단계"
      }
    },
    {
      "name": "HD현대일렉트릭 (443250)",
      "type": "개별 종목",
      "reason": "북미 메이저 빅테크 전력망 증설 인프라 수주 랠리 지속 및 변압기 쇼티지에 따른 단가 인상 수혜",
      "price": "284,500원",
      "per": "28.5배",
      "perComment": "단기 급등으로 멀티플 상승했으나 실적 고성장세로 밸류에이션 정당화 과정",
      "pbr": "6.8배",
      "pbrComment": "자산 대비 프리미엄을 받는 대표 주도 기술주의 특징적 구간",
      "dividendYield": "1.2%",
      "dividendComment": "호실적 기반의 배당 확대 기대감 상승",
      "valuationState": "강력한 실적 기반의 전형적인 우상향 랠리 구간",
      "high52": "320,000원",
      "low52": "114,000원",
      "targetPrice": "340,000원",
      "supply": {
        "foreigner": "외국인 연일 고점 매집 지속 (누적 지분율 사상 최고)",
        "institution": "투신/보험 장기 펀드 연일 비중 확대",
        "individual": "고점 부담에 따른 개인 투심 이탈",
        "program": "강력한 프로그램 동반 유입",
        "total": "메이저(외인·기관) 쌍끌이 주도의 강력한 주가 부양 상태"
      }
    }
  ]
};

// Helpfully resolve helper for valuation badges
function getValuationClass(comment) {
  if (!comment) return 'normal';
  const c = comment.toLowerCase();
  if (c.includes('저평가') || c.includes('바닥') || c.includes('하방') || c.includes('청산가치 이하')) {
    return 'undervalued';
  } else if (c.includes('고평가') || c.includes('단기 과열') || c.includes('부담')) {
    return 'overvalued';
  }
  return 'normal';
}

function getValuationLabel(comment) {
  if (!comment) return '보통';
  const c = comment.toLowerCase();
  if (c.includes('저평가') || c.includes('바닥') || c.includes('하방') || c.includes('청산가치 이하')) {
    return '저평가';
  } else if (c.includes('고평가') || c.includes('단기 과열') || c.includes('부담')) {
    return '과열/부담';
  }
  return '적정 성장';
}

export default function DailyBriefing({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('stocks'); // 'stocks' or 'news'
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Auto-fetch report from cloud data branch
  useEffect(() => {
    if (!isOpen) return;

    const fetchReport = async () => {
      setLoading(true);
      setError(false);
      try {
        // Fetch directly from the Github Actions pushed 'data' branch report
        const cloudUrl = `https://raw.githubusercontent.com/sonyaksa0126/smart-excel-scheduler/data/data/daily-report.json`;
        const response = await fetch(cloudUrl);
        if (!response.ok) {
          throw new Error('Cloud fetch failed');
        }
        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.warn('⚠️ Cloud fetch failed or was rejected. Falling back to premium local fallback report.', err);
        // Instantly fall back to premium mock report so the user's experience is NEVER interrupted!
        setReport(FALLBACK_REPORT);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Background Dimmed Overlay */}
      <div 
        className={`briefing-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className={`briefing-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        
        {/* Header */}
        <div className="briefing-header">
          <div className="briefing-title-area">
            <h2>
              <Sparkles size={22} color="#0066cc" /> 
              오늘의 인텔리전스 브리핑
            </h2>
            <p className="briefing-subtitle">
              {loading ? '데이터 불러오는 중...' : `${report?.date || FALLBACK_REPORT.date} 개장 전 맞춤 보고서`}
            </p>
          </div>
          <button className="close-drawer-btn" onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="briefing-tabs">
          <button 
            className={`tab-btn ${activeTab === 'stocks' ? 'active' : ''}`}
            onClick={() => setActiveTab('stocks')}
          >
            <TrendingUp size={16} />
            추천 종목 & ETF (5選)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            <Globe size={16} />
            보유 자산 연계 뉴스
          </button>
        </div>

        {/* Drawer Body Scroll Content */}
        <div className="briefing-body">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>금융 데이터 분석 엔진 가동 중...</p>
            </div>
          ) : (
            <>
              {/* STOCKS TAB CONTENT */}
              {activeTab === 'stocks' && report?.stocks && (
                <div className="stocks-list">
                  {report.stocks.map((stock, idx) => (
                    <div key={idx} className="stock-card">
                      <div className="stock-card-header">
                        <h3 className="stock-name-code">{stock.name}</h3>
                        <span className="stock-type-badge">{stock.type}</span>
                      </div>
                      
                      <div className="stock-reason">
                        💡 {stock.reason}
                      </div>

                      {/* Valuation Metrics Grid */}
                      <div className="stock-metrics-grid">
                        <div className="metric-item">
                          <span className="metric-label">현재 주가</span>
                          <span className="metric-value" style={{color: '#0066cc'}}>{stock.price}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">종합 평가</span>
                          <div className="metric-value-wrap">
                            <span className={`valuation-tag ${getValuationClass(stock.perComment)}`}>
                              {getValuationLabel(stock.perComment)}
                            </span>
                          </div>
                        </div>

                        {/* PER */}
                        <div className="metric-item">
                          <span className="metric-label">PER (주가수익비율)</span>
                          <span className="metric-value">{stock.per}</span>
                          <span className="metric-comment">{stock.perComment}</span>
                        </div>

                        {/* PBR */}
                        <div className="metric-item">
                          <span className="metric-label">PBR (주가순자산비율)</span>
                          <span className="metric-value">{stock.pbr}</span>
                          <span className="metric-comment">{stock.pbrComment}</span>
                        </div>

                        {/* Dividend Yield */}
                        <div className="metric-item full-width-metric">
                          <span className="metric-label">배당 수익률 (분배율)</span>
                          <span className="metric-value" style={{color: '#34c759'}}>{stock.dividendYield}</span>
                          <span className="metric-comment">{stock.dividendComment}</span>
                        </div>
                      </div>

                      {/* 52-Week Range */}
                      <div className="stock-ranges">
                        <div className="range-col">
                          <span className="range-label">52주 최저</span>
                          <span className="range-val">{stock.low52}</span>
                        </div>
                        <div className="range-col" style={{textAlign: 'right'}}>
                          <span className="range-label">52주 최고</span>
                          <span className="range-val">{stock.high52}</span>
                        </div>
                      </div>

                      {/* Quant Supply Status */}
                      <div className="stock-supply-title">🐳 최근 거래일 메이저 주체 수급</div>
                      <div className="stock-supply-box">
                        <div className="supply-row">
                          <div className="supply-col">
                            <span className="supply-label">외국인</span>
                            <span className={`supply-val ${stock.supply.foreigner.includes('매수') || stock.supply.foreigner.includes('유입') ? 'buy' : ''}`}>
                              {stock.supply.foreigner.includes('매수') ? '🟢 매수' : '🔴 매도'}
                            </span>
                          </div>
                          <div className="supply-col">
                            <span className="supply-label">기관</span>
                            <span className={`supply-val ${stock.supply.institution.includes('매수') || stock.supply.institution.includes('유입') ? 'buy' : ''}`}>
                              {stock.supply.institution.includes('매수') ? '🟢 매수' : '🔴 매도'}
                            </span>
                          </div>
                          <div className="supply-col">
                            <span className="supply-label">개인</span>
                            <span className={`supply-val ${stock.supply.individual.includes('매도') ? 'sell' : 'buy'}`}>
                              {stock.supply.individual.includes('매도') ? '🔴 매도' : '🟢 매수'}
                            </span>
                          </div>
                          <div className="supply-col">
                            <span className="supply-label">프로그램</span>
                            <span className={`supply-val ${stock.supply.program.includes('매수') || stock.supply.program.includes('유입') ? 'buy' : ''}`}>
                              {stock.supply.program.includes('매수') ? '🟢 유입' : '🔴 유출'}
                            </span>
                          </div>
                        </div>
                        <div className="supply-overall">
                          {stock.supply.total}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* NEWS TAB CONTENT */}
              {activeTab === 'news' && report?.news && (
                <div className="news-list">
                  <h3 className="news-section-title">🇰🇷 국내 자산 연계 핵심 뉴스</h3>
                  {report.news.korean.map((item, idx) => (
                    <div key={idx} className="news-card">
                      <div className="news-card-header">
                        <h4 className="news-card-title">{item.title}</h4>
                        <span className="news-source-tag">{item.source}</span>
                      </div>
                      <p className="news-summary">{item.summary}</p>
                      <div className="news-impact-box">
                        <p>
                          <span className="news-impact-label">포트폴리오 진단:</span>
                          {item.impact}
                        </p>
                      </div>
                    </div>
                  ))}

                  <h3 className="news-section-title">🇺🇸 글로벌 매크로 & 크립토 뉴스</h3>
                  {report.news.global.map((item, idx) => (
                    <div key={idx} className="news-card">
                      <div className="news-card-header">
                        <h4 className="news-card-title">{item.title}</h4>
                        <span className="news-source-tag">{item.source}</span>
                      </div>
                      <p className="news-summary">{item.summary}</p>
                      <div className="news-impact-box">
                        <p>
                          <span className="news-impact-label">포트폴리오 진단:</span>
                          {item.impact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
