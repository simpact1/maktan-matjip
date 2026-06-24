import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { GuideListMode } from '../types/restaurant';

interface GuideModeSwitchProps {
  mode: GuideListMode;
  mapActive: boolean;
  pickupCount: number;
  viewSpotCount: number;
  resortDiningCount: number;
  totalCount: number;
  onChange: (mode: GuideListMode) => void;
}

const TABS: {
  key: GuideListMode;
  label: string;
  countKey: 'total' | 'pickup' | 'view' | 'dining';
  activeStyle: 'tabActive' | 'tabActivePickup' | 'tabActiveMeal' | 'tabActiveResort';
}[] = [
  { key: 'all', label: '전체 맛집', countKey: 'total', activeStyle: 'tabActive' },
  { key: 'pickupDrop', label: '🚐 픽업·드랍', countKey: 'pickup', activeStyle: 'tabActivePickup' },
  {
    key: 'viewSpots',
    label: '🌅 뷰/야경맛집',
    countKey: 'view',
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
  mapActive,
  pickupCount,
  viewSpotCount,
  resortDiningCount,
  totalCount,
  onChange,
}: GuideModeSwitchProps) {
  const counts = {
    total: totalCount,
    pickup: pickupCount,
    view: viewSpotCount,
    dining: resortDiningCount,
  };

  const renderTab = (tab: (typeof TABS)[number]) => {
    const isSelected = mode === tab.key;
    const isMapOn = isSelected && mapActive;
    return (
      <Pressable
        key={tab.key}
        onPress={() => onChange(tab.key)}
        style={[
          styles.tab,
          isSelected && styles[tab.activeStyle],
          isSelected && !isMapOn && styles.tabMapOff,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, expanded: isMapOn }}
        accessibilityLabel={`${tab.label} ${counts[tab.countKey]}곳`}
      >
        <Text
          style={[
            styles.tabText,
            isSelected && styles.tabTextActive,
            isSelected && !isMapOn && styles.tabTextMapOff,
          ]}
        >
          {tab.label}
        </Text>
        <Text
          style={[
            styles.tabSub,
            isSelected && styles.tabSubActive,
            isSelected && !isMapOn && styles.tabSubMapOff,
          ]}
        >
          {isMapOn ? `${counts[tab.countKey]}곳` : '지도 숨김'}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap}>
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
    marginBottom: 8,
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
  /** 선택된 탭이지만 지도 마커 숨김 */
  tabMapOff: {
    opacity: 0.55,
    borderStyle: 'dashed',
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
  tabTextMapOff: {
    color: colors.tabIdleText,
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
  tabSubMapOff: {
    color: colors.textMuted,
  },
});
