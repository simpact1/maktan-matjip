import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(dir, '../src/data/restaurants.json');

/** 막탄 리조트·호텔 무료/유료 송영(픽업·드랍) — 블로그·현지 관광 패턴 기준 */
const PICKUP_DROP = {
  '4': '샹스·제이파크 리조트권 — 단체·사전 예약 시 송영 문의',
  '12': '코르도바·리조트권 — 단체 예약 시 픽업·드랍 협의',
  '21': '제이파크·마리바고 리조트 — 픽업·드랍 (예약 필수)',
  '22': '10,000 Roses·리조트권 — 투어·식사 패키지 송영',
  '23': '코르도바·막탄 호텔 — 픽업·드랍 (예약 필수)',
  '25': '막탄 전 리조트·호텔 — 무료 픽업·드랍 (대표)',
  '26': '더마크·모벤픽·뉴타운 — 호텔·리조트 송영',
  '27': '막탄 뉴타운·리조트권 — 무료 픽업·드랍 (예약)',
  '29': '제이파크·뉴타운 리조트 — 송영 문의',
  '33': '제이파크·뉴타운 — 픽업·드랍 (전화 예약)',
  '34': '마리바고·블루워터권 — 리조트 송영',
  '36': '마리바고·블루워터 — 픽업·드랍 (예약)',
  '37': '마리바고 리조트권 — 무료 픽업·드랍',
  '38': '마리바고 대표 크랩 — 리조트 무료 송영',
  '39': '화이트샌즈·인근 리조트 — 송영 문의',
  '48': '마리나·호텔권 — 픽업·드랍 협의',
  '49': '어메이징쇼·리조트 — 투어·식사 송영',
  '51': '막탄 뉴타운·리조트 — 픽업·드랍 (예약)',
  '53': '새벽 투어·리조트 — 심야 송영·픽업 문의',
};

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
const enriched = data.map((r) => {
  const note = PICKUP_DROP[r.id];
  return {
    ...r,
    pickupDrop: Boolean(note),
    ...(note ? { pickupDropNote: note } : {}),
  };
});

writeFileSync(jsonPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');
console.log(
  `pickupDrop: ${enriched.filter((r) => r.pickupDrop).length} / ${enriched.length}`
);
