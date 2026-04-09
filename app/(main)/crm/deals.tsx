import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { CRMContact, CRMDeal, CRMPipeline, CRMStage, addCRMDeal, addCRMPipelineStage, deleteCRMPipelineStage, getCRMContacts, getCRMDeals, getCRMPipelines, updateCRMDealStage } from '@/services/crmService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROPERTIES = [
  '123 Business Way, Los Angeles',
  '456 Tech Lane',
  '789 Garden St',
  '101 Cyberdyne Blvd'
];

export default function DealsScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { accessToken } = useAuth();

  // Pipeline-related state
  const [activePipeline, setActivePipeline] = useState<CRMPipeline | null>(null);
  const [targetPipeline, setTargetPipeline] = useState<CRMPipeline | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [transferingDealId, setTransferingDealId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const scrollRef = useRef<ScrollView>(null);

  // TanStack Query for dynamic data
  const { data: pipelines = [], isLoading: isLoadingPipelines } = useQuery({
    queryKey: ['crmPipelines', accessToken],
    queryFn: () => getCRMPipelines(accessToken!),
    enabled: !!accessToken,
  });

  // Set default active pipeline when data loads and sync it
  useEffect(() => {
    if (pipelines.length > 0) {
      if (!activePipeline) {
        setActivePipeline(pipelines[0]);
      } else {
        const updated = pipelines.find(p => p.id === activePipeline.id);
        if (updated) {
          setActivePipeline(updated);
        }
      }
    }
  }, [pipelines]);

  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ['crmContacts', accessToken],
    queryFn: () => getCRMContacts(accessToken!),
    enabled: !!accessToken,
  });


  const { data: deals = [], isLoading: isLoadingDeals } = useQuery({
    queryKey: ['crmDeals', activePipeline?.id, accessToken],
    queryFn: () => getCRMDeals(accessToken!, activePipeline!.id),
    enabled: !!accessToken && !!activePipeline?.id,
  });

  // Calculate deals per stage
  const dealsByStage = useMemo(() => {
    const map: Record<string, CRMDeal[]> = {};
    deals.forEach(deal => {
      if (!map[deal.stage_id]) map[deal.stage_id] = [];
      map[deal.stage_id].push(deal);
    });
    return map;
  }, [deals]);

  // Form states
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [dealValue, setDealValue] = useState('');
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [customStageName, setCustomStageName] = useState('');
  const [isCreatingDeal, setIsCreatingDeal] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Dropdown visibility states
  const [isContactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [isPropertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [isPipelineDropdownOpen, setPipelineDropdownOpen] = useState(false);
  const [isStageDropdownOpen, setStageDropdownOpen] = useState(false);

  // Stage Management states
  const [isStagesModalVisible, setIsStagesModalVisible] = useState(false);
  const [newStageInput, setNewStageInput] = useState('');
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['crmPipelines'] }),
      queryClient.invalidateQueries({ queryKey: ['crmContacts'] }),
      queryClient.invalidateQueries({ queryKey: ['crmDeals'] })
    ]);
    setRefreshing(false);
  }, [queryClient]);
  const [deletingStageId, setDeletingStageId] = useState<string | null>(null);

  const currentStages = activePipeline?.stages || [];

  const handleAddStage = async () => {
    if (!newStageInput.trim() || !activePipeline?.id || !accessToken) return;

    try {
      setIsAddingStage(true);
      await addCRMPipelineStage(accessToken, activePipeline.id, newStageInput.trim());
      setNewStageInput('');
      await queryClient.invalidateQueries({ queryKey: ['crmPipelines'] });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add stage');
    } finally {
      setIsAddingStage(false);
    }
  };

  const handleRemoveStage = async (stageId: string) => {
    if (!accessToken) return;

    try {
      setDeletingStageId(stageId);
      await deleteCRMPipelineStage(accessToken, stageId);
      await queryClient.invalidateQueries({ queryKey: ['crmPipelines'] });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete stage');
    } finally {
      setDeletingStageId(null);
    }
  };

  // Auto-Trigger states
  const [isAutoTriggerModalVisible, setIsAutoTriggerModalVisible] = useState(false);
  const [automations, setAutomations] = useState([
    { id: 'lead', stage: 'Lead', enabled: true, action: 'Send Email' },
    { id: 'contacted', stage: 'Contacted', enabled: false, action: 'Send Email' },
    { id: 'showing', stage: 'Showing', enabled: false, action: 'SMS Alert' },
    { id: 'offer', stage: 'Offer', enabled: true, action: 'Send Email' },
    { id: 'closed', stage: 'Closed', enabled: true, action: 'Send Email' },
  ]);
  const [activeActionStageId, setActiveActionStageId] = useState<string | null>(null);

  const handleSaveAutomations = () => {
    setIsAutoTriggerModalVisible(false);
  };


  const resetForm = () => {
    setCustomStageName('');
    setTargetPipeline(null);
    setSelectedContact(null);
    setSelectedProperty('');
    setDealValue('');
    setSelectedStageId('');
    setShowErrors(false);
    setContactDropdownOpen(false);
    setPropertyDropdownOpen(false);
    setPipelineDropdownOpen(false);
    setStageDropdownOpen(false);
  };

  const handleCreateDeal = async () => {
    setShowErrors(true);
    if (!accessToken || !targetPipeline || !selectedContact || !selectedProperty || !dealValue || !selectedStageId) {
      return;
    }

    try {
      setIsCreatingDeal(true);

      let finalStageId = selectedStageId;

      // Handle custom stage creation
      if (selectedStageId === 'custom' && customStageName.trim()) {
        const newStage = await addCRMPipelineStage(accessToken, targetPipeline.id, customStageName.trim());
        finalStageId = newStage.id;
        await queryClient.invalidateQueries({ queryKey: ['crmPipelines'] });
      } else if (selectedStageId === 'custom') {
        Alert.alert('Error', 'Please enter a name for the custom stage.');
        return;
      }

      if (!finalStageId) {
        Alert.alert('Error', 'Please select a stage.');
        return;
      }

      // Convert value string like "$ 1,200,000" to number
      const numericValue = parseInt(dealValue.replace(/[^0-9]/g, '')) || 0;

      await addCRMDeal(accessToken, {
        contact_id: selectedContact.id,
        pipeline_id: targetPipeline.id,
        stage_id: finalStageId,
        related_property: selectedProperty,
        deal_value: numericValue
      });

      setIsModalVisible(false);
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ['crmDeals'] });
      Alert.alert('Success', 'Deal created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create deal');
    } finally {
      setIsCreatingDeal(false);
    }
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const updateAutomationAction = (stageName: string, action: string) => {
    setAutomations(prev => {
      const exists = prev.find(a => a.stage === stageName);
      if (exists) {
        return prev.map(a => a.stage === stageName ? { ...a, action } : a);
      }
      return [...prev, { id: Math.random().toString(), stage: stageName, enabled: false, action }];
    });
    setActiveActionStageId(null);
  };

  const handleValueChange = (text: string) => {
    // Remove all non-numeric characters
    const cleanNumber = text.replace(/[^0-9]/g, '');
    if (cleanNumber === '') {
      setDealValue('');
      return;
    }
    // Format with commas and $ prefix
    const formatted = '$ ' + Number(cleanNumber).toLocaleString();
    setDealValue(formatted);
  };

  const formatPrice = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '$0';
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
    return `$${num}`;
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const handleMoveDeal = async (dealId: string, stageId: string) => {
    try {
      await updateCRMDealStage(accessToken!, dealId, stageId);
      setTransferingDealId(null);
      await queryClient.invalidateQueries({ queryKey: ['crmDeals'] });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to move deal');
    }
  };

  const renderDealCard = (deal: CRMDeal) => {
    const isMenuOpen = transferingDealId === deal.id;

    return (
      <View key={deal.id} style={styles.dealCard}>
        <Text style={styles.dealCardName}>
          {deal.contact ? `${deal.contact.first_name} ${deal.contact.last_name || ''}` : 'No Contact'}
        </Text>
        <Text style={styles.dealCardAddress}>{deal.related_property}</Text>
        <View style={styles.dealCardBottom}>
          <Text style={styles.dealCardValue}>
            {typeof deal.deal_value === 'number' ? `$${deal.deal_value.toLocaleString()}` : formatPrice(deal.deal_value)}
          </Text>
          <View style={styles.cardActions}>
            <Pressable
              style={styles.transferBtn}
              onPress={() => setTransferingDealId(isMenuOpen ? null : deal.id)}
            >
              <Text style={styles.transferBtnText}>Transfer</Text>
              <MaterialCommunityIcons name={isMenuOpen ? "chevron-up" : "chevron-down"} size={14} color={colors.accentTeal} />
            </Pressable>
            <Text style={styles.dealCardTime}>{getTimeAgo(deal.last_activity_at)}</Text>
          </View>
        </View>

        {isMenuOpen && (
          <View style={styles.transferMenu}>
            <Text style={styles.transferMenuTitle}>Move to:</Text>
            <View style={styles.transferOptionsRow}>
              {currentStages.filter(s => s.id !== deal.stage_id).map((stage) => (
                <Pressable
                  key={stage.id}
                  style={styles.transferOption}
                  onPress={() => handleMoveDeal(deal.id, stage.id)}
                >
                  <Text style={styles.transferOptionText}>{stage.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderStage = (stage: CRMStage) => {
    const deals = dealsByStage[stage.id] || [];
    return (
      <View key={stage.id} style={styles.stageColumn}>
        <View style={styles.stageHeader}>
          <Text style={styles.stageHeaderText}>{stage.name.toUpperCase()}</Text>
          <View style={styles.stageCountBadge}>
            <Text style={styles.stageCountText}>{deals.length}</Text>
          </View>
        </View>
        <View style={styles.stageContent}>
          {deals.length > 0 ? (
            deals.map(deal => renderDealCard(deal))
          ) : (
            <View style={styles.dragPlaceholder}>
              <Text style={styles.dragPlaceholderText}>No deal here</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PageHeader
          title="Deals"
          subtitle="Manage your deals from lead to closing with zero manual effort."
          onBack={() => router.back()}
        />

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.mainScroll, { paddingBottom: insets.bottom + 20 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accentTeal}
              colors={[colors.accentTeal]}
            />
          }
        >
          {/* Scrollable Tabs */}
          <View style={styles.tabContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScrollContent}
            >
              {pipelines.map((pipeline) => {
                const isActive = activePipeline?.id === pipeline.id;
                return (
                  <Pressable
                    key={pipeline.id}
                    style={[styles.pillBtn, isActive && styles.pillBtnActive]}
                    onPress={() => setActivePipeline(pipeline)}
                  >
                    <Text style={[styles.pillBtnText, isActive && styles.pillBtnTextActive]}>
                      {pipeline.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.topActions}>
            <View style={styles.filterBtnsRow}>
              <Pressable style={styles.filterBtn} onPress={() => setIsStagesModalVisible(true)}>
                <MaterialCommunityIcons name="tune-variant" size={18} color={colors.textPrimary} />
                <Text style={styles.filterBtnText}>Stages</Text>
              </Pressable>
              <Pressable style={styles.filterBtn} onPress={() => setIsAutoTriggerModalVisible(true)}>
                <MaterialCommunityIcons name="lightning-bolt-outline" size={18} color={colors.textPrimary} />
                <Text style={styles.filterBtnText}>Auto-Triggers</Text>
              </Pressable>
            </View>
          </View>

          {isLoadingDeals ? (
            <View style={{ paddingVertical: 100 }}>
              <ActivityIndicator size="large" color={colors.accentTeal} />
            </View>
          ) : (
            <View style={styles.stagesList}>
              {currentStages.map(stage => renderStage(stage))}
            </View>
          )}
        </ScrollView>

        {/* Add Pipeline Stage Modal */}
        <Modal
          visible={isStagesModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsStagesModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Pipeline Stage</Text>
              </View>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setIsStagesModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.addStageInputRow}>
              <TextInput
                style={styles.newStageTextInput}
                placeholder="New stage name..."
                placeholderTextColor={colors.textMuted}
                value={newStageInput}
                onChangeText={setNewStageInput}
                editable={!isAddingStage}
              />
              <Pressable
                style={[styles.addStageSubmitBtn, isAddingStage && { opacity: 0.7 }]}
                onPress={handleAddStage}
                disabled={isAddingStage}
              >
                {isAddingStage ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.addStageSubmitBtnText}>Add</Text>
                )}
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {currentStages.map((stage) => (
                <View key={stage.id} style={styles.stageManagementItem}>
                  <Text style={styles.stageManagementName}>
                    {stage.name}
                  </Text>
                  <Pressable
                    onPress={() => handleRemoveStage(stage.id)}
                    disabled={deletingStageId === stage.id}
                  >
                    {deletingStageId === stage.id ? (
                      <ActivityIndicator size="small" color={colors.danger} />
                    ) : (
                      <MaterialCommunityIcons name="close" size={20} color={colors.danger} />
                    )}
                  </Pressable>
                </View>
              ))}
            </ScrollView>

            <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 16 }]}>
              <Pressable
                style={styles.saveSettingsBtn}
                onPress={() => setIsStagesModalVisible(false)}
              >
                <Text style={styles.saveSettingsBtnText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Create New Deal Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Create New Deal</Text>
                <Text style={styles.modalSubtitle}>Initialize a new sales opportunity in the pipeline.</Text>
              </View>
              <Pressable
                style={styles.closeBtn}
                onPress={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Primary Contact */}
              <View style={[styles.inputGroup, { zIndex: 100 }]}>
                <Text style={styles.inputLabel}>Primary Contact <Text style={styles.requiredStar}>*</Text></Text>
                <Pressable
                  style={[styles.dropdownTrigger, showErrors && !selectedContact && styles.errorBorder]}
                  onPress={() => {
                    setPropertyDropdownOpen(false);
                    setPipelineDropdownOpen(false);
                    setStageDropdownOpen(false);
                    setContactDropdownOpen(!isContactDropdownOpen);
                  }}
                >
                  <Text style={[styles.dropdownValue, !selectedContact && { color: colors.textSecondary }]}>
                    {selectedContact ? `${selectedContact.first_name} ${selectedContact.last_name || ''}` : 'Select Primary Contact'}
                  </Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textPrimary} />
                </Pressable>
                {showErrors && !selectedContact && (
                  <Text style={styles.errorText}>Primary contact is required</Text>
                )}
                {isContactDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {contacts.map((opt) => (
                      <Pressable
                        key={opt.id}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setSelectedContact(opt);
                          setContactDropdownOpen(false);
                        }}
                      >
                        {selectedContact?.id === opt.id && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                        )}
                        <Text style={[styles.formDropdownItemText, selectedContact?.id === opt.id && { fontWeight: '700' }]}>
                          {opt.first_name} {opt.last_name || ''}
                        </Text>
                      </Pressable>
                    ))}
                    {contacts.length === 0 && (
                      <View style={styles.formDropdownItem}>
                        <Text style={styles.formDropdownItemText}>No contacts found</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Related Property */}
              <View style={[styles.inputGroup, { zIndex: 90 }]}>
                <Text style={styles.inputLabel}>Related Property <Text style={styles.requiredStar}>*</Text></Text>
                <Pressable
                  style={[styles.dropdownTrigger, showErrors && !selectedProperty && styles.errorBorder]}
                  onPress={() => {
                    setContactDropdownOpen(false);
                    setPipelineDropdownOpen(false);
                    setStageDropdownOpen(false);
                    setPropertyDropdownOpen(!isPropertyDropdownOpen);
                  }}
                >
                  <Text style={[styles.dropdownValue, !selectedProperty && { color: colors.textSecondary }]}>
                    {selectedProperty || 'Select Related Property'}
                  </Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textPrimary} />
                </Pressable>
                {showErrors && !selectedProperty && (
                  <Text style={styles.errorText}>Related property is required</Text>
                )}
                {isPropertyDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {PROPERTIES.map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setSelectedProperty(opt);
                          setPropertyDropdownOpen(false);
                        }}
                      >
                        {selectedProperty === opt && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                        )}
                        <Text style={[styles.formDropdownItemText, selectedProperty === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>


              {/* Estimated Deal Value */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Estimated Deal Value <Text style={styles.requiredStar}>*</Text></Text>
                <View style={[styles.valueInputWrapper, showErrors && !dealValue && styles.errorBorder]}>
                  <TextInput
                    style={styles.valueInput}
                    value={dealValue}
                    onChangeText={handleValueChange}
                    keyboardType="numeric"
                    placeholder="$ 1,200,000"
                  />
                </View>
                {showErrors && !dealValue && (
                  <Text style={styles.errorText}>Estimated deal value is required and must be a valid number</Text>
                )}
              </View>

              {/* Target Pipeline */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Target Pipeline <Text style={styles.requiredStar}>*</Text></Text>
                <Pressable
                  style={[styles.dropdownTrigger, showErrors && !targetPipeline && styles.errorBorder]}
                  onPress={() => {
                    setContactDropdownOpen(false);
                    setPropertyDropdownOpen(false);
                    setStageDropdownOpen(false);
                    setPipelineDropdownOpen(!isPipelineDropdownOpen);
                  }}
                >
                  <Text style={[styles.dropdownValue, !targetPipeline && { color: colors.textSecondary }]}>
                    {targetPipeline?.name || 'Select Target Pipeline'}
                  </Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textPrimary} />
                </Pressable>
                {showErrors && !targetPipeline && (
                  <Text style={styles.errorText}>Target pipeline is required</Text>
                )}
                {isPipelineDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {pipelines.map((opt) => (
                      <Pressable
                        key={opt.id}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setTargetPipeline(opt);
                          setSelectedStageId(opt.stages[0]?.id || '');
                          setPipelineDropdownOpen(false);
                        }}
                      >
                        {targetPipeline?.id === opt.id && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                        )}
                        <Text style={[styles.formDropdownItemText, targetPipeline?.id === opt.id && { fontWeight: '700' }]}>{opt.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>



              {/* Stage */}
              <View style={[styles.inputGroup, { zIndex: 200 }]}>
                <Text style={styles.inputLabel}>Stage <Text style={styles.requiredStar}>*</Text></Text>
                <View style={styles.stageSelectContainer}>
                  <Pressable
                    style={[styles.dropdownTrigger, { flex: 1 }, showErrors && !selectedStageId && styles.errorBorder]}
                    onPress={() => {
                      setContactDropdownOpen(false);
                      setPropertyDropdownOpen(false);
                      setPipelineDropdownOpen(false);
                      setStageDropdownOpen(!isStageDropdownOpen);
                    }}
                  >
                    <Text style={[styles.dropdownValue, !selectedStageId && { color: colors.textSecondary }]} numberOfLines={1}>
                      {selectedStageId === 'custom' ? 'Custom Stage...' : (targetPipeline?.stages.find(s => s.id === selectedStageId)?.name || 'Select Stage')}
                    </Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textPrimary} />
                  </Pressable>


                </View>
                {showErrors && !selectedStageId && (
                  <Text style={styles.errorText}>Stage is required</Text>
                )}
                {selectedStageId === 'custom' && (
                  <View style={styles.customStageInputWrapper}>
                    <Text style={styles.inputLabel}>Custom Stage Name *</Text>
                    <TextInput
                      style={styles.customStageInput}
                      placeholder="e.g. Negotiation"
                      placeholderTextColor={colors.textMuted}
                      value={customStageName}
                      onChangeText={setCustomStageName}
                    />
                  </View>
                )}

                {isStageDropdownOpen && (
                  <View style={styles.formDropdownMenuTop}>
                    {targetPipeline?.stages.map((opt) => (
                      <Pressable
                        key={opt.id}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setSelectedStageId(opt.id);
                          setStageDropdownOpen(false);
                        }}
                      >
                        {selectedStageId === opt.id && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                        )}
                        <Text style={[styles.formDropdownItemText, selectedStageId === opt.id && { fontWeight: '700' }]}>{opt.name}</Text>
                      </Pressable>
                    ))}

                    <Pressable
                      style={styles.formDropdownItem}
                      onPress={() => {
                        setSelectedStageId('custom');
                        setStageDropdownOpen(false);
                      }}
                    >
                      {selectedStageId === 'custom' && (
                        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                      )}
                      <Text style={[styles.formDropdownItemText, { color: colors.accentTeal, fontWeight: '700' }]}>Custom Stage...</Text>
                    </Pressable>

                    {(!targetPipeline?.stages || targetPipeline.stages.length === 0) && (
                      <View style={styles.formDropdownItem}>
                        <Text style={styles.formDropdownItemText}>No stages available</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* AI Forecast Section */}
              <View style={styles.aiForecastBox}>
                <View style={styles.aiHeader}>
                  <MaterialCommunityIcons name="robot-outline" size={20} color={colors.accentTeal} />
                  <Text style={styles.aiTitle}>AI Forecast Enabled</Text>
                </View>
                <Text style={styles.aiDescription}>
                  Zien predicts a high probability of closing based on historical data for "{selectedContact ? `${selectedContact.first_name} ${selectedContact.last_name || ''}` : 'selected contact'}" and market demand for selected area.
                </Text>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 16 }]}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.createBtn, isCreatingDeal && { opacity: 0.7 }]}
                onPress={handleCreateDeal}
                disabled={isCreatingDeal}
              >
                {isCreatingDeal ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createBtnText}>Create Deal Pipeline</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Auto-Trigger Automations Modal */}
        <Modal
          visible={isAutoTriggerModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsAutoTriggerModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Zien Automations</Text>
                <Text style={styles.modalSubtitle}>Tell Zien what to do when you move a deal.</Text>
              </View>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setIsAutoTriggerModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {(activePipeline?.stages || []).map((stage) => {
                const item = automations.find(a => a.stage === stage.name) || {
                  id: stage.id,
                  stage: stage.name,
                  enabled: false,
                  action: 'Send Email'
                };
                return (
                  <View
                    key={stage.id}
                    style={[
                      styles.automationCard,
                      item.enabled && styles.automationCardActive
                    ]}
                  >
                    <View style={styles.automationCardMain}>
                      <View style={styles.automationInfo}>
                        <View style={styles.automationTitleRow}>
                          <View style={[styles.statusDot, { backgroundColor: item.enabled ? colors.accentTeal : colors.iconMuted }]} />
                          <Text style={styles.automationStageName}>{stage.name}</Text>
                        </View>
                        <View style={styles.automationActionRow}>
                          <Text style={styles.thenText}>Then </Text>
                          <Pressable
                            style={styles.actionSelector}
                            onPress={() => setActiveActionStageId(activeActionStageId === stage.id ? null : stage.id)}
                          >
                            <Text style={styles.actionText}>{item.action}</Text>
                            <MaterialCommunityIcons name="chevron-down" size={16} color={colors.accentTeal} />
                          </Pressable>

                          {activeActionStageId === stage.id && (
                            <View style={styles.actionDropdownMenu}>
                              {['Send Email', 'Create Task', 'SMS Alert', 'Internal Ping'].map((act) => (
                                <Pressable
                                  key={act}
                                  style={[
                                    styles.actionDropdownItem,
                                    item.action === act && styles.actionDropdownItemActive
                                  ]}
                                  onPress={() => updateAutomationAction(stage.name, act)}
                                >
                                  <Text style={[
                                    styles.actionDropdownText,
                                    item.action === act && styles.actionDropdownTextActive
                                  ]}>
                                    {act}
                                  </Text>
                                  {item.action === act && (
                                    <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" style={styles.actionCheck} />
                                  )}
                                </Pressable>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                      <Switch
                        value={item.enabled}
                        onValueChange={() => toggleAutomation(item.id)}
                        trackColor={{ false: colors.borderLight, true: colors.accentTeal }}
                        thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                        ios_backgroundColor={colors.borderLight}
                      />
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 16 }]}>
              <Pressable
                style={styles.saveSettingsBtn}
                onPress={handleSaveAutomations}
              >
                <Text style={styles.saveSettingsBtnText}>Save Settings</Text>
              </Pressable>
            </View>
          </View>
        </Modal>


        {/* Floating Action Button */}
        <Pressable
          style={[styles.fab, { bottom: 24 + insets.bottom }]}
          onPress={() => setIsModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={32} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surfaceSoft,
    },
    mainScroll: {
      paddingTop: 8,
    },
    tabContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    tabsScrollContent: {
      gap: 12,
      paddingRight: 20,
    },
    pillBtn: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    pillBtnActive: {
      backgroundColor: colors.accentTeal,
      borderColor: colors.accentTeal,
      shadowColor: colors.accentTeal,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    pillBtnText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.textSecondary,
    },
    pillBtnTextActive: {
      color: '#FFFFFF',
    },
    topActions: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    filterBtnsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    filterBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      gap: 8,
    },
    filterBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    stagesList: {
      paddingHorizontal: 20,
    },
    stageColumn: {
      backgroundColor: colors.surfaceSoft,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      padding: 20,
      marginBottom: 24,
    },
    stageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    stageHeaderText: {
      fontSize: 13,
      fontWeight: '900',
      color: colors.textPrimary,
      letterSpacing: 0.5,
    },
    stageCountBadge: {
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 10,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stageCountText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.textSecondary,
    },
    stageContent: {
      gap: 12,
    },
    dealCard: {
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 20,
      shadowColor: colors.cardShadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colors.cardShadowOpacity,
      shadowRadius: 8,
      elevation: 2,
    },
    dealCardName: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    dealCardAddress: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textMuted,
      marginBottom: 12,
    },
    dealCardBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    dealCardValue: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.accentTeal,
    },
    cardActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    transferBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.badgeNewBg,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      gap: 4,
    },
    transferBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.accentTeal,
    },
    dealCardTime: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textMuted,
    },
    transferMenu: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    transferMenuTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    transferOptionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    transferOption: {
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
    },
    transferOptionText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    dragPlaceholder: {
      height: 80,
      backgroundColor: colors.cardBackground,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.borderLight,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dragPlaceholderText: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: '600',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.cardBackground,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    closeBtn: {
      backgroundColor: colors.surfaceIcon,
      padding: 8,
      borderRadius: 12,
    },
    modalScroll: {
      flex: 1,
    },
    modalContent: {
      padding: 24,
    },
    inputGroup: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    requiredStar: {
      color: colors.danger,
    },
    dropdownTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.inputBackground,
      borderWidth: 1.5,
      borderColor: colors.borderInput,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 56,
    },
    dropdownValue: {
      fontSize: 15,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    errorBorder: {
      borderColor: colors.danger,
    },
    errorText: {
      fontSize: 12,
      color: colors.danger,
      marginTop: 6,
      fontWeight: '500',
    },
    formDropdownMenu: {
      marginTop: 8,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
      padding: 8,
      shadowColor: colors.cardShadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colors.cardShadowOpacity,
      shadowRadius: 12,
      elevation: 5,
    },
    formDropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    formDropdownItemText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    valueInputWrapper: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1.5,
      borderColor: colors.borderInput,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 56,
      justifyContent: 'center',
    },
    valueInput: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.accentTeal,
    },
    stageSelectContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    formDropdownMenuTop: {
      position: 'absolute',
      bottom: '100%',
      left: 0,
      right: 0,
      marginBottom: 8,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
      padding: 8,
      zIndex: 1000,
    },
    customStageInputWrapper: {
      marginTop: 16,
    },
    customStageInput: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1.5,
      borderColor: colors.borderInput,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 56,
      fontSize: 15,
      color: colors.textPrimary,
    },
    aiForecastBox: {
      backgroundColor: colors.badgeNewBg,
      borderRadius: 20,
      padding: 20,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.badgeNewBorder,
    },
    aiHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    aiTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.accentTeal,
    },
    aiDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    modalFooter: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      gap: 12,
      backgroundColor: colors.cardBackground,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: 16,
    },
    cancelBtn: {
      flex: 1,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: colors.surfaceMuted,
    },
    cancelBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    createBtn: {
      flex: 2,
      height: 56,
      backgroundColor: colors.accentTeal,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
    },
    createBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textOnAccent,
    },
    addStageInputRow: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
      gap: 12,
    },
    newStageTextInput: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      height: 48,
      borderRadius: 14,
      paddingHorizontal: 16,
      fontSize: 14,
      color: colors.textPrimary,
    },
    addStageSubmitBtn: {
      backgroundColor: colors.accentTeal,
      paddingHorizontal: 20,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addStageSubmitBtnText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textOnAccent,
    },
    stageManagementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    stageManagementName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    saveSettingsBtn: {
      flex: 1,
      height: 56,
      backgroundColor: colors.accentTeal,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
    },
    saveSettingsBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textOnAccent,
    },
    automationCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
    },
    automationCardActive: {
      borderColor: colors.badgeNewBorder,
      backgroundColor: colors.badgeNewBg,
    },
    automationCardMain: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    automationInfo: {
      flex: 1,
    },
    automationTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    automationStageName: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    automationActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    thenText: {
      fontSize: 13,
      color: colors.textMuted,
    },
    actionSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    actionText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.accentTeal,
    },
    actionDropdownMenu: {
      position: 'absolute',
      top: 24,
      left: 0,
      width: 160,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
      padding: 6,
      zIndex: 2000,
      shadowColor: colors.cardShadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    actionDropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    actionDropdownItemActive: {
      backgroundColor: colors.accentTeal,
    },
    actionCheck: {
      marginLeft: 4,
    },
    actionDropdownText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    actionDropdownTextActive: {
      color: '#FFFFFF',
    },
    fab: {
      position: 'absolute',
      right: 24,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.accentTeal,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.accentTeal,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
  });
}