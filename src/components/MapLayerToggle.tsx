import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

interface MapLayerToggleProps {
  showRestaurants: boolean;
  showResorts: boolean;
  restaurantCount: number;
  resortCount: number;
  onToggleRestaurants: () => void;
  onToggleResorts: () => void;
}

export function MapLayerToggle({
  showRestaurants,
  showResorts,
  restaurantCount,
  resortCount,
  onToggleRestaurants,
  onToggleResorts,
}: MapLayerToggleProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>지도 레이어</Text>
      <View style={styles.row}>
        <Pressable
          onPress={onToggleRestaurants}
          style={[styles.chip, showRestaurants && styles.chipRestaurantOn]}
        >
          <Text style={[styles.chipText, showRestaurants && styles.chipTextOn]}>
            🍖 맛집 {restaurantCount}
          </Text>
        </Pressable>
        <Pressable
          onPress={onToggleResorts}
          style={[styles.chip, showResorts && styles.chipResortOn]}
        >
          <Text style={[styles.chipText, showResorts && styles.chipTextOn]}>
            🏨 리조트 {resortCount}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.tabIdleBorder,
    backgroundColor: colors.tabSubIdleBg,
    alignItems: 'center',
    opacity: 0.55,
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
