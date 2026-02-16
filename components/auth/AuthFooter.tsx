import { ReactNode } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type AuthFooterLinkProps = {
  children: ReactNode;
  onPress?: () => void;
};

export function AuthFooterLink({ children, onPress }: AuthFooterLinkProps) {
  return (
    <Text style={{ color: Theme.link, fontWeight: '600' }} onPress={onPress}>
      {children}
    </Text>
  );
}

type AuthFooterProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AuthFooter({ children, style }: AuthFooterProps) {
  return (
    <View
      style={[
        {
          marginTop: 16,
          alignItems: 'center',
          gap: 6,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

export function AuthFooterText({ children }: { children: ReactNode }) {
  return <Text style={{ fontSize: 12.5, color: Theme.textMuted }}>{children}</Text>;
}
