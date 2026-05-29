import { RestaurantZone } from '../types/restaurant';
import { MactanResort } from '../types/resort';

export interface ResortFilters {
  query: string;
  zone: RestaurantZone | null;
}

export function filterResorts(
  resorts: MactanResort[],
  filters: ResortFilters
): MactanResort[] {
  let result = resorts;

  if (filters.zone) {
    result = result.filter(
      (r) => r.zone === filters.zone && !r.hiddenInZoneFilter
    );
  }

  const normalizedQuery = filters.query.trim().toLowerCase();
  if (!normalizedQuery) {
    return result;
  }

  return result.filter((r) => {
    const haystack = [
      r.name,
      r.breakfast,
      r.dinner,
      ...r.otherVenues.flatMap((v) => [v.name, v.summary]),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
