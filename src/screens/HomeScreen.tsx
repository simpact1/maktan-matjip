import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { MactanPlacesGuide } from '../components/MactanPlacesGuide';
import { ScreenBackground } from '../components/ScreenBackground';
import { restaurants } from '../data/restaurants';
import { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const handleOpenLink = useCallback(
    (url: string, title: string) => {
      navigation.navigate('BlogWebView', { url, title });
    },
    [navigation]
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.app}>
          <MactanPlacesGuide
            restaurants={restaurants}
            onOpenLink={handleOpenLink}
            listHeaderTop={
              <View style={styles.heroWrap}>
                <AppHeader onOpenLink={handleOpenLink} />
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
