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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUMMARY_CARDS = [
  { id: 'new', label: 'NEW', count: 2 },
  { id: 'qualified', label: 'QUALIFIED', count: 1 },
  { id: 'unqualified', label: 'UNQUALIFIED', count: 1 },
  { id: 'archived', label: 'ARCHIVED', count: 0 },
];

type LeadStatus = 'NEW' | 'QUALIFIED' | 'UNQUALIFIED';

const INITIAL_LEADS = [
  { id: '1', name: 'Jessica Miller', status: 'NEW' as LeadStatus, source: 'Open House', date: 'Today', score: 94, isHot: true, isConverted: false },
  { id: '2', name: 'Robert Chen', status: 'QUALIFIED' as LeadStatus, source: 'Website', date: 'Yesterday', score: 82, isHot: true, isConverted: false },
  { id: '3', name: 'David Wilson', status: 'UNQUALIFIED' as LeadStatus, source: 'Manual', date: '2 days ago', score: 25, isHot: false, isConverted: false },
  { id: '4', name: 'Sarah Connor', status: 'NEW' as LeadStatus, source: 'Referral', date: '3 days ago', score: 88, isHot: true, isConverted: false },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'NEW': return { bg: '#FFE4E6', text: '#E11D48' };
    case 'QUALIFIED': return { bg: '#E0F2FE', text: '#0284C7' };
    case 'UNQUALIFIED': return { bg: '#F1F5F9', text: '#475569' };
    default: return { bg: '#F1F5F9', text: '#475569' };
  }
};

function LeadCard({ lead, onDeletePress, onConvertPress }: { lead: (typeof INITIAL_LEADS)[number], onDeletePress: () => void, onConvertPress: () => void }) {
  const [isArchived, setIsArchived] = useState(false);
  const isHigh = lead.score >= 80;
  const isLow = lead.score < 50;
  const statusColors = getStatusStyle(lead.status);

  if (lead.isConverted) {
    return (
      <View style={styles.leadCard}>
        <View style={styles.leadCardTop}>
          <View style={[styles.leadCardIconWrap, styles.leadCardIconWrapNormal]}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#0B2D3E" />
          </View>
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: '#F3F6F8' }]}>
              <Text style={[styles.tagText, { color: '#0B2D3E' }]}>CONVERTED</Text>
            </View>
          </View>
        </View>

        <Text style={styles.leadCardName}>{lead.name}</Text>
        <Text style={styles.leadCardSource}>{lead.source} • {lead.date}</Text>

        <View style={styles.leadCardScoreRow}>
          <Text style={styles.leadCardScoreLabel}>AI Lead Score</Text>
          <Text style={[
            styles.leadCardScoreValue,
            isHigh ? { color: '#0BA0B2' } : isLow ? { color: '#E11D48' } : { color: '#0B2D3E' }
          ]}>
            {lead.score}/100
          </Text>
        </View>

        <View style={styles.convertedStateContainer}>
          <Text style={styles.convertedStateText}>Converted to Contact</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.leadCard, lead.isHot && styles.leadCardHotBorder]}>
      <View style={styles.leadCardTop}>
        <View style={[styles.leadCardIconWrap, lead.isHot ? styles.leadCardIconWrapHot : styles.leadCardIconWrapNormal]}>
          <MaterialCommunityIcons
            name={lead.isHot ? "fire" : "account-outline"}
            size={24}
            color={lead.isHot ? "#FF6B00" : "#5B6B7A"}
          />
        </View>
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: isArchived ? '#F3F6F8' : statusColors.bg }]}>
            <Text style={[styles.tagText, { color: isArchived ? '#0B2D3E' : statusColors.text }]}>
              {isArchived ? 'ARCHIVED' : lead.status}
            </Text>
          </View>
          {lead.isHot && (
            <View style={[styles.tag, styles.tagHot]}>
              <Text style={[styles.tagText, styles.tagTextHot]}>HOT LEAD</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.leadCardName}>{lead.name}</Text>
      <Text style={styles.leadCardSource}>{lead.source} • {lead.date}</Text>

      <View style={styles.leadCardScoreRow}>
        <Text style={styles.leadCardScoreLabel}>AI Lead Score</Text>
        <Text style={[
          styles.leadCardScoreValue,
          isHigh ? { color: '#0BA0B2' } : isLow ? { color: '#E11D48' } : { color: '#0B2D3E' }
        ]}>
          {lead.score}/100
        </Text>
      </View>

      {isArchived ? (
        <View style={styles.archivedStateContainer}>
          <Text style={styles.archivedStateText}>Archived</Text>
        </View>
      ) : (
        <View style={styles.leadCardActions}>
          <Pressable style={styles.leadCardConvertBtn} onPress={onConvertPress}>
            <Text style={styles.leadCardConvertText}>Convert</Text>
          </Pressable>
          <Pressable style={styles.leadCardArchiveBtn} onPress={() => setIsArchived(true)}>
            <Text style={styles.leadCardArchiveText}>Archive</Text>
          </Pressable>
          <Pressable style={styles.leadCardDeleteBtn} onPress={onDeletePress}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#E11D48" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function LeadsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [leadsList, setLeadsList] = useState(INITIAL_LEADS);
  const [isImportModalVisible, setImportModalVisible] = useState(false);
  const [isHotFilterActive, setHotFilterActive] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<typeof INITIAL_LEADS[number] | null>(null);

  const filteredLeads = isHotFilterActive ? leadsList.filter(l => l.isHot) : leadsList;

  const confirmDelete = () => {
    if (leadToDelete) {
      setLeadsList(prev => prev.filter(l => l.id !== leadToDelete));
      setLeadToDelete(null);
    }
  };

  const confirmConvert = () => {
    if (leadToConvert) {
      setLeadsList(prev => prev.map(l => l.id === leadToConvert.id ? { ...l, isConverted: true } : l));
      setLeadToConvert(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium subtle background */}
      <LinearGradient
        colors={['#F4F7F9', '#FFFFFF', '#F4F7F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header slightly padded down */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Leads</Text>
          <Text style={styles.subtitle}>
            Incoming inquiries and potential opportunities.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>

        {/* Actions Row: Search + Import */}
        <View style={styles.actionRow}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#8DA4B5" />
            <TextInput
              placeholder="Find leads by name..."
              placeholderTextColor="#8DA4B5"
              style={styles.searchInput}
            />
          </View>
          <Pressable style={styles.movedImportBtn} onPress={() => setImportModalVisible(true)}>
            <MaterialCommunityIcons name="cloud-upload" size={18} color="#FFFFFF" />
            <Text style={styles.movedImportBtnText}>Import</Text>
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          <Pressable style={styles.filterDropdown}>
            <MaterialCommunityIcons name="filter-variant" size={16} color="#0B2D3E" style={{ marginRight: 6 }} />
            <Text style={styles.filterText}>All Status</Text>
            <MaterialCommunityIcons name="chevron-down" size={18} color="#0B2D3E" style={{ marginLeft: 4 }} />
          </Pressable>
          <Pressable
            style={[styles.hotFilterBtn, isHotFilterActive && styles.hotFilterBtnActive]}
            onPress={() => setHotFilterActive(!isHotFilterActive)}
          >
            <MaterialCommunityIcons name="fire" size={16} color="#FF6B00" style={{ marginRight: 4 }} />
            <Text style={styles.hotFilterText}>Hot Leads</Text>
          </Pressable>
          {isHotFilterActive && (
            <Pressable style={styles.clearFilterBtn} onPress={() => setHotFilterActive(false)}>
              <MaterialCommunityIcons name="close" size={14} color="#6A7D8C" style={{ marginRight: 4 }} />
              <Text style={styles.clearFilterText}>Clear</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryCarousel}
        >
          {SUMMARY_CARDS.map((card) => (
            <View key={card.id} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{card.label}</Text>
              <Text style={styles.summaryCount}>{card.count}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionTitle}>
            Showing {filteredLeads.length} leads {isHotFilterActive && `(filtered from ${leadsList.length})`}
          </Text>
        </View>

        <View style={styles.leadList}>
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onDeletePress={() => setLeadToDelete(lead.id)}
              onConvertPress={() => setLeadToConvert(lead)}
            />
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={isImportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setImportModalVisible(false)}
        >
          <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Import Leads</Text>
                <Text style={styles.modalSubtitle}>Upload CSV or Excel files to bulk add leads to your pipeline.</Text>
              </View>
              <Pressable onPress={() => setImportModalVisible(false)} hitSlop={10}>
                <MaterialCommunityIcons name="close" size={24} color="#0B2D3E" />
              </Pressable>
            </View>

            <View style={styles.modalDashedArea}>
              <View style={styles.modalIconCircle}>
                <MaterialCommunityIcons name="tray-arrow-up" size={28} color="#0B2D3E" />
              </View>
              <Text style={styles.modalDragText}>Drag & Drop file here</Text>
              <Text style={styles.modalBrowseText}>or click to browse from your computer</Text>

              <Pressable style={styles.modalSelectBtn}>
                <Text style={styles.modalSelectBtnText}>Select File</Text>
              </Pressable>

              <Text style={styles.modalSupportText}>Supported formats: .CSV, .XLSX</Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={!!leadToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setLeadToDelete(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLeadToDelete(null)}>
          <Pressable style={[styles.modalContainer, { padding: 32 }]} onPress={e => e.stopPropagation()}>
            <View style={styles.modalDeleteIconCircle}>
              <MaterialCommunityIcons name="alert-outline" size={32} color="#000000" />
            </View>
            <Text style={styles.modalDeleteTitle}>Erase Opportunity?</Text>
            <Text style={styles.modalDeleteSubtitle}>
              This lead and its AI scoring history will be{'\n'}deleted. This action cannot be undone.
            </Text>
            <View style={styles.modalDeleteActions}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setLeadToDelete(null)}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalDeleteConfirmBtn} onPress={confirmDelete}>
                <Text style={styles.modalDeleteConfirmBtnText}>Delete Lead</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={!!leadToConvert}
        transparent
        animationType="fade"
        onRequestClose={() => setLeadToConvert(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLeadToConvert(null)}>
          <Pressable style={styles.convertModalContainer} onPress={e => e.stopPropagation()}>
            <View style={styles.convertModalHeader}>
              <Text style={styles.convertModalTitle}>Convert Lead to Contact</Text>
              <Pressable style={styles.convertModalCloseIcon} onPress={() => setLeadToConvert(null)}>
                <MaterialCommunityIcons name="close" size={16} color="#0B2D3E" />
              </Pressable>
            </View>

            <View style={styles.convertRow}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>First Name</Text>
                <TextInput style={styles.convertInput} defaultValue={leadToConvert?.name.split(' ')[0]} />
              </View>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Last Name</Text>
                <TextInput style={styles.convertInput} defaultValue={leadToConvert?.name.split(' ').slice(1).join(' ')} />
              </View>
            </View>

            <View style={styles.convertRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.convertLabel}>Email</Text>
                <TextInput style={styles.convertInput} placeholder="Enter email address..." placeholderTextColor="#8DA4B5" />
              </View>
            </View>

            <View style={styles.convertRow}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Phone</Text>
                <TextInput style={styles.convertInput} placeholder="+1..." placeholderTextColor="#8DA4B5" />
              </View>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Type</Text>
                <View style={styles.convertDropdown}>
                  <Text style={styles.convertDropdownText}>Buyer</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </View>
              </View>
            </View>

            <View style={styles.convertRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.convertLabel}>Lead Source</Text>
                <TextInput style={[styles.convertInput, styles.convertInputDisabled]} value={leadToConvert?.source} editable={false} />
              </View>
            </View>

            <View style={styles.convertRow}>
              <View style={[styles.convertCol, { flex: 1.5 }]}>
                <Text style={styles.convertLabel}>Custom Tag</Text>
                <TextInput style={styles.convertInput} placeholder="e.g. VIP, Priority..." placeholderTextColor="#8DA4B5" />
              </View>

            </View>
            <View style={[styles.convertCol, { flex: 1, marginBottom: 16 }]}>
              <Text style={styles.convertLabel}>Tag Color</Text>
              <View style={styles.tagColorRow}>
                <View style={[styles.tagColorCircle, { backgroundColor: '#0BA0B2' }]} />
                <View style={[styles.tagColorCircleOuter, { borderColor: '#0284C7' }]}>
                  <View style={[styles.tagColorCircle, { backgroundColor: '#FF6B00' }]} />
                </View>
                <View style={[styles.tagColorCircle, { backgroundColor: '#0B2D3E' }]} />
                <View style={[styles.tagColorCircle, { backgroundColor: '#6366F1' }]} />
                <View style={[styles.tagColorCircle, { backgroundColor: '#10B981' }]} />
                <View style={[styles.tagColorCircle, { backgroundColor: '#64748B' }]} />
              </View>
            </View>

            <View style={styles.convertActions}>
              <Pressable style={styles.convertCancelBtn} onPress={() => setLeadToConvert(null)}>
                <Text style={styles.convertCancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.convertConfirmBtn} onPress={confirmConvert}>
                <Text style={styles.convertConfirmBtnText}>Finalize Conversion</Text>
              </Pressable>
            </View>

          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerCenter: { flex: 1, minWidth: 0 },
  title: { fontSize: 26, fontWeight: '800', color: '#0B2D3E', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#6A7D8C', fontWeight: '500', marginTop: 2 },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 10 },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '500',
  },
  movedImportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  movedImportBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 20,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  hotFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FFE0CC',
    borderRadius: 20,
  },
  hotFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B00',
  },
  hotFilterBtnActive: {
    borderColor: '#0284C7',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6A7D8C',
  },

  summaryCarousel: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    width: 140,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#8DA4B5', letterSpacing: 0.8, marginBottom: 8 },
  summaryCount: { fontSize: 32, fontWeight: '800', color: '#0B2D3E' },

  listHeaderRow: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6A7D8C',
  },
  leadList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
  },
  leadCardHotBorder: {
    borderColor: '#FF6B00',
    borderWidth: 1.5,
  },
  leadCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  leadCardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardIconWrapNormal: {
    backgroundColor: '#F3F6F8',
  },
  leadCardIconWrapHot: {
    backgroundColor: '#FFF0E6',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagHot: {
    backgroundColor: '#FF6B00',
  },
  tagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  tagTextHot: { color: '#FFFFFF' },

  leadCardName: { fontSize: 18, fontWeight: '800', color: '#0B2D3E', marginBottom: 4 },
  leadCardSource: { fontSize: 13, color: '#6A7D8C', fontWeight: '500' },

  leadCardScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F7',
  },
  leadCardScoreLabel: { fontSize: 13, fontWeight: '600', color: '#6A7D8C' },
  leadCardScoreValue: { fontSize: 16, fontWeight: '800' },

  leadCardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  leadCardConvertBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardConvertText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  leadCardArchiveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardArchiveText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  leadCardDeleteBtn: {
    width: 48,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.5 },
  modalSubtitle: { fontSize: 13, color: '#6A7D8C', fontWeight: '500', marginTop: 6, maxWidth: '90%' },
  modalDashedArea: {
    borderWidth: 1.5,
    borderColor: '#EAEFF3',
    borderStyle: 'dashed',
    borderRadius: 20,
    backgroundColor: '#FAFCFD',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalDragText: { fontSize: 16, fontWeight: '800', color: '#0B2D3E', marginBottom: 4 },
  modalBrowseText: { fontSize: 13, color: '#6A7D8C', fontWeight: '500', marginBottom: 24 },
  modalSelectBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 24,
  },
  modalSelectBtnText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  modalSupportText: { fontSize: 12, color: '#8DA4B5', fontWeight: '500' },
  modalDeleteIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalDeleteTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  modalDeleteSubtitle: {
    fontSize: 14,
    color: '#6A7D8C',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  modalDeleteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  modalDeleteConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#DE3B49',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  archivedStateContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  archivedStateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8DA4B5',
  },
  convertedStateContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  convertedStateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0BA0B2',
  },
  convertModalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  convertModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  convertModalTitle: { fontSize: 24, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.5 },
  convertModalCloseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  convertCol: {
    flex: 1,
  },
  convertLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  convertInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#0B2D3E',
    backgroundColor: '#FFFFFF',
  },
  convertInputDisabled: {
    backgroundColor: '#FAFCFD',
    color: '#6A7D8C',
  },
  convertDropdown: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  convertDropdownText: {
    fontSize: 14,
    color: '#0B2D3E',
  },
  tagColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
  },
  tagColorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  tagColorCircleOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  convertCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  convertCancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  convertConfirmBtn: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertConfirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
