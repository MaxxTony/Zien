import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock Generated Content
const GENERATED_GUIDE_TEMPLATE = (location: string) => `NEIGHBORHOOD GUIDE: ${location.toUpperCase()}

OVERVIEW:
${location} is known for its sophisticated atmosphere and upscale lifestyle. Residents enjoy a perfect blend of suburban tranquility and urban accessibility.

KEY HIGHLIGHTS:
• Premier local dining and boutique shopping
• Award-winning school districts
• Beautifully maintained parks and recreational areas
• Strong community spirit and high safety ratings

MARKET TRENDS:
The real estate market in ${location} continues to show strong appreciation. Demand for turnkey properties remains high, with inventory levels creating a competitive environment for buyers.

LIFESTYLE:
From morning coffee at local cafes to weekend farmers markets, ${location} offers a vibrant yet relaxed pace of life perfect for families and professionals alike.`;

type FlowStep = 'input' | 'loading' | 'preview' | 'success';

export default function NeighborhoodGuideScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [step, setStep] = useState<FlowStep>('input');
    const [location, setLocation] = useState('');

    // Preview State
    const [generatedContent, setGeneratedContent] = useState('');
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        if (step === 'loading') {
            // Simulate generation time
            const timer = setTimeout(() => {
                setGeneratedContent(GENERATED_GUIDE_TEMPLATE(location || 'Target Neighborhood'));
                setStep('preview');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step, location]);

    const handleGenerate = () => {
        if (location.trim()) {
            setStep('loading');
        }
    };

    const handleRegenerate = () => {
        setIsRegenerating(true);
        // Simulate API call
        setTimeout(() => {
            // Add a slight variation
            const newText = `[UPDATED INSIGHTS]\n\n` + GENERATED_GUIDE_TEMPLATE(location || 'Target Neighborhood');
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
            <Pressable style={styles.backButton} onPress={() => step === 'input' ? router.back() : setStep('input')}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
            </Pressable>
            <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    );

    // --- STEP 1: INPUT ---
    const renderInput = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {renderHeader('Neighborhood Guide', 'Generate hyper-local market insights and community guides.')}

            <View style={styles.card}>
                <Text style={styles.inputLabel}>Target Neighborhood or City</Text>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="magnify" size={24} color="#94A3B8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="e.g. Brentwood, LA"
                        placeholderTextColor="#94A3B8"
                        value={location}
                        onChangeText={setLocation}
                    />
                </View>

                <Pressable
                    style={[styles.primaryButton, !location.trim() && styles.primaryButtonDisabled]}
                    onPress={handleGenerate}
                    disabled={!location.trim()}
                >
                    <Text style={styles.primaryButtonText}>Generate Local Guide</Text>
                    <MaterialCommunityIcons name="creation" size={20} color="#FFFFFF" />
                </Pressable>
            </View>
        </ScrollView>
    );

    // --- STEP 2: LOADING ---
    const renderLoading = () => (
        <View style={styles.centerContainer}>
            <View style={styles.loaderSpinner}>
                <ActivityIndicator size="large" color="#0B2D3E" />
            </View>
            <Text style={styles.loadingTitle}>Researching {location}...</Text>
            <Text style={styles.loadingSubtitle}>
                AI is analyzing school data, market stats, and local highlights.
            </Text>
        </View>
    );

    // --- STEP 3: PREVIEW ---
    const renderPreview = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Custom Header for Preview with Actions */}
            <View style={styles.previewHeaderContainer}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Pressable style={styles.backButton} onPress={() => setStep('input')}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>{location} Guide</Text>
                        <Text style={styles.headerSubtitle}>Review your generated guide and add your personal touch.</Text>
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
                        <Text style={styles.headerSaveBtnText}>Save Guide</Text>
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

    // --- STEP 4: SUCCESS ---
    const renderSuccess = () => (
        <View style={styles.centerContainer}>
            <View style={[styles.successCircle, { backgroundColor: '#0B2D3E' }]}>
                <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Guide Saved!</Text>
            <Text style={styles.successSubtitle}>
                Your hyper-local neighborhood guide is ready to share.
            </Text>
            <Pressable style={styles.returnButton} onPress={handleDone}>
                <Text style={styles.returnButtonText}>Back to Hub</Text>
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
                {/* Wrap in Keyboard Avoiding View for the input step */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1 }}>
                            {step === 'input' && renderInput()}
                            {step === 'loading' && renderLoading()}
                            {step === 'preview' && renderPreview()}
                            {step === 'success' && renderSuccess()}
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
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
    // Input Step
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
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0B2D3E',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56, // Tall input
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#0B2D3E',
        height: '100%',
    },
    primaryButton: {
        backgroundColor: '#0B2D3E',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
        shadowColor: '#0B2D3E',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 4,
    },
    primaryButtonDisabled: {
        opacity: 0.6,
        shadowOpacity: 0.1,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    // Loading Step
    loaderSpinner: {
        marginBottom: 24,
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 12,
        textAlign: 'center',
    },
    loadingSubtitle: {
        fontSize: 15,
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
        fontSize: 15,
        color: '#0F172A',
        lineHeight: 24,
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
        minWidth: 200,
        alignItems: 'center',
    },
    returnButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
