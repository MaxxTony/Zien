import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AuthCard, AuthLogoBrand, AuthScreenBackground, AuthSubtitle, AuthTitle } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import LabeledInput from '@/components/ui/labeled-input';
import OutlineButton from '@/components/ui/OutlineButton';

import { Theme } from '@/constants/theme';

export default function OtpScreen() {
  const router = useRouter();

  return (
    <AuthScreenBackground>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <AuthCard style={styles.cardSoft}>
            <View style={styles.backButtonRow}>
              <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.textPrimary} />
              </Pressable>
            </View>
            <AuthLogoBrand brandLabel="ZIEN" />

            <AuthTitle>Enter OTP</AuthTitle>
            <AuthSubtitle center>We sent a 6-digit code to your email.</AuthSubtitle>

            <View style={styles.form}>
              <LabeledInput
                label="OTP Code"
                placeholder="123456"
                keyboardType="number-pad"
                autoCapitalize="none"
                maxLength={6}
              />
            </View>

            <View style={styles.actionRow}>
              <GradientButton title="Verify OTP" style={styles.primaryButtonFlex} onPress={() => router.push('/(auth)/reset-password')} />
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={() => router.back()} />
            </View>
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
  cardSoft: {
    backgroundColor: Theme.cardBackground,
  },
  backButtonRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: Theme.inputBorderRadius,
    backgroundColor: Theme.cardBackground,
    shadowColor: Theme.cardShadowColor,
    shadowOffset: Theme.cardShadowOffset,
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
