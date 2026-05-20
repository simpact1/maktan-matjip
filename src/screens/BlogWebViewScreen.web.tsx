import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CSSProperties } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, gradient } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogWebView'>;

export function BlogWebViewScreen({ navigation, route }: Props) {
  const { url, title } = route.params;

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
        <View style={styles.webWrap}>
          <iframe
            title={title}
            src={url}
            style={iframeStyle}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </View>
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
});
