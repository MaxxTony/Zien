import { PageHeader } from '@/components/ui/PageHeader';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Constants ---
const PROPERTY_TYPES = ['Residential SFH', 'Condo', 'Townhouse', 'Multi-Family', 'Luxury Villa'];
const BEDS_OPTIONS = ['1', '2', '3', '4', '5+'];
const BATHS_OPTIONS = ['1', '2', '3', '4', '4.5', '5+'];
const GARAGE_OPTIONS = ['None', '1 Car', '2 Car', '3 Car', '4+ Car'];
const ROOF_MATERIALS = ['Asphalt Shingle', 'Tile', 'Metal', 'Slate'];
const FOUNDATIONS = ['Concrete Slab', 'Crawl Space', 'Basement', 'Pier & Beam'];
const HEATING_OPTIONS = ['Forced Air', 'Radiant', 'Heat Pump', 'None'];
const COOLING_OPTIONS = ['Central Air', 'Window Unit', 'Evaporative', 'None'];
const BASEMENT_OPTIONS = ['Fully Finished', 'Partially Finished', 'Unfinished', 'None'];

const FLOORING_OPTIONS = ['Hardwood', 'Tile', 'Carpet', 'Laminate', 'Vinyl', 'Concrete'];
const APPLIANCE_OPTIONS = ['Refrigerator', 'Oven', 'Dishwasher', 'Microwave', 'Washer', 'Dryer'];
const SMART_HOME_OPTIONS = ['Thermostat', 'Security', 'Lighting', 'Audio', 'Locks'];

// --- Helper Components ---

function PremiumDropdown({ label, value, options, onSelect }: { label: string, value: string, options: string[], onSelect: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable style={styles.dropdownTrigger} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.dropdownValue}>{value}</Text>
        <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={Theme.textPrimary} />
      </Pressable>
      {isOpen && (
        <View style={styles.dropdownMenu}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
            >
              <Text style={[styles.dropdownItemText, value === opt && styles.dropdownItemTextActive]}>{opt}</Text>
              {value === opt && <MaterialCommunityIcons name="check" size={16} color={Theme.accentTeal} />}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function MultiSelectChips({ label, options, selected, onToggle }: { label: string, options: string[], selected: string[], onToggle: (v: string) => void }) {
  return (
    <View style={styles.chipSection}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.chipGrid}>
        {options.map(opt => {
          const isActive = selected.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(opt)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// --- Step Components ---

function StepAddress({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.premiumCard}>
        <Text style={styles.cardHeaderTitle}>Provide Property Address</Text>
        <Text style={styles.cardHeaderSubtitle}>Enter the address and we'll fetch legal specs.</Text>

        <View style={styles.addressBoxMobile}>
          <TextInput
            style={styles.addressInputMobile}
            placeholder="Start typing address..."
            placeholderTextColor={Theme.textMuted}
          />
        </View>

        <View style={styles.enrichmentSources}>
          <View style={styles.sourceItem}>
            <View style={styles.sourceIconBox}>
              <MaterialCommunityIcons name="office-building" size={20} color={Theme.accentTeal} />
            </View>
            <Text style={styles.sourceLabel}>County</Text>
          </View>
          <View style={styles.sourceItem}>
            <View style={styles.sourceIconBox}>
              <MaterialCommunityIcons name="map" size={20} color={Theme.accentTeal} />
            </View>
            <Text style={styles.sourceLabel}>Zoning</Text>
          </View>
          <View style={styles.sourceItem}>
            <View style={styles.sourceIconBox}>
              <MaterialCommunityIcons name="file-document" size={20} color={Theme.accentTeal} />
            </View>
            <Text style={styles.sourceLabel}>Tax</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function StepDetails({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const [formData, setFormData] = useState({
    type: 'Residential SFH',
    beds: '5',
    baths: '4.5',
    garage: 'None',
    roof: 'Asphalt Shingle',
    foundation: 'Concrete Slab',
    year: '1995',
    sqft: '3,250 Sq Ft',
    heating: 'Forced Air',
    cooling: 'Central Air',
    basement: 'Fully Finished',
    flooring: ['Hardwood', 'Tile'],
    appliances: ['Refrigerator', 'Oven', 'Dishwasher'],
    smartHome: ['Thermostat']
  });

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter(i => i !== item) : [...list, item];

  return (
    <View style={styles.stepContainer}>
      <View style={styles.premiumCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.headerIconBox}>
            <MaterialCommunityIcons name="home-analytics" size={24} color={Theme.textPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardHeaderTitle}>Property Details</Text>
            <Text style={styles.cardHeaderSubtitle}>Review synchronized property attributes.</Text>
          </View>
        </View>

        <Text style={styles.groupLabel}>STRUCTURAL SPECS</Text>
        <View style={styles.formGrid}>
          <PremiumDropdown label="Property Type" value={formData.type} options={PROPERTY_TYPES} onSelect={(v) => setFormData({ ...formData, type: v })} />
          <View style={styles.formRow}>
            <View style={{ flex: 1 }}><PremiumDropdown label="Beds" value={formData.beds} options={BEDS_OPTIONS} onSelect={(v) => setFormData({ ...formData, beds: v })} /></View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}><PremiumDropdown label="Baths" value={formData.baths} options={BATHS_OPTIONS} onSelect={(v) => setFormData({ ...formData, baths: v })} /></View>
          </View>
          <PremiumDropdown label="Garage Spaces" value={formData.garage} options={GARAGE_OPTIONS} onSelect={(v) => setFormData({ ...formData, garage: v })} />
          <PremiumDropdown label="Roof Material" value={formData.roof} options={ROOF_MATERIALS} onSelect={(v) => setFormData({ ...formData, roof: v })} />

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Year Built</Text>
              <TextInput style={styles.textInput} value={formData.year} onChangeText={(v) => setFormData({ ...formData, year: v })} />
            </View>
            <View style={{ width: 12 }} />
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Living Area</Text>
              <TextInput style={styles.textInput} value={formData.sqft} onChangeText={(v) => setFormData({ ...formData, sqft: v })} />
            </View>
          </View>
        </View>

        <Text style={styles.groupLabel}>INTERIOR & ENERGY</Text>
        <View style={styles.formGrid}>
          <PremiumDropdown label="Heating" value={formData.heating} options={HEATING_OPTIONS} onSelect={(v) => setFormData({ ...formData, heating: v })} />
          <PremiumDropdown label="Cooling" value={formData.cooling} options={COOLING_OPTIONS} onSelect={(v) => setFormData({ ...formData, cooling: v })} />
        </View>

        <MultiSelectChips label="Flooring" options={FLOORING_OPTIONS} selected={formData.flooring} onToggle={(v) => setFormData({ ...formData, flooring: toggleItem(formData.flooring, v) })} />

      </View>
    </View>
  );
}

function StepMedia({ onNext, onBack, uploadedImages, setUploadedImages }: {
  onNext: () => void,
  onBack: () => void,
  uploadedImages: string[],
  setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const [prompt, setPrompt] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (type: 'library' | 'camera') => {
    // Simulating upload with placeholders
    const mockImages = [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ];
    setUploadedImages([...uploadedImages, ...mockImages]);
    setShowOptions(false);
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.premiumCard}>
        <Text style={styles.contentTitle}>AI Media Studio</Text>
        <Text style={styles.contentSubtitle}>Upload photos or generate high-end visuals with Zien AI.</Text>

        <View style={styles.mediaStack}>
          {/* Upload Box */}
          <View style={styles.mediaUploadBox}>
            <View style={styles.uploadIconCircle}>
              <MaterialCommunityIcons name="cloud-upload-outline" size={24} color={Theme.textSecondary} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.uploadTitle}>Upload Photos</Text>
              <Text style={styles.uploadSubtitle}>Add multiple property images</Text>
            </View>

            <View style={{ gap: 8, width: '100%', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.selectPhotosBtn}
                onPress={() => setShowOptions(!showOptions)}
              >
                <MaterialCommunityIcons name="plus" size={16} color={Theme.textPrimary} style={{ marginRight: 6 }} />
                <Text style={styles.selectPhotosBtnText}>Add Media</Text>
              </TouchableOpacity>

              {showOptions && (
                <View style={styles.uploadOptions}>
                  <Pressable style={styles.uploadOptionItem} onPress={() => handleSelect('library')}>
                    <MaterialCommunityIcons name="image-multiple-outline" size={18} color={Theme.textPrimary} />
                    <Text style={styles.uploadOptionText}>Photo Library</Text>
                  </Pressable>
                  <View style={styles.optionDivider} />
                  <Pressable style={styles.uploadOptionItem} onPress={() => handleSelect('camera')}>
                    <MaterialCommunityIcons name="camera-outline" size={18} color={Theme.textPrimary} />
                    <Text style={styles.uploadOptionText}>Take Photo</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>

          {/* Uploaded Gallery */}
          {uploadedImages.length > 0 && (
            <View style={styles.galleryContainer}>
              <Text style={styles.groupLabel}>UPLOADED SCENES ({uploadedImages.length})</Text>
              <View style={styles.galleryGrid}>
                {uploadedImages.map((uri, idx) => (
                  <View key={idx} style={styles.galleryCard}>
                    <View style={styles.galleryImageWrap}>
                      <Image source={{ uri }} style={styles.galleryImg} contentFit="cover" />
                      <Pressable style={styles.removeImgBtn} onPress={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}>
                        <MaterialCommunityIcons name="close" size={14} color="#FFF" />
                      </Pressable>
                    </View>
                    <View style={styles.galleryCardFooter}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.sceneLabel}>ORIGINAL MEDIA</Text>
                        <Text style={styles.sceneTitle}>Scene {idx + 1}</Text>
                      </View>
                      <TouchableOpacity style={styles.enhanceBtn}>
                        <MaterialCommunityIcons name="creation" size={14} color={Theme.accentTeal} />
                        <Text style={styles.enhanceBtnText}>Magic Enhance</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* AI Generator Box */}
          <View style={styles.aiStudioBoxMobile}>
            <View style={styles.aiHeader}>
              <View style={styles.aiIconBox}>
                <MaterialCommunityIcons name="creation" size={18} color="#FFF" />
              </View>
              <View>
                <Text style={styles.aiTitle}>AI Studio Generator</Text>
                <Text style={styles.aiSubtitle}>Describe the scene to synthesize</Text>
              </View>
            </View>

            <View style={styles.promptWrapper}>
              <Text style={styles.inputLabelSmall}>GENERATION PROMPT</Text>
              <TextInput
                style={styles.promptInputMobile}
                placeholder="e.g. Modern living room, golden hour..."
                placeholderTextColor={Theme.textMuted}
                multiline
                value={prompt}
                onChangeText={setPrompt}
              />
            </View>

            <TouchableOpacity style={styles.generateBtn}>
              <Text style={styles.generateBtnText}>Generate with AI</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
}

function StepReview({ onNext, onBack, uploadedImages }: {
  onNext: () => void,
  onBack: () => void,
  uploadedImages: string[]
}) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.premiumCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.headerIconBox}>
            <MaterialCommunityIcons name="file-certificate-outline" size={24} color={Theme.textPrimary} />
          </View>
          <View>
            <Text style={styles.cardHeaderTitle}>Final Review</Text>
            <Text style={styles.cardHeaderSubtitle}>Overview of your optimized listing.</Text>
          </View>
        </View>

        <View style={styles.reviewList}>
          <Text style={styles.groupLabel}>DATA PROFILE</Text>
          {[
            { l: 'Type', v: 'Residential SFH' },
            { l: 'Beds', v: '5' },
            { l: 'Baths', v: '4.5' },
            { l: 'Garage', v: '3 Car' },
            { l: 'Roof', v: 'Asphalt' }
          ].map((it, i) => (
            <View key={i} style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>{it.l}</Text>
              <Text style={styles.reviewValue}>{it.v}</Text>
            </View>
          ))}

          {uploadedImages.length > 0 && (
            <>
              <Text style={styles.groupLabel}>MEDIA GALLERY ({uploadedImages.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalGallery}>
                {uploadedImages.map((uri, idx) => (
                  <View key={idx} style={styles.reviewGalleryItem}>
                    <Image source={{ uri }} style={styles.reviewGalleryImg} contentFit="cover" />
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>

      </View>
    </View>
  );
}

function StepSuccess() {
  const router = useRouter();
  const options = [
    { icon: 'bank', title: 'Inventory', route: '/(main)/properties' },
    { icon: 'calendar-check', title: 'Open House', route: '/(main)/open-house' },
    { icon: 'share-variant', title: 'Social Hub', route: '/(main)/social-hub' },
    { icon: 'bullhorn', title: 'Campaigns', route: '/(main)/crm/campaigns' },
  ];

  return (
    <View style={styles.stepContainer}>
      <View style={styles.premiumCard}>
        <View style={styles.successIconOuter}>
          <MaterialCommunityIcons name="check-decagram" size={40} color={Theme.accentTeal} />
        </View>
        <Text style={styles.successTitle}>Property Updated</Text>
        <Text style={styles.successSubtitle}>Your property details have been saved and broadcasted.</Text>

        <Text style={styles.groupLabel}>NEXT STEPS</Text>
        <View style={styles.nextStepsList}>
          {options.map((opt, i) => (
            <TouchableOpacity key={i} style={styles.nextStepMobileBtn} onPress={() => router.push(opt.route as any)}>
              <View style={styles.nextStepIconCircle}>
                <MaterialCommunityIcons name={opt.icon as any} size={18} color="#FFF" />
              </View>
              <Text style={styles.nextStepBtnText}>{opt.title}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={Theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// --- Main Screen ---

export default function EditPropertyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeStep, setActiveStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const steps = [
    { icon: 'map-marker', label: 'Address' },
    { icon: 'home-edit', label: 'Details' },
    { icon: 'auto-fix', label: 'AI Media' },
    { icon: 'publish', label: 'Publish' }
  ];

  const renderStep = () => {
    switch (activeStep) {
      case 0: return <StepAddress onNext={() => setActiveStep(1)} />;
      case 1: return <StepDetails onNext={() => setActiveStep(2)} onBack={() => setActiveStep(0)} />;
      case 2: return (
        <StepMedia
          onNext={() => setActiveStep(3)}
          onBack={() => setActiveStep(1)}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      );
      case 3: return (
        <StepReview
          onNext={() => setActiveStep(4)}
          onBack={() => setActiveStep(2)}
          uploadedImages={uploadedImages}
        />
      );
      case 4: return <StepSuccess />;
      default: return null;
    }
  };

  const renderFooter = () => {
    if (activeStep >= 4) return null;

    let nextLabel = "Continue";
    if (activeStep === 0) nextLabel = "Start AI Enrichment";
    if (activeStep === 1) nextLabel = "Continue to Media";
    if (activeStep === 2) nextLabel = "Finalize Property";
    if (activeStep === 3) nextLabel = "Save Changes";

    return (
      <View style={[styles.fixedFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.actionRowFixed}>
          {activeStep > 1 && (
            <TouchableOpacity style={styles.backBtnFixed} onPress={() => setActiveStep(activeStep - 1)}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.continueBtnFixed, activeStep === 1 && { flex: 1 }]}
            onPress={() => setActiveStep(activeStep + 1)}
          >
            <Text style={styles.continueBtnText}>{nextLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient
        colors={['#D8E9F6', '#F1F6FB', '#F5E6DB']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={{ paddingTop: insets.top }}>
        <PageHeader
          title={`Edit Property: ${id}`}
          subtitle="Modify property details and media."
          onBack={() => {
            if (activeStep > 1 && activeStep < 4) setActiveStep(activeStep - 1);
            else router.back();
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: activeStep < 4 ? 120 : insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* MOBILE OPTIMIZED PROGRESS BAR */}
        {activeStep < 4 && (
          <View style={styles.mobileProgressContainer}>
            <View style={styles.progressRow}>
              {steps.map((_, i) => (
                <React.Fragment key={i}>
                  <View style={[styles.progressDot, activeStep >= i && styles.progressDotActive]} />
                  {i < steps.length - 1 && <View style={[styles.progressLine, activeStep > i && styles.progressLineActive]} />}
                </React.Fragment>
              ))}
            </View>
            <View style={styles.activeStepLabelRow}>
              <Text style={styles.activeStepText}>{steps[activeStep].label}</Text>
              <Text style={styles.stepCounterText}>Step {activeStep + 1} of 4</Text>
            </View>
          </View>
        )}

        {renderStep()}
      </ScrollView>
      {renderFooter()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },

  // Mobile Progress Bar
  mobileProgressContainer: {
    paddingVertical: 12,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(11, 45, 62, 0.1)',
  },
  progressDotActive: {
    backgroundColor: Theme.accentDark,
    width: 12,
    height: 8,
  },
  progressLine: {
    width: 24,
    height: 2,
    backgroundColor: 'rgba(11, 45, 62, 0.1)',
  },
  progressLineActive: {
    backgroundColor: Theme.accentDark,
  },
  activeStepLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  activeStepText: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  stepCounterText: {
    fontSize: 12,
    color: Theme.textMuted,
    fontWeight: '600',
  },

  stepContainer: {
    width: '100%',
  },
  premiumCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },

  // Form elements
  groupLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Theme.textMuted,
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 12,
  },
  formGrid: {
    gap: 12,
  },
  formRow: {
    flexDirection: 'row',
  },
  inputGroup: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  inputLabelSmall: {
    fontSize: 10,
    fontWeight: '900',
    color: Theme.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dropdownTrigger: {
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  dropdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  dropdownMenu: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    marginTop: 4,
    padding: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 13,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: Theme.accentTeal,
    fontWeight: '700',
  },
  textInput: {
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    color: Theme.textPrimary,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },

  // Chip Grid
  chipSection: {
    marginTop: 20,
    gap: 10,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  chipActive: {
    borderColor: Theme.accentDark,
    backgroundColor: 'rgba(11, 45, 62, 0.04)',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.textSecondary,
  },
  chipTextActive: {
    color: Theme.textPrimary,
  },

  // Step 1: Mobile Address
  addressBoxMobile: {
    gap: 12,
    marginVertical: 20,
  },
  addressInputMobile: {
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Theme.textPrimary,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  enrichBtnFull: {
    height: 48,
    backgroundColor: Theme.accentDark,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  enrichBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  enrichmentSources: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  sourceItem: {
    alignItems: 'center',
    flex: 1,
  },
  sourceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  sourceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.textMuted,
  },

  // Step 3: Mobile Media Stack
  mediaStack: {
    gap: 16,
    marginBottom: 24,
  },
  mediaUploadBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: Theme.borderLight,
    gap: 12,
  },
  uploadOptions: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    marginTop: 8,
    overflow: 'hidden',
  },
  uploadOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  uploadOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  optionDivider: {
    height: 1,
    backgroundColor: Theme.borderLight,
    marginHorizontal: 12,
  },
  galleryContainer: {
    marginTop: 8,
  },
  galleryGrid: {
    gap: 12,
  },
  galleryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  galleryImageWrap: {
    width: '100%',
    height: 160,
    backgroundColor: Theme.surfaceIcon,
  },
  galleryImg: {
    width: '100%',
    height: '100%',
  },
  removeImgBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  sceneLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Theme.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sceneTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  enhanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(11, 160, 178, 0.2)',
    backgroundColor: 'rgba(11, 160, 178, 0.05)',
  },
  enhanceBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Theme.accentTeal,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalGallery: {
    gap: 12,
    paddingRight: 20,
  },
  reviewGalleryItem: {
    width: SCREEN_WIDTH * 0.6,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  reviewGalleryImg: {
    width: '100%',
    height: '100%',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: Theme.textMuted,
    fontWeight: '500',
  },
  selectPhotosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.surfaceMuted,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  selectPhotosBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  aiStudioBoxMobile: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 160, 178, 0.1)',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  aiIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Theme.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  aiSubtitle: {
    fontSize: 11,
    color: Theme.textSecondary,
  },
  promptWrapper: {
    backgroundColor: Theme.surfaceSoft,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  promptInputMobile: {
    height: 60,
    fontSize: 13,
    color: Theme.textPrimary,
    textAlignVertical: 'top',
  },
  generateBtn: {
    backgroundColor: Theme.accentDark,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },

  // Review
  reviewList: {
    gap: 4,
    marginBottom: 20,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  reviewLabel: {
    fontSize: 13,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.textPrimary,
  },

  // Success Mobile
  nextStepsList: {
    gap: 10,
  },
  nextStepMobileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  nextStepIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepBtnText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    color: Theme.textPrimary,
  },

  // Common titles
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 45, 62, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  cardHeaderSubtitle: {
    fontSize: 12,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  contentSubtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  successIconOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(11, 160, 178, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },

  // Action Buttons
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  actionRowFixed: {
    flexDirection: 'row',
    gap: 12,
  },
  backBtnFixed: {
    flex: 0.8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Theme.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnFixed: {
    flex: 1.2,
    height: 52,
    borderRadius: 16,
    backgroundColor: Theme.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backBtn: {
    flex: 0.8,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Theme.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  continueBtn: {
    flex: 1.2,
    height: 48,
    borderRadius: 14,
    backgroundColor: Theme.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
});
