import type { ComponentProps } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { nightMarkets } from '../data/nightMarkets';

type Fa6IconName = ComponentProps<typeof FontAwesome6>['name'];

export interface NightMarketBlogLink {
  label: string;
  url: string;
  blogTitle: string;
  icon: Fa6IconName;
}

const mercadoMactan = nightMarkets.find((m) => m.id === 'nm1')!;
const foodCamp = nightMarkets.find((m) => m.id === 'nm2')!;
const sugboItPark = nightMarkets.find((m) => m.id === 'nm3')!;
const pusoVillage = nightMarkets.find((m) => m.id === 'nm4')!;

/** 야시장 생생 후기 블로그 바로가기 (가로 4열) */
export const NIGHT_MARKET_BLOG_LINKS: NightMarketBlogLink[] = [
  {
    label: '세부 수그보 메르카도',
    url: sugboItPark.blogUrl,
    blogTitle: sugboItPark.blogTitle,
    icon: 'utensils',
  },
  {
    label: '세부 푸소 빌리지',
    url: pusoVillage.blogUrl,
    blogTitle: pusoVillage.blogTitle,
    icon: 'city',
  },
  {
    label: '막탄 메르카토',
    url: mercadoMactan.blogUrl,
    blogTitle: mercadoMactan.blogTitle,
    icon: 'tent',
  },
  {
    label: '막탄 푸드파크',
    url: foodCamp.blogUrl,
    blogTitle: foodCamp.blogTitle,
    icon: 'burger',
  },
];

/** @deprecated NIGHT_MARKET_BLOG_LINKS 사용 */
export const NIGHT_MARKET_MAP_LINKS = NIGHT_MARKET_BLOG_LINKS;

export const NIGHT_MARKET_LINK_ICON_COLOR = '#99f6e4';
export const NIGHT_MARKET_LINK_ICON_SIZE = 18;
