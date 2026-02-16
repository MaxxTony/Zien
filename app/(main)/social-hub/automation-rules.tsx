import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  Pressable,
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INITIAL_RULES = [
  {
    id: '1',
    title: 'New Listing Promo',
    ifLabel: 'Property Status Change',
    thenLabel: 'Post on All Platforms',
    status: 'ACTIVE' as const,
    icon: 'star-four-points-outline' as const,
  },
  {
    id: '2',
    title: 'Open House Reminder',
    ifLabel: '24h Before Event',
    thenLabel: 'Instagram Story + FB Post',
    status: 'ACTIVE' as const,
    icon: 'clock-outline' as const,
  },
  {
    id: '3',
    title: 'Weekly Market Update',
    ifLabel: 'Every Monday @ 9AM',
    thenLabel: 'LinkedIn Article',
    status: 'PAUSED' as const,
    icon: 'calendar-blank-outline' as const,
  },
  {
    id: '4',
    title: 'Price Drop Alert',
    ifLabel: 'Price Change > 5%',
    thenLabel: 'Facebook & Instagram Post',
    status: 'ACTIVE' as const,
    icon: 'lightning-bolt-outline' as const,
  },
];

const SUGGESTED_FLOWS = [
  { id: 'a', label: 'Replenish Content Queue when Empty', highlighted: true, trigger: 'Queue Empty', action: 'Draft AI Campaign' },
  { id: 'b', label: 'Cross-post TikToks to IG Reels', highlighted: false, trigger: 'New TikTok Post', action: 'Repost to Reels' },
  { id: 'c', label: 'Auto-DM New Followers', highlighted: false, trigger: 'New Follower', action: 'Send Welcome DM' },
];

type Rule = {
  id: string;
  title: string;
  ifLabel: string;
  thenLabel: string;
  status: 'ACTIVE' | 'PAUSED';
  icon: any;
};

export default function AutomationRulesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  // Handlers
  const toggleRuleStatus = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRules(currentRules =>
      currentRules.map(rule =>
        rule.id === id
          ? { ...rule, status: rule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
          : rule
      )
    );
  };

  const deleteRule = (id: string) => {
    Alert.alert(
      "Delete Rule",
      "Are you sure you want to delete this automation rule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setRules(currentRules => currentRules.filter(r => r.id !== id));
          }
        }
      ]
    );
  };

  const handleCreateRule = () => {
    // Basic validation
    if (!newRuleName) return;

    const newRule: Rule = {
      id: Date.now().toString(),
      title: newRuleName,
      ifLabel: selectedTrigger || 'Custom Trigger',
      thenLabel: selectedAction || 'Custom Action',
      status: 'ACTIVE',
      icon: 'robot-outline',
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRules([newRule, ...rules]);
    closeModal();
  };

  const openSuggestionModal = (flow: typeof SUGGESTED_FLOWS[0]) => {
    setNewRuleName(flow.label);
    setSelectedTrigger(flow.trigger);
    setSelectedAction(flow.action);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setNewRuleName('');
    setSelectedTrigger('');
    setSelectedAction('');
  }

  const filteredRules = rules.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Automation Rules</Text>
          <Text style={styles.subtitle}>
            Set up "if this, then that" workflows for your social media.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Create Rule */}
        <Pressable
          style={styles.createRuleBtn}
          onPress={() => {
            setNewRuleName('');
            setSelectedTrigger('Property Status Change');
            setSelectedAction('Post to All Connected Platforms');
            setShowCreateModal(true);
          }}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.createRuleBtnText}>Create Rule</Text>
        </Pressable>

        {/* Search */}
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search rules..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Rule list */}
        <View style={styles.ruleList}>
          {filteredRules.map((rule) => (
            <View
              key={rule.id}
              style={[
                styles.ruleCard,
                rule.status === 'PAUSED' && styles.ruleCardPaused
              ]}
            >
              <View style={[styles.ruleIconWrap, rule.status === 'PAUSED' && styles.ruleIconWrapPaused]}>
                <MaterialCommunityIcons
                  name={rule.icon}
                  size={22}
                  color={rule.status === 'PAUSED' ? '#94A3B8' : '#0BA0B2'}
                />
              </View>
              <View style={styles.ruleBody}>
                <Text style={[styles.ruleTitle, rule.status === 'PAUSED' && styles.ruleTitlePaused]}>
                  {rule.title}
                </Text>
                <View style={styles.workflowRow}>
                  <Text style={styles.workflowIf}>IF: {rule.ifLabel}</Text>
                  <MaterialCommunityIcons name="arrow-right" size={14} color="#9CA3AF" style={styles.workflowArrow} />
                  <Text style={styles.workflowThen}>THEN: {rule.thenLabel}</Text>
                </View>
              </View>

              <View style={styles.ruleRight}>
                <Pressable
                  onPress={() => toggleRuleStatus(rule.id)}
                  style={[styles.statusPill, rule.status === 'PAUSED' && styles.statusPillPaused]}
                >
                  <Text style={[styles.statusText, rule.status === 'PAUSED' && styles.statusTextPaused]}>
                    {rule.status}
                  </Text>
                </Pressable>

                <Pressable style={styles.deleteBtn} hitSlop={8} onPress={() => deleteRule(rule.id)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Automation Impact */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <View>
              <Text style={styles.impactTitle}>Automation Impact</Text>
              <Text style={styles.impactSubtitle}>Last 30 days performance</Text>
            </View>
            <View style={styles.impactIconCircle}>
              <MaterialCommunityIcons name="chart-line-variant" size={20} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.impactMetrics}>
            <View style={styles.impactMetric}>
              <Text style={styles.impactValue}>42</Text>
              <Text style={styles.impactLabel}>Posts Automated</Text>
            </View>
            <View style={styles.impactMetric}>
              <Text style={styles.impactValue}>12h</Text>
              <Text style={styles.impactLabel}>Time Saved</Text>
            </View>
          </View>
        </View>

        {/* Suggested Flows */}
        <Text style={styles.sectionTitle}>Suggested Flows</Text>
        <View style={styles.suggestedCard}>
          {SUGGESTED_FLOWS.map((flow, idx) => (
            <Pressable
              key={flow.id}
              onPress={() => openSuggestionModal(flow)}
              style={({ pressed }) => [
                styles.suggestedRow,
                (flow.highlighted || pressed) && styles.suggestedRowHighlighted,
                idx === SUGGESTED_FLOWS.length - 1 && styles.suggestedRowLast,
              ]}>
              <MaterialCommunityIcons
                name="auto-fix"
                size={20}
                color={flow.highlighted ? '#0BA0B2' : '#5B6B7A'}
              />
              <Text style={[styles.suggestedLabel, flow.highlighted && styles.suggestedLabelHighlighted]} numberOfLines={2}>
                {flow.label}
              </Text>
              <MaterialCommunityIcons name="plus" size={20} color={flow.highlighted ? '#0BA0B2' : '#9CA3AF'} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Create / Suggestion Modal */}
      <RNModal visible={showCreateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Create Automation Rule</Text>
              <Pressable onPress={closeModal}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            {/* Rule Name */}
            <Text style={styles.fieldLabel}>Rule Name</Text>
            <TextInput
              style={styles.input}
              value={newRuleName}
              onChangeText={setNewRuleName}
              placeholder="e.g. Price Drop Insta-Post"
              placeholderTextColor="#94A3B8"
            />

            {/* Trigger */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Trigger (IF)</Text>
            <View style={styles.dropdownStub}>
              <Text style={styles.dropdownText}>{selectedTrigger || 'Select Trigger'}</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
            </View>

            {/* Action */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Action (THEN)</Text>
            <View style={styles.dropdownStub}>
              <Text style={styles.dropdownText}>{selectedAction || 'Select Action'}</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
            </View>


            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelBtn} onPress={closeModal}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSaveBtn} onPress={handleCreateRule}>
                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                <Text style={styles.modalSaveText}>Activate Rule</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </RNModal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  headerCenter: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 4,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  createRuleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  createRuleBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0B2D3E',
  },

  ruleList: { gap: 12, marginBottom: 20 },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
    gap: 12,
    // Active shadow
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4
  },
  ruleCardPaused: {
    backgroundColor: '#F8FAFC',
    opacity: 0.85
  },
  ruleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleIconWrapPaused: {
    backgroundColor: '#E2E8F0'
  },
  ruleBody: { flex: 1, minWidth: 0 },
  ruleTitle: { fontSize: 15, fontWeight: '800', color: '#0B2D3E', marginBottom: 4 },
  ruleTitlePaused: { color: '#64748B' },
  workflowRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  workflowIf: { fontSize: 12, color: '#5B6B7A', fontWeight: '600' },
  workflowArrow: { marginHorizontal: 2 },
  workflowThen: { fontSize: 12, color: '#5B6B7A', fontWeight: '600' },

  ruleRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0BA0B2',
    backgroundColor: '#0BA0B2',
    minWidth: 50,
    alignItems: 'center'
  },
  statusPillPaused: {
    backgroundColor: 'transparent',
    borderColor: '#94A3B8',
  },
  statusText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  statusTextPaused: { color: '#94A3B8' },
  deleteBtn: { padding: 4 },

  impactCard: {
    backgroundColor: '#0B2D3E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  impactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  impactTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  impactSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  impactIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  impactMetrics: { flexDirection: 'row', gap: 40 },
  impactMetric: {},
  impactValue: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  impactLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 10,
  },
  suggestedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    overflow: 'hidden',
  },
  suggestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  suggestedRowHighlighted: {
    borderLeftWidth: 3,
    borderLeftColor: '#0BA0B2',
    backgroundColor: 'rgba(11, 160, 178, 0.04)',
  },
  suggestedRowLast: { borderBottomWidth: 0 },
  suggestedLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#0B2D3E' },
  suggestedLabelHighlighted: { color: '#0B2D3E' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 500, // Matching design somewhat
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E'
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0B2D3E',
  },
  dropdownStub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    color: '#0B2D3E'
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  modalCancelText: {
    color: '#0B2D3E',
    fontWeight: '700',
    fontSize: 15
  },
  modalSaveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15
  }
});
