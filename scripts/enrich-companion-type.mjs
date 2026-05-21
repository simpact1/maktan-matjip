import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(dir, '../src/data/restaurants.json');

/** 오션뷰·로맨틱 */
const COUPLE_BY_ID = new Set(['12', '21', '22', '26', '48']);

/** 아이·부모님·커플 모두에게 무난한 대표 맛집 */
const MODU_BY_ID = new Set([
  '1', // 할로망고
  '4', // 씨푸드 에이스 크랩
  '6', // 쿠모
  '7', // 더 그랜드 테이블
  '11', // 라 파리지엔느
  '13', // 산미구엘 플라자
  '23', // 성카
  '25', // 씨푸드 점보7
  '30', // 대가
  '36', // 마리바고 그릴
  '37', // 씨푸드 마리바고크랩
  '45', // 할리스
  '46', // 딤섬브레이크
  '49', // 7107
  '51', // 씨푸드 막탄크랩
]);

/** 아이·체험·캐주얼 위주 */
const CHILD_BY_ID = new Set([
  '3',
  '8',
  '9',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '24',
  '28',
  '29',
  '32',
  '35',
  '40',
  '41',
  '42',
  '43',
  '53',
]);

function pickCompanionType(r) {
  if (COUPLE_BY_ID.has(r.id) || r.companionType === '뷰맛집') {
    return '커플';
  }
  if (MODU_BY_ID.has(r.id)) {
    return '모두';
  }
  if (CHILD_BY_ID.has(r.id)) {
    return '아이동반';
  }
  return '부모님동반';
}

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
const enriched = data.map((r) => ({
  ...r,
  companionType: pickCompanionType(r),
}));

writeFileSync(jsonPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');

const counts = {};
for (const r of enriched) {
  counts[r.companionType] = (counts[r.companionType] ?? 0) + 1;
}
console.log('companionType counts:', counts);
