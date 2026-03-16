import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type AuthDividerProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export default function AuthDivider({ label = 'OR CONTINUE WITH', style }: AuthDividerProps) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginTop: 18,
        },
        style,
      ]}>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.divider }} />
      <Text
        style={{
          fontSize: 11,
          color: colors.textDivider,
          letterSpacing: 1,
          fontWeight: '600',
        }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.divider }} />
    </View>
  );
}
