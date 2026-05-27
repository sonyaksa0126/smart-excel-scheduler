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
  Rocket,
  Calendar,
  MessageSquare,
  Home,
  Newspaper,
  BookOpen
} from 'lucide-react';
import AICopilot from './components/AICopilot';
import './components/AICopilot.css';

// Premium Korean fallback mock data for a seamless out-of-the-box experience
const FALLBACK_REPORT = {
  "date": "2026년 5월 27일",
  "macroIndicators": {
    "exchangeRate": "1,368.2원",
    "bondYield": "4.43%",
    "semiconductorIndex": "5,115.8 P",
    "crudeOil": "$78.15"
  },
  "news": {
    "korean": [
      {
        "title": "HL만도, 완전 자율주행 순정 부품 탑재 비중 40% 돌파",
        "summary": "HL만도가 글로벌 전기차 업체의 차세대 자율주행 플랫폼에 핵심 조향 및 제동 부품을 공급하는 계약을 추가 성사시켰습니다. 자율주행 단계 상향에 따른 고부가가치 부품 믹스 개선 효과가 예상됩니다.",
        "impact": "HL만도 보유 자산 직접 수혜. 고마진 자율주행 부품군 납품 증가로 2분기 영업이익률 개선 전망.",
        "source": "한국경제",
        "url": "https://news.google.com"
      },
      {
        "title": "정부 밸류업 프로그램 2차 가이드라인 발표... 금융/고배당주 투심 자극",
        "summary": "금융위원회가 상장사 밸류업 자율 공시 및 세제 혜택 방안을 공식 발표했습니다. 배당 소득세 분리과세 추진 등 친주주 정책이 가시화되면서 자산운용업계의 배당 펀드로 자금이 급격히 유입되고 있습니다.",
        "impact": "KB금융 등 배당 섹터의 수급 개선 및 안정적인 주주환원 확대를 통한 하방 경직성 강화.",
        "source": "매일경제",
        "url": "https://news.google.com"
      },
      {
        "title": "삼성전자, 차세대 반도체 패키징 라인 증설 및 글로벌 빅테크 공급 협상 완료",
        "summary": "삼성전자가 첨단 HBM3E 및 2.5D 패키징 설비 투자를 전년 대비 30% 확충하며 글로벌 최대 AI 가속기 제조사와의 공급 조율을 완료했습니다. 2분기 공급 병목 해소로 실적 서프라이즈 기대감이 돕니다.",
        "impact": "삼성전자 및 반도체 소부장 밸류체인 장기 성장세 강화. 글로벌 수급 집중 유입 모멘텀 형성.",
        "source": "디지털데일리",
        "url": "https://news.google.com"
      }
    ],
    "global": [
      {
        "title": "테슬라, 완전 자율주행(FSD) V13 버전 북미 전역 무상 시범 서비스 돌입",
        "summary": "테슬라가 한층 진화한 엔드투엔드 AI 신경망 기반 FSD V13의 업그레이드를 출시하고 북미 고객 대상 한 달 무료 체험을 제공합니다. 이번 업데이트는 야간 시인성과 복잡한 로터리 회전 안정성을 대폭 개선했습니다.",
        "impact": "테슬라 보유 비중 증가 기대감 형성. 국내 HL만도 등 자율주행 밸류체인 전반에 긍정적 후광 효과.",
        "source": "Bloomberg",
        "url": "https://news.google.com"
      },
      {
        "title": "로켓랩, 뉴트론(Neutron) 대형 중형 발사체 지상 연소 시험 완벽 성공",
        "summary": "로켓랩이 독자 개발 중인 재사용 중형 발사체 '뉴트론'의 아르키메데스 엔진 종합 연소 시험에 성공했습니다. 미 국방성 우주군과의 수송 계약 확대 및 저궤도 위성망 진출의 주요 마일스톤을 달성한 것으로 파악됩니다.",
        "impact": "로켓랩(RKLB) 기술 신뢰성 입증으로 멀티플 리레이팅 촉진. 우주항공 ETF(ARKX, UFO) 자산가치 극대화.",
        "source": "SpaceNews",
        "url": "https://news.google.com"
      },
      {
        "title": "글로벌 지정학적 리스크 지속... 유가 $78선 안착 및 우라늄 공급 부족 가속화",
        "summary": "중동 전쟁 갈등 지속과 원자자 공급 차질로 국제 유가가 WTI 기준 배럴당 $78선을 유지하고 있습니다. 한편 미국의 러시아산 우라늄 수입 금지 조치 공식 발효로 공급망 다변화가 가속화되고 있습니다.",
        "impact": "WTI 원유 선물(CL=F) 및 글로벌 우라늄 ETF(URA) 장기 보유 포지션의 강한 가격 방어력 입증.",
        "source": "Reuters",
        "url": "https://news.google.com"
      }
    ],
    "macro": [
      {
        "title": "미국 4월 개인소비지출(PCE) 물가 전년비 2.6% 상승... 금리 인하 청신호",
        "summary": "미국 노동부가 발표한 4월 PCE 물가지수가 시장 예상치에 부합하는 전년 동월 대비 2.6% 상승을 기록했습니다. 인플레이션 둔화세가 이어지며 미 연준(Fed)의 9월 금리 인하 기대감이 한층 힘을 얻고 있습니다.",
        "impact": "포트폴리오 전반의 매크로 리스크 감소. 미국채 금리 하락 안정화로 기술주 중심의 강력한 멀티플 재평가 예상.",
        "source": "CNBC",
        "url": "https://news.google.com"
      },
      {
        "title": "원/달러 환율 1,360원대 박스권 움직임... 한국 반도체 수출 호조 영향",
        "summary": "원/달러 환율이 한국의 반도체 및 변압기 수출 서프라이즈에 힘입어 외국인 투자자 자금 유입이 지속되며 1,360원대에서 하향 안정 흐름을 이어가고 있습니다. 이는 국내 증시의 수급 개선 요인으로 작용하고 있습니다.",
        "impact": "삼성전자, SK하이닉스 및 HD현대일렉트릭 등 수출 중심 보유 종목들의 견조한 환차익 및 외인 순매수 지속 수혜.",
        "source": "매일경제",
        "url": "https://news.google.com"
      },
      {
        "title": "미국 10년물 국채 금리 4.4%대 횡보... 5월 FOMC 의사록 발표 대기",
        "summary": "미국 10년물 국채 금리가 연준 위원들의 매파적 발언 우려에도 불구, PCE 지표의 안정적 흐름에 힘입어 4.4%대 중반에서 단기 숨고르기에 들어갔습니다. 시장은 다가올 고용 지표 및 물가 지표에 주목하고 있습니다.",
        "impact": "금리 추가 급등 리스크 해소로 중장기 자산(KB금융) 및 레버리지 상품(SOXL)의 심리적 저점 형성 유효.",
        "source": "한국경제TV",
        "url": "https://news.google.com"
      }
    ]
  },
  "stocks": [
    {
      "name": "HL만도 (204320)",
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
      "name": "SK하이닉스 (000660)",
      "type": "개별 종목",
      "reason": "엔비디아 블랙웰 공급 본격화에 따른 HBM3E 독점적 점유율 유지 및 D램 마진 극대화",
      "price": "188,400원",
      "per": "18.2배",
      "perComment": "실적 고속 성장을 감안할 때 여전히 매력적인 선행 멀티플 영역",
      "pbr": "2.4배",
      "pbrComment": "자기자본이익률(ROE) 20% 초과 구간 대비 타당한 프리미엄 수치",
      "dividendYield": "1.1%",
      "dividendComment": "실적 연계 주주환원 공식 배당 정책 유지",
      "valuationState": "실적 성장성 기반 강한 기술적 우상향 구간",
      "high52": "210,000원",
      "low52": "112,000원",
      "targetPrice": "230,000원",
      "supply": {
        "foreigner": "외국인 최근 1개월 누적 280만 주 순매수",
        "institution": "투신 및 보험 펀드 꾸준한 지분 확대",
        "individual": "개인의 차익실현 물량 출하 진행",
        "program": "패시브 인덱스 연계 자금 대규모 유입",
        "total": "메이저 장기 자금 중심의 완벽한 수급 지지 우상향"
      }
    },
    {
      "name": "KB금융 (105560)",
      "type": "개별 종목",
      "reason": "정부 밸류업 2차 세제 혜택 가시화 및 업계 최고 수준의 분기 균등배당 및 자사주 소각 추진",
      "price": "76,800원",
      "per": "6.1배",
      "perComment": "실적 안정성 대비 극도의 저평가 영역으로 밸류업 랠리 지속 가능",
      "pbr": "0.42배",
      "pbrComment": "자산 청산 가치의 반 토막 이하 수준으로 하방 경직성 철벽 방어",
      "dividendYield": "5.8%",
      "dividendComment": "연 6%에 육박하는 고배당 및 적극적 주주환원으로 변동성 헤지 최적화",
      "valuationState": "주주 환원 강화로 인한 밸류에이션 재평가 국면",
      "high52": "84,000원",
      "low52": "48,500원",
      "targetPrice": "90,000원",
      "supply": {
        "foreigner": "외국인 지분율 61% 돌파 (사상 최고치)",
        "institution": "연기금 및 사모펀드 금융섹터 비중 확대 지속",
        "individual": "개인 일시적 매도세 지속",
        "program": "안정적인 차익거래 순유입",
        "total": "글로벌 밸류업 패시브 자금 주도의 강력한 수급 지탱"
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
    },
    {
      "name": "Global X Uranium ETF (URA)",
      "type": "미국 상장 ETF",
      "reason": "지정학적 에너지 위기에 따른 원자력 발전 르네상스 및 우라늄 공급 부족에 따른 원자재 장기 가격 상승 수혜",
      "price": "$31.42",
      "per": "24.5배",
      "perComment": "친환경 원자력 수요 급증 및 각국 정부의 우라늄 구매 계약 급증으로 타당한 밸류",
      "pbr": "2.8배",
      "pbrComment": "핵심 글로벌 우라늄 광산 기업들의 견조한 자산 가치 지탱",
      "dividendYield": "1.4% (분배율)",
      "dividendComment": "원자재 기술 ETF로 안정적 분배금 지급 정책 유지",
      "valuationState": "글로벌 전력난 해소를 위한 원전 가동 확대로 장기 성장 프리미엄 국면",
      "high52": "$34.80",
      "low52": "$21.10",
      "targetPrice": "$40.00",
      "supply": {
        "foreigner": "패시브 펀드 및 원자재 기관 자금의 유입 지속",
        "institution": "월가 주요 에너지/원자재 테마 펀드 매집 우위",
        "individual": "개인 장기 적립식 연금 자금 매수 흐름",
        "program": "인덱스 매집 연계 프로그램 매수 유입",
        "total": "글로벌 지정학적 리스크 속 기관 중심의 강력한 패시브 수급 지지"
      }
    },
    {
      "name": "WTI 원유 선물 (CL=F)",
      "type": "원자재 선물",
      "reason": "중동 지정학적 전쟁 갈등 고조 및 공급망 통제 우려에 따른 국제유가 변동성 급증 및 하방 경직성 확보",
      "price": "$78.45",
      "per": "N/A",
      "perComment": "원자재 선물 계약으로 전통 멀티플 비교 제외 영역",
      "pbr": "N/A",
      "pbrComment": "선물 시장 실물 인도 및 지정학적 리스크 가치가 핵심 가격 결정 요인",
      "dividendYield": "N/A",
      "dividendComment": "원자재 선물로 배당 없음 (가격 자본 이득에 초점)",
      "valuationState": "지정학적 전쟁 위기 고조에 따른 대표적인 안전자산/헤지 원자재 랠리 구간",
      "high52": "$89.50",
      "low52": "$68.20",
      "targetPrice": "$95.00",
      "supply": {
        "foreigner": "글로벌 메이저 투자은행(IB)의 원유 콜옵션 매수세 강화",
        "institution": "헤지펀드들의 지정학적 리스크 대비 롱 포지션 확대",
        "individual": "국제유가 레버리지/인버스 개인 단기 거래 활발",
        "program": "원자재 퀀트 알고리즘 트레이딩 매수세 우위",
        "total": "지정학적 갈등 강도에 따라 탄력적으로 상승하는 헤지성 매수 에너지 집중"
      }
    }
  ],
  "calendar": [
    {
      "date": "05월 28일",
      "event": "미국 1분기 GDP 잠정치 발표",
      "importance": "MEDIUM",
      "term": "GDP (국내총생산)",
      "termDefinition": "한 나라 영토 안에서 일어난 모든 생산 활동의 합계예요. 우리 경제 체력이 얼마나 튼튼한지 보여주는 가장 기본적인 성적표라고 보시면 돼요.",
      "impact": "미국의 경기 둔화 속도가 과도하지 않다면, '연착륙' 신호로 해석되어 기술주 상방 흐름에 탄력을 줄 것입니다."
    },
    {
      "date": "05월 29일",
      "event": "미 연준 선호 4월 개인소비지출(PCE) 물가지수 발표",
      "importance": "HIGH",
      "term": "PCE 물가지수 (개인소비지출)",
      "termDefinition": "소비자들이 진짜 많이 쓰는 품목들을 모아서 계산한 물가 지수예요. 미 연준이 금리를 올릴지 내릴지 결정할 때 CPI보다 더 중요하게 눈여겨보는 지표랍니다.",
      "impact": "인플레이션 둔화 흐름 확인 시 미국채 10년물 금리가 하락 반전하며, 보유하고 계신 테슬라(TSLA), 로켓랩(RKLB) 등 성장주의 강한 상승 트리거가 될 예정입니다."
    },
    {
      "date": "06월 12일",
      "event": "FOMC 기준금리 결정 및 점도표 발표",
      "importance": "HIGH",
      "term": "FOMC (연방공개시장위원회)",
      "termDefinition": "미국의 중앙은행인 연방준비제도(Fed)가 금리를 어떻게 할지 결정하는 정기 회의예요. 1년에 8번 열리는데, 전 세계 돈의 흐름을 쥐고 흔드는 가장 중요한 경제 이벤트랍니다.",
      "impact": "연내 2회 인하 스탠스 유지 시 시장 안도감 형성. 채권 금리 안정화로 고배당주와 기술주 동반 랠리가 가능합니다."
    },
    {
      "date": "06월 18일",
      "event": "구글(알파벳) 연례 개발자 콘퍼런스 (I/O) 개막",
      "importance": "MEDIUM",
      "term": "AI 에이전트 & 생태계",
      "termDefinition": "사람을 대신해 스스로 계획을 세우고 실행하는 똑똑한 인공지능 비서예요. 단순한 대답을 넘어 업무와 스마트폰 조작까지 대신해 주어 빅테크의 차세대 전장이 되고 있어요.",
      "impact": "구글의 신형 AI 모델 및 기기 탑재 소식 발표 시 알파벳 주가 랠리와 함께 국내 인공지능/반도체 테마(삼성전자, SK하이닉스) 수급 호재 작용."
    },
    {
      "date": "06월 24일",
      "event": "테슬라 자율주행 로보택시(Robotaxi) 공식 공개 행사",
      "importance": "HIGH",
      "term": "로보택시 (Robotaxi)",
      "termDefinition": "운전사 없이 100% 인공지능이 스스로 운전해서 승객을 실어 나르는 미래형 택시예요. 스마트폰 앱으로 호출하면 알아서 와서 태워다 주는 혁신 기술이랍니다.",
      "impact": "테슬라(TSLA) 보유 포지션의 핵심 변곡점. 자율주행 상용화 실적이 가시화되면 밸류에이션 리레이팅이 본격화되며, 국내 조향/제동 부품 독점 공급망인 HL만도(204320) 주가의 폭발적 상승 연계 가능."
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
  const [activeNewsTab, setActiveNewsTab] = useState('korean'); // 'korean', 'global', or 'macro'
  const [expandedStock, setExpandedStock] = useState(0); // Index of expanded stock (offset 10+ for US)
  const [timeStr, setTimeStr] = useState('');
  
  // Custom interactive states for desktop/mobile viewport toggle
  const [viewMode, setViewMode] = useState('web'); // 'web' or 'app'
  const [activeAppTab, setActiveAppTab] = useState('home'); // 'home', 'news', 'calendar', 'copilot'
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [expandedCalendarIndex, setExpandedCalendarIndex] = useState(-1);

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

  const activeReport = report || FALLBACK_REPORT;

  // Header content toggle component for desktop
  const renderViewModeToggle = () => (
    <div className="view-mode-toggle-group">
      <button 
        className={`toggle-btn ${viewMode === 'web' ? 'active' : ''}`}
        onClick={() => setViewMode('web')}
        title="웹 와이드 대시보드로 보기"
      >
        💻 웹 뷰
      </button>
      <button 
        className={`toggle-btn ${viewMode === 'app' ? 'active' : ''}`}
        onClick={() => setViewMode('app')}
        title="토스 스타일 스마트폰 앱 모드로 보기"
      >
        📱 앱 뷰
      </button>
    </div>
  );

  // Core Market Indices Ticker
  const renderIndicesTicker = () => (
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
  );

  // Global Macro 4 Key Indicators Board
  const renderMacroIndicatorsBoard = () => {
    const macros = activeReport.macroIndicators || FALLBACK_REPORT.macroIndicators;
    return (
      <section className="macro-board-grid">
        <div className="macro-board-card">
          <span className="macro-board-title">원/달러 환율 (USD/KRW)</span>
          <span className="macro-board-value">{macros.exchangeRate}</span>
          <span className="macro-board-comment">글로벌 무역 및 외인 수급 척도</span>
        </div>
        <div className="macro-board-card">
          <span className="macro-board-title">미 10년물 국채금리 (US 10Y)</span>
          <span className="macro-board-value">{macros.bondYield}</span>
          <span className="macro-board-comment">유동성 밸류에이션 할인율 기준</span>
        </div>
        <div className="macro-board-card">
          <span className="macro-board-title">필라델피아 반도체 지수</span>
          <span className="macro-board-value">{macros.semiconductorIndex}</span>
          <span className="macro-board-comment">보유 기술 포트폴리오 핵심 지표</span>
        </div>
        <div className="macro-board-card">
          <span className="macro-board-title">WTI 원유 선물 가격</span>
          <span className="macro-board-value">{macros.crudeOil}</span>
          <span className="macro-board-comment">지정학적 갈등 및 물가 선행지수</span>
        </div>
      </section>
    );
  };

  // Toss-style Chronological Accordion Calendar
  const renderTossEconCalendar = () => {
    const calendarData = activeReport.calendar || FALLBACK_REPORT.calendar;
    return (
      <div className="calendar-section-card">
        <h2 className="section-title">
          <Calendar size={22} color="var(--colors-sig-coral)" />
          토스 스타일 에디토리얼 증시 캘린더
        </h2>
        <p className="db-stock-reason" style={{ marginBottom: '8px', color: 'var(--colors-muted)' }}>
          향후 1달간 포트폴리오와 시장 판도를 뒤흔들 핵심 일정과, 10년 차 주/미 전문가의 실전 대응 전술을 펼쳐보세요.
        </p>

        <div className="calendar-timeline">
          {calendarData.map((item, idx) => {
            const isExpanded = expandedCalendarIndex === idx;
            const impClass = item.importance.toLowerCase();
            return (
              <div 
                key={idx} 
                className={`calendar-item-row ${isExpanded ? 'expanded' : ''}`}
              >
                {/* Header Row */}
                <div 
                  className="calendar-item-header"
                  onClick={() => setExpandedCalendarIndex(isExpanded ? -1 : idx)}
                >
                  <div className="calendar-dot-marker">
                    {idx + 1}
                  </div>
                  <div className="calendar-date-col">
                    {item.date}
                  </div>
                  <span className={`calendar-importance-badge ${impClass}`}>
                    {item.importance === 'HIGH' ? '🚨 HIGH' : item.importance === 'MEDIUM' ? '⚠️ MID' : 'LOW'}
                  </span>
                  <div className="calendar-event-title">
                    {item.event}
                  </div>
                  <div className="calendar-arrow-icon">
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* Dropdown Accordion drawer */}
                {isExpanded && (
                  <div className="calendar-drawer-content">
                    {/* Easy Term Definition Bubble */}
                    <div className="calendar-definition-box">
                      <div className="calendar-box-header">
                        <BookOpen size={14} />
                        <span>주린이를 위한 용어 돋보기</span>
                        <span className="calendar-term-badge">{item.term}</span>
                      </div>
                      <p className="calendar-definition-text">
                        {item.termDefinition}
                      </p>
                    </div>

                    {/* Expert Investment Strategy Card */}
                    <div className="calendar-strategy-box">
                      <div className="calendar-strategy-header">
                        <Award size={14} />
                        <span>10년 차 전문가 자산 수혜/전술 팁</span>
                      </div>
                      <p className="calendar-strategy-text">
                        {item.impact}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // 📱 MOBILE SMARTPHONE APP VIEW LAYOUT
  // ----------------------------------------------------
  if (viewMode === 'app') {
    return (
      <div className="phone-mockup-frame">
        <div className="phone-screen-container">
          
          {/* Simulated StatusBar */}
          <div className="phone-status-bar">
            <span className="phone-status-left">09:41</span>
            <div className="phone-status-right">
              <span style={{ fontSize: '11px' }}>5G</span>
              <Clock size={12} style={{ display: 'inline', margin: '0 2px' }} />
              <span>100%</span>
            </div>
          </div>

          {/* App Header */}
          <header className="app-header">
            <h1>
              <Sparkles size={20} color="var(--colors-sig-coral)" />
              Stock Copilot
            </h1>
            {renderViewModeToggle()}
          </header>

          {/* App body with dynamic tab navigation */}
          <div className="app-body-content">
            
            {/* Tab 1: HOME (Dashboard) */}
            {activeAppTab === 'home' && (
              <>
                <section className="sig-cream-band" style={{ marginBottom: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--colors-ink)', fontSize: '13.5px', marginBottom: '2px' }}>
                    <Award size={15} />
                    오늘의 전문가 바벨 포지션 제언
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.45, color: 'var(--colors-body)', wordBreak: 'keep-all' }}>
                    반도체 핵심 공급 우위(삼성전자, 하이닉스)와 미국 기술 자산(TSLA, RKLB)을 한 축으로 삼고, 국내 배당주(KB금융)를 헤지 축으로 잡는 스마트 바벨 포지션을 권장합니다.
                  </p>
                </section>

                {/* Index tickers */}
                {renderIndicesTicker()}

                {/* Macro Board */}
                <h3 className="section-title" style={{ fontSize: '16px', margin: '12px 0 8px 0' }}>
                  <Activity size={18} />
                  거시경제 핵심 지표 4대 천왕
                </h3>
                {renderMacroIndicatorsBoard()}

                {/* Stock lists */}
                <h3 className="section-title" style={{ fontSize: '16px', margin: '24px 0 8px 0' }}>
                  <TrendingUp size={18} />
                  포트폴리오 맞춤형 자산 분석
                </h3>
                <div className="db-stocks-list">
                  {/* Korean Stocks */}
                  {activeReport.stocks.map((stock, idx) => {
                    const isExpanded = expandedStock === idx;
                    return (
                      <div 
                        key={idx} 
                        className="db-stock-card"
                        onClick={() => setExpandedStock(isExpanded ? -1 : idx)}
                        style={{ padding: '12px' }}
                      >
                        <div className="db-stock-header" style={{ marginBottom: '6px' }}>
                          <div className="db-stock-name-wrap">
                            <h3 style={{ fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {stock.name.split(' ')[0]}
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </h3>
                            <span className="db-stock-type" style={{ fontSize: '11px' }}>{stock.type}</span>
                          </div>
                          <div className="db-stock-price-box">
                            <span className="db-stock-price" style={{ fontSize: '16px' }}>{stock.price}</span>
                          </div>
                        </div>
                        <p className="db-stock-reason" style={{ fontSize: '12.5px', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                          💡 {stock.reason}
                        </p>
                        {isExpanded && (
                          <div className="db-stock-expanded" onClick={(e) => e.stopPropagation()} style={{ marginTop: '10px', paddingTop: '10px' }}>
                            <div className="db-metrics-grid" style={{ gap: '8px' }}>
                              <div className="db-metric-item" style={{ padding: '8px' }}>
                                <span className="db-metric-label" style={{ fontSize: '10px' }}>PER</span>
                                <span className="db-metric-value" style={{ fontSize: '14px' }}>{stock.per}</span>
                                <span className="db-metric-comment" style={{ fontSize: '10.5px' }}>{stock.perComment}</span>
                              </div>
                              <div className="db-metric-item" style={{ padding: '8px' }}>
                                <span className="db-metric-label" style={{ fontSize: '10px' }}>PBR</span>
                                <span className="db-metric-value" style={{ fontSize: '14px' }}>{stock.pbr}</span>
                                <span className="db-metric-comment" style={{ fontSize: '10.5px' }}>{stock.pbrComment}</span>
                              </div>
                            </div>
                            <div className="db-supply-total" style={{ fontSize: '12px', marginTop: '8px', padding: '6px' }}>
                              {stock.supply.total}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* US Stocks */}
                  {activeReport.usStocks.map((stock, idx) => {
                    const actualIdx = idx + 10;
                    const isExpanded = expandedStock === actualIdx;
                    return (
                      <div 
                        key={actualIdx} 
                        className="db-stock-card"
                        onClick={() => setExpandedStock(isExpanded ? -1 : actualIdx)}
                        style={{ borderLeft: '3px solid var(--colors-sig-coral)', padding: '12px' }}
                      >
                        <div className="db-stock-header" style={{ marginBottom: '6px' }}>
                          <div className="db-stock-name-wrap">
                            <h3 style={{ fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {stock.name.split(',')[0].split(' ')[0]}
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </h3>
                            <span className="db-stock-type" style={{ fontSize: '11px' }}>{stock.type}</span>
                          </div>
                          <div className="db-stock-price-box">
                            <span className="db-stock-price" style={{ fontSize: '16px', color: 'var(--colors-sig-coral)' }}>{stock.price}</span>
                          </div>
                        </div>
                        <p className="db-stock-reason" style={{ fontSize: '12.5px', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                          💡 {stock.reason}
                        </p>
                        {isExpanded && (
                          <div className="db-stock-expanded" onClick={(e) => e.stopPropagation()} style={{ marginTop: '10px', paddingTop: '10px' }}>
                            <div className="db-metrics-grid" style={{ gap: '8px' }}>
                              <div className="db-metric-item" style={{ padding: '8px' }}>
                                <span className="db-metric-label" style={{ fontSize: '10px' }}>PER</span>
                                <span className="db-metric-value" style={{ fontSize: '14px' }}>{stock.per}</span>
                                <span className="db-metric-comment" style={{ fontSize: '10.5px' }}>{stock.perComment}</span>
                              </div>
                              <div className="db-metric-item" style={{ padding: '8px' }}>
                                <span className="db-metric-label" style={{ fontSize: '10px' }}>PBR</span>
                                <span className="db-metric-value" style={{ fontSize: '14px' }}>{stock.pbr}</span>
                                <span className="db-metric-comment" style={{ fontSize: '10.5px' }}>{stock.pbrComment}</span>
                              </div>
                            </div>
                            <div className="db-supply-total" style={{ fontSize: '12px', marginTop: '8px', padding: '6px' }}>
                              {stock.supply.total}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Tab 2: NEWS */}
            {activeAppTab === 'news' && (
              <div className="column-card" style={{ border: 'none', padding: 0 }}>
                <h2 className="section-title" style={{ fontSize: '17px', marginBottom: '12px' }}>
                  <Globe size={18} />
                  전문가 스크랩 경제 시황 뉴스
                </h2>
                
                {/* News 3-Tabs in Mobile view */}
                <div className="news-tab-headers" style={{ marginBottom: '12px', padding: '3px' }}>
                  <button 
                    className={`news-tab-btn ${activeNewsTab === 'korean' ? 'active' : ''}`}
                    onClick={() => setActiveNewsTab('korean')}
                    style={{ fontSize: '12.5px', padding: '6px' }}
                  >
                    🇰🇷 국내
                  </button>
                  <button 
                    className={`news-tab-btn ${activeNewsTab === 'global' ? 'active' : ''}`}
                    onClick={() => setActiveNewsTab('global')}
                    style={{ fontSize: '12.5px', padding: '6px' }}
                  >
                    🇺🇸 해외/우주
                  </button>
                  <button 
                    className={`news-tab-btn ${activeNewsTab === 'macro' ? 'active' : ''}`}
                    onClick={() => setActiveNewsTab('macro')}
                    style={{ fontSize: '12.5px', padding: '6px' }}
                  >
                    🌍 거시시황
                  </button>
                </div>

                <div className="db-news-list">
                  {activeReport.news[activeNewsTab]?.map((item, idx) => (
                    <div key={idx} className="db-news-card" style={{ padding: '12px' }}>
                      <div className="db-news-header" style={{ marginBottom: '6px' }}>
                        <h4 className="db-news-title" style={{ fontSize: '14.5px' }}>{item.title}</h4>
                      </div>
                      <p className="db-news-summary" style={{ fontSize: '13px', marginBottom: '8px' }}>
                        {item.summary}
                      </p>
                      <div className="db-news-impact" style={{ padding: '8px', fontSize: '12px', marginBottom: '8px' }}>
                        <strong>포트폴리오 영향:</strong> {item.impact}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="db-news-source" style={{ fontSize: '10.5px', padding: '2px 6px' }}>{item.source}</span>
                        {item.url && (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="news-link-btn"
                            style={{ fontSize: '10.5px', padding: '2px 6px' }}
                          >
                            원본 보기 <ArrowUpRight size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: CALENDAR */}
            {activeAppTab === 'calendar' && (
              <div style={{ width: '100%' }}>
                {renderTossEconCalendar()}
              </div>
            )}

            {/* Tab 4: COPILOT Landing (with button to launch slideout drawer) */}
            {activeAppTab === 'copilot' && (
              <div className="column-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 16px', border: 'none', background: 'transparent' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--colors-sig-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 4px 12px rgba(24, 29, 38, 0.05)' }}>
                  <Sparkles size={32} color="var(--colors-sig-coral)" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--colors-ink)', margin: '0 0 8px 0' }}>
                  실시간 포트폴리오 AI 비서
                </h3>
                <p style={{ fontSize: '13.5px', lineHeight: 1.5, color: 'var(--colors-body)', margin: '0 0 24px 0', wordBreak: 'keep-all' }}>
                  현재 보유하신 HL만도, 삼성전자 등 국내 자산과 테슬라, 로켓랩 등 우주 혁신주 실시간 가격 정보, 거시 지표, 시황 뉴스를 바탕으로 궁금한 점을 질문해 보세요.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => setIsCopilotOpen(true)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MessageSquare size={16} />
                  AI 코파일럿과 채팅 시작하기
                </button>

                <div className="quick-prompts-area" style={{ marginTop: '32px', width: '100%', textAlign: 'left' }}>
                  <span className="quick-title" style={{ fontSize: '12.5px' }}>💡 추천 질문 목록</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <button 
                      onClick={() => {
                        setIsCopilotOpen(true);
                        // Trigger copilot with query via standard fab click
                      }}
                      className="btn-quick"
                      style={{ fontSize: '12.5px', textAlign: 'left', padding: '10px' }}
                    >
                      🔥 오늘 수급 쏠림 국내종목 요약해줘
                    </button>
                    <button 
                      onClick={() => setIsCopilotOpen(true)}
                      className="btn-quick"
                      style={{ fontSize: '12.5px', textAlign: 'left', padding: '10px' }}
                    >
                      🚀 테슬라/우주자산 바벨 전략 제언해줘
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Simulated App Bottom Navigation Tab Bar */}
          <div className="mobile-bottom-nav">
            <button 
              className={`nav-tab-item ${activeAppTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveAppTab('home')}
            >
              <Home size={18} />
              <span>홈</span>
            </button>
            <button 
              className={`nav-tab-item ${activeAppTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveAppTab('news')}
            >
              <Newspaper size={18} />
              <span>거시 뉴스</span>
            </button>
            <button 
              className={`nav-tab-item ${activeAppTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveAppTab('calendar')}
            >
              <Calendar size={18} />
              <span>증시 일정</span>
            </button>
            <button 
              className={`nav-tab-item ${activeAppTab === 'copilot' ? 'active' : ''}`}
              onClick={() => {
                setActiveAppTab('copilot');
                setIsCopilotOpen(true); // Open drawer immediately on selection
              }}
            >
              <MessageSquare size={18} />
              <span>AI 코파일럿</span>
            </button>
          </div>

        </div>

        {/* AI Co-pilot Conversation Drawer & FAB */}
        <AICopilot report={activeReport} isOpen={isCopilotOpen} setIsOpen={setIsCopilotOpen} />
      </div>
    );
  }

  // ----------------------------------------------------
  // 💻 WEB WIDE DASHBOARD VIEW LAYOUT
  // ----------------------------------------------------
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
            {loading ? '데이터 동기화 중...' : `${activeReport.date} 개장 전 자산 연계 맞춤형 브리핑`}
          </p>
        </div>
        
        <div className="db-actions">
          {renderViewModeToggle()}
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
      {renderIndicesTicker()}

      {/* 4. Global Macro 4 Key Indicators Board (Wall Street Terminals) */}
      <div className="canvas-panel" style={{ border: 'none', background: 'transparent' }}>
        <h3 className="section-title" style={{ margin: '0 0 var(--spacing-sm) 0' }}>
          <Activity size={22} color="var(--colors-primary)" />
          글로벌 거시경제 핵심 지표 4대 천왕
        </h3>
        {renderMacroIndicatorsBoard()}
      </div>

      {/* 5. Brand Voltage - Airtable Signature Cream Band for Global Market Summary */}
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

      {/* 6. Dashboard Core Layout */}
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
              
              {/* News Tab Headers - Expanded to 3 Tabs */}
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
                  🇺🇸 글로벌 / 우주
                </button>
                <button 
                  className={`news-tab-btn ${activeNewsTab === 'macro' ? 'active' : ''}`}
                  onClick={() => setActiveNewsTab('macro')}
                >
                  🌍 헤드라인 & 거시시황
                </button>
              </div>

              {/* News List */}
              <div className="db-news-list">
                {activeReport.news[activeNewsTab]?.map((item, idx) => (
                  <div key={idx} className="db-news-card">
                    <div className="db-news-header">
                      <h4 className="db-news-title">{item.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span className="db-news-source">{item.source}</span>
                        {item.url && (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="news-link-btn"
                            title="뉴스 원본 사이트로 이동"
                          >
                            원본 보기 <ArrowUpRight size={12} />
                          </a>
                        )}
                      </div>
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
                국내 자산 추천 및 퀀트 분석 ({activeReport.stocks.length}選)
              </h2>

              <div className="db-stocks-list">
                {activeReport.stocks.map((stock, idx) => {
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
                미국 및 우주 혁신 자산 분석 ({activeReport.usStocks.length}선)
              </h2>

              <div className="db-stocks-list">
                {activeReport.usStocks.map((stock, idx) => {
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

      {/* 7. Toss-style Econ Calendar (Full-width row at bottom of wide view) */}
      {!loading && renderTossEconCalendar()}

      {/* 8. Footer */}
      <footer className="db-footer">
        <p>© 2026 <span className="db-footer-brand">Smart Economic Intelligence System</span>. All rights reserved.</p>
        <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--colors-muted)' }}>
          Powered by Gemini 2.5 Flash Cloud Scraper & Airtable Editorial Framework
        </p>
      </footer>

      {/* 9. AI Portfolio Co-pilot Conversation Drawer & FAB */}
      <AICopilot report={activeReport} isOpen={isCopilotOpen} setIsOpen={setIsCopilotOpen} />

    </div>
  );
}

export default App;
