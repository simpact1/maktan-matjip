import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, gradient } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { toMobileNaverBlogUrl } from '../utils/naverBlogUrl';
import { openUrlInSameWindow } from '../utils/openExternalUrl';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogWebView'>;

// 네이버 카페 등 iframe 임베드를 차단하는 도메인은 인앱 WebView에서 하얀 화면이 뜬다.
function isEmbedBlockedUrl(url: string): boolean {
  return /cafe\.naver\.com/i.test(url);
}

export function BlogWebViewScreen({ navigation, route }: Props) {
  const { url, title } = route.params;
  const embedBlocked = isEmbedBlockedUrl(url);
  const mobileUrl = embedBlocked ? url : toMobileNaverBlogUrl(url);

  useEffect(() => {
    if (embedBlocked) {
      openUrlInSameWindow(url);
    }
  }, [embedBlocked, url]);

  return (
    <LinearGradient
      colors={[...gradient.colors]}
      start={gradient.start}
      end={gradient.end}
      style={styles.fill}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← 닫기</Text>
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {embedBlocked ? (
          <View style={styles.fallbackWrap}>
            <Text style={styles.fallbackTitle}>네이버 카페 후기</Text>
            <Text style={styles.fallbackText}>
              네이버 카페 후기로 이동합니다. 이동되지 않으면 아래 버튼을 눌러주세요.
              브라우저 뒤로가기로 앱으로 돌아올 수 있습니다.
            </Text>
            <Pressable
              onPress={() => openUrlInSameWindow(url)}
              style={({ pressed }) => [
                styles.fallbackButton,
                pressed && styles.fallbackButtonPressed,
              ]}
              accessibilityRole="link"
              accessibilityLabel="카페 후기 보기"
            >
              <Text style={styles.fallbackButtonText}>카페 후기 보기</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.webWrap}>
            <iframe
              title={title}
              src={mobileUrl}
              style={iframeStyle}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const iframeStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
  backgroundColor: '#fff',
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    gap: 8,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.link,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  webWrap: {
    flex: 1,
    margin: 10,
    borderRadius: 9,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  fallbackWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 14,
  },
  fallbackTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
  },
  fallbackText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 360,
  },
  fallbackButton: {
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 9,
    backgroundColor: '#03c75a',
  },
  fallbackButtonPressed: {
    opacity: 0.88,
  },
  fallbackButtonText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: '#ffffff',
  },
});
