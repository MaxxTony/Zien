import LabeledInput from '@/components/ui/labeled-input';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DEFAULT_PROFILE_CARD,
  ProfileCard,
  type ProfileCardData,
} from './_components/ProfileCard';
import { ZienCardScreenShell } from './_components/ZienCardScreenShell';

type FormTab = 'personal' | 'branding' | 'contact' | 'additional';

const TABS: { id: FormTab; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { id: 'personal', label: 'Personal', icon: 'account-outline' },
  { id: 'branding', label: 'Branding', icon: 'image-outline' },
  { id: 'contact', label: 'Contact', icon: 'share-variant' },
  { id: 'additional', label: 'Additional', icon: 'file-document-outline' },
];

function formToCardData(form: FormState): ProfileCardData {
  return {
    fullName: form.fullName,
    title: form.title,
    legalRole: form.legalRole,
    license: form.license,
    company: form.company,
    address: form.address,
    phone: form.phone,
    email: form.email,
    website: form.website,
    instagram: form.instagram,
    linkedin: form.linkedin,
  };
}

type FormState = ProfileCardData & {
  bio: string;
  twitter: string;
  facebook: string;
  profilePhotoUri: string;
  companyLogoUri: string;
};

const INITIAL_FORM: FormState = {
  ...DEFAULT_PROFILE_CARD,
  bio: 'Premier luxury real estate advisor specializing in Bel-Air and Malibu estates.',
  twitter: '@becker_tweets',
  facebook: 'facebook.com/becker.realestate',
  profilePhotoUri: '',
  companyLogoUri: '',
};

export default function ZienCardBasicInformationScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FormTab>('personal');
  const [isWork, setIsWork] = useState(true);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const cardData = formToCardData(form);

  const handleSave = () => {
    // TODO: persist form
  };

  const pickProfilePhoto = useCallback(async () => {
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
      setForm((p) => ({ ...p, profilePhotoUri: result.assets[0].uri }));
    }
  }, []);

  const pickCompanyLogo = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photos to choose a logo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setForm((p) => ({ ...p, companyLogoUri: result.assets[0].uri }));
    }
  }, []);

  return (
    <ZienCardScreenShell
      title="Basic Information"
      subtitle="Build your profile step-by-step.">
      <View style={styles.main}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 200 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Card preview */}
          <View style={styles.cardWrap}>
            <ProfileCard
            card={cardData}
            avatarUri={form.profilePhotoUri?.trim() || undefined}
            companyLogoUri={form.companyLogoUri?.trim() || undefined}
          />
          </View>

          {/* Work / Personal — compact, above tabs */}
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.togglePill, isWork && styles.togglePillActive]}
              onPress={() => setIsWork(true)}>
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={16}
                color={isWork ? '#FFFFFF' : '#5B6B7A'}
              />
              <Text style={[styles.toggleText, isWork && styles.toggleTextActive]}>Work</Text>
            </Pressable>
            <Pressable
              style={[styles.togglePill, !isWork && styles.togglePillActive]}
              onPress={() => setIsWork(false)}>
              <MaterialCommunityIcons
                name="account-outline"
                size={16}
                color={!isWork ? '#FFFFFF' : '#5B6B7A'}
              />
              <Text style={[styles.toggleText, !isWork && styles.toggleTextActive]}>Personal</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsWrap}
          style={styles.tabsScroll}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}>
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={18}
                  color={active ? '#FFFFFF' : '#5B6B7A'}
                />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]} numberOfLines={1}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Form sections */}
        <View style={styles.formCard}>
          {activeTab === 'personal' && (
            <>
              <Text style={styles.sectionTitle}>Who are you?</Text>
              <LabeledInput
                label="Full Name *"
                value={form.fullName}
                onChangeText={(v) => setForm((p) => ({ ...p, fullName: v }))}
                placeholder="Your full name"
                containerStyle={styles.field}
              />
              <LabeledInput
                label="Professional Title *"
                value={form.title}
                onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
                placeholder="e.g. Team Lead"
                containerStyle={styles.field}
              />
              {isWork && (
                <>
                  <LabeledInput
                    label="Role / Designation"
                    value={form.legalRole}
                    onChangeText={(v) => setForm((p) => ({ ...p, legalRole: v }))}
                    placeholder="e.g. REALTOR"
                    containerStyle={styles.field}
                  />
                  <LabeledInput
                    label="Company Name"
                    value={form.company}
                    onChangeText={(v) => setForm((p) => ({ ...p, company: v }))}
                    placeholder="Company or brokerage"
                    containerStyle={styles.field}
                  />
                </>
              )}
            </>
          )}

          {activeTab === 'branding' && (
            <>
              <Text style={styles.sectionTitle}>Visual Identity</Text>
              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>Profile Photo</Text>
                <Text style={styles.uploadHint}>
                  {form.profilePhotoUri ? 'Change or remove below.' : 'Tap to pick from gallery. Card above updates instantly.'}
                </Text>
                {form.profilePhotoUri ? (
                  <View style={styles.imagePreviewWrap}>
                    <Image source={{ uri: form.profilePhotoUri }} style={styles.previewImage} />
                    <View style={styles.previewActions}>
                      <Pressable style={styles.previewActionBtn} onPress={pickProfilePhoto}>
                        <MaterialCommunityIcons name="image-edit-outline" size={20} color="#0B2D3E" />
                        <Text style={styles.previewActionText}>Replace</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.previewActionBtn, styles.previewActionBtnDanger]}
                        onPress={() => setForm((p) => ({ ...p, profilePhotoUri: '' }))}>
                        <MaterialCommunityIcons name="delete-outline" size={20} color="#DC2626" />
                        <Text style={[styles.previewActionText, styles.previewActionTextDanger]}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Pressable style={styles.uploadBox} onPress={pickProfilePhoto}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={32} color="#9AA7B6" />
                    <Text style={styles.uploadBoxText}>Upload Photo</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>Company Logo</Text>
                <Text style={styles.uploadHint}>
                  {form.companyLogoUri ? 'Change or remove below.' : 'Shows in top-left on card. Tap to pick from gallery.'}
                </Text>
                {form.companyLogoUri ? (
                  <View style={styles.imagePreviewWrap}>
                    <Image source={{ uri: form.companyLogoUri }} style={styles.previewImageLogo}  />
                    <View style={styles.previewActions}>
                      <Pressable style={styles.previewActionBtn} onPress={pickCompanyLogo}>
                        <MaterialCommunityIcons name="image-edit-outline" size={20} color="#0B2D3E" />
                        <Text style={styles.previewActionText}>Replace</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.previewActionBtn, styles.previewActionBtnDanger]}
                        onPress={() => setForm((p) => ({ ...p, companyLogoUri: '' }))}>
                        <MaterialCommunityIcons name="delete-outline" size={20} color="#DC2626" />
                        <Text style={[styles.previewActionText, styles.previewActionTextDanger]}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Pressable style={styles.uploadBox} onPress={pickCompanyLogo}>
                    <MaterialCommunityIcons name="image-plus" size={32} color="#9AA7B6" />
                    <Text style={styles.uploadBoxText}>Upload Logo</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}

          {activeTab === 'contact' && (
            <>
              <Text style={styles.sectionTitle}>How can people reach you?</Text>
              <LabeledInput
                label="Phone Number"
                value={form.phone}
                onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                placeholder="(000) 000-0000"
                keyboardType="phone-pad"
                containerStyle={styles.field}
              />
              <LabeledInput
                label="Email Address"
                value={form.email}
                onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.field}
              />
              <LabeledInput
                label="Website"
                value={form.website}
                onChangeText={(v) => setForm((p) => ({ ...p, website: v }))}
                placeholder="https://..."
                autoCapitalize="none"
                containerStyle={styles.field}
              />
              <Text style={styles.subSectionTitle}>Social Profiles</Text>
              <LabeledInput
                label="Instagram"
                value={form.instagram}
                onChangeText={(v) => setForm((p) => ({ ...p, instagram: v }))}
                placeholder="@username or URL"
                autoCapitalize="none"
                containerStyle={styles.field}
              />
              <LabeledInput
                label="LinkedIn"
                value={form.linkedin}
                onChangeText={(v) => setForm((p) => ({ ...p, linkedin: v }))}
                placeholder="linkedin.com/in/..."
                autoCapitalize="none"
                containerStyle={styles.field}
              />
              <LabeledInput
                label="Twitter / X"
                value={form.twitter}
                onChangeText={(v) => setForm((p) => ({ ...p, twitter: v }))}
                placeholder="@username"
                autoCapitalize="none"
                containerStyle={styles.field}
              />
              <LabeledInput
                label="Facebook"
                value={form.facebook}
                onChangeText={(v) => setForm((p) => ({ ...p, facebook: v }))}
                placeholder="facebook.com/..."
                autoCapitalize="none"
                containerStyle={styles.field}
              />
            </>
          )}

          {activeTab === 'additional' && (
            <>
              <Text style={styles.sectionTitle}>Tell us more</Text>
              <LabeledInput
                label="License / ID Number"
                value={form.license}
                onChangeText={(v) => setForm((p) => ({ ...p, license: v }))}
                placeholder="e.g. DRE #01928374"
                containerStyle={styles.field}
              />
              <View style={styles.field}>
                <Text style={styles.label}>Professional Bio</Text>
                <TextInput
                  style={styles.bioInput}
                  value={form.bio}
                  onChangeText={(v) => setForm((p) => ({ ...p, bio: v }))}
                  placeholder="Short bio for your card..."
                  placeholderTextColor="#9AA7B6"
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                />
                <Text style={styles.charCount}>{form.bio.length} / 200</Text>
              </View>
              <LabeledInput
                label="Address / Service Area"
                value={form.address}
                onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
                placeholder="e.g. Beverly Hills, CA"
                containerStyle={styles.field}
              />
            </>
          )}
        </View>
        </ScrollView>

        {/* Save Changes — fixed at bottom */}
        <View style={[styles.saveBar]}>
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </Pressable>
        </View>
      </View>
    </ZienCardScreenShell>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8 },
  saveBar: {
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: 'rgba(247, 251, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#E3ECF4',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0B2D3E',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  togglePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  togglePillActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B6B7A',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  cardWrap: {
    marginBottom: 18,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
  },
  tabsScroll: { marginHorizontal: -18 },
  tabsWrap: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  tabActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B6B7A',
    maxWidth: 72,
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 18,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
    marginTop: 20,
    marginBottom: 12,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  bioInput: {
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AA7B6',
    marginTop: 6,
    textAlign: 'right',
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  uploadHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
    marginBottom: 12,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D7DEE7',
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FBFF',
  },
  uploadBoxText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    marginTop: 10,
  },
  imagePreviewWrap: {
    width: '100%',
    // alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 16,
    backgroundColor: '#F7FBFF',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#EEF3F8',
  },
  previewImageLogo: {
    width: '100%',
    height: 250,
    backgroundColor: '#EEF3F8',
  },
  previewActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E3ECF4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  previewActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  previewActionBtnDanger: {
    borderColor: 'rgba(220, 38, 38, 0.3)',
    backgroundColor: 'rgba(220, 38, 38, 0.06)',
  },
  previewActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  previewActionTextDanger: {
    color: '#DC2626',
  },
});
