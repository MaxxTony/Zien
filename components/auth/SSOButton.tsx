import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type SSOButtonProps = {
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SSOButton({
  label = 'Sign in with SSO',
  onPress,
  style,
}: SSOButtonProps) {
  return (
    <Pressable
      style={[
        {
          marginTop: 12,
          backgroundColor: Theme.socialButtonBackground,
          borderWidth: 1,
          borderColor: Theme.socialButtonBorder,
          paddingVertical: 12,
          borderRadius: Theme.inputBorderRadius,
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        },
        style,
      ]}
      onPress={onPress}>
      <MaterialCommunityIcons name="layers-outline" size={18} color={Theme.iconPrimary} />
      <Text
        style={{
          fontSize: 13.5,
          color: Theme.socialButtonText,
          fontWeight: '600',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
