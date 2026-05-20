import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

export function AppHeader() {
  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>Philippines · Cebu</Text>
      <Text style={styles.title}>막탄 맛집 & 카페 가이드</Text>
      <Text style={styles.sub}>
        <Text style={styles.subStrong}>막탄</Text> 맛집·카페 53곳을 지도와 목록으로
        안내합니다. 세부여행플래너 블로그 후기와 연결됩니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 20,
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
