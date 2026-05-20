import {
  BestForTag,
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
  { value: '막탄뉴타운', label: '막탄뉴타운 근처' },
  { value: '마리바고/아가스', label: '마리바고 근처' },
  { value: '공항인근', label: '공항주변' },
  { value: '코르도바', label: '코르도바' },
];

export const MENU_TYPE_OPTIONS: FilterOption<MenuType>[] = [
  { value: '씨푸드', label: '씨푸드' },
  { value: '한식', label: '한식' },
  { value: '로컬', label: '로컬' },
  { value: '일식', label: '일식' },
  { value: '중식', label: '중식' },
  { value: '뷰맛집', label: '뷰맛집' },
  { value: '뷔페', label: '뷔페' },
  { value: '카페/디저트', label: '카페/디저트' },
  { value: '기타', label: '기타' },
];

export function getZoneLabel(zone: RestaurantZone): string {
  return ZONE_FILTER_OPTIONS.find((z) => z.value === zone)?.label ?? zone;
}

export const BEST_FOR_OPTIONS: BestForTag[] = [
  '새벽입국',
  '물놀이후',
  '선셋/로맨틱',
  '체크아웃코스',
  '아이동반',
  '부모님동반',
];
