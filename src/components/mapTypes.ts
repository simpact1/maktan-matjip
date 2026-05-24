import { Restaurant } from '../types/restaurant';
import { NightMarket } from '../types/nightMarket';
import { MactanResort } from '../types/resort';

export interface ClusterMapProps {
  restaurants: Restaurant[];
  resorts: MactanResort[];
  nightMarkets: NightMarket[];
  showRestaurants: boolean;
  showResorts: boolean;
  showNightMarkets: boolean;
  selectedRestaurantId: string | null;
  selectedResortId: string | null;
  selectedNightMarketId: string | null;
  onSelectRestaurant: (id: string) => void;
  onSelectResort: (id: string) => void;
  onSelectNightMarket: (id: string) => void;
  onClearMapSelection?: () => void;
}

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  kind: 'restaurant' | 'resort' | 'nightMarket';
};

export function collectVisibleMapPoints(
  restaurants: Restaurant[],
  resorts: MactanResort[],
  nightMarkets: NightMarket[],
  showRestaurants: boolean,
  showResorts: boolean,
  showNightMarkets: boolean
): MapPoint[] {
  const points: MapPoint[] = [];
  if (showRestaurants) {
    for (const r of restaurants) {
      points.push({ id: r.id, lat: r.lat, lng: r.lng, kind: 'restaurant' });
    }
  }
  if (showResorts) {
    for (const r of resorts) {
      points.push({ id: r.id, lat: r.lat, lng: r.lng, kind: 'resort' });
    }
  }
  if (showNightMarkets) {
    for (const m of nightMarkets) {
      points.push({ id: m.id, lat: m.lat, lng: m.lng, kind: 'nightMarket' });
    }
  }
  return points;
}
