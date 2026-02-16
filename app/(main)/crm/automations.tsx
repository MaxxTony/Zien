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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EMAIL_COMPONENTS = [
  'Property Header',
  'YouTube Video',
  'Text Block',
  'CTA Button',
  'Image Gallery',
  'Agent Signature',
];

const PERSONALIZATION_TOKENS = ['{{name}}', '{{property}}', '{{price}}'];

const SEQUENCES = [
  {
    id: '1',
    title: 'Open House Follow-Up',
    type: 'Drip Sequence',
    trigger: 'Check-in + 2m',
    status: 'ACTIVE' as const,
  },
  {
    id: '2',
    title: 'Virtual Staging Lead Welcome',
    type: 'Instant Response',
    trigger: 'Listing Click (Social)',
    status: 'ACTIVE' as const,
  },
  {
    id: '3',
    title: 'Cold Lead Re-engagement',
    type: 'Ghost Protocol',
    trigger: '90 Days Inactivity',
    status: 'ACTIVE' as const,
  },
  {
    id: '4',
    title: 'Home Anniversary',
    type: 'Lifecycle',
    trigger: '1 Year Post-Close',
    status: 'PAUSED' as const,
  },
];

export default function CRMAutomationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [workflowEditorVisible, setWorkflowEditorVisible] = useState(false);

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
          <Text style={styles.title}>Follow-Up Automation</Text>
          <Text style={styles.subtitle}>
            Set once, and let ZIEN nurture your leads based on time and behavior.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={({ pressed }) => [styles.createBtn, pressed && { opacity: 0.92 }]}
          onPress={() => setWorkflowEditorVisible(true)}>
          <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Create Sequence</Text>
        </Pressable>

        <View style={styles.cardsWrap}>
          {SEQUENCES.map((seq) => (
            <View key={seq.id} style={styles.sequenceCard}>
              <View style={styles.sequenceCardHeader}>
                <View style={styles.sequenceIconWrap}>
                  <MaterialCommunityIcons name="lightning-bolt-outline" size={22} color="#0BA0B2" />
                </View>
                <View style={[styles.statusPill, seq.status === 'PAUSED' && styles.statusPillPaused]}>
                  <Text style={[styles.statusText, seq.status === 'PAUSED' && styles.statusTextPaused]}>
                    {seq.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.sequenceTitle}>{seq.title}</Text>
              <Text style={styles.sequenceType}>Type: {seq.type}</Text>
              <View style={styles.triggerBox}>
                <Text style={styles.triggerLabel}>TRIGGER</Text>
                <Text style={styles.triggerValue}>{seq.trigger}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.editWorkflowBtn, pressed && styles.editWorkflowBtnPressed]}
                onPress={() => setWorkflowEditorVisible(true)}>
                <Text style={styles.editWorkflowBtnText}>Edit Workflow & Templates</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Workflow Editor — opens on Create Sequence or Edit Workflow, mobile-first */}
      <Modal
        visible={workflowEditorVisible}
        animationType="slide"
        onRequestClose={() => setWorkflowEditorVisible(false)}>
        <View style={[styles.workflowRoot, { paddingTop: insets.top }]}>
          <View style={styles.workflowHeader}>
            <View style={styles.workflowHeaderSpacer} />
            <Pressable
              style={({ pressed }) => [styles.workflowCloseBtn, pressed && { opacity: 0.8 }]}
              onPress={() => setWorkflowEditorVisible(false)}
              hitSlop={12}>
              <MaterialCommunityIcons name="close" size={24} color="#0B2D3E" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.workflowScroll}
            contentContainerStyle={[styles.workflowScrollContent, { paddingBottom: 24 + insets.bottom }]}
            showsVerticalScrollIndicator={false}>
            {/* Email Components — stacked for mobile */}
            <View style={styles.workflowSection}>
              <Text style={styles.workflowSectionTitle}>Email Components</Text>
              <View style={styles.componentsList}>
                {EMAIL_COMPONENTS.map((label) => (
                  <Pressable key={label} style={({ pressed }) => [styles.componentRow, pressed && styles.componentRowPressed]}>
                    <MaterialCommunityIcons name="drag-vertical" size={20} color="#94A3B8" />
                    <Text style={styles.componentRowText}>{label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Personalization Tokens */}
            <View style={styles.workflowSection}>
              <Text style={styles.workflowSectionTitle}>Personalization Tokens</Text>
              <View style={styles.tokensRow}>
                {PERSONALIZATION_TOKENS.map((token) => (
                  <Pressable key={token} style={({ pressed }) => [styles.tokenPill, pressed && { opacity: 0.9 }]}>
                    <Text style={styles.tokenPillText}>{token}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Email Preview */}
            <View style={styles.workflowSection}>
              <Text style={styles.workflowSectionTitle}>Email Preview</Text>
              <View style={styles.emailPreviewCard}>
                <View style={styles.emailPreviewBorder} />
                <View style={styles.emailPreviewBody}>
                  <Text style={styles.emailPreviewBrand}>ZIEN REALTY</Text>
                  <Text style={styles.emailPreviewGreeting}>Hi {'{{name}}'}, Welcome to {'{{property}}'}!</Text>
                  <Text style={styles.emailPreviewIntro}>
                    Thanks for checking out our newest listing. Below you'll find the full property kit and a personal walkthrough video I've prepared for you.
                  </Text>
                  <View style={styles.emailPreviewPlaceholder}>
                    <Text style={styles.emailPreviewPlaceholderText}>[YouTube Video Component]</Text>
                  </View>
                  <Pressable style={styles.emailPreviewCta}>
                    <Text style={styles.emailPreviewCtaText}>Download Property Dossier</Text>
                  </Pressable>
                  <View style={styles.emailPreviewSignature}>
                    <Text style={styles.emailPreviewSigName}>Jordan Smith</Text>
                    <Text style={styles.emailPreviewSigTitle}>Luxury Specialist • Zien Realty</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
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
  scrollContent: { paddingHorizontal: 16 },
  createBtn: {
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
  createBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  cardsWrap: { paddingBottom: 4 },
  sequenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sequenceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sequenceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(11, 160, 178, 0.15)',
  },
  statusPillPaused: {
    backgroundColor: '#F1F5F9',
  },
  statusText: { fontSize: 11, fontWeight: '800', color: '#0BA0B2' },
  statusTextPaused: { color: '#64748B' },
  sequenceTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  sequenceType: {
    fontSize: 14,
    color: '#0B2D3E',
    fontWeight: '500',
    marginBottom: 14,
  },
  triggerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  triggerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  triggerValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  editWorkflowBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  editWorkflowBtnPressed: { opacity: 0.9 },
  editWorkflowBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },

  // Workflow Editor modal — mobile-first
  workflowRoot: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  workflowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  workflowHeaderSpacer: { flex: 1 },
  workflowCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workflowScroll: { flex: 1 },
  workflowScrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  workflowSection: { marginBottom: 24 },
  workflowSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 12,
  },
  componentsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  componentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F4F8',
  },
  componentRowPressed: { backgroundColor: '#F8FAFC' },
  componentRowText: { fontSize: 15, fontWeight: '600', color: '#0B2D3E', flex: 1 },
  tokensRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tokenPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 160, 178, 0.15)',
  },
  tokenPillText: { fontSize: 14, fontWeight: '700', color: '#0BA0B2' },
  emailPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  emailPreviewBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#0BA0B2',
  },
  emailPreviewBody: {
    padding: 20,
    paddingTop: 24,
  },
  emailPreviewBrand: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  emailPreviewGreeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 28,
  },
  emailPreviewIntro: {
    fontSize: 15,
    color: '#5B6B7A',
    lineHeight: 22,
    marginBottom: 16,
  },
  emailPreviewPlaceholder: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  emailPreviewPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0BA0B2',
    textAlign: 'center',
  },
  emailPreviewCta: {
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  emailPreviewCtaText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  emailPreviewSignature: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E2E8F0', paddingTop: 16 },
  emailPreviewSigName: { fontSize: 16, fontWeight: '800', color: '#0B2D3E' },
  emailPreviewSigTitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
});
