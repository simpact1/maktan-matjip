export type RestaurantCategory =
  | 'korean'
  | 'seafood'
  | 'japanese'
  | 'cafe'
  | 'local'
  | 'other';

export type FilterCategory = 'all' | RestaurantCategory;

export type GuideListMode = 'all' | 'pickupDrop' | 'resortMeal' | 'resortDining';

export type ResortMealType = '조식' | '석식';

export type ResortMealFilter = ResortMealType | null;

export type RestaurantZone =
  | '제이파크/샹스'
  | '막탄뉴타운'
  | '마리바고/아가스'
  | '공항인근'
  | '코르도바';

export type MenuType =
  | '씨푸드'
  | '한식'
  | '로컬'
  | '일식'
  | '중식'
  | '뷰맛집'
  | '뷔페'
  | '카페/디저트'
  | '기타';

export type BestForTag =
  | '새벽입국'
  | '물놀이후'
  | '선셋/로맨틱'
  | '체크아웃코스'
  | '아이동반'
  | '부모님동반';

export interface BlogLink {
  text: string;
  url: string;
}

export interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lng: number;
  desc: string;
  category: RestaurantCategory;
  zone: RestaurantZone;
  menuType: MenuType;
  bestFor: [BestForTag] | [BestForTag, BestForTag];
  pickupDrop: boolean;
  pickupDropNote?: string;
  resortMeal: ResortMealType[];
  resortMealNote?: string;
  link?: string;
  links?: BlogLink[];
}
