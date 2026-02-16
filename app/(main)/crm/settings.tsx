import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = ['General', 'Email Delivery', 'Automation Rules', 'Zien Extension'] as const;
type Tab = (typeof TABS)[number];

const LEAD_DISTRIBUTION_OPTIONS = ['Round Robin (Team)', 'First Available', 'Manual Assign'] as const;
const AUTOMATED_ACTION_OPTIONS = ["Send 'Just Checking In' Email", 'Create Follow-Up Task', 'Send SMS Reminder'] as const;

const EMAIL_PROVIDERS = [
  { id: 'mailgun', name: 'Mailgun' },
  { id: 'sendgrid', name: 'SendGrid' },
  { id: 'ses', name: 'Amazon SES' },
];

const ANNIVERSARY_RULES = [
  { id: 'home', label: 'Home Purchase Anniversary', icon: 'home-outline' as const },
  { id: 'birthday', label: 'Client Birthday', icon: 'gift-outline' as const },
  { id: 'marriage', label: 'Marriage Anniversary', icon: 'heart-outline' as const },
];

export default function CRMSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('General');
  const [leadDistribution, setLeadDistribution] = useState<(typeof LEAD_DISTRIBUTION_OPTIONS)[number]>('Round Robin (Team)');
  const [autoMergeDuplicates, setAutoMergeDuplicates] = useState(true);
  const [leadDistOpen, setLeadDistOpen] = useState(false);
  const [inactivityDays, setInactivityDays] = useState('90');
  const [automatedAction, setAutomatedAction] = useState<(typeof AUTOMATED_ACTION_OPTIONS)[number]>("Send 'Just Checking In' Email");
  const [automatedActionOpen, setAutomatedActionOpen] = useState(false);
  const [emailBodyPreview, setEmailBodyPreview] = useState("Hi [First Name], it's been a while! Are you still looking for properties in [Target Neighborhood]? I'd love to show you some new listings that just hit the market...");
  const [ghostProtocolEnabled, setGhostProtocolEnabled] = useState(true);
  const [anniversaryToggles, setAnniversaryToggles] = useState<Record<string, boolean>>({
    home: false,
    birthday: false,
    marriage: false,
  });

  const setAnniversaryToggle = (id: string, value: boolean) =>
    setAnniversaryToggles((prev) => ({ ...prev, [id]: value }));

  const handleSave = () => {
    // persist settings
  };

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
          <Text style={styles.title}>CRM & Marketing Settings</Text>
          <Text style={styles.subtitle}>
            Configure attribution, automated follow-ups, and email providers.
          </Text>
        </View>
      </View>

      {/* Tabs — horizontal scroll on mobile */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
              {isActive && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {activeTab === 'General' && (
          <View style={styles.tabPanel}>
            <Text style={styles.cardTitle}>Lead Routing & Duplicate Detection</Text>
            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>Default Lead Distribution</Text>
                <Pressable
                  style={styles.select}
                  onPress={() => setLeadDistOpen((v) => !v)}>
                  <Text style={styles.selectText}>{leadDistribution}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                </Pressable>
                {leadDistOpen && (
                  <View style={styles.dropdown}>
                    {LEAD_DISTRIBUTION_OPTIONS.map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => { setLeadDistribution(opt); setLeadDistOpen(false); }}>
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.toggleRow}>
                <View style={styles.toggleLabelWrap}>
                  <Text style={styles.label}>Auto-Merge Duplicates</Text>
                  <Text style={styles.toggleDesc}>Automatically merge leads with matching email/phone.</Text>
                </View>
                <Switch
                  value={autoMergeDuplicates}
                  onValueChange={setAutoMergeDuplicates}
                  trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Email Delivery' && (
          <View style={styles.tabPanel}>
            <Text style={styles.cardTitle}>Transactional Email Provider</Text>
            <Text style={styles.cardDesc}>
              Connect your preferred provider for scalable delivery (Mailgun, SendGrid, etc.).
            </Text>
            <View style={styles.card}>
              {EMAIL_PROVIDERS.map((provider, idx) => (
                <Pressable
                  key={provider.id}
                  style={[styles.providerRow, idx === EMAIL_PROVIDERS.length - 1 && styles.providerRowLast]}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Pressable style={styles.connectApiBtn}>
                    <Text style={styles.connectApiBtnText}>Connect API Key</Text>
                  </Pressable>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'Automation Rules' && (
          <View style={styles.tabPanel}>
            {/* Ghost Re-Engagement Protocol */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>Ghost Re-Engagement Protocol</Text>
              <Text style={styles.sectionCardDesc}>
                Automatically re-engage leads who have shown no activity for a set period.
              </Text>
              <View style={styles.field}>
                <Text style={styles.label}>Inactivity Threshold (Days)</Text>
                <TextInput
                  style={styles.input}
                  value={inactivityDays}
                  onChangeText={setInactivityDays}
                  placeholder="90"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Automated Action</Text>
                <Pressable
                  style={styles.select}
                  onPress={() => setAutomatedActionOpen((v) => !v)}>
                  <Text style={styles.selectText} numberOfLines={1}>{automatedAction}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                </Pressable>
                {automatedActionOpen && (
                  <View style={styles.dropdown}>
                    {AUTOMATED_ACTION_OPTIONS.map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => { setAutomatedAction(opt); setAutomatedActionOpen(false); }}>
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Email Body Preview</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={emailBodyPreview}
                  onChangeText={setEmailBodyPreview}
                  placeholder="Email content..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                />
              </View>
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Enable Ghost Protocol</Text>
                <Switch
                  value={ghostProtocolEnabled}
                  onValueChange={setGhostProtocolEnabled}
                  trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Anniversary Automation */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>Anniversary Automation</Text>
              <Text style={styles.sectionCardDesc}>
                Build long-term loyalty with life-event triggers.
              </Text>
              {ANNIVERSARY_RULES.map((rule, idx) => (
                <View key={rule.id} style={[styles.anniversaryRow, idx === 0 && styles.anniversaryRowFirst]}>
                  <MaterialCommunityIcons name={rule.icon} size={22} color="#0BA0B2" />
                  <Text style={styles.anniversaryLabel}>{rule.label}</Text>
                  <Switch
                    value={anniversaryToggles[rule.id] ?? false}
                    onValueChange={(v) => setAnniversaryToggle(rule.id, v)}
                    trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'Zien Extension' && (
          <View style={styles.tabPanel}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>ZIEN AI Chrome Extension</Text>
              <View style={styles.extensionBlock}>
                <View style={styles.extensionIconWrap}>
                  <MaterialCommunityIcons name="link-variant" size={32} color="#0B2D3E" />
                </View>
                <View style={styles.extensionTextWrap}>
                  <Text style={styles.extensionPhase}>The Extension (Phase 3 Completed)</Text>
                  <Text style={styles.extensionDesc}>
                    Import listings from Zillow, Redfin, and Realtor directly into your CRM with one click.
                  </Text>
                  <Pressable style={styles.downloadBtn}>
                    <Text style={styles.downloadBtnText}>Download Extension</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={styles.howItWorksTitle}>HOW IT WORKS</Text>
              <View style={styles.bulletList}>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Search any listing on Zillow or Redfin.</Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Click "Add to Zien" in the Extension panel.</Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Zien dynamically reads the browser tab for you for effortless, one-click integration.</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Save Changes — sticky at bottom on mobile */}
      <View style={[styles.saveBar, { paddingBottom: 16 + insets.bottom }]}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.92 }]}
          onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
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
  },
  headerCenter: { flex: 1, minWidth: 0 },
  title: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: '#5B6B7A', fontWeight: '500', marginTop: 6, lineHeight: 20 },
  tabsScroll: { maxHeight: 55, marginBottom: 4 },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  tabActive: { backgroundColor: 'rgba(11, 45, 62, 0.08)' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#5B6B7A' },
  tabTextActive: { color: '#0B2D3E', fontWeight: '800' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: '#0BA0B2',
    borderRadius: 2,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },
  tabPanel: { marginBottom: 24 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#0B2D3E', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#5B6B7A', marginBottom: 12, lineHeight: 21 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#0B2D3E', marginBottom: 8 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0B2D3E',
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectText: { fontSize: 15, fontWeight: '600', color: '#0B2D3E', flex: 1 },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 14 },
  dropdownItemText: { fontSize: 15, fontWeight: '600', color: '#0B2D3E' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  toggleLabelWrap: { flex: 1, marginRight: 12 },
  toggleDesc: { fontSize: 13, color: '#5B6B7A', marginTop: 4 },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F4F8',
  },
  providerRowLast: { borderBottomWidth: 0 },
  providerName: { fontSize: 16, fontWeight: '700', color: '#0B2D3E' },
  connectApiBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  connectApiBtnText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionCardTitle: { fontSize: 17, fontWeight: '800', color: '#0B2D3E', marginBottom: 6 },
  sectionCardDesc: { fontSize: 14, color: '#5B6B7A', marginBottom: 16, lineHeight: 21 },
  anniversaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0F4F8',
    gap: 12,
  },
  anniversaryRowFirst: { borderTopWidth: 0 },
  anniversaryLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#0B2D3E' },
  extensionBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  extensionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 45, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extensionTextWrap: { flex: 1, minWidth: 0 },
  extensionPhase: { fontSize: 16, fontWeight: '800', color: '#0B2D3E', marginBottom: 6 },
  extensionDesc: { fontSize: 14, color: '#5B6B7A', lineHeight: 21, marginBottom: 14 },
  downloadBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
  },
  downloadBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  howItWorksTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0BA0B2',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  bulletList: { gap: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { fontSize: 16, color: '#0BA0B2', fontWeight: '700' },
  bulletText: { flex: 1, fontSize: 14, color: '#5B6B7A', lineHeight: 21 },
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(202, 216, 228, 0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(11, 45, 62, 0.08)',
  },
  saveBtn: {
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
});
