import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthCard, AuthLogoBrand, AuthScreenBackground, AuthSubtitle, AuthTitle } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import LabeledInput from '@/components/ui/labeled-input';
import PasswordInput from '@/components/ui/PasswordInput';

import { Theme } from '@/constants/theme';

export default function SetPasswordScreen() {
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
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <AuthCard style={styles.cardSoft}>
            <AuthLogoBrand brandLabel="ZIEN" />

            <AuthTitle>Set Password</AuthTitle>
            <AuthSubtitle center>Secure your new team member account</AuthSubtitle>

            <View style={styles.form}>
              <LabeledInput label="Full Name" placeholder="Jane Smith" autoCapitalize="words" />
              <LabeledInput
                label="Email"
                placeholder="jane@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <PasswordInput label="Create Password" placeholder="••••••••" />
            </View>

            <GradientButton title="Continue" style={styles.primaryButton} onPress={() => router.push('/(auth)/welcome-join')} />
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  form: {
    alignSelf: 'stretch',
    gap: 12,
    marginBottom: 18,
  },
  primaryButton: {
    width: '100%',
  },
});
