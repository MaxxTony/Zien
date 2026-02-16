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
  TextInput,
  View,
} from 'react-native';

import { AuthCard, AuthLogoBrand, AuthScreenBackground } from '@/components/auth';
import GradientButton from '@/components/ui/GradientButton';
import LabeledInput from '@/components/ui/labeled-input';
import OutlineButton from '@/components/ui/OutlineButton';
import PasswordInput from '@/components/ui/PasswordInput';
import StepIndicator from '@/components/ui/StepIndicator';

import { Theme } from '@/constants/theme';

type PlanId = 'pro' | 'unlimited';

export default function TeamOnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('unlimited');

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
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
            <Text style={styles.title}>Owner Account</Text>
            <Text style={styles.subtitle}>Set up your personal access first</Text>
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
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>Team Setup</Text>
            <Text style={styles.subtitle}>Define your team workspace</Text>
            <View style={styles.form}>
              <LabeledInput label="Team Name" placeholder="The Elite Group" />
              <View style={styles.field}>
                <Text style={styles.label}>Team URL</Text>
                <View style={styles.urlRow}>
                  <Text style={styles.urlPrefix}>zien.ai/</Text>
                  <TextInput
                    placeholder="elite-group"
                    style={styles.urlInput}
                    placeholderTextColor={Theme.inputPlaceholder}
                    autoCapitalize="none"
                  />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Team Logo (Optional)</Text>
                <Pressable style={styles.uploadBox}>
                  <MaterialCommunityIcons name="image-outline" size={20} color={Theme.iconMuted} />
                  <Text style={styles.uploadText}>Drag and drop or click to upload</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.actionRow}>
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={goBack} />
              <GradientButton title="Continue" style={styles.primaryButtonFlex} onPress={goNext} />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>Role Confirmation</Text>
            <Text style={styles.subtitle}>You are creating this team</Text>
            <View style={styles.roleCard}>
              <View style={styles.roleIcon}>
                <MaterialCommunityIcons name="shield-account-outline" size={20} color={Theme.iconPrimary} />
              </View>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>Role: Team Owner</Text>
                <Text style={styles.roleDescription}>
                  Administrative control over billing, member management, and workspace settings.
                </Text>
              </View>
            </View>
            <Text style={styles.infoText}>
              As an owner, you can assign <Text style={styles.infoStrong}>Admins, Agents,</Text> and{' '}
              <Text style={styles.infoStrong}>Marketing Users</Text> once the dashboard is active.
            </Text>
            <View style={styles.actionRow}>
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={goBack} />
              <GradientButton title="Confirm & Proceed" style={styles.primaryButtonFlex} onPress={goNext} />
            </View>
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>Team Plan</Text>
            <Text style={styles.subtitle}>Scale your productivity as a group</Text>
            <View style={styles.planList}>
              <Pressable
                style={[styles.planCard, selectedPlan === 'pro' ? styles.planSelected : null]}
                onPress={() => setSelectedPlan('pro')}>
                <View>
                  <Text style={styles.planTitle}>Pro Team</Text>
                  <Text style={styles.planDescription}>Up to 5 members</Text>
                </View>
                <Text style={styles.planPrice}>$199/mo</Text>
              </Pressable>
              <Pressable
                style={[styles.planCard, selectedPlan === 'unlimited' ? styles.planSelected : null]}
                onPress={() => setSelectedPlan('unlimited')}>
                <View>
                  <Text style={styles.planTitle}>Unlimited Team</Text>
                  <Text style={styles.planDescription}>Infinite scale & support</Text>
                </View>
                <Text style={styles.planPrice}>$349/mo</Text>
              </Pressable>
            </View>
            <View style={styles.actionRow}>
              <OutlineButton title="Back" style={styles.secondaryButton} onPress={goBack} />
              <GradientButton title="Continue to Invites" style={styles.primaryButtonFlex} onPress={goNext} />
            </View>
          </>
        );
      case 5:
        return (
          <>
            <Text style={styles.title}>Invite Members</Text>
            <Text style={styles.subtitle}>Add your team now (optional)</Text>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inviteRow}>
                  <TextInput
                    placeholder="colleague@company.com"
                    style={styles.inviteInput}
                    placeholderTextColor={Theme.inputPlaceholder}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <Pressable style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
              <LabeledInput label="Role" placeholder="Agent (Team Member)" />
            </View>
            <View style={styles.actionRow}>
              <OutlineButton title="Skip for now" style={styles.secondaryButton} onPress={() => setCurrentStep(6)} />
              <GradientButton title="Finish Setup" style={styles.primaryButtonFlex} onPress={() => setCurrentStep(6)} />
            </View>
          </>
        );
      default:
        return (
          <>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="rocket-launch" size={26} color={Theme.link} />
            </View>
            <Text style={styles.title}>Team Created!</Text>
            <Text style={styles.subtitle}>Welcome, Team Leader.</Text>
            <Text style={styles.message}>
              Your workspace is being provisioned. Your team will receive invitations shortly.
            </Text>
            <GradientButton
              title="Access Owner Dashboard"
              style={styles.primaryButton}
              onPress={() => router.push('/(main)/dashboard')}
            />
          </>
        );
    }
  };

  return (
    <AuthScreenBackground>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <AuthCard style={styles.cardSoft}>
            <View style={styles.backButtonRow}>
              <Pressable style={styles.backButton} onPress={goBack} hitSlop={12}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.textPrimary} />
              </Pressable>
            </View>
            <AuthLogoBrand brandLabel="ZIEN" />

            {currentStep <= 5 ? <StepIndicator currentStep={currentStep} totalSteps={5} /> : null}

            {renderStepContent()}
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.screenPadding,
    justifyContent: 'center',
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
  cardSoft: {
    backgroundColor: Theme.cardBackground,
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
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  urlPrefix: {
    fontSize: 13.5,
    color: Theme.textMuted,
    marginRight: 6,
  },
  urlInput: {
    flex: 1,
    fontSize: 13.5,
    color: Theme.textPrimary,
  },
  uploadBox: {
    borderRadius: Theme.buttonBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    borderStyle: 'dashed',
    backgroundColor: Theme.surfaceMuted,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 12.5,
    color: Theme.textMuted,
  },
  roleCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Theme.surfaceMuted,
    borderRadius: Theme.buttonBorderRadius,
    padding: 14,
    width: '100%',
    marginBottom: 14,
  },
  roleIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Theme.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleContent: {
    flex: 1,
    gap: 4,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  roleDescription: {
    fontSize: 12.5,
    color: Theme.textSecondary,
  },
  infoText: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  infoStrong: {
    color: Theme.textPrimary,
    fontWeight: '600',
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
  inviteRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inviteInput: {
    flex: 1,
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: Theme.textPrimary,
  },
  addButton: {
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    backgroundColor: Theme.cardBackground,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Theme.outlineButtonText,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  secondaryButton: {
    flex: 0,
    minWidth: 100,
  },
  primaryButtonFlex: {
    flex: 1,
  },
  primaryButton: {
    width: '100%',
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
});
