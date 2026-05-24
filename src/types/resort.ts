import { RestaurantZone } from './restaurant';

export interface ResortOtherVenue {
  name: string;
  summary: string;
}

export interface ResortBlogLink {
  label: string;
  url: string;
}

export interface MactanResort {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zone: RestaurantZone;
  breakfast: string;
  dinner: string;
  /** 조·석식 메인 가이드 외 리조트 내 레스토랑·바·카페 */
  otherVenues: ResortOtherVenue[];
  /** 네이버 블로그 등 상세 후기 바로가기 (선택) */
  blogLink?: ResortBlogLink;
  /** 레스토랑별 후기 바로가기 (선택, 저녁 가이드 하단) */
  reviewLinks?: ResortBlogLink[];
}
