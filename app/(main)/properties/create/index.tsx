import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ProgressStep, ProgressSteps } from 'react-native-progress-steps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const H_PADDING = 18;

function Step1Identify({
  address,
  setAddress,
  onStartEnrichment,
}: {
  address: string;
  setAddress: (v: string) => void;
  onStartEnrichment: () => void;
}) {
  return (
    <View style={styles.stepContent}>
      <View style={styles.cardStep1}>
        <View style={styles.cardStep1Badge}>
          <Text style={styles.cardStep1BadgeText}>Step 1 of 4</Text>
        </View>
        <Text style={styles.cardTitleStep1}>Provide Property Address</Text>
        <Text style={styles.cardSubtitleStep1}>
          Enter the address and we'll fetch the legal specs automatically.
        </Text>
        <View style={styles.inputWrapStep1}>
          <View style={styles.inputIconWrap}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color="#5B6B7A"
            />
          </View>
          <TextInput
            style={styles.addressInputStep1}
            placeholder="Start typing address..."
            placeholderTextColor="#94A3B8"
            value={address}
            onChangeText={setAddress}
            editable
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.enrichButtonWrap,
            pressed && styles.enrichButtonPressed,
          ]}
          onPress={onStartEnrichment}>
          <LinearGradient
            colors={['#0D9488', '#0B2D3E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.enrichButtonGradient}>
            <MaterialCommunityIcons name="magnify" size={22} color="#FFFFFF" />
            <Text style={styles.enrichButtonText}>Start AI Enrichment</Text>
          </LinearGradient>
        </Pressable>
        <View style={styles.dataSourcesDivider} />
        <Text style={styles.dataSourcesHeading}>We'll pull from</Text>
        <View style={styles.dataSourcesRow}>
          <View style={styles.dataSourcePill}>
            <View style={[styles.dataSourceIconWrap, styles.dataSourceIconTeal]}>
              <MaterialCommunityIcons
                name="office-building-outline"
                size={18}
                color="#0D9488"
              />
            </View>
            <Text style={styles.dataSourceLabel}>County Records</Text>
          </View>
          <View style={styles.dataSourcePill}>
            <View style={[styles.dataSourceIconWrap, styles.dataSourceIconTeal]}>
              <MaterialCommunityIcons
                name="map-outline"
                size={18}
                color="#0D9488"
              />
            </View>
            <Text style={styles.dataSourceLabel}>Zoning Data</Text>
          </View>
          <View style={styles.dataSourcePill}>
            <View style={[styles.dataSourceIconWrap, styles.dataSourceIconTeal]}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={18}
                color="#0D9488"
              />
            </View>
            <Text style={styles.dataSourceLabel}>Tax History</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function Step2EnrichData({
  onBack,
  onContinueToMedia,
}: {
  onBack: () => void;
  onContinueToMedia: () => void;
}) {
  return (
    <View style={styles.stepContent}>
      <View style={styles.cardStep2}>
        <View style={styles.cardStep2Badge}>
          <Text style={styles.cardStep2BadgeText}>Step 2 of 4</Text>
        </View>
        <View style={styles.enrichSuccessRow}>
         
          <Text style={styles.enrichTitleStep2}>Data Collected Successfully!</Text>
        </View>
        <Text style={styles.enrichSubtitleStep2}>
          Legal specs have been fetched. Review and continue when ready.
        </Text>
        <View style={styles.enrichGrid}>
        
            <View style={styles.enrichField}>
              <Text style={styles.enrichFieldLabel}>Property Type</Text>
              <View style={styles.enrichValueBox}>
                <Text style={styles.enrichValueText}>Residential SFH</Text>
              </View>
            </View>
            <View style={styles.enrichField}>
              <Text style={styles.enrichFieldLabel}>Lot Size</Text>
              <View style={styles.enrichValueBox}>
                <Text style={styles.enrichValueText}>0.45 Acres</Text>
              </View>
            </View>
         
          <View style={styles.enrichFieldRow}>
            <View style={styles.enrichField}>
              <Text style={styles.enrichFieldLabel}>Year Built</Text>
              <View style={styles.enrichValueBox}>
                <Text style={styles.enrichValueText}>1995</Text>
              </View>
            </View>
            <View style={styles.enrichField}>
              <Text style={styles.enrichFieldLabel}>Beds/Baths</Text>
              <View style={styles.enrichValueBox}>
                <Text style={styles.enrichValueText}>5 / 4.5</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.enrichActionsDivider} />
        <View style={styles.enrichActions}>
          <Pressable
            style={({ pressed }) => [styles.enrichBackBtn, pressed && styles.enrichBackBtnPressed]}
            onPress={onBack}>
            <Text style={styles.enrichBackBtnText}>Back</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.enrichContinueBtnWrap, pressed && styles.enrichContinueBtnPressed]}
            onPress={onContinueToMedia}>
            <LinearGradient
              colors={['#0D9488', '#0B2D3E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.enrichContinueBtnGradient}>
              <Text style={styles.enrichContinueBtnText}>Continue to Media</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const AI_MEDIA_SERVICES = [
  {
    id: 'staging',
    title: 'Virtual Staging',
    description: 'Add furniture to empty rooms',
    icon: 'sofa-outline' as const,
  },
  {
    id: 'twilight',
    title: 'Day to Twilight',
    description: 'Generate evening exterior shots',
    icon: 'weather-night' as const,
  },
  {
    id: 'removal',
    title: 'Object Removal',
    description: 'Remove cars or clutter',
    icon: 'eraser' as const,
  },
];

function Step3AIMedia({
  onFinalizeListing,
}: {
  onFinalizeListing: () => void;
}) {
  return (
    <View style={styles.stepContent}>
      <View style={styles.cardStep3}>
        <View style={styles.cardStep3Badge}>
          <Text style={styles.cardStep3BadgeText}>Step 3 of 4</Text>
        </View>
        <Text style={styles.aiMediaTitleStep3}>AI Marketing Suite</Text>
        <Text style={styles.aiMediaSubtitleStep3}>
          Generate high-end visual assets for this listing.
        </Text>
        <View style={styles.aiMediaGrid}>
          <View style={styles.aiMediaGridRow}>
            {AI_MEDIA_SERVICES.map((service) => (
              <View key={service.id} style={styles.aiMediaServiceCard}>
                <View style={styles.aiMediaIconWrapTeal}>
                  <MaterialCommunityIcons
                    name={service.icon}
                    size={26}
                    color="#0D9488"
                  />
                </View>
                <Text style={styles.aiMediaServiceTitle}>{service.title}</Text>
                <Text style={styles.aiMediaServiceDesc}>{service.description}</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.aiMediaCheckBtn,
                    pressed && styles.aiMediaCheckBtnPressed,
                  ]}>
                  <Text style={styles.aiMediaCheckBtnText}>Check Asset</Text>
                </Pressable>
              </View>
            ))}
          </View>
         
        </View>
        <View style={styles.finalizeListingDivider} />
        <Pressable
          style={({ pressed }) => [
            styles.finalizeListingBtnWrap,
            pressed && styles.finalizeListingBtnPressed,
          ]}
          onPress={onFinalizeListing}>
          <LinearGradient
            colors={['#0D9488', '#0B2D3E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finalizeListingBtnGradient}>
            <Text style={styles.finalizeListingBtnText}>Finalize Listing</Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

export default function CreateListingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [address, setAddress] = useState('');

  const handleStartEnrichment = () => {
    setActiveStep(1);
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Create New Listing</Text>
          <Text style={styles.subtitle}>
            Upload basic info or let ZIEN AI pull from public records.
          </Text>
        </View>
      </View>

      <View style={styles.stepsWrapper}>
        <ProgressSteps
          activeStep={activeStep}
          topOffset={0}
          marginBottom={16}
          progressBarColor="#E5E7EB"
          completedProgressBarColor="#0D9488"
          activeStepIconColor="#0D9488"
          activeStepIconBorderColor="#0D9488"
          completedStepIconColor="#0D9488"
          disabledStepIconColor="#E5E7EB"
          labelColor="#9CA3AF"
          activeLabelColor="#0D9488"
          completedLabelColor="#0D9488"
          activeStepNumColor="#FFFFFF"
          completedStepNumColor="#FFFFFF"
          disabledStepNumColor="#5B6B7A"
          completedCheckColor="#FFFFFF"
          labelFontSize={10}
          activeLabelFontSize={10}
        >
          <ProgressStep label="Identify" removeBtnRow>
            <Step1Identify
              address={address}
              setAddress={setAddress}
              onStartEnrichment={handleStartEnrichment}
            />
          </ProgressStep>
          <ProgressStep label="Enrich Data" removeBtnRow>
            <Step2EnrichData
              onBack={() => setActiveStep(0)}
              onContinueToMedia={() => setActiveStep(2)}
            />
          </ProgressStep>
          <ProgressStep label="AI Media" removeBtnRow>
            <Step3AIMedia onFinalizeListing={() => setActiveStep(3)} />
          </ProgressStep>
          <ProgressStep label="Publish" removeBtnRow>
            <Step4Publish
              onBackToInventory={() => router.back()}
              onSharePropertyKit={() => {}}
            />
          </ProgressStep>
        </ProgressSteps>
      </View>
    </LinearGradient>
  );
}

function Step4Publish({
  onBackToInventory,
  onSharePropertyKit,
}: {
  onBackToInventory: () => void;
  onSharePropertyKit: () => void;
}) {
  return (
    <View style={styles.stepContent}>
      <View style={styles.cardStep4}>
        <View style={styles.cardStep4Badge}>
          <Text style={styles.cardStep4BadgeText}>Step 4 of 4</Text>
        </View>
        <View style={styles.publishIconWrap}>
          <MaterialCommunityIcons name="check" size={40} color="#0D9488" />
        </View>
        <Text style={styles.publishTitleStep4}>Listing Optimized.</Text>
        <Text style={styles.publishDescStep4}>
          The property data has been cross-referenced with county records and AI
          marketing assets are ready for deployment.
        </Text>
        <View style={styles.publishActions}>
          <Pressable
            style={({ pressed }) => [
              styles.publishBackBtnWrap,
              pressed && styles.publishBackBtnPressed,
            ]}
            onPress={onBackToInventory}>
            <LinearGradient
              colors={['#0D9488', '#0B2D3E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.publishBackBtnGradient}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" />
              <Text style={styles.publishBackBtnText}>Back to Inventory</Text>
            </LinearGradient>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.publishShareBtn,
              pressed && styles.publishShareBtnPressed,
            ]}
            onPress={onSharePropertyKit}>
            <Text style={styles.publishShareBtnText}>Share Property Kit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  headerCenter: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 20,
  },
  stepsWrapper: {
    flex: 1,
    paddingHorizontal: H_PADDING,
  },
  stepContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  cardStep1: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
    }),
  },
  cardStep1Badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardStep1BadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.4,
  },
  cardTitleStep1: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 8,
  },
  cardSubtitleStep1: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 24,
  },
  inputWrapStep1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
    }),
  },
  inputIconWrap: {
    paddingLeft: 18,
    paddingRight: 12,
    justifyContent: 'center',
  },
  addressInputStep1: {
    flex: 1,
    height: 54,
    paddingRight: 18,
    fontSize: 16,
    color: '#0B2D3E',
    fontWeight: '500',
    ...Platform.select({
      ios: { paddingVertical: 0 },
      android: { paddingVertical: 0 },
    }),
  },
  enrichButtonWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  enrichButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  enrichButtonPressed: {
    opacity: 0.92,
  },
  enrichButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  dataSourcesDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  dataSourcesHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  dataSourcesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dataSourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  dataSourceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataSourceIconTeal: {
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
  },
  dataSourceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  dataSourceItem: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  cardStep2: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
    }),
  },
  cardStep2Badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 18,
  },
  cardStep2BadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.4,
  },
  enrichSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  enrichSuccessIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enrichTitleStep2: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.4,
    lineHeight: 26,
    flex: 1,
  },
  enrichSubtitleStep2: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 24,
  },
  enrichTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.2,
    marginBottom: 20,
  },
  enrichGrid: {
    gap: 16,
  },
  enrichFieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  enrichField: {
    flex: 1,
  },
  enrichFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  enrichValueBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 3,
      },
    }),
  },
  enrichValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  enrichActionsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 8,
    marginBottom: 24,
  },
  enrichActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  enrichBackBtn: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  enrichBackBtnPressed: {
    opacity: 0.9,
  },
  enrichBackBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  enrichContinueBtnWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  enrichContinueBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  enrichContinueBtnPressed: {
    opacity: 0.92,
  },
  enrichContinueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  enrichContinueBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
  },
  cardStep3: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
    }),
  },
  cardStep3Badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 18,
  },
  cardStep3BadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.4,
  },
  aiMediaTitleStep3: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.4,
    // textAlign: 'center',
    marginBottom: 8,
  },
  aiMediaSubtitleStep3: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    // textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  aiMediaGrid: {
    width: '100%',
    marginBottom: 24,
  },
  aiMediaGridRow: {
    // flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  aiMediaGridRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  aiMediaServiceCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
    }),
  },
  aiMediaServiceCardSingle: {
    flex: 0,
    width: '48%',
  },
  aiMediaIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 45, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  aiMediaIconWrapTeal: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  aiMediaServiceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  aiMediaServiceDesc: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 16,
  },
  aiMediaCheckBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignSelf: 'flex-start',
  },
  aiMediaCheckBtnPressed: {
    opacity: 0.9,
  },
  aiMediaCheckBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  finalizeListingDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 24,
  },
  finalizeListingBtnWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  finalizeListingBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  finalizeListingBtnPressed: {
    opacity: 0.92,
  },
  finalizeListingBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  cardStep4: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
    }),
  },
  cardStep4Badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardStep4BadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.4,
  },
  publishCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
  },
  publishIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#0D9488',
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  publishTitleStep4: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 12,
  },
  publishDescStep4: {
    fontSize: 15,
    color: '#5B6B7A',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  publishTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2D3E',
    textAlign: 'center',
    marginBottom: 12,
  },
  publishDesc: {
    fontSize: 15,
    color: '#5B6B7A',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  publishActions: {
    width: '100%',
    flexDirection: 'column',
    gap: 12,
  },
  publishBackBtnWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  publishBackBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  publishBackBtn: {
    width: '100%',
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBackBtnPressed: {
    opacity: 0.92,
  },
  publishBackBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  publishShareBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  publishShareBtnPressed: {
    opacity: 0.9,
  },
  publishShareBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  placeholderStep: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  placeholderStepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  placeholderStepText: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    marginBottom: 16,
  },
  placeholderBackBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  placeholderBackBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D9488',
  },
});
