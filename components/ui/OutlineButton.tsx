import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { Theme } from '@/constants/theme';

type OutlineButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function OutlineButton({ title, onPress, style, textStyle }: OutlineButtonProps) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.buttonBorderRadius,
    borderWidth: 1,
    borderColor: Theme.outlineButtonBorder,
    backgroundColor: Theme.outlineButtonBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  text: {
    color: Theme.outlineButtonText,
    fontSize: 14.5,
    fontWeight: '600',
  },
});
