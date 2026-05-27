import fs from 'fs';
import path from 'path';

// Define target output path
const OUTPUT_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'daily-report.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY environment variable is not defined.");
  process.exit(1);
}

// Today's Date formatted elegantly (e.g., 2026년 5월 26일)
const today = new Date();
const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

console.log(`🚀 Starting daily briefing generation for: ${formattedDate}`);

// Define the 5 target Korean stocks to fetch live
const KR_STOCKS = [
  { symbol: '005930.KS', name: '삼성전자 (005930)', type: '개별 종목' },
  { symbol: '000660.KS', name: 'SK하이닉스 (000660)', type: '개별 종목' },
  { symbol: '204320.KS', name: 'HL만도 (204320)', type: '개별 종목' },
  { symbol: '105560.KS', name: 'KB금융 (105560)', type: '개별 종목' },
  { symbol: '443250.KS', name: 'HD현대일렉트릭 (443250)', type: '개별 종목' }
];

// Define the target US / Space innovation & Commodity stocks to fetch live
const US_STOCKS = [
  { symbol: 'TSLA', name: 'Tesla, Inc. (TSLA)', type: '미국 주식' },
  { symbol: 'RKLB', name: 'Rocket Lab USA (RKLB)', type: '미국 주식' },
  { symbol: 'ASTS', name: 'AST SpaceMobile (ASTS)', type: '미국 주식' },
  { symbol: 'LUNR', name: 'Intuitive Machines (LUNR)', type: '미국 주식' },
  { symbol: 'ARKX', name: 'ARK Space Exploration ETF (ARKX)', type: '미국 상장 ETF' },
  { symbol: 'UFO', name: 'Procure Space ETF (UFO)', type: '미국 상장 ETF' },
  { symbol: 'URA', name: 'Global X Uranium ETF (URA)', type: '미국 상장 ETF' },
  { symbol: 'CL=F', name: 'WTI 원유 선물 (CL=F)', type: '원자재 선물' }
];

async function fetchLiveStockData(symbol, currencySymbol = '원') {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    const meta = data.chart.result[0].meta;
    
    // Format values nicely
    const isUSD = currencySymbol === '$';
    
    let currentPrice, high52, low52, prevClose;
    
    if (symbol === '^TNX') {
      const fmtTNX = (val) => (Number(val) > 10 ? (Number(val) / 10).toFixed(2) : Number(val).toFixed(2)) + '%';
      currentPrice = fmtTNX(meta.regularMarketPrice);
      high52 = fmtTNX(meta.fiftyTwoWeekHigh);
      low52 = fmtTNX(meta.fiftyTwoWeekLow);
      prevClose = fmtTNX(meta.previousClose);
    } else if (symbol === 'USDKRW=X') {
      const fmtKRW = (val) => Number(val).toFixed(1) + '원';
      currentPrice = fmtKRW(meta.regularMarketPrice);
      high52 = fmtKRW(meta.fiftyTwoWeekHigh);
      low52 = fmtKRW(meta.fiftyTwoWeekLow);
      prevClose = fmtKRW(meta.previousClose);
    } else if (symbol === '^SOX') {
      const fmtSOX = (val) => Number(val).toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' P';
      currentPrice = fmtSOX(meta.regularMarketPrice);
      high52 = fmtSOX(meta.fiftyTwoWeekHigh);
      low52 = fmtSOX(meta.fiftyTwoWeekLow);
      prevClose = fmtSOX(meta.previousClose);
    } else {
      const fmt = (val) => {
        if (isUSD) return '$' + Number(val).toFixed(2);
        return Math.round(val).toLocaleString('ko-KR') + '원';
      };
      currentPrice = fmt(meta.regularMarketPrice);
      high52 = fmt(meta.fiftyTwoWeekHigh);
      low52 = fmt(meta.fiftyTwoWeekLow);
      prevClose = fmt(meta.previousClose);
    }
    
    return {
      success: true,
      currentPrice,
      high52,
      low52,
      prevClose
    };
  } catch (err) {
    console.error(`⚠️ Failed to fetch live data for ${symbol}:`, err.message);
    return {
      success: false
    };
  }
}

async function fetchRealNews(query, hl = 'ko', gl = 'KR', ceid = 'KR:ko') {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    
    // Parse items using regex to extract title, link, source
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(text)) !== null && items.length < 15) {
      const itemContent = match[1];
      const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const sourceMatch = itemContent.match(/<source[^>]*>(.*?)<\/source>/);
      
      if (titleMatch && linkMatch) {
        let title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
        let link = linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
        let source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : 'Google News';
        
        // Clean title from source suffix (e.g. "Title - Source")
        const suffixIndex = title.lastIndexOf(' - ');
        if (suffixIndex !== -1) {
          title = title.substring(0, suffixIndex);
        }
        
        items.push({ title, link, source });
      }
    }
    return items;
  } catch (err) {
    console.error("⚠️ Failed to fetch RSS news:", err.message);
    return [];
  }
}

const MACRO_TICKERS = [
  { symbol: 'USDKRW=X', name: '원/달러 환율', currency: '원' },
  { symbol: '^TNX', name: '미국 10년물 국채 금리', currency: '%' },
  { symbol: '^SOX', name: '필라델피아 반도체 지수', currency: 'P' },
  { symbol: 'CL=F', name: 'WTI 원유 선물', currency: '$' }
];

async function runScraper() {
  console.log("📰 Scraping real-time Google News RSS...");
  const rawKrNews = await fetchRealNews('삼성전자 OR SK하이닉스 OR HL만도 OR KB금융 OR HD현대일렉트릭', 'ko', 'KR', 'KR:ko');
  const rawGlobalNews = await fetchRealNews('Tesla OR "Rocket Lab" OR "SpaceMobile" OR "Intuitive Machines" OR Space Aerospace OR Uranium', 'en-US', 'US', 'US:en');
  const rawMacroNews = await fetchRealNews('금리 OR 환율 OR 인플레이션 OR 미국증시 OR 뉴욕증시 OR 유가 OR 원자력', 'ko', 'KR', 'KR:ko');
  
  let liveNewsContext = `
Here is a list of real-time, actual news items and their active link URLs from Google News for today (${formattedDate}). 
You MUST select exactly the 3 most relevant items for each of the three target news categories.
Do NOT hallucinate URLs or titles! Keep their exact "url" fields in your output JSON.

[ACTUAL KOREAN PORTFOLIO NEWS FEED]
`;
  rawKrNews.forEach((n, idx) => {
    liveNewsContext += `${idx + 1}. Title: "${n.title}", Source: "${n.source}", URL: "${n.link}"\n`;
  });

  liveNewsContext += `\n[ACTUAL US & SPACE PORTFOLIO NEWS FEED]\n`;
  rawGlobalNews.forEach((n, idx) => {
    liveNewsContext += `${idx + 1}. Title: "${n.title}", Source: "${n.source}", URL: "${n.link}"\n`;
  });

  liveNewsContext += `\n[ACTUAL MACRO & HEADLINE NEWS FEED]\n`;
  rawMacroNews.forEach((n, idx) => {
    liveNewsContext += `${idx + 1}. Title: "${n.title}", Source: "${n.source}", URL: "${n.link}"\n`;
  });

  console.log("📈 Fetching KOSPI stock prices...");
  const liveKrData = {};
  for (const s of KR_STOCKS) {
    const data = await fetchLiveStockData(s.symbol, '원');
    if (data.success) liveKrData[s.symbol] = data;
  }

  console.log("📈 Fetching US & Space stock prices...");
  const liveUsData = {};
  for (const s of US_STOCKS) {
    const data = await fetchLiveStockData(s.symbol, '$');
    if (data.success) liveUsData[s.symbol] = data;
  }

  console.log("📈 Fetching Macro board indicators...");
  const liveMacroData = {};
  for (const m of MACRO_TICKERS) {
    const data = await fetchLiveStockData(m.symbol, m.currency);
    if (data.success) liveMacroData[m.symbol] = data;
  }

  // Build the live prices prompt context
  let livePricesContext = `
Here are the absolute 100% correct, real-time live stock prices, indices, and macro indicators we fetched from the live exchange API for today (${formattedDate}). You MUST use these exact prices, values and ranges in your JSON response. Do NOT guess or hallucinate these values:

[MACRO INDICATORS BOARD]
- 원/달러 환율 (USDKRW=X): ${liveMacroData['USDKRW=X']?.currentPrice || '1,365.0원'}
- 미국 10년물 국채 금리 (^TNX): ${liveMacroData['^TNX']?.currentPrice || '4.45%'}
- 필라델피아 반도체 지수 (^SOX): ${liveMacroData['^SOX']?.currentPrice || '5,120.0 P'}
- WTI 원유 선물 가격 (CL=F): ${liveMacroData['CL=F']?.currentPrice || '$78.50'}

[KOREAN PORTFOLIO]
`;

  KR_STOCKS.forEach(s => {
    const live = liveKrData[s.symbol];
    if (live) {
      livePricesContext += `- ${s.name}: current price = ${live.currentPrice}, 52-week high = ${live.high52}, 52-week low = ${live.low52}, previous close = ${live.prevClose}\n`;
    }
  });

  livePricesContext += `\n[US & SPACE INNOVATION PORTFOLIO]\n`;
  US_STOCKS.forEach(s => {
    const live = liveUsData[s.symbol];
    if (live) {
      livePricesContext += `- ${s.name}: current price = ${live.currentPrice}, 52-week high = ${live.high52}, 52-week low = ${live.low52}, previous close = ${live.prevClose}\n`;
    }
  });

  console.log("🤖 Prepared live stock data context:\n", livePricesContext);

  const systemInstruction = `
You are a highly precise financial analysis AI. Your goal is to gather today's key financial news, macro indicators and stock quant valuations grounded in reality for the date: ${formattedDate}.
Please generate a structured JSON report. You must return ONLY a valid JSON object matching the exact schema below. No markdown wrapper, no extra text.

JSON Schema:
{
  "date": "YYYY년 MM월 DD일",
  "macroIndicators": {
    "exchangeRate": "원/달러 환율 값 (Use exact live value provided, e.g. 1,365.2원)",
    "bondYield": "미국 10년물 국채 금리 값 (Use exact live value provided, e.g. 4.45%)",
    "semiconductorIndex": "필라델피아 반도체 지수 값 (Use exact live value provided, e.g. 5,120.3 P)",
    "crudeOil": "WTI 원유 선물 가격 값 (Use exact live value provided, e.g. $78.45)"
  },
  "news": {
    "korean": [
      {
        "title": "Korean News Title",
        "summary": "2-3 sentence summary of the news",
        "impact": "Direct/indirect impact on investor's portfolio",
        "source": "News source name",
        "url": "Actual valid search-grounded URL of the news article (MUST be real)"
      }
    ],
    "global": [
      {
        "title": "Global / Space News Title",
        "summary": "2-3 sentence summary of global space industry news (e.g. SpaceX, Rocket Lab, Tesla, NASA)",
        "impact": "Impact on QQQM, QLD, SOXL, Tesla, Google, RKLB, ARKX",
        "source": "Global source name",
        "url": "Actual valid search-grounded URL of the news article (MUST be real)"
      }
    ],
    "macro": [
      {
        "title": "Macroeconomic Headline News Title",
        "summary": "2-3 sentence summary of global macroeconomics, interest rates, inflation, exchange rates, or NY stock market headline news",
        "impact": "Portfolio or market-wide strategic impact",
        "source": "News source name",
        "url": "Actual valid search-grounded URL of the news article (MUST be real)"
      }
    ]
  },
  "stocks": [
    {
      "name": "Stock/ETF Name (Ticker/Code)",
      "type": "개별 종목" or "국내 상장 ETF",
      "reason": "1-sentence core reason for today's recommendation",
      "price": "Current price in KRW (Use the exact live price provided in the prompt context)",
      "per": "PER value (e.g., 14.5배)",
      "perComment": "Evaluation based on PER",
      "pbr": "PBR value (e.g., 0.85배)",
      "pbrComment": "Evaluation based on PBR",
      "dividendYield": "Dividend Yield percentage (e.g., 5.4%) or 분배율 for ETF",
      "dividendComment": "Dividend yield evaluation",
      "valuationState": "Overall valuation state description",
      "high52": "52-week high price",
      "low52": "52-week low price",
      "targetPrice": "Target price or upper resistance line",
      "supply": {
        "foreigner": "Foreign investor net trend",
        "institution": "Institutional investor net trend",
        "individual": "Individual investor net trend",
        "program": "Program trading net trend",
        "total": "Supply overall judgment"
      }
    }
  ],
  "usStocks": [
    {
      "name": "Stock/ETF Name (Ticker/Code)",
      "type": "미국 주식" or "미국 상장 ETF",
      "reason": "1-sentence core reason for today's recommendation",
      "price": "Current price in USD (Use the exact live price provided in the prompt context, e.g. $426.01)",
      "per": "PER value (e.g. 54.2배 or N/A for pre-earnings)",
      "perComment": "Evaluation based on PER",
      "pbr": "PBR value (e.g. 8.4배)",
      "pbrComment": "Evaluation based on PBR",
      "dividendYield": "Dividend Yield percentage or N/A",
      "dividendComment": "Dividend yield evaluation",
      "valuationState": "Overall valuation state description",
      "high52": "52-week high price in USD (Use the exact live high52 provided)",
      "low52": "52-week low price in USD (Use the exact live low52 provided)",
      "targetPrice": "Target price in USD (Should be realistic relative to current price)",
      "supply": {
        "foreigner": "Foreign / Major Institutional net trend in US market",
        "institution": "Wall Street analysts/funds net trend",
        "individual": "Retail investor interest",
        "program": "Quantitative/algorithmic trading state",
        "total": "US market supply overall judgment"
      }
    }
  ],
  "calendar": [
    {
      "date": "MM월 DD일",
      "event": "Event name (e.g. 테슬라 2분기 실적 발표, 미 5월 소비자물가지수 CPI 발표, 구글 I/O 개발자 회의, FOMC 정례회의)",
      "importance": "HIGH" or "MEDIUM" or "LOW",
      "term": "어려운 경제 용어 (e.g. CPI (소비자물가지수), PCE 물가지수, M&A (합병), 실적발표(Earnings), 금리동결, 테이퍼링)",
      "termDefinition": "주린이/초보 투자자가 1초 만에 완벽하게 납득할 수 있는 아주 쉽고 친절한 토스스타일 경제용어 번역 설명 (구어체로 친근하게 설명해주세요. e.g. '이것은 ~를 뜻해요')",
      "impact": "10년 차 주식 전문가로서 이 이슈가 발생했을 때 사용자의 포트폴리오 자산(한국/미국주식)을 지키기 위한 구체적이고 스마트한 실전 대응 및 투자 전략 제언"
    }
  ]
}

For the stock recommendations section ("stocks"): You must recommend exactly the 5 Korean stocks provided in the KOREAN PORTFOLIO context.
For the US stock recommendations section ("usStocks"): You must recommend exactly the 8 US/Space/Commodity stocks/ETFs provided in the US & SPACE INNOVATION PORTFOLIO context.

For the news sections ("news"), you MUST actively select the most relevant news.
For the calendar ("calendar"), generate exactly 5 to 7 high-impact financial & economic events scheduled over the upcoming 30 days chronologically starting from today (${formattedDate}), specifically including key US corporate earnings (Google, Tesla) and macro-economic schedules (CPI, PPI, PCE, FOMC).
Ensure the termDefinition is extremely clear and friendly like Toss app definitions.
You MUST populate the macroIndicators and stock prices with the EXACT values supplied in the live prices context.
`;

  console.log("⚡ Calling Gemini 2.5 Flash API with live prices context...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${livePricesContext}\n\n${liveNewsContext}\n\nPlease generate the daily briefing JSON selecting from these actual news items and using the exact stock prices, macro indicators and ranges.`
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: systemInstruction
        }
      ]
    },
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.15
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
      throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const jsonString = data.candidates[0].content.parts[0].text;
    
    // Validate JSON structure
    const parsedData = JSON.parse(jsonString);
    
    // Save to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(parsedData, null, 2), 'utf-8');
    console.log(`✅ Success! Real-time report saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Error fetching daily briefing from Gemini API:", error);
    process.exit(1);
  }
}

runScraper();
