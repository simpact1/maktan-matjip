import { Restaurant } from '../types/restaurant';
import rawData from './restaurants.json';

export const restaurants: Restaurant[] = rawData as Restaurant[];

/**
 * 픽업·드랍 탭 고정 허용 목록 (10곳).
 * 기존 pickupDrop 태그와 무관하게 이 ID만 노출한다.
 */
export const PICKUP_DROP_RESTAURANT_IDS = [
  '4', // 에이스크랩
  '21', // 씨푸드 부코 씨사이드
  '25', // 씨푸드 점보7
  '29', // 모닝글로리
  '36', // 마리바고 그릴
  '37', // 마리바고크랩
  '38', // 레드크랩
  '49', // 7107 레스토랑
  '51', // 막탄크랩
] as const;

const pickupDropIdOrder = new Map(
  PICKUP_DROP_RESTAURANT_IDS.map((id, index) => [id, index])
);

export const pickupDropRestaurants = restaurants
  .filter((r) => pickupDropIdOrder.has(r.id))
  .sort(
    (a, b) =>
      (pickupDropIdOrder.get(a.id) ?? 0) - (pickupDropIdOrder.get(b.id) ?? 0)
  );

export const resortMealRestaurants = restaurants.filter((r) => r.resortMeal.length > 0);

/**
 * 🌅 뷰/야경맛집 탭 고정 허용 목록 (13곳).
 * 동반자·메뉴 태그와 무관하게 이 ID만 노출한다.
 */
export const VIEW_SPOT_RESTAURANT_IDS = [
  '12', // 란타우 코르도바
  '21', // 씨푸드 부코 씨사이드
  '22', // 파롤라 (Parola Seaview)
  '26', // 카바나 (Cabana)
  '48', // 마리나 씨뷰
  '54', // 만송이 장미 카페
  '64', // 세부시티 안자니
  '65', // 세부시티 탑스힐
  '66', // 막탄그랜드골든호텔 루프탑
  '67', // 막탄 스케이프 스카이덱
  '68', // 세부시티 라 파리지엔 스카이
  '69', // 세부시티 미스터A
  '70', // 세부시티 Verified 루프탑
] as const;

const viewSpotIdOrder = new Map(
  VIEW_SPOT_RESTAURANT_IDS.map((id, index) => [id, index])
);

export const viewSpotRestaurants = restaurants
  .filter((r) => viewSpotIdOrder.has(r.id))
  .sort(
    (a, b) =>
      (viewSpotIdOrder.get(a.id) ?? 0) - (viewSpotIdOrder.get(b.id) ?? 0)
  );
