import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthCard, AuthLogoBrand, AuthScreenBackground, AuthTitle } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';

import { useAppTheme } from '@/context/ThemeContext';

export default function WelcomeJoinScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <AuthScreenBackground>
      <Pressable
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => router.back()}
        hitSlop={12}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthCard style={styles.cardSoft}>
          <AuthLogoBrand brandLabel="ZIEN" />

          <View style={styles.badge}>
            <MaterialCommunityIcons name="office-building-outline" size={26} color={colors.iconPrimary} />
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

function getStyles(colors: any) {
  return StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: colors.screenPadding,
    zIndex: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
  },
  scrollContent: {
    flexGrow: 1,
    padding: colors.screenPadding,
    justifyContent: 'center',
  },
  cardSoft: {
    backgroundColor: colors.cardBackground,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
  },
  subtitleStrong: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  roleCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    marginBottom: 18,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  roleList: {
    gap: 4,
  },
  roleItem: {
    fontSize: 12.5,
    color: colors.textMuted,
  },
  primaryButton: {
    width: '100%',
  },
});
}
