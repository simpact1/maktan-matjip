import { Pressable, Text, View } from 'react-native';
import { guideStyles } from '../styles/guideStyles';
import { MactanResort } from '../types/resort';

interface ResortListItemProps {
  resort: MactanResort;
  isOpen: boolean;
  onToggle: () => void;
}

export function ResortListItem({ resort, isOpen, onToggle }: ResortListItemProps) {
  return (
    <View style={guideStyles.item}>
      <Pressable
        style={guideStyles.itemBtn}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={resort.name}
        accessibilityState={{ expanded: isOpen }}
      >
        <View style={guideStyles.itemTitleRow}>
          <Text style={guideStyles.itemTitle}>🏨 {resort.name}</Text>
          <View style={guideStyles.itemTags}>
            <Text style={[guideStyles.itemTag, guideStyles.resortTag]}>리조트</Text>
          </View>
        </View>
        <Text style={guideStyles.chev}>{isOpen ? '▲' : '▼'}</Text>
      </Pressable>
      {isOpen && (
        <View style={guideStyles.itemDetail}>
          <Text style={guideStyles.resortMealBlock}>
            <Text style={guideStyles.resortMealLabel}>🍳 아침 식사 가이드{'\n'}</Text>
            {resort.breakfast}
          </Text>
          <Text style={guideStyles.resortMealBlock}>
            <Text style={guideStyles.resortMealLabel}>🍽️ 저녁 식사 가이드{'\n'}</Text>
            {resort.dinner}
          </Text>
          {resort.otherVenues.length > 0 ? (
            <View style={guideStyles.resortOtherBlock}>
              <Text style={guideStyles.resortOtherTitle}>
                🍴 리조트 내 기타 다이닝
              </Text>
              {resort.otherVenues.map((venue) => (
                <Text key={venue.name} style={guideStyles.resortOtherItem}>
                  <Text style={guideStyles.resortOtherName}>· {venue.name}</Text>
                  {' — '}
                  {venue.summary}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
