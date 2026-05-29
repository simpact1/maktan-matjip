import {
  CompanionFilterTag,
  MenuType,
  ResortMealFilter,
  Restaurant,
  RestaurantZone,
} from '../types/restaurant';
import { getZoneLabel } from '../constants/filters';

export interface RestaurantFilters {
  zone: RestaurantZone | null;
  menuType: MenuType | null;
  companion: CompanionFilterTag | null;
  resortMeal: ResortMealFilter;
  pickupDropOnly: boolean;
  query: string;
}

export function filterRestaurants(
  items: Restaurant[],
  filters: RestaurantFilters
): Restaurant[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    if (filters.zone && (item.zone !== filters.zone || item.hiddenInZoneFilter)) {
      return false;
    }
    if (filters.menuType && item.menuType !== filters.menuType) {
      return false;
    }
    if (filters.companion && item.companionType !== filters.companion) {
      return false;
    }
    if (filters.pickupDropOnly && !item.pickupDrop) {
      return false;
    }
    if (filters.resortMeal && !item.resortMeal.includes(filters.resortMeal)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      item.name,
      item.desc,
      item.zone,
      getZoneLabel(item.zone),
      item.menuType,
      item.companionType,
      ...item.resortMeal,
      item.pickupDrop ? '픽업 드랍 송영' : '',
      item.pickupDropNote ?? '',
      item.resortMealNote ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
