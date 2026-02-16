import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  useWindowDimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAD = 16;
const GAP = 12;
const MOBILE_BREAKPOINT = 520;

type ConfigType =
  | 'staging'
  | 'enhancement'
  | 'removal'
  | 'twilight'
  | 'renovation'
  | 'multimode';

const CONFIG_BY_TYPE: Record<
  ConfigType,
  {
    title: string;
    useStyleAndSlider: boolean;
    toggles?: readonly { id: string; label: string }[];
  }
> = {
  renovation: {
    title: 'Structural Remodeling',
    useStyleAndSlider: true,
  },
  twilight: {
    title: 'Atmospheric Shift',
    useStyleAndSlider: false,
    toggles: [
      { id: 'hdr', label: 'Precision HDR Calibration' },
      { id: 'sky', label: 'Neural Sky Replacement' },
      { id: 'distortion', label: 'Optical Distortion Fix' },
      { id: 'alignment', label: 'Vertical Alignment Post' },
    ],
  },
  removal: {
    title: 'Texture Reconstruction',
    useStyleAndSlider: false,
    toggles: [
      { id: 'hdr', label: 'Precision HDR Calibration' },
      { id: 'sky', label: 'Neural Sky Replacement' },
      { id: 'distortion', label: 'Optical Distortion Fix' },
      { id: 'alignment', label: 'Vertical Alignment Post' },
    ],
  },
  enhancement: {
    title: 'Luminance Correction',
    useStyleAndSlider: false,
    toggles: [
      { id: 'hdr', label: 'Precision HDR Calibration' },
      { id: 'sky', label: 'Neural Sky Replacement' },
      { id: 'distortion', label: 'Optical Distortion Fix' },
      { id: 'alignment', label: 'Vertical Alignment Post' },
    ],
  },
  staging: {
    title: 'Architectural Staging',
    useStyleAndSlider: true,
  },
  multimode: {
    title: 'Advanced Multi-Mode',
    useStyleAndSlider: false,
    toggles: [
      { id: 'hdr', label: 'Precision HDR Calibration' },
      { id: 'sky', label: 'Neural Sky Replacement' },
      { id: 'distortion', label: 'Optical Distortion Fix' },
      { id: 'alignment', label: 'Vertical Alignment Post' },
    ],
  },
};

const STYLE_OPTIONS = [
  'Modern Minimal',
  'Executive Luxury',
  'Scandinavian',
  'Industrial High',
] as const;

const ROOM_DETECTED = 'LIVING AREA';

export default function SelectEngineScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const { type: paramType } = useLocalSearchParams<{ type?: string }>();

  const isMobile = screenWidth < MOBILE_BREAKPOINT;

  const configType: ConfigType = useMemo(() => {
    if (paramType === 'staging' || paramType === 'enhancement' || paramType === 'removal'
        || paramType === 'twilight' || paramType === 'renovation') {
      return paramType;
    }
    return 'multimode';
  }, [paramType]);

  const config = CONFIG_BY_TYPE[configType];
  const [selectedStyle, setSelectedStyle] = useState<string>(STYLE_OPTIONS[0]);
  const [sliderValue, setSliderValue] = useState(0.35);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    hdr: true,
    sky: true,
    distortion: true,
    alignment: true,
  });

  const toggle = (id: string) =>
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  const predictionText = `The AI has determined that the ${config.title} engine will yield highest quality results with the current configuration.`;

  const handleEngage = () => {
    router.push('/(main)/images-staging/generating');
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(24, insets.bottom + 12) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.roomTag}>
          <Text style={styles.roomTagText}>ROOM DETECTED: {ROOM_DETECTED}</Text>
        </View>

        <Text style={[styles.mainTitle, isMobile && styles.mainTitleMobile]}>
          Engine Configuration: {config.title}
        </Text>
        <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
          Fine-tune the neural outputs for optimal architectural results.
        </Text>

        <View
          style={[
            styles.twoCol,
            isMobile ? styles.twoColMobile : styles.twoColDesktop,
          ]}>
          {/* Left: Operational Parameters */}
          <View style={[styles.leftCard, isMobile && styles.cardMobile]}>
            <Text style={styles.cardTitle}>Operational Parameters</Text>

            {config.useStyleAndSlider ? (
              <>
                <Text style={styles.paramLabel}>Aesthetic Style Profile</Text>
                <View style={[styles.styleRow, isMobile && styles.styleRowMobile]}>
                  {STYLE_OPTIONS.map((opt) => {
                    const isSelected = selectedStyle === opt;
                    return (
                      <Pressable
                        key={opt}
                        style={[
                          styles.styleChip,
                          isSelected && styles.styleChipSelected,
                          isMobile && styles.styleChipMobile,
                        ]}
                        onPress={() => setSelectedStyle(opt)}
                        hitSlop={8}>
                        <Text
                          style={[
                            styles.styleChipText,
                            isSelected && styles.styleChipTextSelected,
                            isMobile && styles.styleChipTextMobile,
                          ]}
                          numberOfLines={1}>
                          {opt}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={[styles.paramLabel, { marginTop: 16 }]}>
                  Spatial Density Control
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minimumTrackTintColor="#0B2D3E"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#0B2D3E"
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabelText}>MINIMALIST</Text>
                  <Text style={styles.sliderLabelText}>COMPREHENSIVE</Text>
                </View>
              </>
            ) : (
              config.toggles?.map((t) => (
                <View key={t.id} style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>{t.label}</Text>
                  <Switch
                    value={toggles[t.id] ?? true}
                    onValueChange={() => toggle(t.id)}
                    trackColor={{ false: '#E5E7EB', true: '#0B2D3E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))
            )}
          </View>

          {/* Right: Neural Prediction */}
          <View style={[styles.rightCard, isMobile && styles.cardMobile]}>
            <Text style={[styles.neuralTitle, isMobile && styles.neuralTitleMobile]}>
              Neural Prediction
            </Text>
            <Text style={[styles.neuralText, isMobile && styles.neuralTextMobile]}>
              {predictionText}
            </Text>
            <Pressable
              style={[styles.engageBtn, isMobile && styles.engageBtnMobile]}
              onPress={handleEngage}
              hitSlop={12}>
              <Text style={styles.engageBtnText}>ENGAGE ENGINE</Text>
              <MaterialCommunityIcons name="rocket-launch" size={18} color="#0B2D3E" />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.resetWrap, isMobile && styles.resetWrapMobile]}
          onPress={() => router.back()}
          hitSlop={16}>
          <MaterialCommunityIcons name="refresh" size={16} color="#9CA3AF" />
          <Text style={styles.resetText}>RESET ASSETS</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PAD,
    paddingTop: 8,
    paddingBottom: 8,
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
  headerCenter: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: PAD,
    paddingBottom: 32,
  },
  roomTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EEF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  roomTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  mainTitleMobile: {
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6B7A',
    marginBottom: 20,
  },
  subtitleMobile: {
    fontSize: 12,
    marginBottom: 18,
    lineHeight: 18,
  },
  twoCol: {
    flexDirection: 'column',
    gap: GAP,
    marginBottom: 24,
  },
  twoColMobile: {
    gap: 14,
  },
  twoColDesktop: {
    flexDirection: 'row',
  },
  leftCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  cardMobile: {
    flex: undefined,
    width: '100%',
    padding: 16,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 16,
  },
  paramLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  styleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  styleRowMobile: {
    gap: 10,
  },
  styleChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  styleChipMobile: {
    minHeight: 44,
    justifyContent: 'center',
    flex: 1,
    minWidth: '47%',
  },
  styleChipSelected: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  styleChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  styleChipTextMobile: {
    fontSize: 11,
  },
  styleChipTextSelected: {
    color: '#FFFFFF',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    paddingHorizontal: 4,
  },
  sliderLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF4',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
    flex: 1,
    paddingRight: 12,
  },
  rightCard: {
    flex: 1,
    backgroundColor: '#0B2D3E',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#0B2D3E',
  },
  neuralTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  neuralTitleMobile: {
    fontSize: 15,
    marginBottom: 10,
  },
  neuralText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.95,
  },
  neuralTextMobile: {
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 18,
  },
  engageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
  },
  engageBtnMobile: {
    minHeight: 50,
    paddingVertical: 16,
  },
  engageBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: 0.3,
  },
  resetWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  resetWrapMobile: {
    paddingVertical: 12,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
});
