import { Image, ImageSourcePropType, Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type SocialButtonProps = {
  label: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SocialButton({ label, icon, onPress, style }: SocialButtonProps) {
  return (
    <Pressable
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: Theme.socialButtonBackground,
          borderWidth: 1,
          borderColor: Theme.socialButtonBorder,
          paddingVertical: 10,
          borderRadius: Theme.inputBorderRadius,
        },
        style,
      ]}
      onPress={onPress}>
      <Image source={icon} style={{ width: 18, height: 18 }} resizeMode="contain" />
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
