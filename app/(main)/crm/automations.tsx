import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import {
  addCRMAutomation,
  CRMAutomation,
  deleteCRMAutomation,
  getCRMAutomations,
  getCRMMeta,
  getCRMTemplates,
  updateCRMAutomationStatus
} from '@/services/crmService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IntelligentFlow {
  id: string;
  title: string;
  subtitle: string;
}

const FLOWS_DATA: IntelligentFlow[] = [
  { id: '1', title: 'Instant SMS Follow-up on New Lead', subtitle: 'Boosts engagement by 40%' },
  { id: '2', title: 'Re-engage Leads after 30 days', subtitle: 'Prevents database decay' },
  { id: '3', title: 'Auto-assign Premium Leads to Senior Agents', subtitle: 'Optimizes conversion for $2M+' },
  { id: '4', title: 'Predictive Churn Prevention', subtitle: 'AI detects low-activity high-value leads' },
  { id: '5', title: 'Neighborhood Alert Workflow', subtitle: 'Syncs lead zip code with new inventory' },
];

export default function CRM_AutomationsScreen() {
  const { colors } = useAppTheme();
  const { accessToken } = useAuth();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [ruleIdentity, setRuleIdentity] = useState('');
  const [targetSegment, setTargetSegment] = useState('All Leads');
  const [targetSegmentId, setTargetSegmentId] = useState<string | number | null>(null);
  const [targetSegmentType, setTargetSegmentType] = useState<'all' | 'group' | 'tag'>('all');
  const [segmentPickerVisible, setSegmentPickerVisible] = useState(false);
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const [flowModalVisible, setFlowModalVisible] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<IntelligentFlow | null>(null);

  const [createRuleVisible, setCreateRuleVisible] = useState(false);
  const [triggerLogic, setTriggerLogic] = useState('New Lead Captured');
  const [executionWhen, setExecutionWhen] = useState('Immediate');
  const [automatedAction, setAutomatedAction] = useState('Send Welcome Email');
  const [activePicker, setActivePicker] = useState<'trigger' | 'execution' | 'action' | 'segment' | null>(null);

  // Proposed AI values state
  const [proposedTrigger, setProposedTrigger] = useState('Heat Index > 85');
  const [proposedAction, setProposedAction] = useState('Predictive Retargeting SMS');
  const [proposedReasoning, setProposedReasoning] = useState('Analyzing lead behavior patterns for this segment suggests this trigger will maximize ROI.');

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: (newRule: Omit<CRMAutomation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
      addCRMAutomation(accessToken!, newRule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-automations'] });
      setCreateRuleVisible(false);
      setFlowModalVisible(false);
      setAiAssistantVisible(false);
      // Reset form
      setRuleIdentity('');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to create automation');
    }
  });

  // Fetch Automations
  const {
    data: automations = [],
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['crm-automations'],
    queryFn: () => getCRMAutomations(accessToken!),
    enabled: !!accessToken,
  });

  const handleRefresh = async () => {
    setManualRefreshing(true);
    await refetch();
    setManualRefreshing(false);
  };

  // Fetch Meta (Groups/Tags)
  const { data: metaData } = useQuery({
    queryKey: ['crm-meta'],
    queryFn: () => getCRMMeta(accessToken!),
    enabled: !!accessToken,
  });

  // Fetch Templates
  const { data: templates = [] } = useQuery({
    queryKey: ['crm-templates'],
    queryFn: () => getCRMTemplates(accessToken!),
    enabled: !!accessToken,
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templatePickerVisible, setTemplatePickerVisible] = useState(false);

  // Toggle Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) =>
      updateCRMAutomationStatus(accessToken!, id, status === 1 ? 0 : 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-automations'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to update status');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCRMAutomation(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-automations'] });
      setConfirmDeleteVisible(false);
      setRuleToDelete(null);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to delete automation');
    }
  });

  const SEGMENTS = [
    'All Leads',
    'High Intent Only',
    'Social Media Leads',
    'Website Direct',
    'Luxury Segment (>$2M)',
    'Cold Database'
  ];

  const TRIGGER_OPTIONS = [
    'Contact Captured',
    'Lead Captured',
    'Heat Index > 85',
    'Deal Stage Updated',
    'No Activity for 14 Days'
  ];

  const EXECUTION_OPTIONS = [
    'Immediate',
    'Wait 5 Minutes',
    'Wait 1 Hour',
    'Wait 24 Hours',
    'Wait 7 Days'
  ];

  const ACTION_OPTIONS = [
    'Send Email from Template',
    'Send Follow-up SMS',
    'Assign Agent Task',
    'Apply Contact Tag',
    'Update Lead Score'
  ];

  const filteredRules = useMemo(() => {
    return (automations as CRMAutomation[]).filter(rule =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [automations, searchQuery]);

  const toggleRuleStatus = (id: string, currentStatus: number) => {
    toggleStatusMutation.mutate({ id, status: currentStatus });
  };

  const handleFlowPress = (flow: IntelligentFlow) => {
    setSelectedFlow(flow);
    setRuleIdentity("Generate a workflow for: " + flow.title);
    setTargetSegment("Cold Database");
    // Dynamically set based on flow type if needed, or keep these common AI defaults
    setProposedTrigger("Heat Index > 85");
    setProposedAction("Predictive Retargeting SMS");
    setProposedReasoning("Analyzing lead behavior patterns for this segment suggests this trigger will maximize ROI.");
    setFlowModalVisible(true);
  };

  const deployAutomation = () => {
    addMutation.mutate({
      name: ruleIdentity || "Auto-assign Premium Leads to Senior Agents",
      trigger: proposedTrigger,
      action: proposedAction,
      target: targetSegment,
      execution: "Immediate",
      reasoning: proposedReasoning,
      category: "AI-Generated",
      icon: "Sparkles",
      status: 1,
      target_id: null,
      template_id: null
    });
  };

  const handleCreateSave = () => {
    if (!ruleIdentity.trim()) {
      Alert.alert('Error', 'Please provide a rule identity (name)');
      return;
    }

    addMutation.mutate({
      name: ruleIdentity,
      trigger: triggerLogic,
      action: automatedAction === 'Send Email from Template' ? `Email: ${selectedTemplateId}` : automatedAction,
      status: 1,
      category: 'Manual',
      target: targetSegment,
      // Pass ID and Type if the backend supports it, otherwise name is fine
      target_id: targetSegmentId?.toString() || null,
      execution: executionWhen,
      icon: 'Lightning',
      template_id: automatedAction === 'Send Email from Template' ? selectedTemplateId : null
    });
  };

  const handleDeletePress = (id: string) => {
    setRuleToDelete(id);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      deleteMutation.mutate(ruleToDelete);
    }
  };

  const renderRuleItem = (rule: CRMAutomation) => {
    const isActive = rule.status === 1;
    const accentColor = isActive ? '#10B981' : colors.textSecondary;

    // Map icon names from API to MaterialCommunityIcons
    const getIconName = (name: string): any => {
      switch (name) {
        case 'Sparkles': return 'flare';
        case 'Bot': return 'robot-outline';
        case 'AccountPlus': return 'account-plus-outline';
        case 'Clock': return 'clock-outline';
        case 'Lightning': return 'lightning-bolt-outline';
        default: return 'lightning-bolt';
      }
    };

    return (
      <View key={rule.id} style={styles.premiumCard}>
        <LinearGradient
          colors={isActive ? ['rgba(16, 185, 129, 0.08)', 'transparent'] : ['rgba(148, 163, 184, 0.05)', 'transparent']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeaderSmall}>
            <View style={styles.cardIconBox}>
              <MaterialCommunityIcons name={getIconName(rule.icon)} size={20} color={accentColor} />
            </View>
            <View style={styles.categoryBadge}>
              <Text style={[styles.categoryText, { color: accentColor }]}>{rule.category?.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => toggleRuleStatus(rule.id, rule.status)}
              style={styles.switchWrapper}
            >
              <Text style={[styles.statusToggleLabel, { color: isActive ? '#10B981' : colors.textSecondary }]}>
                {isActive ? 'ACTIVE' : 'PAUSED'}
              </Text>
              <View style={[
                styles.customToggleContainer,
                { backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)' }
              ]}>
                <View style={[
                  styles.customToggleThumb,
                  { 
                    backgroundColor: isActive ? '#10B981' : '#94A3B8',
                    transform: [{ translateX: isActive ? 20 : 2 }]
                  }
                ]} />
              </View>
              {toggleStatusMutation.isPending && toggleStatusMutation.variables?.id === rule.id && (
                <ActivityIndicator 
                  size="small" 
                  color={isActive ? '#10B981' : colors.textSecondary} 
                  style={{ marginLeft: 6 }} 
                />
              )}
            </Pressable>
          </View>

          <View style={styles.cardMainContent}>
            <Text style={styles.premiumRuleName}>{rule.name}</Text>

            <View style={styles.logicFlowContainer}>
              <View style={styles.logicStep}>
                <View style={styles.logicIndicator}>
                  <Text style={styles.logicLabelSmall}>IF</Text>
                </View>
                <View style={styles.logicContent}>
                  <Text style={styles.logicTitle}>Trigger Condition</Text>
                  <Text style={styles.logicValue} numberOfLines={1}>{rule.trigger}</Text>
                </View>
              </View>

              <View style={styles.logicConnector}>
                <View style={styles.connectorLine} />
              </View>

              <View style={styles.logicStep}>
                <View style={[styles.logicIndicator, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Text style={[styles.logicLabelSmall, { color: '#3B82F6' }]}>THEN</Text>
                </View>
                <View style={styles.logicContent}>
                  <Text style={styles.logicTitle}>Automated Action</Text>
                  <Text style={styles.logicValue} numberOfLines={1}>{rule.action}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardFooterPremium}>
            <View style={styles.footerInfoBox}>
              <MaterialCommunityIcons name="target" size={12} color={colors.textSecondary} />
              <Text style={styles.footerInfoText} numberOfLines={1}>{rule.target}</Text>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerInfoBox}>
              <MaterialCommunityIcons name="timer-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.footerInfoText}>{rule.execution}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable
              style={styles.trashBtn}
              onPress={() => handleDeletePress(rule.id)}
            >
              <MaterialCommunityIcons name="delete-outline" size={18} color="#EF4444" />
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
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
        refreshControl={
          <RefreshControl refreshing={manualRefreshing} onRefresh={handleRefresh} tintColor="#0BA0B2" />
        }
      >
        {/* Floating Action Area */}
        <View style={styles.floatingActionArea}>
          <Pressable
            style={styles.floatingAiBtn}
            onPress={() => setAiAssistantVisible(true)}
          >
            <LinearGradient
              colors={['#0BA0B2', '#0891B2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.floatingAiGradient}
            >
              <MaterialCommunityIcons name="robot-outline" size={20} color="#FFFFFF" />
              <Text style={styles.floatingAiText}>AI Rule</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.floatingCreateBtn}
            onPress={() => setCreateRuleVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.floatingCreateText}>Create Rule</Text>
          </Pressable>
        </View>

        {/* Search Bar Modernized */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search automation rules..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <Pressable onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Rules List */}
        <View style={styles.rulesList}>
          {isLoading && !isRefetching ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#0BA0B2" />
              <Text style={styles.loadingText}>Fetching intelligence flows...</Text>
            </View>
          ) : filteredRules.length === 0 ? (
            <View style={styles.centerContainer}>
              <MaterialCommunityIcons name="robot-off-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No automation rules found</Text>
              <Text style={styles.emptySubtext}>Create one or use Zien Assistant to get started.</Text>
            </View>
          ) : (
            filteredRules.map(renderRuleItem)
          )}
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
          colors={colors.backgroundGradient as any}
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
                  <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
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
                    color={colors.textPrimary}
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
                onPress={() => {
                  setAiAssistantVisible(false);
                  setFlowModalVisible(true);
                }}
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
          colors={colors.backgroundGradient as any}
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
                  <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
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
                      value={ruleIdentity}
                      onChangeText={setRuleIdentity}
                    />
                  </View>
                </View>

                {/* Trigger Logic */}
                <View style={[styles.assistantField, { zIndex: activePicker === 'trigger' ? 9999 : 50 }]}>
                  <Text style={styles.fieldLabel}>TRIGGER LOGIC (IF)</Text>
                  <Pressable
                    style={styles.segmentPickerTrigger}
                    onPress={() => setActivePicker(activePicker === 'trigger' ? null : 'trigger')}
                  >
                    <Text style={styles.segmentValue} numberOfLines={1}>{triggerLogic}</Text>
                    <MaterialCommunityIcons
                      name={activePicker === 'trigger' ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={colors.textPrimary}
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
                <View style={[styles.assistantField, { zIndex: activePicker === 'execution' ? 9999 : 40 }]}>
                  <Text style={styles.fieldLabel}>EXECUTION (WHEN)</Text>
                  <Pressable
                    style={styles.segmentPickerTrigger}
                    onPress={() => setActivePicker(activePicker === 'execution' ? null : 'execution')}
                  >
                    <Text style={styles.segmentValue} numberOfLines={1}>{executionWhen}</Text>
                    <MaterialCommunityIcons
                      name={activePicker === 'execution' ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={colors.textPrimary}
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

                {/* Action and Template Split Row */}
                <View style={{ zIndex: (activePicker === 'action' || templatePickerVisible) ? 9999 : 30 }}>

                  <View style={[styles.assistantField, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>AUTOMATED ACTION (THEN)</Text>
                    <Pressable
                      style={styles.segmentPickerTrigger}
                      onPress={() => setActivePicker(activePicker === 'action' ? null : 'action')}
                    >
                      <Text style={styles.segmentValue} numberOfLines={1}>{automatedAction}</Text>
                      <MaterialCommunityIcons
                        name={activePicker === 'action' ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={colors.textPrimary}
                      />
                    </Pressable>
                    {activePicker === 'action' && (
                      <View style={[styles.segmentDropdown, { top: 90 }]}>
                        <ScrollView style={{ maxHeight: 200 }} bounces={false}>
                          {ACTION_OPTIONS.map(opt => (
                            <Pressable
                              key={opt}
                              style={styles.segmentOption}
                              onPress={() => {
                                setAutomatedAction(opt);
                                setActivePicker(null);
                              }}
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

                  {/* Template Specific Picker (if Email from Template selected) */}
                  {automatedAction === 'Send Email from Template' && (
                    <View style={[styles.assistantField, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>EMAIL TEMPLATE</Text>
                      <Pressable
                        style={styles.segmentPickerTrigger}
                        onPress={() => setTemplatePickerVisible(!templatePickerVisible)}
                      >
                        <Text style={styles.segmentValue} numberOfLines={1}>
                          {templates.find(t => t.id === selectedTemplateId)?.name || 'Choose...'}
                        </Text>
                        <MaterialCommunityIcons
                          name={templatePickerVisible ? "chevron-up" : "chevron-down"}
                          size={20}
                          color={colors.textPrimary}
                        />
                      </Pressable>
                      {templatePickerVisible && (
                        <View style={[styles.segmentDropdown, { top: 90 }]}>
                          <ScrollView style={{ maxHeight: 200 }} bounces={false}>
                            {templates.map(t => (
                              <Pressable
                                key={t.id}
                                style={styles.segmentOption}
                                onPress={() => {
                                  setSelectedTemplateId(t.id);
                                  setTemplatePickerVisible(false);
                                }}
                              >
                                <View style={styles.optionContent}>
                                  <Text style={[styles.optionText, selectedTemplateId === t.id && styles.optionTextSelected]}>{t.name}</Text>
                                  {selectedTemplateId === t.id && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                                </View>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  )}

                </View>

                {/* Target Segment */}
                <View style={[styles.assistantField, { zIndex: activePicker === 'segment' ? 9999 : 10 }]}>
                  <Text style={styles.fieldLabel}>TARGET SEGMENT</Text>
                  <Pressable
                    style={styles.segmentPickerTrigger}
                    onPress={() => setActivePicker(activePicker === 'segment' ? null : 'segment')}
                  >
                    <Text style={styles.segmentValue}>{targetSegment}</Text>
                    <MaterialCommunityIcons
                      name={activePicker === 'segment' ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.textPrimary}
                    />
                  </Pressable>
                  {activePicker === 'segment' && (
                    <View style={[styles.segmentDropdown, { bottom: 70 }]}>
                      <ScrollView style={{ maxHeight: 300 }} bounces={false}>
                        {/* Static Options */}
                        <Pressable
                          style={styles.segmentOption}
                          onPress={() => {
                            setTargetSegment('All Leads');
                            setTargetSegmentId(null);
                            setTargetSegmentType('all');
                            setActivePicker(null);
                          }}
                        >
                          <View style={styles.optionContent}>
                            <Text style={[styles.optionText, targetSegment === 'All Leads' && styles.optionTextSelected]}>All Leads</Text>
                            {targetSegment === 'All Leads' && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                          </View>
                        </Pressable>

                        {/* Groups */}
                        {metaData?.groups && metaData.groups.length > 0 && (
                          <View style={styles.dropdownCategory}>
                            <Text style={styles.dropdownCategoryText}>Groups</Text>
                            {metaData.groups.map(group => (
                              <Pressable
                                key={`group-${group.id}`}
                                style={styles.segmentOption}
                                onPress={() => {
                                  setTargetSegment(`Group: ${group.name}`);
                                  setTargetSegmentId(group.id);
                                  setTargetSegmentType('group');
                                  setActivePicker(null);
                                }}
                              >
                                <View style={styles.optionContent}>
                                  <Text style={[styles.optionText, targetSegmentId === group.id && targetSegmentType === 'group' && styles.optionTextSelected]}>
                                    {group.name}
                                  </Text>
                                  {targetSegmentId === group.id && targetSegmentType === 'group' && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                                </View>
                              </Pressable>
                            ))}
                          </View>
                        )}

                        {/* Tags */}
                        {metaData?.tags && metaData.tags.length > 0 && (
                          <View style={styles.dropdownCategory}>
                            <Text style={styles.dropdownCategoryText}>Tags</Text>
                            {metaData.tags.map(tag => (
                              <Pressable
                                key={`tag-${tag.id}`}
                                style={styles.segmentOption}
                                onPress={() => {
                                  setTargetSegment(`Tag: ${tag.name}`);
                                  setTargetSegmentId(tag.id);
                                  setTargetSegmentType('tag');
                                  setActivePicker(null);
                                }}
                              >
                                <View style={styles.optionContent}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tag.tag_color }} />
                                    <Text style={[styles.optionText, targetSegmentId === tag.id && targetSegmentType === 'tag' && styles.optionTextSelected]}>
                                      {tag.name}
                                    </Text>
                                  </View>
                                  {targetSegmentId === tag.id && targetSegmentType === 'tag' && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                                </View>
                              </Pressable>
                            ))}
                          </View>
                        )}
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
                onPress={handleCreateSave}
              >
                {addMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveRuleBtnText}>Save</Text>
                )}
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
                <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.intelligenceBox}>
              <View style={styles.proposedBadge}>
                <MaterialCommunityIcons name="check" size={14} color="#0BA0B2" />
                <Text style={styles.proposedBadgeText}>INTELLIGENCE PROPOSED</Text>
              </View>

              <View style={styles.proposalDetailRow}>
                <Text style={styles.proposalLabel}>TRIGGER:</Text>
                <Text style={styles.proposalValue}>{proposedTrigger}</Text>
              </View>

              <View style={styles.proposalDetailRow}>
                <Text style={styles.proposalLabel}>ACTION:</Text>
                <Text style={styles.proposalValue}>{proposedAction}</Text>
              </View>

              <View style={styles.proposalDetailRow}>
                <Text style={styles.proposalLabel}>SEGMENT:</Text>
                <Text style={styles.proposalValue}>{targetSegment}</Text>
              </View>

              <View style={styles.logicDivider} />
              <Text style={styles.logicLabel}>Logic: <Text style={{ fontStyle: 'italic', color: colors.inputPlaceholder }}>"{proposedReasoning}"</Text></Text>
            </View>

            <View style={styles.proposalFooter}>
              <Pressable
                style={styles.refineBtn}
                onPress={() => {
                  setFlowModalVisible(false);
                  setRuleIdentity("Generate a workflow for: " + (selectedFlow?.title || "Auto-assign Premium Leads to Senior Agents"));
                  setTargetSegment("Cold Database");
                  setAiAssistantVisible(true);
                }}
              >
                <Text style={styles.refineBtnText}>Refine Prompt</Text>
              </Pressable>

              <Pressable
                style={styles.deployBtn}
                onPress={deployAutomation}
              >
                {addMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.deployBtnText}>Deploy Automation</Text>
                    <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                  </>
                )}
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

function getStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    floatingActionArea: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    floatingAiBtn: {
      flex: 1,
      height: 52,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#0BA0B2',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    floatingAiGradient: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    floatingAiText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    floatingCreateBtn: {
      flex: 1,
      height: 52,
      borderRadius: 16,
      backgroundColor: '#1E293B',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    floatingCreateText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    searchSection: {
      marginBottom: 24,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 52,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    rulesList: {
      gap: 16,
      marginBottom: 24,
    },
    modernRuleCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      flexDirection: 'row',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.cardBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    cardSidebar: {
      width: 6,
    },
    modernCardContent: {
      flex: 1,
      padding: 16,
    },
    modernCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    ruleIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(100, 116, 139, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    ruleTitleContainer: {
      flex: 1,
    },
    modernRuleName: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    ruleMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ruleCategoryText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    dotSeparator: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: '#CBD5E1',
      marginHorizontal: 6,
    },
    ruleSourceText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: 'rgba(100, 116, 139, 0.05)',
      gap: 6,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusPillText: {
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    ruleDetailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.cardBorder,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    detailText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    ruleActions: {
      flexDirection: 'row',
      gap: 8,
    },
    cardActionBtn: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: 'rgba(100, 116, 139, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    deleteActionBtn: {
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      borderColor: 'rgba(239, 68, 68, 0.1)',
    },
    impactCard: {
      backgroundColor: '#0BA0B2',
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#0BA0B2',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 8,
    },
    impactTitle: {
      fontSize: 20,
      fontWeight: '900',
      marginBottom: 4,
      color: '#FFFFFF',
    },
    impactScore: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.7)',
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
      color: 'rgba(255, 255, 255, 0.7)',
      letterSpacing: 0.5,
    },
    aiInsightBox: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: 12,
      borderRadius: 12,
    },
    aiInsightText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '500',
    },
    flowsSection: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.textPrimary,
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    flowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    flowIconBox: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: 'rgba(11, 160, 178, 0.08)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    flowInfo: {
      flex: 1,
    },
    flowTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    flowSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    fullModalContainer: {
      flex: 1,
    },
    assistantModalContent: {
      flex: 1,
      padding: 24,
    },
    assistantHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 32,
    },
    assistantTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: colors.textPrimary,
      letterSpacing: -1,
    },
    assistantSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
      marginTop: 4,
    },
    closeBtnSmall: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceSoft || 'rgba(100, 116, 139, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    assistantField: {
      marginBottom: 24,
    },
    fieldLabel: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.textSecondary,
      letterSpacing: 1.5,
      marginBottom: 12,
    },
    inputContainer: {
      backgroundColor: colors.surfaceSoft || 'rgba(100, 116, 139, 0.05)',
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 56,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.cardBorder || 'rgba(100, 116, 139, 0.1)',
    },
    fieldInput: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    segmentPickerTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surfaceSoft || 'rgba(100, 116, 139, 0.05)',
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 56,
      borderWidth: 1,
      borderColor: colors.cardBorder || 'rgba(100, 116, 139, 0.1)',
    },
    segmentValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    segmentDropdown: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 20,
      zIndex: 1000,
    },
    segmentOption: {
      padding: 12,
      borderRadius: 12,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    optionTextSelected: {
      color: '#0BA0B2',
      fontWeight: '800',
    },
    modalFooter: {
      paddingTop: 16,
    },
    generateBtn: {
      height: 56,
      borderRadius: 18,
      overflow: 'hidden',
    },
    generateBtnGradient: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    generateBtnText: {
      fontSize: 16,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: 1,
    },
    createModalFooter: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 16,
    },
    dropdownCategory: {
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    dropdownCategoryText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingHorizontal: 16,
      marginBottom: 4,
    },
    switchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusToggleLabel: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
      marginRight: 8,
    },
    customToggleContainer: {
      width: 44,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    customToggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    discardBtn: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.1)',
    },
    discardBtnText: {
      fontSize: 15,
      fontWeight: '800',
      color: '#EF4444',
    },
    saveRuleBtn: {
      flex: 2,
      height: 56,
      borderRadius: 18,
      backgroundColor: '#1E293B',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    saveRuleBtnText: {
      fontSize: 16,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: 1,
    },
    bottomOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      justifyContent: 'flex-end',
    },
    flowProposalModal: {
      backgroundColor: colors.cardBackground,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      padding: 24,
      minHeight: 450,
    },
    sheetHandle: {
      width: 40,
      height: 5,
      backgroundColor: '#E2E8F0',
      borderRadius: 2.5,
      alignSelf: 'center',
      marginBottom: 24,
    },
    proposalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
    },
    intelligenceBox: {
      backgroundColor: 'rgba(11, 160, 178, 0.05)',
      borderRadius: 24,
      padding: 24,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: 'rgba(11, 160, 178, 0.1)',
    },
    proposedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 20,
    },
    proposedBadgeText: {
      fontSize: 10,
      fontWeight: '900',
      color: '#0BA0B2',
      letterSpacing: 1,
    },
    proposalDetailRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    proposalLabel: {
      width: 80,
      fontSize: 10,
      fontWeight: '900',
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    proposalValue: {
      flex: 1,
      fontSize: 15,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    logicDivider: {
      height: 1,
      backgroundColor: 'rgba(11, 160, 178, 0.1)',
      marginVertical: 16,
    },
    logicLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    proposalFooter: {
      flexDirection: 'row',
      gap: 12,
    },
    refineBtn: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      backgroundColor: 'rgba(100, 116, 139, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    refineBtnText: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.textSecondary,
    },
    deployBtn: {
      flex: 2,
      height: 56,
      borderRadius: 18,
      backgroundColor: '#0BA0B2',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    deployBtnText: {
      fontSize: 16,
      fontWeight: '900',
      color: '#FFFFFF',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    confirmModal: {
      width: '100%',
      backgroundColor: colors.cardBackground,
      borderRadius: 32,
      padding: 32,
      alignItems: 'center',
    },
    trashCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    confirmTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.textPrimary,
      marginBottom: 12,
      textAlign: 'center',
    },
    confirmSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
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
      height: 56,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtnText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    deleteBtn: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      backgroundColor: '#EF4444',
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteBtnText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    splitFieldsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 4,
      zIndex: 100,
    },
    // Premium Card Styles
    premiumCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.cardBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      marginBottom: 16,
    },
    cardGradient: {
      padding: 20,
    },
    cardHeaderSmall: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardIconBox: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: 'rgba(100, 116, 139, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: 'rgba(100, 116, 139, 0.05)',
    },
    categoryText: {
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.8,
    },
    statusToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      gap: 6,
    },
    statusDotSmall: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
    },
    statusTextSmall: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    cardMainContent: {
      marginBottom: 20,
    },
    premiumRuleName: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.textPrimary,
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    logicFlowContainer: {
      backgroundColor: 'rgba(100, 116, 139, 0.03)',
      borderRadius: 16,
      padding: 12,
      gap: 4,
    },
    logicStep: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    logicIndicator: {
      width: 44,
      height: 24,
      borderRadius: 6,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logicLabelSmall: {
      fontSize: 10,
      fontWeight: '900',
      color: '#10B981',
    },
    logicContent: {
      flex: 1,
    },
    logicTitle: {
      fontSize: 9,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    logicValue: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    logicConnector: {
      height: 12,
      marginLeft: 21,
      width: 2,
      justifyContent: 'center',
    },
    connectorLine: {
      flex: 1,
      width: 1,
      backgroundColor: colors.cardBorder,
      opacity: 0.5,
    },
    cardFooterPremium: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.cardBorder,
      gap: 12,
    },
    footerInfoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    footerInfoText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    footerDivider: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.cardBorder,
    },
    trashBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    centerContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginTop: 8,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      marginTop: 8,
    },
    emptySubtext: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}