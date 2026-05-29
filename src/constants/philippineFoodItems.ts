export interface PhilippineFoodItem {
  id: number;
  emoji: string;
  /** 고화질 이미지 아이콘 URL (이모지 대체) */
  imgUrl: string;
  title: string;
  link: string;
  blogTitle: string;
}

export const PHILIPPINE_FOOD_SUBTITLE =
  '세부 여행에서 놓칠 수 없는 대표 먹거리 정보입니다.';

export const PHILIPPINE_FOOD_ITEMS: PhilippineFoodItem[] = [
  {
    id: 1,
    emoji: '🍛',
    imgUrl: 'https://cdn-icons-png.flaticon.com/512/3449/3449377.png',
    title: '세부추천음식',
    link: 'https://m.blog.naver.com/aalove0902/80187457383',
    blogTitle: '세부 추천 음식',
  },
  {
    id: 2,
    emoji: '🍧',
    imgUrl: 'https://cdn-icons-png.flaticon.com/512/7506/7506647.png',
    title: '할로할로',
    link: 'https://m.blog.naver.com/aalove0902/220948168390',
    blogTitle: '할로할로',
  },
  {
    id: 3,
    emoji: '🐝',
    imgUrl: 'https://global.jollibee.com.ph/assets/images/jollibee-logo.png',
    title: '졸리비',
    link: 'https://m.blog.naver.com/aalove0902/221948684648',
    blogTitle: '졸리비',
  },
  {
    id: 4,
    emoji: '🌴',
    imgUrl: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
    title: '필리핀 전통먹거리',
    link: 'https://m.blog.naver.com/aalove0902/220477437043',
    blogTitle: '필리핀 전통먹거리',
  },
];
