import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type LabeledInputProps = TextInputProps & {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  rightLabel?: string;
  onRightLabelPress?: () => void;
  rightInputElement?: React.ReactNode;
};

export default function LabeledInput({
  label,
  containerStyle,
  labelStyle,
  inputStyle,
  rightLabel,
  onRightLabelPress,
  rightInputElement,
  ...inputProps
}: LabeledInputProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {rightLabel ? (
          onRightLabelPress ? (
            <Pressable onPress={onRightLabelPress}>
              <Text style={styles.rightLabel}>{rightLabel}</Text>
            </Pressable>
          ) : (
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          )
        ) : null}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          {...inputProps}
          style={[styles.input, inputStyle]}
          placeholderTextColor={inputProps.placeholderTextColor ?? colors.inputPlaceholder}
        />
        {rightInputElement ? <View style={styles.inputRight}>{rightInputElement}</View> : null}
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rightLabel: {
    fontSize: 12.5,
    color: colors.link,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: colors.inputBorderRadius,
    borderWidth: 1,
    borderColor: colors.borderInput,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputRight: {
    paddingLeft: 6,
  },
});
