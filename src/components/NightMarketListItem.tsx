import { Pressable, Text, View } from 'react-native';
import { guideStyles } from '../styles/guideStyles';
import { NightMarket } from '../types/nightMarket';

interface NightMarketListItemProps {
  market: NightMarket;
  isSelected: boolean;
  onSelect: () => void;
}

const REGION_LABEL = {
  mactan: '막탄',
  'cebu-city': '세부시티',
} as const;

export function NightMarketListItem({ market, isSelected, onSelect }: NightMarketListItemProps) {
  return (
    <View style={[guideStyles.item, isSelected && guideStyles.itemSelectedNightMarket]}>
      <Pressable
        style={guideStyles.itemBtn}
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityLabel={market.name}
        accessibilityState={{ selected: isSelected }}
      >
        <View style={guideStyles.itemTitleRow}>
          <Text style={guideStyles.itemTitle}>🎪 {market.name}</Text>
          <View style={guideStyles.itemTags}>
            <Text style={[guideStyles.itemTag, guideStyles.nightMarketTag]}>
              🌙 {REGION_LABEL[market.region]}
            </Text>
          </View>
        </View>
        <Text style={guideStyles.chev}>{isSelected ? '●' : '›'}</Text>
      </Pressable>
    </View>
  );
}
