import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type AuthScreenBackgroundProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  colors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

export default function AuthScreenBackground({
  children,
  style,
  colors: customBackgroundColors,
  start = { x: 0.1, y: 0 },
  end = { x: 0.9, y: 1 },
}: AuthScreenBackgroundProps) {
  const { colors } = useAppTheme();
  const appliedColors = (customBackgroundColors || colors.backgroundGradient) as any;
  
  return (
    <LinearGradient colors={appliedColors} start={start} end={end} style={[{ flex: 1 }, style]}>
      {children}
    </LinearGradient>
  );
}
