import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock Data for Contexts
interface PropertyOption {
    id: string;
    title: string;
    subtitle: string | null;
    image: string | null;
    badge: string | null;
}

const PROPERTY_OPTIONS: PropertyOption[] = [
    {
        id: 'generic',
        title: 'Generic Property',
        subtitle: 'Create description from scratch without linking a property.',
        image: null,
        badge: null,
    },
    {
        id: 'prop-1',
        title: '123 Business Way, Los Angeles, CA',
        subtitle: null,
        image: 'https://images.unsplash.com/photo-1600596542815-6ad4c727dddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badge: 'READY',
    },
    {
        id: 'prop-2',
        title: '88 Gold Coast, Malibu, CA',
        subtitle: null,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badge: 'READY',
    },
];

const GENERATED_DESCRIPTION = `Welcome to 123 Business Way, a stunning contemporary estate in the heart of Los Angeles. This architectural masterpiece features soaring ceilings, floor-to-ceiling windows, and an open concept layout perfect for modern living.

The chef's kitchen boasts top-of-the-line appliances and custom cabinetry, flowing seamlessly into the spacious living area. Retreat to the primary suite with its spa-like bath and private balcony overlooking the lush grounds.

Outside, a sparkling pool and manicured gardens create a private oasis. Located just minutes from world-class dining and shopping, this home offers the ultimate Southern California lifestyle.`;

type FlowStep = 'selection' | 'parameters' | 'loading' | 'preview' | 'success';

const TONE_OPTIONS = [
    'Luxury & Exclusive',
    'Professional & Corporate',
    'Friendly & Casual',
    'Urgent & Persuasive',
    'Witty & Humorous',
    'Minimalist & Clean',
];

const LENGTH_OPTIONS = [
    'Standard (3-4 paragraphs)',
    'Short / Teaser',
    'Detailed / Full Specs',
    'Social Media Caption',
];

export default function PropertyDescriptionScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [step, setStep] = useState<FlowStep>('selection');
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

    // Form State
    const [length, setLength] = useState(LENGTH_OPTIONS[0]);
    const [tone, setTone] = useState(TONE_OPTIONS[0]);
    const [showLengthPicker, setShowLengthPicker] = useState(false);
    const [showTonePicker, setShowTonePicker] = useState(false);

    // Preview State
    const [generatedContent, setGeneratedContent] = useState(GENERATED_DESCRIPTION);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Animation for loading bar
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (step === 'loading') {
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false,
            }).start(() => {
                setStep('preview');
            });
        }
    }, [step]);

    const handlePropertySelect = (id: string) => {
        setSelectedProperty(id);
        setStep('loading');
    };

    const handleStartGeneration = () => {
        setStep('loading');
    };

    const handleRegenerate = () => {
        setIsRegenerating(true);
        // Simulate API call
        setTimeout(() => {
            const newText = `Rediscover luxury at 123 Business Way.\n\n` + GENERATED_DESCRIPTION;
            setGeneratedContent(newText);
            setIsRegenerating(false);
        }, 1500);
    };

    const handleSave = () => {
        setStep('success');
    };

    const handleDone = () => {
        router.back(); // Go back to AI Content Hub
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

    // --- STEP 1: SELECT PROPERTY ---
    const renderSelection = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {renderHeader('Property Description', 'Select a property context or create a generic listing description.')}

            <View style={styles.grid}>
                {PROPERTY_OPTIONS.map((prop) => (
                    <Pressable
                        key={prop.id}
                        style={[styles.contextCard, selectedProperty === prop.id && styles.contextCardActive]}
                        onPress={() => handlePropertySelect(prop.id)}
                    >
                        {prop.image ? (
                            <>
                                <Image source={{ uri: prop.image }} style={styles.contextImage} resizeMode="cover" />
                                <View style={styles.contextOverlay} />
                                <View style={styles.contextContent}>
                                    {prop.badge && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{prop.badge}</Text>
                                        </View>
                                    )}
                                    <View style={{ marginTop: 'auto' }}>
                                        <Text style={styles.contextTitleImage} numberOfLines={2}>
                                            {prop.title}
                                        </Text>
                                        {prop.subtitle && (
                                            <Text style={styles.contextSubtitleImage}>{prop.subtitle}</Text>
                                        )}
                                    </View>
                                </View>
                            </>
                        ) : (
                            <View style={styles.genericContent}>
                                <View style={styles.genericIconCircle}>
                                    <MaterialCommunityIcons name="cube-outline" size={32} color="#0B2D3E" />
                                </View>
                                <Text style={styles.contextTitleGeneric}>{prop.title}</Text>
                                <Text style={styles.contextSubtitleGeneric}>{prop.subtitle}</Text>
                            </View>
                        )}
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );

    // --- STEP 2: GENERATION PARAMETERS ---
    const renderParameters = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {renderHeader('Description Details', "Customize the tone and length of your property description.")}

            <View style={styles.card}>
                {/* Length Picker */}
                <View style={[styles.inputGroup, { zIndex: 20 }]}>
                    <Text style={styles.inputLabel}>Description Length</Text>
                    <Pressable
                        style={styles.pickerView}
                        onPress={() => {
                            setShowLengthPicker(!showLengthPicker);
                            setShowTonePicker(false);
                        }}
                    >
                        <Text style={styles.pickerText}>{length}</Text>
                        <MaterialCommunityIcons
                            name={showLengthPicker ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#64748B"
                        />
                    </Pressable>
                    {showLengthPicker && (
                        <View style={styles.dropdownList}>
                            {LENGTH_OPTIONS.map((option) => (
                                <Pressable
                                    key={option}
                                    style={[styles.dropdownItem, length === option && styles.dropdownItemActive]}
                                    onPress={() => {
                                        setLength(option);
                                        setShowLengthPicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        length === option && styles.dropdownItemTextActive
                                    ]}>
                                        {option}
                                    </Text>
                                    {length === option && (
                                        <MaterialCommunityIcons name="check" size={18} color="#0B2D3E" />
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                {/* Tone Picker */}
                <View style={[styles.inputGroup, { zIndex: 10 }]}>
                    <Text style={styles.inputLabel}>Tone of Voice</Text>
                    <Pressable
                        style={styles.pickerView}
                        onPress={() => {
                            setShowTonePicker(!showTonePicker);
                            setShowLengthPicker(false);
                        }}
                    >
                        <Text style={styles.pickerText}>{tone}</Text>
                        <MaterialCommunityIcons
                            name={showTonePicker ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#64748B"
                        />
                    </Pressable>
                    {showTonePicker && (
                        <View style={styles.dropdownList}>
                            {TONE_OPTIONS.map((option) => (
                                <Pressable
                                    key={option}
                                    style={[styles.dropdownItem, tone === option && styles.dropdownItemActive]}
                                    onPress={() => {
                                        setTone(option);
                                        setShowTonePicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        tone === option && styles.dropdownItemTextActive
                                    ]}>
                                        {option}
                                    </Text>
                                    {tone === option && (
                                        <MaterialCommunityIcons name="check" size={18} color="#0B2D3E" />
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.footerActions}>
                <Pressable style={styles.secondaryButton} onPress={() => setStep('selection')}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </Pressable>
                <Pressable style={styles.primaryButton} onPress={handleStartGeneration}>
                    <Text style={styles.primaryButtonText}>Generate Description</Text>
                    <MaterialCommunityIcons name="auto-fix" size={20} color="#FFFFFF" />
                </Pressable>
            </View>
        </ScrollView>
    );

    // --- STEP 3: LOADING ---
    const renderLoading = () => (
        <View style={styles.centerContainer}>
            <View style={styles.loaderCircle}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
            <Text style={styles.loadingTitle}>Crafting Description...</Text>
            <Text style={styles.loadingSubtitle}>
                Analyzing architectural details and luxury market trends.
            </Text>
        </View>
    );

    // --- STEP 4: PREVIEW ---
    // --- STEP 4: PREVIEW ---
    const renderPreview = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Custom Header for Preview with Actions */}
            <View style={styles.previewHeaderContainer}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Pressable style={styles.backButton} onPress={() => setStep('selection')}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Review & Refine</Text>
                        <Text style={styles.headerSubtitle}>Fine-tune your AI-generated copy for perfection.</Text>
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
                                <Text style={styles.regenerateText}>Regenerate</Text>
                            </>
                        )}
                    </Pressable>
                    <Pressable style={styles.headerSaveBtn} onPress={handleSave}>
                        <MaterialCommunityIcons name="content-save-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.headerSaveBtnText}>Save Description</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.previewCard}>
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

    // --- STEP 5: SUCCESS ---
    // --- STEP 5: SUCCESS ---
    const renderSuccess = () => (
        <View style={styles.centerContainer}>
            <View style={[styles.successCircle, { backgroundColor: '#0B2D3E' }]}>
                <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Listing Saved!</Text>
            <Text style={styles.successSubtitle}>
                Your property description has been successfully added to your library.
            </Text>
            <Pressable style={styles.returnButton} onPress={handleDone}>
                <Text style={styles.returnButtonText}>Back to AI Content Hub</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F0F6FA', '#E0ECF4', '#F4F0EE']}
                style={[styles.background, { paddingTop: insets.top }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {step === 'selection' && renderSelection()}
                {step === 'parameters' && renderParameters()}
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
    grid: {
        gap: 16,
        flexDirection: 'row', // Updated to allow horizontal structure if needed, or stick to veritcal. Screenshot shows Horizontal cards? No, they look like they could be horizontal or wrapped.
        // The screenshot shows 3 cards in a row. It's likely a horizontal scroll or a grid with multiple items. 
        // In mobile view (React Native), a horizontal scrollview is usually used for a row of cards, or flexWrap for a grid.
        // In create.tsx it was a vertical list (gap 16).
        // If I want to match the screenshot which shows them side-by-side (likely desktop or tablet view, or just horizontal scroll), 
        // I will use flexWrap: 'wrap' and calculate width.
        flexWrap: 'wrap',
    },
    contextCard: {
        // Screenshot shows them side by side.
        width: Platform.OS === 'web' ? '32%' : '100%', // Fallback for mobile
        minWidth: 300,
        flex: 1,
        height: 220, // Taller cards
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    contextCardActive: {
        borderColor: '#0BA0B2',
    },
    contextImage: {
        ...StyleSheet.absoluteFillObject,
    },
    contextOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)', // Lighter overlay
    },
    contextContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    badge: {
        alignSelf: 'flex-end',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#0B2D3E',
        textTransform: 'uppercase',
    },
    contextTitleImage: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    contextSubtitleImage: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.95)',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    genericContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F1F5F9',
    },
    genericIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 20, // Squircle
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 2,
    },
    contextTitleGeneric: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0B2D3E',
        marginBottom: 8,
        textAlign: 'center',
    },
    contextSubtitleGeneric: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 18,
    },
    // Parameters Page
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0B2D3E',
        marginBottom: 8,
    },
    pickerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    pickerText: {
        fontSize: 15,
        color: '#0B2D3E',
        fontWeight: '500',
    },
    dropdownList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 8,
        paddingVertical: 4,
        marginBottom: 16,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dropdownItemActive: {
        backgroundColor: '#F1F5F9',
        borderLeftWidth: 3,
        borderLeftColor: '#0B2D3E',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    dropdownItemTextActive: {
        color: '#0B2D3E',
        fontWeight: '700',
    },
    footerActions: {
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#0B2D3E',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
        shadowColor: '#0B2D3E',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    // Loading Step
    loaderCircle: {
        marginBottom: 24,
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
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0BA0B2',
        borderRadius: 3,
    },
    // Preview Step
    previewHeaderContainer: {
        marginBottom: 24,
        marginTop: 10,
        gap: 16,
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
