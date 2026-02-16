import { useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  AuthCard,
  AuthDivider,
  AuthFooter,
  AuthFooterLink,
  AuthFooterText,
  AuthLogoBrand,
  AuthScreenBackground,
  AuthSubtitle,
  AuthTitle,
  SocialButton,
  SSOButton,
} from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import LabeledInput from '@/components/ui/labeled-input';
import OutlineButton from '@/components/ui/OutlineButton';
import PasswordInput from '@/components/ui/PasswordInput';

import { Theme } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <AuthScreenBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <AuthCard>
            <AuthLogoBrand brandLabel="ZIEN" />
            <AuthTitle>Welcome Back</AuthTitle>
            <AuthSubtitle>Sign in to your Zien workspace</AuthSubtitle>

            <View style={styles.form}>
              <LabeledInput
                label="Email Address"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <PasswordInput
                rightLabel="Forgot?"
                onRightLabelPress={() => router.push('/(auth)/forgot-password')}
              />
            </View>

            <View style={styles.actionRow}>
              <GradientButton title="I'm an Agent" style={styles.agentButton} onPress={() => router.push('/(main)/dashboard')} />
              <OutlineButton title="Join Team" style={styles.joinTeamButton} onPress={() => router.push('/(auth)/join-team-invite')} />
            </View>

            <AuthDivider />

            <View style={styles.socialRow}>
              <SocialButton
                label="Google"
                icon={require('@/assets/appImages/google.png')}
                onPress={() => Alert.alert('Coming soon')}
              />
              <SocialButton
                label="Microsoft"
                icon={require('@/assets/appImages/microsoft.png')}
                onPress={() => Alert.alert('Coming soon')}
              />
            </View>

            <SSOButton onPress={() => Alert.alert('Coming soon')} />

            <AuthFooter>
              <AuthFooterText>
                Don't have an account? <AuthFooterLink onPress={() => router.push('/(auth)/register')}>Create one</AuthFooterLink>
              </AuthFooterText>
              <AuthFooterText>
                Are you a Brokerage? <AuthFooterLink onPress={() => Alert.alert('Coming soon')}>Contact Enterprise</AuthFooterLink>
              </AuthFooterText>
            </AuthFooter>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.screenPadding,
    justifyContent: 'center',
  },
  form: {
    alignSelf: 'stretch',
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
    alignItems: 'stretch',
  },
  agentButton: {
    flex: 1,
  },
  joinTeamButton: {
    flex: 0,
    minWidth: 100,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
});
