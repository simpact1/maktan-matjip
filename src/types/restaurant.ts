export type RestaurantCategory =
  | 'korean'
  | 'seafood'
  | 'japanese'
  | 'cafe'
  | 'local'
  | 'other';

export type FilterCategory = 'all' | RestaurantCategory;

export type GuideListMode = 'all' | 'pickupDrop' | 'viewSpots' | 'resortDining';

export type ResortMealType = '조식' | '석식';

export type ResortMealFilter = ResortMealType | null;

export type RestaurantZone =
  | '제이파크/샹스'
  | '샹그릴라'
  | '마리바고/블루워터'
  | '공항인근'
  | '솔레아'
  | '막탄뉴타운'
  | '세부시티';

export type MenuType =
  | '씨푸드'
  | '한식'
  | '로컬'
  | '일식'
  | '중식'
  | '뷰맛집'
  | '뷔페'
  | '카페'
  | '양식'
  | '타이'
  | '멕시칸'
  | '기타';

/** 동반자에 따른 구분 (맛집당 1개) */
export type CompanionFilterTag = '모두' | '아이동반' | '부모님동반' | '커플';

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
  companionType: CompanionFilterTag;
  pickupDrop: boolean;
  pickupDropNote?: string;
  resortMeal: ResortMealType[];
  resortMealNote?: string;
  link?: string;
  links?: BlogLink[];
  /** 카카오톡 채널 예약(막탄 크랩 맛집 등) */
  reservationLink?: string;
  /** 막탄 대표 크랩 맛집 5곳 (예약 버튼·UI 판별) */
  isCrab?: boolean;
  /** 특정 구역(zone) 필터 선택 시 숨김 (전체 리스트엔 노출). 예: 공항근처 카테고리에서 제외 */
  hiddenInZoneFilter?: boolean;
  rating?: number;
  ratingCount?: number;
}
