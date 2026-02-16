import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

export type StatusItem = {
  label: string;
  verified: boolean;
};

type AccountStatusCardProps = {
  profileStrengthPercent?: number;
  items: StatusItem[];
};

function AccountStatusCardComponent({
  profileStrengthPercent = 92,
  items,
}: AccountStatusCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>ACCOUNT STATUS</Text>
      <View style={styles.strengthRow}>
        <Text style={styles.strengthLabel}>Profile Strength</Text>
        <Text style={styles.strengthValue}>{profileStrengthPercent}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${profileStrengthPercent}%` }]}
        />
      </View>
      <View style={styles.list}>
        {items.map((item) => (
          <View key={item.label} style={styles.listItem}>
            <MaterialCommunityIcons
              name="check-circle"
              size={18}
              color={Theme.accentTeal}
            />
            <Text style={styles.listLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export const AccountStatusCard = memo(AccountStatusCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.textPrimary,
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  strengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  strengthValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.accentTeal,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.surfaceIcon,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.accentTeal,
    borderRadius: 4,
  },
  list: {
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
});
