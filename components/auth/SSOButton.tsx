import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

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
  const { colors } = useAppTheme();
  return (
    <Pressable
      style={[
        {
          marginTop: 12,
          backgroundColor: colors.socialButtonBackground,
          borderWidth: 1,
          borderColor: colors.socialButtonBorder,
          paddingVertical: 12,
          borderRadius: colors.inputBorderRadius,
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        },
        style,
      ]}
      onPress={onPress}>
      <MaterialCommunityIcons name="layers-outline" size={18} color={colors.iconPrimary} />
      <Text
        style={{
          fontSize: 13.5,
          color: colors.socialButtonText,
          fontWeight: '600',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
