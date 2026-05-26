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
      "price": "Current price in KRW (e.g., 54,200원)",
      "per": "PER value (e.g., 8.4배)",
      "perComment": "Evaluation based on PER (under 10x is undervalued, 15-25x is normal growth, 30x+ is overvalued)",
      "pbr": "PBR value (e.g., 0.85배)",
      "pbrComment": "Evaluation based on PBR (under 1x is undervalued, 1-3x is normal, 5x+ is high evaluation)",
      "dividendYield": "Dividend Yield percentage (e.g., 5.4%) or 분배율 for ETF",
      "dividendComment": "Dividend yield evaluation (5%+ is high dividend, 1-3% is balanced growth)",
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
  ]
}

Ensure to recommend exactly 5 highly relevant Korean stocks or domestic ETFs matching the user's barbell portfolio strategy (e.g., growth technology like semiconductors, AI, autonomous driving, quantum computing, or stable assets like high-dividend yields, index ETFs).
Use the latest realistic market conditions and news for ${formattedDate}.
`;

async function fetchBriefing() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Please generate the daily briefing for ${formattedDate} following your core system instructions. Focus on providing realistic data.`
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
      temperature: 0.2
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
    console.log(`✅ Success! Report saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Error fetching daily briefing from Gemini API:", error);
    process.exit(1);
  }
}

fetchBriefing();
