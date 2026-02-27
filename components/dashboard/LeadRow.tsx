import { Theme } from '@/constants/theme';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type LeadBadgeTone = 'hot' | 'new' | 'muted';

type LeadRowProps = {
  name: string;
  note: string;
  badge: string;
  badgeTone: LeadBadgeTone;
  color: string;
  onPress?: () => void;
};

const INITIALS_COLORS: Record<LeadBadgeTone, { bg: string; border: string; text: string }> = {
  hot: { bg: '#FFF1F0', border: '#FFCCC7', text: '#CF1322' },
  new: { bg: '#E6FFFB', border: '#B5F5EC', text: '#08979C' },
  muted: { bg: '#F5F5F5', border: '#D9D9D9', text: '#595959' },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function LeadRowComponent({ name, note, badge, badgeTone, color, onPress }: LeadRowProps) {
  const bs = INITIALS_COLORS[badgeTone];

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}

    >
      {/* Avatar circle with initials */}
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>{getInitials(name)}</Text>
      </View>

      {/* Name & note */}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.note}>{note}</Text>
      </View>

      {/* Badge */}
      <View style={[styles.badge, { backgroundColor: bs.bg, borderColor: bs.border }]}>
        <Text style={[styles.badgeText, { color: bs.text }]}>{badge}</Text>
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
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228,234,242,0.7)',
  },
  rowPressed: {
    opacity: 0.7,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  note: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  badge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
