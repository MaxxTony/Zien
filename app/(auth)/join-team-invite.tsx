import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthCard, AuthLogoBrand, AuthScreenBackground, AuthTitle } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';

import { Theme } from '@/constants/theme';

export default function JoinTeamInviteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <AuthScreenBackground>
      <Pressable
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => router.back()}
        hitSlop={12}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.textPrimary} />
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthCard style={styles.cardSoft}>
          <AuthLogoBrand brandLabel="ZIEN.AI" />

          <View style={styles.badge}>
            <MaterialCommunityIcons name="handshake-outline" size={22} color={Theme.iconPrimary} />
          </View>

          <AuthTitle>Invitation Found</AuthTitle>
          <Text style={styles.subtitle}>
            You've been invited to join <Text style={styles.subtitleStrong}>The Elite Group</Text>
          </Text>

          <View style={styles.inviteCard}>
            <View style={styles.inviteIcon}>
              <MaterialCommunityIcons name="account-outline" size={20} color={Theme.iconPrimary} />
            </View>
            <View style={styles.inviteContent}>
              <Text style={styles.inviteTitle}>Invited as: Agent</Text>
              <Text style={styles.inviteDescription}>By: Team Owner (owner@company.com)</Text>
            </View>
          </View>

          <GradientButton title="Accept Invitation" style={styles.primaryButton} onPress={() => router.push('/(auth)/set-password')} />
        </AuthCard>
      </ScrollView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: Theme.screenPadding,
    justifyContent: 'center',
  },
  cardSoft: {
    backgroundColor: Theme.cardBackground,
  },
  backButton: {
    position: 'absolute',
    left: Theme.screenPadding,
    zIndex: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: Theme.cardBackground,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: Theme.inputBorderRadius,
    backgroundColor: Theme.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13.5,
    color: Theme.textSecondary,
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
  },
  subtitleStrong: {
    color: Theme.textPrimary,
    fontWeight: '600',
  },
  inviteCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: Theme.surfaceMuted,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  inviteIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Theme.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteContent: {
    flex: 1,
    gap: 4,
  },
  inviteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  inviteDescription: {
    fontSize: 12.5,
    color: Theme.textMuted,
  },
  primaryButton: {
    width: '100%',
  },
});
