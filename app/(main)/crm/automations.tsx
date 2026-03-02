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
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AutomationRule {
  id: string;
  name: string;
  category: string;
  source: string;
  timing: string;
  status: 'ACTIVE' | 'PAUSED';
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface IntelligentFlow {
  id: string;
  title: string;
  subtitle: string;
}

const RULES_DATA: AutomationRule[] = [
  {
    id: '1',
    name: 'New Lead Welcome',
    category: 'WELCOME',
    source: 'ALL LEAD SOURCES',
    timing: 'Immediate',
    status: 'ACTIVE',
    icon: 'account-plus-outline',
  },
  {
    id: '2',
    name: 'High-Value Heat Alert',
    category: 'URGENT',
    source: 'HIGH INTENT LEADS',
    timing: 'Real-time',
    status: 'ACTIVE',
    icon: 'lightning-bolt-outline',
  },
  {
    id: '3',
    name: 'Stale Contact Nudge',
    category: 'RETENTION',
    source: 'COLD LEADS',
    timing: 'After 14d',
    status: 'PAUSED',
    icon: 'clock-outline',
  },
  {
    id: '4',
    name: 'Open House Follow-up',
    category: 'ENGAGEMENT',
    source: 'OPEN HOUSE VISITORS',
    timing: 'Within 5m',
    status: 'ACTIVE',
    icon: 'overscan',
  },
];

const FLOWS_DATA: IntelligentFlow[] = [
  { id: '1', title: 'Instant SMS Follow-up on New Lead', subtitle: 'Boosts engagement by 40%' },
  { id: '2', title: 'Re-engage Leads after 30 days', subtitle: 'Prevents database decay' },
  { id: '3', title: 'Auto-assign Premium Leads to Senior Agents', subtitle: 'Optimizes conversion for $2M+' },
  { id: '4', title: 'Predictive Churn Prevention', subtitle: 'AI detects low-activity high-value leads' },
  { id: '5', title: 'Neighborhood Alert Workflow', subtitle: 'Syncs lead zip code with new inventory' },
];

export default function CRM_AutomationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [rules, setRules] = useState<AutomationRule[]>(RULES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [ruleIdentity, setRuleIdentity] = useState('');
  const [targetSegment, setTargetSegment] = useState('All Leads');
  const [segmentPickerVisible, setSegmentPickerVisible] = useState(false);

  const [flowModalVisible, setFlowModalVisible] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<IntelligentFlow | null>(null);

  const [createRuleVisible, setCreateRuleVisible] = useState(false);
  const [triggerLogic, setTriggerLogic] = useState('New Lead Captured');
  const [executionWhen, setExecutionWhen] = useState('Immediate');
  const [automatedAction, setAutomatedAction] = useState('Send Welcome Email');
  const [activePicker, setActivePicker] = useState<'trigger' | 'execution' | 'action' | 'segment' | null>(null);

  const SEGMENTS = [
    'All Leads',
    'High Intent Only',
    'Social Media Leads',
    'Website Direct',
    'Luxury Segment (>$2M)',
    'Cold Database'
  ];

  const TRIGGER_OPTIONS = [
    'New Lead Captured',
    'Heat Index Threshold Met',
    'Inactivity Threshold Met',
    'Property Status Change',
    'Open House QR Scan',
    'Deal Stage Updated'
  ];

  const EXECUTION_OPTIONS = [
    'Immediate',
    'Wait 5 Minutes',
    'Wait 1 Hour',
    'Wait 24 Hours',
    'Wait 7 Days'
  ];

  const ACTION_OPTIONS = [
    'Send Welcome Email',
    'Send Follow-up SMS',
    'Assign Agent Task',
    'Apply Contact Tag',
    'Update Lead Score',
    'Assign to Luxury Team'
  ];

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRuleStatus = (id: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === id ? { ...rule, status: rule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : rule
    ));
  };

  const handleFlowPress = (flow: IntelligentFlow) => {
    setSelectedFlow(flow);
    setFlowModalVisible(true);
  };

  const deployAutomation = () => {
    if (selectedFlow) {
      const newRule: AutomationRule = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedFlow.title.split(' ').slice(0, 3).join(' '),
        category: 'AI-GENERATED',
        source: 'PREMIUM SEGMENT',
        timing: 'Immediate',
        status: 'ACTIVE',
        icon: 'flare',
      };
      setRules([newRule, ...rules]);
      setFlowModalVisible(false);
    }
  };

  const handleDeletePress = (id: string) => {
    setRuleToDelete(id);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      setRules(prev => prev.filter(r => r.id !== ruleToDelete));
      setConfirmDeleteVisible(false);
      setRuleToDelete(null);
    }
  };

  const renderRuleItem = (rule: AutomationRule) => (
    <View key={rule.id} style={styles.ruleRow}>
      <View style={styles.ruleIconBox}>
        <MaterialCommunityIcons name={rule.icon} size={24} color="#0B2D3E" />
      </View>

      <View style={styles.ruleContent}>
        <View style={styles.ruleMainRow}>
          <Text style={styles.ruleName} numberOfLines={2}>{rule.name}</Text>
          <Pressable onPress={() => handleDeletePress(rule.id)} hitSlop={12} style={styles.trashBtnSmall}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
          </Pressable>
        </View>

        <View style={styles.ruleSubRow}>
          <View style={styles.ruleTimingInline}>
            <MaterialCommunityIcons name="clock-outline" size={12} color="#94A3B8" />
            <Text style={styles.timingTextInline}>{rule.timing}</Text>
          </View>
          <Pressable
            style={[styles.statusBtnCompact, rule.status === 'PAUSED' && styles.statusBtnPausedCompact]}
            onPress={() => toggleRuleStatus(rule.id)}
          >
            <Text style={[styles.statusBtnTextCompact, rule.status === 'PAUSED' && styles.statusBtnTextPausedCompact]}>
              {rule.status}
            </Text>
          </Pressable>
        </View>

        <View style={styles.tagRowPremium}>
          <View style={styles.categoryTagSoft}>
            <Text style={styles.categoryTagTextSoft}>{rule.category}</Text>
          </View>
          <View style={styles.sourceTagSoft}>
            <Text style={styles.sourceTagTextSoft}>{rule.source}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <PageHeader
        title="Automations Rules"
        subtitle="Transform your contact database into an autonomous conversion engine."
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Action Buttons */}
        <View style={styles.actionHeader}>
          <Pressable
            style={styles.aiRuleBtn}
            onPress={() => setAiAssistantVisible(true)}
          >
            <LinearGradient
              colors={['#E0F7F9', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.aiRuleGradient}
            >
              <Text style={styles.aiRuleText}>AI rule</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.createRuleBtn}
            onPress={() => setCreateRuleVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.createRuleText}>Create Rule</Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search CRM rules..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Rules List */}
        <View style={styles.rulesList}>
          {filteredRules.map(renderRuleItem)}
        </View>

        {/* Autonomous Impact Card */}
        <View style={styles.impactCard}>
          <Text style={[styles.impactTitle, { color: '#FFFFFF' }]}>Autonomous Impact</Text>
          <Text style={styles.impactScore}>Efficiency score: 94%</Text>

          <View style={styles.impactStatsRow}>
            <View style={styles.impactStatBox}>
              <Text style={styles.impactStatValue}>1.2k</Text>
              <Text style={styles.impactStatLabel}>FOLLOW-UPS SENT</Text>
            </View>
            <View style={styles.impactStatBox}>
              <Text style={styles.impactStatValue}>420</Text>
              <Text style={styles.impactStatLabel}>LEADS SCORED</Text>
            </View>
          </View>

          <View style={styles.aiInsightBox}>
            <Text style={styles.aiInsightText}>
              <Text style={{ fontWeight: '900' }}>AI Insight:</Text> Your "New Lead Welcome" rule is saving 3.4 hrs/week.
            </Text>
          </View>
        </View>

        {/* Intelligent CRM Flows */}
        <View style={styles.flowsSection}>
          <Text style={styles.sectionTitle}>Intelligent CRM Flows</Text>
          {FLOWS_DATA.map(flow => (
            <Pressable
              key={flow.id}
              style={styles.flowRow}
              onPress={() => handleFlowPress(flow)}
            >
              <View style={styles.flowIconBox}>
                <MaterialCommunityIcons name="dots-hexagon" size={20} color="#0BA0B2" />
              </View>
              <View style={styles.flowInfo}>
                <Text style={styles.flowTitle}>{flow.title}</Text>
                <Text style={styles.flowSubtitle}>{flow.subtitle}</Text>
              </View>
              <MaterialCommunityIcons name="plus" size={20} color="#CBD5E1" />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Zien Assistant Modal - Full Page */}
      <Modal
        visible={aiAssistantVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setAiAssistantVisible(false)}
      >
        <LinearGradient
          colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.fullModalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
          <View style={styles.assistantModalContent}>
            {/* Top Form Section - Flexible */}
            <View style={{ flex: 1 }}>
              <View style={styles.assistantHeader}>
                <View>
                  <Text style={styles.assistantTitle}>Zien Assistant</Text>
                  <Text style={styles.assistantSubtitle}>Define your business objective via neural core.</Text>
                </View>
                <Pressable
                  style={styles.closeBtnSmall}
                  onPress={() => setAiAssistantVisible(false)}
                >
                  <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
                </Pressable>
              </View>

              <View style={styles.assistantField}>
                <Text style={styles.fieldLabel}>RULE IDENTITY</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="e.g. VIP Concierge Follow-up"
                    placeholderTextColor="#94A3B8"
                    value={ruleIdentity}
                    onChangeText={setRuleIdentity}
                  />
                </View>
              </View>

              <View style={styles.assistantField}>
                <Text style={styles.fieldLabel}>TARGET SEGMENT</Text>
                <Pressable
                  style={styles.segmentPickerTrigger}
                  onPress={() => setSegmentPickerVisible(!segmentPickerVisible)}
                >
                  <Text style={styles.segmentValue}>{targetSegment}</Text>
                  <MaterialCommunityIcons
                    name={segmentPickerVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#0B2D3E"
                  />
                </Pressable>

                {segmentPickerVisible && (
                  <View style={styles.segmentDropdown}>
                    <ScrollView style={{ maxHeight: 200 }} bounces={false}>
                      {SEGMENTS.map(segment => (
                        <Pressable
                          key={segment}
                          style={styles.segmentOption}
                          onPress={() => {
                            setTargetSegment(segment);
                            setSegmentPickerVisible(false);
                          }}
                        >
                          <View style={styles.optionContent}>
                            <Text style={[
                              styles.optionText,
                              targetSegment === segment && styles.optionTextSelected
                            ]}>
                              {segment}
                            </Text>
                            {targetSegment === segment && (
                              <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                            )}
                          </View>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Bottom Footer - Fixed */}
            <View style={styles.modalFooter}>
              <Pressable
                style={styles.generateBtn}
                onPress={() => setAiAssistantVisible(false)}
              >
                <LinearGradient
                  colors={['#475569', '#1E293B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.generateBtnGradient}
                >
                  <Text style={styles.generateBtnText}>Generate</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Modal>

      {/* Create Rules Modal - Full Page */}
      <Modal
        visible={createRuleVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setCreateRuleVisible(false)}
      >
        <LinearGradient
          colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.fullModalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
          <View style={styles.assistantModalContent}>
            {/* Top Section - Form */}
            <View style={{ flex: 1 }}>
              <View style={styles.assistantHeader}>
                <View>
                  <Text style={styles.assistantTitle}>Create Rules</Text>
                </View>
                <Pressable
                  style={styles.closeBtnSmall}
                  onPress={() => setCreateRuleVisible(false)}
                >
                  <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={true}
                bounces={true}
                contentContainerStyle={{ paddingBottom: 200 }}
              >
                {/* Rule Identity */}
                <View style={[styles.assistantField, { zIndex: 60 }]}>
                  <Text style={styles.fieldLabel}>RULE IDENTITY</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="e.g. VIP Concierge Follow-up"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                {/* Trigger Logic */}
                <View style={[styles.assistantField, { zIndex: 50 }]}>
                  <Text style={styles.fieldLabel}>TRIGGER LOGIC (IF)</Text>
                  <Pressable
                    style={styles.segmentPickerTrigger}
                    onPress={() => setActivePicker(activePicker === 'trigger' ? null : 'trigger')}
                  >
                    <Text style={styles.segmentValue} numberOfLines={1}>{triggerLogic}</Text>
                    <MaterialCommunityIcons
                      name={activePicker === 'trigger' ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#0B2D3E"
                    />
                  </Pressable>
                  {activePicker === 'trigger' && (
                    <View style={[styles.segmentDropdown, { top: 75 }]}>
                      <ScrollView style={{ maxHeight: 200 }} bounces={false}>
                        {TRIGGER_OPTIONS.map(opt => (
                          <Pressable
                            key={opt}
                            style={styles.segmentOption}
                            onPress={() => { setTriggerLogic(opt); setActivePicker(null); }}
                          >
                            <View style={styles.optionContent}>
                              <Text style={[styles.optionText, triggerLogic === opt && styles.optionTextSelected]}>{opt}</Text>
                              {triggerLogic === opt && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                            </View>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Execution Timing */}
                <View style={[styles.assistantField, { zIndex: 40 }]}>
                  <Text style={styles.fieldLabel}>EXECUTION (WHEN)</Text>
                  <Pressable
                    style={styles.segmentPickerTrigger}
                    onPress={() => setActivePicker(activePicker === 'execution' ? null : 'execution')}
                  >
                    <Text style={styles.segmentValue} numberOfLines={1}>{executionWhen}</Text>
                    <MaterialCommunityIcons
                      name={activePicker === 'execution' ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#0B2D3E"
                    />
                  </Pressable>
                  {activePicker === 'execution' && (
                    <View style={[styles.segmentDropdown, { top: 75 }]}>
                      <ScrollView style={{ maxHeight: 200 }} bounces={false}>
                        {EXECUTION_OPTIONS.map(opt => (
                          <Pressable
                            key={opt}
                            style={styles.segmentOption}
                            onPress={() => { setExecutionWhen(opt); setActivePicker(null); }}
                          >
                            <View style={styles.optionContent}>
                              <Text style={[styles.optionText, executionWhen === opt && styles.optionTextSelected]}>{opt}</Text>
                              {executionWhen === opt && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                            </View>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Automated Action */}
                <View style={[styles.assistantField, { zIndex: 30 }]}>
                  <Text style={styles.fieldLabel}>AUTOMATED ACTION (THEN)</Text>
                  <Pressable
                    style={styles.segmentPickerTrigger}
                    onPress={() => setActivePicker(activePicker === 'action' ? null : 'action')}
                  >
                    <Text style={styles.segmentValue}>{automatedAction}</Text>
                    <MaterialCommunityIcons
                      name={activePicker === 'action' ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#0B2D3E"
                    />
                  </Pressable>
                  {activePicker === 'action' && (
                    <View style={[styles.segmentDropdown, { top: 90 }]}>
                      <ScrollView style={{ maxHeight: 200 }} bounces={false}>
                        {ACTION_OPTIONS.map(opt => (
                          <Pressable
                            key={opt}
                            style={styles.segmentOption}
                            onPress={() => { setAutomatedAction(opt); setActivePicker(null); }}
                          >
                            <View style={styles.optionContent}>
                              <Text style={[styles.optionText, automatedAction === opt && styles.optionTextSelected]}>{opt}</Text>
                              {automatedAction === opt && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                            </View>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Target Segment */}
                <View style={[styles.assistantField, { zIndex: 20 }]}>
                  <Text style={styles.fieldLabel}>TARGET SEGMENT</Text>
                  <Pressable
                    style={styles.segmentPickerTrigger}
                    onPress={() => setActivePicker(activePicker === 'segment' ? null : 'segment')}
                  >
                    <Text style={styles.segmentValue}>{targetSegment}</Text>
                    <MaterialCommunityIcons
                      name={activePicker === 'segment' ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#0B2D3E"
                    />
                  </Pressable>
                  {activePicker === 'segment' && (
                    <View style={[styles.segmentDropdown, { top: 90 }]}>
                      <ScrollView style={{ maxHeight: 200 }} bounces={false}>
                        {SEGMENTS.map(opt => (
                          <Pressable
                            key={opt}
                            style={styles.segmentOption}
                            onPress={() => { setTargetSegment(opt); setActivePicker(null); }}
                          >
                            <View style={styles.optionContent}>
                              <Text style={[styles.optionText, targetSegment === opt && styles.optionTextSelected]}>{opt}</Text>
                              {targetSegment === opt && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                            </View>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Modal Footer Actions */}
            <View style={styles.createModalFooter}>
              <Pressable
                style={styles.discardBtn}
                onPress={() => setCreateRuleVisible(false)}
              >
                <Text style={styles.discardBtnText}>Discard Draft</Text>
              </Pressable>
              <Pressable
                style={styles.saveRuleBtn}
                onPress={() => setCreateRuleVisible(false)}
              >
                <Text style={styles.saveRuleBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Modal>

      {/* Flow Proposal Modal - Bottom Sheet */}
      <Modal
        visible={flowModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFlowModalVisible(false)}
      >
        <Pressable
          style={styles.bottomOverlay}
          onPress={() => setFlowModalVisible(false)}
        >
          <Pressable
            style={[styles.flowProposalModal, { paddingBottom: insets.bottom + 24 }]}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.proposalHeader}>
              <View>
                <Text style={styles.assistantTitle}>Zien Assistant</Text>
                <Text style={styles.assistantSubtitle}>Define your business objective via neural core.</Text>
              </View>
              <Pressable
                style={styles.closeBtnSmall}
                onPress={() => setFlowModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
              </Pressable>
            </View>

            <View style={styles.intelligenceBox}>
              <View style={styles.proposedBadge}>
                <MaterialCommunityIcons name="check" size={14} color="#0BA0B2" />
                <Text style={styles.proposedBadgeText}>INTELLIGENCE PROPOSED</Text>
              </View>

              <View style={styles.proposalDetailRow}>
                <Text style={styles.proposalLabel}>TRIGGER:</Text>
                <Text style={styles.proposalValue}>New Lead Captured</Text>
              </View>

              <View style={styles.proposalDetailRow}>
                <Text style={styles.proposalLabel}>ACTION:</Text>
                <Text style={styles.proposalValue}>Send Follow-up SMS</Text>
              </View>

              <View style={styles.proposalDetailRow}>
                <Text style={styles.proposalLabel}>SEGMENT:</Text>
                <Text style={styles.proposalValue}>Social Media Leads</Text>
              </View>

              <View style={styles.logicDivider} />
              <Text style={styles.logicLabel}>Logic: <Text style={{ fontStyle: 'italic', color: '#94A3B8' }}>""</Text></Text>
            </View>

            <View style={styles.proposalFooter}>
              <Pressable
                style={styles.refineBtn}
                onPress={() => setFlowModalVisible(false)}
              >
                <Text style={styles.refineBtnText}>Refine Prompt</Text>
              </Pressable>

              <Pressable
                style={styles.deployBtn}
                onPress={deployAutomation}
              >
                <Text style={styles.deployBtnText}>Deploy Automation</Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={confirmDeleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.trashCircle}>
              <MaterialCommunityIcons name="trash-can-outline" size={32} color="#EF4444" />
            </View>
            <Text style={styles.confirmTitle}>Delete Rule?</Text>
            <Text style={styles.confirmSubtitle}>
              This will permanently remove this automation rule. This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setConfirmDeleteVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  impactCard: {
    backgroundColor: '#0B2D3E',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  impactTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  impactScore: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 24,
  },
  impactStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  impactStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  impactStatValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  impactStatLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  aiInsightBox: {
    backgroundColor: 'rgba(11, 160, 178, 0.15)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(11, 160, 178, 0.3)',
  },
  aiInsightText: {
    fontSize: 12,
    color: '#0BA0B2',
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '600',
  },
  rulesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  ruleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  ruleContent: {
    flex: 1,
    marginLeft: 16,
  },
  ruleMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  trashBtnSmall: {
    marginTop: 2,
  },
  ruleTimingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timingTextInline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  statusBtnCompact: {
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 55,
    alignItems: 'center',
  },
  statusBtnPausedCompact: {
    backgroundColor: '#F1F5F9',
  },
  statusBtnTextCompact: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusBtnTextPausedCompact: {
    color: '#64748B',
  },
  tagRowPremium: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  categoryTagSoft: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryTagTextSoft: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  sourceTagSoft: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sourceTagTextSoft: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.2,
  },
  flowsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 20,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  flowIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowInfo: {
    flex: 1,
    marginLeft: 12,
  },
  flowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  flowSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  confirmModal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  trashCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  deleteBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 20,
  },
  aiRuleBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0BA0B2',
    overflow: 'hidden',
  },
  aiRuleGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiRuleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0BA0B2',
  },
  createRuleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  createRuleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  fullModalContainer: {
    flex: 1,
  },
  assistantModalContent: {
    flex: 1,
    padding: 24,
  },
  modalFooter: {
    paddingTop: 12,
  },
  assistantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  assistantTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.6,
  },
  assistantSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
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
  },
  assistantField: {
    marginBottom: 28,
    zIndex: 10,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  inputContainer: {
    backgroundColor: '#FBFDFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  fieldInput: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  segmentPickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBFDFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    height: 60,
    paddingHorizontal: 22,
  },
  segmentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  segmentDropdown: {
    backgroundColor: '#2D3E50',
    borderRadius: 20,
    marginTop: 6,
    padding: 10,
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  segmentOption: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  generateBtn: {
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  generateBtnGradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtnText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  createModalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
  },
  flowProposalModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  intelligenceBox: {
    backgroundColor: '#F0F9FA',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(11, 160, 178, 0.2)',
    marginBottom: 24,
  },
  proposedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  proposedBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0BA0B2',
    letterSpacing: 0.5,
  },
  proposalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  proposalLabel: {
    width: 80,
    fontSize: 10,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  proposalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  logicDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  logicLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0BA0B2',
  },
  proposalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  refineBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refineBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  deployBtn: {
    flex: 1.5,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0B2D3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deployBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  discardBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  saveRuleBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveRuleBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  splitFieldsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
    zIndex: 100,
  },
});
