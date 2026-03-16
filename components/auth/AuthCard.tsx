import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type AuthCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AuthCard({ children, style }: AuthCardProps) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.cardBackground,
          borderRadius: colors.cardBorderRadius,
          paddingHorizontal: colors.cardPaddingH,
          paddingVertical: colors.cardPaddingV,
          alignItems: 'center',
          shadowColor: colors.cardShadowColor,
          shadowOpacity: colors.cardShadowOpacity,
          shadowRadius: colors.cardShadowRadius,
          shadowOffset: colors.cardShadowOffset,
          elevation: 6,
        },
        style,
      ]}>
      {children}
    </View>
  );
}
