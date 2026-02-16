import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type AuthDividerProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export default function AuthDivider({ label = 'OR CONTINUE WITH', style }: AuthDividerProps) {
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
      <View style={{ flex: 1, height: 1, backgroundColor: Theme.divider }} />
      <Text
        style={{
          fontSize: 11,
          color: Theme.textDivider,
          letterSpacing: 1,
          fontWeight: '600',
        }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: Theme.divider }} />
    </View>
  );
}
