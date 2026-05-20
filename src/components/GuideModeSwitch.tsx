import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { GuideListMode } from '../types/restaurant';

interface GuideModeSwitchProps {
  mode: GuideListMode;
  pickupCount: number;
  resortMealCount: number;
  resortDiningCount: number;
  totalCount: number;
  onChange: (mode: GuideListMode) => void;
}

const TABS: {
  key: GuideListMode;
  label: string;
  countKey: 'total' | 'pickup' | 'meal' | 'dining';
  activeStyle: 'tabActive' | 'tabActivePickup' | 'tabActiveMeal' | 'tabActiveResort';
}[] = [
  { key: 'all', label: '전체 맛집', countKey: 'total', activeStyle: 'tabActive' },
  { key: 'pickupDrop', label: '🚐 픽업·드랍', countKey: 'pickup', activeStyle: 'tabActivePickup' },
  {
    key: 'resortMeal',
    label: '🍳 밖에서 식사',
    countKey: 'meal',
    activeStyle: 'tabActiveMeal',
  },
  {
    key: 'resortDining',
    label: '🏨 리조트 다이닝',
    countKey: 'dining',
    activeStyle: 'tabActiveResort',
  },
];

export function GuideModeSwitch({
  mode,
  pickupCount,
  resortMealCount,
  resortDiningCount,
  totalCount,
  onChange,
}: GuideModeSwitchProps) {
  const counts = {
    total: totalCount,
    pickup: pickupCount,
    meal: resortMealCount,
    dining: resortDiningCount,
  };

  const renderTab = (tab: (typeof TABS)[number]) => {
    const isActive = mode === tab.key;
    return (
      <Pressable
        key={tab.key}
        onPress={() => onChange(tab.key)}
        style={[styles.tab, isActive && styles[tab.activeStyle]]}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {tab.label}
        </Text>
        <Text style={[styles.tabSub, isActive && styles.tabSubActive]}>
          {counts[tab.countKey]}곳
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>탭을 눌러 목록·지도를 전환하세요</Text>
      <View style={styles.row}>
        {renderTab(TABS[0]!)}
        {renderTab(TABS[1]!)}
      </View>
      <View style={styles.row}>
        {renderTab(TABS[2]!)}
        {renderTab(TABS[3]!)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    marginBottom: 12,
  },
  hint: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.tabIdleBorder,
    backgroundColor: colors.tabSubIdleBg,
    alignItems: 'center',
    opacity: 0.7,
  },
  tabActive: {
    opacity: 1,
    backgroundColor: colors.mactanActiveBg,
    borderColor: colors.mactanActiveBorder,
  },
  tabActivePickup: {
    opacity: 1,
    backgroundColor: 'rgba(180, 83, 9, 0.55)',
    borderColor: 'rgba(251, 191, 36, 0.75)',
  },
  tabActiveMeal: {
    opacity: 1,
    backgroundColor: 'rgba(5, 150, 105, 0.55)',
    borderColor: 'rgba(110, 231, 183, 0.75)',
  },
  tabActiveResort: {
    opacity: 1,
    backgroundColor: 'rgba(26, 115, 232, 0.55)',
    borderColor: 'rgba(147, 197, 253, 0.75)',
  },
  tabText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.tabIdleText,
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.mactanActiveText,
  },
  tabSub: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  tabSubActive: {
    color: '#f0f9ff',
  },
});
