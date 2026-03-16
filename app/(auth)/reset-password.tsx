import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function ResetPasswordScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const router = useRouter();

  const handleReset = () => {
    Alert.alert('Password reset', 'Your password has been updated.', [
      { text: 'OK', onPress: () => router.replace('/(auth)/login') },
    ]);
  };

  return (
    <AuthScreenBackground>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
              <PasswordInput label="New Password" placeholder="New password" />
              <PasswordInput label="Confirm Password" placeholder="Confirm password" />
            </View>

            <View style={styles.actionRow}>
              <GradientButton title="Reset Password" style={styles.primaryButtonFlex} onPress={handleReset} />
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={() => router.back()} />
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
