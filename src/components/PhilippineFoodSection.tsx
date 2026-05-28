import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  PHILIPPINE_FOOD_ITEMS,
  PHILIPPINE_FOOD_SUBTITLE,
} from '../constants/philippineFoodItems';
import { fonts } from '../constants/theme';

type Props = {
  onOpenLink: (url: string, title: string) => void;
};

export function PhilippineFoodSection({ onOpenLink }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text accessibilityElementsHidden>🍖 </Text>
          필리핀 음식
        </Text>
        <Text style={styles.subtitle}>{PHILIPPINE_FOOD_SUBTITLE}</Text>
      </View>

      <View style={styles.grid}>
        {PHILIPPINE_FOOD_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onOpenLink(item.link, item.blogTitle)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="link"
            accessibilityLabel={item.title}
            accessibilityHint={`${item.blogTitle} 블로그로 이동합니다`}
          >
            <Text style={styles.emoji} accessibilityElementsHidden>
              {item.emoji}
            </Text>
            <Text
              style={styles.cardLabel}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#062d3d',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 6px rgba(0,0,0,0.25)' } as object)
      : null),
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: '#ffffff',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: '#d1d5db',
    marginTop: 4,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  card: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    minHeight: 90,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#0c4a60',
    borderWidth: 1,
    borderColor: '#176a84',
  },
  cardPressed: {
    backgroundColor: '#115b75',
    opacity: 0.95,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 4,
  },
  cardLabel: {
    width: '100%',
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 2,
    ...(Platform.OS === 'web'
      ? ({
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        } as object)
      : null),
  },
});
