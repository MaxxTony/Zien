import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthCard, AuthLogoBrand, AuthScreenBackground, AuthTitle } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';

import { Theme } from '@/constants/theme';

export default function WelcomeJoinScreen() {
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
          <AuthLogoBrand brandLabel="ZIEN" />

          <View style={styles.badge}>
            <MaterialCommunityIcons name="office-building-outline" size={26} color={Theme.iconPrimary} />
          </View>

          <AuthTitle>Welcome Jane!</AuthTitle>
          <Text style={styles.subtitle}>
            You are now a member of <Text style={styles.subtitleStrong}>The Elite Group</Text>
          </Text>

          <View style={styles.roleCard}>
            <Text style={styles.roleTitle}>Your Role: Agent</Text>
            <View style={styles.roleList}>
              <Text style={styles.roleItem}>• Access shared property listings</Text>
              <Text style={styles.roleItem}>• Use team AI assistants</Text>
              <Text style={styles.roleItem}>• Collaborate on leads</Text>
            </View>
          </View>

          <GradientButton
            title="Go to Team Dashboard"
            style={styles.primaryButton}
            onPress={() => router.push('/(main)/dashboard')}
          />
        </AuthCard>
      </ScrollView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: Theme.screenPadding,
    zIndex: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: Theme.cardBackground,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.screenPadding,
    justifyContent: 'center',
  },
  cardSoft: {
    backgroundColor: Theme.cardBackground,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 14,
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
  roleCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: Theme.cardBackground,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    padding: 14,
    marginBottom: 18,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  roleList: {
    gap: 4,
  },
  roleItem: {
    fontSize: 12.5,
    color: Theme.textMuted,
  },
  primaryButton: {
    width: '100%',
  },
});
