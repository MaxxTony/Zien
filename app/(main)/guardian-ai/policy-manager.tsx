import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GuardianScreenShell } from './_components/GuardianScreenShell';

const ESCALATION_TAGS = [
  'Stage 1: SMS Prompt (0m)',
  'Stage 2: Auto-Call (2m)',
  'Stage 3: Broker Alert (5m)',
  'Stage 4: Emergency Dispatch (10m)',
];
const TIMER_TAGS = [
  'Universal 5m grace period',
  'Real-time GPS sync required',
  'Low battery auto-alert at 15%',
];
const VERIFICATION_TAGS = [
  'Government ID Upload required',
  'Biometric face-match opt-in',
  'Verified phone link authentication',
];

const POLICY_CARDS = [
  {
    id: 'escalation',
    icon: 'shield-check-outline' as const,
    title: 'Escalation Ladder',
    desc: 'Multi-stage response protocol for unanswered check-ins.',
  },
  {
    id: 'timer',
    icon: 'clock-outline' as const,
    title: 'Timer Policy',
    desc: 'Mandatory active countdown for all off-site client sessions.',
  },
  {
    id: 'verification',
    icon: 'account-sync-outline' as const,
    title: 'Verification Rules',
    desc: 'Minimum identity standards for field asset safety.',
  },
];

const CHECKLIST_ITEMS = [
  { id: '1', label: 'Mandatory Government ID verification', checked: true },
  { id: '2', label: 'Real-time property geo-fence enforcement', checked: true },
  { id: '3', label: 'Trusted contact situational notification', checked: true },
  { id: '4', label: 'Automated 15-minute operational check-in', checked: false },
  { id: '5', label: 'Silent emergency gesture calibration', checked: true },
];

const OVERRIDES = [
  { id: '1', label: 'Broker Intervention Bypass', active: false },
  { id: '2', label: 'Strict Geo-fence Mode', active: true },
  { id: '3', label: 'Anonymous Client Limit', active: true },
  { id: '4', label: 'Emergency Hotlink', active: true },
];

export default function GuardianPolicyManagerScreen() {
  const insets = useSafeAreaInsets();
  const [policyToggles, setPolicyToggles] = useState({
    escalation: true,
    timer: true,
    verification: true,
  });
  const [checklist, setChecklist] = useState(
    CHECKLIST_ITEMS.reduce((acc, i) => ({ ...acc, [i.id]: i.checked }), {} as Record<string, boolean>)
  );
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <GuardianScreenShell
      title="Policy & Governance"
      subtitle="Configure high-fidelity safety rules, escalation ladders, and field verification standards."
      showBack={true}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Preview Architecture */}
        <Pressable style={styles.previewBtn} onPress={() => setShowPreviewModal(true)}>
          <MaterialCommunityIcons name="eye-outline" size={20} color="#0B2D3E" />
          <Text style={styles.previewBtnText}>Preview Architecture</Text>
        </Pressable>

        {/* Policy Configuration Cards */}
        <View style={styles.policyRow}>
          {POLICY_CARDS.map((p) => (
            <View key={p.id} style={styles.policyCard}>
              <View style={styles.policyCardHeader}>
                <View style={styles.policyCardIconWrap}>
                  <MaterialCommunityIcons name={p.icon} size={24} color="#0B2D3E" />
                </View>
                <Switch
                  value={policyToggles[p.id as keyof typeof policyToggles]}
                  onValueChange={(v) =>
                    setPolicyToggles((prev) => ({ ...prev, [p.id]: v }))
                  }
                  trackColor={{ false: '#D7DEE7', true: '#0B2D3E' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <Text style={styles.policyCardTitle}>{p.title}</Text>
              <Text style={styles.policyCardDesc}>{p.desc}</Text>
              <Pressable style={styles.editProtocolBtn}>
                <Text style={styles.editProtocolBtnText}>Edit Protocol Details</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Deployment Safety Checklist & Active Overrides - two column on large, stack on mobile */}
        <View style={styles.twoCol}>
          <View style={styles.checklistCard}>
            <Text style={styles.sectionTitle}>Deployment Safety Checklist</Text>
            {CHECKLIST_ITEMS.map((item, idx) => (
              <Pressable
                key={item.id}
                style={[styles.checklistRow, idx === 0 && { borderTopWidth: 0 }]}
                onPress={() => toggleChecklist(item.id)}>
                <View
                  style={[
                    styles.checkbox,
                    checklist[item.id] && styles.checkboxChecked,
                  ]}>
                  {checklist[item.id] && (
                    <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checklistLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.overridesCard}>
            <Text style={styles.sectionTitle}>Active Overrides</Text>
            {OVERRIDES.map((o, idx) => (
              <View key={o.id} style={[styles.overrideRow, idx === 0 && { borderTopWidth: 0 }]}>
                <Text style={styles.overrideLabel}>{o.label}</Text>
                <View style={[styles.overridePill, o.active && styles.overridePillActive]}>
                  <Text style={[styles.overridePillText, o.active && styles.overridePillTextActive]}>
                    {o.active ? 'Active' : 'Passive'}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.propagateBox}>
              <MaterialCommunityIcons name="cloud-outline" size={22} color="#5B6B7A" />
              <Text style={styles.propagateText}>
                Protocol updates are propagated in real-time.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Full-page Preview Architecture Modal */}
      <Modal
        visible={showPreviewModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowPreviewModal(false)}>
        <View style={[styles.previewModalRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.previewModalHeader}>
            <Pressable style={styles.backToEditorBtn} onPress={() => setShowPreviewModal(false)}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
              <Text style={styles.backToEditorText}>Back to Editor</Text>
            </Pressable>
            <View style={styles.officialBadge}>
              <MaterialCommunityIcons name="minus" size={14} color="#5B6B7A" />
              <Text style={styles.officialBadgeText}>OFFICIAL POLICY PREVIEW</Text>
            </View>
          </View>
          <LinearGradient
            colors={['#0BA0B2', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.previewGradientLine}
          />
          <ScrollView
            style={styles.previewScroll}
            contentContainerStyle={styles.previewScrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.previewCard}>
              <View style={styles.previewCardHeader}>
                <MaterialCommunityIcons name="file-document-outline" size={40} color="#0B2D3E" />
                <Text style={styles.previewCardTitle}>Zien Guardian Protocols</Text>
                <Text style={styles.previewCardSubtitle}>v2.4.1 • Effective for all active field agents.</Text>
              </View>

              <View style={styles.previewSection}>
                <View style={styles.previewSectionHeader}>
                  <MaterialCommunityIcons name="shield-check-outline" size={22} color="#0B2D3E" />
                  <Text style={styles.previewSectionTitle}>Escalation Ladder</Text>
                </View>
                <Text style={styles.previewSectionDesc}>Multi-stage response protocol for unanswered check-ins.</Text>
                <View style={styles.previewTagRow}>
                  {ESCALATION_TAGS.map((t) => (
                    <View key={t} style={styles.previewTag}>
                      <MaterialCommunityIcons name="check" size={14} color="#16A34A" />
                      <Text style={styles.previewTagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.previewSection}>
                <View style={styles.previewSectionHeader}>
                  <MaterialCommunityIcons name="clock-outline" size={22} color="#0B2D3E" />
                  <Text style={styles.previewSectionTitle}>Timer Policy</Text>
                </View>
                <Text style={styles.previewSectionDesc}>Mandatory active countdown for all off-site client sessions.</Text>
                <View style={styles.previewTagRow}>
                  {TIMER_TAGS.map((t) => (
                    <View key={t} style={styles.previewTag}>
                      <MaterialCommunityIcons name="check" size={14} color="#16A34A" />
                      <Text style={styles.previewTagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.previewSection}>
                <View style={styles.previewSectionHeader}>
                  <MaterialCommunityIcons name="account-outline" size={22} color="#0B2D3E" />
                  <Text style={styles.previewSectionTitle}>Verification Rules</Text>
                </View>
                <Text style={styles.previewSectionDesc}>Minimum identity standards for field asset safety.</Text>
                <View style={styles.previewTagRow}>
                  {VERIFICATION_TAGS.map((t) => (
                    <View key={t} style={styles.previewTag}>
                      <MaterialCommunityIcons name="check" size={14} color="#16A34A" />
                      <Text style={styles.previewTagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.previewFooterRow}>
                <View style={styles.previewFooterCard}>
                  <MaterialCommunityIcons name="lock-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.previewFooterCardTitle}>IDENTITY PRIVACY</Text>
                  <Text style={styles.previewFooterCardText}>
                    All verification data is encrypted via Zien Vault architecture and purged 48 hours after session resolution.
                  </Text>
                </View>
                <View style={styles.previewFooterCard}>
                  <MaterialCommunityIcons name="cellphone" size={22} color="#FFFFFF" />
                  <Text style={styles.previewFooterCardTitle}>DEVICE COMPLIANCE</Text>
                  <Text style={styles.previewFooterCardText}>
                    Guardian requires Android 12+ or iOS 15+ for optimal GPS triangulation pulse stability.
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </Modal>
    </GuardianScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24 },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  previewBtnText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  policyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  policyCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 10,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  policyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  policyCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyCardTitle: { fontSize: 15, fontWeight: '900', color: '#0B2D3E' },
  policyCardDesc: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', lineHeight: 17 },
  editProtocolBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#F7FBFF',
    alignItems: 'center',
    marginTop: 4,
  },
  editProtocolBtnText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },
  twoCol: { gap: 16 },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    marginBottom: 0,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0B2D3E', marginBottom: 14 },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D7DEE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  checklistLabel: { flex: 1, fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  overridesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  overrideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  overrideLabel: { flex: 1, fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  overridePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF3F8',
  },
  overridePillActive: { backgroundColor: 'rgba(22, 163, 74, 0.14)' },
  overridePillText: { fontSize: 11, fontWeight: '800', color: '#7B8794' },
  overridePillTextActive: { color: '#16A34A' },
  propagateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  propagateText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#5B6B7A', lineHeight: 18 },
  bottomSpacer: { height: 8 },
  // Preview Architecture full-page modal
  previewModalRoot: { flex: 1, backgroundColor: '#E8EEF4' },
  previewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E3ECF4',
  },
  backToEditorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backToEditorText: { fontSize: 15, fontWeight: '800', color: '#0B2D3E' },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EEF3F8',
  },
  officialBadgeText: { fontSize: 10, fontWeight: '900', color: '#5B6B7A', letterSpacing: 0.4 },
  previewGradientLine: { height: 4, width: '100%' },
  previewScroll: { flex: 1 },
  previewScrollContent: { padding: 18, paddingBottom: 32 },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 20,
  },
  previewCardHeader: { alignItems: 'center', marginBottom: 4 },
  previewCardTitle: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', textAlign: 'center', marginTop: 10 },
  previewCardSubtitle: { fontSize: 13, fontWeight: '700', color: '#5B6B7A', textAlign: 'center', marginTop: 4 },
  previewSection: { gap: 10 },
  previewSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewSectionTitle: { fontSize: 16, fontWeight: '900', color: '#0B2D3E' },
  previewSectionDesc: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', lineHeight: 18 },
  previewTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  previewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  previewTagText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },
  previewFooterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  previewFooterCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#0B2D3E',
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewFooterCardTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
  previewFooterCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
  },
});
