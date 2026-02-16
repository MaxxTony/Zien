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
const CONTEXT_OPTIONS = [
    {
        id: 'generic',
        title: 'Generic Marketing',
        subtitle: 'Create content without a specific property link.',
        image: null,
        accuracy: null,
    },
    {
        id: 'prop-1',
        title: '123 Business Way',
        subtitle: 'Los Angeles, CA',
        image: 'https://images.unsplash.com/photo-1600596542815-6ad4c727dddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        accuracy: '98% AI ACCURACY',
    },
    {
        id: 'prop-2',
        title: '88 Gold Coast',
        subtitle: 'Malibu, CA',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        accuracy: '72% AI ACCURACY',
    },
    {
        id: 'prop-3',
        title: '900 Ocean Blvd',
        subtitle: 'Santa Monica, CA',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        accuracy: '45% AI ACCURACY',
    },
];

const GENERATED_TEXT = `Breathtaking Luxury estate located at 123 Business Way, Los Angeles, CA.

This residence offers an unparalleled lifestyle for Family who demand excellence in every square inch. Featuring rare architectural details and bespoke finishes, this medium-form showcase is designed to impress.

From the moment you step inside, the seamless flow between indoor and outdoor living spaces captivates the senses. The gourmet chef's kitchen, equipped with state-of-the-art appliances, opens to a spacious family room, perfect for entertaining.`;

type FlowStep = 'context' | 'parameters' | 'loading' | 'preview' | 'success';

// Dropdown Options
const FORMAT_OPTIONS = [
    'Listing Description',
    'Instagram Caption',
    'Email Newsletter',
    'Facebook Post',
    'LinkedIn Article',
    'Blog Post',
];

const TONE_OPTIONS = [
    'Luxury & Exclusive',
    'Professional & Corporate',
    'Friendly & Casual',
    'Urgent & Persuasive',
    'Witty & Humorous',
    'Minimalist & Clean',
];

export default function CreateContentScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [step, setStep] = useState<FlowStep>('context');
    const [selectedContext, setSelectedContext] = useState<string | null>(null);

    // Form State
    const [format, setFormat] = useState(FORMAT_OPTIONS[0]);
    const [tone, setTone] = useState(TONE_OPTIONS[0]);
    const [showFormatPicker, setShowFormatPicker] = useState(false);
    const [showTonePicker, setShowTonePicker] = useState(false);

    // Preview State
    const [generatedContent, setGeneratedContent] = useState(GENERATED_TEXT);
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

    const handleContextSelect = (id: string) => {
        setSelectedContext(id);
        setStep('parameters');
    };

    const handleStartGeneration = () => {
        setStep('loading');
    };

    const handleRegenerate = () => {
        setIsRegenerating(true);
        // Simulate API call
        setTimeout(() => {
            const newText = `Refined Version:\n\n` + GENERATED_TEXT.split('\n').reverse().join('\n');
            setGeneratedContent(newText);
            setIsRegenerating(false);
        }, 1500);
    };

    const handleSave = () => {
        setStep('success');
    };

    const handleDone = () => {
        router.back();
    };

    const renderHeader = (title: string, subtitle?: string) => (
        <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => step === 'context' ? router.back() : setStep('context')}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
            </Pressable>
            <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    );

    // --- STEP 1: SELECT CONTEXT ---
    const renderContextSelection = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {renderHeader('Select Context', 'Associating a property ensures high-accuracy, hyper-local AI generation.')}

            <View style={styles.grid}>
                {CONTEXT_OPTIONS.map((ctx) => (
                    <Pressable
                        key={ctx.id}
                        style={[styles.contextCard, selectedContext === ctx.id && styles.contextCardActive]}
                        onPress={() => handleContextSelect(ctx.id)}
                    >
                        {ctx.image ? (
                            <>
                                <Image source={{ uri: ctx.image }} style={styles.contextImage} resizeMode="cover" />
                                <View style={styles.contextOverlay} />
                                <View style={styles.contextContent}>
                                    {ctx.accuracy && (
                                        <View style={styles.accuracyBadge}>
                                            <Text style={styles.accuracyText}>{ctx.accuracy}</Text>
                                        </View>
                                    )}
                                    <View style={{ marginTop: 'auto' }}>
                                        <Text style={styles.contextTitleImage}>{ctx.title}</Text>
                                        <Text style={styles.contextSubtitleImage}>{ctx.subtitle}</Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <View style={styles.genericContent}>
                                <View style={styles.genericIconCircle}>
                                    <MaterialCommunityIcons name="cube-outline" size={32} color="#0B2D3E" />
                                </View>
                                <Text style={styles.contextTitleGeneric}>{ctx.title}</Text>
                                <Text style={styles.contextSubtitleGeneric}>{ctx.subtitle}</Text>
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
            {renderHeader('Generation Parameters', "Fine-tune the AI's creative direction for your content.")}

            <View style={styles.card}>
                {/* Format Picker */}
                <View style={[styles.inputGroup, { zIndex: 20 }]}>
                    <Text style={styles.inputLabel}>Primary Format</Text>
                    <Pressable
                        style={styles.pickerView}
                        onPress={() => {
                            setShowFormatPicker(!showFormatPicker);
                            setShowTonePicker(false);
                        }}
                    >
                        <Text style={styles.pickerText}>{format}</Text>
                        <MaterialCommunityIcons
                            name={showFormatPicker ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#64748B"
                        />
                    </Pressable>
                    {showFormatPicker && (
                        <View style={styles.dropdownList}>
                            {FORMAT_OPTIONS.map((option) => (
                                <Pressable
                                    key={option}
                                    style={[styles.dropdownItem, format === option && styles.dropdownItemActive]}
                                    onPress={() => {
                                        setFormat(option);
                                        setShowFormatPicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        format === option && styles.dropdownItemTextActive
                                    ]}>
                                        {option}
                                    </Text>
                                    {format === option && (
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
                            setShowFormatPicker(false);
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
                <Pressable style={styles.secondaryButton} onPress={() => setStep('context')}>
                    <Text style={styles.secondaryButtonText}>Back to Selection</Text>
                </Pressable>
                <Pressable style={styles.primaryButton} onPress={handleStartGeneration}>
                    <Text style={styles.primaryButtonText}>Start AI Generation</Text>
                    <MaterialCommunityIcons name="auto-fix" size={20} color="#FFFFFF" />
                </Pressable>
            </View>
        </ScrollView>
    );

    // --- STEP 3: LOADING ---
    const renderLoading = () => (
        <View style={styles.centerContainer}>
            <View style={styles.loaderCircle}>
                <MaterialCommunityIcons name="loading" size={48} color="#0BA0B2" style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
            <Text style={styles.loadingTitle}>AI Engine Active...</Text>
            <Text style={styles.loadingSubtitle}>
                Processing property data and applying branding guidelines for your Luxury content.
            </Text>

            <View style={styles.progressBarBg}>
                <Animated.View
                    style={[
                        styles.progressBarFill,
                        {
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                        }
                    ]}
                />
            </View>
        </View>
    );

    // --- STEP 4: PREVIEW ---
    const renderPreview = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {renderHeader('Review Draft', 'Edit or regenerate your content before saving.')}

            <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                    <View style={styles.previewBadge}>
                        <Text style={styles.previewBadgeText}>AI DRAFT PREVIEW</Text>
                    </View>
                    <Pressable
                        style={styles.regenerateBtn}
                        onPress={handleRegenerate}
                        disabled={isRegenerating}
                    >
                        {isRegenerating ? (
                            <ActivityIndicator size="small" color="#64748B" />
                        ) : (
                            <>
                                <Text style={styles.regenerateText}>Regenerate</Text>
                                <MaterialCommunityIcons name="refresh" size={16} color="#64748B" />
                            </>
                        )}
                    </Pressable>
                </View>
                <TextInput
                    style={styles.previewInput}
                    multiline
                    value={generatedContent}
                    onChangeText={setGeneratedContent}
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.actionCard}>
                <Text style={styles.actionCardTitle}>Final Actions</Text>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save to Library</Text>
                    <MaterialCommunityIcons name="content-save-outline" size={20} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.actionNote}>Draft will be linked to: 123 Business Way, Los Angeles, CA</Text>
            </View>
        </ScrollView>
    );

    // --- STEP 5: SUCCESS ---
    const renderSuccess = () => (
        <View style={styles.centerContainer}>
            <View style={styles.successCircle}>
                <MaterialCommunityIcons name="check" size={48} color="#0BA0B2" />
            </View>
            <Text style={styles.successTitle}>Content Ready!</Text>
            <Text style={styles.successSubtitle}>
                Your new marketing asset has been successfully generated and stored.
            </Text>
            <Pressable style={styles.returnButton} onPress={handleDone}>
                <Text style={styles.returnButtonText}>Return to AI Content Hub</Text>
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
                {step === 'context' && renderContextSelection()}
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
    },
    contextCard: {
        width: '100%',
        height: 180,
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
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    contextContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    accuracyBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    accuracyText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#0284C7',
    },
    contextTitleImage: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    contextSubtitleImage: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    genericContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F1F5F9', // Fallback if no image
    },
    genericIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
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
        fontSize: 18,
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
    previewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 24,
        minHeight: 300,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    previewBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    previewBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#0B2D3E',
        letterSpacing: 0.5,
    },
    regenerateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    regenerateText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B',
    },
    previewText: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },
    previewInput: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        minHeight: 200,
    },
    actionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 3,
    },
    actionCardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0B2D3E',
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: '#0B2D3E',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
        marginBottom: 12,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    actionNote: {
        fontSize: 11,
        color: '#94A3B8',
        textAlign: 'center',
    },
    // Success Step
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0F2FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 12,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    returnButton: {
        backgroundColor: '#0B2D3E',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#0B2D3E',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 4,
    },
    returnButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
