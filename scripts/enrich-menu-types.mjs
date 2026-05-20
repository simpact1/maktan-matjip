import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(dir, '../src/data/restaurants.json');

/** id → 새 메뉴 분류 */
const MENU_BY_ID = {
  '1': '카페/디저트',
  '2': '한식',
  '3': '한식',
  '4': '씨푸드',
  '5': '일식',
  '6': '뷔페',
  '7': '뷔페',
  '8': '기타',
  '9': '기타',
  '10': '로컬',
  '11': '카페/디저트',
  '12': '뷰맛집',
  '13': '로컬',
  '14': '카페/디저트',
  '15': '기타',
  '16': '기타',
  '17': '중식',
  '18': '카페/디저트',
  '19': '카페/디저트',
  '20': '카페/디저트',
  '21': '뷰맛집',
  '22': '뷰맛집',
  '23': '씨푸드',
  '24': '로컬',
  '25': '씨푸드',
  '26': '뷰맛집',
  '27': '한식',
  '28': '카페/디저트',
  '29': '로컬',
  '30': '한식',
  '31': '중식',
  '32': '카페/디저트',
  '33': '한식',
  '34': '한식',
  '35': '카페/디저트',
  '36': '로컬',
  '37': '씨푸드',
  '38': '씨푸드',
  '39': '로컬',
  '40': '씨푸드',
  '41': '로컬',
  '42': '씨푸드',
  '43': '로컬',
  '44': '한식',
  '45': '카페/디저트',
  '46': '중식',
  '47': '한식',
  '48': '뷰맛집',
  '49': '로컬',
  '50': '일식',
  '51': '씨푸드',
  '52': '카페/디저트',
  '53': '한식',
};

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
const enriched = data.map((r) => ({
  ...r,
  menuType: MENU_BY_ID[r.id] ?? '기타',
}));

writeFileSync(jsonPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');
const counts = {};
for (const r of enriched) {
  counts[r.menuType] = (counts[r.menuType] ?? 0) + 1;
}
console.log('menuType counts:', counts);
