import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CONNECTED_ACCOUNTS = [
  { id: 'instagram', name: 'Instagram', handle: '@jordan_smith_re', status: 'CONNECTED' as const, action: 'Manage', icon: 'instagram', color: '#E1306C' },
  { id: 'facebook', name: 'Facebook', handle: 'Jordan Smith Real Estate', status: 'CONNECTED' as const, action: 'Manage', icon: 'facebook', color: '#1877F2' },
  { id: 'linkedin', name: 'LinkedIn', handle: 'jordan-smith-re', status: 'DISCONNECTED' as const, action: 'Connect', icon: 'linkedin', color: '#0A66C2' },
];

const AUTO_RULES = [
  { key: 'property_live', label: 'Auto-post when property goes live', value: true },
  { key: 'open_house', label: 'Auto-post 24h before open house', value: true },
  { key: 'price_drop', label: 'Auto-post when price drops', value: false },
  { key: 'repost', label: 'Re-post high performing assets weekly', value: true },
];

function PlatformLogo({ platform, icon, color }: { platform: string, icon: any, color: string }) {
  return (
    <View style={[styles.platformLogo, { backgroundColor: `${color}15` }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
  );
}

export default function AccountsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [hashtags, setHashtags] = useState('#RealEstate #LuxuryLiving #ZienAI');
  const [brandColor, setBrandColor] = useState('#0B2341');
  const [watermark, setWatermark] = useState(true);
  const [rules, setRules] = useState(() =>
    AUTO_RULES.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {} as Record<string, boolean>)
  );

  // Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editAccount, setEditAccount] = useState<typeof CONNECTED_ACCOUNTS[0] | null>(null);

  const setRule = (key: string, value: boolean) => setRules((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setShowSuccessModal(true);
    // Simulate API call or delay if needed
    // setTimeout(() => router.back(), 2000); 
  };

  const handleManage = (account: typeof CONNECTED_ACCOUNTS[0]) => {
    setEditAccount(account);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const closeEditModal = () => {
    setEditAccount(null);
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Social & Automation Settings</Text>
          <Text style={styles.subtitle}>Manage your connected accounts and automation preferences.</Text>
        </View>

      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} // Additional padding for footer
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Connected Accounts Card */}
        <View style={styles.proCard}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="cellphone-link" size={20} color="#0B2D3E" />
            <Text style={styles.sectionTitle}>Connected Accounts</Text>
          </View>

          {CONNECTED_ACCOUNTS.map((acc, idx) => (
            <View
              key={acc.id}
              style={[styles.accountRow, idx === CONNECTED_ACCOUNTS.length - 1 && styles.accountRowLast]}>
              <PlatformLogo platform={acc.name} icon={acc.icon} color={acc.color} />
              <View style={styles.accountInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.accountName} numberOfLines={1}>{acc.name}</Text>
                  {acc.status === 'CONNECTED' && (
                    <MaterialCommunityIcons name="check-decagram" size={14} color="#0BA0B2" />
                  )}
                </View>
                <Text style={styles.accountHandle} numberOfLines={1}>{acc.handle}</Text>
                <Text style={[
                  styles.mobileStatusText,
                  acc.status === 'CONNECTED' ? styles.textConnected : styles.textDisconnected
                ]}>
                  {acc.status === 'CONNECTED' ? '● Connected' : '○ Disconnected'}
                </Text>
              </View>

              <Pressable
                style={acc.status === 'CONNECTED' ? styles.manageBtn : styles.connectBtn}
                onPress={() => acc.status === 'CONNECTED' ? handleManage(acc) : {}}
              >
                <Text style={acc.status === 'CONNECTED' ? styles.manageBtnText : styles.connectBtnText}>
                  {acc.action}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Auto-Publishing Rules Card */}
        <View style={styles.proCard}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="robot-outline" size={20} color="#0B2D3E" />
            <Text style={styles.sectionTitle}>Auto-Publishing Rules</Text>
          </View>
          <View style={styles.gradientDivider} />
          {AUTO_RULES.map((r, idx) => (
            <View
              key={r.key}
              style={[styles.toggleRow, idx === AUTO_RULES.length - 1 && styles.toggleRowLast]}>
              <Text style={styles.toggleLabel}>{r.label}</Text>
              <Switch
                value={rules[r.key] ?? r.value}
                onValueChange={(v) => setRule(r.key, v)}
                trackColor={{ false: '#E2E8F0', true: '#0B2D3E' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E2E8F0"
              />
            </View>
          ))}
        </View>

        {/* Brand Assets Card */}
        <View style={styles.proCard}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="palette-outline" size={20} color="#0B2D3E" />
            <Text style={styles.sectionTitle}>Brand Assets</Text>
          </View>

          <Text style={styles.fieldLabel}>Default Hashtags</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={hashtags}
            onChangeText={setHashtags}
            placeholder="#YourBrand #Tag"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
          <Text style={[styles.fieldLabel, { marginTop: 20 }]}>Brand Primary Color</Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: brandColor }]} />
            <TextInput
              style={[styles.input, styles.colorInput]}
              value={brandColor}
              onChangeText={setBrandColor}
              placeholder="#0B2341"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={7}
            />
          </View>

          <View style={styles.separator} />

          <View style={[styles.toggleRow, { borderBottomWidth: 0, paddingVertical: 0 }]}>
            <Text style={styles.toggleLabel}>Auto-Watermark Media</Text>
            <Switch
              value={watermark}
              onValueChange={setWatermark}
              trackColor={{ false: '#E2E8F0', true: '#0B2D3E' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E8F0"
            />
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Save Button */}
      <View style={[styles.bottomFooter, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </Pressable>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>Settings Saved</Text>
            <Text style={styles.modalsubtitle}>Your social media and automation preferences have been successfully updated.</Text>
            <Pressable style={styles.modalBtn} onPress={closeSuccessModal}>
              <Text style={styles.modalBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Edit Account Modal */}
      <Modal visible={!!editAccount} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={[styles.platformLogoSm, { backgroundColor: editAccount?.color + '15' }]}>
                <MaterialCommunityIcons name={editAccount?.icon as any} size={20} color={editAccount?.color} />
              </View>
              <Text style={styles.modalTitleSm}>Edit {editAccount?.name}</Text>
              <Pressable onPress={closeEditModal} style={{ marginLeft: 'auto' }}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.fieldLabel}>Username / Handle</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{editAccount?.handle}</Text>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Connection Status</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>Connected</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#64748B" />
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelBtn} onPress={closeEditModal}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSaveBtn} onPress={closeEditModal}>
                <Text style={styles.modalSaveText}>Update Account</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  headerSaveBtn: {
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  headerSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtn: {
    backgroundColor: '#0B2D3E',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },

  // Pro Card Styles
  proCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  gradientDivider: {
    height: 2,
    backgroundColor: '#F1F5F9', // Fallback or distinct divider? Gradient border in mocks usually means distinct section styles.
    // Using simple divider for now as shown in some mocks, or just relying on spacing.
    marginBottom: 10,
    display: 'none' // Hidden based on clean look preference
  },

  // Account Rows
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 14,
  },
  accountRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  platformLogo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: { flex: 1 },
  accountName: { fontSize: 16, fontWeight: '800', color: '#0B2D3E' },
  accountHandle: { fontSize: 13, color: '#64748B', fontWeight: '500', marginTop: 2 },

  statusConnectedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.5,
    alignSelf: 'center'
  },
  statusDisconnectedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    alignSelf: 'center'
  },
  manageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  manageBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E'
  },
  connectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  connectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E'
  },

  // Toggles
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  toggleRowLast: { paddingBottom: 0 },
  toggleLabel: { fontSize: 15, fontWeight: '700', color: '#0B2D3E', flex: 1, marginRight: 16 },

  // Inputs
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 10 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0B2D3E',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top', lineHeight: 22 },
  colorRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  colorInput: { flex: 1 },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 24
  },

  mobileStatusText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  textConnected: { color: '#0BA0B2' },
  textDisconnected: { color: '#94A3B8' },

  // Modals
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
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 10,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    textAlign: 'center',
    marginBottom: 12
  },
  modalsubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32
  },
  modalBtn: {
    backgroundColor: '#0B2D3E',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },

  // Edit Modal Specific
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    gap: 12
  },
  platformLogoSm: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitleSm: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E'
  },
  readOnlyInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  readOnlyText: {
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '500'
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 24
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
    color: '#64748B',
    fontWeight: '700',
    fontSize: 14
  },
  modalSaveBtn: {
    flex: 1,
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
    fontWeight: '700',
    fontSize: 14
  }

});
