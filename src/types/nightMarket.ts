export type NightMarketRegion = 'mactan' | 'cebu-city';

export interface NightMarket {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  locationDesc: string;
  region: NightMarketRegion;
  blogUrl: string;
  blogTitle: string;
}
