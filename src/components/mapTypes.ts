import { Restaurant } from '../types/restaurant';
import { MactanResort } from '../types/resort';
import { MapLayerMode } from './MapLayerToggle';

export interface ClusterMapProps {
  restaurants: Restaurant[];
  resorts: MactanResort[];
  mapLayerMode: MapLayerMode;
  showRestaurants: boolean;
  showResorts: boolean;
  focusedItemId: string | null;
  focusedResortId: string | null;
  onSelectRestaurant: (id: string) => void;
  onSelectResort: (id: string) => void;
}

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  kind: 'restaurant' | 'resort';
};

export function collectVisibleMapPoints(
  restaurants: Restaurant[],
  resorts: MactanResort[],
  showRestaurants: boolean,
  showResorts: boolean
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
  return points;
}
