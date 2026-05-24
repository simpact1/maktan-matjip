import { NightMarket } from '../types/nightMarket';
import rawNightMarkets from './nightMarkets.json';

export const nightMarkets: NightMarket[] = rawNightMarkets as NightMarket[];

export const MACTAN_NIGHT_MARKETS = nightMarkets.filter((m) => m.region === 'mactan');
export const CEBU_CITY_NIGHT_MARKETS = nightMarkets.filter((m) => m.region === 'cebu-city');
