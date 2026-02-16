import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { ProgressStep, ProgressSteps } from 'react-native-progress-steps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 20;

// --- Step 1: Identify ---
function StepIdentify({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.stepContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Provide Property Address</Text>
        <Text style={styles.cardSubtitle}>
          Enter the address and we'll fetch the legal specs automatically.
        </Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Start typing address..."
            placeholderTextColor="#94A3B8"
          />
          <Pressable
            style={({ pressed }) => [styles.searchBtn, pressed && { opacity: 0.9 }]}
            onPress={onNext}
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#FFF" />
            <Text style={styles.searchBtnText}>Start AI Enrichment</Text>
          </Pressable>
        </View>

        <View style={styles.sourcesRow}>
          <View style={styles.sourceItem}>
            <MaterialCommunityIcons name="office-building-outline" size={28} color="#0D9488" />
            <Text style={styles.sourceLabel}>County Records</Text>
          </View>
          <View style={styles.sourceItem}>
            <MaterialCommunityIcons name="map-outline" size={28} color="#0D9488" />
            <Text style={styles.sourceLabel}>Zoning Data</Text>
          </View>
          <View style={styles.sourceItem}>
            <MaterialCommunityIcons name="file-document-outline" size={28} color="#0D9488" />
            <Text style={styles.sourceLabel}>Tax History</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// --- Step 2: Enrich Data ---
function StepEnrichData({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [propertyType, setPropertyType] = useState('Residential SFH');
  const [lotSize, setLotSize] = useState('0.45 Acres');
  const [yearBuilt, setYearBuilt] = useState('1995');
  const [bedsBaths, setBedsBaths] = useState('5 / 4.5');

  return (
    <View style={styles.stepContent}>
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { textAlign: 'left' }]}>Data Collected Successfully!</Text>
        <Text style={[styles.cardSubtitle, { textAlign: 'left', marginBottom: 20 }]}>
          Review the fetched details below.
        </Text>

        <View style={styles.formGrid}>
          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>Property Type</Text>
              <TextInput
                style={[styles.inputBox, styles.inputValue]}
                value={propertyType}
                onChangeText={setPropertyType}
              />
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>Lot Size</Text>
              <TextInput
                style={[styles.inputBox, styles.inputValue]}
                value={lotSize}
                onChangeText={setLotSize}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>Year Built</Text>
              <TextInput
                style={[styles.inputBox, styles.inputValue]}
                value={yearBuilt}
                onChangeText={setYearBuilt}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>Beds/Baths</Text>
              <TextInput
                style={[styles.inputBox, styles.inputValue]}
                value={bedsBaths}
                onChangeText={setBedsBaths}
              />
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryBtn} onPress={onBack}>
            <Text style={styles.secondaryBtnText}>Back</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={onNext}>
            <Text style={styles.primaryBtnText}>Continue to Media</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// --- Step 3: AI Media ---
function StepAIMedia({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const assets = [
    { icon: 'sofa-outline', title: 'Virtual Staging', desc: 'Add furniture to empty rooms' },
    { icon: 'weather-night', title: 'Day to Twilight', desc: 'Generate evening exterior shots' },
    { icon: 'eraser', title: 'Object Removal', desc: 'Remove cars or clutter' },
  ];

  return (
    <View style={styles.stepContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitleCenter}>AI Marketing Suite</Text>
        <Text style={styles.cardSubtitleCenter}>
          Generate high-end visual assets for this listing.
        </Text>

        <View style={styles.assetsGrid}>
          {assets.map((asset, i) => (
            <View key={i} style={styles.assetCard}>
              <View style={styles.assetHeader}>
                <View style={styles.assetIconBox}>
                  <MaterialCommunityIcons name={asset.icon as any} size={24} color="#0D9488" />
                </View>
              </View>

              <View style={styles.assetContent}>
                <Text style={styles.assetTitle}>{asset.title}</Text>
                <Text style={styles.assetDesc}>{asset.desc}</Text>
              </View>

              <Pressable style={styles.checkAssetBtn}>
                <Text style={styles.checkAssetBtnText}>Check Asset</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryBtn} onPress={onBack}>
            <Text style={styles.secondaryBtnText}>Back</Text>
          </Pressable>
          <Pressable style={[styles.primaryBtn, { flex: 1 }]} onPress={onNext}>
            <Text style={styles.primaryBtnText}>Finalize Listing</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// --- Step 4: Publish ---
function StepPublish({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  return (
    <View style={styles.stepContent}>
      <View style={[styles.card, { alignItems: 'center', paddingVertical: 50 }]}>
        <View style={styles.successIconCircle}>
          <MaterialCommunityIcons name="check" size={48} color="#0D9488" />
        </View>
        <Text style={styles.cardTitleCenter}>Listing Optimized.</Text>
        <Text style={[styles.cardSubtitleCenter, { maxWidth: 320, marginBottom: 40 }]}>
          The property data has been cross-referenced with county records and AI marketing assets are ready for deployment.
        </Text>

        <View style={styles.finishActionRow}>
          <Pressable style={styles.primaryBtn} onPress={onFinish}>
            <Text style={styles.primaryBtnText}>Back to Inventory</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => { }}>
            <Text style={styles.secondaryBtnText}>Share Property Kit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function CreateListingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const goNext = () => setActiveStep((prev) => prev + 1);
  const goBack = () => setActiveStep((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#F0F4F8', '#E2E8F0', '#F0F4F8']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerBackBtn}
          onPress={() => {
            if (activeStep > 0) setActiveStep(activeStep - 1);
            else router.back();
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Create New Listing</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Upload basic info or let ZIEN pull from public records.
          </Text>
        </View>
      </View>

      {/* Progress Steps */}
      <View style={{ flex: 1 }}>
        <ProgressSteps
          activeStep={activeStep}
          topOffset={0}
          marginBottom={20}
          progressBarColor="#E2E8F0"
          completedProgressBarColor="#0D9488"
          activeStepIconColor="#0D9488"
          activeStepIconBorderColor="#0D9488"
          completedStepIconColor="#0D9488"
          disabledStepIconColor="#E2E8F0"
          labelColor="#94A3B8"
          activeLabelColor="#0D9488"
          activeStepNumColor="#FFFFFF"
          completedStepNumColor="#FFFFFF"
          disabledStepNumColor="#94A3B8"
          labelFontSize={11}
        >
          <ProgressStep label="Identify" removeBtnRow>
            <StepIdentify onNext={goNext} />
          </ProgressStep>
          <ProgressStep label="Enrich Data" removeBtnRow>
            <StepEnrichData onNext={goNext} onBack={goBack} />
          </ProgressStep>
          <ProgressStep label="AI Media" removeBtnRow>
            <StepAIMedia onNext={goNext} onBack={goBack} />
          </ProgressStep>
          <ProgressStep label="Publish" removeBtnRow>
            <StepPublish
              onFinish={() => router.push('/(main)/properties')}
              onBack={goBack}
            />
          </ProgressStep>
        </ProgressSteps>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  stepContent: {
    paddingBottom: 40,
  },

  // Card Styles
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 400,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  cardTitleCenter: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitleCenter: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },

  // Step 1 Specific
  searchContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 40,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 8,
  },
  searchBtn: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  searchBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sourcesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    marginTop: 10,
  },
  sourceItem: {
    alignItems: 'center',
    gap: 8,
  },
  sourceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },

  // Step 2 Specific
  formGrid: {
    gap: 16,
    marginBottom: 32,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formCol: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  inputValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },

  // Step Buttons
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  secondaryBtnText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 14,
  },
  primaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Step 3 Specific
  assetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  assetCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  assetHeader: {
    // 
  },
  assetIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetContent: {
    flex: 1,
  },
  assetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  assetDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  checkAssetBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkAssetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Step 4 Specific
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  finishActionRow: {
    gap: 12,
    marginTop: 20,
  },
});
