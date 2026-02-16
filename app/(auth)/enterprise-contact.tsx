import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AuthCard, AuthScreenBackground } from '@/components/auth';
import LabeledInput from '@/components/ui/labeled-input';
import { LinearGradient } from 'expo-linear-gradient';

import { Theme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FEATURES = [
  {
    title: 'Custom Integration',
    description: 'Seamless sync with your existing CRM and transaction management software.',
  },
  {
    title: 'Volume Licensing',
    description: 'Preferred pricing tiers for brokerages and large teams.',
  },
  {
    title: 'Dedicated Success Manager',
    description: 'White-glove onboarding and 24/7 priority support channel.',
  },
];

const TEAM_SIZE_OPTIONS = ['10-19 Agents', '20-50 Agents', '51-100 Agents', '100+ Agents'];

export default function EnterpriseContactScreen() {
  const router = useRouter();
  const [teamSizeModalVisible, setTeamSizeModalVisible] = useState(false);
  const [teamSize, setTeamSize] = useState('20-50 Agents');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const insets = useSafeAreaInsets();

  const handleRequestDemo = () => {
    // TODO: submit to API
    router.back();
  };

  return (
    <AuthScreenBackground>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Contact form card - pehle */}
          <AuthCard>
            <View style={styles.backButtonRow}>
              <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.textPrimary} />
              </Pressable>
            </View>
            <Text style={styles.formTitle}>Contact Sales</Text>

            <View style={styles.form}>
              <View style={styles.row}>
                <LabeledInput
                  label="First Name"
                  placeholder="Jane"
                  value={firstName}
                  onChangeText={setFirstName}
                  containerStyle={styles.flexItem}
                />
                <LabeledInput
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={setLastName}
                  containerStyle={styles.flexItem}
                />
              </View>
              <LabeledInput
                label="Work Email"
                placeholder="jane@brokerage.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <LabeledInput
                label="Brokerage / Company Name"
                placeholder="Acme Realty Group"
                value={company}
                onChangeText={setCompany}
              />

              <View style={styles.field}>
                <Text style={styles.label}>Team Size</Text>
                <Pressable
                  style={styles.selectTouchable}
                  onPress={() => setTeamSizeModalVisible(true)}>
                  <Text style={[styles.selectText, !teamSize && styles.selectPlaceholder]}>
                    {teamSize || 'Select team size'}
                  </Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color={Theme.iconMuted} />
                </Pressable>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>How can we help?</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Tell us about your team's needs..."
                  placeholderTextColor={Theme.inputPlaceholder}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <Pressable style={styles.submitButton} onPress={handleRequestDemo}>
                <LinearGradient
                  colors={[...Theme.brandGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButtonGradient}>
                  <Text style={styles.submitButtonText}>Request Demo</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color={Theme.gradientButtonText} />
                </LinearGradient>
              </Pressable>
            </View>
          </AuthCard>

          {/* Hero section - card ke baad, black text */}
          <View style={styles.hero}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ENTERPRISE</Text>
            </View>
            <Text style={styles.heroTitle}>Power your brokerage with Zien Intelligence.</Text>
            <Text style={styles.heroSubtitle}>
              Deploy our Neural Engine across your entire organization. Get custom API access, white-labeling, and
              dedicated support for teams of 20+ agents.
            </Text>
            <View style={styles.featureList}>
              {FEATURES.map((feature, i) => (
                <View key={i} style={styles.featureItem}>
                  <View style={styles.checkCircle}>
                    <MaterialCommunityIcons name="check" size={14} color={Theme.link} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={teamSizeModalVisible}
        transparent
        animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setTeamSizeModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Team Size</Text>
            {TEAM_SIZE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={[styles.modalOption, teamSize === option && styles.modalOptionSelected]}
                onPress={() => {
                  setTeamSize(option);
                  setTeamSizeModalVisible(false);
                }}>
                <Text style={styles.modalOptionText}>{option}</Text>
                {teamSize === option ? (
                  <MaterialCommunityIcons name="check" size={20} color={Theme.link} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    padding: Theme.screenPadding,
    flexGrow: 1,
    paddingBottom: 40,
  },
  hero: {
    marginTop: 24,
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Theme.link,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Theme.textPrimary,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.textPrimary,
    lineHeight: 28,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
    lineHeight: 21,
    marginBottom: 18,
  },
  featureList: {
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Theme.link,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  featureContent: { flex: 1 },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: Theme.textSecondary,
    lineHeight: 19,
  },
  backButtonRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: Theme.inputBorderRadius,
    backgroundColor: Theme.surfaceMuted,
    shadowColor: Theme.cardShadowColor,
    shadowOffset: Theme.cardShadowOffset,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.textPrimary,
    marginBottom: 18,
  },
  form: {
    alignSelf: 'stretch',
    gap: 14,
  },
  row: { flexDirection: 'row', gap: 12 },
  flexItem: { flex: 1 },
  field: { gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  selectTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.inputBackground,
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderInput,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectText: {
    fontSize: 15,
    color: Theme.textPrimary,
  },
  selectPlaceholder: {
    color: Theme.inputPlaceholder,
  },
  textArea: {
    backgroundColor: Theme.inputBackground,
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderInput,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Theme.textPrimary,
    minHeight: 100,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
    borderRadius: Theme.buttonBorderRadius,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.gradientButtonText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 16,
    padding: 16,
    maxHeight: 360,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.textPrimary,
    marginBottom: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  modalOptionSelected: {
    backgroundColor: Theme.surfaceMuted,
  },
  modalOptionText: {
    fontSize: 15,
    color: Theme.textPrimary,
  },
});
