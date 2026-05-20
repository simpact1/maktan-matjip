import { BlogLink, Restaurant } from '../types/restaurant';

export function getRestaurantLinks(restaurant: Restaurant): BlogLink[] {
  if (restaurant.links?.length) {
    return restaurant.links;
  }

  if (restaurant.link) {
    return [{ text: '블로그 후기 보기', url: restaurant.link }];
  }

  return [];
}
