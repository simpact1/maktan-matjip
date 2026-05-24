import {
  CompanionFilterTag,
  MenuType,
  ResortMealType,
  RestaurantZone,
} from '../types/restaurant';

export type FilterOption<T extends string> = {
  value: T;
  label: string;
};

export const RESORT_MEAL_OPTIONS: ResortMealType[] = ['조식', '석식'];

export const ZONE_FILTER_OPTIONS: FilterOption<RestaurantZone>[] = [
  { value: '제이파크/샹스', label: '제이파크근처' },
  { value: '샹그릴라', label: '샹그릴리 근처' },
  { value: '막탄뉴타운', label: '막탄뉴타운 근처' },
  { value: '마리바고/블루워터', label: '마리바고 블루워터 근처' },
  { value: '공항인근', label: '공항주변' },
  { value: '솔레아', label: '솔레아 근처' },
];

export const MENU_TYPE_OPTIONS: FilterOption<MenuType>[] = [
  { value: '씨푸드', label: '씨푸드' },
  { value: '한식', label: '한식' },
  { value: '로컬', label: '로컬' },
  { value: '일식', label: '일식' },
  { value: '중식', label: '중식' },
  { value: '뷔페', label: '뷔페' },
  { value: '카페', label: '카페' },
  { value: '기타', label: '기타' },
];

export function getZoneLabel(zone: RestaurantZone): string {
  return ZONE_FILTER_OPTIONS.find((z) => z.value === zone)?.label ?? zone;
}

export const COMPANION_FILTER_OPTIONS: FilterOption<CompanionFilterTag>[] = [
  { value: '모두', label: '모두' },
  { value: '아이동반', label: '아이동반' },
  { value: '부모님동반', label: '부모님동반' },
  { value: '커플', label: '커플' },
];
