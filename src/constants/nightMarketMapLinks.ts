import { nightMarkets } from '../data/nightMarkets';

export interface NightMarketBlogLink {
  label: string;
  url: string;
  blogTitle: string;
  emoji: string;
}

const BLOG_LINK_SPECS: { marketId: string; label: string; emoji: string }[] = [
  { marketId: 'nm3', label: '세부 수그보 메르카도', emoji: '🍴' },
  { marketId: 'nm4', label: '세부 푸소 빌리지', emoji: '🏙️' },
  { marketId: 'nm1', label: '막탄 메르카토', emoji: '⛺' },
  { marketId: 'nm2', label: '막탄 푸드파크', emoji: '🍔' },
];

function buildNightMarketBlogLinks(): NightMarketBlogLink[] {
  return BLOG_LINK_SPECS.flatMap(({ marketId, label, emoji }) => {
    const market = nightMarkets.find((m) => m.id === marketId);
    if (!market?.blogUrl) {
      return [];
    }
    return [
      {
        label,
        url: market.blogUrl,
        blogTitle: market.blogTitle ?? label,
        emoji,
      },
    ];
  });
}

/** 야시장 생생 후기 블로그 바로가기 (가로 4열) */
export const NIGHT_MARKET_BLOG_LINKS: NightMarketBlogLink[] = buildNightMarketBlogLinks();

/** @deprecated NIGHT_MARKET_BLOG_LINKS 사용 */
export const NIGHT_MARKET_MAP_LINKS = NIGHT_MARKET_BLOG_LINKS;

export const NIGHT_MARKET_LINK_ICON_COLOR = '#99f6e4';
export const NIGHT_MARKET_LINK_ICON_SIZE = 18;
