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

// Define the target US / Space innovation stocks to fetch live
const US_STOCKS = [
  { symbol: 'TSLA', name: 'Tesla, Inc. (TSLA)', type: '미국 주식' },
  { symbol: 'RKLB', name: 'Rocket Lab USA (RKLB)', type: '미국 주식' },
  { symbol: 'ASTS', name: 'AST SpaceMobile (ASTS)', type: '미국 주식' },
  { symbol: 'LUNR', name: 'Intuitive Machines (LUNR)', type: '미국 주식' },
  { symbol: 'ARKX', name: 'ARK Space Exploration ETF (ARKX)', type: '미국 상장 ETF' },
  { symbol: 'UFO', name: 'Procure Space ETF (UFO)', type: '미국 상장 ETF' }
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
    const fmt = (val) => {
      if (isUSD) return '$' + Number(val).toFixed(2);
      return Math.round(val).toLocaleString('ko-KR') + '원';
    };
    
    const currentPrice = fmt(meta.regularMarketPrice);
    const high52 = fmt(meta.fiftyTwoWeekHigh);
    const low52 = fmt(meta.fiftyTwoWeekLow);
    const prevClose = fmt(meta.previousClose);
    
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

async function runScraper() {
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

  // Build the live prices prompt context
  let livePricesContext = `
Here are the absolute 100% correct, real-time live stock prices and 52-week high/low data we fetched from the live exchange API for ${formattedDate}. You MUST use these exact prices and high/low values for the stocks in your JSON response. Do NOT guess or hallucinate these values:

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
You are a highly precise financial analysis AI. Your goal is to gather today's key financial news and stock quant valuations grounded in reality for the date: ${formattedDate}.
Please generate a structured JSON report. You must return ONLY a valid JSON object matching the exact schema below. No markdown wrapper, no extra text.

JSON Schema:
{
  "date": "YYYY년 MM월 DD일",
  "news": {
    "korean": [
      {
        "title": "Korean News Title",
        "summary": "2-3 sentence summary of the news",
        "impact": "Direct/indirect impact on investor's portfolio",
        "source": "News source name"
      }
    ],
    "global": [
      {
        "title": "Global / Crypto / Space News Title",
        "summary": "2-3 sentence summary of global macro, crypto, or space industry news (e.g. SpaceX, Rocket Lab, Tesla, NASA)",
        "impact": "Impact on QQQM, QLD, SOXL, Tesla, Google, Bitcoin, RKLB, ARKX",
        "source": "Global source name"
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
  ]
}

For the stock recommendations section ("stocks"): You must recommend exactly the 5 Korean stocks provided in the KOREAN PORTFOLIO context.
For the US stock recommendations section ("usStocks"): You must recommend exactly the 6 US/Space stocks provided in the US & SPACE INNOVATION PORTFOLIO context (Tesla, Rocket Lab, AST SpaceMobile, Intuitive Machines, ARK Space Exploration ETF, Procure Space ETF).

You MUST populate their "price", "high52", and "low52" fields with the EXACT values supplied in the live prices context.
Then, use your financial analysis intelligence to generate realistic and precise quant comments, valuations, supply trends, and news items for ${formattedDate}.
`;

  console.log("⚡ Calling Gemini 2.5 Flash API with live prices context...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${livePricesContext}\n\nPlease generate the daily briefing JSON using these exact live stock prices and high/low ranges.`
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
    }
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
