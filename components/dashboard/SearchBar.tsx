import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type SearchBarProps = {
  placeholder?: string;
};

function SearchBarComponent({
  placeholder = 'Where is your daily intelligence..',
}: SearchBarProps) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.card}
        onPress={() => router.push('/(main)/chat-modal')}
      >
        <MaterialCommunityIcons name="plus" size={20} color={Theme.iconMuted} />

        <Text style={styles.input}>
          {placeholder}
        </Text>

        <View style={styles.micWrap}>
          <View style={styles.micButton}>
            <MaterialCommunityIcons
              name="microphone-outline"
              size={18}
              color={Theme.iconMuted}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export const SearchBar = memo(SearchBarComponent);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF', // Clean white background like ChatGPT
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    borderRadius: 30, // Highly rounded pills
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    minHeight: 56, // Tall, touchable area
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: Theme.textSecondary,
    paddingVertical: 0,
  },

  // normal mic
  micWrap: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Theme.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
