import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type OutlineButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function OutlineButton({ title, onPress, style, textStyle }: OutlineButtonProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
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
  text: {
    color: colors.outlineButtonText,
    fontSize: 14.5,
    fontWeight: '600',
  },
});
