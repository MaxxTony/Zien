import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface CreateCardModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreate: (type: 'work' | 'personal', name: string) => Promise<void>;
  initialType?: 'work' | 'personal';
}

export function CreateCardModal({ isVisible, onClose, onCreate, initialType = 'work' }: CreateCardModalProps) {
  const { colors, theme } = useAppTheme();
  const [cardType, setCardType] = useState<'work' | 'personal'>(initialType);
  const [profileName, setProfileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setCardType(initialType);
      setProfileName('');
    }
  }, [isVisible, initialType]);

  const handleSubmit = async () => {
    if (!profileName.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate(cardType, profileName);
      onClose();
    } catch (error) {
      console.error('Failed to create card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(11, 45, 62, 0.05)' }]}>
                  <MaterialCommunityIcons name="card-account-details-outline" size={20} color={colors.textPrimary} />
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>Create Digital Card</Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choose type and name your profile</Text>
                </View>
              </View>
              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
                <MaterialCommunityIcons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Card Type Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CARD TYPE</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.typeBtn,
                    {
                      borderColor: cardType === 'work' ? colors.textPrimary : colors.cardBorder,
                      backgroundColor: cardType === 'work' ? colors.accentTeal + '1A' : 'transparent',
                      borderWidth: cardType === 'work' ? 2 : 1.5,
                    },
                  ]}
                  onPress={() => setCardType('work')}>
                  <MaterialCommunityIcons
                    name="briefcase-outline"
                    size={24}
                    color={cardType === 'work' ? colors.textPrimary : colors.textSecondary}
                  />
                  <Text style={[
                    styles.typeText,
                    { color: cardType === 'work' ? colors.textPrimary : colors.textSecondary }
                  ]}>Work</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.typeBtn,
                    {
                      borderColor: cardType === 'personal' ? colors.textPrimary : colors.cardBorder,
                      backgroundColor: cardType === 'personal' ? colors.accentTeal + '1A' : 'transparent',
                      borderWidth: cardType === 'personal' ? 2 : 1.5,
                    },
                  ]}
                  onPress={() => setCardType('personal')}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={24}
                    color={cardType === 'personal' ? colors.textPrimary : colors.textSecondary}
                  />
                  <Text style={[
                    styles.typeText,
                    { color: cardType === 'personal' ? colors.textPrimary : colors.textSecondary }
                  ]}>Personal</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Name Input */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PROFILE NAME</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F7F9FC', borderColor: colors.cardBorder }]}>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  placeholder="e.g. Sales Executive"
                  placeholderTextColor={colors.textSecondary + '80'}
                  value={profileName}
                  onChangeText={setProfileName}
                  autoFocus
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.submitBtn,
                { backgroundColor: profileName.trim() ? colors.textPrimary : colors.cardBorder }
              ]}
              disabled={!profileName.trim() || isSubmitting}
              onPress={handleSubmit}>
              {isSubmitting ? (
                <ActivityIndicator color={colors.cardBackground} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="creation"
                    size={20}
                    color={profileName.trim() ? colors.cardBackground : colors.textSecondary}
                  />
                  <Text style={[
                    styles.submitBtnText,
                    { color: profileName.trim() ? colors.cardBackground : colors.textSecondary }
                  ]}>Create My Card</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  keyboardView: {
    width: '100%',
  },
  modalContent: {
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.8,
  },
  closeBtn: {
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    height: 80,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },
  typeBtnActive: {
    backgroundColor: 'rgba(11, 45, 62, 0.05)',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  inputContainer: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    fontWeight: '700',
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '900',
  },
});
