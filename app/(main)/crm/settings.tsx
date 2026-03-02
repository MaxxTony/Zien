import { PageHeader } from '@/components/ui/PageHeader';
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

const INACTIVITY_OPTIONS = ['30 Days', '60 Days', '90 Days (Recommended)', '180 Days'] as const;
const SAFETY_LIMIT_OPTIONS = ['1 Attempt', '3 Attempts (Max)', 'No Limit'] as const;
const TARGET_SEGMENT_OPTIONS = ['Standard Leads', 'Cold Outreach', 'Dormant Buyers'] as const;
const SENDER_IDENTITY_OPTIONS = [
  'Assigned Agent (Personalized)',
  'Zien Concierge (Neutral)',
  'Brokerage Principal (High Priority)',
] as const;

export default function CRMSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('General');
  const [leadDistribution, setLeadDistribution] = useState<(typeof LEAD_DISTRIBUTION_OPTIONS)[number]>('Round Robin (Team)');
  const [autoMergeDuplicates, setAutoMergeDuplicates] = useState(true);
  const [leadDistOpen, setLeadDistOpen] = useState(false);
  const [inactivityDays, setInactivityDays] = useState<(typeof INACTIVITY_OPTIONS)[number]>('90 Days (Recommended)');
  const [safetyLimit, setSafetyLimit] = useState<(typeof SAFETY_LIMIT_OPTIONS)[number]>('3 Attempts (Max)');
  const [reEngagementChannel, setReEngagementChannel] = useState<'EMAIL' | 'SMS' | 'WHATSAPP'>('EMAIL');
  const [protocolIdentity, setProtocolIdentity] = useState<(typeof SENDER_IDENTITY_OPTIONS)[number]>('Assigned Agent (Personalized)');
  const [targetSegmentGhost, setTargetSegmentGhost] = useState<(typeof TARGET_SEGMENT_OPTIONS)[number]>('Standard Leads');

  const [inactivityOpen, setInactivityOpen] = useState(false);
  const [safetyLimitOpen, setSafetyLimitOpen] = useState(false);
  const [targetSegmentOpen, setTargetSegmentOpen] = useState(false);
  const [protocolIdentityOpen, setProtocolIdentityOpen] = useState(false);

  const [automatedAction, setAutomatedAction] = useState<(typeof AUTOMATED_ACTION_OPTIONS)[number]>("Send 'Just Checking In' Email");
  const [automatedActionOpen, setAutomatedActionOpen] = useState(false);
  const [emailBodyPreview, setEmailBodyPreview] = useState("\"Hi {{first_name}}, it's been a while since we last spoke. I noticed you haven't browsed the {{last_property}} details recently—are you still tracking listing in that area or should I pause your updates?\"");
  const [ghostProtocolEnabled, setGhostProtocolEnabled] = useState(true);
  const [anniversaryToggles, setAnniversaryToggles] = useState<Record<string, boolean>>({
    home: false,
    birthday: false,
    marriage: false,
  });
  const [customRules, setCustomRules] = useState<{ id: string; label: string; icon: any; enabled: boolean }[]>([]);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState('');

  const setAnniversaryToggle = (id: string, value: boolean) =>
    setAnniversaryToggles((prev) => ({ ...prev, [id]: value }));

  const handleAddMilestone = () => {
    if (!newMilestoneName.trim()) return;
    const newId = `custom_${Date.now()}`;
    setCustomRules((prev) => [
      ...prev,
      {
        id: newId,
        label: newMilestoneName,
        icon: 'star-outline' as const,
        enabled: true,
      },
    ]);
    setNewMilestoneName('');
    setIsMilestoneModalOpen(false);
  };

  const handleSave = () => {
    // persist settings
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <PageHeader
        title="CRM & Marketing Settings"
        subtitle="Configure attribution, automated follow-ups, and email providers."
        onBack={() => router.back()}
      />

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
            <View style={styles.columnView}>
              {/* Ghost Re-Engagement Protocol */}
              <View style={styles.sectionCardPremium}>
                <Text style={styles.premiumSectionTitle}>Ghost Re-Engagement Protocol</Text>
                <Text style={styles.premiumSectionSubtitle}>
                  Automatically re-engage leads who have shown no activity for a set period.
                </Text>

                <View style={styles.premiumFieldRow}>
                  <View style={[styles.premiumField, { flex: 1, zIndex: 100 }]}>
                    <Text style={styles.premiumLabel}>Inactivity Threshold</Text>
                    <Pressable
                      style={styles.premiumSelect}
                      onPress={() => setInactivityOpen(!inactivityOpen)}>
                      <Text style={styles.premiumSelectText}>{inactivityDays}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={18} color="#0B2D3E" />
                    </Pressable>
                    {inactivityOpen && (
                      <View style={styles.premiumDropdown}>
                        {INACTIVITY_OPTIONS.map((opt) => (
                          <Pressable
                            key={opt}
                            style={styles.premiumDropdownItem}
                            onPress={() => {
                              setInactivityDays(opt);
                              setInactivityOpen(false);
                            }}>
                            <View style={styles.premiumDropdownCheck}>
                              {inactivityDays === opt && (
                                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                              )}
                            </View>
                            <Text style={styles.premiumDropdownText}>{opt}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={[styles.premiumField, { flex: 1, zIndex: 100 }]}>
                    <Text style={styles.premiumLabel}>Safety Limit</Text>
                    <Pressable
                      style={styles.premiumSelect}
                      onPress={() => setSafetyLimitOpen(!safetyLimitOpen)}>
                      <Text style={styles.premiumSelectText}>{safetyLimit}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={18} color="#0B2D3E" />
                    </Pressable>
                    {safetyLimitOpen && (
                      <View style={styles.premiumDropdown}>
                        {SAFETY_LIMIT_OPTIONS.map((opt) => (
                          <Pressable
                            key={opt}
                            style={styles.premiumDropdownItem}
                            onPress={() => {
                              setSafetyLimit(opt);
                              setSafetyLimitOpen(false);
                            }}>
                            <View style={styles.premiumDropdownCheck}>
                              {safetyLimit === opt && (
                                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                              )}
                            </View>
                            <Text style={styles.premiumDropdownText}>{opt}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <View style={[styles.premiumFieldRow, { zIndex: 90 }]}>
                  <View style={[styles.premiumField, { flex: 1 }]}>
                    <Text style={styles.premiumLabel}>Target Segment</Text>
                    <Pressable
                      style={styles.premiumSelect}
                      onPress={() => setTargetSegmentOpen(!targetSegmentOpen)}>
                      <Text style={styles.premiumSelectText} numberOfLines={2}>{targetSegmentGhost}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={16} color="#475569" />
                    </Pressable>
                    {targetSegmentOpen && (
                      <View style={styles.premiumDropdown}>
                        {TARGET_SEGMENT_OPTIONS.map((opt) => (
                          <Pressable
                            key={opt}
                            style={styles.premiumDropdownItem}
                            onPress={() => {
                              setTargetSegmentGhost(opt);
                              setTargetSegmentOpen(false);
                            }}>
                            <View style={styles.premiumDropdownCheck}>
                              {targetSegmentGhost === opt && (
                                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                              )}
                            </View>
                            <Text style={styles.premiumDropdownText}>{opt}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={[styles.premiumField, { flex: 1 }]}>
                    <Text style={styles.premiumLabel}>Protocol Identity</Text>
                    <Pressable
                      style={styles.premiumSelect}
                      onPress={() => setProtocolIdentityOpen(!protocolIdentityOpen)}>
                      <Text style={styles.premiumSelectText} numberOfLines={2}>{protocolIdentity}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={16} color="#475569" />
                    </Pressable>
                    {protocolIdentityOpen && (
                      <View style={styles.premiumDropdown}>
                        {SENDER_IDENTITY_OPTIONS.map((opt) => (
                          <Pressable
                            key={opt}
                            style={styles.premiumDropdownItem}
                            onPress={() => {
                              setProtocolIdentity(opt);
                              setProtocolIdentityOpen(false);
                            }}>
                            <View style={styles.premiumDropdownCheck}>
                              {protocolIdentity === opt && (
                                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                              )}
                            </View>
                            <Text style={styles.premiumDropdownText}>{opt}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
                <Text style={[styles.fieldHint, { marginTop: -12, marginBottom: 20 }]}>Defines the "From" name and signature personality for automated outreach.</Text>

                <View style={styles.premiumField}>
                  <Text style={styles.premiumLabel}>Re-engagement Channel</Text>
                  <View style={styles.segmentedControl}>
                    <Pressable
                      style={[styles.segmentBtn, reEngagementChannel === 'EMAIL' && styles.segmentBtnActive]}
                      onPress={() => setReEngagementChannel('EMAIL')}
                    >
                      <MaterialCommunityIcons name="email-outline" size={16} color={reEngagementChannel === 'EMAIL' ? '#FFFFFF' : '#0B2D3E'} />
                      <Text style={[styles.segmentBtnText, reEngagementChannel === 'EMAIL' && styles.segmentBtnTextActive]}>EMAIL</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.segmentBtn, reEngagementChannel === 'SMS' && styles.segmentBtnActive]}
                      onPress={() => setReEngagementChannel('SMS')}
                    >
                      <MaterialCommunityIcons name="cellphone-text" size={16} color={reEngagementChannel === 'SMS' ? '#FFFFFF' : '#0B2D3E'} />
                      <Text style={[styles.segmentBtnText, reEngagementChannel === 'SMS' && styles.segmentBtnTextActive]}>SMS</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.segmentBtn, reEngagementChannel === 'WHATSAPP' && styles.segmentBtnActive]}
                      onPress={() => setReEngagementChannel('WHATSAPP')}
                    >
                      <MaterialCommunityIcons name="whatsapp" size={16} color={reEngagementChannel === 'WHATSAPP' ? '#FFFFFF' : '#0B2D3E'} />
                      <Text style={[styles.segmentBtnText, reEngagementChannel === 'WHATSAPP' && styles.segmentBtnTextActive]}>WHATSAPP</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={[styles.premiumField, { marginBottom: 12 }]}>
                  <Text style={styles.premiumLabel}>Recovery Messaging (Editable Script)</Text>
                  <View style={styles.draftingWrap}>
                    <View style={styles.draftingHeader}>
                      <Text style={styles.draftingBadge}>DRAFTING WORKSPACE</Text>
                    </View>
                    <TextInput
                      style={styles.premiumTextArea}
                      value={emailBodyPreview}
                      onChangeText={setEmailBodyPreview}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                    />
                    <View style={styles.draftingFooter}>
                      <View style={styles.tokenBadge}><Text style={styles.tokenText}>{"{{ first_name }}"}</Text></View>
                      <View style={styles.tokenBadge}><Text style={styles.tokenText}>{"{{ last_property }}"}</Text></View>
                    </View>
                  </View>
                  <Text style={styles.fieldHint}>Your script will automatically adapt to the lead's history and selected Re-engagement Channel.</Text>
                </View>

                <View style={styles.toggleRowPremium}>
                  <Text style={styles.premiumLabelLarge}>Enable Ghost Protocol</Text>
                  <Switch
                    value={ghostProtocolEnabled}
                    onValueChange={setGhostProtocolEnabled}
                    trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* Anniversary Automation */}
              <View style={styles.sectionCardPremiumSmall}>
                <Text style={styles.premiumSectionTitle}>Anniversary Automation</Text>
                <Text style={styles.premiumSectionSubtitle}>
                  Build long-term loyalty with life-event triggers.
                </Text>

                <View style={styles.anniversaryList}>
                  {ANNIVERSARY_RULES.map((rule) => (
                    <View key={rule.id} style={styles.anniversaryItemPremium}>
                      <View style={styles.anniversaryIconBoxPremium}>
                        <MaterialCommunityIcons name={rule.icon} size={22} color="#0B2D3E" />
                      </View>
                      <Text style={styles.anniversaryLabelPremiumText}>{rule.label}</Text>
                      <Switch
                        value={anniversaryToggles[rule.id] ?? false}
                        onValueChange={(v) => setAnniversaryToggle(rule.id, v)}
                        trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                  ))}
                  {customRules.map((rule) => (
                    <View key={rule.id} style={styles.anniversaryItemPremium}>
                      <View style={styles.anniversaryIconBoxPremium}>
                        <MaterialCommunityIcons name={rule.icon} size={22} color="#0B2D3E" />
                      </View>
                      <Text style={styles.anniversaryLabelPremiumText}>{rule.label}</Text>
                      <Switch
                        value={rule.enabled}
                        onValueChange={(v) =>
                          setCustomRules((prev) =>
                            prev.map((r) => (r.id === rule.id ? { ...r, enabled: v } : r))
                          )
                        }
                        trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                  ))}
                </View>

                <Pressable
                  style={styles.addCustomBtn}
                  onPress={() => setIsMilestoneModalOpen(true)}>
                  <MaterialCommunityIcons name="plus" size={18} color="#64748B" />
                  <Text style={styles.addCustomBtnText}>ADD CUSTOM MILESTONE</Text>
                </Pressable>
              </View>
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

      {/* Milestone Modal */}
      {isMilestoneModalOpen && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsMilestoneModalOpen(false)} />
          <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.modalTitleText}>New Milestone</Text>
              <Text style={styles.modalSubTitleText}>
                Enter a name for this anniversary trigger. This will allow you to automate personalized outreach for this life event.
              </Text>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>MILESTONE NAME</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., Child's Birthday"
                placeholderTextColor="#94A3B8"
                value={newMilestoneName}
                onChangeText={setNewMilestoneName}
                autoFocus
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setIsMilestoneModalOpen(false)}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalCreateBtn} onPress={handleAddMilestone}>
                <Text style={styles.modalCreateBtnText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

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
  // Premium Layout Styles
  columnView: {
    gap: 20,
  },
  sectionCardPremium: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  sectionCardPremiumSmall: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  premiumSectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.4,
  },
  premiumSectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  premiumField: {
    marginBottom: 20,
  },
  premiumFieldRow: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  premiumLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  premiumLabelLarge: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  premiumSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  premiumSelectText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
    flex: 1,
    lineHeight: 18,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#0B2D3E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
  },
  draftingWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  draftingHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  draftingBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: 0.5,
    backgroundColor: 'rgba(11, 45, 62, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  premiumTextArea: {
    padding: 16,
    fontSize: 14,
    color: '#0B2D3E',
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 22,
    minHeight: 120,
  },
  draftingFooter: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tokenBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tokenText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00897B',
  },
  fieldHint: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 16,
  },
  toggleRowPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  anniversaryList: {
    gap: 12,
    marginBottom: 20,
  },
  anniversaryItemPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  anniversaryIconBoxPremium: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anniversaryLabelPremiumText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 52,
    gap: 8,
  },
  addCustomBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  // Modal Styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    width: '100%',
  },
  bottomSheetHeader: {
    marginBottom: 24,
  },
  modalTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 12,
  },
  modalSubTitleText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
  modalField: {
    marginBottom: 32,
  },
  modalLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0B2D3E',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: '#0B2D3E',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
  },
  modalCreateBtn: {
    flex: 1,
    backgroundColor: '#0B2D3E',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCreateBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  premiumDropdown: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: '#525252',
    borderRadius: 12,
    paddingVertical: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#666',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  premiumDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  premiumDropdownCheck: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumDropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
