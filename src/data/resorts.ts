import { MactanResort } from '../types/resort';
import rawResorts from './mactanResorts.json';

/**
 * 지도 마커 좌표 강제 고정 (OpenStreetMap 육지 검증값).
 * JSON 캐시·번들 지연과 무관하게 런타임에 적용한다.
 */
const RESORT_COORDINATE_OVERRIDES: Record<
  string,
  { lat: number; lng: number }
> = {
  /** Crimson Resort and Spa Mactan — Seascapes Resort Town 메인 로비 */
  r6: { lat: 10.2971, lng: 124.014 },
  /** The Reef Island Resort Mactan — 모벤픽 인접 해안선 */
  r7: { lat: 10.30995, lng: 124.02385 },
  /** Plantation Bay Resort — Marigondon 메인 로비 (육지 검증) */
  r10: { lat: 10.2625, lng: 123.9802 },
};

export const mactanResorts: MactanResort[] = (
  rawResorts as MactanResort[]
).map((resort) => {
  const override = RESORT_COORDINATE_OVERRIDES[resort.id];
  return override ? { ...resort, lat: override.lat, lng: override.lng } : resort;
});
