import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

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
  SocialButton
} from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import LabeledInput from '@/components/ui/labeled-input';
import OutlineButton from '@/components/ui/OutlineButton';
import PasswordInput from '@/components/ui/PasswordInput';

import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { loginAgent } from '@/services/authService';

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const { login } = useAuth();
  const styles = getStyles(colors);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      const response = await loginAgent({ email, password });
      console.log('Login Success:', response);

      const { access_token, role, complete_profile } = response;

      // Store token, role and profile status in context & storage
      // Redirection will be handled automatically by AuthContext's protector effect
      await login(access_token, role, complete_profile);
    } catch (error: any) {
      console.error('Login Error:', error.message);
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
                value={email}
                onChangeText={setEmail}
              />
              <PasswordInput
                value={password}
                onChangeText={setPassword}
                rightLabel="Forgot?"
                onRightLabelPress={() => router.push('/(auth)/forgot-password')}
              />
            </View>

            <View style={styles.actionRow}>
              <GradientButton
                title="Sign In"
                style={styles.agentButton}
                onPress={handleLogin}
                isLoading={isLoading}
              />
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

            {/* <SSOButton onPress={() => Alert.alert('Coming soon')} /> */}

            <AuthFooter>
              <AuthFooterText>
                Don't have an account? <AuthFooterLink onPress={() => router.push('/(auth)/register')}>Create one</AuthFooterLink>
              </AuthFooterText>
              <AuthFooterText>
                Are you a Brokerage? <AuthFooterLink onPress={() => router.push('/(auth)/enterprise-contact')}>Contact Enterprise</AuthFooterLink>
              </AuthFooterText>
            </AuthFooter>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenBackground>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
    flex: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      padding: colors.screenPadding,
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
}
