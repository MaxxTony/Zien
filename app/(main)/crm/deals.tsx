import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PIPELINE_TABS = ['Residential Sales', 'Commercial Pipeline', 'Property Rentals'] as const;
const INITIAL_STAGES = ['LEAD', 'CONTACTED', 'SHOWING', 'OFFER', 'CLOSED'];

const CONTACTS = ['Jessica Miller', 'Robert Chen', 'David Wilson', 'Sarah Connor'];
const PROPERTIES = [
  '123 Business Way, Los Angeles',
  '456 Tech Lane',
  '789 Garden St',
  '101 Cyberdyne Blvd'
];

const formatCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(numericValue));
};

interface Deal {
  id: string;
  name: string;
  address: string;
  value: string;
  time: string;
  expires?: string;
}

const DEALS_DATA: Record<(typeof PIPELINE_TABS)[number], Record<string, Deal[]>> = {
  'Residential Sales': {
    LEAD: [
      { id: 'r1', name: 'Jessica Miller', address: '123 Business Way', value: '$1.2M', time: '2 hours ago' },
    ],
    CONTACTED: [
      { id: 'r2', name: 'Robert Chen', address: '456 Tech Lane', value: '$850k', time: 'Yesterday' },
    ],
    SHOWING: [
      { id: 'r3', name: 'David Wilson', address: '789 Garden St', value: '$2.1M', time: '2 days ago' },
    ],
    OFFER: [
      { id: 'r4', name: 'Sarah Connor', address: '101 Cyberdyne Blvd', value: '$3.5M', time: '5 hours ago', expires: 'EXPIRES IN 24H' },
    ],
    CLOSED: [
      { id: 'r5', name: 'Michael Scott', address: '1725 Slough Ave', value: '$450k', time: '3 days ago' },
    ],
  },
  'Commercial Pipeline': {
    LEAD: [
      { id: 'c1', name: 'Dunder Mifflin', address: 'Scranton Business Park', value: '$150k/yr', time: '1 day ago' },
    ],
    CONTACTED: [],
    SHOWING: [
      { id: 'c3', name: 'Gavin Belson', address: 'Hooli HQ', value: '$50M', time: '1 week ago' },
    ],
    OFFER: [
      { id: 'c4', name: 'Vance Refrigeration', address: 'Warehouse 42', value: '$2.5M', time: '3 hours ago', expires: 'EXPIRES IN 24H' },
    ],
    CLOSED: [],
  },
  'Property Rentals': {
    LEAD: [
      { id: 'p1', name: 'Ryan Howard', address: 'City Lofts 404', value: '$2500/mo', time: 'Today' },
    ],
    CONTACTED: [
      { id: 'p2', name: 'Kelly Kapoor', address: 'Downtown Studio', value: '$1800/mo', time: 'Yesterday' },
    ],
    SHOWING: [],
    OFFER: [],
    CLOSED: [],
  },
};

export default function DealsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: screenWidth } = Dimensions.get('window');
  const [activePipeline, setActivePipeline] = useState<(typeof PIPELINE_TABS)[number]>('Residential Sales');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form states
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [selectedProperty, setSelectedProperty] = useState(PROPERTIES[0]);
  const [dealValue, setDealValue] = useState('$ 1,200,000');
  const [targetPipeline, setTargetPipeline] = useState<(typeof PIPELINE_TABS)[number]>('Residential Sales');
  const [selectedStage, setSelectedStage] = useState('Lead');

  // Dropdown visibility states
  const [isContactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [isPropertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [isPipelineDropdownOpen, setPipelineDropdownOpen] = useState(false);
  const [isStageDropdownOpen, setStageDropdownOpen] = useState(false);

  // Stage Management states
  const [isStagesModalVisible, setIsStagesModalVisible] = useState(false);
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [newStageInput, setNewStageInput] = useState('');

  const handleAddStage = () => {
    if (newStageInput.trim()) {
      setStages([...stages, newStageInput.trim().toUpperCase()]);
      setNewStageInput('');
    }
  };

  const handleRemoveStage = (stageToRemove: string) => {
    setStages(prev => prev.filter(s => s !== stageToRemove));
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

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleValueChange = (text: string) => {
    setDealValue(formatCurrency(text));
  };

  const renderDealCard = (deal: Deal, isWide = false) => (
    <View key={deal.id} style={[styles.dealCard, isWide && styles.dealCardWide]}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardTitles}>
          <Text style={styles.dealCardName}>{deal.name}</Text>
          <Text style={styles.dealCardAddress}>{deal.address}</Text>
        </View>
      </View>

      <View style={styles.cardValueRow}>
        <Text style={styles.dealCardValue}>{deal.value}</Text>
        <Text style={styles.dealCardTime}>{deal.time}</Text>
      </View>

      {deal.expires && (
        <View style={styles.expiresBadge}>
          <MaterialCommunityIcons name="alert-outline" size={14} color="#EF4444" />
          <Text style={styles.expiresText}>{deal.expires}</Text>
        </View>
      )}
    </View>
  );

  const renderStage = (stage: string, isFullWidth = false) => {
    const deals = DEALS_DATA[activePipeline][stage] || [];
    return (
      <View key={stage} style={[styles.stageContainer, isFullWidth && styles.stageContainerFull]}>
        <View style={styles.stageHeader}>
          <Text style={styles.stageTitle}>{stage}</Text>
          <View style={styles.countIndicator}>
            <Text style={styles.countText}>{deals.length}</Text>
          </View>
        </View>
        <View style={styles.stageCards}>
          {deals.length > 0 ? (
            deals.map(deal => renderDealCard(deal, isFullWidth))
          ) : (
            <View style={styles.emptyPlaceholder}>
              <Text style={styles.emptyPlaceholderText}>Drag deal here</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageHeader
        title="Deals"
        subtitle="Manage your deals from lead to closing with zero manual effort."
        onBack={() => router.back()}
        rightIcon="plus"
        onRightPress={() => setIsModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.mainScroll, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Tabs and Filters */}
        <View style={styles.topActions}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsList}
            style={styles.tabsScroll}
          >
            {PIPELINE_TABS.map((tab) => {
              const isActive = activePipeline === tab;
              return (
                <Pressable
                  key={tab}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActivePipeline(tab)}
                >
                  <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.filterBtnsRow}>
            <Pressable style={styles.filterBtn} onPress={() => setIsStagesModalVisible(true)}>
              <MaterialCommunityIcons name="tune-variant" size={18} color="#0B2D3E" />
              <Text style={styles.filterBtnText}>Stages</Text>
            </Pressable>
            <Pressable style={styles.filterBtn} onPress={() => setIsAutoTriggerModalVisible(true)}>
              <MaterialCommunityIcons name="lightning-bolt-outline" size={18} color="#0B2D3E" />
              <Text style={styles.filterBtnText}>Auto-Triggers</Text>
            </Pressable>
          </View>
        </View>

        {/* Top Stages - Grid-like or Side-by-Side */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topStagesScroll}
        >
          {stages.slice(0, 4).map(stage => renderStage(stage))}
        </ScrollView>

        {/* Bottom Stage - Full Width */}
        <View style={styles.bottomStagesSection}>
          {stages.slice(4).map(stage => renderStage(stage, true))}
        </View>
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
              <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
            </Pressable>
          </View>

          <View style={styles.addStageInputRow}>
            <TextInput
              style={styles.newStageTextInput}
              placeholder="New stage name..."
              placeholderTextColor="#94A3B8"
              value={newStageInput}
              onChangeText={setNewStageInput}
            />
            <Pressable style={styles.addStageSubmitBtn} onPress={handleAddStage}>
              <Text style={styles.addStageSubmitBtnText}>Add</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {stages.map((stage) => (
              <View key={stage} style={styles.stageManagementItem}>
                <Text style={styles.stageManagementName}>
                  {stage.charAt(0) + stage.slice(1).toLowerCase()}
                </Text>
                <Pressable onPress={() => handleRemoveStage(stage)}>
                  <MaterialCommunityIcons name="close" size={20} color="#EF4444" />
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
              onPress={() => setIsModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Primary Contact */}
            <View style={[styles.inputGroup, { zIndex: 100 }]}>
              <Text style={styles.inputLabel}>Primary Contact</Text>
              <Pressable
                style={styles.dropdownTrigger}
                onPress={() => {
                  setPropertyDropdownOpen(false);
                  setPipelineDropdownOpen(false);
                  setStageDropdownOpen(false);
                  setContactDropdownOpen(!isContactDropdownOpen);
                }}
              >
                <Text style={styles.dropdownValue}>{selectedContact}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
              </Pressable>
              {isContactDropdownOpen && (
                <View style={styles.formDropdownMenu}>
                  {CONTACTS.map((opt) => (
                    <Pressable
                      key={opt}
                      style={styles.formDropdownItem}
                      onPress={() => {
                        setSelectedContact(opt);
                        setContactDropdownOpen(false);
                      }}
                    >
                      {selectedContact === opt && (
                        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                      )}
                      <Text style={[styles.formDropdownItemText, selectedContact === opt && { fontWeight: '700' }]}>{opt}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Related Property */}
            <View style={[styles.inputGroup, { zIndex: 90 }]}>
              <Text style={styles.inputLabel}>Related Property</Text>
              <Pressable
                style={styles.dropdownTrigger}
                onPress={() => {
                  setContactDropdownOpen(false);
                  setPipelineDropdownOpen(false);
                  setStageDropdownOpen(false);
                  setPropertyDropdownOpen(!isPropertyDropdownOpen);
                }}
              >
                <Text style={styles.dropdownValue}>{selectedProperty}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
              </Pressable>
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

            <View style={[styles.rowInputs, { zIndex: 80 }]}>
              {/* Estimated Deal Value */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Estimated Deal Value</Text>
                <View style={styles.valueInputWrapper}>
                  <TextInput
                    style={styles.valueInput}
                    value={dealValue}
                    onChangeText={handleValueChange}
                    keyboardType="numeric"
                    placeholder="$ 0"
                  />
                </View>
              </View>

              <View style={{ width: 16 }} />

              {/* Target Pipeline */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Target Pipeline</Text>
                <Pressable
                  style={styles.dropdownTrigger}
                  onPress={() => {
                    setContactDropdownOpen(false);
                    setPropertyDropdownOpen(false);
                    setStageDropdownOpen(false);
                    setPipelineDropdownOpen(!isPipelineDropdownOpen);
                  }}
                >
                  <Text style={styles.dropdownValue}>{targetPipeline}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {isPipelineDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {PIPELINE_TABS.map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setTargetPipeline(opt);
                          setPipelineDropdownOpen(false);
                        }}
                      >
                        {targetPipeline === opt && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                        )}
                        <Text style={[styles.formDropdownItemText, targetPipeline === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Stage */}
            <View style={[styles.inputGroup, { zIndex: 70 }]}>
              <Text style={styles.inputLabel}>Stage</Text>
              <Pressable
                style={styles.dropdownTrigger}
                onPress={() => {
                  setContactDropdownOpen(false);
                  setPropertyDropdownOpen(false);
                  setPipelineDropdownOpen(false);
                  setStageDropdownOpen(!isStageDropdownOpen);
                }}
              >
                <Text style={styles.dropdownValue}>{selectedStage}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
              </Pressable>
              {isStageDropdownOpen && (
                <View style={styles.formDropdownMenu}>
                  {['Lead', 'Contacted', 'Showing', 'Offer', 'Closed', 'Custom Stage...'].map((opt) => (
                    <Pressable
                      key={opt}
                      style={styles.formDropdownItem}
                      onPress={() => {
                        setSelectedStage(opt);
                        setStageDropdownOpen(false);
                      }}
                    >
                      {selectedStage === opt && (
                        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                      )}
                      <Text style={[styles.formDropdownItemText, selectedStage === opt && { fontWeight: '700' }]}>{opt}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* AI Forecast Section */}
            <View style={styles.aiForecastBox}>
              <View style={styles.aiHeader}>
                <MaterialCommunityIcons name="robot-outline" size={20} color="#0BA0B2" />
                <Text style={styles.aiTitle}>AI Forecast Enabled</Text>
              </View>
              <Text style={styles.aiDescription}>
                Zien predicts a high probability of closing based on historical data for "{selectedContact}" and market demand for selected area.
              </Text>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.createBtn}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.createBtnText}>Create Deal Pipeline</Text>
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
              <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {automations.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.automationCard,
                  item.enabled && styles.automationCardActive
                ]}
              >
                <View style={styles.automationCardMain}>
                  <View style={styles.automationInfo}>
                    <View style={styles.automationTitleRow}>
                      <View style={[styles.statusDot, { backgroundColor: item.enabled ? '#0BA0B2' : '#CBD5E1' }]} />
                      <Text style={styles.automationStageName}>{item.stage}</Text>
                    </View>
                    <View style={styles.automationActionRow}>
                      <Text style={styles.thenText}>Then </Text>
                      <Pressable style={styles.actionSelector}>
                        <Text style={styles.actionText}>{item.action}</Text>
                        <MaterialCommunityIcons name="chevron-down" size={16} color="#0BA0B2" />
                      </Pressable>
                    </View>
                  </View>
                  <Switch
                    value={item.enabled}
                    onValueChange={() => toggleAutomation(item.id)}
                    trackColor={{ false: '#E2E8F0', true: '#0B2D3E' }}
                    thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                    ios_backgroundColor="#E2E8F0"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable
              style={styles.saveSettingsBtn}
              onPress={() => setIsAutoTriggerModalVisible(false)}
            >
              <Text style={styles.saveSettingsBtnText}>Save Settings</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainScroll: {
    paddingTop: 8,
  },
  topActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabsScroll: {
    marginBottom: 16,
  },
  tabsList: {
    gap: 8,
    paddingRight: 20,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  filterBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  topStagesScroll: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  stageContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    width: 280,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stageContainerFull: {
    width: '100%',
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  stageTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: 1,
  },
  countIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  stageCards: {
    gap: 12,
  },
  dealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dealCardWide: {
    // Styling for full width cards if needed
  },
  cardHeaderRow: {
    marginBottom: 16,
  },
  cardTitles: {
    flex: 1,
  },
  dealCardName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.5,
  },
  dealCardAddress: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
  cardValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dealCardValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0BA0B2',
    letterSpacing: -0.5,
  },
  dealCardTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  expiresBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  expiresText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  bottomStagesSection: {
    paddingHorizontal: 20,
    marginTop: 4,
  },
  emptyPlaceholder: {
    height: 100,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  emptyPlaceholderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 12,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 54,
  },
  dropdownValue: {
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '500',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  valueInputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    justifyContent: 'center',
  },
  valueInput: {
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '600',
  },
  aiForecastBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0BA0B2',
    borderStyle: 'dashed',
    padding: 20,
    marginTop: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0BA0B2',
  },
  aiDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 54,
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
  createBtn: {
    flex: 2,
    height: 54,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  formDropdownMenu: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#6A7D8C',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 1000,
  },
  formDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 36,
  },
  formDropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  automationCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  automationCardActive: {
    borderColor: '#0BA0B2',
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
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  automationStageName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  automationActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thenText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  actionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    borderStyle: 'dashed',
    paddingBottom: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0BA0B2',
  },
  saveSettingsBtn: {
    flex: 1,
    height: 54,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveSettingsBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addStageInputRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  newStageTextInput: {
    flex: 1,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '500',
  },
  addStageSubmitBtn: {
    width: 80,
    height: 54,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStageSubmitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stageManagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 12,
  },
  stageManagementName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
});
