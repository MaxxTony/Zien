import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

type SnapshotItem = {
  value: string;
  label: string;
};

type DarkSectionCardProps = {
  title: string;
  items: SnapshotItem[];
  buttonLabel: string;
  onButtonPress: () => void;
  style?: object;
};

function DarkSectionCardComponent({
  title,
  items,
  buttonLabel,
  onButtonPress,
  style,
}: DarkSectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        {items.map((item) => (
          <View key={item.label} style={styles.item}>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
      <Pressable style={styles.button} onPress={onButtonPress}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
        <MaterialCommunityIcons name="arrow-right" size={16} color="#EAF2FF" />
      </Pressable>
    </View>
  );
}

export const DarkSectionCard = memo(DarkSectionCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: Theme.accentDark,
    borderWidth: 1,
    borderColor: Theme.darkCardOverlay,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 16 },
    elevation: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textOnDark,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 16,
    backgroundColor: Theme.darkCardOverlay,
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.textOnDark,
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: Theme.darkCardTextMuted,
  },
  button: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Theme.darkCardOverlay,
    borderWidth: 1,
    borderColor: Theme.darkCardButtonBorder,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#EAF2FF',
  },
});
