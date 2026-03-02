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
  { id: '1', name: 'Jessica Miller', status: 'NEW' as LeadStatus, source: 'Open House', date: 'Today', score: 94, isHot: true, isConverted: false, isArchived: false },
  { id: '2', name: 'Robert Chen', status: 'QUALIFIED' as LeadStatus, source: 'Website', date: 'Yesterday', score: 82, isHot: true, isConverted: false, isArchived: false },
  { id: '3', name: 'David Wilson', status: 'UNQUALIFIED' as LeadStatus, source: 'Manual', date: '2 days ago', score: 25, isHot: false, isConverted: false, isArchived: false },
  { id: '4', name: 'Sarah Connor', status: 'NEW' as LeadStatus, source: 'Referral', date: '3 days ago', score: 88, isHot: true, isConverted: false, isArchived: false },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'NEW': return { bg: '#FFE4E6', text: '#E11D48' };
    case 'QUALIFIED': return { bg: '#E0F2FE', text: '#0284C7' };
    case 'UNQUALIFIED': return { bg: '#F1F5F9', text: '#475569' };
    default: return { bg: '#F1F5F9', text: '#475569' };
  }
};

function LeadCard({ lead, onDeletePress, onConvertPress, onToggleArchive, onEditPress }: { lead: (typeof INITIAL_LEADS)[number], onDeletePress: () => void, onConvertPress: () => void, onToggleArchive: () => void, onEditPress: () => void }) {
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
        <View style={styles.leadCardIconWrap}>
          {lead.isHot ? (
            <MaterialCommunityIcons name="fire" size={24} color="#FF6B00" />
          ) : (
            <MaterialCommunityIcons name="account-outline" size={24} color="#5B6B7A" />
          )}
        </View>
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: lead.isArchived ? '#F3F6F8' : statusColors.bg }]}>
            <Text style={[styles.tagText, { color: lead.isArchived ? '#0B2D3E' : statusColors.text }]}>
              {lead.isArchived ? 'ARCHIVED' : lead.status}
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

      {lead.isArchived ? (
        <View style={[styles.leadCardActions, { gap: 8 }]}>
          <Pressable style={styles.leadCardConvertBtn} onPress={onToggleArchive}>
            <Text style={styles.leadCardConvertText}>Unarchive</Text>
          </Pressable>
          <Pressable style={styles.leadCardDeleteBtnArchived} onPress={onDeletePress}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#0B2D3E" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.leadCardActions}>
          <Pressable style={styles.leadCardConvertBtn} onPress={onConvertPress}>
            <Text style={styles.leadCardConvertText}>Convert</Text>
          </Pressable>
          <Pressable style={styles.leadCardArchiveBtn} onPress={onToggleArchive}>
            <Text style={styles.leadCardArchiveText}>Archive</Text>
          </Pressable>
          <Pressable style={styles.leadCardEditBtn} onPress={onEditPress}>
            <MaterialCommunityIcons name="pencil-outline" size={18} color="#6A7D8C" />
          </Pressable>
          <Pressable style={styles.leadCardDeleteBtn} onPress={onDeletePress}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#E11D48" />
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
  const [importInstructions, setImportInstructions] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [isHotFilterActive, setHotFilterActive] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<typeof INITIAL_LEADS[number] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [convertGroupDropdownOpen, setConvertGroupDropdownOpen] = useState(false);
  const [convertTagDropdownOpen, setConvertTagDropdownOpen] = useState(false);
  const [convertGroup, setConvertGroup] = useState('Buyer');
  const [convertTag, setConvertTag] = useState('Hot');
  const [convertColor, setConvertColor] = useState('#FF6B00');
  const [leadToEdit, setLeadToEdit] = useState<typeof INITIAL_LEADS[number] | null>(null);
  const [editSourceDropdownOpen, setEditSourceDropdownOpen] = useState(false);
  const [editStatusDropdownOpen, setEditStatusDropdownOpen] = useState(false);
  const [editGroupDropdownOpen, setEditGroupDropdownOpen] = useState(false);
  const [editTagDropdownOpen, setEditTagDropdownOpen] = useState(false);
  const [editGroup, setEditGroup] = useState('Buyer');
  const [editTag, setEditTag] = useState('Lead');
  const [editSource, setEditSource] = useState('Manual Entry');
  const [editStatus, setEditStatus] = useState('Unqualified');
  const [editColor, setEditColor] = useState('#0BA0B2');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  let filteredLeads = leadsList;
  if (isHotFilterActive) {
    filteredLeads = filteredLeads.filter(l => l.isHot);
  }
  if (selectedStatus !== 'All Status') {
    filteredLeads = filteredLeads.filter(l => {
      if (selectedStatus === 'Converted') return l.isConverted;
      if (selectedStatus === 'Archived') return l.isArchived;
      if (l.isArchived || l.isConverted) return false;
      return l.status === selectedStatus.toUpperCase();
    });
  }

  const toggleArchive = (id: string) => {
    setLeadsList(prev => prev.map(l => l.id === id ? { ...l, isArchived: !l.isArchived } : l));
  };

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
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}>
      <PageHeader
        title="Leads"
        subtitle="Incoming inquiries and potential opportunities."
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>

        {/* Actions Row: Top Buttons */}
        <View style={[styles.topButtonsRow, { zIndex: 20 }]}>
          <View style={{ flex: 1, zIndex: 20 }}>
            <Pressable style={styles.topFilterDropdown} onPress={() => setStatusDropdownOpen(!isStatusDropdownOpen)}>
              <MaterialCommunityIcons name="filter-variant" size={16} color="#0B2D3E" style={{ marginRight: 4 }} />
              <Text style={styles.topFilterText} numberOfLines={1} ellipsizeMode="tail">{selectedStatus === 'All Status' ? 'All' : selectedStatus}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color="#0B2D3E" />
            </Pressable>

            {isStatusDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {['All Status', 'New', 'Qualified', 'Unqualified', 'Archived', 'Converted'].map((status) => (
                  <Pressable
                    key={status}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedStatus(status);
                      setStatusDropdownOpen(false);
                    }}
                  >
                    {selectedStatus === status && (
                      <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                    )}
                    <Text style={[styles.dropdownItemText, selectedStatus === status && { fontWeight: '700' }]}>{status}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <Pressable style={[styles.aiImportBtn, { flex: 1 }]} onPress={() => setImportModalVisible(true)}>
            <MaterialCommunityIcons name="folder-upload-outline" size={18} color="#0B2D3E" />
            <Text style={styles.aiImportBtnText} numberOfLines={1}>AI Import</Text>
          </Pressable>
          <Pressable style={[styles.addLeadBtn, { flex: 1 }]} onPress={() => {
            setLeadToEdit(null);
            setEditGroup('Buyer');
            setEditTag('Lead');
            setEditSource('Manual Entry');
            setEditStatus('New');
            setEditColor('#0BA0B2');
            setIsEditModalVisible(true);
          }}>
            <Text style={styles.addLeadBtnText} numberOfLines={1}>+ Add Lead</Text>
          </Pressable>
        </View>

        <View style={{ zIndex: 10, marginBottom: 20 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.searchFilterRow}
            style={{ overflow: 'visible' }}
          >
            <View style={styles.searchBar}>
              <MaterialCommunityIcons name="magnify" size={20} color="#8DA4B5" />
              <TextInput
                placeholder="Find leads by name, source, or ID..."
                placeholderTextColor="#8DA4B5"
                style={styles.searchInput}
              />
            </View>

            <Pressable
              style={[styles.hotFilterBtn, isHotFilterActive && styles.hotFilterBtnActive]}
              onPress={() => setHotFilterActive(!isHotFilterActive)}
            >
              <MaterialCommunityIcons name="fire" size={16} color={isHotFilterActive ? "#FF6B00" : "#6A7D8C"} style={{ marginRight: 4 }} />
              <Text style={[styles.hotFilterText, isHotFilterActive ? { color: "#FF6B00" } : { color: "#6A7D8C" }]}>Hot Leads</Text>
            </Pressable>
            {isHotFilterActive && (
              <Pressable style={styles.clearFilterBtn} onPress={() => setHotFilterActive(false)}>
                <MaterialCommunityIcons name="close" size={14} color="#6A7D8C" style={{ marginRight: 4 }} />
                <Text style={styles.clearFilterText}>Clear</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryCarousel}
        >
          {[
            { id: 'new', label: 'NEW', count: leadsList.filter(l => !l.isArchived && !l.isConverted && l.status === 'NEW').length },
            { id: 'qualified', label: 'QUALIFIED', count: leadsList.filter(l => !l.isArchived && !l.isConverted && l.status === 'QUALIFIED').length },
            { id: 'unqualified', label: 'UNQUALIFIED', count: leadsList.filter(l => !l.isArchived && !l.isConverted && l.status === 'UNQUALIFIED').length },
            { id: 'archived', label: 'ARCHIVED', count: leadsList.filter(l => l.isArchived).length },
          ].map((card) => (
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
              onToggleArchive={() => toggleArchive(lead.id)}
              onEditPress={() => {
                setLeadToEdit(lead);
                setEditGroup('Buyer');
                setEditTag('Lead');
                setEditSource(lead.source);
                setEditStatus(lead.status === 'NEW' ? 'New' : lead.status === 'QUALIFIED' ? 'Qualified' : 'Unqualified');
                setEditColor('#0BA0B2');
                setIsEditModalVisible(true);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* --- AI Lead Import Modal --- */}
      <Modal
        visible={isImportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={[styles.fullPageModal, { paddingTop: insets.top }]}>
          <View style={styles.modalContent}>
            <View style={styles.premiumModalHeader}>
              <View style={styles.aiImportTitleRow}>
                <View style={styles.aiIconSquare}>
                  <MaterialCommunityIcons name="creation" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.aiImportHeaderText}>
                  <Text style={styles.premiumModalTitle}>AI Lead Import</Text>
                  <Text style={styles.premiumModalSubtitle}>
                    Let AI analyze your leads and automatically calculate heat scores and intent patterns.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  setImportModalVisible(false);
                  setSelectedFile(null);
                }}
                style={styles.premiumCloseBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <MaterialCommunityIcons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.premiumModalBody}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View style={styles.importCard}>
                <View style={styles.importLabelRow}>
                  <MaterialCommunityIcons name="message-outline" size={18} color="#0B2D3E" />
                  <Text style={styles.importSectionLabel}>Lead Context & Campaign Info</Text>
                </View>

                <View style={styles.instructionInputContainer}>
                  <TextInput
                    style={styles.instructionInput}
                    placeholder="Describe the source of these leads... (e.g., 'From the Spring Open House, interested in luxury condos')"
                    placeholderTextColor="#8DA4B5"
                    multiline
                    value={importInstructions}
                    onChangeText={setImportInstructions}
                  />
                  <View style={styles.uploadBtnSmall}>
                    <MaterialCommunityIcons name="tray-arrow-up" size={16} color="#6A7D8C" />
                  </View>
                </View>

                {!selectedFile ? (
                  <Pressable
                    style={styles.dropzone}
                    onPress={() => setSelectedFile({
                      name: 'ENTRY POST SYSTEM and TEMPLATES - simplified version.pdf',
                      size: '107.00 KB'
                    })}>
                    <View style={styles.dropzoneIconCircle}>
                      <MaterialCommunityIcons name="tray-arrow-up" size={24} color="#0B2D3E" />
                    </View>
                    <Text style={styles.dropzoneTitle}>Upload your lead list</Text>
                    <Text style={styles.dropzoneSubtitle}>Drag and drop CSV or Excel files here</Text>
                  </Pressable>
                ) : (
                  <View style={styles.fileStatusArea}>
                    <View style={styles.fileCard}>
                      <View style={styles.fileIconBox}>
                        <MaterialCommunityIcons name="file-document-outline" size={24} color="#FFFFFF" />
                      </View>
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
                        <View style={styles.fileMetaRow}>
                          <Text style={styles.readyTag}>Ready to Process • {selectedFile.size}</Text>
                          <Pressable onPress={() => setSelectedFile(null)}>
                            <Text style={styles.changeFileText}>Change File</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>

                    <Pressable
                      style={styles.mappingBtn}
                      onPress={() => setImportModalVisible(false)}
                    >
                      <LinearGradient
                        colors={['#0B2D3E', '#0BA0B2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.mappingBtnGradient}
                      >
                        <MaterialCommunityIcons name="creation" size={20} color="#FFFFFF" />
                        <Text style={styles.mappingBtnText}>Initialize AI Lead Scoring</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
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
        transparent={false}
        animationType="slide"
        onRequestClose={() => setLeadToConvert(null)}
      >
        <View style={styles.fullScreenModalContainer}>
          <View style={styles.fullScreenModalHeader}>
            <Text style={styles.fullScreenModalTitle}>Convert Lead to Contact</Text>
            <Pressable style={styles.fullScreenModalCloseIcon} onPress={() => setLeadToConvert(null)}>
              <MaterialCommunityIcons name="close" size={16} color="#0B2D3E" />
            </Pressable>
          </View>

          <ScrollView style={styles.fullScreenModalContent} contentContainerStyle={{ paddingBottom: 100 }}>
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
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Email</Text>
                <TextInput style={styles.convertInput} placeholder="name@email.com" placeholderTextColor="#8DA4B5" />
              </View>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Phone</Text>
                <TextInput style={styles.convertInput} placeholder="(555) 123-4567" placeholderTextColor="#8DA4B5" />
              </View>
            </View>

            <View style={[styles.convertRow, { zIndex: 10 }]}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Group</Text>
                <Pressable
                  style={styles.convertDropdown}
                  onPress={() => {
                    setConvertTagDropdownOpen(false);
                    setConvertGroupDropdownOpen(!convertGroupDropdownOpen);
                  }}
                >
                  <Text style={styles.convertDropdownText}>{convertGroup}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {convertGroupDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {['Buyer', 'Seller', 'Investor', 'Custom Group...'].map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setConvertGroup(opt);
                          setConvertGroupDropdownOpen(false);
                        }}
                      >
                        {convertGroup === opt && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                        )}
                        <Text style={[styles.formDropdownItemText, convertGroup === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.convertRow, { zIndex: 9 }]}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Tag</Text>
                <Pressable
                  style={styles.convertDropdown}
                  onPress={() => {
                    setConvertGroupDropdownOpen(false);
                    setConvertTagDropdownOpen(!convertTagDropdownOpen);
                  }}
                >
                  <Text style={styles.convertDropdownText}>{convertTag}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {convertTagDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {['Hot', 'Warm', 'Cold', 'Lead', 'Custom Tag...'].map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setConvertTag(opt);
                          setConvertTagDropdownOpen(false);
                        }}
                      >
                        {convertTag === opt && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />
                        )}
                        <Text style={[styles.formDropdownItemText, convertTag === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.convertRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.convertLabel}>Lead Source (Read Only)</Text>
                <View style={styles.convertInputDisabled}>
                  <Text style={[styles.convertDropdownText, { color: '#6A7D8C', fontWeight: '700' }]}>{leadToConvert?.source}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.convertCol, { marginBottom: 32 }]}>
              <Text style={styles.convertLabel}>Tag Color Preset</Text>
              <View style={styles.tagColorRow}>
                {['#0BA0B2', '#FF6B00', '#0B2D3E', '#6366F1', '#10B981', '#64748B', '#E11D48', '#9333EA'].map((color) => {
                  const isActive = convertColor === color;
                  return (
                    <Pressable
                      key={color}
                      onPress={() => setConvertColor(color)}
                      style={isActive ? [styles.tagColorCircleOuter, { borderColor: color === '#FF6B00' ? '#FF8A00' : color }] : undefined}
                    >
                      <View style={[styles.tagColorCircle, { backgroundColor: color }]} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Actions */}
          <View style={[styles.convertActions, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <Pressable style={styles.convertCancelBtn} onPress={() => setLeadToConvert(null)}>
              <Text style={styles.convertCancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.convertConfirmBtn} onPress={confirmConvert}>
              <Text style={styles.convertConfirmBtnText}>Finalize Conversion</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* --- Edit / Add Modal --- */}
      <Modal
        visible={isEditModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => { setIsEditModalVisible(false); setLeadToEdit(null); }}
      >
        <View style={styles.fullScreenModalContainer}>
          <View style={styles.fullScreenModalHeader}>
            <Text style={styles.fullScreenModalTitle}>{leadToEdit ? 'Edit Lead' : 'Add New Lead'}</Text>
            <Pressable style={styles.fullScreenModalCloseIcon} onPress={() => { setIsEditModalVisible(false); setLeadToEdit(null); }}>
              <MaterialCommunityIcons name="close" size={16} color="#0B2D3E" />
            </Pressable>
          </View>

          <ScrollView style={styles.fullScreenModalContent} contentContainerStyle={{ paddingBottom: 100 }} key={leadToEdit ? leadToEdit.id : 'new_lead'}>
            <View style={styles.convertRow}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>First Name <Text style={{ color: '#E11D48' }}>*</Text></Text>
                <TextInput style={styles.convertInput} defaultValue={leadToEdit ? leadToEdit.name.split(' ')[0] : ''} placeholder="John" placeholderTextColor="#8DA4B5" />
              </View>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Last Name <Text style={{ color: '#E11D48' }}>*</Text></Text>
                <TextInput style={styles.convertInput} defaultValue={leadToEdit ? leadToEdit.name.split(' ').slice(1).join(' ') : ''} placeholder="Doe" placeholderTextColor="#8DA4B5" />
              </View>
            </View>

            <View style={styles.convertRow}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Email <Text style={{ color: '#E11D48' }}>*</Text></Text>
                <TextInput style={styles.convertInput} placeholder="john@example.com" placeholderTextColor="#8DA4B5" />
              </View>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Phone</Text>
                <TextInput style={styles.convertInput} placeholder="(555) 000-0000" placeholderTextColor="#8DA4B5" />
              </View>
            </View>

            <View style={[styles.convertRow, { zIndex: 11 }]}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Source</Text>
                <Pressable
                  style={styles.convertDropdown}
                  onPress={() => {
                    setEditStatusDropdownOpen(false);
                    setEditGroupDropdownOpen(false);
                    setEditTagDropdownOpen(false);
                    setEditSourceDropdownOpen(!editSourceDropdownOpen);
                  }}
                >
                  <Text style={styles.convertDropdownText}>{editSource}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {editSourceDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {['Manual Entry', 'Website', 'Referral', 'Social Media', 'Open House', 'Zillow'].map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setEditSource(opt);
                          setEditSourceDropdownOpen(false);
                        }}
                      >
                        {editSource === opt && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />}
                        <Text style={[styles.formDropdownItemText, editSource === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Status</Text>
                <Pressable
                  style={styles.convertDropdown}
                  onPress={() => {
                    setEditSourceDropdownOpen(false);
                    setEditGroupDropdownOpen(false);
                    setEditTagDropdownOpen(false);
                    setEditStatusDropdownOpen(!editStatusDropdownOpen);
                  }}
                >
                  <Text style={styles.convertDropdownText}>{editStatus}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {editStatusDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {['New', 'Qualified', 'Unqualified', 'Archived'].map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setEditStatus(opt);
                          setEditStatusDropdownOpen(false);
                        }}
                      >
                        {editStatus === opt && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />}
                        <Text style={[styles.formDropdownItemText, editStatus === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.convertRow, { zIndex: 10 }]}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Group</Text>
                <Pressable
                  style={styles.convertDropdown}
                  onPress={() => {
                    setEditSourceDropdownOpen(false);
                    setEditStatusDropdownOpen(false);
                    setEditTagDropdownOpen(false);
                    setEditGroupDropdownOpen(!editGroupDropdownOpen);
                  }}
                >
                  <Text style={styles.convertDropdownText}>{editGroup}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {editGroupDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {['Buyer', 'Seller', 'Investor', 'Custom Group...'].map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setEditGroup(opt);
                          setEditGroupDropdownOpen(false);
                        }}
                      >
                        {editGroup === opt && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />}
                        <Text style={[styles.formDropdownItemText, editGroup === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.convertRow, { zIndex: 9 }]}>
              <View style={styles.convertCol}>
                <Text style={styles.convertLabel}>Tag</Text>
                <Pressable
                  style={styles.convertDropdown}
                  onPress={() => {
                    setEditSourceDropdownOpen(false);
                    setEditStatusDropdownOpen(false);
                    setEditGroupDropdownOpen(false);
                    setEditTagDropdownOpen(!editTagDropdownOpen);
                  }}
                >
                  <Text style={styles.convertDropdownText}>{editTag}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {editTagDropdownOpen && (
                  <View style={styles.formDropdownMenu}>
                    {['Hot', 'Warm', 'Cold', 'Lead', 'Custom Tag...'].map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.formDropdownItem}
                        onPress={() => {
                          setEditTag(opt);
                          setEditTagDropdownOpen(false);
                        }}
                      >
                        {editTag === opt && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ position: 'absolute', left: 12 }} />}
                        <Text style={[styles.formDropdownItemText, editTag === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.convertCol, { marginBottom: 32 }]}>
              <Text style={styles.convertLabel}>Tag Color Theme</Text>
              <View style={styles.tagColorRow}>
                {['#0BA0B2', '#FF6B00', '#0B2D3E', '#6366F1', '#10B981', '#64748B', '#E11D48', '#9333EA'].map((color) => {
                  const isActive = editColor === color;
                  return (
                    <Pressable
                      key={color}
                      onPress={() => setEditColor(color)}
                      style={isActive ? [styles.tagColorCircleOuter, { borderColor: color === '#FF6B00' ? '#FF8A00' : color }] : undefined}
                    >
                      <View style={[styles.tagColorCircle, { backgroundColor: color }]} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Actions */}
          <View style={[styles.convertActions, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <Pressable style={styles.convertCancelBtn} onPress={() => { setIsEditModalVisible(false); setLeadToEdit(null); }}>
              <Text style={styles.convertCancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.convertConfirmBtn} onPress={() => { /* stub save */ setIsEditModalVisible(false); setLeadToEdit(null); }}>
              <Text style={styles.convertConfirmBtnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 10 },

  topButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 4,
    marginBottom: 16,
  },
  aiImportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  aiImportBtnText: {
    color: '#0B2D3E',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  addLeadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addLeadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 5,
  },
  searchBar: {
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
    minWidth: 240,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#0B2D3E',
    fontWeight: '500',
  },
  topFilterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 14,
  },
  topFilterText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
    textAlign: 'center',
    marginHorizontal: 2,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 14,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 54, // just below the filter button
    left: 0,
    backgroundColor: '#616E7C',
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingLeft: 36,
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  hotFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 14,
  },
  hotFilterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hotFilterBtnActive: {
    borderColor: '#FFE0CC',
    backgroundColor: '#FFF0E6',
    borderWidth: 1,
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F8',
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
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
    alignItems: 'flex-end',
    gap: 4,
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
    gap: 8,
    marginTop: 16,
  },
  leadCardConvertBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardConvertText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  leadCardArchiveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardArchiveText: { fontSize: 13, fontWeight: '700', color: '#0B2D3E' },
  leadCardEditBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FAFCFD',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardDeleteBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardDeleteBtnArchived: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FAFCFD',
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
  convertedStateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F3F6F8',
    borderRadius: 12,
    marginTop: 16,
  },
  convertedStateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0BA0B2',
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fullScreenModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60, // approximate top inset for modal
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F7',
  },
  fullScreenModalTitle: { fontSize: 24, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.5 },
  fullScreenModalCloseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenModalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  convertRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  convertCol: {
    flex: 1,
  },
  convertLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  convertInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#0B2D3E',
    backgroundColor: '#FFFFFF',
  },
  convertInputDisabled: {
    height: 48,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#FAFCFD',
  },
  convertDropdown: {
    height: 48,
    borderWidth: 1,
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
  formDropdownMenu: {
    position: 'absolute',
    top: 76,
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
  tagColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
  },
  tagColorCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  tagColorCircleOuter: {
    width: 36,
    height: 36,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertActions: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F4F7',
  },
  convertCancelBtn: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  convertCancelBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  convertConfirmBtn: {
    flex: 1.5,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertConfirmBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // --- AI Lead Import Styles ---
  fullPageModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
  },
  premiumModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  premiumModalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.5,
  },
  premiumModalSubtitle: {
    fontSize: 14,
    color: '#6A7D8C',
    fontWeight: '500',
    marginTop: 4,
  },
  premiumCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEFF3',
  },
  premiumModalBody: {
    paddingHorizontal: 28,
  },
  aiImportTitleRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  aiImportHeaderText: {
    flex: 1,
    paddingRight: 10,
  },
  aiIconSquare: {
    width: 44,
    height: 44,
    backgroundColor: '#0BA0B2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0BA0B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  importCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    paddingTop: 0,
  },
  importLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  importSectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  instructionInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  instructionInput: {
    flex: 1,
    fontSize: 14,
    color: '#0B2D3E',
    fontWeight: '500',
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  uploadBtnSmall: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEFF3',
  },
  dropzone: {
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropzoneIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f4f8',
  },
  dropzoneTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 4,
  },
  dropzoneSubtitle: {
    fontSize: 13,
    color: '#6A7D8C',
    fontWeight: '600',
  },
  fileStatusArea: {
    gap: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    backgroundColor: '#f6f9fc',
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  fileIconBox: {
    width: 48,
    height: 56,
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 4,
  },
  fileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readyTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  changeFileText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  mappingBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0BA0B2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  mappingBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  mappingBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
