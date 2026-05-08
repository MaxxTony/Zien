import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import PhoneInput from 'react-native-phone-number-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Simple mapping for common country codes to ISO
const COUNTRY_CODE_TO_ISO: Record<string, string> = {
  '+1': 'US',
  '+91': 'IN',
  '+44': 'GB',
  '+61': 'AU',
  '+971': 'AE',
  '+65': 'SG',
  '+1-CA': 'CA',
  // Add more as needed or use a library
};

const getIsoCode = (code: string | null) => {
  if (!code) return 'IN';
  return COUNTRY_CODE_TO_ISO[code] || 'IN';
};

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  availableGroups: string[];
  availableTags: string[];
  loading?: boolean;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
  isEditing = false,
  availableGroups,
  availableTags,
  loading = false,
}) => {
  const { colors, theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const phoneInputRef = React.useRef<PhoneInput>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('');
  const [tag, setTag] = useState('');
  const [countryCodeISO, setCountryCodeISO] = useState<any>('US');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [activePicker, setActivePicker] = useState<'group' | 'tag' | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');

  useEffect(() => {
    if (!activePicker) {
      setPickerSearch('');
    }
  }, [activePicker]);

  const filteredPickerOptions = (activePicker === 'group' ? availableGroups : availableTags).filter(opt =>
    opt.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  useEffect(() => {
    if (visible) {
      setErrors({});
      if (initialData) {
        setFirstName(initialData.firstName || '');
        setLastName(initialData.lastName || '');
        setEmail(initialData.email || '');

        // Correctly prefill the phone number by stripping the country prefix if it's there
        const rawPhone = initialData.phone || '';
        const callingCode = (initialData.countryCode || '').replace('+', '');
        if (callingCode && rawPhone.startsWith(callingCode)) {
          setPhone(rawPhone.slice(callingCode.length));
        } else {
          setPhone(rawPhone);
        }

        setGroup(initialData.group || '');
        setTag(initialData.tag || '');
        setCountryCodeISO(getIsoCode(initialData.countryCode));
      } else {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setGroup('');
        setTag('');
        setCountryCodeISO('US');
      }
    }
  }, [visible, initialData]);

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    // 1. Basic Required Field Check
    if (!firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required.';

    // 2. Name Validation (No numbers, as per previous screen rules)
    const nameRegex = /^[A-Za-z\s.-]+$/;
    if (firstName.trim() && !nameRegex.test(firstName)) {
      newErrors.firstName = 'Can only contain letters, spaces, dots, or hyphens.';
    }
    if (lastName.trim() && !nameRegex.test(lastName)) {
      newErrors.lastName = 'Can only contain letters, spaces, dots, or hyphens.';
    }

    // 3. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 4. Phone Validation (Library Check)
    if (phone && !phoneInputRef.current?.isValidNumber(phone)) {
      const countryCode = phoneInputRef.current?.getCountryCode();
      newErrors.phone = `Invalid number for ${countryCode || 'selected country'}.`;
    }

    // 5. Metadata Selection Check
    if (!group) newErrors.group = 'Please select a Group.';
    if (!tag) newErrors.tag = 'Please select a Tag.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const callingCode = phoneInputRef.current?.getCallingCode() || '91';
    const nationalNumber = phone.replace(/\D/g, '');
    const fullNumber = callingCode + nationalNumber;

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: fullNumber,
      countryCode: `+${callingCode}`,
      group,
      tag,
    });
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const styles = getStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fullPageModal}>
        <View style={[styles.modalContent, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>{isEditing ? 'Edit Contact' : 'Add New Contact'}</Text>
              <Text style={styles.headerSubtitle}>{isEditing ? 'Update lead details and tags' : 'Register a new lead into your CRM'}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior='automatic'
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
            >

              <View style={styles.formCol}>
                <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  value={firstName}
                  onChangeText={(t) => { setFirstName(t); clearError('firstName'); }}
                  placeholder="e.g. Jessica"
                  placeholderTextColor={colors.textMuted}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              </View>
              <View style={styles.formCol}>
                <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  value={lastName}
                  onChangeText={(t) => { setLastName(t); clearError('lastName'); }}
                  placeholder="e.g. Miller"
                  placeholderTextColor={colors.textMuted}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
              </View>


              <View style={styles.fullWidthCol}>
                <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={email}
                  onChangeText={(t) => { setEmail(t); clearError('email'); }}
                  placeholder="name@email.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.fullWidthCol}>
                <Text style={styles.label}>Phone Number</Text>
                <PhoneInput
                  key={initialData ? initialData.email : 'new-contact'}
                  ref={phoneInputRef}
                  defaultValue={phone}
                  defaultCode={countryCodeISO}
                  layout="second"
                  onChangeText={(t) => { setPhone(t); clearError('phone'); }}
                  containerStyle={[styles.phoneInputWrapper, errors.phone && styles.inputError]}
                  textContainerStyle={styles.phoneTextContainer}
                  textInputStyle={styles.phoneTextInput}
                  codeTextStyle={styles.phoneCodeText}
                  flagButtonStyle={styles.phoneFlagButton}
                  placeholder="Phone Number"
                  withDarkTheme={theme === 'dark'}
                  textInputProps={{
                    maxLength: 15,
                    keyboardType: 'phone-pad',
                  }}
                  countryPickerProps={{
                    withFilter: true,
                    withAlphaFilter: true,
                    renderFlagButton: (props: any) => {
                      const code = (props.countryCode || 'US').toUpperCase();
                      const emoji = code.replace(/./g, (c: string) =>
                        String.fromCodePoint(0x1F1A5 + c.charCodeAt(0))
                      );
                      return <Text style={{ fontSize: 22, lineHeight: 30, marginLeft: 8 }}>{emoji}</Text>;
                    },
                    theme: theme === 'dark' ? {
                      backgroundColor: '#000000',
                      onBackgroundTextColor: '#FFFFFF',
                      fontSize: 15,
                      filterPlaceholderTextColor: '#94A3B8',
                    } : {
                      backgroundColor: '#FFFFFF',
                      onBackgroundTextColor: '#0F172A',
                      fontSize: 15,
                      filterPlaceholderTextColor: '#64748B',
                    },
                    modalProps: {
                      statusBarTranslucent: true,
                    },
                    closeButtonStyle: {
                      marginTop: Platform.OS === 'android' ? insets.top + 10 : 0,
                    },
                    filterProps: {
                      placeholderTextColor: theme === 'dark' ? '#94A3B8' : '#64748B',
                      style: {
                        color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                        fontSize: 15,
                        flex: 1,
                        marginTop: Platform.OS === 'android' ? insets.top + 10 : 0,
                      }
                    }
                  }}
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>


              <View style={styles.formCol}>
                <Text style={styles.label}>Group <Text style={styles.required}>*</Text></Text>
                <Pressable
                  style={[styles.select, errors.group && styles.inputError]}
                  onPress={() => { setActivePicker(activePicker === 'group' ? null : 'group'); clearError('group'); }}
                >
                  <Text style={[styles.selectText, !group && styles.placeholderText]}>{group || 'Select Group'}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textPrimary} />
                </Pressable>
                {errors.group && <Text style={styles.errorText}>{errors.group}</Text>}
              </View>
              <View style={styles.formCol}>
                <Text style={styles.label}>Tag <Text style={styles.required}>*</Text></Text>
                <Pressable
                  style={[styles.select, errors.tag && styles.inputError]}
                  onPress={() => { setActivePicker(activePicker === 'tag' ? null : 'tag'); clearError('tag'); }}
                >
                  <Text style={[styles.selectText, !tag && styles.placeholderText]}>{tag || 'Select Tag'}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textPrimary} />
                </Pressable>
                {errors.tag && <Text style={styles.errorText}>{errors.tag}</Text>}
              </View>

            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, loading && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveText}>{isEditing ? 'Update' : 'Save'}</Text>
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>

        {/* Selection Sub-Modal (Searchable) */}
        <Modal
          visible={activePicker !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setActivePicker(null)}
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select {activePicker === 'group' ? 'Group' : 'Tag'}</Text>
                <Pressable onPress={() => setActivePicker(null)} style={styles.pickerCloseBtn}>
                  <MaterialCommunityIcons name="close" size={22} color={colors.textPrimary} />
                </Pressable>
              </View>

              <View style={styles.pickerSearchBox}>
                <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
                <TextInput
                  style={styles.pickerSearchInput}
                  placeholder="Search..."
                  placeholderTextColor={colors.textMuted}
                  value={pickerSearch}
                  onChangeText={setPickerSearch}
                />
              </View>

              <ScrollView style={styles.pickerList} keyboardShouldPersistTaps="handled" keyboardDismissMode='on-drag'>
                {filteredPickerOptions.length === 0 ? (
                  <Text style={styles.noResults}>No matches found</Text>
                ) : (
                  filteredPickerOptions.map(opt => {
                    const isSelected = activePicker === 'group' ? group === opt : tag === opt;
                    return (
                      <Pressable
                        key={opt}
                        style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                        onPress={() => {
                          if (activePicker === 'group') setGroup(opt);
                          else setTag(opt);
                          setActivePicker(null);
                        }}
                      >
                        <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextActive]}>{opt}</Text>
                        {isSelected && <MaterialCommunityIcons name="check-circle" size={20} color={colors.accentTeal} />}
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  fullPageModal: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  formCol: {
    flex: 1,
    marginBottom: 24
  },
  fullWidthCol: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  required: {
    color: colors.danger || '#EF4444',
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  inputError: {
    borderColor: colors.danger || '#EF4444',
  },
  errorText: {
    color: colors.danger || '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
  phoneInputWrapper: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    height: 54,
    overflow: 'hidden',
  },
  phoneTextContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  phoneTextInput: {
    fontSize: 16,
    marginLeft: 10,
    color: colors.textPrimary,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  phoneCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  phoneFlagButton: {
    width: 100,
    backgroundColor: colors.surfaceIcon,
    borderRightWidth: 1.5,
    borderRightColor: colors.cardBorder,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  placeholderText: {
    color: colors.textMuted,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  pickerContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    height: 520,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 30,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  pickerCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceIcon,
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  pickerSearchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  pickerList: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
  },
  pickerItemActive: {
    backgroundColor: colors.surfaceIcon,
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  pickerItemTextActive: {
    color: colors.textPrimary,
    fontWeight: '900',
  },
  noResults: {
    textAlign: 'center',
    marginVertical: 40,
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 20,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.rowBorder,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  saveBtn: {
    backgroundColor: '#0B2D3E', // Keep dark accent button for premium feel
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
