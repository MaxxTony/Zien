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

const CONTACTS = [
  { id: '1', name: 'Jessica Miller', email: 'jessica@gmail.com', heat: 94, source: 'Open House - 123 Business Way', attribution: 'Staging → Instagram Post', group: 'Buyer', status: 'IN FOLLOW-UP', tag: 'HOT', note: 'Looking for multi-family units in the downtown area. Cash buyer.', noteDate: '2 days ago' },
  { id: '2', name: 'Robert Chen', email: 'robert.c@gmail.com', heat: 82, source: 'Virtual Staging - Instagram', attribution: 'Instagram Ad', group: 'Buyer', status: 'INTERESTED', tag: 'WARM', note: 'Interested in properties near the university. Looking for a 3-bedroom.', noteDate: '1 week ago' },
  { id: '3', name: 'David Wilson', email: 'david.w@gmail.com', heat: 25, source: 'Manual Import', attribution: 'Client Referral', group: 'Seller', status: 'DORMANT', tag: 'COLD', note: 'Previous client, just checking in. No active requirements.', noteDate: '1 month ago' },
  { id: '4', name: 'Sarah Connor', email: 'sarah.c@gmail.com', heat: 88, source: 'Social - Facebook - P101', attribution: 'Facebook Retargeting', group: 'Investor', status: 'SEEKING PROPERTY', tag: 'HOT', note: 'Aggressive investor looking for flip opportunities under $500k.', noteDate: '3 days ago' },
];

const INITIAL_GROUPS = ['Buyer', 'Seller', 'Investor'];
const STATUS_OPTIONS = ['All Status', 'In Follow-up', 'Interested', 'Seeking Property', 'Dormant', 'Archived'];
const TAG_OPTIONS = ['All Tags', 'Hot', 'Warm', 'Cold'];
const TYPE_OPTIONS = ['Buyer', 'Seller', 'Investor'] as const;
const PRESET_COLORS = ['#00A3AD', '#EA580C', '#0B213E', '#6366F1', '#10B981', '#64748B', '#EC4899', '#8B5CF6'];



export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All Groups');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedTag, setSelectedTag] = useState('All Tags');

  const [activeDropdown, setActiveDropdown] = useState<'group' | 'status' | 'tag' | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('Jessica');
  const [lastName, setLastName] = useState('Miller');
  const [email, setEmail] = useState('name@email.com');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>('Buyer');
  const [leadSource, setLeadSource] = useState('Open House - 123 Business Way');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [contactsList, setContactsList] = useState(CONTACTS);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [selectedContactForNote, setSelectedContactForNote] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTagInModal, setSelectedTagInModal] = useState('Hot');
  const [tagColor, setTagColor] = useState('#EA580C');
  const [activePicker, setActivePicker] = useState<'type' | 'tag' | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [contactIdToDelete, setContactIdToDelete] = useState<string | null>(null);

  // Group Management State
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // AI Import State
  const [aiImportModalVisible, setAiImportModalVisible] = useState(false);
  const [importInstructions, setImportInstructions] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const groupOptions = ['All Groups', ...groups];

  const toggleArchive = (id: string) => {
    setContactsList(prev => prev.map(c => {
      if (c.id === id) {
        const isArchived = c.status === 'ARCHIVED';
        return { ...c, status: isArchived ? 'IN FOLLOW-UP' : 'ARCHIVED' };
      }
      return c;
    }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setType('Buyer');
    setLeadSource('');
    setSelectedTagInModal('Hot');
    setTagColor('#EA580C');
    setModalVisible(true);
  };

  const openEditModal = (contact: any) => {
    setIsEditing(true);
    const names = contact.name.split(' ');
    setFirstName(names[0] || '');
    setLastName(names.slice(1).join(' ') || '');
    setEmail(contact.email);
    setPhone('(555) 123-4567'); // Default for now
    setType(contact.group as any);
    setLeadSource(contact.source);
    setSelectedTagInModal(contact.tag);
    setTagColor(contact.tag === 'HOT' ? '#EA580C' : contact.tag === 'WARM' ? '#0BA0B2' : '#64748B');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActivePicker(null);
  };

  const handleSaveContact = () => {
    closeModal();
  };

  const confirmDelete = (id: string) => {
    setContactIdToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteContact = () => {
    if (contactIdToDelete) {
      setContactsList(prev => prev.filter(c => c.id !== contactIdToDelete));
      setDeleteModalVisible(false);
      setContactIdToDelete(null);
    }
  };

  const handleAddGroup = () => {
    if (newGroupName.trim() && !groups.includes(newGroupName.trim())) {
      setGroups([...groups, newGroupName.trim()]);
      setNewGroupName('');
    }
  };

  const handleDeleteGroup = (groupName: string) => {
    setGroups(groups.filter(g => g !== groupName));
  };

  const toggleDropdown = (type: 'group' | 'status' | 'tag') => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <PageHeader
        title="Contacts"
        subtitle="Unified database with full attribution and grouped automation."
        onBack={() => router.back()}

      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Actions: Import + Add Contact */}
        <View style={styles.topActions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topActionsContent}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => setAiImportModalVisible(true)}>
              <MaterialCommunityIcons name="robot-outline" size={18} color="#0F172A" />
              <Text style={styles.actionBtnText}>AI Import</Text>
            </Pressable>
            <Pressable
              style={styles.actionBtn}
              onPress={() => setAddGroupModalVisible(true)}>
              <MaterialCommunityIcons name="account-group-outline" size={18} color="#0F172A" />
              <Text style={styles.actionBtnText}>Add Group</Text>
            </Pressable>
            <Pressable style={styles.primaryActionBtn} onPress={openAddModal}>
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionBtnText}>Add Contact</Text>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Find by name, email, or source..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {/* Group Filter */}
            <Pressable style={[styles.filterBtn, selectedGroup !== 'All Groups' && styles.filterBtnActive]} onPress={() => toggleDropdown('group')}>
              <MaterialCommunityIcons name="filter-outline" size={18} color={selectedGroup !== 'All Groups' ? '#0F172A' : '#64748B'} />
              <Text style={[styles.filterBtnText, selectedGroup !== 'All Groups' && styles.filterBtnTextActive]}>{selectedGroup}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color={selectedGroup !== 'All Groups' ? '#0F172A' : '#64748B'} />
            </Pressable>

            {/* Status Filter */}
            <Pressable style={[styles.filterBtn, selectedStatus !== 'All Status' && styles.filterBtnActive]} onPress={() => toggleDropdown('status')}>
              <MaterialCommunityIcons name="account-search-outline" size={18} color={selectedStatus !== 'All Status' ? '#0F172A' : '#64748B'} />
              <Text style={[styles.filterBtnText, selectedStatus !== 'All Status' && styles.filterBtnTextActive]}>{selectedStatus}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color={selectedStatus !== 'All Status' ? '#0F172A' : '#64748B'} />
            </Pressable>

            {/* Tag Filter */}
            <Pressable style={[styles.filterBtn, selectedTag !== 'All Tags' && styles.filterBtnActive]} onPress={() => toggleDropdown('tag')}>
              <MaterialCommunityIcons name="tag-outline" size={18} color={selectedTag !== 'All Tags' ? '#0F172A' : '#64748B'} />
              <Text style={[styles.filterBtnText, selectedTag !== 'All Tags' && styles.filterBtnTextActive]}>{selectedTag}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color={selectedTag !== 'All Tags' ? '#0F172A' : '#64748B'} />
            </Pressable>
          </ScrollView>
          <Text style={styles.resultsCount}>Showing <Text style={{ fontWeight: '900', color: '#0F172A' }}>{contactsList.length}</Text> contacts</Text>
        </View>

        <View style={styles.contactList}>
          {contactsList.map((contact) => {
            const isArchived = contact.status === 'ARCHIVED';
            return (
              <View key={contact.id} style={[styles.contactCard, isArchived && styles.contactCardArchived]}>
                {/* Profile Section */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>{contact.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.contactMain}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactEmail}>{contact.email}</Text>
                  </View>
                </View>

                {/* AI Heat Section */}
                <View style={styles.cardSection}>
                  <View style={styles.labelRowWithIcon}>
                    <Text style={styles.cardLabel}>AI HEAT</Text>
                    <MaterialCommunityIcons name="fire" size={12} color="#EA580C" style={{ marginLeft: 4, marginBottom: 6 }} />
                  </View>
                  <View style={styles.heatRow}>
                    <View style={styles.heatBarContainer}>
                      <View style={[styles.heatBarFill, { width: `${contact.heat}%`, backgroundColor: contact.heat > 70 ? '#EA580C' : contact.heat > 40 ? '#F59E0B' : '#0BA0B2' }]} />
                    </View>
                    <Text style={[styles.heatValue, { color: contact.heat > 70 ? '#EA580C' : contact.heat > 40 ? '#F59E0B' : '#0BA0B2' }]}>{contact.heat}</Text>
                  </View>
                </View>

                {/* Lead Source / Attribution */}
                <View style={styles.cardSection}>
                  <Text style={styles.cardLabel}>LEAD SOURCE / ATTRIBUTION</Text>
                  <Text style={styles.sourceTitle}>{contact.source}</Text>
                  <Text style={styles.sourceSubtitle}>{contact.attribution}</Text>
                </View>

                <View style={styles.multiInfoRow}>
                  {/* Tags */}
                  <View style={[styles.infoCol, { flex: 0.8 }]}>
                    <Text style={styles.cardLabel}>TAGS</Text>
                    <View style={[styles.tagBadge, { borderColor: contact.tag === 'HOT' ? '#EA580C' : contact.tag === 'WARM' ? '#0BA0B2' : '#64748B', backgroundColor: contact.tag === 'HOT' ? '#FFF7ED' : contact.tag === 'WARM' ? '#F0F9FA' : '#F8FAFC' }]}>
                      <Text style={[styles.tagBadgeText, { color: contact.tag === 'HOT' ? '#EA580C' : contact.tag === 'WARM' ? '#0BA0B2' : '#64748B' }]}>{contact.tag}</Text>
                    </View>
                  </View>
                  {/* Group */}
                  <View style={styles.infoCol}>
                    <Text style={styles.cardLabel}>GROUP</Text>
                    <Text style={styles.infoValue}>{contact.group}</Text>
                  </View>
                  {/* Status */}
                  <View style={[styles.infoCol, { flex: 1.2 }]}>
                    <Text style={styles.cardLabel}>STATUS</Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>{contact.status}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.footerLeft}>
                    <Pressable
                      style={styles.footerCircleBtn}
                      onPress={() => {
                        setSelectedContactForNote(contact);
                        setNotesModalVisible(true);
                      }}>
                      <MaterialCommunityIcons name="information-variant" size={20} color="#64748B" />
                    </Pressable>
                  </View>

                  <View style={styles.footerActionsGroup}>
                    <Pressable style={styles.footerTextBtn} onPress={() => toggleArchive(contact.id)}>
                      <Text style={[styles.footerTextBtnLabel, isArchived && styles.footerTextBtnLabelActive]}>
                        {isArchived ? 'Unarchive' : 'Archive'}
                      </Text>
                    </Pressable>
                    <Pressable style={styles.footerCircleBtn} onPress={() => openEditModal(contact)}>
                      <MaterialCommunityIcons name="pencil-outline" size={18} color="#64748B" />
                    </Pressable>
                    <Pressable style={styles.footerCircleBtn} onPress={() => confirmDelete(contact.id)}>
                      <MaterialCommunityIcons name="delete-outline" size={18} color="#EF4444" />
                    </Pressable>
                    <Pressable style={styles.profileBadgeBtn} onPress={() => router.push('/(main)/crm/profile')}>
                      <Text style={styles.profileBadgeText}>Profile</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={activeDropdown !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveDropdown(null)}>
        <Pressable style={styles.bottomSheetOverlay} onPress={() => setActiveDropdown(null)}>
          <View style={[styles.bottomSheetContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>
              {activeDropdown === 'group' ? 'Select Group' : activeDropdown === 'status' ? 'Select Status' : 'Select Tag'}
            </Text>

            <View style={styles.bottomSheetList}>
              {groupOptions.map(opt => {
                const isSelected = activeDropdown === 'group' ? selectedGroup === opt : activeDropdown === 'status' ? selectedStatus === opt : selectedTag === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.bottomSheetItem, isSelected && styles.bottomSheetItemActive]}
                    onPress={() => {
                      if (activeDropdown === 'group') setSelectedGroup(opt);
                      else if (activeDropdown === 'status') setSelectedStatus(opt);
                      else if (activeDropdown === 'tag') setSelectedTag(opt);
                      setActiveDropdown(null);
                    }}>
                    <Text style={[styles.bottomSheetItemText, isSelected && styles.bottomSheetItemTextActive]}>{opt}</Text>
                    {isSelected && <MaterialCommunityIcons name="check-circle" size={24} color="#0F172A" />}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Latest Note Bottom Sheet Modal */}
      <Modal
        visible={notesModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNotesModalVisible(false)}>
        <Pressable style={styles.bottomSheetOverlay} onPress={() => setNotesModalVisible(false)}>
          <View style={[styles.noteBottomSheet, { paddingBottom: Math.max(insets.bottom, 24) }]} onStartShouldSetResponder={() => true}>
            <View style={styles.bottomSheetHandle} />

            <View style={styles.noteHeader}>
              <View style={styles.noteIconWrap}>
                <MaterialCommunityIcons name="file-document-edit-outline" size={26} color="#0BA0B2" />
              </View>
              <View style={styles.noteTitleWrap}>
                <Text style={styles.noteTitle}>Latest Lead Note</Text>
                <Text style={styles.noteSubtitle}>Last updated {selectedContactForNote?.noteDate}</Text>
              </View>
            </View>

            <View style={styles.noteQuoteContainer}>
              <View style={styles.noteVerticalAccent} />
              <Text style={styles.noteBodyText}>
                "{selectedContactForNote?.note}"
              </Text>
            </View>

            <Pressable
              style={styles.premiumReadBtn}
              onPress={() => {
                setNotesModalVisible(false);
                router.push('/(main)/crm/profile');
              }}>
              <View style={styles.premiumReadContent}>
                <View style={styles.readIconCircle}>
                  <MaterialCommunityIcons name="text-box-search-outline" size={20} color="#0F172A" />
                </View>
                <Text style={styles.premiumReadText}>View all activity log</Text>
              </View>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#64748B" />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Add New Contact Modal */}
      {/* Add / Edit Contact Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={[styles.fullPageModal, { paddingTop: insets.top }]}>
          <View style={styles.modalContent}>
            <View style={styles.premiumModalHeader}>
              <View>
                <Text style={styles.premiumModalTitle}>{isEditing ? 'Edit Contact Info' : 'Add New Contact'}</Text>
                <Text style={styles.premiumModalSubtitle}>{isEditing ? 'Update lead details and tags' : 'Register a new lead into your CRM'}</Text>
              </View>
              <Pressable onPress={closeModal} style={styles.premiumCloseBtn} hitSlop={12}>
                <MaterialCommunityIcons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.premiumModalBody}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}>

              <View style={styles.formGrid}>
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>First Name</Text>
                    <TextInput
                      style={styles.premiumInput}
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="e.g. Jessica"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Last Name</Text>
                    <TextInput
                      style={styles.premiumInput}
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="e.g. Miller"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Email Address</Text>
                    <TextInput
                      style={styles.premiumInput}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="name@email.com"
                      placeholderTextColor="#94A3B8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.premiumInput}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="(555) 000-0000"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Lead Group</Text>
                    <Pressable
                      style={styles.premiumSelect}
                      onPress={() => setActivePicker(activePicker === 'type' ? null : 'type')}>
                      <Text style={styles.premiumSelectText}>{type}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#64748B" />
                    </Pressable>
                    {activePicker === 'type' && (
                      <View style={styles.premiumDropdown}>
                        {TYPE_OPTIONS.map((opt) => (
                          <Pressable
                            key={opt}
                            style={styles.premiumDropdownItem}
                            onPress={() => {
                              setType(opt);
                              setActivePicker(null);
                            }}>
                            <Text style={styles.premiumDropdownText}>{opt}</Text>
                            {type === opt && <MaterialCommunityIcons name="check" size={18} color="#0BA0B2" />}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Lead Tag</Text>
                    <Pressable
                      style={styles.premiumSelect}
                      onPress={() => setActivePicker(activePicker === 'tag' ? null : 'tag')}>
                      <Text style={styles.premiumSelectText}>{selectedTagInModal}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#64748B" />
                    </Pressable>
                    {activePicker === 'tag' && (
                      <View style={styles.premiumDropdown}>
                        {TAG_OPTIONS.filter(t => t !== 'All Tags').map((opt) => (
                          <Pressable
                            key={opt}
                            style={styles.premiumDropdownItem}
                            onPress={() => {
                              setSelectedTagInModal(opt);
                              setActivePicker(null);
                            }}>
                            <Text style={styles.premiumDropdownText}>{opt}</Text>
                            {selectedTagInModal === opt && <MaterialCommunityIcons name="check" size={18} color="#0BA0B2" />}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.fullWidthCol}>
                  <Text style={styles.formLabel}>Tag Color Preset</Text>
                  <View style={styles.colorPresetRow}>
                    {PRESET_COLORS.map(color => (
                      <Pressable
                        key={color}
                        style={[styles.colorCircle, { backgroundColor: color }, tagColor === color && styles.colorCircleActive]}
                        onPress={() => setTagColor(color)}>
                        {tagColor === color && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.fullWidthCol}>
                  <Text style={styles.formLabel}>Initial Lead Source</Text>
                  <TextInput
                    style={styles.premiumInput}
                    value={leadSource}
                    onChangeText={setLeadSource}
                    placeholder="e.g. Instagram Ad / Referral"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={[styles.premiumActions, { paddingBottom: Math.max(insets.bottom, 24) }]}>
              <Pressable style={styles.premiumCancelBtn} onPress={closeModal}>
                <Text style={styles.premiumCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.premiumSaveBtn} onPress={handleSaveContact}>
                <Text style={styles.premiumSaveText}>{isEditing ? 'Update Contact' : 'Save New Lead'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}>
        <Pressable style={styles.alertModalOverlay} onPress={() => setDeleteModalVisible(false)}>
          <View style={styles.alertCard} onStartShouldSetResponder={() => true}>
            <View style={styles.alertIconZone}>
              <View style={styles.alertIconCircle}>
                <MaterialCommunityIcons name="alert-outline" size={32} color="#0F172A" />
              </View>
            </View>

            <Text style={styles.alertTitle}>Erase Intelligence?</Text>
            <Text style={styles.alertDescription}>
              This action is permanent. All historical attribution and lead scores for this contact will be lost.
            </Text>

            <View style={styles.alertActions}>
              <Pressable style={styles.alertCancelBtn} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.alertCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.alertDeleteBtn} onPress={handleDeleteContact}>
                <Text style={styles.alertDeleteText}>Delete Contact</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* AI Import Modal */}
      <Modal
        visible={aiImportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAiImportModalVisible(false)}>
        <View style={[styles.fullPageModal, { paddingTop: insets.top }]}>
          <View style={styles.modalContent}>
            <View style={styles.premiumModalHeader}>
              <View style={styles.aiImportTitleRow}>
                <View style={styles.aiIconSquare}>
                  <MaterialCommunityIcons name="creation" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.aiImportHeaderText}>
                  <Text style={styles.premiumModalTitle}>AI Import</Text>
                  <Text style={styles.premiumModalSubtitle}>
                    Let AI analyze your files and automatically group contacts by intent, tags, and data patterns.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  setAiImportModalVisible(false);
                  setSelectedFile(null);
                }}
                style={styles.premiumCloseBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <MaterialCommunityIcons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.premiumModalBody}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}>

              <View style={styles.importCard}>
                <View style={styles.importLabelRow}>
                  <MaterialCommunityIcons name="message-outline" size={18} color="#0F172A" />
                  <Text style={styles.importSectionLabel}>Import Context & Instructions</Text>
                </View>

                <View style={styles.instructionInputContainer}>
                  <TextInput
                    style={styles.instructionInput}
                    placeholder="Tell the AI how to categorize these contacts... (e.g., 'Group by industry and tag VIPs')"
                    placeholderTextColor="#94A3B8"
                    multiline
                    value={importInstructions}
                    onChangeText={setImportInstructions}
                  />

                </View>

                <View style={styles.optionalCallout}>
                  <View style={styles.infoCircleSmall}>
                    <MaterialCommunityIcons name="lightbulb-outline" size={12} color="#FFFFFF" />
                  </View>
                  <Text style={styles.optionalCalloutText}>
                    Optional: Describing your data helps the AI map ambiguous fields and group contacts by intent.
                  </Text>
                </View>

                {!selectedFile ? (
                  <Pressable
                    style={styles.dropzone}
                    onPress={() => setSelectedFile({
                      name: 'ENTRY POST SYSTEM and TEMPLATES - simplified version.pdf',
                      size: '107.00 KB'
                    })}>
                    <View style={styles.dropzoneIconCircle}>
                      <MaterialCommunityIcons name="upload" size={24} color="#0B213E" />
                    </View>
                    <Text style={styles.dropzoneTitle}>Upload your contact list</Text>
                    <Text style={styles.dropzoneSubtitle}>Drag and drop your file here, or click to browse</Text>
                    <Text style={styles.dropzoneFormats}>CSV • XLSX • TXT • PDF</Text>
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
                      onPress={() => setAiImportModalVisible(false)}>
                      <LinearGradient
                        colors={['#0B213E', '#0BA0B2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.mappingBtnGradient}>
                        <MaterialCommunityIcons name="creation" size={20} color="#FFFFFF" />
                        <Text style={styles.mappingBtnText}>Initialize AI Intelligence Mapping</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal >

      {/* Add Group Modal */}
      <Modal
        visible={addGroupModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddGroupModalVisible(false)}>
        <View style={[styles.fullPageModal, { paddingTop: insets.top }]}>
          <View style={styles.modalContent}>
            <View style={styles.premiumModalHeader}>
              <View>
                <Text style={styles.premiumModalTitle}>Add Group</Text>
                <Text style={styles.premiumModalSubtitle}>Manage contact categories and segments</Text>
              </View>
              <Pressable
                onPress={() => setAddGroupModalVisible(false)}
                style={styles.premiumCloseBtn}
                hitSlop={12}>
                <MaterialCommunityIcons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.premiumModalBody}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

              <View style={styles.addGroupInputRow}>
                <TextInput
                  style={styles.addGroupInput}
                  placeholder="New group name..."
                  placeholderTextColor="#94A3B8"
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                />
                <Pressable
                  style={[styles.addGroupSubBtn, !newGroupName.trim() && styles.addGroupSubBtnDisabled]}
                  onPress={handleAddGroup}
                  disabled={!newGroupName.trim()}>
                  <Text style={styles.addGroupSubBtnText}>Add</Text>
                </Pressable>
              </View>

              <View style={styles.groupListContainer}>
                {groups.map((group) => (
                  <View key={group} style={styles.groupListItem}>
                    <Text style={styles.groupListItemText}>{group}</Text>
                    <Pressable onPress={() => handleDeleteGroup(group)}>
                      <MaterialCommunityIcons name="close" size={20} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal >

    </LinearGradient >
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },

  // Top Actions
  topActions: { marginBottom: 16 },
  topActionsContent: { gap: 10, paddingRight: 16 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryActionBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },

  // Filters
  filterSection: { marginBottom: 24 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A', fontWeight: '500', marginLeft: 10 },
  filtersScroll: { gap: 10, paddingBottom: 4 },
  filterWrap: { position: 'relative', zIndex: 10 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterBtnText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  filterBtnActive: { borderColor: '#0F172A', backgroundColor: '#F8FAFC' },
  filterBtnTextActive: { color: '#0F172A' },

  // Bottom Sheet Modal
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 24,
    textAlign: 'center',
  },
  bottomSheetList: { gap: 8 },
  bottomSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bottomSheetItemActive: {
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bottomSheetItemText: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  bottomSheetItemTextActive: { color: '#0F172A', fontWeight: '800' },

  resultsCount: { fontSize: 12, color: '#64748B', marginTop: 12, fontWeight: '600' },

  // Contact List & Cards
  contactList: { gap: 16 },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 4,
  },
  contactCardArchived: {
    backgroundColor: '#F8FAFC',
    opacity: 0.7,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cardSection: { marginBottom: 20 },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  contactMain: { marginLeft: 16 },
  contactName: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  contactEmail: { fontSize: 14, color: '#64748B', fontWeight: '500', marginTop: 2 },
  labelRowWithIcon: { flexDirection: 'row', alignItems: 'center' },
  cardLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 8, textTransform: 'uppercase' },

  // Heat Bar
  heatRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heatBarContainer: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  heatBarFill: { height: '100%', borderRadius: 3 },
  heatValue: { fontSize: 16, fontWeight: '900', width: 30, textAlign: 'right' },

  sourceTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  sourceSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500', marginTop: 4 },

  multiInfoRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  infoCol: { flex: 1 },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  tagBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagBadgeText: { fontSize: 11, fontWeight: '900' },

  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusPillText: { fontSize: 10, fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 0.5 },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerLeft: { flex: 1 },
  footerActionsGroup: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  footerCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  footerTextBtn: {
    paddingHorizontal: 8,
  },
  footerTextBtnLabel: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  footerTextBtnLabelActive: { color: '#0F172A' },

  // AI Import Styles
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
    marginTop: 12,
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
    color: '#0F172A',
  },
  instructionInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  instructionInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
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
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  optionalCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FA',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 24,
  },
  infoCircleSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0BA0B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionalCalloutText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0BA0B2',
    lineHeight: 16,
  },
  dropzone: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 24,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
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
  },
  dropzoneTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  dropzoneSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 12,
  },
  dropzoneFormats: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  fileStatusArea: {
    gap: 16,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  fileIconBox: {
    width: 48,
    height: 56,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  fileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  readyTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexShrink: 1,
  },
  changeFileText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
  mappingBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0BA0B2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
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

  // Add Group Modal Styles
  addGroupSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    maxHeight: '80%',
  },
  addGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addGroupTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  addGroupInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  addGroupInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  addGroupSubBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addGroupSubBtnDisabled: {
    opacity: 0.5,
  },
  addGroupSubBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  groupListContainer: {
    gap: 10,
    paddingBottom: 40,
  },
  groupListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  groupListItemText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  profileBadgeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F0F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCF1F3',
  },
  profileBadgeText: { fontSize: 14, fontWeight: '800', color: '#0BA0B2' },


  // Full Page Modal
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
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  premiumModalSubtitle: {
    fontSize: 14,
    color: '#64748B',
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
    borderColor: '#F1F5F9',
  },
  premiumModalBody: {
    paddingHorizontal: 28,
  },
  formGrid: {
    gap: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formCol: {
    flex: 1,
  },
  fullWidthCol: {
    width: '100%',
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  premiumSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  premiumSelectText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  premiumDropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  premiumDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  premiumDropdownText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  colorPresetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumActions: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 28,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  premiumCancelBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  premiumCancelText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#64748B',
  },
  premiumSaveBtn: {
    flex: 2,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  premiumSaveText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Alert Modal (Delete Confirmation)
  alertModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  alertIconZone: {
    marginBottom: 24,
  },
  alertIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  alertDescription: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 32,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  alertCancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  alertCancelText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
  },
  alertDeleteBtn: {
    flex: 1.5,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  alertDeleteText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },


  // Notes Modal (Premium Bottom Sheet)
  noteBottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 30,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 32,
    marginTop: 8,
  },
  noteIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#F0FBFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0F2F1',
  },
  noteTitleWrap: { flex: 1 },
  noteTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  noteSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 4,
  },
  noteQuoteContainer: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  noteVerticalAccent: {
    width: 4,
    backgroundColor: '#0BA0B2',
    borderRadius: 2,
    marginRight: 20,
  },
  noteBodyText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: '#1E293B',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  premiumReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  premiumReadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  readIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  premiumReadText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});
