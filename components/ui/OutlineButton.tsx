import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type OutlineButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export default function OutlineButton({
  title,
  onPress,
  style,
  textStyle,
  disabled,
}: OutlineButtonProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <Pressable
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  button: {
    borderRadius: colors.buttonBorderRadius,
    borderWidth: 1,
    borderColor: colors.outlineButtonBorder,
    backgroundColor: colors.outlineButtonBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.outlineButtonText,
    fontSize: 14.5,
    fontWeight: '600',
  },
});
