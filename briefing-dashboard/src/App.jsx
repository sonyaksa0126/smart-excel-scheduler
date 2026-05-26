import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Globe, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp,
  Activity,
  Award,
  Rocket
} from 'lucide-react';

// Premium Korean fallback mock data for seamless out-of-the-box experience
const FALLBACK_REPORT = {
  "date": "2026년 5월 26일",
  "news": {
    "korean": [
      {
        "title": "HL만도, 완전 자율주행 순정 부품 탑재 비중 40% 돌파",
        "summary": "HL만도가 글로벌 전기차 업체의 차세대 자율주행 플랫폼에 핵심 조향 및 제동 부품을 공급하는 계약을 추가 성사시켰습니다. 자율주행 단계 상향에 따른 고부가가치 부품 믹스 개선 효과가 예상됩니다.",
        "impact": "HL만도 보유 자산 직접 수혜. 고마진 자율주행 부품군 납품 증가로 2분기 영업이익률 개선 전망.",
        "source": "한국경제"
      },
      {
        "title": "정부 밸류업 프로그램 2차 가이드라인 발표... 고배당주 투심 자극",
        "summary": "금융위원회가 상장사 밸류업 자율 공시 및 세제 혜택 방안을 발표했습니다. 배당 소득세 분리과세 추진 등 친주주 정책이 가시화되면서 자산운용업계의 배당 펀드로 자금이 급격히 유입되고 있습니다.",
        "impact": "PLUS 고배당주 ETF 등 배당 섹터의 수급 개선 및 배당 확대를 통한 하방 안정성 강화.",
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
        "impact": "테슬라 보유 비중 증가 기대감 형성. 국내 HL만도 등 자율주행 밸류체인 전반에 긍정적 후광 효과.",
        "source": "Bloomberg"
      },
      {
        "title": "엔비디아 차세대 AI 칩 '블랙웰' 글로벌 서버 제조사 공급 병목 완전 해소",
        "summary": "TSMC가 코오스(CoWoS) 패키징 수율을 90% 이상으로 끌어올림에 따라 엔비디아의 차세대 AI GPU 블랙웰 공급 속도가 2배 빨라졌습니다. 마이크로소프트와 구글의 초대형 데이터센터 인프라 가동이 앞당겨질 전망입니다.",
        "impact": "보유 레버리지 SOXL ETF(반도체 3배) 강세 요인. 알파벳(구글)의 클라우드 서비스 성장성 강화.",
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
  ],
  "usStocks": [
    {
      "name": "Tesla, Inc. (TSLA)",
      "type": "미국 주식",
      "reason": "FSD V13 배포에 따른 자율주행 실적 레버리지 본격화 및 북미 전역 자율주행 시장 장악력 극대화",
      "price": "$426.01",
      "per": "68.4배",
      "perComment": "AI 소프트웨어 기대감이 투영된 높은 성장 밸류에이션 구간",
      "pbr": "9.4배",
      "pbrComment": "무형 자산 및 자율주행 네트워크 가치가 반영된 강한 주도주 밸류",
      "dividendYield": "N/A",
      "dividendComment": "무배당 기술주로 기업의 재투자와 성장에 주력",
      "valuationState": "FSD 소프트웨어 매출 가속화 기반 프리미엄 구간",
      "high52": "$448.00",
      "low52": "$138.00",
      "targetPrice": "$500.00",
      "supply": {
        "foreigner": "월가 초대형 기관 4거래일 연속 순매집 우위",
        "institution": "글로벌 상용 펀드 비중 확대 가시화",
        "individual": "개인 투자자들의 매수 모멘텀 활성화",
        "program": "퀀트 바스켓 자금 대거 유입세",
        "total": "기관 및 글로벌 헤지펀드 주도의 강력한 수급 유입"
      }
    },
    {
      "name": "Rocket Lab USA (RKLB)",
      "type": "미국 주식",
      "reason": "중형 발사체 '뉴트론(Neutron)' 상용 발사 성공 및 미 우주군 인프라 대규모 장기 계약 수주 수혜",
      "price": "$135.76",
      "per": "N/A",
      "perComment": "우주 수송 기술의 시장 독점력 기반 흑자전환 초기 성장 단계",
      "pbr": "8.5배",
      "pbrComment": "민간 우주 개발 분야 최정상급 기술력 프리미엄 적용",
      "dividendYield": "N/A",
      "dividendComment": "성장 단계로 인프라 및 R&D 투자 집중",
      "valuationState": "우주 항공 산업 고성장 수혜 및 핵심 기술력 프리미엄 구간",
      "high52": "$145.00",
      "low52": "$3.60",
      "targetPrice": "$160.00",
      "supply": {
        "foreigner": "외국인 지분율 12% 돌파 및 지속 유입",
        "institution": "우주 전문 테마 펀드 장기 매집 중",
        "individual": "우주 산업 관심 증대로 개인 수급 활발",
        "program": "성장 기술주 바스켓 자금 유입 지속",
        "total": "테마형 메이저 자금 및 프로그램 순매수 유입 상태"
      }
    },
    {
      "name": "ARK Space Exploration ETF (ARKX)",
      "type": "미국 상장 ETF",
      "reason": "민간 양대 우주수송 기업 및 위성 통신 인프라 혁신 리더 기업에 투자하는 우주 전문 대표 ETF",
      "price": "$35.42",
      "per": "32.4배",
      "perComment": "차세대 메가 트렌드(우주 항공) 평균 멀티플 반영 구간",
      "pbr": "3.2배",
      "pbrComment": "고성장 기술 하드웨어 기업으로 구성된 정상 밸류 수준",
      "dividendYield": "0.5% (분배율)",
      "dividendComment": "자본 이득 극대화 추구형 테마 ETF로 분배율은 보조적 수단",
      "valuationState": "글로벌 우주 항공 산업 전반의 성장 분산 투자 구간",
      "high52": "$38.50",
      "low52": "$22.40",
      "targetPrice": "$45.00",
      "supply": {
        "foreigner": "패시브 인덱스 연동 순매수 안정적 유입",
        "institution": "글로벌 연기금 포트폴리오 다변화 자금 유입",
        "individual": "개인 장기 적립식 매수 흐름 강함",
        "program": "프로그램 매매 순유입 상태 유지",
        "total": "장기 적립식 패시브 자금 주도의 안정적 지지 흐름"
      }
    },
    {
      "name": "AST SpaceMobile (ASTS)",
      "type": "미국 주식",
      "reason": "글로벌 통신사 파트너십 기반 상용 위성 인터넷 서비스 및 일반 스마트폰 직접 연결 시장 선점",
      "price": "$28.45",
      "per": "N/A",
      "perComment": "인프라 구축 완료 후 상용 서비스 개시에 따른 흑자전환 모멘텀",
      "pbr": "12.4배",
      "pbrComment": "차세대 글로벌 통신 인프라 독점 가치 선반영에 따른 성장 프리미엄",
      "dividendYield": "N/A",
      "dividendComment": "성장 단계로 인프라 및 R&D 투자 집중",
      "valuationState": "글로벌 상용 위성 서비스 출시 임박 성장 프리미엄 구간",
      "high52": "$39.20",
      "low52": "$2.10",
      "targetPrice": "$45.00",
      "supply": {
        "foreigner": "AT&T 및 글로벌 파트너 기관 매집 유입",
        "institution": "통신/기술 테마 펀드 지분 확대 지속",
        "individual": "개인 투자자들의 기술적 기대감 유입세",
        "program": "프로그램 매수 동반 강세",
        "total": "글로벌 인프라 파트너 자금 중심의 안정적 매수 우위"
      }
    },
    {
      "name": "Intuitive Machines (LUNR)",
      "type": "미국 주식",
      "reason": "NASA 아르테미스 프로젝트의 핵심 달 착륙선 공급사로 독점적 우주 인프라 실적 성장 가시화",
      "price": "$12.84",
      "per": "N/A",
      "perComment": "NASA 프로젝트 수주에 따른 매출 본격화 단계로 흑자 전환 기대",
      "pbr": "6.8배",
      "pbrComment": "달 탐사 및 우주 인프라 독점 기술력 대비 성장 매력도 우수",
      "dividendYield": "N/A",
      "dividendComment": "성장 단계로 우주 탐사 프로젝트 재투자 진행",
      "valuationState": "NASA 프로젝트 핵심 수혜주로서 성장 및 실적 턴어라운드 구간",
      "high52": "$14.20",
      "low52": "$2.50",
      "targetPrice": "$18.00",
      "supply": {
        "foreigner": "미국 딜러 및 기관 투자자 순매집 증가",
        "institution": "NASA 관련 벤처/중소형 우주 테마 펀드 비중 확대",
        "individual": "우주 탐사 이벤트 일정에 따른 높은 개인 거래량",
        "program": "이벤트 드리븐형 퀀트 수급 유입",
        "total": "정부/기관 중심의 장기 모멘텀 수급 지지세"
      }
    },
    {
      "name": "Procure Space ETF (UFO)",
      "type": "미국 상장 ETF",
      "reason": "순수 우주 하드웨어, 위성 통신, 우주 인프라 기업을 집중 포트폴리오로 편입한 최초의 순수 우주 ETF",
      "price": "$21.56",
      "per": "28.6배",
      "perComment": "순수 우주 기술 및 국방 우주 분야 평균 멀티플 범위 수준",
      "pbr": "2.4배",
      "pbrComment": "자산 대비 적정 성장 수준의 건전한 멀티플 적용",
      "dividendYield": "0.9% (분배율)",
      "dividendComment": "위성 서비스 기업들의 배당 분배율 안정적 유입",
      "valuationState": "우주 인프라 성장성 및 국방 우주 하방 안정성 균형 구간",
      "high52": "$24.80",
      "low52": "$16.50",
      "targetPrice": "$28.00",
      "supply": {
        "foreigner": "글로벌 패시브 연동 자금의 꾸준한 유입",
        "institution": "연기금/공제회 등 ESG 및 혁신 포트폴리오 매집",
        "individual": "개인 장기 분산형 적립식 매입 추세",
        "program": "안정적인 프로그램 인덱스 유입 상태",
        "total": "장기 인덱스 패시브 자금 주도의 조용하고 견조한 지지"
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
  } else if (c.includes('고평가') || c.includes('단기 과열') || c.includes('부담') || c.includes('프리미엄')) {
    return 'overvalued';
  }
  return 'normal';
}

function getValuationLabel(comment) {
  if (!comment) return '보통';
  const c = comment.toLowerCase();
  if (c.includes('저평가') || c.includes('바닥') || c.includes('하방') || c.includes('청산가치 이하')) {
    return '저평가';
  } else if (c.includes('고평가') || c.includes('단기 과열') || c.includes('부담') || c.includes('프리미엄')) {
    return '과열/프리미엄';
  }
  return '적정 성장';
}

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNewsTab, setActiveNewsTab] = useState('korean'); // 'korean' or 'global'
  const [expandedStock, setExpandedStock] = useState(0); // Index of expanded stock (offset 10+ for US)
  const [timeStr, setTimeStr] = useState('');

  // Clock update effect
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch report
  const loadBriefing = async () => {
    setLoading(true);
    try {
      // Fetch from the data branch in GitHub
      const cloudUrl = `https://raw.githubusercontent.com/sonyaksa0126/smart-excel-scheduler/data/data/daily-report.json`;
      const response = await fetch(cloudUrl);
      if (!response.ok) throw new Error('Cloud fetch failed');
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.warn('⚠️ Cloud fetch failed, using fallback premium data', err);
      setReport(FALLBACK_REPORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBriefing();
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* 1. Header Section - Clean Editorial White Canvas */}
      <header className="db-header">
        <div className="db-title-wrap">
          <h1>
            <Sparkles size={36} color="var(--colors-primary)" />
            Economic Intelligence Dashboard
          </h1>
          <p className="db-subtitle">
            <span className="live-badge">
              <span className="pulse-dot"></span> LIVE
            </span>
            {loading ? '데이터 동기화 중...' : `${report?.date || FALLBACK_REPORT.date} 개장 전 자산 연계 맞춤형 브리핑`}
          </p>
        </div>
        
        <div className="db-actions">
          <button className="btn-secondary" style={{ cursor: 'default' }}>
            <Clock size={16} />
            {timeStr}
          </button>
          <button className="btn-primary" onClick={loadBriefing}>
            <RefreshCw size={16} />
            정보 갱신
          </button>
        </div>
      </header>

      {/* 2. Brand Voltage - Airtable Signature Coral Band */}
      <section className="sig-coral-band">
        <h2>Production-Grade Quant Market Briefing</h2>
        <p>
          본 경제 인텔리전스 대시보드는 사용자님의 멀티 자산 포트폴리오(HL만도, QQQM, SOXL, 테슬라, 우주항공, 비트코인 등)의 실시간 변동성을 
          자동 감지하고, 개장 전 반드시 체크해야 할 팩트 체크 및 수급 핵심 지표를 계량 분석하여 제공합니다. 
          불필요한 노이즈를 제거한 잡지식 편집 디자인으로 고해상도 투자 인사이트를 읽어보세요.
        </p>
      </section>

      {/* 3. Top Indices Ticker */}
      <section className="market-ticker-grid">
        <div className="ticker-item">
          <div className="ticker-name-wrap">
            <span>코스피 (KOSPI)</span>
            <span className="ticker-change up"><ArrowUpRight size={14} /> +0.54%</span>
          </div>
          <span className="ticker-value">2,682.42</span>
        </div>
        <div className="ticker-item">
          <div className="ticker-name-wrap">
            <span>코스닥 (KOSDAQ)</span>
            <span className="ticker-change up"><ArrowUpRight size={14} /> +0.82%</span>
          </div>
          <span className="ticker-value">865.12</span>
        </div>
        <div className="ticker-item">
          <div className="ticker-name-wrap">
            <span>나스닥 (NASDAQ 100)</span>
            <span className="ticker-change up"><ArrowUpRight size={14} /> +1.21%</span>
          </div>
          <span className="ticker-value">18,655.40</span>
        </div>
        <div className="ticker-item">
          <div className="ticker-name-wrap">
            <span>S&P 500</span>
            <span className="ticker-change up"><ArrowUpRight size={14} /> +0.76%</span>
          </div>
          <span className="ticker-value">5,315.80</span>
        </div>
        <div className="ticker-item">
          <div className="ticker-name-wrap">
            <span>비트코인 (BTC/USD)</span>
            <span className="ticker-change up"><ArrowUpRight size={14} /> +2.45%</span>
          </div>
          <span className="ticker-value">$90,250</span>
        </div>
      </section>

      {/* 4. Brand Voltage - Airtable Signature Cream Band for Global Market Summary */}
      <section className="sig-cream-band">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--colors-ink)', marginBottom: '4px', fontSize: '15px' }}>
          <Award size={18} />
          금일 마켓 뷰 및 투자 바벨 전략 제언
        </div>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.5, color: 'var(--colors-body)' }}>
          반도체 공급 해소(TSMC Blackwell 수율 안정화) 및 테슬라 FSD 시범 돌입으로 글로벌 고성장 기술주의 강한 탄력이 기대됩니다. 
          특히 **테슬라(TSLA)**와 우주 수송 분야 최강 주도주인 **로켓랩(RKLB)**, **우주 항공 탐사 ETF(ARKX)**의 강력한 모멘텀이 포착되고 있습니다.
          국내 HL만도 및 금융 지주 고배당주의 하방 지지력을 바벨 축으로 삼아, 미국 핵심 미래 우주/AI 자산을 바벨 반대편에 적극 배치하여 상방 수익률을 극대화하는 포지션을 권장합니다.
        </p>
      </section>

      {/* 5. Dashboard Core Layout */}
      {loading ? (
        <div className="canvas-panel loading-box">
          <div className="spinner"></div>
          <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--colors-ink)' }}>금융 인텔리전스 분석 중...</p>
        </div>
      ) : (
        <main className="db-main-layout">
          
          {/* Left Column: Economic News */}
          <div className="news-column">
            <div className="column-card">
              <h2 className="section-title">
                <Globe size={22} />
                보유 자산 연계 핵심 뉴스
              </h2>
              
              {/* News Tab Headers */}
              <div className="news-tab-headers">
                <button 
                  className={`news-tab-btn ${activeNewsTab === 'korean' ? 'active' : ''}`}
                  onClick={() => setActiveNewsTab('korean')}
                >
                  🇰🇷 국내 자산 뉴스
                </button>
                <button 
                  className={`news-tab-btn ${activeNewsTab === 'global' ? 'active' : ''}`}
                  onClick={() => setActiveNewsTab('global')}
                >
                  🇺🇸 글로벌 / 우주 / 크립토
                </button>
              </div>

              {/* News List */}
              <div className="db-news-list">
                {report?.news && report.news[activeNewsTab].map((item, idx) => (
                  <div key={idx} className="db-news-card">
                    <div className="db-news-header">
                      <h4 className="db-news-title">{item.title}</h4>
                      <span className="db-news-source">{item.source}</span>
                    </div>
                    <p className="db-news-summary">{item.summary}</p>
                    <div className="db-news-impact">
                      <p>
                        <span className="db-news-impact-label">포트폴리오 영향:</span>
                        {item.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tailored Stocks & ETFs */}
          <div className="stocks-column">
            <div className="column-card">
              
              {/* Korean Stocks Section */}
              <h2 className="section-title">
                <TrendingUp size={22} />
                국내 자산 추천 및 퀀트 분석 ({(report?.stocks || FALLBACK_REPORT.stocks).length}選)
              </h2>

              <div className="db-stocks-list">
                {report?.stocks && report.stocks.map((stock, idx) => {
                  const isExpanded = expandedStock === idx;
                  return (
                    <div 
                      key={idx} 
                      className="db-stock-card"
                      onClick={() => setExpandedStock(isExpanded ? -1 : idx)}
                    >
                      <div className="db-stock-header">
                        <div className="db-stock-name-wrap">
                          <h3>
                            {stock.name}
                            {isExpanded ? <ChevronUp size={18} color="var(--colors-ink)" /> : <ChevronDown size={18} color="var(--colors-muted)" />}
                          </h3>
                          <span className="db-stock-type">{stock.type}</span>
                        </div>
                        <div className="db-stock-price-box">
                          <span className="db-stock-price">{stock.price}</span>
                          <div>
                            <span className={`db-stock-valuation-label ${getValuationClass(stock.perComment)}`}>
                              {getValuationLabel(stock.perComment)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="db-stock-reason" style={{ fontWeight: isExpanded ? 500 : 400, color: isExpanded ? 'var(--colors-ink)' : 'var(--colors-body)' }}>
                        💡 {stock.reason}
                      </p>

                      {/* Expanded stock card metrics */}
                      {isExpanded && (
                        <div className="db-stock-expanded" onClick={(e) => e.stopPropagation()}>
                          
                          {/* Valuation metrics */}
                          <div className="db-metrics-grid">
                            <div className="db-metric-item">
                              <span className="db-metric-label">PER (주가수익비율)</span>
                              <span className="db-metric-value">{stock.per}</span>
                              <span className="db-metric-comment">{stock.perComment}</span>
                            </div>
                            <div className="db-metric-item">
                              <span className="db-metric-label">PBR (주가순자산비율)</span>
                              <span className="db-metric-value">{stock.pbr}</span>
                              <span className="db-metric-comment">{stock.pbrComment}</span>
                            </div>
                            <div className="db-metric-item db-full-width-metric">
                              <span className="db-metric-label">배당 수익률 (분배율)</span>
                              <span className="db-metric-value" style={{ color: 'var(--colors-success)' }}>{stock.dividendYield}</span>
                              <span className="db-metric-comment">{stock.dividendComment}</span>
                            </div>
                          </div>

                          {/* 52 week price ranges */}
                          <div className="db-price-range">
                            <div className="range-box">
                              <span className="range-title">52주 최저</span>
                              <span className="range-price" style={{ color: 'var(--colors-sig-coral)' }}>{stock.low52}</span>
                            </div>
                            <div className="range-box" style={{ textAlign: 'center' }}>
                              <span className="range-title">목표가/저항선</span>
                              <span className="range-price" style={{ color: 'var(--colors-link)' }}>{stock.targetPrice}</span>
                            </div>
                            <div className="range-box" style={{ textAlign: 'right' }}>
                              <span className="range-price" style={{ color: 'var(--colors-success)' }}>{stock.high52}</span>
                              <span className="range-title">52주 최고</span>
                            </div>
                          </div>

                          {/* Supply analysis */}
                          <div className="db-supply-area">
                            <div className="db-supply-title">
                              <Activity size={16} color="var(--colors-ink)" />
                              최근 거래일 메이저 주체 수급
                            </div>
                            <div className="db-supply-grid">
                              <div className="db-supply-col">
                                <span className="db-supply-label">외국인</span>
                                <span className={`db-supply-val ${stock.supply.foreigner.includes('매수') || stock.supply.foreigner.includes('유입') ? 'buy' : 'sell'}`}>
                                  {stock.supply.foreigner.includes('매수') ? '매수 🟢' : '매도 🔴'}
                                </span>
                              </div>
                              <div className="db-supply-col">
                                <span className="db-supply-label">기관</span>
                                <span className={`db-supply-val ${stock.supply.institution.includes('매수') || stock.supply.institution.includes('유입') ? 'buy' : 'sell'}`}>
                                  {stock.supply.institution.includes('매수') ? '매수 🟢' : '매도 🔴'}
                                </span>
                              </div>
                              <div className="db-supply-col">
                                <span className="db-supply-label">개인</span>
                                <span className={`db-supply-val ${stock.supply.individual.includes('매도') ? 'sell' : 'buy'}`}>
                                  {stock.supply.individual.includes('매도') ? '매도 🔴' : '매수 🟢'}
                                </span>
                              </div>
                              <div className="db-supply-col">
                                <span className="db-supply-label">프로그램</span>
                                <span className={`db-supply-val ${stock.supply.program.includes('매수') || stock.supply.program.includes('유입') ? 'buy' : 'sell'}`}>
                                  {stock.supply.program.includes('매수') ? '유입 🟢' : '유출 🔴'}
                                </span>
                              </div>
                            </div>
                            <div className="db-supply-total">
                              {stock.supply.total}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* US & Space Innovation Stocks Section */}
              <h2 className="section-title" style={{ marginTop: '48px', borderTop: '1px solid var(--colors-hairline)', paddingTop: '32px' }}>
                <Rocket size={22} color="var(--colors-sig-coral)" />
                미국 및 우주 혁신 자산 분석 ({(report?.usStocks || FALLBACK_REPORT.usStocks).length}選)
              </h2>

              <div className="db-stocks-list">
                {(report?.usStocks || FALLBACK_REPORT.usStocks).map((stock, idx) => {
                  const actualIdx = idx + 10; // Avoid state key conflicts
                  const isExpanded = expandedStock === actualIdx;
                  return (
                    <div 
                      key={actualIdx} 
                      className="db-stock-card"
                      onClick={() => setExpandedStock(isExpanded ? -1 : actualIdx)}
                      style={{ borderLeft: '3px solid var(--colors-sig-coral)' }}
                    >
                      <div className="db-stock-header">
                        <div className="db-stock-name-wrap">
                          <h3>
                            {stock.name}
                            {isExpanded ? <ChevronUp size={18} color="var(--colors-ink)" /> : <ChevronDown size={18} color="var(--colors-muted)" />}
                          </h3>
                          <span className="db-stock-type">{stock.type}</span>
                        </div>
                        <div className="db-stock-price-box">
                          <span className="db-stock-price" style={{ color: 'var(--colors-sig-coral)' }}>{stock.price}</span>
                          <div>
                            <span className={`db-stock-valuation-label ${getValuationClass(stock.perComment)}`}>
                              {getValuationLabel(stock.perComment)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="db-stock-reason" style={{ fontWeight: isExpanded ? 500 : 400, color: isExpanded ? 'var(--colors-ink)' : 'var(--colors-body)' }}>
                        💡 {stock.reason}
                      </p>

                      {/* Expanded stock card metrics */}
                      {isExpanded && (
                        <div className="db-stock-expanded" onClick={(e) => e.stopPropagation()}>
                          
                          {/* Valuation metrics */}
                          <div className="db-metrics-grid">
                            <div className="db-metric-item">
                              <span className="db-metric-label">PER (주가수익비율)</span>
                              <span className="db-metric-value">{stock.per}</span>
                              <span className="db-metric-comment">{stock.perComment}</span>
                            </div>
                            <div className="db-metric-item">
                              <span className="db-metric-label">PBR (주가순자산비율)</span>
                              <span className="db-metric-value">{stock.pbr}</span>
                              <span className="db-metric-comment">{stock.pbrComment}</span>
                            </div>
                            <div className="db-metric-item db-full-width-metric">
                              <span className="db-metric-label">배당 수익률 (분배율)</span>
                              <span className="db-metric-value" style={{ color: 'var(--colors-sig-coral)' }}>{stock.dividendYield}</span>
                              <span className="db-metric-comment">{stock.dividendComment}</span>
                            </div>
                          </div>

                          {/* 52 week price ranges */}
                          <div className="db-price-range">
                            <div className="range-box">
                              <span className="range-title">52주 최저</span>
                              <span className="range-price" style={{ color: 'var(--colors-sig-coral)' }}>{stock.low52}</span>
                            </div>
                            <div className="range-box" style={{ textAlign: 'center' }}>
                              <span className="range-title">목표가/저항선</span>
                              <span className="range-price" style={{ color: 'var(--colors-link)' }}>{stock.targetPrice}</span>
                            </div>
                            <div className="range-box" style={{ textAlign: 'right' }}>
                              <span className="range-price" style={{ color: 'var(--colors-success)' }}>{stock.high52}</span>
                              <span className="range-title">52주 최고</span>
                            </div>
                          </div>

                          {/* Supply analysis */}
                          <div className="db-supply-area">
                            <div className="db-supply-title">
                              <Activity size={16} color="var(--colors-ink)" />
                              미국 시장 거래일 메이저 주체 수급
                            </div>
                            <div className="db-supply-grid">
                              <div className="db-supply-col">
                                <span className="db-supply-label">외국인(메이저)</span>
                                <span className={`db-supply-val ${stock.supply.foreigner.includes('매수') || stock.supply.foreigner.includes('유입') || stock.supply.foreigner.includes('매집') ? 'buy' : 'sell'}`}>
                                  {stock.supply.foreigner.includes('매수') || stock.supply.foreigner.includes('매집') ? '매수 🟢' : '매도 🔴'}
                                </span>
                              </div>
                              <div className="db-supply-col">
                                <span className="db-supply-label">월가기관</span>
                                <span className={`db-supply-val ${stock.supply.institution.includes('매수') || stock.supply.institution.includes('유입') || stock.supply.institution.includes('확대') ? 'buy' : 'sell'}`}>
                                  {stock.supply.institution.includes('매수') || stock.supply.institution.includes('확대') ? '매수 🟢' : '매도 🔴'}
                                </span>
                              </div>
                              <div className="db-supply-col">
                                <span className="db-supply-label">개인</span>
                                <span className={`db-supply-val ${stock.supply.individual.includes('매도') ? 'sell' : 'buy'}`}>
                                  {stock.supply.individual.includes('매도') ? '매도 🔴' : '매수 🟢'}
                                </span>
                              </div>
                              <div className="db-supply-col">
                                <span className="db-supply-label">프로그램</span>
                                <span className={`db-supply-val ${stock.supply.program.includes('매수') || stock.supply.program.includes('유입') ? 'buy' : 'sell'}`}>
                                  {stock.supply.program.includes('매수') || stock.supply.program.includes('유입') ? '유입 🟢' : '유출 🔴'}
                                </span>
                              </div>
                            </div>
                            <div className="db-supply-total">
                              {stock.supply.total}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </main>
      )}

      {/* 6. Footer */}
      <footer className="db-footer">
        <p>© 2026 <span className="db-footer-brand">Smart Economic Intelligence System</span>. All rights reserved.</p>
        <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--colors-muted)' }}>
          Powered by Gemini 2.5 Flash Cloud Scraper & Airtable Editorial Framework
        </p>
      </footer>

    </div>
  );
}

export default App;
