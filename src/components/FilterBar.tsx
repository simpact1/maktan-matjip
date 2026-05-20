import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { FILTER_OPTIONS } from '../constants/categories';
import { colors, fonts } from '../constants/theme';
import { FilterCategory } from '../types/restaurant';

interface FilterBarProps {
  selected: FilterCategory;
  onSelect: (category: FilterCategory) => void;
}

/** 세부가볼만한곳 pg-group-row--mactan · pg-tab-sub 스타일 */
export function FilterBar({ selected, onSelect }: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = selected === option.key;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            style={[styles.chip, isActive ? styles.chipActive : styles.chipIdle]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 2,
  },
  chipIdle: {
    opacity: 0.55,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderColor: colors.tabIdleBorder,
  },
  chipActive: {
    opacity: 1,
    backgroundColor: colors.mactanActiveBg,
    borderColor: colors.mactanActiveBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.tabIdleText,
  },
  chipTextActive: {
    fontFamily: fonts.bold,
    color: colors.mactanActiveText,
  },
});
