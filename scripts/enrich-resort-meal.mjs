import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(dir, '../src/data/restaurants.json');

/** 리조트 숙박객 조식·석식 대안 (호텔 뷔페 외) — 막탄 관광 패턴 기준 */
const RESORT_MEAL = {
  '1': ['조식'],
  '2': ['석식'],
  '3': ['조식'],
  '4': ['석식'],
  '5': ['석식'],
  '6': ['석식'],
  '7': ['조식', '석식'],
  '8': ['석식'],
  '9': ['석식'],
  '10': ['석식'],
  '11': ['조식'],
  '12': ['석식'],
  '13': ['석식'],
  '14': ['조식'],
  '15': ['석식'],
  '16': ['석식'],
  '17': ['조식', '석식'],
  '18': ['조식'],
  '19': ['조식'],
  '20': ['조식'],
  '21': ['석식'],
  '22': ['석식'],
  '23': ['석식'],
  '24': ['석식'],
  '25': ['석식'],
  '26': ['석식'],
  '27': ['석식'],
  '28': ['조식', '석식'],
  '29': ['조식', '석식'],
  '30': ['석식'],
  '31': ['석식'],
  '32': ['조식'],
  '33': ['석식'],
  '34': ['석식'],
  '35': ['조식'],
  '36': ['석식'],
  '37': ['석식'],
  '38': ['석식'],
  '39': ['석식'],
  '40': ['석식'],
  '41': ['석식'],
  '42': ['석식'],
  '43': ['석식'],
  '44': ['석식'],
  '45': ['조식'],
  '46': ['조식', '석식'],
  '47': ['석식'],
  '48': ['석식'],
  '49': ['석식'],
  '50': ['석식'],
  '51': ['석식'],
  '52': ['조식', '석식'],
  '53': ['조식', '석식'],
};

const RESORT_MEAL_NOTE = {
  '7': '뉴타운 리조트 — 브런치·석식 뷔페 대안',
  '29': '제이파크·뉴타운 — 조식·석식 퓨전 로컬',
  '53': '새벽 투어·리조트 — 24시간 조식·야식',
  '19': '막탄 뉴타운 — 리조트 조식·브런치',
  '26': '더마크·모벤픽 — 오션뷰 석식',
  '25': '마리바고 리조트 — 대표 석식 씨푸드',
};

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
const enriched = data.map((r) => {
  const meals = RESORT_MEAL[r.id] ?? [];
  const note = RESORT_MEAL_NOTE[r.id];
  return {
    ...r,
    resortMeal: meals,
    ...(note && meals.length > 0 ? { resortMealNote: note } : {}),
  };
});

writeFileSync(jsonPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');
const withMeal = enriched.filter((r) => r.resortMeal.length > 0);
const breakfast = withMeal.filter((r) => r.resortMeal.includes('조식'));
const dinner = withMeal.filter((r) => r.resortMeal.includes('석식'));
console.log(
  `resortMeal: ${withMeal.length} / ${enriched.length} (조식 ${breakfast.length}, 석식 ${dinner.length})`
);
