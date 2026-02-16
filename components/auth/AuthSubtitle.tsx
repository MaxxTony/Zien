import { StyleProp, Text, TextStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type AuthSubtitleProps = {
  children: string;
  style?: StyleProp<TextStyle>;
  center?: boolean;
};

export default function AuthSubtitle({ children, style, center }: AuthSubtitleProps) {
  return (
    <Text
      style={[
        {
          fontSize: 13.5,
          color: Theme.textSecondary,
          marginTop: 6,
          marginBottom: 18,
        },
        center && { textAlign: 'center' },
        style,
      ]}>
      {children}
    </Text>
  );
}
