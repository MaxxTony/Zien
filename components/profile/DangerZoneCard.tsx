import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

type DangerZoneCardProps = {
  description?: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
};

function DangerZoneCardComponent({
  description = 'Permanently deactivate your agent profile and scrub all data.',
  buttonLabel = 'Request Account Deletion',
  onButtonPress,
}: DangerZoneCardProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>DANGER ZONE</Text>
      <Text style={styles.desc}>{description}</Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onButtonPress}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

export const DangerZoneCard = memo(DangerZoneCardComponent);

function getStyles(colors: any) {
  return StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.danger,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
});
}
