import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STEPS = [
  { id: 1, label: 'Post Configuration' },
  { id: 2, label: 'Media Selection' },
  { id: 3, label: 'Scheduling' },
] as const;

type StepId = 1 | 2 | 3;
type PlatformId = 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
type StrategyId = 'immediate' | 'optimal' | 'custom';

const PLATFORMS: { id: PlatformId; label: string; icon: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'facebook', label: 'facebook', icon: 'facebook' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { id: 'tiktok', label: 'TikTok', icon: 'music-note' },
];

const HASHTAG_CHIPS = ['#Luxury', '#OpenHouse', '#ZienRealty', '#LALiving'];

const DEFAULT_CAPTION = `✨ JUST LISTED! Check out this stunning modern home at 123 Business Way, Los Angeles. Featuring 4 bedrooms, 3 baths, and a resort-style backyard.

DM for a private tour!

#RealEstate #JustListed #LosAngelesRealEstate #ZienAI`;

// Unsplash high-quality real estate images
const MEDIA_GRID = [
  { id: 'm1', uri: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800' },
  { id: 'm2', uri: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800' },
  { id: 'm3', uri: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800' },
  { id: 'm4', uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
  { id: 'm5', uri: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800' },
  { id: 'm6', uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800' },
];

const STRATEGIES: { id: StrategyId; title: string; desc: string; icon: string }[] = [
  { id: 'immediate', title: 'Publish Immediately', desc: 'Push to all connected platforms right now.', icon: 'lightning-bolt-outline' },
  { id: 'optimal', title: 'Schedule for Optimal Time', desc: 'AI suggests Today @ 6:45 PM based on audience activity.', icon: 'chart-line' },
  { id: 'custom', title: 'Custom Schedule', desc: 'Pick specific date and time for each platform.', icon: 'calendar-blank-outline' },
];

function ProgressStepper({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.stepper}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isComplete = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <View
            key={stepNum}
            style={[
              styles.stepperSegment,
              isComplete && styles.stepperSegmentComplete,
              isActive && styles.stepperSegmentActive,
            ]}
          />
        );
      })}
    </View>
  );
}

function PostPreviewCard({
  caption,
  previewPlatform,
  selectedMedia,
  onPreviewPlatformChange,
}: {
  caption: string;
  previewPlatform: PlatformId;
  selectedMedia?: string;
  onPreviewPlatformChange?: (p: PlatformId) => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const truncated = caption.length > 80 ? caption.slice(0, 80) + '...' : caption;
  return (
    <View style={styles.previewCard}>
      <View style={styles.previewTabsContainer}>
        {PLATFORMS.map((p) => (
          <Pressable
            key={p.id}
            style={[styles.previewIconTab, previewPlatform === p.id && styles.previewIconTabActive]}
            onPress={() => onPreviewPlatformChange?.(p.id)}>
            <MaterialCommunityIcons
              name={p.icon as any}
              size={20}
              color={previewPlatform === p.id ? '#0B2D3E' : '#94A3B8'}
            />
          </Pressable>
        ))}
      </View>
      <View style={styles.previewBody}>
        <View style={styles.previewHeader}>
          <View style={styles.previewProfile}>
            <View style={styles.previewAvatar}>
              <MaterialCommunityIcons name="account" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.previewProfileName}>Jordan Smith Real Estate</Text>
              <Text style={styles.previewProfileLoc}>Los Angeles, California</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color={colors.textSecondary} />
        </View>

        <View style={styles.previewMediaWrap}>
          {selectedMedia ? (
            <Image
              source={{ uri: selectedMedia }}
              style={styles.previewImage}
              key={selectedMedia} // Force re-render when image changes
              resizeMode="cover"
            />
          ) : (
            <View style={styles.previewImagePlaceholder}>
              <MaterialCommunityIcons name="image-outline" size={48} color={colors.textMuted} />
              <Text style={styles.previewImagePlaceholderText}>No Media Selected</Text>
            </View>
          )}
        </View>

        <View style={styles.previewFooterActions}>
          <View style={styles.previewActionsLeft}>
            <MaterialCommunityIcons name="heart-outline" size={24} color={colors.textPrimary} />
            <MaterialCommunityIcons name="comment-outline" size={24} color={colors.textPrimary} />
            <MaterialCommunityIcons name="send-outline" size={24} color={colors.textPrimary} />
          </View>
          <MaterialCommunityIcons name="bookmark-outline" size={24} color={colors.textPrimary} />
        </View>

        <View style={styles.previewCaptionContainer}>
          <Text style={styles.previewCaption}>
            <Text style={styles.previewCaptionName}>jordan_smith_re </Text>
            {truncated || 'Your caption will appear here...'}
            {caption.length > 80 && <Text style={styles.previewCaptionMore}> more</Text>}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function CreatePostScreen() {
  const { colors, theme } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [step, setStep] = useState<StepId | 'success'>(1);
  const [targetContent, setTargetContent] = useState('123 Business Way, Los Angeles (Property)');
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [platforms, setPlatforms] = useState<PlatformId[]>(['instagram', 'facebook', 'tiktok']);
  const [previewPlatform, setPreviewPlatform] = useState<PlatformId>('instagram');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>(['m1']); // Default selection
  const [lastSelectedMediaUri, setLastSelectedMediaUri] = useState(MEDIA_GRID[0].uri);
  const [strategy, setStrategy] = useState<StrategyId>('optimal');
  const [acquisitionType, setAcquisitionType] = useState<'manual' | 'ai'>('manual');

  const togglePlatform = useCallback((id: PlatformId) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const handleMediaSelect = useCallback((m: typeof MEDIA_GRID[0]) => {
    setSelectedMediaIds((prev) => {
      const exists = prev.includes(m.id);
      if (exists) {
        const filtered = prev.filter((id) => id !== m.id);
        // If we unselected the one currently in preview, pick the next available
        if (m.uri === lastSelectedMediaUri && filtered.length > 0) {
          const nextId = filtered[filtered.length - 1];
          const nextMedia = MEDIA_GRID.find(item => item.id === nextId);
          if (nextMedia) setLastSelectedMediaUri(nextMedia.uri);
        }
        return filtered;
      } else {
        setLastSelectedMediaUri(m.uri); // Update preview immediately to the newly selected photo
        return [...prev, m.id];
      }
    });
  }, [lastSelectedMediaUri]);

  const mediaItems = useMemo(() => MEDIA_GRID.map((m) => ({ ...m, selected: selectedMediaIds.includes(m.id) })), [selectedMediaIds]);

  const goNext = useCallback(() => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep('success');
  }, [step]);

  const goBack = useCallback(() => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  }, [step]);

  const handleGoToCalendar = useCallback(() => {
    router.replace('/(main)/social-hub/scheduler');
  }, [router]);

  const handleCreateAnother = useCallback(() => {
    setStep(1);
    setSelectedMediaIds(['m1']);
    setLastSelectedMediaUri(MEDIA_GRID[0].uri);
    setStrategy('optimal');
  }, []);

  if (step === 'success') {
    return (
      <LinearGradient
        colors={colors.backgroundGradient as any}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.background, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Create New Post</Text>
            <Text style={styles.stepLabel}>Success</Text>
            <ProgressStepper currentStep={3} totalSteps={3} />
          </View>
        </View>
        <View style={styles.successContent}>
          <MaterialCommunityIcons name="rocket-launch" size={72} color={theme === 'dark' ? '#FFFFFF' : '#0B2341'} style={{ marginBottom: 20 }} />
          <Text style={styles.successTitle}>Post Scheduled!</Text>
          <Text style={styles.successDesc}>
            Your posts have been queued and will be published automatically.{"\n"}We'll notify you once they're live.
          </Text>
          <View style={styles.successActions}>
            <Pressable style={styles.successPrimaryBtn} onPress={handleGoToCalendar}>
              <Text style={styles.successPrimaryBtnText}>Go to Calendar</Text>
            </Pressable>
            <Pressable style={styles.successSecondaryBtn} onPress={handleCreateAnother}>
              <Text style={styles.successSecondaryBtnText}>Create Another</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Create New Post</Text>
          <Text style={styles.stepLabel}>Step {step} of 3: {STEPS[step - 1].label}</Text>
          <ProgressStepper currentStep={step} totalSteps={3} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Step 1: Post Configuration */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.sectionCard}>
              <Text style={styles.fieldLabel}>Target Content</Text>
              <Pressable style={styles.dropdown}>
                <Text style={styles.dropdownText} numberOfLines={1}>{targetContent}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.captionHeader}>
                <Text style={styles.fieldLabel}>Caption</Text>
                <Pressable style={styles.aiRegenerateBtn}>
                  <MaterialCommunityIcons name="auto-fix" size={16} color="#0BA0B2" />
                  <Text style={styles.aiRegenerateText}>Regenerate with AI</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.captionInput}
                value={caption}
                onChangeText={setCaption}
                placeholder="Write your post caption..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
              />
              <View style={styles.hashtagRow}>
                {HASHTAG_CHIPS.map((tag) => (
                  <Pressable key={tag} style={styles.hashtagChip}>
                    <Text style={styles.hashtagChipText}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.fieldLabel}>Select Platforms</Text>
              <View style={styles.platformGrid}>
                {PLATFORMS.map((p) => {
                  const selected = platforms.includes(p.id);
                  return (
                    <Pressable
                      key={p.id}
                      style={[styles.platformTile, selected && styles.platformTileSelected]}
                      onPress={() => togglePlatform(p.id)}>
                      <MaterialCommunityIcons
                        name={p.icon as any}
                        size={24}
                        color={selected ? '#0B2D3E' : '#64748B'}
                      />
                      <Text style={[styles.platformTileText, selected && styles.platformTileTextSelected]}>
                        {p.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Step 2: Media Selection */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Media Asset Acquisition</Text>

              <View style={styles.tabContainer}>
                <Pressable
                  style={[styles.tab, acquisitionType === 'manual' && styles.tabActive]}
                  onPress={() => setAcquisitionType('manual')}>
                  <Text style={[styles.tabText, acquisitionType === 'manual' && styles.tabTextActive]}>Manual Upload</Text>
                </Pressable>
                <Pressable
                  style={[styles.tab, acquisitionType === 'ai' && styles.tabActive]}
                  onPress={() => setAcquisitionType('ai')}>
                  <Text style={[styles.tabText, acquisitionType === 'ai' && styles.tabTextActive]}>Generate by AI</Text>
                </Pressable>
              </View>

              <View style={styles.uploadArea}>
                <View style={[styles.uploadBox, { borderStyle: 'dotted' }]}>
                  <Pressable style={styles.uploadBtn}>
                    <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
                    <Text style={styles.uploadBtnText}>Upload Asset</Text>
                  </Pressable>
                  <Text style={styles.uploadHint}>Click to initiate the architectural import sequence</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.fieldLabel}>ASSET GALLERY</Text>
              <View style={styles.mediaGrid}>
                {mediaItems.map((m) => (
                  <Pressable
                    key={m.id}
                    style={styles.mediaCell}
                    onPress={() => handleMediaSelect(m)}>
                    <Image source={{ uri: m.uri }} style={styles.mediaCellImage} />
                    {m.selected && (
                      <View style={styles.mediaCellCheck}>
                        <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Scheduling */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Publishing Strategy</Text>
              <View style={styles.strategyList}>
                {STRATEGIES.map((s) => {
                  const isSelected = strategy === s.id;
                  return (
                    <Pressable
                      key={s.id}
                      style={[styles.strategyTile, isSelected && styles.strategyTileSelected]}
                      onPress={() => setStrategy(s.id)}>
                      <View style={[styles.strategyIcon, isSelected && styles.strategyIconSelected]}>
                        <MaterialCommunityIcons
                          name={s.icon as any}
                          size={22}
                          color={isSelected ? '#0BA0B2' : '#64748B'}
                        />
                      </View>
                      <View style={styles.strategyInfo}>
                        <Text style={[styles.strategyLabel, isSelected && styles.strategyLabelSelected]}>
                          {s.title}
                        </Text>
                        <Text style={styles.strategyHint}>{s.desc}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        <PostPreviewCard
          caption={caption}
          previewPlatform={previewPlatform}
          selectedMedia={selectedMediaIds.length > 0 ? lastSelectedMediaUri : undefined}
          onPreviewPlatformChange={setPreviewPlatform}
        />
      </ScrollView>

      {/* Fixed Footer Actions */}
      {typeof step === 'number' && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {(step === 2 || step === 3) && (
            <Pressable style={styles.draftBtn}>
              <Text style={styles.draftBtnText}>Save as Draft</Text>
            </Pressable>
          )}
          <View style={styles.actionRow}>
            {step > 1 && (
              <Pressable style={styles.backActionBtn} onPress={goBack}>
                <Text style={styles.backActionBtnText}>Back</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.primaryActionBtn, step === 1 && { flex: 1 }]}
              onPress={goNext}>
              <Text style={styles.primaryActionBtnText}>
                {step === 3 ? 'Schedule Optimal' : 'Continue'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
  background: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  headerCenter: { flex: 1 },
  title: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
  stepLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', marginTop: 4 },
  stepper: { flexDirection: 'row', gap: 6, marginTop: 12 },
  stepperSegment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.cardBackground },
  stepperSegmentActive: { backgroundColor: colors.accentTeal },
  stepperSegmentComplete: { backgroundColor: colors.accentTeal },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18 },
  stepContainer: { gap: 16, marginBottom: 20 },
  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0A2F48',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '800', color: colors.textSecondary, marginBottom: 10 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  dropdownText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, flex: 1 },
  captionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiRegenerateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiRegenerateText: { fontSize: 12, fontWeight: '700', color: '#0BA0B2' },
  captionInput: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 140,
    lineHeight: 22,
  },
  hashtagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  hashtagChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#EEF2F6',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  hashtagChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  platformGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  platformTile: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBackground,
  },
  platformTileSelected: { borderColor: colors.surfaceIcon, backgroundColor: colors.surfaceSoft },
  platformTileText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  platformTileTextSelected: { color: colors.textPrimary },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.cardBackground, shadowColor: colors.cardShadowColor, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  tabTextActive: { color: colors.textPrimary },
  uploadArea: { marginBottom: 20 },
  uploadBox: {
    height: 140,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accentTeal,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
  },
  uploadBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  uploadHint: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  mediaCell: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSoft,
    position: 'relative',
  },
  mediaCellImage: { width: '100%', height: '100%' },
  mediaCellCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  strategyList: { gap: 12 },
  strategyTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBackground,
  },
  strategyTileSelected: { borderColor: colors.surfaceIcon, backgroundColor: colors.surfaceSoft },
  strategyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  strategyIconSelected: { backgroundColor: colors.surfaceIcon },
  strategyInfo: { flex: 1 },
  strategyLabel: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  strategyLabelSelected: { color: '#0BA0B2' },
  strategyHint: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  previewCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 28,
    marginTop: 10,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 32,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  previewTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  previewIconTab: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  previewIconTabActive: {
    backgroundColor: colors.surfaceSoft,
  },
  previewBody: { padding: 0 },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  previewProfile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentTeal, alignItems: 'center', justifyContent: 'center' },
  previewProfileName: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  previewProfileLoc: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  previewMediaWrap: { width: '100%', aspectRatio: 1, backgroundColor: colors.surfaceSoft },
  previewImage: { width: '100%', height: '100%' },
  previewImagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  previewImagePlaceholderText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  previewFooterActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  previewActionsLeft: { flexDirection: 'row', gap: 14 },
  previewCaptionContainer: { paddingHorizontal: 12, paddingBottom: 20 },
  previewCaption: { fontSize: 13, color: colors.textPrimary, lineHeight: 18 },
  previewCaptionName: { fontWeight: '800' },
  previewCaptionMore: { color: colors.textSecondary },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.surfaceIcon,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  draftBtn: { alignSelf: 'center', marginBottom: 16, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.cardBorder },
  draftBtnText: { fontSize: 14, fontWeight: '700', color: '#0BA0B2' },
  actionRow: { flexDirection: 'row', gap: 12 },
  backActionBtn: { flex: 1, height: 56, borderRadius: 16, backgroundColor: colors.cardBackground, borderWidth: 2, borderColor: colors.surfaceIcon, alignItems: 'center', justifyContent: 'center' },
  backActionBtnText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  primaryActionBtn: { flex: 2, height: 56, borderRadius: 16, backgroundColor: colors.accentTeal, alignItems: 'center', justifyContent: 'center' },
  primaryActionBtnText: { fontSize: 16, fontWeight: '900', color: '#FFF' },
  successContent: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 28, fontWeight: '900', color: colors.textPrimary, textAlign: 'center', marginBottom: 12 },
  successDesc: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  successActions: { flexDirection: 'row', gap: 12, marginTop: 40, width: '100%', justifyContent: 'center' },
  successPrimaryBtn: { flex: 1, height: 56, borderRadius: 12, backgroundColor: colors.accentTeal, alignItems: 'center', justifyContent: 'center', shadowColor: colors.cardShadowColor, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  successPrimaryBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  successSecondaryBtn: { flex: 1, height: 56, borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.cardBackground, alignItems: 'center', justifyContent: 'center' },
  successSecondaryBtnText: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  });
}
