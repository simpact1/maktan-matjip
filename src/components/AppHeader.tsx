import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PARTNER_LINKS } from '../constants/partnerLinks';
import { colors, fonts } from '../constants/theme';

interface AppHeaderProps {
  onOpenLink: (url: string, title: string) => void;
}

export function AppHeader({ onOpenLink }: AppHeaderProps) {
  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>Philippines · Cebu</Text>
      <Text style={styles.title}>막탄 맛집 & 카페 가이드</Text>
      <Text style={styles.sub}>
        <Text style={styles.subStrong}>막탄</Text> 맛집·카페 53곳을 지도와 목록으로
        안내합니다. 세부여행플래너 블로그 후기와 연결됩니다.
      </Text>

      <View style={styles.partner}>
        <Text style={styles.partnerTitle}>세부여행플래너</Text>
        <View style={styles.partnerLinks}>
          <Pressable
            onPress={() =>
              onOpenLink(PARTNER_LINKS.naverBlog, '세부여행정보')
            }
            style={({ pressed }) => [
              styles.plink,
              styles.plinkNaver,
              pressed && styles.plinkPressed,
            ]}
            accessibilityRole="link"
            accessibilityLabel="세부여행정보"
          >
            <Text style={styles.plinkNaverText}>세부여행정보</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              onOpenLink(PARTNER_LINKS.kakaoChannel, '카카오톡 채널')
            }
            style={({ pressed }) => [
              styles.plink,
              styles.plinkKakao,
              pressed && styles.plinkPressed,
            ]}
            accessibilityRole="link"
            accessibilityLabel="카카오톡 채널"
          >
            <Text style={styles.plinkKakaoText}>카카오톡 채널</Text>
          </Pressable>
        </View>
      </View>
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
  partner: {
    marginTop: 14,
    paddingTop: 14,
    width: '100%',
    maxWidth: 360,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    alignItems: 'center',
  },
  partnerTitle: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.accent,
    marginBottom: 10,
  },
  partnerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  plink: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 130,
    alignItems: 'center',
  },
  plinkPressed: {
    opacity: 0.88,
  },
  plinkNaver: {
    backgroundColor: '#03c75a',
  },
  plinkNaverText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: '#ffffff',
  },
  plinkKakao: {
    backgroundColor: '#fee500',
  },
  plinkKakaoText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: '#191919',
  },
});
