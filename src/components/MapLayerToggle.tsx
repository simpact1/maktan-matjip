import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

export type MapLayerMode = 'none' | 'all' | 'restaurants' | 'resorts';

interface MapLayerToggleProps {
  mode: MapLayerMode;
  restaurantCount: number;
  resortCount: number;
  onSelect: (mode: MapLayerMode) => void;
  /** 하단 필터만으로 맛집이 지도에 표시 중일 때 */
  restaurantsOnMap?: boolean;
  resortsOnMap?: boolean;
}

export function MapLayerToggle({
  mode,
  restaurantCount,
  resortCount,
  onSelect,
  restaurantsOnMap = false,
  resortsOnMap = false,
}: MapLayerToggleProps) {
  const select = (next: MapLayerMode) => {
    onSelect(mode === next ? 'none' : next);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>지도 레이어</Text>
      <Text style={styles.hint}>
        전체 · 맛집 · 리조트 또는 아래 위치·음식·동반자 필터를 선택하면 지도에
        바로 표시됩니다. 같은 버튼을 다시 누르면 숨겨집니다.
      </Text>
      <Text style={styles.mapLabel}>지도</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="전체"
          onPress={() => select('all')}
          style={[styles.chip, mode === 'all' && styles.chipAllOn]}
        >
          <Text style={[styles.chipText, mode === 'all' && styles.chipTextOn]}>
            전체
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`맛집 ${restaurantCount}`}
          onPress={() => select('restaurants')}
          style={[
            styles.chip,
            (mode === 'restaurants' ||
              (mode === 'none' && restaurantsOnMap && !resortsOnMap)) &&
              styles.chipRestaurantOn,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              (mode === 'restaurants' ||
                (mode === 'none' && restaurantsOnMap && !resortsOnMap)) &&
                styles.chipTextOn,
            ]}
          >
            🍖 맛집 {restaurantCount}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`리조트 ${resortCount}`}
          onPress={() => select('resorts')}
          style={[
            styles.chip,
            (mode === 'resorts' ||
              (mode === 'none' && resortsOnMap && !restaurantsOnMap)) &&
              styles.chipResortOn,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              (mode === 'resorts' ||
                (mode === 'none' && resortsOnMap && !restaurantsOnMap)) &&
                styles.chipTextOn,
            ]}
          >
            🏨 리조트 {resortCount}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  hint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 17,
    color: colors.textMuted,
    marginBottom: 10,
  },
  mapLabel: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.tabIdleBorder,
    backgroundColor: colors.tabSubIdleBg,
    alignItems: 'center',
    opacity: 0.55,
  },
  chipAllOn: {
    opacity: 1,
    backgroundColor: 'rgba(15, 118, 110, 0.55)',
    borderColor: 'rgba(94, 234, 212, 0.75)',
  },
  chipRestaurantOn: {
    opacity: 1,
    backgroundColor: 'rgba(234, 88, 12, 0.45)',
    borderColor: 'rgba(251, 146, 60, 0.75)',
  },
  chipResortOn: {
    opacity: 1,
    backgroundColor: 'rgba(26, 115, 232, 0.45)',
    borderColor: 'rgba(147, 197, 253, 0.75)',
  },
  chipText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.tabIdleText,
  },
  chipTextOn: {
    color: colors.text,
  },
});
