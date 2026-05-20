import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { gradient } from '../constants/theme';

interface ScreenBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function ScreenBackground({ children, style }: ScreenBackgroundProps) {
  return (
    <LinearGradient
      colors={[...gradient.colors]}
      start={gradient.start}
      end={gradient.end}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
