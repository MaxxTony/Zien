import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type AuthScreenBackgroundProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  colors?: readonly string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

export default function AuthScreenBackground({
  children,
  style,
  colors = Theme.backgroundGradient,
  start = { x: 0.1, y: 0 },
  end = { x: 0.9, y: 1 },
}: AuthScreenBackgroundProps) {
  return (
    <LinearGradient colors={[...colors]} start={start} end={end} style={[{ flex: 1 }, style]}>
      {children}
    </LinearGradient>
  );
}
