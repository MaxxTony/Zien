import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { Theme } from '@/constants/theme';
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
          <MaterialCommunityIcons name={!visible ? 'eye-off-outline' : 'eye-outline'} size={18} color={Theme.iconMuted} />
        </Pressable>
      }
    />
  );
}
