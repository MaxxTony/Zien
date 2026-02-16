import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
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
type PlatformId = 'instagram' | 'facebook' | 'linkedin';
type StrategyId = 'immediate' | 'optimal' | 'custom';

const PLATFORMS: { id: PlatformId; label: string; icon: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
];

const HASHTAG_CHIPS = ['#Luxury', '#OpenHouse', '#ZienRealty', '#LALiving'];

const DEFAULT_CAPTION = `✨ JUST LISTED! Check out this stunning modern home at 123 Business Way, Los Angeles. Featuring 4 bedrooms, 3 baths, and a resort-style backyard.

DM for a private tour!

#RealEstate #JustListed #LosAngelesRealEstate #ZienAI`;

// Placeholder media IDs for grid (in real app these would be image URIs)
const MEDIA_GRID = [
  { id: 'm1', selected: true },
  { id: 'm2', selected: false },
  { id: 'm3', selected: false },
  { id: 'm4', selected: false },
  { id: 'm5', selected: false },
];

const STRATEGIES: { id: StrategyId; title: string; desc: string; icon: string }[] = [
  { id: 'immediate', title: 'Publish Immediately', desc: 'Push to all connected platforms right now.', icon: 'lightning-bolt-outline' },
  { id: 'optimal', title: 'Schedule for Optimal Time', desc: 'AI suggests Today @ 6:45 PM based on audience activity.', icon: 'chart-line' },
  { id: 'custom', title: 'Custom Schedule', desc: 'Pick specific date and time for each platform.', icon: 'calendar-blank-outline' },
];

function ProgressStepper({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
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
  onPreviewPlatformChange,
}: {
  caption: string;
  previewPlatform: 'instagram' | 'facebook' | 'linkedin';
  onPreviewPlatformChange?: (p: 'instagram' | 'facebook' | 'linkedin') => void;
}) {
  const truncated = caption.length > 80 ? caption.slice(0, 80) + '...' : caption;
  return (
    <View style={styles.previewCard}>
      <View style={styles.previewTabs}>
        {(['instagram', 'facebook', 'linkedin'] as const).map((p) => (
          <Pressable
            key={p}
            style={[styles.previewTab, previewPlatform === p && styles.previewTabActive]}
            onPress={() => onPreviewPlatformChange?.(p)}>
            <Text style={[styles.previewTabText, previewPlatform === p && styles.previewTabTextActive]}>
              {p.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.previewBody}>
        <View style={styles.previewProfile}>
          <View style={styles.previewAvatar} />
          <Text style={styles.previewProfileName}>Jordan Smith Real Estate</Text>
        </View>
        <View style={styles.previewImagePlaceholder}>
          <MaterialCommunityIcons name="image-outline" size={48} color="#9CA3AF" />
        </View>
        <View style={styles.previewActions}>
          <MaterialCommunityIcons name="heart-outline" size={22} color="#0B2D3E" />
          <MaterialCommunityIcons name="comment-outline" size={22} color="#0B2D3E" />
          <MaterialCommunityIcons name="share-outline" size={22} color="#0B2D3E" />
        </View>
        <Text style={styles.previewCaption} numberOfLines={2}>
          {truncated || 'Your caption will appear here...'}
          {caption.length > 80 && <Text style={styles.previewCaptionMore}> more</Text>}
        </Text>
      </View>
    </View>
  );
}

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [step, setStep] = useState<StepId | 'success'>(1);
  const [targetContent, setTargetContent] = useState('123 Business Way, Los Angeles (Property)');
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [platforms, setPlatforms] = useState<PlatformId[]>(['instagram', 'facebook']);
  const [previewPlatform, setPreviewPlatform] = useState<PlatformId>('instagram');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>(['m1']);
  const [strategy, setStrategy] = useState<StrategyId>('optimal');

  const togglePlatform = useCallback((id: PlatformId) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const toggleMedia = useCallback((id: string) => {
    setSelectedMediaIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }, []);

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

  const handleScheduleCampaign = useCallback(() => {
    setStep('success');
  }, []);

  const handleGoToCalendar = useCallback(() => {
    router.replace('/(main)/social-hub/scheduler');
  }, [router]);

  const handleCreateAnother = useCallback(() => {
    setStep(1);
    setSelectedMediaIds(['m1']);
    setStrategy('optimal');
  }, []);

  if (step === 'success') {
    return (
      <LinearGradient
        colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.background, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Create New Post</Text>
            <Text style={styles.stepLabel}>Step 3 of 3: Scheduling</Text>
            <ProgressStepper currentStep={3} totalSteps={3} />
          </View>
        </View>
        <View style={styles.successContent}>
          <View style={styles.successIconWrap}>
            <MaterialCommunityIcons name="rocket-launch" size={56} color="#EA580C" />
          </View>
          <Text style={styles.successTitle}>Campaign Scheduled!</Text>
          <Text style={styles.successDesc}>
            Your posts have been queued and will be published automatically.
          </Text>
          <Text style={styles.successDesc}>We'll notify you once they're live.</Text>
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
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Create New Post</Text>
          <Text style={styles.stepLabel}>Step {step} of 3: {STEPS[step - 1].label}</Text>
          <ProgressStepper currentStep={step} totalSteps={3} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 130 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Step 1: Post Configuration */}
        {step === 1 && (
          <>
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Target Content</Text>
              <Pressable style={styles.dropdown}>
                <Text style={styles.dropdownText} numberOfLines={1}>{targetContent}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
              </Pressable>
            </View>
            <View style={styles.card}>
              <View style={styles.captionHeader}>
                <Text style={styles.fieldLabel}>Caption</Text>
                <Pressable style={styles.aiRegenerateBtn}>
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#0BA0B2" />
                  <Text style={styles.aiRegenerateText}>Regenerate with AI</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.captionInput}
                value={caption}
                onChangeText={setCaption}
                placeholder="Write your post caption..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
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
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Select Platforms</Text>
              <View style={styles.platformRow}>
                {PLATFORMS.map((p) => {
                  const selected = platforms.includes(p.id);
                  return (
                    <Pressable
                      key={p.id}
                      style={[styles.platformChip, selected && styles.platformChipSelected]}
                      onPress={() => togglePlatform(p.id)}>
                      <MaterialCommunityIcons
                        name={p.icon as any}
                        size={22}
                        color={selected ? '#0B2D3E' : '#9CA3AF'}
                      />
                      <Text style={[styles.platformChipText, selected && styles.platformChipTextSelected]}>
                        {p.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <PostPreviewCard caption={caption} previewPlatform={previewPlatform} onPreviewPlatformChange={setPreviewPlatform} />
          </>
        )}

        {/* Step 2: Media Selection */}
        {step === 2 && (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Select Media Assets</Text>
              <View style={styles.mediaGrid}>
                {mediaItems.map((m) => (
                  <Pressable
                    key={m.id}
                    style={[styles.mediaCell, m.selected && styles.mediaCellSelected]}
                    onPress={() => toggleMedia(m.id)}>
                    <View style={styles.mediaCellImage}>
                      <MaterialCommunityIcons name="image-outline" size={28} color="#9CA3AF" />
                    </View>
                    {m.selected && (
                      <View style={styles.mediaCellCheck}>
                        <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                ))}
                <Pressable style={styles.mediaCellUpload}>
                  <MaterialCommunityIcons name="plus" size={24} color="#5B6B7A" />
                  <Text style={styles.mediaCellUploadText}>UPLOAD</Text>
                </Pressable>
              </View>
            </View>
            <PostPreviewCard caption={caption} previewPlatform={previewPlatform} onPreviewPlatformChange={setPreviewPlatform} />
          </>
        )}

        {/* Step 3: Scheduling */}
        {step === 3 && (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Publishing Strategy</Text>
              {STRATEGIES.map((s) => {
                const isSelected = strategy === s.id;
                return (
                  <Pressable
                    key={s.id}
                    style={[styles.strategyCard, isSelected && styles.strategyCardSelected]}
                    onPress={() => setStrategy(s.id)}>
                    <View style={[styles.strategyIconWrap, isSelected && styles.strategyIconWrapSelected]}>
                      <MaterialCommunityIcons
                        name={s.icon as any}
                        size={22}
                        color={isSelected ? '#0BA0B2' : '#5B6B7A'}
                      />
                    </View>
                    <View style={styles.strategyBody}>
                      <Text style={[styles.strategyTitle, isSelected && styles.strategyTitleSelected]}>
                        {s.title}
                      </Text>
                      <Text style={styles.strategyDesc}>{s.desc}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <PostPreviewCard caption={caption} previewPlatform={previewPlatform} onPreviewPlatformChange={setPreviewPlatform} />
          </>
        )}
      </ScrollView>

      {/* Fixed bottom: Save as Draft (step 2/3 only) above, then Back + Primary */}
      {typeof step === 'number' && (
        <View style={[styles.fixedFooter, { paddingBottom: 12 + insets.bottom }]}>
          {(step === 2 || step === 3) && (
            <Pressable style={styles.saveDraftBtn}>
              <Text style={styles.saveDraftBtnText}>Save as Draft</Text>
            </Pressable>
          )}
          <View style={styles.footerButtons}>
            {step === 1 ? (
              <View style={styles.footerSpacer} />
            ) : (
              <Pressable style={styles.secondaryBtn} onPress={goBack}>
                <Text style={styles.secondaryBtnText}>Back</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.primaryBtn}
              onPress={step === 3 ? handleScheduleCampaign : goNext}>
              <Text style={styles.primaryBtnText}>
                {step === 3 ? 'Schedule Campaign' : 'Continue'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
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
  headerCenter: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.2,
  },
  stepLabel: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 4,
  },
  stepper: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  stepperSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E3ECF4',
  },
  stepperSegmentComplete: { backgroundColor: '#0BA0B2' },
  stepperSegmentActive: { backgroundColor: '#0BA0B2' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B6B7A',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FBFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  dropdownText: { fontSize: 15, fontWeight: '600', color: '#0B2D3E', flex: 1 },
  captionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiRegenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiRegenerateText: { fontSize: 12, fontWeight: '700', color: '#0BA0B2' },
  captionInput: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0B2D3E',
    minHeight: 120,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  hashtagChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E8EEF6',
  },
  hashtagChipText: { fontSize: 13, fontWeight: '600', color: '#0B2D3E' },
  platformRow: { flexDirection: 'row', gap: 10 },
  platformChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
  },
  platformChipSelected: {
    borderColor: '#0BA0B2',
    backgroundColor: 'rgba(11, 160, 178, 0.08)',
  },
  platformChipText: { fontSize: 13, fontWeight: '700', color: '#5B6B7A' },
  platformChipTextSelected: { color: '#0B2D3E' },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    overflow: 'hidden',
    marginBottom: 12,
  },
  previewTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF6',
  },
  previewTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  previewTabActive: { borderBottomWidth: 2, borderBottomColor: '#0BA0B2' },
  previewTabText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  previewTabTextActive: { color: '#0B2D3E', fontWeight: '800' },
  previewBody: { padding: 12 },
  previewProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  previewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0B2D3E',
  },
  previewProfileName: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  previewImagePlaceholder: {
    aspectRatio: 1,
    backgroundColor: '#E8EEF6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  previewCaption: { fontSize: 13, fontWeight: '600', color: '#0B2D3E', lineHeight: 20 },
  previewCaptionMore: { color: '#9CA3AF' },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'rgba(202, 216, 228, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(227, 236, 244, 0.8)',
  },
  saveDraftBtn: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0BA0B2',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  footerSpacer: { width: 0 },
  ghostBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  ghostBtnText: { fontSize: 15, fontWeight: '700', color: '#0BA0B2' },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0B2D3E',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: '#0B2D3E' },
  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    minWidth: 120,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 14,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mediaCell: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#E8EEF6',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  mediaCellSelected: {
    borderColor: '#0BA0B2',
  },
  mediaCellImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaCellCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0BA0B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaCellUpload: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaCellUploadText: { fontSize: 11, fontWeight: '800', color: '#5B6B7A', marginTop: 4 },
  strategyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  strategyCardSelected: {
    borderColor: '#0BA0B2',
    backgroundColor: 'rgba(11, 160, 178, 0.06)',
  },
  strategyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8EEF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  strategyIconWrapSelected: {
    backgroundColor: 'rgba(11, 160, 178, 0.15)',
  },
  strategyBody: { flex: 1 },
  strategyTitle: { fontSize: 15, fontWeight: '700', color: '#0B2D3E' },
  strategyTitleSelected: { color: '#0B2D3E' },
  strategyDesc: { fontSize: 12, color: '#5B6B7A', marginTop: 2 },
  successContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  successIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(234, 88, 12, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 12,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 15,
    color: '#5B6B7A',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  successActions: {
    width: '100%',
    gap: 12,
    marginTop: 28,
  },
  successPrimaryBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    marginBottom: 10,
  },
  successPrimaryBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  successSecondaryBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#0B2D3E',
    alignItems: 'center',
  },
  successSecondaryBtnText: { fontSize: 16, fontWeight: '700', color: '#0B2D3E' },
});
