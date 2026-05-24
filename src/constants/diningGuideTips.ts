import { NIGHT_MARKET_GUIDE_PASSAGE } from './nightMarketGuideText';

export type DiningGuideTipId =
  | 'meal-tips'
  | 'filipino-food'
  | 'beer-drinks'
  | 'delivery-apps'
  | 'night-market'
  | 'fruits';

export interface DiningGuideExpandLink {
  label: string;
  url: string;
  blogTitle: string;
  icon?: string;
}

export interface DiningGuideTip {
  id: DiningGuideTipId;
  icon: string;
  /** 접근성·펼침 영역용 전체 제목 */
  title: string;
  /** 2x3 그리드 버튼에 표시할 한 줄 라벨 */
  compactTitle: string;
  summary: string;
  url: string;
  blogTitle: string;
  /** true면 커스텀 펼침 레이아웃(단일/복수 링크) */
  expandSimple?: boolean;
  /** 펼침 영역 제목(이모지 포함 가능) */
  expandTitle?: string;
  /** expandSimple일 때 본문(줄바꿈 가능) */
  expandBody?: string;
  /** 펼침 영역 단일 링크 버튼 라벨 */
  linkLabel?: string;
  /** 펼침 영역 복수 링크 */
  expandLinks?: DiningGuideExpandLink[];
  /** 복수 링크 배치: row(가로) | grid2x2(2x2) */
  expandLinksLayout?: 'row' | 'grid2x2';
}

export const DINING_GUIDE_TIPS: DiningGuideTip[] = [
  {
    id: 'meal-tips',
    icon: '💡',
    title: '식사관련팁',
    compactTitle: '식사관련팁',
    summary: '세부 현지 식당 이용 시 알아두면 좋은 꿀팁들',
    expandTitle: '💡 세부 현지 식당 이용 시 알아두면 좋은 꿀팁들',
    expandBody:
      '• 세부 현지 식당에서는 번호표를 받는 방식, 빌지(Bill)를 받아 테이블에서 정산하는 결제 방식, 서비스 차지(봉사료) 포함 여부, 브레이크 타임 등 한국과는 다른 문화가 많아 모르면 당황스러운 일이 생길 수 있습니다.',
    url: 'https://m.blog.naver.com/aalove0902/222336919760',
    blogTitle: '세부 현지 식당 이용 꿀팁',
    linkLabel: '세부 현지 식당 이용 시 알아두면 좋은 꿀팁들 🔗',
    expandSimple: true,
  },
  {
    id: 'filipino-food',
    icon: '🍖',
    title: '필리핀 추천음식',
    compactTitle: '필리핀음식',
    summary:
      '레촌(통돼지 구이), 감바스, 갈릭라이스 등 호불호 없이 한국인 입맛에 딱 맞는 전통 메뉴 추천!',
    url: 'https://m.blog.naver.com/aalove0902/220367370658',
    blogTitle: '필리핀 추천음식',
  },
  {
    id: 'beer-drinks',
    icon: '🍺',
    title: '대표맥주/추천음료',
    compactTitle: '맥주음료',
    summary:
      '필리핀에서는 한국과 달리 식사를 할 때 물 이외에 음료를 같이 마십니다.',
    url: 'https://m.blog.naver.com/aalove0902/220446356816',
    blogTitle: '세부 맥주·추천음료',
    expandSimple: true,
    expandTitle: '🍺 대표맥주/추천음료',
    expandBody:
      '필리핀에서는 한국과 달리 식사를 할 때 물 이외에 음료를 같이 마십니다. 식사할 때 어떤 음료들을 마시는지 그리고 필리핀에서 가장 유명한 맥주인 산미구엘 맥주에 대해서 알려드립니다.',
    expandLinks: [
      {
        label: '추천음료 · 자세히 보기 🔗',
        url: 'https://m.blog.naver.com/aalove0902/220446356816',
        blogTitle: '세부 추천음료',
      },
      {
        label: '산미구엘 맥주 · 자세히 보기 🔗',
        url: 'https://m.blog.naver.com/aalove0902/80180717985',
        blogTitle: '산미구엘 맥주 정보',
      },
    ],
  },
  {
    id: 'delivery-apps',
    icon: '🛵',
    title: '배달앱',
    compactTitle: '배달앱',
    summary:
      '숙소 밖으로 나가기 귀찮을 때는 배달을 시켜 드실 수 있습니다.',
    url: 'https://m.blog.naver.com/aalove0902/223884886949',
    blogTitle: '세부 배달앱',
    expandSimple: true,
    expandTitle: '🛵 배달앱',
    expandBody:
      '숙소 밖으로 나가기 귀찮을때는 배달을 시켜 드실수 있습니다. 세부에서는 푸드판다와 그랩이 양대산맥 배달앱입니다. 그리고 한국분들이 운영하는 레스토랑은 카톡으로 직접 예약을 받아 배달을 해주는 경우도 있습니다.\n\n일부 리조트의 경우에는 외부음식 반입이 안되는 경우가 있으니 주문하기전 미리 확인 하는 것이 좋습니다.',
    expandLinks: [
      {
        label: '그랩 · 자세히 보기 🔗',
        url: 'https://m.blog.naver.com/aalove0902/223884886949',
        blogTitle: '세부 배달앱 그랩',
      },
      {
        label: '푸드판다 · 자세히 보기 🔗',
        url: 'https://m.blog.naver.com/aalove0902/222021019775',
        blogTitle: '필리핀 배달앱 푸드판다',
      },
    ],
  },
  {
    id: 'night-market',
    icon: '🌙',
    title: '야시장',
    compactTitle: '야시장',
    summary:
      '막탄·세부시티 대표 야시장 4곳! 지도에서 위치를 확인하고 생생 후기를 볼 수 있어요.',
    url: 'https://m.blog.naver.com/aalove0902/223451364466',
    blogTitle: '세부 야시장',
    expandSimple: true,
    expandTitle: '🌙 야시장',
    expandBody: NIGHT_MARKET_GUIDE_PASSAGE,
  },
  {
    id: 'fruits',
    icon: '🥭',
    title: '과일',
    compactTitle: '과일',
    summary:
      '세부여행의 꽃 열대과일 — 종류와 고르는 법을 알려드려요.',
    expandTitle: '🥭 세부열대과일',
    expandBody:
      '세부여행의 꽃 열대과일 어떤 과일들이 있는지 어떻게 골라야 하는지 알려드려요',
    url: 'https://m.blog.naver.com/aalove0902/80205604757',
    blogTitle: '세부 열대과일',
    expandSimple: true,
    expandLinksLayout: 'row',
    expandLinks: [
      {
        icon: '🏝️',
        label: '열대과일 종류',
        url: 'https://m.blog.naver.com/aalove0902/80205604757',
        blogTitle: '세부 열대과일 종류',
      },
      {
        icon: '🥭',
        label: '망고 고르는법',
        url: 'https://m.blog.naver.com/aalove0902/80187677430',
        blogTitle: '망고 고르는 법',
      },
      {
        icon: '🍇',
        label: '망고스틴 고르는법',
        url: 'https://m.blog.naver.com/aalove0902/80188133264',
        blogTitle: '망고스틴 고르는 법',
      },
      {
        icon: '🥥',
        label: '코코넛 즐기기',
        url: 'https://m.blog.naver.com/aalove0902/80188212044',
        blogTitle: '코코넛 즐기기',
      },
    ],
  },
];
