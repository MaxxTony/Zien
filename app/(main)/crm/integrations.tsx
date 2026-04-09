import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/context/ThemeContext';
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
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IntegrationStatus = 'AVAILABLE' | 'CONNECTED' | 'COMING SOON';

interface Integration {
  id: string;
  name: string;
  category: string;
  desc: string;
  status: IntegrationStatus;
  icon: any;
  buttonLabel: string;
}

const INITIAL_INTEGRATIONS: Integration[] = [
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
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = (id: string, name: string) => {
    setConnectingId(id);
    
    // Simulate connection delay
    setTimeout(() => {
      setIntegrations(prev => prev.map(int => 
        int.id === id 
          ? { ...int, status: 'CONNECTED', buttonLabel: 'Manage Connection' }
          : int
      ));
      setConnectingId(null);
      Alert.alert('Success', `${name} has been connected successfully.`);
    }, 2000);
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
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


        <View style={styles.cardsGrid}>
          {integrations.map((int) => {
            const isComingSoon = int.status === 'COMING SOON';
            const isConnected = int.status === 'CONNECTED';
            const isConnecting = connectingId === int.id;
            
            return (
              <View key={int.id} style={styles.intCard}>
                <View style={styles.intCardHeader}>
                  <View style={styles.intIconWrap}>
                    <MaterialCommunityIcons name={int.icon} size={24} color={colors.textPrimary} />
                  </View>
                  <View style={[
                    styles.statusBadge,
                    isConnected && styles.statusBadgeConnected,
                    isComingSoon && styles.statusBadgeComingSoon
                  ]}>
                    <Text style={[
                      styles.statusBadgeText,
                      isConnected && styles.statusBadgeTextConnected,
                      isComingSoon && styles.statusBadgeTextComingSoon
                    ]}>
                      {int.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.intMetaGroup}>
                  <Text style={styles.intName} numberOfLines={1}>{int.name}</Text>
                  <Text style={styles.intCategory}>{int.category}</Text>
                </View>

                <Text style={styles.intDesc} numberOfLines={2}>{int.desc}</Text>

                <Pressable
                  onPress={() => {
                    if (int.status === 'AVAILABLE') {
                      handleConnect(int.id, int.name);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.intActionBtn,
                    isConnected && styles.intActionBtnConnected,
                    isComingSoon && styles.intActionBtnDisabled,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                  ]}>
                  {isConnecting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      {isConnected && <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />}
                      <Text style={[
                        styles.intActionBtnText,
                        isComingSoon && styles.intActionBtnTextDisabled,
                      ]}>
                        {int.buttonLabel}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && { transform: [{ scale: 0.95 }] }
        ]}
        onPress={() => setRequestModalVisible(true)}
      >
        <LinearGradient
          colors={['#0BA0B2', '#0891B2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>

      {/* Request Integration Modal - Full Page */}
      <Modal
        visible={requestModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <LinearGradient
          colors={colors.backgroundGradient as any}
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
                <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
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

function getStyles(colors: any) {
  return StyleSheet.create({
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
    shadowColor: colors.accentTeal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  headerCenter: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 20,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 10 },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  intCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 8,
  },
  intCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  intIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  statusBadgeConnected: {
    backgroundColor: 'rgba(11, 160, 178, 0.1)',
  },
  statusBadgeComingSoon: {
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
  },
  statusBadgeText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  statusBadgeTextConnected: { color: '#0BA0B2' },
  statusBadgeTextComingSoon: { color: colors.inputPlaceholder },
  intMetaGroup: {
    marginBottom: 6,
  },
  intName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  intCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.inputPlaceholder,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  intDesc: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 16,
    fontWeight: '500',
    height: 32, // Fixed height for 2 lines
  },
  intActionBtn: {
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0F172A', // Dark premium blue/black from screenshot
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  intActionBtnConnected: {
    backgroundColor: '#0BA0B2',
  },
  intActionBtnDisabled: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  intActionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  intActionBtnTextDisabled: { color: colors.inputPlaceholder },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#0BA0B2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  modalSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 12,
    lineHeight: 22,
  },
  closeBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginLeft: 16,
  },
  fieldItem: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  inputWrap: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    color: colors.textPrimary,
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
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelActionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  submitActionBtn: {
    flex: 1.5,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.accentTeal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentTeal,
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
}