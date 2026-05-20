import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FilterOption } from '../constants/filters';
import { colors, fonts } from '../constants/theme';

interface TagFilterBarProps<T extends string> {
  label: string;
  options: readonly FilterOption<T>[] | readonly T[];
  selected: T | null;
  onSelect: (value: T | null) => void;
  showAllOption?: boolean;
}

function normalizeOptions<T extends string>(
  options: readonly FilterOption<T>[] | readonly T[]
): FilterOption<T>[] {
  if (options.length === 0) {
    return [];
  }
  const first = options[0];
  if (typeof first === 'string') {
    return (options as readonly T[]).map((value) => ({ value, label: value }));
  }
  return options as readonly FilterOption<T>[];
}

export function TagFilterBar<T extends string>({
  label,
  options,
  selected,
  onSelect,
  showAllOption = true,
}: TagFilterBarProps<T>) {
  const items = normalizeOptions(options);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipsWrap}>
        {showAllOption ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="전체"
            onPress={() => onSelect(null)}
            style={[styles.chip, selected === null ? styles.chipActive : styles.chipIdle]}
          >
            <Text style={[styles.chipText, selected === null && styles.chipTextActive]}>
              전체
            </Text>
          </Pressable>
        ) : null}
        {items.map((option) => {
          const isActive = selected === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              onPress={() => onSelect(isActive ? null : option.value)}
              style={[styles.chip, isActive ? styles.chipActive : styles.chipIdle]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
  },
  chipIdle: {
    opacity: 0.55,
    backgroundColor: colors.tabSubIdleBg,
    borderColor: colors.tabIdleBorder,
  },
  chipActive: {
    opacity: 1,
    backgroundColor: colors.mactanActiveBg,
    borderColor: colors.mactanActiveBorder,
  },
  chipText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.tabIdleText,
  },
  chipTextActive: {
    fontFamily: fonts.bold,
    color: colors.mactanActiveText,
  },
});
