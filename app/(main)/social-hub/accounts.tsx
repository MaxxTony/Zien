import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
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
  { id: 'facebook', name: 'Facebook', handle: 'Jordan Smith Real Estate', status: 'DISCONNECTED' as const, action: 'Connect', icon: 'facebook', color: '#1877F2' },
  { id: 'linkedin', name: 'LinkedIn', handle: 'jordan-smith-re', status: 'PENDING VERIFY' as const, action: 'Connect', icon: 'linkedin', color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', handle: '@jordan_smith_realestate', status: 'CONNECTED' as const, action: 'Manage', icon: 'music-note', color: '#000000' },
];

const AUTO_RULES = [
  { key: 'property_live', label: 'Auto-post when property goes live', value: true },
  { key: 'open_house', label: 'Auto-post 24h before open house', value: true },
  { key: 'price_drop', label: 'Auto-post when price drops', value: false },
  { key: 'repost', label: 'Re-post high performing assets weekly', value: true },
];

export default function AccountsScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

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
  const [activeAccount, setActiveAccount] = useState<typeof CONNECTED_ACCOUNTS[0] | null>(null);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Connected');

  const setRule = (key: string, value: boolean) => setRules((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setShowSuccessModal(true);
  };

  const handleAccountPress = (account: typeof CONNECTED_ACCOUNTS[0]) => {
    const statusMap: Record<string, string> = {
      'CONNECTED': 'Connected',
      'DISCONNECTED': 'Disconnected',
      'PENDING VERIFY': 'Pending Verify'
    };
    setSelectedStatus(statusMap[account.status] || 'Connected');
    setActiveAccount(account);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const closeAccountModal = () => {
    setActiveAccount(null);
    setShowStatusPicker(false);
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>

      <View style={styles.headerRow}>
        <PageHeader
          title="Account Setting"
          subtitle="Manage your connected accounts and automation preferences."
          onBack={() => router.back()}
          rightIcon="content-save"
          onRightPress={handleSave}
          rightIconColor={colors.textPrimary}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Connected Accounts Card */}
        <View style={styles.proCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.headerIconCircle}>
              <MaterialCommunityIcons name="cellphone-link" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Connected Accounts</Text>
            </View>
          </View>

          <View style={styles.accountsList}>
            {CONNECTED_ACCOUNTS.map((acc, index) => (
              <Pressable
                key={acc.id}
                onPress={() => handleAccountPress(acc)}
                style={({ pressed }) => [
                  styles.accountRow,
                  pressed && { opacity: 0.8 },
                  index === CONNECTED_ACCOUNTS.length - 1 && { borderBottomWidth: 0 }
                ]}>
                <View style={styles.accountIconBox}>
                  <MaterialCommunityIcons name={acc.icon as any} size={22} color={acc.color} />
                </View>

                <View style={styles.accountTextContent}>
                  <Text style={styles.accountRowName} numberOfLines={1}>{acc.name}</Text>
                  <Text style={styles.accountRowHandle} numberOfLines={1}>{acc.handle}</Text>
                </View>

                <View style={styles.accountRowRight}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{acc.status}</Text>
                  </View>
                  <View style={styles.manageBtn}>
                    <Text style={styles.manageBtnText}>{acc.action}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Brand Assets Card */}
        <View style={styles.proCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.headerIconCircle, { backgroundColor: '#FF6B6B' }]}>
              <MaterialCommunityIcons name="palette-outline" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Brand Identity</Text>
              <Text style={styles.sectionSubtitle}>Customize how your posts appear to others.</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Global Hashtags</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={hashtags}
                onChangeText={setHashtags}
                placeholder="#RealEstate #LuxuryLiving"
                placeholderTextColor="#94A3B8"
                multiline
              />
              <MaterialCommunityIcons name="pound" size={18} color={colors.textMuted} style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Brand Primary Color</Text>
            <View style={styles.colorPickerContainer}>
              <View style={[styles.colorBox, { backgroundColor: brandColor }]}>
                <View style={styles.colorBoxInner} />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <TextInput
                  style={[styles.input, styles.colorInput]}
                  value={brandColor}
                  onChangeText={setBrandColor}
                  placeholder="#0B2341"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>

          <View style={styles.toggleRowPremium}>
            <View style={styles.toggleTextContent}>
              <Text style={styles.toggleTitle}>Media Watermarking</Text>
              <Text style={styles.toggleDesc}>Automatically add your logo to all assets.</Text>
            </View>
            <Switch
              value={watermark}
              onValueChange={setWatermark}
              trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E8F0"
            />
          </View>
        </View>

        {/* Auto-Publishing Rules Card */}
        <View style={styles.proCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.headerIconCircle, { backgroundColor: '#4DABF7' }]}>
              <MaterialCommunityIcons name="robot-outline" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Automation Rules</Text>
              <Text style={styles.sectionSubtitle}>Configure AI-driven posting behavior.</Text>
            </View>
          </View>

          <View style={styles.rulesList}>
            {AUTO_RULES.map((r) => (
              <View
                key={r.key}
                style={styles.premiumRuleItem}>
                <View style={styles.ruleInfo}>
                  <Text style={styles.premiumRuleLabel}>{r.label}</Text>
                </View>
                <Switch
                  value={rules[r.key] ?? r.value}
                  onValueChange={(v) => setRule(r.key, v)}
                  trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E2E8F0"
                />
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

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

      {/* Unified Account Action Modal (Bottom Sheet Style) */}
      <Modal
        visible={!!activeAccount}
        transparent
        animationType="slide">
        <View style={styles.bottomSheetOverlay}>
          <Pressable style={styles.flex1} onPress={closeAccountModal} />
          <View style={[styles.bottomSheetContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={[styles.platformIconContainer, { backgroundColor: colors.surfaceSoft, shadowOpacity: 0 }]}>
                <MaterialCommunityIcons name={activeAccount?.icon as any} size={28} color={colors.textPrimary} />
              </View>
              <Text style={styles.modalTitleSm}>Edit {activeAccount?.name}</Text>
              <Pressable onPress={closeAccountModal} style={styles.modalCloseBtn}>
                <MaterialCommunityIcons name="close" size={20} color={colors.textMuted} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.fieldLabel}>Username / Handle</Text>
                <View style={styles.premiumInputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    defaultValue={activeAccount?.handle}
                  />
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 24 }]}>Connection Status</Text>
                <Pressable
                  style={styles.dropdownTrigger}
                  onPress={() => setShowStatusPicker(!showStatusPicker)}>
                  <Text style={styles.dropdownText}>{selectedStatus}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textPrimary} />

                  {showStatusPicker && (
                    <View style={styles.dropdownMenu}>
                      {['Connected', 'Disconnected', 'Pending Verify'].map((status) => (
                        <Pressable
                          key={status}
                          onPress={() => {
                            setSelectedStatus(status);
                            setShowStatusPicker(false);
                          }}
                          style={styles.dropdownItem}>
                          {selectedStatus === status && (
                            <MaterialCommunityIcons name="check" size={16} color="#FFF" style={{ marginRight: 8 }} />
                          )}
                          <Text style={styles.dropdownItemText}>{status}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </Pressable>
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelBtn} onPress={closeAccountModal}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSaveBtn} onPress={closeAccountModal}>
                <MaterialCommunityIcons name="check" size={18} color="#FFF" />
                <Text style={styles.modalSaveText}>Update Account</Text>
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
  background: { flex: 1 },
  headerRow: {
    position: 'relative',
    zIndex: 10,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 12 },

  // Pro Card Styles
  proCard: {
    backgroundColor: colors.cardBackgroundSemi,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },

  // Accounts List (Optimized to fix wrap/clutter)
  accountsList: {
    gap: 0,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  accountIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  accountTextContent: {
    flex: 1,
    marginLeft: 12,
  },
  accountRowName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  accountRowHandle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  accountRowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    marginLeft: 8,
  },
  statusBadge: {
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  manageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBackground,
    minWidth: 70,
    alignItems: 'center',
  },
  manageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Field Groups
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  inputIcon: {
    position: 'absolute',
    right: 14,
    top: 13,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingRight: 40,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  colorBoxInner: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.surfaceIcon,
  },
  colorInput: {
    flex: 1,
  },
  toggleRowPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSoft,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  toggleTextContent: {
    flex: 1,
    marginRight: 10,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  toggleDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },

  // Rules List
  rulesList: {
    gap: 10,
  },
  premiumRuleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSoft,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  ruleInfo: {
    flex: 1,
    marginRight: 12,
  },
  premiumRuleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 32,
    padding: 32,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 15,
  },
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#0BA0B2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#0BA0B2',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  modalsubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '500',
  },
  modalBtn: {
    backgroundColor: colors.accentTeal,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },

  // Bottom Sheet Style Modal
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  flex1: { flex: 1 },
  bottomSheetContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 32,
    paddingTop: 8,
    minHeight: '75%', // Increased height to prevent clipping
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 24,
    elevation: 25,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    backgroundColor: colors.cardBorder,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  platformIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitleSm: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginLeft: 16,
  },
  modalCloseBtn: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    flex: 1, // Take up remaining space
    width: '100%',
    zIndex: 10,
  },
  premiumInputContainer: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  modalInput: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dropdownTrigger: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 50,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: '#57534E',
    borderRadius: 16,
    padding: 10,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 30,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 'auto', // Push to bottom
    paddingTop: 20,
    zIndex: 1,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontWeight: '800',
    fontSize: 15
  },
  modalSaveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: colors.accentTeal,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15
  }
  });
}
