import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AuthCard, AuthLogoBrand, AuthScreenBackground, AuthSubtitle, AuthTitle } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import OutlineButton from '@/components/ui/OutlineButton';
import PasswordInput from '@/components/ui/PasswordInput';

import { useAppTheme } from '@/context/ThemeContext';
import { resetPassword } from '@/services/authService';

export default function ResetPasswordScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { email, otp } = useLocalSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword({
        email: (email as string) || '',
        otp: (otp as string) || '',
        new_password: newPassword,
      });

      if (response.reset) {
        Alert.alert('Success', 'Your password has been reset successfully.', [
          { text: 'Login Now', onPress: () => router.replace('/(auth)/login') },
        ]);
      }
    } catch (error: any) {
      console.error('Reset Password Error:', error.message);
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
            <View style={styles.backButtonRow}>
              <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
            <AuthLogoBrand brandLabel="ZIEN" />

            <AuthTitle>Reset Password</AuthTitle>
            <AuthSubtitle center>Create a new password for your account.</AuthSubtitle>

            <View style={styles.form}>
              <PasswordInput 
                label="New Password" 
                placeholder="New password"
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <PasswordInput 
                label="Confirm Password" 
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View style={styles.actionRow}>
              <GradientButton title="Reset Password" style={styles.primaryButtonFlex} onPress={handleReset} isLoading={isLoading} />
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={() => router.back()} disabled={isLoading} />
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
  backButtonRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: colors.inputBorderRadius,
    backgroundColor: colors.cardBackground,
    shadowColor: colors.cardShadowColor,
    shadowOffset: colors.cardShadowOffset,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
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
  primaryButtonFlex: {
    flex: 1,
  },
  secondaryButton: {
    flex: 0,
    minWidth: 100,
  },
});
}
