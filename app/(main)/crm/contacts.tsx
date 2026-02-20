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
  { id: '1', name: 'Jessica Miller', email: 'jessica@gmail.com', heat: 94, source: 'Open House - 123 Business Way', group: 'Buyer', status: 'IN FOLLOW-UP' },
  { id: '2', name: 'Robert Chen', email: 'robert.c@gmail.com', heat: 82, source: 'Virtual Staging - Instagram', group: 'Buyer', status: 'INTERESTED' },
  { id: '3', name: 'David Wilson', email: 'david.w@company.com', heat: 25, source: 'Manual Import', group: 'Seller', status: 'DORMANT' },
  { id: '4', name: 'Sarah Connor', email: 'sarah.c@gmail.com', heat: 88, source: 'Social - Facebook - P101', group: 'Investor', status: 'SEEKING PROPERTY' },
];

const TYPE_OPTIONS = ['Buyer', 'Seller', 'Investor'] as const;

function HeatBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const isHigh = value >= 70;
  const isLow = value < 40;
  return (
    <View style={styles.heatBarWrap}>
      <View style={styles.heatBarBg}>
        <View style={[styles.heatBarFill, { width: `${pct}%`, backgroundColor: isHigh ? '#EA580C' : isLow ? '#0BA0B2' : '#F59E0B' }]} />
      </View>
      <Text style={styles.heatBarValue}>— {value}</Text>
    </View>
  );
}

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('Jessica');
  const [lastName, setLastName] = useState('Miller');
  const [email, setEmail] = useState('name@email.com');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>('Buyer');
  const [leadSource, setLeadSource] = useState('Open House - 123 Business Way');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
    setTypeDropdownOpen(false);
  };

  const handleSaveContact = () => {
    // TODO: add to list / API
    closeModal();
  };

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
          <Text style={styles.title}>Contacts</Text>
          <Text style={styles.subtitle}>
            Unified database with full attribution and grouped automation.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Actions: Import + Add Contact */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.secondaryBtn} onPress={() => setImportModalVisible(true)}>
            <MaterialCommunityIcons name="upload-outline" size={18} color="#0B2D3E" />
            <Text style={styles.secondaryBtnText}>Import CSV/Excel</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Add Contact</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search contacts by name, email, or source..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Contact cards — mobile-friendly stacked layout */}
        <View style={styles.contactList}>
          {CONTACTS.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactCardHeader}>
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactEmail} numberOfLines={1}>{contact.email}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{contact.status}</Text>
                </View>
              </View>

              <View style={styles.contactMetaRow}>
                <Text style={styles.contactMetaLabel}>Heat index</Text>
                <HeatBar value={contact.heat} />
              </View>

              <View style={styles.contactMetaRow}>
                <Text style={styles.contactMetaLabel}>Lead source</Text>
                <Text style={styles.contactMetaValue} numberOfLines={2}>{contact.source}</Text>
              </View>

              <View style={styles.contactMetaRow}>
                <Text style={styles.contactMetaLabel}>Group</Text>
                <Text style={styles.contactMetaValue}>{contact.group}</Text>
              </View>

              <Pressable style={styles.profileLink} onPress={() => router.push('/(main)/crm/profile')}>
                <Text style={styles.profileLinkText}>Profile</Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color="#0BA0B2" />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add New Contact Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <Pressable style={styles.modalBackdrop} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Contact</Text>
              <Pressable onPress={closeModal} style={styles.modalCloseBtn} hitSlop={12}>
                <MaterialCommunityIcons name="close" size={22} color="#0B2D3E" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.modalRow}>
                <View style={[styles.modalField, { flex: 1 }]}>
                  <Text style={styles.modalLabel}>First Name</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={[styles.modalField, { flex: 1 }]}>
                  <Text style={styles.modalLabel}>Last Name</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Email</Text>
                <TextInput
                  style={styles.modalInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalRow}>
                <View style={[styles.modalField, { flex: 1 }]}>
                  <Text style={styles.modalLabel}>Phone</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="(555) 123-4567"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={[styles.modalField, { flex: 1 }]}>
                  <Text style={styles.modalLabel}>Type</Text>
                  <Pressable
                    style={styles.modalSelect}
                    onPress={() => setTypeDropdownOpen((v) => !v)}>
                    <Text style={styles.modalSelectText}>{type}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                  </Pressable>
                  {typeDropdownOpen && (
                    <View style={styles.modalDropdown}>
                      {TYPE_OPTIONS.map((opt) => (
                        <Pressable
                          key={opt}
                          style={styles.modalDropdownItem}
                          onPress={() => {
                            setType(opt);
                            setTypeDropdownOpen(false);
                          }}>
                          <Text style={styles.modalDropdownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Lead Source</Text>
                <TextInput
                  style={styles.modalInput}
                  value={leadSource}
                  onChangeText={setLeadSource}
                  placeholder="Open House - 123 Business Way"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.modalActions}>
                <Pressable style={styles.modalCancelBtn} onPress={closeModal}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalSaveBtn} onPress={handleSaveContact}>
                  <Text style={styles.modalSaveText}>Save Contact</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Import Contacts Modal */}
      <Modal
        visible={importModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImportModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setImportModalVisible(false)}>
          <Pressable style={[styles.modalCard, styles.importModalCard]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.importModalHeader}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={styles.importModalTitle}>Import Contacts</Text>
                <Text style={styles.importModalSubtitle}>
                  Upload CSV or Excel files to bulk add contacts to your CRM.
                </Text>
              </View>
              <Pressable onPress={() => setImportModalVisible(false)} style={styles.modalCloseBtn} hitSlop={12}>
                <MaterialCommunityIcons name="close" size={22} color="#0B2D3E" />
              </Pressable>
            </View>

            <View style={styles.importModalBody}>
              <View style={styles.dropzoneCard}>
                <View style={styles.dropzoneInner}>
                  <View style={styles.uploadIconWrap}>
                    <MaterialCommunityIcons name="upload-outline" size={28} color="#0B2D3E" />
                  </View>
                  <Text style={styles.dropzoneTitle}>Drag & Drop file here</Text>
                  <Text style={styles.dropzoneSubtitle}>or click to browse from your computer</Text>

                  <Pressable style={styles.selectFileBtn}>
                    <Text style={styles.selectFileBtnText}>Select File</Text>
                  </Pressable>

                  <Text style={styles.dropzoneFormats}>Supported formats: .CSV, .XLSX</Text>
                </View>
              </View>
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
  title: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.2 },
  subtitle: { fontSize: 13, color: '#5B6B7A', fontWeight: '600', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    flex: .5,
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 13, fontWeight: '700', color: '#0B2D3E' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    flex: .5,
  },
  primaryBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#0B2D3E', paddingVertical: 0 },
  contactList: { gap: 12 },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
  },
  contactCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  contactName: { fontSize: 16, fontWeight: '800', color: '#0B2D3E' },
  contactEmail: { fontSize: 13, color: '#5B6B7A', marginTop: 2 },
  statusBadge: {
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  contactMetaRow: { marginBottom: 10 },
  contactMetaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B6B7A',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  contactMetaValue: { fontSize: 14, fontWeight: '600', color: '#0B2D3E' },
  heatBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heatBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8EEF6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  heatBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  heatBarValue: { fontSize: 14, fontWeight: '700', color: '#0B2D3E', minWidth: 36 },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 8,
    paddingVertical: 6,
    paddingRight: 4,
  },
  profileLinkText: { fontSize: 14, fontWeight: '700', color: '#0BA0B2' },
  // Add Contact Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0B2D3E' },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: { maxHeight: 500, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  modalRow: { flexDirection: 'row', gap: 12 },
  modalField: { marginBottom: 14 },
  modalLabel: { fontSize: 13, fontWeight: '700', color: '#5B6B7A', marginBottom: 6 },
  modalInput: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0B2D3E',
  },
  modalSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalSelectText: { fontSize: 15, fontWeight: '600', color: '#0B2D3E' },
  modalDropdown: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    overflow: 'hidden',
  },
  modalDropdownItem: { paddingVertical: 12, paddingHorizontal: 14 },
  modalDropdownItemText: { fontSize: 15, fontWeight: '600', color: '#0B2D3E' },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: '#0B2D3E' },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },

  // Import Modal Styles
  importModalCard: {
    maxWidth: 600,
    width: '100%',
    padding: 24,
  },
  importModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  importModalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  importModalSubtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    lineHeight: 20,
  },
  importModalBody: {},
  dropzoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    padding: 16,
  },
  dropzoneInner: {
    borderWidth: 1.5,
    borderColor: '#E3ECF4',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  uploadIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dropzoneTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  dropzoneSubtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
  },
  selectFileBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  selectFileBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  dropzoneFormats: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
