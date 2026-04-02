import { AuthCard, AuthLogoBrand, AuthScreenBackground } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import LabeledInput from '@/components/ui/labeled-input';
import OutlineButton from '@/components/ui/OutlineButton';
import PasswordInput from '@/components/ui/PasswordInput';
import StepIndicator from '@/components/ui/StepIndicator';
import { Addon, CheckoutPayload, completeCheckout, fetchSoloPlans, Plan, registerSoloCheckout } from '@/services/plans';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';

type PlanId = 'pro-agent' | 'starter' | 'team';

export default function SoloOnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const styles = getStyles(colors, insets);
  const { login } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro-agent');
  const [duration, setDuration] = useState<'monthly' | 'annually'>('monthly');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState(false);
  const [isCompletingCheckout, setIsCompletingCheckout] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    primaryMarket: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (currentStep === 2) {
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
      if (!formData.primaryMarket.trim()) newErrors.primaryMarket = 'Primary market is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;

    if (currentStep === 3) {
      const addon_ids = (activePlan?.addons || [])
        .filter(a => selectedAddons[a.slug])
        .map(a => a.id);

      const payload: CheckoutPayload = {
        addon_ids,
        billing: duration.charAt(0).toUpperCase() + duration.slice(1),
        country_code: countryCode,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        license_number: formData.licenseNumber,
        password: formData.password,
        phone: formData.phone,
        plan_id: activePlan?.id || 0,
        primary_market: formData.primaryMarket,
      };

      console.log('Sending Registration Payload:', payload);
      registerMutation.mutate(payload);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  const goBack = () => {
    if (currentStep === 1) {
      router.back();
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const { data: plans, isLoading: plansLoading, error: plansError, refetch: refetchPlans } = useQuery({
    queryKey: ['solo-plans'],
    queryFn: fetchSoloPlans,
  });


  const activePlan = useMemo(() => {
    return plans?.find(p => p.slug === selectedPlan) || plans?.[0];
  }, [plans, selectedPlan]);

  const activePrice = useMemo(() => {
    return activePlan?.prices.find(p => p.billing_interval === duration) || activePlan?.prices[0];
  }, [activePlan, duration]);

  const toggleAddon = (slug: string) => {
    setSelectedAddons(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const registerMutation = useMutation({
    mutationFn: registerSoloCheckout,
    onSuccess: (data) => {
      console.log('Registration Success Result:', data);
      if (data.checkout_url && data.session_id) {
        setCheckoutUrl(data.checkout_url);
        setSessionId(data.session_id);
        setShowWebView(true);
      } else {
        // Fallback for success without URL
        setShowSuccess(true);
      }
    },
    onError: (error: Error) => {
      console.error('Registration Error:', error.message);
      // We could add a top-level error state here if needed
      setErrors(prev => ({ ...prev, _form: error.message }));
    },
  });

  const completeCheckoutMutation = useMutation({
    mutationFn: (sId: string) => completeCheckout(sId),
    onSuccess: (data) => {
      console.log('Checkout Complete Result:', data);
      if (data.user_id) {
        login(data.user_id.toString());
        setIsCompletingCheckout(false);
        setShowSuccess(true);
      }
    },
    onError: (error: Error) => {
      console.error('Checkout Complete Error:', error.message);
      setIsCompletingCheckout(false);
      setErrors(prev => ({ ...prev, _form: `Payment verified but account setup failed: ${error.message}` }));
    },
  });

  // Auto-redirect effect
  useMemo(() => {
    if (showSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/(main)/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSuccess]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
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
                <LabeledInput
                  label="First Name"
                  placeholder="First Name"
                  required
                  containerStyle={styles.flexItem}
                  value={formData.firstName}
                  onChangeText={(val) => updateField('firstName', val)}
                  error={errors.firstName}
                />
                <LabeledInput
                  label="Last Name"
                  placeholder="Last Name"
                  required
                  containerStyle={styles.flexItem}
                  value={formData.lastName}
                  onChangeText={(val) => updateField('lastName', val)}
                  error={errors.lastName}
                />
              </View>
              <LabeledInput
                label="Email"
                placeholder="Email"
                required
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(val) => updateField('email', val)}
                error={errors.email}
              />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number <Text style={styles.requiredAsterisk}>*</Text></Text>
                <PhoneInput
                  defaultValue={formData.phone}
                  defaultCode="US"
                  layout="second"

                  onChangeText={(text) => updateField('phone', text)}
                  onChangeFormattedText={(text) => {
                    setFormattedPhone(text);
                    // Basic extraction of country code from formatted text (e.g. "+1 234...")
                    if (text.startsWith('+')) {
                      const code = text.split(' ')[0];
                      if (code) setCountryCode(code);
                    }
                  }}
                  containerStyle={[
                    styles.phoneInputWrapper,
                    !!errors.phone && { borderColor: '#EF4444' }
                  ]}
                  textContainerStyle={styles.phoneTextContainer}
                  textInputStyle={styles.phoneTextInput}
                  codeTextStyle={styles.phoneCodeText}
                  flagButtonStyle={styles.phoneFlagButton}
                  placeholder="Phone Number"
                />
                {errors.phone ? <Text style={styles.errorTextSmall}>{errors.phone}</Text> : null}
                {errors._form ? <Text style={styles.errorTextSmall}>{errors._form}</Text> : null}
              </View>

              <PasswordInput
                label="Password"
                required
                value={formData.password}
                onChangeText={(val) => updateField('password', val)}
                error={errors.password}
              />
              <PasswordInput
                label="Confirm Password"
                required
                value={formData.confirmPassword}
                onChangeText={(val) => updateField('confirmPassword', val)}
                error={errors.confirmPassword}
              />
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
            <Text style={styles.subtitle}>Help us tailor Zien to your market</Text>

            <View style={styles.form}>
              <LabeledInput
                label="License Number"
                placeholder="License Number"
                required
                value={formData.licenseNumber}
                onChangeText={(val) => updateField('licenseNumber', val)}
                error={errors.licenseNumber}
              />
              <Text style={styles.disclaimer}>* License verification may take up to 5 business days.</Text>

              <LabeledInput
                label="Primary Market / City"
                placeholder="Primary Market / City"
                required
                value={formData.primaryMarket}
                onChangeText={(val) => updateField('primaryMarket', val)}
                error={errors.primaryMarket}
              />
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
        if (plansLoading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Loading available plans...</Text>
            </View>
          );
        }

        if (plansError) {
          return (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.errorTitle}>Oops! Something went wrong.</Text>
              <Text style={styles.errorSubtitle}>
                {plansError instanceof Error ? plansError.message : "We couldn't load the plans. Please try again later."}
              </Text>
              <OutlineButton
                title="Retry Again"
                onPress={() => refetchPlans()}
                style={styles.retryButton}
              />
            </View>
          );
        }

        return (
          <>
            <Text style={styles.title}>Select a Plan</Text>
            <Text style={styles.subtitle}>Pick duration first, then choose the best plan</Text>

            <View style={styles.planSection}>
              <View style={styles.durationPickerContainer}>
                <Pressable
                  style={[styles.durationOption, duration === 'monthly' && styles.durationOptionActive]}
                  onPress={() => setDuration('monthly')}
                >
                  <Text style={[styles.durationText, duration === 'monthly' && styles.durationTextActive]}>Monthly</Text>
                </Pressable>
                <Pressable
                  style={[styles.durationOption, duration === 'annually' && styles.durationOptionActive]}
                  onPress={() => setDuration('annually')}
                >
                  <View style={styles.annuallyLabelContainer}>
                    <Text style={[styles.durationText, duration === 'annually' && styles.durationTextActive]}>Annually</Text>
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveBadgeText}>SAVE 15%</Text>
                    </View>
                  </View>
                </Pressable>
              </View>

              {plans?.map((plan: Plan, planIndex: number) => {
                const planPrice = plan.prices.find(p => p.billing_interval === duration) || plan.prices[0];
                const isSelected = selectedPlan === plan.slug;
                const isPopular = plans.length > 1 && planIndex === 1;
                const PLAN_META: Record<string, { icon: string; role: string }> = {
                  'starter': { icon: 'account-outline', role: 'Starter Agent' },
                  'pro-agent': { icon: 'briefcase-check-outline', role: 'Pro Agent' },
                };
                const meta = PLAN_META[plan.slug] || { icon: 'star-outline', role: 'Professional' };
                const wholePrice = planPrice?.price.split('.')[0] || '0';
                const decimalPrice = planPrice?.price.split('.')[1] || '00';

                return (
                  <Pressable
                    key={plan.id}
                    style={[styles.premiumPlanCard, isSelected && styles.premiumPlanCardSelected]}
                    onPress={() => setSelectedPlan(plan.slug as any)}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={['rgba(0,167,181,0.07)', 'rgba(11,35,65,0.04)']}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    )}

                    {isPopular && (
                      <LinearGradient
                        colors={['#0b2341', '#00a7b5']}
                        style={styles.popularBadge}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <MaterialCommunityIcons name="fire" size={11} color="#FFF" />
                        <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                      </LinearGradient>
                    )}

                    <View style={[styles.planCardHeader, isPopular && { marginTop: 6 }]}>
                      <LinearGradient
                        colors={isSelected ? ['#0b2341', '#00a7b5'] : ['#F1F5F9', '#E2E8F0']}
                        style={styles.planIconWrap}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <MaterialCommunityIcons
                          name={meta.icon as any}
                          size={22}
                          color={isSelected ? '#FFFFFF' : '#64748B'}
                        />
                      </LinearGradient>

                      <View style={styles.planCardTitleGroup}>
                        <View style={[styles.roleBadge, isSelected && styles.roleBadgeActive]}>
                          <Text style={[styles.roleBadgeText, isSelected && styles.roleBadgeTextActive]}>
                            {meta.role}
                          </Text>
                        </View>
                        <Text style={[styles.planNameText, isSelected && styles.planNameTextSelected]}>
                          {plan.name}
                        </Text>
                      </View>

                      {isSelected ? (
                        <LinearGradient
                          colors={['#0b2341', '#00a7b5']}
                          style={styles.selectedCheckmark}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <MaterialCommunityIcons name="check" size={13} color="#FFF" />
                        </LinearGradient>
                      ) : (
                        <View style={styles.unselectedCircle} />
                      )}
                    </View>

                    <LinearGradient
                      colors={isSelected ? ['#0b2341', '#1a3a5c'] : ['#F8FAFC', '#F1F5F9']}
                      style={styles.priceBand}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <View style={styles.priceContainer}>
                        <Text style={[styles.priceCurrency, isSelected && styles.priceOnDark]}>$</Text>
                        <Text style={[styles.priceAmount, isSelected && styles.priceOnDark]}>{wholePrice}</Text>
                        <View>
                          <Text style={[styles.priceDecimals, isSelected && styles.priceOnDark]}>.{decimalPrice}</Text>
                          <Text style={[styles.priceInterval, isSelected && styles.priceIntervalOnDark]}>/mo</Text>
                        </View>
                      </View>
                      {duration === 'annually' && (
                        <View style={[styles.billedAnnuallyBadge, isSelected && { backgroundColor: 'rgba(0,167,181,0.25)' }]}>
                          <Text style={[styles.billedAnnuallyText, isSelected && { color: '#7EEEF7' }]}>Billed annually</Text>
                        </View>
                      )}
                    </LinearGradient>

                    <View style={styles.featuresList}>
                      {plan.features?.map((feature, idx) => (
                        <View key={idx} style={styles.featureItem}>
                          <LinearGradient
                            colors={isSelected ? ['#0b2341', '#00a7b5'] : ['#E2E8F0', '#CBD5E1']}
                            style={styles.featureCheckCircle}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          >
                            <MaterialCommunityIcons name="check" size={9} color={isSelected ? '#FFF' : '#94A3B8'} />
                          </LinearGradient>
                          <Text style={[styles.featureText, isSelected && styles.featureTextActive]}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </Pressable>
                );
              })}

              <View style={styles.addOnSection}>
                <Text style={styles.sectionLabel}>Add-ons for {duration.charAt(0).toUpperCase() + duration.slice(1)}</Text>
                {activePlan?.addons.map((addon: Addon) => {
                  const addonPrice = addon.prices.find(p => p.billing_interval === duration) || addon.prices[0];
                  return (
                    <View key={addon.id} style={styles.addOnItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.addOnName}>{addon.name}</Text>
                        <Text style={styles.addOnSub}>{addon.description}</Text>
                      </View>
                      <View style={styles.addOnAction}>
                        <Text style={styles.addOnPrice}>
                          {addonPrice ? `$${addonPrice.price}` : 'N/A'}
                        </Text>
                        <Switch
                          value={!!selectedAddons[addon.slug]}
                          onValueChange={() => toggleAddon(addon.slug)}
                          trackColor={{ false: '#E2E8F0', true: colors.accent }}
                          thumbColor="#FFFFFF"
                        />
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Payment Summary ({duration.charAt(0).toUpperCase() + duration.slice(1)})</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{activePlan?.name}</Text>
                  <Text style={styles.summaryValue}>${activePrice?.price || '0.00'}</Text>
                </View>

                {(activePlan?.addons || []).filter(a => selectedAddons[a.slug]).map(addon => {
                  const addonPrice = addon.prices.find(p => p.billing_interval === duration) || addon.prices[0];
                  return (
                    <View key={addon.id} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{addon.name}</Text>
                      <Text style={styles.summaryValue}>${addonPrice?.price || '0.00'}</Text>
                    </View>
                  );
                })}

                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Total after trial</Text>
                  <Text style={styles.summaryTotalValue}>
                    ${(
                      Number(activePrice?.price || 0) +
                      (activePlan?.addons || [])
                        .filter(a => selectedAddons[a.slug])
                        .reduce((sum, a) => {
                          const ap = a.prices.find(p => p.billing_interval === duration) || a.prices[0];
                          return sum + Number(ap?.price || 0);
                        }, 0)
                    ).toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.trialInfo}>
                  <Text style={styles.trialBold}>14-day free trial.</Text> You will enter a payment method at checkout;
                  you are not charged today. After the trial, <Text style={styles.trialBold}>
                    ${(
                      Number(activePrice?.price || 0) +
                      (activePlan?.addons || [])
                        .filter(a => selectedAddons[a.slug])
                        .reduce((sum, a) => {
                          const ap = a.prices.find(p => p.billing_interval === duration) || a.prices[0];
                          return sum + Number(ap?.price || 0);
                        }, 0)
                    ).toFixed(2)}
                  </Text> per {duration === 'annually' ? 'Year' : 'Month'}</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <OutlineButton
                title="Back"
                style={styles.secondaryButton}
                onPress={goBack}
                disabled={registerMutation.isPending}
              />
              <GradientButton
                title="Continue"
                style={styles.primaryButtonFlex}
                onPress={goNext}
                isLoading={registerMutation.isPending}
              />
            </View>
            {registerMutation.isError && (
              <Text style={[styles.errorTextSmall, { textAlign: 'center', marginTop: 12 }]}>
                {registerMutation.error.message}
              </Text>
            )}
            <Text style={styles.supportText}>
              Need help? <Text style={styles.supportLink}>Contact Support</Text>
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    console.log('WebView Navigation URL:', navState.url);

    // Heuristics for success or failure redirect
    if (navState.url.includes('success') || navState.url.includes('checkout-success')) {
      console.log('Success detected from URL redirect!');
      setShowWebView(false);
      setIsCompletingCheckout(true);
      if (sessionId) {
        completeCheckoutMutation.mutate(sessionId);
      }
    } else if (navState.url.includes('cancel') || navState.url.includes('checkout-cancel')) {
      console.log('Cancellation detected from URL redirect.');
      setShowWebView(false);
    }
  };

  const renderCompleting = () => (
    <View style={styles.loadingContainerLarge}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.loadingTitleLarge}>Finalizing your workspace...</Text>
      <Text style={styles.loadingSubtitleLarge}>We're setting everything up for you. Almost there!</Text>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIconOuter}>
        <View style={styles.successIconInner}>
          <MaterialCommunityIcons name="check" size={32} color="#10B981" />
        </View>
      </View>

      <Text style={styles.successTitle}>Welcome to Zien!</Text>

      <Text style={styles.successHighlight}>Trial started — account ready.</Text>

      <Text style={styles.successDescription}>
        Your 14-day trial is now active. Your saved payment method will be charged at the end of the trial unless you cancel.
      </Text>

      <View style={styles.redirectBadge}>
        <Text style={styles.redirectText}>Opening your dashboard in {countdown}s...</Text>
      </View>

      <GradientButton
        title="Go to Dashboard Now"
        style={styles.successButton}
        onPress={() => router.push('/(main)/dashboard')}
      />
    </View>
  );

  return (
    <AuthScreenBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.topNav}>
            <Pressable style={styles.backButton} onPress={goBack} hitSlop={12}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={colors.textPrimary} />
            </Pressable>

            <View style={{ width: 44 }} />
          </View>

          <AuthCard>
            {/* Added centered logo brand here as well to match design flow */}
            <AuthLogoBrand brandLabel="ZIEN" />

            {!showSuccess && !isCompletingCheckout && <StepIndicator currentStep={currentStep} totalSteps={3} />}

            {isCompletingCheckout ? renderCompleting() : showSuccess ? renderSuccess() : renderStepContent()}
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showWebView} animationType="slide" transparent={false}>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: Math.max(insets.top, 20) }}>
          <View style={styles.webViewHeader}>
            <Text style={styles.webViewTitle}>Checkout</Text>
            <Pressable onPress={() => setShowWebView(false)} style={styles.closeWebViewButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>
          {checkoutUrl && (
            <WebView
              source={{ uri: checkoutUrl }}
              onNavigationStateChange={handleNavigationStateChange}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.webViewLoading}>
                  <ActivityIndicator size="large" color={colors.accent} />
                </View>
              )}
            />
          )}
        </View>
      </Modal>
    </AuthScreenBackground>
  );
}

const getStyles = (colors: any, insets: any) => StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: colors.screenPadding,
    paddingTop: Math.max(insets.top, 10),
    paddingBottom: Math.max(insets.bottom, 40),
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topLogo: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    alignSelf: 'stretch',
    gap: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flexItem: {
    flex: 1,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  phoneInputWrapper: {
    width: '100%',
    backgroundColor: colors.inputBackground,
    borderRadius: colors.inputBorderRadius,
    borderWidth: 1,
    borderColor: colors.borderInput,
    height: 50,
    overflow: 'hidden',
  },
  phoneTextContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  phoneTextInput: {
    fontSize: 15,
    marginLeft: 10,
    color: colors.textPrimary,
    fontWeight: '500',
    backgroundColor: 'transparent',
  },
  phoneCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  phoneFlagButton: {
    width: 70,
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderRightColor: colors.borderInput,
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748B',
    marginTop: -8,
  },
  planSection: {
    gap: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  durationPickerContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 8,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  durationOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  durationTextActive: {
    color: '#0F172A',
  },
  annuallyLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  premiumPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0b2341',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  premiumPlanCardSelected: {
    borderColor: colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    gap: 12,
  },
  planIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCardTitleGroup: {
    flex: 1,
    gap: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleBadgeActive: {
    backgroundColor: 'rgba(0,167,181,0.12)',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  roleBadgeTextActive: {
    color: colors.accent,
  },
  planNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  planNameTextSelected: {
    color: '#0F172A',
  },
  selectedCheckmark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  priceBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priceCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  priceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 38,
  },
  priceDecimals: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  priceInterval: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  priceOnDark: {
    color: '#FFFFFF',
  },
  priceIntervalOnDark: {
    color: 'rgba(255,255,255,0.65)',
  },
  billedAnnuallyBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  billedAnnuallyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  featuresList: {
    gap: 10,
    padding: 16,
    paddingTop: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  featureTextActive: {
    color: '#0F172A',
  },
  addOnSection: {
    gap: 12,
  },
  addOnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
  },
  addOnName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  addOnSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addOnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addOnPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#475569',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryTotalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  trialInfo: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 4,
  },
  trialBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  loadingContainerLarge: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 16,
  },
  loadingTitleLarge: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingSubtitleLarge: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  redirectBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  redirectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  primaryButton: {
    width: '100%',
    height: 56,
  },
  primaryButtonFlex: {
    flex: 1,
    height: 56,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
    alignSelf: 'stretch',
  },
  successIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  successIconInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#061E41',
    textAlign: 'center',
    marginBottom: 16,
  },
  successHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 32,
  },
  successDescription: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 48,
    paddingHorizontal: 10,
  },
  successButton: {
    width: '100%',
    marginTop: 10,
    alignSelf: 'stretch',
  },
  retryButton: {
    paddingHorizontal: 24,
    minWidth: 140,
    marginTop: 8,
  },
  supportText: {
    marginTop: 24,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  supportLink: {
    color: colors.accent,
    fontWeight: '700',
  },
  errorTextSmall: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  webViewHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  webViewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeWebViewButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
