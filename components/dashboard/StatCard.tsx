import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

type StatCardProps = {
  title: string;
  value: string;
  meta: string;
  metaTone: 'positive' | 'neutral';
  icon: string;
  accentColor: string;
};

function StatCardComponent({ title, value, meta, metaTone, icon, accentColor }: StatCardProps) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[`${accentColor}1A`, 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${accentColor}1F`, borderColor: `${accentColor}33` }]}>
          <MaterialCommunityIcons name={icon as any} size={16} color={accentColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={[styles.metaPill, { backgroundColor: `${accentColor}14`, borderColor: `${accentColor}26` }]}>
        <MaterialCommunityIcons
          name={metaTone === 'positive' ? 'trending-up' : 'check-circle-outline'}
          size={14}
          color={accentColor}
        />
        <Text style={[styles.metaText, { color: accentColor }]} numberOfLines={1}>
          {meta}
        </Text>
      </View>
    </View>
  );
}

export const StatCard = memo(StatCardComponent);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: Theme.cardBackgroundSemi,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(228, 234, 242, 0.95)',
    shadowColor: Theme.textPrimary,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
    elevation: 2,
    overflow: 'hidden',
    minHeight: 124,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  value: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '900',
    color: Theme.textPrimary,
    letterSpacing: -0.2,
  },
  metaPill: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '900',
    flexShrink: 1,
  },
});
