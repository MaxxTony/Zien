import { StyleProp, Text, TextStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type AuthTitleProps = {
  children: string;
  style?: StyleProp<TextStyle>;
};

export default function AuthTitle({ children, style }: AuthTitleProps) {
  return (
    <Text
      style={[
        { fontSize: 22, fontWeight: '700', color: Theme.textPrimary },
        style,
      ]}>
      {children}
    </Text>
  );
}
