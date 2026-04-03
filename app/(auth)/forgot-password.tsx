import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AuthCard, AuthLogoBrand, AuthScreenBackground, AuthSubtitle, AuthTitle } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import LabeledInput from '@/components/ui/labeled-input';
import OutlineButton from '@/components/ui/OutlineButton';

import { useAppTheme } from '@/context/ThemeContext';
import { forgotPassword } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword({ email });
      console.log('Forgot Password Success:', response);
      if (response.otp_required) {
        // router.push(`/(auth)/otp?email=${encodeURIComponent(email)}`);
        // Simple push for now as OTP screen doesn't use params yet
        router.push({
          pathname: '/(auth)/otp',
          params: { email }
        } as any);
      }
    } catch (error: any) {
      console.error('Forgot Password Error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenBackground>
      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <AuthCard>
            <AuthLogoBrand brandLabel="ZIEN" />
            <AuthTitle>Forgot Password</AuthTitle>
            <AuthSubtitle center>Enter your email and we will send you an OTP.</AuthSubtitle>

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
            </View>

            <View style={styles.actionRow}>
              <GradientButton title="Send OTP" style={styles.flexButton} onPress={handleSendOtp} isLoading={isLoading} />
              <OutlineButton title="Back to Login" style={styles.flexButton} onPress={() => router.push('/(auth)/login')} disabled={isLoading} />
            </View>
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
  },
  flexButton: {
    flex: 1,
  },
});
}
