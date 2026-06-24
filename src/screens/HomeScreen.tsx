import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { DiningGuideIconCards } from '../components/DiningGuideIconCards';
import { MactanPlacesGuide } from '../components/MactanPlacesGuide';
import { RelatedApps, NAV_H } from '../components/RelatedApps';
import { ScreenBackground } from '../components/ScreenBackground';
import { restaurants } from '../data/restaurants';
import { RootStackScreenProps } from '../navigation/types';
import { toMobileNaverBlogUrl } from '../utils/naverBlogUrl';
import {
  isExternalMapOrWebUrl,
  openExternalUrl,
  openUrlInSameWindow,
} from '../utils/openExternalUrl';

type Props = RootStackScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [nightMarketMode, setNightMarketMode] = useState(false);
  const [selectedNightMarketId, setSelectedNightMarketId] = useState<string | null>(null);

  const handleOpenLink = useCallback(
    (url: string, title: string) => {
      if (/pf\.kakao\.com/i.test(url)) {
        navigation.navigate('BlogWebView', { url, title });
        return;
      }
      // 네이버 카페는 iframe/인앱 WebView 임베드를 차단(하얀 화면)하므로
      // m.blog 변환을 건너뛰고, 새 탭이 아닌 현재 창에서 그대로 이동한다.
      // (모바일 주소 m.cafe.naver.com 체계는 그대로 유지)
      if (/cafe\.naver\.com/i.test(url)) {
        openUrlInSameWindow(url);
        return;
      }
      if (isExternalMapOrWebUrl(url)) {
        openExternalUrl(url);
        return;
      }
      navigation.navigate('BlogWebView', { url: toMobileNaverBlogUrl(url), title });
    },
    [navigation]
  );

  const handleNightMarketModeChange = useCallback((active: boolean) => {
    setNightMarketMode(active);
    if (!active) {
      setSelectedNightMarketId(null);
    }
  }, []);

  const handleSelectNightMarket = useCallback((id: string) => {
    setSelectedNightMarketId(id);
  }, []);

  const handleClearNightMarketSelection = useCallback(() => {
    setSelectedNightMarketId(null);
  }, []);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.app}>
          <MactanPlacesGuide
            restaurants={restaurants}
            onOpenLink={handleOpenLink}
            nightMarketMode={nightMarketMode}
            selectedNightMarketId={selectedNightMarketId}
            onSelectNightMarket={handleSelectNightMarket}
            onClearNightMarketSelection={handleClearNightMarketSelection}
            listContentStyle={{ paddingBottom: NAV_H + 16 }}
            listHeaderTop={
              <View style={styles.heroWrap}>
                <AppHeader />
                <DiningGuideIconCards
                  onOpenLink={handleOpenLink}
                  nightMarketMode={nightMarketMode}
                  onNightMarketModeChange={handleNightMarketModeChange}
                  selectedNightMarketId={selectedNightMarketId}
                  onSelectNightMarket={handleSelectNightMarket}
                />
              </View>
            }
          />
          <RelatedApps />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  app: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    position: 'relative',
  },
  heroWrap: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
});
