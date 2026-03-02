import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INTEGRATIONS = [
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', desc: 'Deep bi-directional sync with Salesforce CRM for enterprise teams.', status: 'AVAILABLE' as const, icon: 'cloud-outline' as const, buttonLabel: 'Connect Now' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', desc: 'Automatically push leads and track marketing activity in HubSpot.', status: 'AVAILABLE' as const, icon: 'database-outline' as const, buttonLabel: 'Connect Now' },
  { id: 'mailchimp', name: 'Mailchimp', category: 'Email Marketing', desc: 'Sync your contact segments directly to Mailchimp audiences.', status: 'CONNECTED' as const, icon: 'email-outline' as const, buttonLabel: 'Manage Connection' },
  { id: 'gmail', name: 'Gmail', category: 'Email', desc: 'Send emails directly from ZIEN using your Gmail account.', status: 'AVAILABLE' as const, icon: 'email-outline' as const, buttonLabel: 'Connect Now' },
  { id: 'slack', name: 'Slack', category: 'Communication', desc: 'Get real-time notifications for leads and deals in your Slack workspace.', status: 'AVAILABLE' as const, icon: 'message-outline' as const, buttonLabel: 'Connect Now' },
  { id: 'gcal', name: 'Google Calendar', category: 'Calendar', desc: 'Sync appointments and schedule meetings directly from ZIEN.', status: 'CONNECTED' as const, icon: 'calendar-blank-outline' as const, buttonLabel: 'Manage Connection' },
  { id: 'zoom', name: 'Zoom', category: 'Video Conferencing', desc: 'Create and manage Zoom meetings for property tours and consultations.', status: 'AVAILABLE' as const, icon: 'video-outline' as const, buttonLabel: 'Connect Now' },
  { id: 'docusign', name: 'DocuSign', category: 'Documents', desc: 'Send contracts and documents for electronic signature.', status: 'AVAILABLE' as const, icon: 'file-document-outline' as const, buttonLabel: 'Connect Now' },
  { id: 'stripe', name: 'Stripe', category: 'Payments', desc: 'Process payments and manage billing for your real estate services.', status: 'COMING SOON' as const, icon: 'currency-usd' as const, buttonLabel: 'Request Early Access' },
  { id: 'twilio', name: 'Twilio', category: 'SMS', desc: 'Send SMS notifications and automate text message campaigns.', status: 'AVAILABLE' as const, icon: 'cellphone' as const, buttonLabel: 'Connect Now' },
  { id: 'zapier', name: 'Zapier', category: 'Automation', desc: 'Connect ZIEN to 5,000+ apps with custom automation workflows.', status: 'AVAILABLE' as const, icon: 'cog-outline' as const, buttonLabel: 'Connect Now' },
  { id: 'teams', name: 'Microsoft Teams', category: 'Communication', desc: 'Collaborate with your team and get notifications in Microsoft Teams.', status: 'COMING SOON' as const, icon: 'account-group-outline' as const, buttonLabel: 'Request Early Access' },
];

export default function IntegrationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <PageHeader
        title="Integrations"
        subtitle="Connect Zien to your existing software stack and streamline your workflow."
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>

        <View style={styles.topActionsRow}>
          <Pressable
            style={({ pressed }) => [styles.requestBtn, pressed && { opacity: 0.8 }]}
            onPress={() => setRequestModalVisible(true)}
          >
            <Text style={styles.requestBtnText}>Request Integration</Text>
          </Pressable>
        </View>

        <View style={styles.cardsWrap}>
          {INTEGRATIONS.map((int) => (
            <View key={int.id} style={styles.intCard}>
              <View style={styles.intCardTop}>
                <View style={styles.intIconWrap}>
                  <MaterialCommunityIcons name={int.icon} size={22} color="#0B2D3E" />
                </View>
                <View style={[
                  styles.statusPill,
                  int.status === 'CONNECTED' && styles.statusPillConnected,
                  int.status === 'COMING SOON' && styles.statusPillComingSoon
                ]}>
                  <Text style={[
                    styles.statusPillText,
                    int.status === 'CONNECTED' && styles.statusPillTextConnected,
                    int.status === 'COMING SOON' && styles.statusPillTextComingSoon
                  ]}>
                    {int.status}
                  </Text>
                </View>
              </View>

              <View style={styles.labelGroup}>
                <Text style={styles.intName}>{int.name}</Text>
                <Text style={styles.intCategory}>{int.category}</Text>
              </View>

              <Text style={styles.intDesc} numberOfLines={3}>{int.desc}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.intActionBtn,
                  int.status === 'CONNECTED' && styles.intActionBtnConnected,
                  int.status === 'COMING SOON' && styles.intActionBtnDisabled,
                  pressed && { opacity: 0.9 },
                ]}>
                {int.status === 'CONNECTED' && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />}
                <Text style={[
                  styles.intActionBtnText,
                  int.status === 'COMING SOON' && styles.intActionBtnTextDisabled,
                ]}>
                  {int.buttonLabel}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Request Integration Modal - Full Page */}
      <Modal
        visible={requestModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <LinearGradient
          colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Request Integration</Text>
                <Text style={styles.modalSubtitle}>
                  Don't see the integration you need? Let us know and we'll prioritize it for development.
                </Text>
              </View>
              <Pressable
                style={styles.closeBtnSmall}
                onPress={() => setRequestModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {/* Integration Name */}
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>INTEGRATION NAME *</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Asana, Trello, Monday.com"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Your Email */}
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>YOUR EMAIL *</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="your@email.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Message */}
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>WHY DO YOU NEED THIS? (Optional)</Text>
                <View style={[styles.inputWrap, styles.textAreaWrap]}>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Tell us how this integration would help your workflow..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooterActions}>
              <Pressable
                style={styles.cancelActionBtn}
                onPress={() => setRequestModalVisible(false)}
              >
                <Text style={styles.cancelActionBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.submitActionBtn}
                onPress={() => setRequestModalVisible(false)}
              >
                <MaterialCommunityIcons name="send" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitActionBtnText}>Submit Request</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.8)',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  headerCenter: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 20,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 10 },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  requestBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0B2D3E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardsWrap: {
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 24,
  },
  intCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  intCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  intIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  statusPillConnected: {
    backgroundColor: 'rgba(11, 160, 178, 0.1)',
  },
  statusPillComingSoon: {
    backgroundColor: '#F8FAFC',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  statusPillTextConnected: { color: '#0BA0B2' },
  statusPillTextComingSoon: { color: '#94A3B8' },
  labelGroup: {
    marginBottom: 8,
  },
  intName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.4,
  },
  intCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  intDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '500',
  },
  intActionBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  intActionBtnConnected: {
    backgroundColor: '#0BA0B2',
  },
  intActionBtnDisabled: {
    backgroundColor: '#F1F5F9',
    elevation: 0,
    shadowOpacity: 0,
  },
  intActionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  intActionBtnTextDisabled: { color: '#94A3B8' },
  // Modal Styles
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.6,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 12,
    lineHeight: 22,
  },
  closeBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginLeft: 16,
  },
  fieldItem: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  inputWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 54,
    justifyContent: 'center',
  },
  textAreaWrap: {
    height: 120,
    paddingVertical: 12,
  },
  textInput: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0B2D3E',
  },
  textArea: {
    height: '100%',
  },
  modalFooterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelActionBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelActionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
  },
  submitActionBtn: {
    flex: 1.5,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0B2D3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitActionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
