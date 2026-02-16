import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CAMPAIGNS = [
  { id: '1', name: 'Spring Luxury Newsletter', audience: 'ALL BUYERS', delivery: 'Jan 24, 2026', openRate: 42, clickRate: 12, status: 'COMPLETED' as const },
  { id: '2', name: 'Malibu Villa - Price Drop', audience: 'HOT LEADS', delivery: 'Jan 20, 2026', openRate: 65, clickRate: 28, status: 'COMPLETED' as const },
  { id: '3', name: 'Open House Follow-up (Bulk)', audience: 'BUSINESS WAY LEADS', delivery: 'Jan 15, 2026', openRate: 58, clickRate: 15, status: 'COMPLETED' as const },
];

const SEGMENT_OPTIONS = ['All Contacts', 'All Buyers', 'Hot Leads', 'Business Way Leads'] as const;
const TEMPLATE_OPTIONS = ['Monthly Market Update', 'Price Drop Alert', 'Open House Invite', 'New Listings Digest'] as const;
const PROVIDER_OPTIONS = ['SendGrid (Connected)', 'Mailchimp', 'Resend'] as const;

function OpenRateBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <View style={styles.openRateWrap}>
      <View style={styles.openRateBg}>
        <View style={[styles.openRateFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.openRateText}>{value}%</Text>
    </View>
  );
}

export default function CRMCampaignsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: screenWidth } = Dimensions.get('window');
  const [newCampaignVisible, setNewCampaignVisible] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [segment, setSegment] = useState<(typeof SEGMENT_OPTIONS)[number]>('All Contacts');
  const [template, setTemplate] = useState<(typeof TEMPLATE_OPTIONS)[number]>('Monthly Market Update');
  const [provider, setProvider] = useState<(typeof PROVIDER_OPTIONS)[number]>('SendGrid (Connected)');
  const [abTestingEnabled, setAbTestingEnabled] = useState(true);
  const [versionA, setVersionA] = useState('You won\'t believe this price drop...');
  const [versionB, setVersionB] = useState('New Pricing: Malibu Villa is now $1.2M');
  const [segmentOpen, setSegmentOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [providerOpen, setProviderOpen] = useState(false);
  const [roiCampaignId, setRoiCampaignId] = useState<string | null>(null);

  const isNarrow = screenWidth < 400;
  const roiCampaign = roiCampaignId ? CAMPAIGNS.find((c) => c.id === roiCampaignId) : null;

  const closeNewCampaign = () => {
    setNewCampaignVisible(false);
    setSegmentOpen(false);
    setTemplateOpen(false);
    setProviderOpen(false);
  };

  const handleScheduleSend = () => {
    closeNewCampaign();
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.85 }]} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Bulk Email & Campaigns</Text>
          <Text style={styles.subtitle}>
            Scalable marketing with full provider transparency and A/B analytics.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={({ pressed }) => [styles.launchBtn, pressed && { opacity: 0.92 }]}
          onPress={() => setNewCampaignVisible(true)}>
          <Text style={styles.launchBtnText}>Launch New Campaign</Text>
        </Pressable>

        <View style={styles.cardsWrap}>
          {CAMPAIGNS.map((c, idx) => (
            <Pressable
              key={c.id}
              style={({ pressed }) => [styles.campaignCard, pressed && styles.campaignCardPressed]}>
              <Text style={styles.campaignCardName}>{c.name}</Text>
              <View style={styles.audiencePill}>
                <Text style={styles.audiencePillText}>{c.audience}</Text>
              </View>
              <Text style={styles.campaignCardDelivery}>Delivered {c.delivery}</Text>
              <View style={styles.metricsRow}>
                <View style={styles.metricBlock}>
                  <Text style={styles.metricLabel}>Open rate</Text>
                  <OpenRateBar value={c.openRate} />
                </View>
                <Text style={styles.clickRateText}>{c.clickRate}% click</Text>
              </View>
              <View style={styles.campaignCardFooter}>
                <View style={styles.statusPillDone}>
                  <Text style={styles.statusTextDone}>{c.status}</Text>
                </View>
                <Pressable
                  style={styles.viewRoiBtn}
                  onPress={(e) => { e.stopPropagation(); setRoiCampaignId(c.id); }}>
                  <MaterialCommunityIcons name="chart-bar" size={16} color="#0BA0B2" />
                  <Text style={styles.viewRoiText}>View ROI</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* New Campaign — full-screen style modal on mobile */}
      <Modal
        visible={newCampaignVisible}
        transparent
        animationType={isNarrow ? 'slide' : 'fade'}
        onRequestClose={closeNewCampaign}>
        <Pressable style={[styles.modalBackdrop, isNarrow && styles.modalBackdropSheet]} onPress={closeNewCampaign}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
            style={[styles.modalWrap, isNarrow && styles.modalWrapSheet]}
            pointerEvents="box-none">
            <Pressable style={[styles.modalCard, isNarrow && styles.modalCardSheet]} onPress={(e) => e.stopPropagation()}>
              {isNarrow && <View style={styles.modalHandle} />}
              <View style={[styles.modalHeader, isNarrow && styles.modalHeaderSheet]}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>Bulk Email & Campaigns</Text>
                  <Text style={styles.modalSubtitle}>
                    Scalable marketing with full provider transparency and A/B analytics.
                  </Text>
                </View>
                <Pressable onPress={closeNewCampaign} style={styles.modalCloseBtn} hitSlop={12}>
                  <MaterialCommunityIcons name="close" size={22} color="#0B2D3E" />
                </Pressable>
              </View>
              <ScrollView
                style={styles.modalBody}
                contentContainerStyle={[styles.modalBodyContent, { paddingBottom: insets.bottom + 28 }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {/* Campaign Configuration */}
                <Text style={styles.sectionTitle}>Campaign Configuration</Text>
                <View style={styles.field}>
                  <Text style={styles.label}>Campaign Name</Text>
                  <TextInput
                    style={styles.input}
                    value={campaignName}
                    onChangeText={setCampaignName}
                    placeholder="e.g. Summer Listing Collection"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Target Segment</Text>
                  <Pressable style={styles.select} onPress={() => setSegmentOpen((v) => !v)}>
                    <Text style={styles.selectText}>{segment}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                  </Pressable>
                  {segmentOpen && (
                    <View style={styles.dropdown}>
                      {SEGMENT_OPTIONS.map((opt) => (
                        <Pressable key={opt} style={styles.dropdownItem} onPress={() => { setSegment(opt); setSegmentOpen(false); }}>
                          <Text style={styles.dropdownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Email Template</Text>
                  <Pressable style={styles.select} onPress={() => setTemplateOpen((v) => !v)}>
                    <Text style={styles.selectText}>{template}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                  </Pressable>
                  {templateOpen && (
                    <View style={styles.dropdown}>
                      {TEMPLATE_OPTIONS.map((opt) => (
                        <Pressable key={opt} style={styles.dropdownItem} onPress={() => { setTemplate(opt); setTemplateOpen(false); }}>
                          <Text style={styles.dropdownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Sending Provider</Text>
                  <Pressable style={styles.select} onPress={() => setProviderOpen((v) => !v)}>
                    <Text style={styles.selectText}>{provider}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                  </Pressable>
                  {providerOpen && (
                    <View style={styles.dropdown}>
                      {PROVIDER_OPTIONS.map((opt) => (
                        <Pressable key={opt} style={styles.dropdownItem} onPress={() => { setProvider(opt); setProviderOpen(false); }}>
                          <Text style={styles.dropdownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {/* A/B Subject Line Testing */}
                <View style={styles.abSection}>
                  <View style={styles.abHeader}>
                    <Text style={styles.abTitle}>A/B Subject Line Testing</Text>
                    <Switch
                      value={abTestingEnabled}
                      onValueChange={setAbTestingEnabled}
                      trackColor={{ false: '#E2E8F0', true: '#EA580C' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  <View style={styles.abField}>
                    <Text style={styles.abLabel}>VERSION A (50%)</Text>
                    <TextInput
                      style={styles.input}
                      value={versionA}
                      onChangeText={setVersionA}
                      placeholder="Subject line A"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.abField}>
                    <Text style={styles.abLabel}>VERSION B (50%)</Text>
                    <TextInput
                      style={styles.input}
                      value={versionB}
                      onChangeText={setVersionB}
                      placeholder="Subject line B"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Compliance & Delivery */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Compliance & Delivery</Text>
                <View style={styles.complianceCard}>
                  <View style={styles.complianceRow}>
                    <View style={styles.complianceText}>
                      <Text style={styles.complianceTitle}>Unsubscribe Enforcement</Text>
                      <Text style={styles.complianceDesc}>Automatically exclude opted-out contacts.</Text>
                    </View>
                    <Text style={styles.complianceActive}>ACTIVE</Text>
                  </View>
                  <View style={[styles.complianceRow, styles.complianceRowBorder]}>
                    <View style={styles.complianceText}>
                      <Text style={styles.complianceTitle}>Bounce Protection</Text>
                      <Text style={styles.complianceDesc}>Remove invalid emails after first fail.</Text>
                    </View>
                    <Text style={styles.complianceActive}>ACTIVE</Text>
                  </View>
                </View>
                <View style={styles.audiencePreview}>
                  <Text style={styles.audiencePreviewLabel}>AUDIENCE PREVIEW</Text>
                  <Text style={styles.audiencePreviewNumber}>482</Text>
                  <Text style={styles.audiencePreviewDesc}>Contacts match your current filters.</Text>
                </View>

                <Pressable style={({ pressed }) => [styles.scheduleBtn, pressed && { opacity: 0.92 }]} onPress={handleScheduleSend}>
                  <Text style={styles.scheduleBtnText}>Schedule & Send Campaign</Text>
                </Pressable>
              </ScrollView>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* ROI Analysis — shown when user taps View ROI, mobile-first vertical layout */}
      <Modal
        visible={!!roiCampaignId}
        transparent
        animationType="slide"
        onRequestClose={() => setRoiCampaignId(null)}>
        <View style={[styles.roiBackdrop, { paddingTop: insets.top }]}>
          <View style={[styles.roiContainer, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.roiHeader}>
              <Pressable style={styles.roiBackBtn} onPress={() => setRoiCampaignId(null)} hitSlop={12}>
                <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
              </Pressable>
              <Text style={styles.roiBackLabel}>Campaigns</Text>
            </View>
            <ScrollView
              style={styles.roiScroll}
              contentContainerStyle={styles.roiScrollContent}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.roiTitle}>{roiCampaign?.name ?? 'Campaign'} Analysis</Text>
              <Text style={styles.roiSubtitle}>
                ROI & Conversion Attribution for Campaign ID: {roiCampaignId ?? '—'}
              </Text>

              {/* KPI cards — stacked vertically on mobile */}
              <View style={styles.roiKpiRow}>
                <View style={styles.roiKpiCard}>
                  <Text style={styles.roiKpiLabel}>DELIVERED</Text>
                  <Text style={styles.roiKpiValue}>12,482</Text>
                  <Text style={styles.roiKpiMetaGreen}>99.8% Success Rate</Text>
                </View>
                <View style={styles.roiKpiCard}>
                  <Text style={styles.roiKpiLabel}>OPEN RATE</Text>
                  <Text style={[styles.roiKpiValue, styles.roiKpiValueBlue]}>42.4%</Text>
                  <Text style={styles.roiKpiMeta}>Industry high (18% avg)</Text>
                </View>
                <View style={styles.roiKpiCard}>
                  <Text style={styles.roiKpiLabel}>CLICK-TO-CONV</Text>
                  <Text style={[styles.roiKpiValue, styles.roiKpiValueOrange]}>8.2%</Text>
                  <Text style={styles.roiKpiMeta}>124 New Deal Leads</Text>
                </View>
              </View>

              {/* A/B Testing Outcome */}
              <View style={styles.roiSection}>
                <Text style={styles.roiSectionTitle}>A/B Testing Outcome</Text>
                <View style={styles.abVariantCard}>
                  <Text style={styles.abVariantLabel}>Variant A: "You won't believe..."</Text>
                  <View style={styles.abVariantBarRow}>
                    <View style={styles.abVariantBarBg}>
                      <View style={[styles.abVariantBarFill, styles.abVariantBarFillA, { width: '38%' }]} />
                    </View>
                    <Text style={styles.abVariantBadgeRed}>-12% performance</Text>
                  </View>
                </View>
                <View style={[styles.abVariantCard, styles.abVariantCardWinner]}>
                  <Text style={styles.abVariantLabel}>Variant B: "New Pricing: Malibu..."</Text>
                  <View style={styles.abVariantBarRow}>
                    <View style={styles.abVariantBarBg}>
                      <View style={[styles.abVariantBarFill, styles.abVariantBarFillB, { width: '85%' }]} />
                    </View>
                    <Text style={styles.abVariantBadgeGreen}>WINNER (+45% Opens)</Text>
                  </View>
                </View>
              </View>

              {/* Engagement Heatmap */}
              <View style={styles.roiSection}>
                <Text style={styles.roiSectionTitle}>Engagement Heatmap</Text>
                <View style={styles.heatmapCard}>
                  <View style={styles.heatmapRow}>
                    <Text style={styles.heatmapLabel}>View Listing Button</Text>
                    <Text style={styles.heatmapClicks}>2,432 clicks</Text>
                  </View>
                  <View style={styles.heatmapBarBg}>
                    <View style={[styles.heatmapBarFill, { width: '100%' }]} />
                  </View>
                  <View style={styles.heatmapRow}>
                    <Text style={styles.heatmapLabel}>Agent Bio Link</Text>
                    <Text style={styles.heatmapClicks}>842 clicks</Text>
                  </View>
                  <View style={styles.heatmapBarBg}>
                    <View style={[styles.heatmapBarFill, { width: '35%' }]} />
                  </View>
                  <View style={styles.heatmapRow}>
                    <Text style={styles.heatmapLabel}>Neighborhood Guide PDF</Text>
                    <Text style={styles.heatmapClicks}>1,254 clicks</Text>
                  </View>
                  <View style={styles.heatmapBarBg}>
                    <View style={[styles.heatmapBarFill, { width: '52%' }]} />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
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
  },
  headerCenter: { flex: 1, minWidth: 0 },
  title: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: '#5B6B7A', fontWeight: '500', marginTop: 6, lineHeight: 20 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
    marginBottom: 20,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  launchBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  cardsWrap: { paddingBottom: 4 },
  campaignCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    marginBottom: 14,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  campaignCardPressed: { opacity: 0.96 },
  campaignCardName: { fontSize: 16, fontWeight: '800', color: '#0B2D3E' },
  audiencePill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  audiencePillText: { fontSize: 12, fontWeight: '700', color: '#5B6B7A' },
  campaignCardDelivery: { fontSize: 13, color: '#5B6B7A', marginTop: 8 },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metricBlock: { flex: 1, marginRight: 12 },
  metricLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 4 },
  openRateWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  openRateBg: { flex: 1, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  openRateFill: { height: '100%', backgroundColor: '#0BA0B2', borderRadius: 3 },
  openRateText: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', minWidth: 28 },
  clickRateText: { fontSize: 13, fontWeight: '700', color: '#EA580C' },
  campaignCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0F4F8',
  },
  statusPillDone: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusTextDone: { fontSize: 11, fontWeight: '800', color: '#16A34A' },
  viewRoiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewRoiText: { fontSize: 14, fontWeight: '700', color: '#0BA0B2' },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdropSheet: { justifyContent: 'flex-end', padding: 0 },
  modalWrap: { width: '100%', maxWidth: 480, maxHeight: '92%' },
  modalWrapSheet: { maxHeight: '94%', width: '100%', maxWidth: '100%' },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  modalCardSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxHeight: '100%',
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(11, 45, 62, 0.15)',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(11, 45, 62, 0.08)',
  },
  modalHeaderSheet: { paddingTop: 12 },
  modalHeaderText: { flex: 1, marginRight: 12, minWidth: 0 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.3 },
  modalSubtitle: { fontSize: 14, color: '#5B6B7A', fontWeight: '500', marginTop: 4, lineHeight: 20 },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: { maxHeight: 600 },
  modalBodyContent: { paddingHorizontal: 22, paddingTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0B2D3E', marginBottom: 14 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#0B2D3E', marginBottom: 8 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0B2D3E',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectText: { fontSize: 16, fontWeight: '600', color: '#0B2D3E', flex: 1 },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  dropdownItem: { paddingVertical: 16, paddingHorizontal: 16 },
  dropdownItemText: { fontSize: 16, fontWeight: '600', color: '#0B2D3E' },
  abSection: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(234, 88, 12, 0.5)',
    backgroundColor: 'rgba(234, 88, 12, 0.06)',
  },
  abHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  abTitle: { fontSize: 14, fontWeight: '800', color: '#EA580C' },
  abLabel: { fontSize: 11, fontWeight: '800', color: '#5B6B7A', marginBottom: 6, letterSpacing: 0.5 },
  abField: { marginTop: 12 },
  complianceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  complianceRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E2E8F0' },
  complianceText: { flex: 1, marginRight: 12 },
  complianceTitle: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  complianceDesc: { fontSize: 13, color: '#5B6B7A', marginTop: 2 },
  complianceActive: { fontSize: 12, fontWeight: '800', color: '#16A34A' },
  audiencePreview: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(11, 160, 178, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(11, 160, 178, 0.2)',
    alignItems: 'center',
  },
  audiencePreviewLabel: { fontSize: 11, fontWeight: '800', color: '#5B6B7A', letterSpacing: 0.8 },
  audiencePreviewNumber: { fontSize: 36, fontWeight: '900', color: '#0BA0B2', marginTop: 8 },
  audiencePreviewDesc: { fontSize: 13, color: '#5B6B7A', marginTop: 4 },
  scheduleBtn: {
    marginTop: 28,
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scheduleBtnText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },

  // ROI Analysis modal — mobile-first
  roiBackdrop: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  roiContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  roiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  roiBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roiBackLabel: { fontSize: 16, fontWeight: '700', color: '#0B2D3E' },
  roiScroll: { flex: 1 },
  roiScrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  roiTitle: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.3 },
  roiSubtitle: { fontSize: 14, color: '#5B6B7A', marginTop: 6, marginBottom: 20 },
  roiKpiRow: { flexDirection: 'column' },
  roiKpiCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roiKpiLabel: { fontSize: 11, fontWeight: '800', color: '#5B6B7A', letterSpacing: 0.6 },
  roiKpiValue: { fontSize: 28, fontWeight: '900', color: '#0B2D3E', marginTop: 6 },
  roiKpiValueBlue: { color: '#2563EB' },
  roiKpiValueOrange: { color: '#EA580C' },
  roiKpiMeta: { fontSize: 13, color: '#5B6B7A', marginTop: 4 },
  roiKpiMetaGreen: { fontSize: 13, color: '#16A34A', fontWeight: '700', marginTop: 4 },
  roiSection: { marginTop: 24 },
  roiSectionTitle: { fontSize: 16, fontWeight: '800', color: '#0B2D3E', marginBottom: 14 },
  abVariantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  abVariantCardWinner: {
    borderWidth: 2,
    borderColor: '#16A34A',
    backgroundColor: 'rgba(22, 163, 74, 0.06)',
  },
  abVariantLabel: { fontSize: 14, fontWeight: '700', color: '#0B2D3E', marginBottom: 10 },
  abVariantBarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  abVariantBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  abVariantBarFill: { height: '100%', borderRadius: 4 },
  abVariantBarFillA: { backgroundColor: '#64748B' },
  abVariantBarFillB: { backgroundColor: '#16A34A' },
  abVariantBadgeRed: { fontSize: 12, fontWeight: '800', color: '#DC2626', minWidth: 100 },
  abVariantBadgeGreen: { fontSize: 12, fontWeight: '800', color: '#16A34A', minWidth: 120 },
  heatmapCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heatmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heatmapLabel: { fontSize: 14, fontWeight: '600', color: '#0B2D3E', flex: 1 },
  heatmapClicks: { fontSize: 13, fontWeight: '700', color: '#5B6B7A' },
  heatmapBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heatmapBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
});
