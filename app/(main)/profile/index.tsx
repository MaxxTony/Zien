import {
  AccountStatusCard,
  DangerZoneCard,
  ProfileCard,
  ProfileTabs,
  type ProfileTabKey,
  type StatusItem
} from '@/components/profile';
import LabeledInput from '@/components/ui/labeled-input';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
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

const ACCOUNT_STATUS_ITEMS: StatusItem[] = [
  { label: 'Email Verified', verified: true },
  { label: 'License Active', verified: true },
  { label: 'Enterprise Linked', verified: true },
];

const DEFAULT_SPECIALIZATIONS = [
  'Luxury Homes',
  'Commercial Retail',
  'Urban Lofts',
  'New Construction',
];

const LANGUAGE_OPTIONS = [
  'English (US)',
  'English (UK)',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Other',
];

const AVAILABLE_SPECIALIZATION_OPTIONS = [
  'Luxury Homes',
  'Commercial Retail',
  'Urban Lofts',
  'New Construction',
  'Coastal Properties',
  'Investment Properties',
  'First-Time Buyers',
  'Land & Development',
  'Rental Management',
  'International',
];

const MAX_YEARS_EXPERIENCE = 50;

function formatLicenseExpiry(date: Date): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('identity');
  const [specializations, setSpecializations] = useState<string[]>(DEFAULT_SPECIALIZATIONS);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [fullName, setFullName] = useState('John Olakoya');
  const [mobilePhone, setMobilePhone] = useState('+1 (555) 000-0000');
  const [professionalEmail, setProfessionalEmail] = useState('john@zien.ai');
  const [personalWebsite, setPersonalWebsite] = useState('www.johnolakoya.com');
  const [professionalBio, setProfessionalBio] = useState(
    'Over 12 years of experience in high-end real estate brokerage. Specialized in coastal properties and architectural landmarks.'
  );

  const [licenseId, setLicenseId] = useState('CA-BROKER-98210');
  const [licenseExpiry, setLicenseExpiry] = useState(() => {
    const d = new Date();
    d.setFullYear(2027, 11, 31);
    return d;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [yearsExperience, setYearsExperience] = useState('12');
  const [preferredLanguage, setPreferredLanguage] = useState('English (US)');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);

  const handleYearsChange = useCallback((text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits === '') {
      setYearsExperience('');
      return;
    }
    const num = parseInt(digits, 10);
    if (num > MAX_YEARS_EXPERIENCE) {
      setYearsExperience(String(MAX_YEARS_EXPERIENCE));
    } else {
      setYearsExperience(digits);
    }
  }, []);

  const removeSkill = (index: number) => {
    setSpecializations((prev) => prev.filter((_, i) => i !== index));
  };

  const pickFromGallery = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photos to choose a profile image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }, []);

  const pickFromCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access to take a profile photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }, []);

  const showAvatarImageOptions = useCallback(() => {
    Alert.alert('Change photo', 'Choose source', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Gallery', onPress: pickFromGallery },
      { text: 'Camera', onPress: pickFromCamera },
    ]);
  }, [pickFromGallery, pickFromCamera]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'professional':
        return (
          <ProfileCard style={styles.mainCard}>
            <Text style={styles.sectionTitle}>Licensing & Accreditation</Text>
          
              <View style={styles.halfField}>
                <LabeledInput
                  label="Real Estate License ID"
                  value={licenseId}
                  onChangeText={setLicenseId}
                  placeholder="e.g. CA-BROKER-98210"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.inputLabel}>License Expiry</Text>
                <Pressable
                  style={styles.datePickerTouchable}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>{formatLicenseExpiry(licenseExpiry)}</Text>
                  <MaterialCommunityIcons name="calendar" size={18} color={Theme.iconMuted} />
                </Pressable>
              </View>
            
          
              <View style={styles.halfField}>
                <LabeledInput
                  label={`Years of Experience (max ${MAX_YEARS_EXPERIENCE})`}
                  value={yearsExperience}
                  onChangeText={handleYearsChange}
                  placeholder="0"
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.inputLabel}>Preferred Language</Text>
                <Pressable
                  style={styles.datePickerTouchable}
                  onPress={() => setShowLanguageModal(true)}
                >
                  <Text style={styles.datePickerText}>{preferredLanguage}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color={Theme.iconMuted} />
                </Pressable>
              </View>
          
            <Text style={[styles.label, { marginTop: 10}]}>Your specializations</Text>
            <Text style={styles.specializationHint}>Tap "Add specialization" to add, or tap × on a chip to remove.</Text>
            <View style={styles.specializationChipsWrap}>
              {specializations.map((label, index) => (
                <View key={`${label}-${index}`} style={styles.specChip}>
                  <Text style={styles.specChipText} numberOfLines={1}>{label}</Text>
                  <Pressable hitSlop={8} onPress={() => removeSkill(index)} style={styles.specChipRemove}>
                    <MaterialCommunityIcons name="close" size={14} color={Theme.textSecondary} />
                  </Pressable>
                </View>
              ))}
            </View>
            <Pressable
              style={styles.addSpecializationButton}
              onPress={() => setShowSpecializationModal(true)}
            >
              <MaterialCommunityIcons name="plus" size={20} color={Theme.accentTeal} />
              <Text style={styles.addSpecializationText}>Add specialization</Text>
            </Pressable>

            <Modal visible={showDatePicker} transparent animationType="slide">
              <View style={styles.modalBackdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowDatePicker(false)} />
                <View style={[styles.datePickerSheet, { paddingBottom: insets.bottom + 16 }]}>
                  <View style={styles.datePickerHeader}>
                    <Text style={styles.datePickerSheetTitle}>License Expiry</Text>
                    <Pressable
                      onPress={() => setShowDatePicker(false)}
                      style={styles.datePickerDoneButton}
                    >
                      <Text style={styles.datePickerDoneText}>Done</Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={licenseExpiry}
                    mode="date"
                    display="spinner"
                    onChange={(_, selectedDate) => {
                      if (selectedDate) setLicenseExpiry(selectedDate);
                    }}
                    minimumDate={new Date()}
                    style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
                  />
                </View>
              </View>
            </Modal>

            <Modal visible={showLanguageModal} transparent animationType="slide">
              <View style={styles.modalBackdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowLanguageModal(false)} />
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
                  <Text style={styles.modalTitle}>Preferred Language</Text>
                  <ScrollView style={styles.modalList} keyboardShouldPersistTaps="handled">
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <Pressable
                        key={lang}
                        style={styles.modalOption}
                        onPress={() => {
                          setPreferredLanguage(lang);
                          setShowLanguageModal(false);
                        }}
                      >
                        <Text style={styles.modalOptionText}>{lang}</Text>
                        {preferredLanguage === lang && (
                          <MaterialCommunityIcons name="check" size={22} color={Theme.accentTeal} />
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            <Modal visible={showSpecializationModal} transparent animationType="slide">
              <View style={styles.modalBackdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowSpecializationModal(false)} />
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
                  <Text style={styles.modalTitle}>Add specialization</Text>
                  <Text style={styles.modalSubtitle}>Choose one to add to your list.</Text>
                  <ScrollView style={styles.modalList} keyboardShouldPersistTaps="handled">
                    {AVAILABLE_SPECIALIZATION_OPTIONS.filter((s) => !specializations.includes(s)).map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.modalOption}
                        onPress={() => {
                          setSpecializations((p) => [...p, opt]);
                          setShowSpecializationModal(false);
                        }}
                      >
                        <Text style={styles.modalOptionText}>{opt}</Text>
                        <MaterialCommunityIcons name="plus" size={20} color={Theme.accentTeal} />
                      </Pressable>
                    ))}
                    {AVAILABLE_SPECIALIZATION_OPTIONS.filter((s) => !specializations.includes(s)).length === 0 && (
                      <Text style={styles.noOptionsText}>All specializations added.</Text>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </ProfileCard>
        );
      case 'security':
        return (
          <>
            <ProfileCard style={styles.mainCard}>
              <Text style={styles.sectionTitle}>Password Architecture</Text>
              <View style={styles.fieldGroup}>
                <LabeledInput
                  label="Current Security Key"
                  placeholder="••••••••"
                  secureTextEntry
                />
                <LabeledInput
                  label="New Security Key"
                  placeholder="Min. 12 characters"
                  secureTextEntry
                />
              </View>
            </ProfileCard>
            <ProfileCard style={styles.mainCard}>
              <View style={styles.mfaRow}>
                <View style={styles.mfaIconWrap}>
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={28}
                    color={Theme.accentTeal}
                  />
                </View>
                <View style={styles.mfaContent}>
                  <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.cardSubtitle}>
                    Add an extra layer of protection to your brokerage account.
                  </Text>
                  <Pressable style={styles.outlineButton}>
                    <Text style={styles.outlineButtonText}>Configure MFA</Text>
                  </Pressable>
                </View>
              </View>
            </ProfileCard>
          </>
        );
      case 'organization':
        return (
          <ProfileCard style={styles.mainCard}>
            <View style={styles.orgBanner}>
              <View style={styles.orgIcon}>
                <MaterialCommunityIcons
                  name="office-building"
                  size={24}
                  color={Theme.textOnAccent}
                />
              </View>
              <View style={styles.orgText}>
                <Text style={styles.orgTitle}>ZIEN Global Enterprise</Text>
                <Text style={styles.orgSubtitle}>
                  Enterprise License Mapped: 'zien.ai/internal-ops'
                </Text>
              </View>
            </View>
          
              <View style={styles.halfField}>
                <Text style={styles.label}>Associated Brokerage</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.valueBoxText}>Zien Real Estate Group Inc.</Text>
                </View>
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Account Manager</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.valueBoxText}>Sarah Thompson</Text>
                </View>
              </View>
         
          </ProfileCard>
        );
      default:
        return (
          <ProfileCard style={styles.mainCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode="cover" />
                  ) : (
                    <Text style={styles.avatarText}>JO</Text>
                  )}
                </View>
                <Pressable style={styles.avatarCamera} onPress={showAvatarImageOptions}>
                  <MaterialCommunityIcons name="camera" size={14} color={Theme.textOnAccent} />
                </Pressable>
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.sectionTitle}>Personal Identity</Text>
                <Text style={styles.cardSubtitle}>
                  Your public profile photo is visible to clients and team members.
                </Text>
                <View style={styles.avatarActions}>
                  <Pressable style={styles.linkButton}>
                    <MaterialCommunityIcons name="upload" size={16} color={Theme.accentTeal} />
                    <Text style={styles.linkButtonText}>Replace Avatar</Text>
                  </Pressable>
                  <Pressable onPress={() => setAvatarUri(null)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Full Legal Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full legal name"
                returnKeyType="next"
                rightInputElement={
                  <MaterialCommunityIcons name="account" size={18} color={Theme.iconMuted} />
                }
              />
              <LabeledInput
                label="Mobile Phone"
                value={mobilePhone}
                onChangeText={setMobilePhone}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                returnKeyType="next"
                rightInputElement={
                  <MaterialCommunityIcons name="phone" size={18} color={Theme.iconMuted} />
                }
              />
              <LabeledInput
                label="Professional Email"
                value={professionalEmail}
                onChangeText={setProfessionalEmail}
                placeholder="email@example.com"
                keyboardType="email-address"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                rightInputElement={
                  <MaterialCommunityIcons name="email-outline" size={18} color={Theme.iconMuted} />
                }
              />
              <LabeledInput
                label="Personal Website"
                value={personalWebsite}
                onChangeText={setPersonalWebsite}
                placeholder="www.example.com"
                keyboardType="url"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                rightInputElement={
                  <MaterialCommunityIcons name="web" size={18} color={Theme.iconMuted} />
                }
              />
            </View>
            <Text style={[styles.label, { marginTop: 10}]}>Professional Biography</Text>
            <TextInput
              style={styles.bioInput}
              placeholder="Tell clients about your experience..."
              placeholderTextColor={Theme.inputPlaceholder}
              value={professionalBio}
              onChangeText={setProfessionalBio}
              multiline
              numberOfLines={4}
              returnKeyType="default"
              blurOnSubmit={false}
            />
          </ProfileCard>
        );
    }
  }, [
    activeTab,
    specializations,
    avatarUri,
    showAvatarImageOptions,
    fullName,
    mobilePhone,
    professionalEmail,
    personalWebsite,
    professionalBio,
    licenseId,
    licenseExpiry,
    showDatePicker,
    yearsExperience,
    preferredLanguage,
    showLanguageModal,
    showSpecializationModal,
    handleYearsChange,
    insets.bottom,
  ]);

  const bottomBarHeight = 56 + insets.bottom + 16;

  return (
    <LinearGradient
      colors={[...Theme.backgroundGradient]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}
    >
      <View style={styles.topHeader}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Professional Profile</Text>
          <Text style={styles.subtitle}>
            Manage your digital identity, security protocols, and brokerage credentials.
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottomBarHeight },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {tabContent}

          <View style={styles.sideCards}>
            <AccountStatusCard
              profileStrengthPercent={92}
              items={ACCOUNT_STATUS_ITEMS}
            />
            <DangerZoneCard
              onButtonPress={() => {}}
            />
          </View>
        </ScrollView>

        <View style={[styles.fixedBottom, { paddingBottom: insets.bottom + 12 }]}>
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
            <MaterialCommunityIcons name="content-save-outline" size={20} color={Theme.textOnAccent} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Theme.surfaceSoft,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  scrollContent: {
    paddingHorizontal: 18,
    gap: 16,
    paddingTop: 4,
  },
  fixedBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: 'rgba(248, 251, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Theme.cardBorder,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Theme.accentDark,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.textOnAccent,
  },
  mainCard: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.textPrimary,
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  fieldGroup: {
    gap: 14,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  halfField: {
    flex: 1,
    marginTop:10
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  datePickerTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.inputBackground,
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderInput,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  datePickerText: {
    fontSize: 15,
    color: Theme.textPrimary,
  },
  specializationHint: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  specializationChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.surfaceIcon,
    borderRadius: 999,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
  },
  specChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
    maxWidth: 140,
  },
  specChipRemove: {
    padding: 2,
  },
  addSpecializationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.accentTeal,
    borderStyle: 'dashed',
  },
  addSpecializationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.accentTeal,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  datePickerSheet: {
    backgroundColor: Theme.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  datePickerSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  datePickerDoneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  datePickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.accentTeal,
  },
  iosDatePicker: {
    height: 200,
  },
  modalContent: {
    backgroundColor: Theme.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginBottom: 12,
  },
  modalList: {
    maxHeight: 320,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Theme.rowBorder,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  noOptionsText: {
    fontSize: 14,
    color: Theme.textSecondary,
    paddingVertical: 16,
  },
  avatarSection: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: Theme.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.textOnAccent,
  },
  avatarCamera: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: {
    flex: 1,
  },
  avatarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.accentTeal,
  },
  removeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.danger,
  },
  bioInput: {
    backgroundColor: Theme.inputBackground,
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
    borderColor: Theme.borderInput,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Theme.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mfaRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  mfaIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Theme.cardBackgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mfaContent: {
    flex: 1,
  },
  outlineButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.surfaceSoft,
    marginTop: 8,
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  orgBanner: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: Theme.rowBorder,
  },
  orgIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Theme.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgText: {
    flex: 1,
  },
  orgTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  orgSubtitle: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 4,
  },
  valueBox: {
    backgroundColor: Theme.surfaceIcon,
    borderRadius: Theme.inputBorderRadius,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  valueBoxText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  sideCards: {
    gap: 16,
  },
});
