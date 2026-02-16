import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

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
          style={styles.pill}
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
    marginBottom: 16,
  },
  row: {
    paddingRight: 6,
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 14,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  pillText: {
    fontSize: 12.8,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
});
