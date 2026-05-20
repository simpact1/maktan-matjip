import { MactanResort } from '../types/resort';

export function filterResorts(resorts: MactanResort[], query: string): MactanResort[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return resorts;
  }
  return resorts.filter((r) => {
    const haystack = `${r.name} ${r.breakfast} ${r.dinner}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
