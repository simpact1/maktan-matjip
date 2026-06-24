import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../constants/theme';

export const NAV_H = 72;

const RELATED_APPS = [
  {
    emoji: '🏨',
    label: '숙소',
    url: 'https://cebu-accommodation-guide.vercel.app/',
    circleColor: 'rgba(59, 130, 246, 0.25)',
    circleBorder: 'rgba(147, 197, 253, 0.4)',
  },
  {
    emoji: '📍',
    label: '가볼만한곳',
    url: 'https://cebu-places-guide.vercel.app/',
    circleColor: 'rgba(16, 185, 129, 0.25)',
    circleBorder: 'rgba(110, 231, 183, 0.4)',
  },
  {
    emoji: '🚗',
    label: '교통',
    url: 'https://cebu-traffic-master.vercel.app/',
    circleColor: 'rgba(245, 158, 11, 0.25)',
    circleBorder: 'rgba(251, 191, 36, 0.4)',
  },
  {
    emoji: '📅',
    label: '일정',
    url: 'https://cebu-travel-schedule.vercel.app/',
    circleColor: 'rgba(168, 85, 247, 0.25)',
    circleBorder: 'rgba(216, 180, 254, 0.4)',
  },
];

export function RelatedApps() {
  return (
    <View style={styles.container}>
      {RELATED_APPS.map((app, index) => (
        <View key={app.label} style={styles.itemWrap}>
          {index > 0 && <View style={styles.divider} />}
          <Pressable
            onPress={() => Linking.openURL(app.url)}
            accessibilityRole="link"
            accessibilityLabel={app.label}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          >
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: app.circleColor,
                  borderColor: app.circleBorder,
                },
              ]}
            >
              <Text style={styles.emoji}>{app.emoji}</Text>
            </View>
            <Text style={styles.label}>{app.label}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_H,
    backgroundColor: 'rgba(4, 47, 46, 0.97)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(236, 254, 255, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  itemWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  itemPressed: {
    opacity: 0.6,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: '#cbd5e1',
    textAlign: 'center',
  },
});
