import { AuthCard, AuthLogoBrand, AuthScreenBackground } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import LabeledInput from '@/components/ui/labeled-input';
import OutlineButton from '@/components/ui/OutlineButton';
import PasswordInput from '@/components/ui/PasswordInput';
import StepIndicator from '@/components/ui/StepIndicator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Theme } from '@/constants/theme';
import { formatCardNumber, formatExpiryInput } from '@/utils/card-formatters';

type PlanId = 'starter' | 'professional' | 'team';

export default function SoloOnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('starter');
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<{ expiry?: string; cvc?: string }>({});

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const goBack = () => {
    if (currentStep === 1) {
      router.back();
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.title}>Account Info</Text>
            <Text style={styles.subtitle}>Let's start with your basic details</Text>

            <View style={styles.form}>
              <View style={styles.row}>
                <LabeledInput label="First Name" placeholder="John" containerStyle={styles.flexItem} />
                <LabeledInput label="Last Name" placeholder="Doe" containerStyle={styles.flexItem} />
              </View>
              <LabeledInput
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <PasswordInput label="Password" />
            </View>

            <GradientButton title="Continue" style={styles.primaryButton} onPress={goNext} />
            <Text style={styles.supportText}>
              Need help? <Text style={styles.supportLink}>Contact Support</Text>
            </Text>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>Professional Info</Text>
            <Text style={styles.subtitle}>Help us tailor Zien  to your market</Text>

            <View style={styles.form}>
              <LabeledInput label="License Number" placeholder="RE-12345678" />
              <LabeledInput label="Primary Market / City" placeholder="Los Angeles, CA" />
              <LabeledInput label="Primary CRM" placeholder="Follow Up Boss" />
            </View>

            <View style={styles.actionRow}>
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={goBack} />
              <GradientButton title="Continue" style={styles.primaryButtonFlex} onPress={goNext} />
            </View>
            <Text style={styles.supportText}>
              Need help? <Text style={styles.supportLink}>Contact Support</Text>
            </Text>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>Select a Plan</Text>
            <Text style={styles.subtitle}>Choose the power level for your business</Text>

            <View style={styles.planList}>
              <Pressable
                style={[styles.planCard, selectedPlan === 'starter' ? styles.planSelected : null]}
                onPress={() => setSelectedPlan('starter')}>
                <View>
                  <Text style={styles.planTitle}>Starter</Text>
                  <Text style={styles.planDescription}>Individual AI Assistant</Text>
                </View>
                <Text style={styles.planPrice}>$49/mo</Text>
              </Pressable>
              <Pressable
                style={[styles.planCard, selectedPlan === 'professional' ? styles.planSelected : null]}
                onPress={() => setSelectedPlan('professional')}>
                <View>
                  <Text style={styles.planTitle}>Professional</Text>
                  <Text style={styles.planDescription}>Full CRM & Marketing AI</Text>
                </View>
                <Text style={styles.planPrice}>$99/mo</Text>
              </Pressable>
              <Pressable
                style={[styles.planCard, selectedPlan === 'team' ? styles.planSelected : null]}
                onPress={() => setSelectedPlan('team')}>
                <View>
                  <Text style={styles.planTitle}>Team</Text>
                  <Text style={styles.planDescription}>Collaborative AI Ecosystem</Text>
                </View>
                <Text style={styles.planPrice}>$249/mo</Text>
              </Pressable>
            </View>

            <View style={styles.actionRow}>
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={goBack} />
              <GradientButton title="Continue to Payment" style={styles.primaryButtonFlex} onPress={goNext} />
            </View>
            <Text style={styles.supportText}>
              Need help? <Text style={styles.supportLink}>Contact Support</Text>
            </Text>
          </>
        );
      default:
        return (
          <>
            <Text style={styles.title}>Payment Method</Text>
            <Text style={styles.subtitle}>Secure your subscription</Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardText}>
                You won't be charged until your 14-day trial ends.
              </Text>
            </View>

            <View style={styles.form}>
              <LabeledInput label="Cardholder Name" placeholder="John Doe" />
              <LabeledInput
                label="Card Information"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="number-pad"
                maxLength={19}
              />
              <View style={styles.row}>
                <View style={styles.flexItem}>
                  <LabeledInput
                    label="MM / YY"
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChangeText={(text) => {
                      setCardExpiry(formatExpiryInput(text));
                      if (paymentErrors.expiry) setPaymentErrors((e) => ({ ...e, expiry: undefined }));
                    }}
                    keyboardType="number-pad"
                    maxLength={5}
                    containerStyle={paymentErrors.expiry ? styles.inputError : undefined}
                  />
                  {paymentErrors.expiry ? <Text style={styles.fieldError}>{paymentErrors.expiry}</Text> : null}
                </View>
                <View style={styles.flexItem}>
                  <LabeledInput
                    label="CVC"
                    placeholder="•••"
                    value={cardCvc}
                    onChangeText={(text) => {
                      setCardCvc(text.replace(/\D/g, '').slice(0, 4));
                      if (paymentErrors.cvc) setPaymentErrors((e) => ({ ...e, cvc: undefined }));
                    }}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
                    containerStyle={paymentErrors.cvc ? styles.inputError : undefined}
                  />
                  {paymentErrors.cvc ? <Text style={styles.fieldError}>{paymentErrors.cvc}</Text> : null}
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={goBack} />
              <GradientButton
                title="Complete Setup"
                style={styles.primaryButtonFlex}
                onPress={() => {
                  // const expiryErr = validateExpiry(cardExpiry);
                  // const cvcErr = validateCvc(cardCvc);
                  // if (expiryErr || cvcErr) {
                  //   setPaymentErrors({ expiry: expiryErr ?? undefined, cvc: cvcErr ?? undefined });
                  //   return;
                  // }
                  setPaymentErrors({});
                  setShowSuccess(true);
                }}
              />
            </View>
            <Text style={styles.supportText}>
              Need help? <Text style={styles.supportLink}>Contact Support</Text>
            </Text>
          </>
        );
    }
  };

  const renderSuccess = () => (
    <>
      <View style={styles.badge}>
        <MaterialCommunityIcons name="check-circle" size={28} color={Theme.link} />
      </View>
      <Text style={styles.title}>Success!</Text>
      <Text style={styles.subtitle}>Your solo agent workspace is ready.</Text>
      <Text style={styles.message}>
        Welcome to the future of real estate. We're preparing your personalized AI assistant now.
      </Text>
      <GradientButton
        title="Go to Dashboard"
        style={styles.primaryButton}
        onPress={() => router.push('/(main)/dashboard')}
      />
    </>
  );

  return (
    <AuthScreenBackground>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <AuthCard>
            <View style={styles.backButtonRow}>
              <Pressable style={styles.backButton} onPress={goBack} hitSlop={12}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.textPrimary} />
              </Pressable>
            </View>
            <AuthLogoBrand brandLabel="ZIEN" />

            {showSuccess ? null : <StepIndicator currentStep={currentStep} totalSteps={4} />}

            {showSuccess ? renderSuccess() : renderStepContent()}
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  scrollContent: {
    flexGrow: 1,
    padding: Theme.screenPadding,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  subtitle: {
    fontSize: 13.5,
    color: Theme.textSecondary,
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
  },
  message: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    marginTop: 12,
    marginBottom: 18,
    textAlign: 'center',
  },
  form: {
    alignSelf: 'stretch',
    gap: 12,
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flexItem: {
    flex: 1,
  },
  inputError: {
    borderColor: '#DC2626',
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
  },
  fieldError: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
  },
  infoCard: {
    width: '100%',
    borderRadius: Theme.buttonBorderRadius,
    backgroundColor: Theme.surfaceMuted,
    padding: 14,
    marginBottom: 14,
  },
  infoCardText: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    textAlign: 'center',
  },
  planList: {
    alignSelf: 'stretch',
    gap: 12,
    marginBottom: 18,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.buttonBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    padding: 14,
  },
  planSelected: {
    borderColor: Theme.link,
    shadowColor: Theme.link,
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  planDescription: {
    fontSize: 12.5,
    color: Theme.textMuted,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.link,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  primaryButton: {
    width: '100%',
  },
  primaryButtonFlex: {
    flex: 1,
  },
  secondaryButton: {
    flex: 0,
    minWidth: 100,
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
  supportText: {
    marginTop: 14,
    fontSize: 12.5,
    color: Theme.textMuted,
  },
  supportLink: {
    color: Theme.link,
    fontWeight: '600',
  },
});
