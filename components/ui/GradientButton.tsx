import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

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
  colors,
  style,
  textStyle,
}: GradientButtonProps) {
  const { colors: appColors } = useAppTheme();
  const styles = getStyles(appColors);
  const activeColors = colors ?? (appColors.brandGradient as any);

  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <LinearGradient colors={activeColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  button: {
    borderRadius: colors.buttonBorderRadius,
    overflow: 'hidden',
  },
  fill: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  text: {
    color: colors.gradientButtonText,
    fontSize: 14.5,
    fontWeight: '700',
  },
});
