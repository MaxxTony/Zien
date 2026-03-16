import { ReactNode } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type AuthFooterLinkProps = {
  children: ReactNode;
  onPress?: () => void;
};

export function AuthFooterLink({ children, onPress }: AuthFooterLinkProps) {
  const { colors } = useAppTheme();
  return (
    <Text style={{ color: colors.link, fontWeight: '600' }} onPress={onPress}>
      {children}
    </Text>
  );
}

type AuthFooterProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AuthFooter({ children, style }: AuthFooterProps) {
  const { colors } = useAppTheme();
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
  const { colors } = useAppTheme();
  return <Text style={{ fontSize: 12.5, color: colors.textMuted }}>{children}</Text>;
}
