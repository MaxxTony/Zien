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

// Mock Data for Email Templates
interface TemplateOption {
    id: 'just-listed' | 'follow-up' | 'newsletter';
    title: string;
    description: string;
    icon: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
    {
        id: 'just-listed',
        title: 'Just Listed',
        description: "Announce new inventory to your lead list.",
        icon: 'bell-outline',
    },
    {
        id: 'follow-up',
        title: 'Follow-up',
        description: "Re-engage prospects after a showing.",
        icon: 'send-outline', // Paper plane look
    },
    {
        id: 'newsletter',
        title: 'Newsletter',
        description: "Monthly market updates and community news.",
        icon: 'star-outline',
    },
];

const GENERATED_TEMPLATES = {
    'just-listed': `Subject: Exclusive First Look: Stunning New Listing in Brentwood

Hi [Client Name],

I hope you're having a great week! I wanted to personally reach out and share a brand new listing that just hit the market. This property perfectly matches the criteria we've discussed.

Located in the heart of Brentwood, this home features:
• 5 Bedrooms / 4.5 Bathrooms
• Expansive outdoor living area
• Gourmet chef's kitchen

Would you like to schedule a private tour this weekend? This one won't last long!

Best,
[Your Name]`,
    'follow-up': `Subject: Thoughts on [Property Address]?

Hi [Client Name],

Thank you for touring [Property Address] with me yesterday. I really enjoyed walking you through the property and hearing your initial thoughts.

I wanted to follow up and see if you had any further questions after sleeping on it. I also found a few more details about the HOA amenities that I think you'll appreciate.

Let me know if you'd like to take another look or if you're ready to discuss next steps.

Best regards,
[Your Name]`,
    'newsletter': `Subject: [Month] Market Update: Is it a good time to buy?

Hi [Client Name],

The real estate market in [City] is constantly shifting, and I wanted to keep you informed on what we're seeing on the ground this month.

📈 Market Highlights:
• Average sales price is up [X]%
• Inventory remains tight, favoring sellers
• Interest rates have stabilized around [X]%

What this means for you:
If you're thinking of selling, demand is still high for turnkey properties. For buyers, preparation is key to winning in multiple-offer situations.

Check out my latest blog post for a deeper dive, or reply to this email if you'd like a custom valuation of your home.

Warmly,
[Your Name]`
};

type FlowStep = 'selection' | 'loading' | 'preview' | 'success';

export default function EmailTemplatesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [step, setStep] = useState<FlowStep>('selection');
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption['id'] | null>(null);

    // Preview State
    const [generatedContent, setGeneratedContent] = useState('');
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        if (step === 'loading') {
            // Simulate generation time
            const timer = setTimeout(() => {
                if (selectedTemplate) {
                    setGeneratedContent(GENERATED_TEMPLATES[selectedTemplate]);
                }
                setStep('preview');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step, selectedTemplate]);

    const handleTemplateSelect = (id: TemplateOption['id']) => {
        setSelectedTemplate(id);
        setStep('loading');
    };

    const handleNewDraft = () => {
        setIsRegenerating(true);
        // Simulate API call
        setTimeout(() => {
            if (selectedTemplate) {
                // Add a slight variation
                const newText = `Subject: [Revised] ` + GENERATED_TEMPLATES[selectedTemplate].substring(9);
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

    const getTemplateDetails = () => {
        return TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate) || TEMPLATE_OPTIONS[0];
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
            {renderHeader('Email Templates', 'High-converting email copy for every stage of the client journey.')}

            <View style={styles.grid}>
                {TEMPLATE_OPTIONS.map((template) => (
                    <Pressable
                        key={template.id}
                        style={styles.card}
                        onPress={() => handleTemplateSelect(template.id)}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name={template.icon as any} size={28} color="#0B2D3E" />
                        </View>
                        <Text style={styles.cardTitle}>{template.title}</Text>
                        <Text style={styles.cardDesc}>{template.description}</Text>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );

    // --- STEP 2: LOADING ---
    const renderLoading = () => (
        <View style={styles.centerContainer}>
            <View style={styles.loaderSpinner}>
                <ActivityIndicator size="large" color="#0B2D3E" />
            </View>
            <Text style={styles.loadingTitle}>Writing Template...</Text>
            <Text style={styles.loadingSubtitle}>
                AI is personalizing the draft with high-conversion hooks.
            </Text>
        </View>
    );

    // --- STEP 3: PREVIEW ---
    const renderPreview = () => {
        const template = getTemplateDetails();
        return (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Custom Header for Preview with Actions */}
                <View style={styles.previewHeaderContainer}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable style={styles.backButton} onPress={() => setStep('selection')}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
                        </Pressable>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>{template.title} Template</Text>
                            <Text style={styles.headerSubtitle}>Customize your email draft before saving it to your CMR.</Text>
                        </View>
                    </View>

                    <View style={styles.headerActions}>
                        <Pressable
                            style={styles.regenerateBtn}
                            onPress={handleNewDraft}
                            disabled={isRegenerating}
                        >
                            {isRegenerating ? (
                                <ActivityIndicator size="small" color="#0B2D3E" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="refresh" size={16} color="#0B2D3E" />
                                    <Text style={styles.regenerateText}>New Draft</Text>
                                </>
                            )}
                        </Pressable>
                        <Pressable style={styles.headerSaveBtn} onPress={handleSave}>
                            <MaterialCommunityIcons name="content-save-outline" size={18} color="#FFFFFF" />
                            <Text style={styles.headerSaveBtnText}>Save Template</Text>
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
    };

    // --- STEP 4: SUCCESS ---
    const renderSuccess = () => (
        <View style={styles.centerContainer}>
            <View style={[styles.successCircle, { backgroundColor: '#0B2D3E' }]}>
                <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Template Saved!</Text>
            <Text style={styles.successSubtitle}>
                Your email template has been added to your library.
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 30, // More padding as per screenshot
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
        minHeight: 200,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0B2D3E',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
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
        fontSize: 15, // Monospace often looks larger, 15 is good
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
        width: 'auto', // Button shouldn't be too wide if not needed, but consistency... 
        // Previous screens used custom logic? Let's stick to consistent styles. 
        // In property-description it was width: '100%', in social-media width was '100%'.
        // In screenshot it looks like a contained button. I'll make it consistent:
        minWidth: 200,
        alignItems: 'center',
    },
    returnButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
