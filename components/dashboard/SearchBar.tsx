import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Theme } from '@/constants/theme';

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onMicPress?: () => void;
};

function SearchBarComponent({
  placeholder = 'Ask Zien to find properties, create content, or manage leads...',
  value,
  onChangeText,
  onMicPress,
}: SearchBarProps) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name="plus" size={18} color={Theme.iconMuted} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Theme.inputPlaceholder}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        multiline={false}
        returnKeyType="search"
      />
      <Pressable style={styles.micButton} onPress={onMicPress}>
        <MaterialCommunityIcons name="microphone-outline" size={18} color={Theme.iconMuted} />
      </Pressable>
    </View>
  );
}

export const SearchBar = memo(SearchBarComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
    color: Theme.textPrimary,
    paddingVertical: 0,
  },
  micButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Theme.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
