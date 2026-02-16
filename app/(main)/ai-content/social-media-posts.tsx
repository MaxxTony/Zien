import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock Data for Social Media Platforms
interface PlatformOption {
    id: 'instagram' | 'facebook' | 'linkedin';
    title: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
}

const PLATFORM_OPTIONS: PlatformOption[] = [
    {
        id: 'instagram',
        title: 'Instagram',
        description: "Craft optimized posts for Instagram's unique audience.",
        icon: 'instagram',
        color: '#E1306C',
        bgColor: '#FDF2F8',
    },
    {
        id: 'facebook',
        title: 'Facebook',
        description: "Craft optimized posts for Facebook's unique audience.",
        icon: 'facebook',
        color: '#1877F2',
        bgColor: '#EFF6FF',
    },
    {
        id: 'linkedin',
        title: 'LinkedIn',
        description: "Craft optimized posts for LinkedIn's unique audience.",
        icon: 'linkedin',
        color: '#0A66C2',
        bgColor: '#F0F9FF',
    },
];

const GENERATED_POSTS = {
    instagram: `🏠 JUST LISTED: A masterpiece of modern architecture.\n\nExperience the pinnacle of luxury living in this stunning feature. Every detail has been curated for the discerning homeowner.\n\n✨ Key features:\n• Panoramic city views\n• Bespoke designer finishes\n• Private outdoor oasis\n\nContact us for a private tour today! #RealEstate #LuxuryLiving #DreamHome`,
    facebook: `🏠 JUST LISTED: A masterpiece of modern architecture.\n\nExperience the pinnacle of luxury living in this stunning Facebook feature. Every detail has been curated for the discerning homeowner.\n\n✨ Key features:\n• Panoramic city views\n• Bespoke designer finishes\n• Private outdoor oasis\n\nContact us for a private tour today! #RealEstate #LuxuryLiving #FacebookRealEstate`,
    linkedin: `Excited to announce our newest listing: A masterpiece of modern architecture.\n\nThis property represents the pinnacle of luxury living, with every detail curated for the discerning homeowner.\n\nKey Highlights:\n• Panoramic city views\n• Bespoke designer finishes\n• Private outdoor oasis\n\nPerfect for executives looking for a private retreat. DM to schedule a showing. #RealEstate #LuxuryProperty #NewListing`
};

type FlowStep = 'selection' | 'loading' | 'preview' | 'success';

export default function SocialMediaPostsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [step, setStep] = useState<FlowStep>('selection');
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption['id'] | null>(null);

    // Preview State
    const [generatedContent, setGeneratedContent] = useState('');
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Animation for loading bar (unused visually but kept for logic if needed, simplified here)
    // const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (step === 'loading') {
            // Simulate generation time
            const timer = setTimeout(() => {
                if (selectedPlatform) {
                    setGeneratedContent(GENERATED_POSTS[selectedPlatform]);
                }
                setStep('preview');
            }, 3000); // 3 seconds delay as per "after some sec"
            return () => clearTimeout(timer);
        }
    }, [step, selectedPlatform]);

    const handlePlatformSelect = (id: PlatformOption['id']) => {
        setSelectedPlatform(id);
        setStep('loading');
    };

    const handleRegenerate = () => {
        setIsRegenerating(true);
        // Simulate API call
        setTimeout(() => {
            if (selectedPlatform) {
                // Add a slight variation to signify regeneration
                const newText = `✨ REFRESHED CONTENT ✨\n\n` + GENERATED_POSTS[selectedPlatform];
                setGeneratedContent(newText);
            }
            setIsRegenerating(false);
        }, 1500);
    };

    const handleSave = () => {
        setStep('success');
    };

    const handleDone = () => {
        router.back(); // Go back to AI Content Hub
    };

    const getPlatformDetails = () => {
        return PLATFORM_OPTIONS.find(p => p.id === selectedPlatform) || PLATFORM_OPTIONS[0];
    };

    const renderHeader = (title: string, subtitle?: string) => (
        <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => step === 'selection' ? router.back() : setStep('selection')}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
            </Pressable>
            <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    );

    // --- STEP 1: SELECTION ---
    const renderSelection = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {renderHeader('Social Media Posts', 'Select your target platform and let AI craft the perfect caption.')}

            <View style={styles.platformsGrid}>
                {PLATFORM_OPTIONS.map((platform) => (
                    <Pressable
                        key={platform.id}
                        style={styles.platformCard}
                        onPress={() => handlePlatformSelect(platform.id)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: platform.bgColor }]}>
                            <MaterialCommunityIcons name={platform.icon as any} size={32} color={platform.color} />
                        </View>
                        <Text style={styles.platformTitle}>{platform.title}</Text>
                        <Text style={styles.platformDesc}>{platform.description}</Text>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );

    // --- STEP 2: LOADING ---
    const renderLoading = () => {
        const platform = getPlatformDetails();
        return (
            <View style={styles.centerContainer}>
                <View style={styles.loaderIconContainer}>
                    <MaterialCommunityIcons name="auto-fix" size={48} color="#0B2D3E" />
                    {/* Overlaying a spinner or just using activity indicator independently often looks cleaner. 
                         The screenshot shows a specific icon setup. Using ActivityIndicator for simplicity + icon.
                     */}
                </View>
                <ActivityIndicator size="large" color="#0B2D3E" style={{ marginBottom: 20 }} />

                <Text style={styles.loadingTitle}>Generating {platform.title} Content...</Text>
                <Text style={styles.loadingSubtitle}>
                    AI is writing high-engagement copy tailored for social speed.
                </Text>
            </View>
        );
    };

    // --- STEP 3: PREVIEW ---
    const renderPreview = () => {
        const platform = getPlatformDetails();
        return (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Custom Header for Preview with Actions */}
                <View style={styles.previewHeaderContainer}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable style={styles.backButton} onPress={() => setStep('selection')}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
                        </Pressable>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>{platform.title} Draft</Text>
                            <View style={styles.optimizedBadge}>
                                <MaterialCommunityIcons name="check" size={14} color="#10B981" />
                                <Text style={styles.optimizedText}>Optimized for current {platform.title} trends.</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.headerActions}>
                        <Pressable
                            style={styles.regenerateBtn}
                            onPress={handleRegenerate}
                            disabled={isRegenerating}
                        >
                            {isRegenerating ? (
                                <ActivityIndicator size="small" color="#0B2D3E" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="refresh" size={16} color="#0B2D3E" />
                                    <Text style={styles.regenerateText}>Refresh</Text>
                                </>
                            )}
                        </Pressable>
                        <Pressable style={styles.headerSaveBtn} onPress={handleSave}>
                            <MaterialCommunityIcons name="content-save-outline" size={18} color="#FFFFFF" />
                            <Text style={styles.headerSaveBtnText}>Save Post</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.previewCard}>
                    {/* Simulating the platform header in preview could be nice, but simple text input is requested */}
                    <TextInput
                        style={styles.previewInput}
                        multiline
                        value={generatedContent}
                        onChangeText={setGeneratedContent}
                        textAlignVertical="top"
                    />
                </View>
            </ScrollView>
        );
    };

    // --- STEP 4: SUCCESS ---
    const renderSuccess = () => {
        const platform = getPlatformDetails();
        return (
            <View style={styles.centerContainer}>
                <View style={[styles.successCircle, { backgroundColor: '#0B2D3E' }]}>
                    <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>Post Ready!</Text>
                <Text style={styles.successSubtitle}>
                    Your {platform.title} post has been saved to your content library.
                </Text>
                <Pressable style={styles.returnButton} onPress={handleDone}>
                    <Text style={styles.returnButtonText}>Back to Hub</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F0F6FA', '#E0ECF4', '#F4F0EE']}
                style={[styles.background, { paddingTop: insets.top }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {step === 'selection' && renderSelection()}
                {step === 'loading' && renderLoading()}
                {step === 'preview' && renderPreview()}
                {step === 'success' && renderSuccess()}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    header: {
        marginBottom: 24,
        marginTop: 10,
        flexDirection: 'row',
        gap: 10
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    headerText: {
        flex: 1,
        gap: 4,
        paddingRight: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0B2D3E',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        flexWrap: 'wrap',
    },
    // Selection Step
    platformsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },
    platformCard: {
        width: '100%',
        // Logic for responsive grid: 
        // On mobile 100%, on larger screens maybe side by side. 
        // Screenshot shows 3 cards, possibly horizontal scrollable or just stacked. 
        // Let's settle for stacked full width on mobile for better touch targets, or slightly smaller to fit.
        // If we want to mimic screenshot exactly (side by side), we need horizontal scroll view or Flex Wrap with defined widths.
        // Assuming mobile vertical scroll is default for RN apps unless specified.
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 0, // Handled by gap
        minHeight: 200,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    platformTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0B2D3E',
        marginBottom: 8,
    },
    platformDesc: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
    // Loading Step
    loaderIconContainer: {
        marginBottom: 24,
        opacity: 0.5,
    },
    loadingTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 12,
        textAlign: 'center',
    },
    loadingSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    // Preview Step
    previewHeaderContainer: {
        marginBottom: 24,
        marginTop: 10,
        gap: 16,
    },
    optimizedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    optimizedText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    headerSaveBtn: {
        backgroundColor: '#0B2D3E',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerSaveBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
    },
    previewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 24,
        minHeight: 400,
    },
    regenerateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    regenerateText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    previewInput: {
        fontSize: 16,
        color: '#0F172A',
        lineHeight: 28,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        minHeight: 350,
    },
    // Success Step
    successCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 12,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    returnButton: {
        backgroundColor: '#0B2D3E',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    returnButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
