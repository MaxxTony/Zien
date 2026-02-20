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
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PIPELINE_TABS = ['Residential Sales', 'Commercial Pipeline', 'Property Rentals'] as const;
const STAGES = ['LEAD', 'CONTACTED', 'SHOWING', 'OFFER', 'CLOSED'] as const;
type Stage = (typeof STAGES)[number];

const DEALS_BY_STAGE: Record<Stage, { id: string; name: string; address: string; value: string; time: string; expires?: boolean }[]> = {
  LEAD: [
    { id: '1', name: 'Jessica Miller', address: '123 Business Way', value: '$1.2M', time: '2 hours ago' },
  ],
  CONTACTED: [
    { id: '2', name: 'Robert Chen', address: '456 Tech Lane', value: '$850k', time: 'Yesterday' },
  ],
  SHOWING: [
    { id: '3', name: 'David Wilson', address: '789 Garden St', value: '$2.1M', time: '2 days ago' },
  ],
  OFFER: [
    { id: '4', name: 'Sarah Connor', address: '101 Cyberdyne Blvd', value: '$3.5M', time: '5 hours ago', expires: true },
  ],
  CLOSED: [
    { id: '5', name: 'Michael Scott', address: '1725 Slough Ave', value: '$450k', time: '3 days ago' },
  ],
};

const STAGE_OPTIONS = ['Lead / Qualification', 'Contacted', 'Showing', 'Offer', 'Closed'] as const;

const AUTO_TRIGGERS = [
  { stage: 'LEAD', action: 'Send Lead Template Email' },
  { stage: 'CONTACTED', action: 'Send Contacted Template Email' },
  { stage: 'SHOWING', action: 'Send Showing Template Email', active: true },
  { stage: 'OFFER', action: 'Send Offer Template Email' },
  { stage: 'CLOSED', action: 'Send Closed Template Email' }
];

const COLUMN_WIDTH = 280;
const CARD_GAP = 12;

export default function DealsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: screenWidth } = Dimensions.get('window');
  const [activePipeline, setActivePipeline] = useState<(typeof PIPELINE_TABS)[number]>('Residential Sales');
  const [newDealModalVisible, setNewDealModalVisible] = useState(false);
  const [primaryContact, setPrimaryContact] = useState('Jessica Miller (C-001)');
  const [relatedProperty, setRelatedProperty] = useState('123 Business Way, Los Angeles');
  const [dealValue, setDealValue] = useState('1,250,000');
  const [initialStage, setInitialStage] = useState<(typeof STAGE_OPTIONS)[number]>('Lead / Qualification');
  const [stageDropdownOpen, setStageDropdownOpen] = useState(false);
  const [autoTriggersModalVisible, setAutoTriggersModalVisible] = useState(false);

  const isNarrow = screenWidth < 400;
  const columnWidth = Math.min(COLUMN_WIDTH, screenWidth - 32);

  const closeNewDealModal = () => {
    setNewDealModalVisible(false);
    setStageDropdownOpen(false);
  };

  const handleCreateDeal = () => {
    closeNewDealModal();
  };

  const useVerticalPipeline = screenWidth < 420;

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          onPress={() => router.back()}
          hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Sales Pipeline</Text>
          <Text style={styles.subtitle}>
            Manage your deals from lead to closing with zero manual effort.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {/* Pipeline type tabs — pill scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsRow, { paddingHorizontal: 16 }]}
          style={styles.tabsScroll}>
          {PIPELINE_TABS.map((tab) => {
            const isActive = activePipeline === tab;
            return (
              <Pressable
                key={tab}
                style={({ pressed }) => [
                  styles.tabChip,
                  isActive && styles.tabChipActive,
                  pressed && (isActive ? styles.tabChipActivePressed : styles.tabChipPressed),
                ]}
                onPress={() => setActivePipeline(tab)}>
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]} numberOfLines={1}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Actions: Auto-Triggers + New Deal — 44pt min touch */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => setAutoTriggersModalVisible(true)}
            style={({ pressed }) => [styles.autoTriggersBtn, pressed && styles.autoTriggersBtnPressed]}>
            <MaterialCommunityIcons name="lightning-bolt-outline" size={20} color="#0B2D3E" />
            <Text style={styles.autoTriggersText}>Auto-Triggers</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.newDealBtn, pressed && styles.newDealBtnPressed]}
            onPress={() => setNewDealModalVisible(true)}>
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.newDealBtnText}>New Deal</Text>
          </Pressable>
        </View>

        {/* Pipeline: vertical on mobile (no truncation), horizontal on larger screens */}
        {useVerticalPipeline ? (
          <View style={styles.verticalPipeline}>
            {STAGES.map((stage) => {
              const deals = DEALS_BY_STAGE[stage];
              return (
                <View key={stage} style={styles.verticalStageSection}>
                  <View style={styles.verticalStageHeader}>
                    <Text style={styles.verticalStageTitle}>{stage}</Text>
                    <View style={styles.columnCount}>
                      <Text style={styles.columnCountText}>{deals.length}</Text>
                    </View>
                  </View>
                  <View style={styles.verticalStageCards}>
                    {deals.map((deal) => (
                      <Pressable
                        key={deal.id}
                        style={({ pressed }) => [styles.dealCard, styles.dealCardVertical, pressed && styles.dealCardPressed]}>
                        <Text style={styles.dealCardName}>{deal.name}</Text>
                        <Text style={styles.dealCardAddress}>{deal.address}</Text>
                        <Text style={styles.dealCardValue}>{deal.value}</Text>
                        <Text style={styles.dealCardTime}>{deal.time}</Text>
                        {deal.expires && (
                          <View style={styles.dealCardExpires}>
                            <Text style={styles.dealCardExpiresText}>▲ EXPIRES IN 24H</Text>
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.kanbanContent, { paddingLeft: 16, paddingRight: 32, paddingBottom: 16 }]}
            decelerationRate="fast"
            snapToInterval={columnWidth + CARD_GAP}
            snapToAlignment="start">
            {STAGES.map((stage) => {
              const deals = DEALS_BY_STAGE[stage];
              return (
                <View key={stage} style={[styles.kanbanColumn, { width: columnWidth }]}>
                  <View style={styles.columnHeader}>
                    <Text style={styles.columnTitle}>{stage}</Text>
                    <View style={styles.columnCount}>
                      <Text style={styles.columnCountText}>{deals.length}</Text>
                    </View>
                  </View>
                  <ScrollView
                    style={styles.columnScroll}
                    contentContainerStyle={styles.columnScrollContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled>
                    {deals.map((deal) => (
                      <Pressable
                        key={deal.id}
                        style={({ pressed }) => [styles.dealCard, pressed && styles.dealCardPressed]}>
                        <Text style={styles.dealCardName}>{deal.name}</Text>
                        <Text style={styles.dealCardAddress}>{deal.address}</Text>
                        <Text style={styles.dealCardValue}>{deal.value}</Text>
                        <Text style={styles.dealCardTime}>{deal.time}</Text>
                        {deal.expires && (
                          <View style={styles.dealCardExpires}>
                            <Text style={styles.dealCardExpiresText}>▲ EXPIRES IN 24H</Text>
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              );
            })}
          </ScrollView>
        )}
      </ScrollView>

      {/* Initialize New Deal Modal — mobile-friendly full/sheet */}
      <Modal
        visible={newDealModalVisible}
        transparent
        animationType={isNarrow ? 'slide' : 'fade'}
        onRequestClose={closeNewDealModal}>
        <Pressable style={[styles.modalBackdrop, isNarrow && styles.modalBackdropSheet]} onPress={closeNewDealModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={[styles.modalWrap, isNarrow && styles.modalWrapSheet]}
            pointerEvents="box-none">
            <Pressable style={[styles.modalCard, isNarrow && styles.modalCardSheet]} onPress={(e) => e.stopPropagation()}>
              {isNarrow && <View style={styles.modalHandle} />}
              <View style={[styles.modalHeader, isNarrow && styles.modalHeaderSheet]}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>Initialize New Deal</Text>
                  <Text style={styles.modalSubtitle}>
                    Bridge the gap between lead capture and closing.
                  </Text>
                </View>
                <Pressable
                  onPress={closeNewDealModal}
                  style={({ pressed }) => [styles.modalCloseBtn, pressed && { opacity: 0.8 }]}
                  hitSlop={12}>
                  <MaterialCommunityIcons name="close" size={22} color="#0B2D3E" />
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalBody}
                contentContainerStyle={[styles.modalBodyContent, { paddingBottom: insets.bottom + 28 }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Primary Contact</Text>
                  <Pressable style={styles.modalSelect}>
                    <Text style={styles.modalSelectText} numberOfLines={1}>{primaryContact}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                  </Pressable>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Related Property</Text>
                  <Pressable style={styles.modalSelect}>
                    <Text style={styles.modalSelectText} numberOfLines={1}>{relatedProperty}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                  </Pressable>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Estimated Deal Value</Text>
                  <View style={styles.modalInputRow}>
                    <Text style={styles.modalInputPrefix}>$</Text>
                    <TextInput
                      style={styles.modalInputWithPrefix}
                      value={dealValue}
                      onChangeText={setDealValue}
                      placeholder="1,250,000"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Initial Pipeline Stage</Text>
                  <Pressable
                    style={styles.modalSelect}
                    onPress={() => setStageDropdownOpen((v) => !v)}>
                    <Text style={styles.modalSelectText}>{initialStage}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                  </Pressable>
                  {stageDropdownOpen && (
                    <View style={styles.modalDropdown}>
                      {STAGE_OPTIONS.map((opt) => (
                        <Pressable
                          key={opt}
                          style={styles.modalDropdownItem}
                          onPress={() => {
                            setInitialStage(opt);
                            setStageDropdownOpen(false);
                          }}>
                          <Text style={styles.modalDropdownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.modalActions}>
                  <Pressable style={styles.modalCancelBtn} onPress={closeNewDealModal}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.modalCreateBtn} onPress={handleCreateDeal}>
                    <Text style={styles.modalCreateText}>Create Deal Pipeline</Text>
                  </Pressable>
                </View>

                <View style={styles.aiForecast}>
                  <MaterialCommunityIcons name="robot-outline" size={24} color="#0BA0B2" />
                  <View style={styles.aiForecastText}>
                    <Text style={styles.aiForecastTitle}>AI Forecast Enabled</Text>
                    <Text style={styles.aiForecastDesc}>
                      Based on Jessica's heat index (85) and the property's demand, Zien AI predicts a 72% probability of closing within 45 days.
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* Auto-Triggers Modal */}
      <Modal
        visible={autoTriggersModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAutoTriggersModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setAutoTriggersModalVisible(false)}>
          <Pressable style={styles.triggerModalWrap} onPress={(e) => e.stopPropagation()}>
            <View style={styles.triggerModalHeader}>
              <Text style={styles.triggerModalTitle}>Pipeline Automation Triggers</Text>
              <Text style={styles.triggerModalSubtitle}>Configure automated actions when a deal enters a specific stage.</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.triggerModalList}>
              {AUTO_TRIGGERS.map((item) => (
                <View key={item.stage} style={styles.triggerCard}>
                  <View style={styles.triggerCardInfo}>
                    <Text style={styles.triggerCardStage}>WHEN ENTERING: {item.stage}</Text>
                    <Text style={styles.triggerCardAction}>Action: {item.action}</Text>
                  </View>
                  <Pressable style={[styles.triggerConfigureBtn, item.active && styles.triggerConfigureBtnActive]}>
                    <Text style={styles.triggerConfigureText}>Configure</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>

            <View style={styles.triggerModalFooter}>
              <Pressable style={styles.triggerSaveBtn} onPress={() => setAutoTriggersModalVisible(false)}>
                <Text style={styles.triggerSaveBtnText}>Save Configuration</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
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
  backBtnPressed: { opacity: 0.85 },
  headerCenter: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 18,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  tabsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tabsScroll: { marginHorizontal: -16 },
  tabChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.9)',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tabChipActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  tabChipPressed: { opacity: 0.9 },
  tabChipActivePressed: { opacity: 0.9 },
  tabChipText: { fontSize: 14, fontWeight: '700', color: '#5B6B7A' },
  tabChipTextActive: { color: '#FFFFFF' },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  autoTriggersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.9)',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  autoTriggersBtnPressed: { opacity: 0.9 },
  autoTriggersText: { fontSize: 15, fontWeight: '700', color: '#0B2D3E' },
  newDealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  newDealBtnPressed: { opacity: 0.92 },
  newDealBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  verticalPipeline: { gap: 20, paddingBottom: 8 },
  verticalStageSection: {
    backgroundColor: '#F5F7FA',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  verticalStageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(11, 45, 62, 0.08)',
  },
  verticalStageTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.8,
  },
  verticalStageCards: { padding: 12, paddingBottom: 4 },
  dealCardVertical: { marginBottom: 12 },
  kanbanContent: { flexDirection: 'row', gap: CARD_GAP },
  kanbanColumn: {
    backgroundColor: '#F5F7FA',
    borderRadius: 18,
    overflow: 'hidden',
    maxHeight: 440,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(11, 45, 62, 0.08)',
  },
  columnTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.8,
  },
  columnCount: {
    backgroundColor: 'rgba(11, 45, 62, 0.08)',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnCountText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },
  columnScroll: { flex: 1 },
  columnScrollContent: { padding: 12, paddingBottom: 20 },
  dealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  dealCardPressed: { opacity: 0.96 },
  dealCardName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.2,
  },
  dealCardAddress: {
    fontSize: 13,
    color: '#5B6B7A',
    marginTop: 6,
    fontWeight: '500',
  },
  dealCardValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0BA0B2',
    letterSpacing: -0.2,
    marginTop: 12,
  },
  dealCardTime: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 6,
  },
  dealCardExpires: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#DC2626',
  },
  dealCardExpiresText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Modal — pro mobile
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdropSheet: {
    justifyContent: 'flex-end',
    padding: 0,
  },
  modalWrap: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
  },
  modalWrapSheet: {
    maxHeight: '92%',
    width: '100%',
    maxWidth: '100%',
  },
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
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 20,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: { maxHeight: 540 },
  modalBodyContent: { paddingHorizontal: 22, paddingTop: 20 },
  modalField: { marginBottom: 18 },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  modalSelect: {
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
  modalSelectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B2D3E',
    flex: 1,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingLeft: 16,
  },
  modalInputPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B6B7A',
    marginRight: 6,
  },
  modalInputWithPrefix: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    fontSize: 16,
    color: '#0B2D3E',
    fontWeight: '600',
  },
  modalDropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modalDropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  modalDropdownItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
    paddingTop: 20,
  },
  modalCancelBtn: {
    flex: .5,
    minHeight: 52,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  modalCreateBtn: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 14,
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
  modalCreateText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  aiForecast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(11, 160, 178, 0.35)',
    backgroundColor: 'rgba(11, 160, 178, 0.06)',
  },
  aiForecastText: { flex: 1, minWidth: 0 },
  aiForecastTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  aiForecastDesc: {
    fontSize: 14,
    color: '#5B6B7A',
    lineHeight: 21,
    fontWeight: '500',
  },

  // Trigger Modal Styles
  triggerModalWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  triggerModalHeader: {
    padding: 24,
    paddingBottom: 24,
  },
  triggerModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  triggerModalSubtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    lineHeight: 20,
  },
  triggerModalList: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 16,
  },
  triggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  triggerCardInfo: { flex: 1, paddingRight: 12 },
  triggerCardStage: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 4,
  },
  triggerCardAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0BA0B2',
  },
  triggerConfigureBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  triggerConfigureBtnActive: {
    borderColor: '#0056D2',
    borderWidth: 1.5,
  },
  triggerConfigureText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  triggerModalFooter: {
    padding: 24,
  },
  triggerSaveBtn: {
    backgroundColor: '#0B2D3E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
