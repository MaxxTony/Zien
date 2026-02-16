import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type GradientButtonProps = {
  title: string;
  onPress?: () => void;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function GradientButton({
  title,
  onPress,
  colors = [...Theme.brandGradient] as const,
  style,
  textStyle,
}: GradientButtonProps) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.buttonBorderRadius,
    overflow: 'hidden',
  },
  fill: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  text: {
    color: Theme.gradientButtonText,
    fontSize: 14.5,
    fontWeight: '700',
  },
});
