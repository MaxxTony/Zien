import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.back()}
          hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Tools & Integrations</Text>
          <Text style={styles.subtitle}>
            Connect ZIEN to your existing software stack.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topActionsRow}>
          <Pressable style={({ pressed }) => [styles.requestBtn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.requestBtnText}>Request Integration</Text>
          </Pressable>
        </View>

        <View style={styles.cardsWrap}>
          {INTEGRATIONS.map((int) => (
            <View key={int.id} style={styles.intCard}>
              <View style={styles.intCardTop}>
                <View style={styles.intIconWrap}>
                  <MaterialCommunityIcons name={int.icon} size={24} color="#0B2D3E" />
                </View>
                <View style={[styles.statusPill, int.status === 'CONNECTED' && styles.statusPillConnected, int.status === 'COMING SOON' && styles.statusPillComingSoon]}>
                  <Text style={[styles.statusPillText, int.status === 'CONNECTED' && styles.statusPillTextConnected, int.status === 'COMING SOON' && styles.statusPillTextComingSoon]}>
                    {int.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.intName}>{int.name}</Text>
              <Text style={styles.intCategory}>{int.category}</Text>
              <Text style={styles.intDesc}>{int.desc}</Text>
              <View style={{ flex: 1 }} />
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
                  int.status === 'CONNECTED' && styles.intActionBtnTextConnected,
                  int.status === 'COMING SOON' && styles.intActionBtnTextDisabled,
                ]}>
                  {int.buttonLabel}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
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
  scrollContent: { paddingHorizontal: 20 },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginTop: -40,
    zIndex: 10,
  },
  requestBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0B2D3E',
  },
  requestBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  cardsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 24,
  },
  intCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    minWidth: 260,
    flexBasis: 260,
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  intCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  intIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  statusPillConnected: {
    backgroundColor: 'rgba(11, 160, 178, 0.1)',
  },
  statusPillComingSoon: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: { fontSize: 10, fontWeight: '800', color: '#475569' },
  statusPillTextConnected: { color: '#0BA0B2' },
  statusPillTextComingSoon: { color: '#94A3B8' },
  intName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  intCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
    marginTop: 2,
  },
  intDesc: {
    fontSize: 13,
    color: '#5B6B7A',
    lineHeight: 18,
    marginBottom: 20,
  },
  intActionBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0B2D3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  intActionBtnConnected: {
    backgroundColor: '#0BA0B2',
  },
  intActionBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  intActionBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  intActionBtnTextConnected: { color: '#FFFFFF' },
  intActionBtnTextDisabled: { color: '#94A3B8' },
});
