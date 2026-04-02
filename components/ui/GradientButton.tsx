import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle, ActivityIndicator } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type GradientButtonProps = {
  title: string;
  onPress?: () => void;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function GradientButton({
  title,
  onPress,
  colors,
  style,
  textStyle,
  isLoading,
  disabled,
}: GradientButtonProps) {
  const { colors: appColors } = useAppTheme();
  const styles = getStyles(appColors);
  const activeColors = colors ?? (appColors.brandGradient as any);

  return (
    <Pressable
      style={[styles.button, style, (disabled || isLoading) && styles.disabled]}
      onPress={(disabled || isLoading) ? undefined : onPress}
      disabled={disabled || isLoading}
    >
      <LinearGradient colors={activeColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
        {isLoading ? (
          <ActivityIndicator color={appColors.gradientButtonText} />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  button: {
    borderRadius: colors.buttonBorderRadius,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.6,
  },
  fill: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
  },
  text: {
    color: colors.gradientButtonText,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
