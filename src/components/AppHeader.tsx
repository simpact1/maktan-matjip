import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

export function AppHeader() {
  return (
    <View style={styles.hero}>
      <Text style={styles.title} accessibilityRole="header">세부·막탄 맛집 가이드</Text>
      <Text style={styles.sub}>
        <Text style={styles.subStrong}>현지 거주자가 직접 다녀온 막탄·세부 맛집 가이드.</Text> 지도 위치 확인부터 블로그 후기, 픽업드랍 예약까지 한 번에 해결하세요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 12,
  },
  eyebrow: {
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sub: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 360,
  },
  subStrong: {
    color: colors.accent,
    fontFamily: fonts.semiBold,
  },
});
