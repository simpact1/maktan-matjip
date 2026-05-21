export interface ResortOtherVenue {
  name: string;
  summary: string;
}

export interface MactanResort {
  id: string;
  name: string;
  lat: number;
  lng: number;
  breakfast: string;
  dinner: string;
  /** 조·석식 메인 가이드 외 리조트 내 레스토랑·바·카페 */
  otherVenues: ResortOtherVenue[];
}
