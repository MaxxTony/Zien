import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const ANALYSIS_STEPS = [
  { id: 'vertex', label: 'Architectural Vertex Mapping' },
  { id: 'texture', label: 'Surface Texture Recognition' },
  { id: 'illumination', label: 'Global Illumination Analysis' },
] as const;

type EngineId = 'staging' | 'enhancement' | 'removal' | 'twilight' | 'renovation';

const ENGINE_CONFIG: Record<
  EngineId | '',
  { title: string; subtitle: string; icon: 'camera' | 'sofa' | 'star-four-points' | 'broom' | 'weather-sunset' | 'hammer' }
> = {
  '': {
    title: 'Architectural Studio Engine',
    subtitle:
      'The master engine for all Zien visual intelligence tasks. Upload your assets to begin the neural transformation.',
    icon: 'camera',
  },
  staging: {
    title: 'Virtual Staging Engine',
    subtitle:
      'Turn empty rooms into beautifully furnished professional spaces using architectural neural mapping.',
    icon: 'sofa',
  },
  enhancement: {
    title: 'Image Enhancement Engine',
    subtitle:
      'Professional HDR correction and luxury lighting optimization for architectural photography.',
    icon: 'star-four-points',
  },
  removal: {
    title: 'Object Removal Engine',
    subtitle: 'Erase unwanted clutter or furniture with high-fidelity texture reconstruction.',
    icon: 'broom',
  },
  twilight: {
    title: 'Twilight Effect Engine',
    subtitle: 'Transform daylight shots into dramatic, high-end evening atmospheres.',
    icon: 'weather-sunset',
  },
  renovation: {
    title: 'Virtual Renovation Engine',
    subtitle: 'Visualize structural changes, flooring updates, and kitchen remodels instantly.',
    icon: 'hammer',
  },
};

export default function UploadRealEstatePhotosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { type: engineType } = useLocalSearchParams<{ type?: string }>();
  const safeType = (engineType as EngineId) || '';
  const engine = ENGINE_CONFIG[safeType] ?? ENGINE_CONFIG[''];
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAnalyzingModal, setShowAnalyzingModal] = useState(false);
  const [completedStepIndex, setCompletedStepIndex] = useState(-1);
  const spinValue = useRef(new Animated.Value(0)).current;

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photos to upload images.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.length) {
      const uris = result.assets.map((a) => a.uri);
      setSelectedUris((prev) => [...prev, ...uris].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setSelectedUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedUris.length === 0) {
      Alert.alert('No images', 'Please select at least one image to upload.');
      return;
    }
    setIsUploading(true);
    setCompletedStepIndex(-1);
    setShowAnalyzingModal(true);
    // Brief delay before starting step animation
    await new Promise((r) => setTimeout(r, 400));
    setIsUploading(false);
  };

  // Rotate loader when modal is visible
  useEffect(() => {
    if (!showAnalyzingModal) {
      spinValue.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [showAnalyzingModal]);

  // Progress analysis steps in modal (0 -> 1 -> 2), then close and navigate
  useEffect(() => {
    if (!showAnalyzingModal) return;
    if (completedStepIndex >= ANALYSIS_STEPS.length - 1) {
      const t = setTimeout(() => {
        setShowAnalyzingModal(false);
        setCompletedStepIndex(-1);
        router.replace({
          pathname: '/(main)/images-staging/select-engine',
          params: engineType ? { type: engineType } : undefined,
        });
      }, 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCompletedStepIndex((prev) => prev + 1);
    }, 1100);
    return () => clearTimeout(t);
  }, [showAnalyzingModal, completedStepIndex]);

  const hasImages = selectedUris.length > 0;

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.headerIconWrap}>
            <MaterialCommunityIcons name={engine.icon} size={25} color="#0B2D3E" />
          </View>
          <Text style={styles.title}>{engine.title}</Text>
          <Text style={styles.subtitle}>{engine.subtitle}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Drop zone - same for all engines */}
        <Pressable style={styles.uploadZone} onPress={pickImages}>
          <View style={styles.uploadZoneInner}>
            <View style={styles.cameraIconWrap}>
              <MaterialCommunityIcons name="camera" size={40} color="#0B2D3E" />
            </View>
            <Text style={styles.uploadCta}>Drop architectural assets here</Text>
            <Text style={styles.uploadSpecs}>
              RAW, JPG or PNG (Up to 100MB per file)
            </Text>
            {selectedUris.length > 0 && (
              <Text style={styles.selectedCount}>{selectedUris.length} selected</Text>
            )}
            <View style={styles.hdrTag}>
              <Text style={styles.hdrTagText}>High-Dynamic Range Ready</Text>
            </View>
          </View>
        </Pressable>

        {/* Image previews – only when user has selected images */}
        {hasImages && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.previewRow}>
            {selectedUris.map((uri, i) => (
              <View key={i} style={styles.previewBox}>
                <Image
                  source={{ uri }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => removeImage(i)}>
                  <MaterialCommunityIcons name="close" size={16} color="#FFF" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Upload button – disabled look until images selected */}
        <Pressable
          style={[
            styles.uploadButton,
            (!hasImages || isUploading) && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!hasImages || isUploading}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Uploading…' : 'Upload'}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Analyzing Neural Structure modal - dark overlay, animated loader */}
      <Modal
        visible={showAnalyzingModal}
        transparent
        animationType="fade"
        statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <View style={styles.analyzingCard}>
            {/* Animated analysis loader: rotating dark blue ring + white inner + magnify icon */}
            <View style={styles.analyzingIconWrap}>
              <Animated.View
                style={[
                  styles.analyzingLoaderRingWrap,
                  {
                    transform: [
                      {
                        rotate: spinValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}>
                <Svg width={88} height={88} style={styles.analyzingSvg}>
                  <Circle
                    cx={44}
                    cy={44}
                    r={38}
                    stroke="#0B2D3E"
                    strokeWidth={4}
                    fill="none"
                    strokeDasharray="48 180"
                    strokeLinecap="round"
                  />
                </Svg>
              </Animated.View>
              <View style={styles.analyzingLoaderInner}>
                <View style={styles.analyzingLoaderWhiteRing} />
                <View style={styles.analyzingMagnifyWrap}>
                  <MaterialCommunityIcons name="magnify" size={30} color="#0B2D3E" />
                </View>
              </View>
            </View>
            <Text style={styles.analyzingTitle}>Analyzing Neural Structure</Text>
            <Text style={styles.analyzingSubtitle}>
              Mapping spatial depth and light coefficients...
            </Text>
            {ANALYSIS_STEPS.map((step, i) => {
              const done = i <= completedStepIndex;
              const inProgress = i === completedStepIndex + 1;
              return (
                <View key={step.id} style={styles.analyzingStepRow}>
                  <Text
                    style={[
                      styles.analyzingStepLabel,
                      !done && !inProgress && styles.analyzingStepLabelMuted,
                      inProgress && styles.analyzingStepLabelMuted,
                    ]}>
                    {step.label}
                  </Text>
                  {done ? (
                    <View style={styles.analyzingCheckWrap}>
                      <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={styles.analyzingPendingWrap}>
                      <View style={styles.analyzingPendingDot} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 10,
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
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#E8EEF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
  },
  uploadZone: {
    backgroundColor: '#E8F4F8',
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#B8D4E3',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  uploadZoneInner: {
    alignItems: 'center',
  },
  cameraIconWrap: {
    marginBottom: 16,
  },
  uploadCta: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  uploadSpecs: {
    fontSize: 12,
    color: '#5B6B7A',
    fontWeight: '600',
  },
  selectedCount: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  hdrTag: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'center',
  },
  hdrTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
  },
  previewRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingRight: 16,
  },
  previewBox: {
    width: 100,
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 28,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#5B6B7A',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Analyzing modal - black opacity overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  analyzingCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  analyzingIconWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  analyzingLoaderRingWrap: {
    position: 'absolute',
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingSvg: {
    position: 'absolute',
  },
  analyzingLoaderInner: {
    position: 'absolute',
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingLoaderWhiteRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#E8EEF4',
  },
  analyzingMagnifyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  analyzingSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6B7A',
    marginBottom: 20,
  },
  analyzingStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  analyzingStepLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    flex: 1,
  },
  analyzingStepLabelMuted: {
    color: '#9CA3AF',
    fontWeight: '700',
  },
  analyzingCheckWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingPendingWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingPendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
});
