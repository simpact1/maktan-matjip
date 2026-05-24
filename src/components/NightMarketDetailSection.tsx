import { Pressable, Text, View } from 'react-native';
import { guideStyles } from '../styles/guideStyles';
import { NightMarket } from '../types/nightMarket';

interface NightMarketDetailSectionProps {
  market: NightMarket;
  onOpenLink?: (url: string, title: string) => void;
}

const REGION_LABEL = {
  mactan: '📍 막탄',
  'cebu-city': '📍 세부시티',
} as const;

export function NightMarketDetailSection({
  market,
  onOpenLink,
}: NightMarketDetailSectionProps) {
  return (
    <View style={guideStyles.nightMarketDetailSection}>
      <View style={guideStyles.nightMarketDetailHeader}>
        <Text style={guideStyles.nightMarketDetailTitle}>🎪 {market.name}</Text>
        <Text style={guideStyles.nightMarketDetailSubtitle}>{market.nameEn}</Text>
        <Text style={guideStyles.nightMarketDetailZone}>
          {REGION_LABEL[market.region]} · {market.locationDesc}
        </Text>
      </View>
      <View style={guideStyles.nightMarketDetailBody}>
        {onOpenLink ? (
          <View style={guideStyles.resortBlogLinkWrap}>
            <Pressable
              style={({ pressed }) => [
                guideStyles.resortBlogLinkBtn,
                pressed && guideStyles.resortBlogLinkBtnPressed,
              ]}
              onPress={() => onOpenLink(market.blogUrl, market.blogTitle)}
              accessibilityRole="link"
              accessibilityLabel="야시장 생생 후기 보기"
            >
              <Text style={guideStyles.resortBlogLinkText}>야시장 생생 후기 보기</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}
