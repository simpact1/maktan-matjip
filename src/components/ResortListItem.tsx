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
        accessibilityState={{ expanded: isOpen }}
      >
        <View style={guideStyles.itemTitleRow}>
          <Text style={guideStyles.itemTitle}>🏨 {resort.name}</Text>
          <View style={guideStyles.itemTags}>
            <Text style={[guideStyles.itemTag, guideStyles.resortTag]}>리조트</Text>
            <Text style={[guideStyles.itemTag, guideStyles.itemTagMealBreakfast]}>
              🌅 조식
            </Text>
            <Text style={[guideStyles.itemTag, guideStyles.itemTagMealDinner]}>
              🌙 석식
            </Text>
          </View>
        </View>
        <Text style={guideStyles.chev}>{isOpen ? '▲' : '▼'}</Text>
      </Pressable>
      {isOpen && (
        <View style={guideStyles.itemDetail}>
          <Text style={guideStyles.resortMealBlock}>
            <Text style={guideStyles.resortMealLabel}>🍳 조식 실전 가이드{'\n'}</Text>
            {resort.breakfast}
          </Text>
          <Text style={guideStyles.resortMealBlock}>
            <Text style={guideStyles.resortMealLabel}>🍽️ 석식 다이닝/뷔페 팁{'\n'}</Text>
            {resort.dinner}
          </Text>
        </View>
      )}
    </View>
  );
}
