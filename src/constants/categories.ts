import { FilterCategory } from '../types/restaurant';

export const FILTER_OPTIONS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'korean', label: '한식' },
  { key: 'seafood', label: '씨푸드' },
  { key: 'japanese', label: '일식' },
  { key: 'cafe', label: '카페&디저트' },
  { key: 'local', label: '로컬음식' },
  { key: 'other', label: '기타' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  korean: '한식',
  seafood: '씨푸드',
  japanese: '일식',
  cafe: '카페&디저트',
  local: '로컬음식',
  other: '기타',
};
