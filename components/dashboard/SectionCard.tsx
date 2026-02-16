import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

type SectionCardProps = {
  title: string;
  linkLabel?: string;
  onLinkPress?: () => void;
  children: React.ReactNode;
  style?: object;
};

function SectionCardComponent({ title, linkLabel, onLinkPress, children, style }: SectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {linkLabel != null && onLinkPress != null && (
          <Pressable onPress={onLinkPress}>
            <Text style={styles.link}>{linkLabel}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

export const SectionCard = memo(SectionCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackgroundSemi,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  link: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.accentTeal,
  },
});
