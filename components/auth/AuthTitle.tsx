import { StyleProp, Text, TextStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type AuthTitleProps = {
  children: string;
  style?: StyleProp<TextStyle>;
};

export default function AuthTitle({ children, style }: AuthTitleProps) {
  const { colors } = useAppTheme();
  return (
    <Text
      style={[
        { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
        style,
      ]}>
      {children}
    </Text>
  );
}
