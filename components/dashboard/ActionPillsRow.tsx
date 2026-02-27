import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

export type ActionPillItem = {
  label: string;
  icon: string;
  route?: Href;
};

type ActionPillsRowProps = {
  items: ActionPillItem[];
};

function ActionPillsRowComponent({ items }: ActionPillsRowProps) {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {items.map((action) => (
        <Pressable
          key={action.label}
          onPress={() => action.route && router.push(action.route)}
          style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
        >
          <MaterialCommunityIcons
            name={action.icon as any}
            size={16}
            color={Theme.textPrimary}
          />
          <Text style={styles.pillText}>{action.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export const ActionPillsRow = memo(ActionPillsRowComponent);

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 20,
    marginHorizontal: -18,
  },
  row: {
    paddingHorizontal: 18,
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(225,232,242,0.9)',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#0A2F48',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pillPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.textPrimary,
    letterSpacing: 0.1,
  },
});
