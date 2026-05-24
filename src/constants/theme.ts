export const fonts = {
  regular: 'NotoSansKR_400Regular',
  semiBold: 'NotoSansKR_600SemiBold',
  bold: 'NotoSansKR_700Bold',
};

/** 세부 가볼만한곳(index.css)과 동일 팔레트 */
export const colors = {
  bgDeep: '#042f2e',
  bgMid: '#0e7490',
  bgLight: '#155e75',
  bgCard: 'rgba(15, 118, 110, 0.35)',
  bgCardSolid: '#0f766e',
  text: '#ecfeff',
  textMuted: '#99f6e4',
  textDesc: 'rgba(165, 243, 252, 0.95)',
  accent: '#fef9c3',
  accentGold: '#fbbf24',
  link: '#a5f3fc',
  cardBorder: 'rgba(236, 254, 255, 0.12)',
  cardHeading: '#ccfbf1',
  tabIdleBg: 'rgba(0, 0, 0, 0.45)',
  tabIdleBorder: 'rgba(255, 255, 255, 0.12)',
  tabIdleText: 'rgba(236, 254, 255, 0.72)',
  tabSubIdleBg: 'rgba(0, 0, 0, 0.38)',
  mactanActiveBg: 'rgba(3, 105, 161, 0.65)',
  mactanActiveBorder: 'rgba(125, 211, 252, 0.75)',
  mactanActiveText: '#f0f9ff',
  itemBg: 'rgba(0, 0, 0, 0.18)',
  itemBorder: 'rgba(255, 255, 255, 0.08)',
  sheetBg: 'rgba(4, 47, 46, 0.97)',
  inputBg: 'rgba(0, 0, 0, 0.35)',
  radius: 16,
  radiusSm: 8,
};

/** 정보성 팁 2×3 그리드 — 다크 민트 톤 (앱 배경과 블렌딩) */
export const diningGuideTipTheme = {
  bg: 'rgba(11, 37, 46, 0.6)',
  border: 'rgba(255, 255, 255, 0.05)',
  borderActive: 'rgba(31, 78, 91, 0.85)',
  text: '#F8F9FA',
  panelBg: 'rgba(4, 47, 46, 0.88)',
  panelBorder: 'rgba(255, 255, 255, 0.08)',
} as const;

export const categoryColors: Record<string, string> = {
  korean: '#34d399',
  seafood: '#38bdf8',
  japanese: '#a78bfa',
  cafe: '#fbbf24',
  local: '#2dd4bf',
  other: '#94a3b8',
};

export const menuTypeColors: Record<string, string> = {
  씨푸드: '#38bdf8',
  한식: '#34d399',
  로컬: '#2dd4bf',
  일식: '#a78bfa',
  중식: '#f87171',
  뷰맛집: '#f472b6',
  뷔페: '#fb923c',
  카페: '#fbbf24',
  기타: '#94a3b8',
};

export const MACTAN_CENTER = {
  latitude: 10.295,
  longitude: 124.0,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export const gradient = {
  colors: [colors.bgDeep, colors.bgMid, colors.bgLight] as const,
  start: { x: 0.2, y: 0 },
  end: { x: 0.8, y: 1 },
};
