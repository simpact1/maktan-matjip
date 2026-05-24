import { Pressable, Text, View } from 'react-native';
import { getZoneLabel } from '../constants/filters';
import { guideStyles } from '../styles/guideStyles';
import { MactanResort } from '../types/resort';

interface ResortListItemProps {
  resort: MactanResort;
  isSelected: boolean;
  onSelect: () => void;
}

export function ResortListItem({ resort, isSelected, onSelect }: ResortListItemProps) {
  return (
    <View style={[guideStyles.item, isSelected && guideStyles.itemSelected]}>
      <Pressable
        style={guideStyles.itemBtn}
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityLabel={resort.name}
        accessibilityState={{ selected: isSelected }}
      >
        <View style={guideStyles.itemTitleRow}>
          <Text style={guideStyles.itemTitle}>🏨 {resort.name}</Text>
          <View style={guideStyles.itemTags}>
            <Text style={[guideStyles.itemTag, guideStyles.resortTag]}>리조트</Text>
            <Text style={[guideStyles.itemTag, guideStyles.itemTagZone]}>
              📍 {getZoneLabel(resort.zone)}
            </Text>
          </View>
        </View>
        <Text style={guideStyles.chev}>{isSelected ? '●' : '›'}</Text>
      </Pressable>
    </View>
  );
}
