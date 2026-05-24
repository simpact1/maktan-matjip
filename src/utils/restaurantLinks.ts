import { BlogLink, Restaurant } from '../types/restaurant';
import { toMobileNaverBlogUrl } from './naverBlogUrl';

function normalizeLink(link: BlogLink): BlogLink {
  return { ...link, url: toMobileNaverBlogUrl(link.url) };
}

export function getRestaurantLinks(restaurant: Restaurant): BlogLink[] {
  if (restaurant.links?.length) {
    return restaurant.links.map(normalizeLink);
  }

  if (restaurant.link) {
    return [{ text: '블로그 후기 보기', url: toMobileNaverBlogUrl(restaurant.link) }];
  }

  return [];
}
