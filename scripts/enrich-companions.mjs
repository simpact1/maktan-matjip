import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(dir, '../src/data/restaurants.json');

const COMPANION_TAGS = new Set(['아이동반', '부모님동반']);

/** id → 동반자 (수동 보정). 비어 있으면 migrateCompanions 휴리스틱 사용 */
const COMPANION_BY_ID = {
  '10': ['부모님동반'],
  '12': ['부모님동반'],
  '13': ['부모님동반'],
  '48': ['부모님동반'],
  '52': ['부모님동반'],
};

function migrateCompanions(bestFor) {
  const kept = bestFor.filter((t) => COMPANION_TAGS.has(t));
  if (kept.length > 0) {
    return [...new Set(kept)];
  }
  if (bestFor.includes('선셋/로맨틱')) {
    return ['부모님동반'];
  }
  if (bestFor.some((t) => ['물놀이후', '새벽입국', '체크아웃코스'].includes(t))) {
    return ['아이동반'];
  }
  return [];
}

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
const enriched = data.map((r) => {
  const { bestFor, ...rest } = r;
  const companions =
    COMPANION_BY_ID[r.id] ?? migrateCompanions(bestFor ?? []);
  return { ...rest, companions };
});

writeFileSync(jsonPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');

const counts = { none: 0, one: 0, two: 0 };
for (const r of enriched) {
  const n = r.companions.length;
  if (n === 0) counts.none++;
  else if (n === 1) counts.one++;
  else counts.two++;
}
console.log('companions distribution:', counts);
enriched.forEach((r) =>
  console.log(`${r.id}|${r.zone}|${r.menuType}|${r.companions.join(',') || '-'}`)
);
