import { StyleProp, Text, TextStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type AuthSubtitleProps = {
  children: string;
  style?: StyleProp<TextStyle>;
  center?: boolean;
};

export default function AuthSubtitle({ children, style, center }: AuthSubtitleProps) {
  const { colors } = useAppTheme();
  return (
    <Text
      style={[
        {
          fontSize: 13.5,
          color: colors.textSecondary,
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
