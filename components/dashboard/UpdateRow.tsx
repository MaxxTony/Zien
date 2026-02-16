import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

type UpdateRowProps = {
  icon: string;
  title: string;
  description: string;
  time: string;
};

function UpdateRowComponent({ icon, title, description, time }: UpdateRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon as any} size={18} color={Theme.textPrimary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

export const UpdateRow = memo(UpdateRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Theme.rowBorder,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Theme.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorder,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  desc: {
    marginTop: 2,
    fontSize: 12.5,
    fontWeight: '700',
    color: Theme.textSecondary,
  },
  time: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: Theme.inputPlaceholder,
  },
});
