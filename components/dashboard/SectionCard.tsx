import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SectionCardProps = {
  title: string;
  linkLabel?: string;
  onLinkPress?: () => void;
  children: React.ReactNode;
  style?: object;
  accent?: string;
};

function SectionCardComponent({
  title,
  linkLabel,
  onLinkPress,
  children,
  style,
  accent,
}: SectionCardProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const activeAccent = accent ?? colors.accentTeal;

  return (
    <View style={[styles.card, style]}>
      {/* Subtle top accent bar */}
      <View style={[styles.accentBar, { backgroundColor: activeAccent }]} />

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {linkLabel != null && onLinkPress != null && (
          <Pressable
            style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.7 }]}
            onPress={onLinkPress}
          >
            <Text style={[styles.linkText, { color: activeAccent }]}>{linkLabel}</Text>
            <MaterialCommunityIcons name="chevron-right" size={14} color={activeAccent} />
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

export const SectionCard = memo(SectionCardComponent);

function getStyles(colors: any) {
  return StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    paddingTop: 0,
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    overflow: 'hidden',
  },
  accentBar: {
    height: 3,
    borderRadius: 999,
    marginBottom: 14,
    marginTop: 6,
    width: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: `${colors.accentTeal}12`,
  },
  linkText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});
}
