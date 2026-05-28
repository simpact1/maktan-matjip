import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { DiningGuideIconCards } from '../components/DiningGuideIconCards';
import { MactanPlacesGuide } from '../components/MactanPlacesGuide';
import { ScreenBackground } from '../components/ScreenBackground';
import { restaurants } from '../data/restaurants';
import { RootStackScreenProps } from '../navigation/types';
import { toMobileNaverBlogUrl } from '../utils/naverBlogUrl';
import { isExternalMapOrWebUrl, openExternalUrl } from '../utils/openExternalUrl';

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
            listHeaderTop={
              <View style={styles.heroWrap}>
                <AppHeader onOpenLink={handleOpenLink} />
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
  },
  heroWrap: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
});
