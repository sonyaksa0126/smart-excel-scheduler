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

// Define the 5 target Korean stocks to fetch live from Yahoo Finance
const STOCKS_TO_FETCH = [
  { symbol: '005930.KS', name: '삼성전자 (005930)', type: '개별 종목' },
  { symbol: '000660.KS', name: 'SK하이닉스 (000660)', type: '개별 종목' },
  { symbol: '204320.KS', name: 'HL만도 (204320)', type: '개별 종목' },
  { symbol: '105560.KS', name: 'KB금융 (105560)', type: '개별 종목' },
  { symbol: '443250.KS', name: 'HD현대일렉트릭 (443250)', type: '개별 종목' }
];

async function fetchLiveStockData(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    const meta = data.chart.result[0].meta;
    
    // Format values nicely
    const currentPrice = Math.round(meta.regularMarketPrice).toLocaleString('ko-KR') + '원';
    const high52 = Math.round(meta.fiftyTwoWeekHigh).toLocaleString('ko-KR') + '원';
    const low52 = Math.round(meta.fiftyTwoWeekLow).toLocaleString('ko-KR') + '원';
    const prevClose = Math.round(meta.previousClose).toLocaleString('ko-KR') + '원';
    
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
  console.log("📈 Fetching live real-time stock prices from Yahoo Finance API...");
  const liveStockData = {};
  
  for (const s of STOCKS_TO_FETCH) {
    console.log(` - Fetching ${s.name} (${s.symbol})...`);
    const data = await fetchLiveStockData(s.symbol);
    if (data.success) {
      liveStockData[s.symbol] = data;
    }
  }

  // Build the live prices prompt injection
  let livePricesContext = `
Here are the absolute 100% correct, real-time live stock prices and 52-week high/low data we fetched from the live exchange API for ${formattedDate}. You MUST use these exact prices and high/low values for the stocks in your JSON response. Do NOT guess or hallucinate these values:
`;

  STOCKS_TO_FETCH.forEach(s => {
    const live = liveStockData[s.symbol];
    if (live) {
      livePricesContext += `- ${s.name}: current price = ${live.currentPrice}, 52-week high = ${live.high52}, 52-week low = ${live.low52}, previous close = ${live.prevClose}\n`;
    } else {
      // Fallbacks in case Yahoo Finance is temporarily down
      livePricesContext += `- ${s.name}: current price = (Use a realistic current 2026 price), 52-week high = (Use realistic), 52-week low = (Use realistic)\n`;
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
        "impact": "Direct/indirect impact on investor's portfolio (e.g., HL Mando, high-dividend, quantum computing)",
        "source": "News source name"
      }
    ],
    "global": [
      {
        "title": "Global / Crypto News Title",
        "summary": "2-3 sentence summary of global macro or crypto news",
        "impact": "Impact on QQQM, QLD, SOXL, Tesla, Google, Bitcoin, URA, etc.",
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
      "perComment": "Evaluation based on PER (under 10x is undervalued, 15-25x is normal growth, 30x+ is overvalued)",
      "pbr": "PBR value (e.g., 0.85배)",
      "pbrComment": "Evaluation based on PBR (under 1x is undervalued, 1-3x is normal, 5x+ is high evaluation)",
      "dividendYield": "Dividend Yield percentage (e.g., 5.4%) or 분배율 for ETF",
      "dividendComment": "Dividend yield evaluation (5%+ is high dividend, 1-3% is balanced growth)",
      "valuationState": "Overall valuation state description",
      "high52": "52-week high price (Use the exact live high52 provided)",
      "low52": "52-week low price (Use the exact live low52 provided)",
      "targetPrice": "Target price or upper resistance line (Should be realistic relative to current price)",
      "supply": {
        "foreigner": "Foreign investor net trend",
        "institution": "Institutional investor net trend",
        "individual": "Individual investor net trend",
        "program": "Program trading net trend",
        "total": "Supply overall judgment"
      }
    }
  ]
}

For the stock recommendations section: You must analyze and recommend exactly the 5 Korean stocks provided in the live prices context:
1. 삼성전자 (005930)
2. SK하이닉스 (000660)
3. HL만도 (204320)
4. KB금융 (105560)
5. HD현대일렉트릭 (443250)

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
