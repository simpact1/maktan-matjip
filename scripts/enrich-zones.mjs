import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(dir, '../src/data/restaurants.json');

const SHANGRI_LA = { lat: 10.3012, lng: 124.0185 };
const NEWTOWN = { lat: 10.3073, lng: 124.0098 };

const NEWTOWN_HINT =
  /LG가든|가든워크|뉴타운|뉴타운|Newtown|LG Garden|LG가든워크/i;

/** 수동 보정 (이름·실제 위치 기준) */
const ZONE_BY_ID = {
  '11': '막탄뉴타운',
  '26': '막탄뉴타운',
  '27': '막탄뉴타운',
  '29': '제이파크/샹스',
  '33': '제이파크/샹스',
  '52': '샹그릴라',
};

function km(a, b) {
  return Math.hypot(a.lat - b.lat, a.lng - b.lng) * 111;
}

function pickZone(r) {
  if (ZONE_BY_ID[r.id]) {
    return ZONE_BY_ID[r.id];
  }

  const text = `${r.name} ${r.desc}`;
  const dSh = km(r, SHANGRI_LA);
  const dNt = km(r, NEWTOWN);

  if (NEWTOWN_HINT.test(text) || dNt <= 0.45) {
    return '막탄뉴타운';
  }

  if (
    (r.zone === '샹그릴라' || r.zone === '막탄뉴타운') &&
    dSh <= 0.75 &&
    dNt >= 0.45
  ) {
    return '샹그릴라';
  }

  return r.zone;
}

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
const enriched = data.map((r) => ({ ...r, zone: pickZone(r) }));

writeFileSync(jsonPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');

const counts = {};
for (const r of enriched) {
  counts[r.zone] = (counts[r.zone] ?? 0) + 1;
}
console.log('zone counts:', counts);
enriched
  .filter((r) => r.zone === '샹그릴라' || r.zone === '막탄뉴타운')
  .forEach((r) => console.log(`${r.id}|${r.zone}|${r.name}`));
