import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.dangerBorder,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.danger,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    fontWeight: '500',
    color: Theme.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Theme.dangerBg,
    borderWidth: 1,
    borderColor: Theme.dangerBorder,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.danger,
  },
});
