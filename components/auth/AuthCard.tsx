import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type AuthCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AuthCard({ children, style }: AuthCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Theme.cardBackground,
          borderRadius: Theme.cardBorderRadius,
          paddingHorizontal: Theme.cardPaddingH,
          paddingVertical: Theme.cardPaddingV,
          alignItems: 'center',
          shadowColor: Theme.cardShadowColor,
          shadowOpacity: Theme.cardShadowOpacity,
          shadowRadius: Theme.cardShadowRadius,
          shadowOffset: Theme.cardShadowOffset,
          elevation: 6,
        },
        style,
      ]}>
      {children}
    </View>
  );
}
