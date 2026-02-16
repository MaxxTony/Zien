import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

export type LeadBadgeTone = 'hot' | 'new' | 'muted';

type LeadRowProps = {
  name: string;
  note: string;
  badge: string;
  badgeTone: LeadBadgeTone;
  color: string;
  onPress?: () => void;
};

const badgeStyles: Record<LeadBadgeTone, { bg: string; border: string; text: string }> = {
  hot: { bg: Theme.badgeHotBg, border: Theme.badgeHotBorder, text: Theme.textHot },
  new: { bg: Theme.badgeNewBg, border: Theme.badgeNewBorder, text: Theme.accentTeal },
  muted: { bg: Theme.badgeMutedBg, border: Theme.badgeMutedBorder, text: Theme.textSecondary },
};

function LeadRowComponent({ name, note, badge, badgeTone, color, onPress }: LeadRowProps) {
  const badgeStyle = badgeStyles[badgeTone];

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.note}>{note}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
        <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{badge}</Text>
      </View>
    </Pressable>
  );
}

export const LeadRow = memo(LeadRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.rowBorder,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  note: {
    marginTop: 2,
    fontSize: 12.5,
    fontWeight: '700',
    color: Theme.textSecondary,
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
});
