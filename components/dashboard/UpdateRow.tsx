import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type UpdateRowProps = {
  icon: string;
  title: string;
  description: string;
  time: string;
  accentColor?: string;
};

function UpdateRowComponent({ icon, title, description, time, accentColor = Theme.accentTeal }: UpdateRowProps) {
  return (
    <View style={styles.row}>
      {/* Left timeline connector */}
      <View style={styles.timelineCol}>
        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }]}>
          <MaterialCommunityIcons name={icon as any} size={16} color={accentColor} />
        </View>
        <View style={[styles.connector, { backgroundColor: `${accentColor}20` }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </View>
  );
}

export const UpdateRow = memo(UpdateRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  timelineCol: {
    alignItems: 'center',
    width: 36,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  connector: {
    flex: 1,
    width: 1.5,
    marginTop: 4,
    minHeight: 12,
    borderRadius: 999,
  },
  content: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228,234,242,0.6)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '800',
    color: Theme.textPrimary,
    letterSpacing: 0.05,
  },
  time: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.inputPlaceholder,
    marginLeft: 8,
  },
  desc: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Theme.textSecondary,
    lineHeight: 18,
  },
});
