import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';
import LabeledInput from './labeled-input';

type PasswordInputProps = {
  label?: string;
  placeholder?: string;
  rightLabel?: string;
  onRightLabelPress?: () => void;
};

export default function PasswordInput({
  label = 'Password',
  placeholder = '••••••••',
  rightLabel,
  onRightLabelPress,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const { colors } = useAppTheme();

  return (
    <LabeledInput
      label={label}
      placeholder={placeholder}
      secureTextEntry={!visible}
      autoCapitalize="none"
      rightLabel={rightLabel}
      onRightLabelPress={onRightLabelPress}
      rightInputElement={
        <Pressable onPress={() => setVisible((prev) => !prev)} hitSlop={8}>
          <MaterialCommunityIcons name={!visible ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.iconMuted} />
         </Pressable>
      }
    />
  );
}
