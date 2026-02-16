import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock Data
interface StyleOption {
    id: 'modern' | 'luxury' | 'bold';
    title: string;
    description: string;
    icon: string;
}

const STYLE_OPTIONS: StyleOption[] = [
    {
        id: 'modern',
        title: 'Modern Minimal',
        description: "Clean, spacious design with focus on high-res photography.",
        icon: 'view-dashboard-outline',
    },
    {
        id: 'luxury',
        title: 'Luxury Executive',
        description: "Sophisticated dark modes with gold and navy accents.",
        icon: 'presentation',
    },
    {
        id: 'bold',
        title: 'Bold Investment',
        description: "Data-driven layout optimized for market trends and charts.",
        icon: 'file-document-outline',
    },
];

const SLIDES_DATA = [
    { id: 1, title: 'Cover Overview', header: 'Cover Overview', content: 'Malibu Villa', subtitle: 'EXCLUSIVE PRESENTATION', type: 'cover' },
    { id: 2, title: 'Property Profiles', header: 'Property Profile', content: 'The Architecture', subtitle: 'Detailed specifications of the estate.', type: 'split' },
    { id: 3, title: 'Market Analytics', header: 'Market Analytics', content: 'Growth Trends (+12%)', subtitle: 'Q1 Market Performance Analysis', type: 'chart' },
    { id: 4, title: 'Comparative Sales', header: 'Recent Comps', content: 'Comparative Sales', subtitle: '3 nearby properties sold above asking.', type: 'list' },
    { id: 5, title: 'Closing Remarks', header: 'Next Steps', content: 'Closing Remarks', subtitle: 'Schedule a private viewing today.', type: 'text' },
];

type FlowStep = 'selection' | 'loading' | 'preview' | 'success';

export default function PresentationBuilderScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [step, setStep] = useState<FlowStep>('selection');
    const [selectedStyle, setSelectedStyle] = useState<StyleOption['id'] | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Default to the third slide (Market Analytics) for demo purposes if desired, 
    // but starting at 0 is standard. The screenshot showed slide 3. 
    // Let's start at 0.

    // Loading Simulation
    useEffect(() => {
        if (step === 'loading') {
            const timer = setTimeout(() => {
                setStep('preview');
                // Optional: Jump to slide 2 (index 2) to match screenshot for "wow" factor if specifically requested, 
                // but usually user expects start. I'll stick to 0 unless instructed.
                // Actually, let's auto-advance to slide 2 (Market Analytics) just to match the screenshot 'vibe' initially? 
                // No, standard behavior is better.
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleStyleSelect = (id: StyleOption['id']) => {
        setSelectedStyle(id);
        setStep('loading');
    };

    const handleNextSlide = () => {
        if (currentSlideIndex < SLIDES_DATA.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    const handleReShuffle = () => {
        setCurrentSlideIndex(0);
    };

    const handleExport = () => {
        setStep('success');
    };

    const handleDone = () => {
        router.back();
    };

    const getStyleDetails = () => STYLE_OPTIONS.find(s => s.id === selectedStyle) || STYLE_OPTIONS[0];

    // Helper to render slide content based on type (simulated visual difference)
    const renderSlideVisual = (slide: typeof SLIDES_DATA[0]) => {
        const styleId = selectedStyle || 'modern';

        // Visual Tokens matching the screenshot style (Luxury Executive especially)
        // Screenshot shows a Dark Navy background for the card? Or is it black? Looks like Dark Navy #0F172A or similar.
        // Accent color seems to be Gold #C0A062.

        const isLuxury = styleId === 'luxury';
        const bg = isLuxury ? '#0F172A' : '#FFFFFF';
        const txt = isLuxury ? '#FFFFFF' : '#0B2D3E';
        const subTxt = isLuxury ? '#94A3B8' : '#64748B';
        const accent = isLuxury ? '#C0A062' : '#0BA0B2';

        return (
            <View style={[styles.slideCanvas, { backgroundColor: bg }]}>
                {/* Inner Content Padding */}
                <View style={{ flex: 1, padding: 24 }}>
                    {/* Header */}
                    <Text style={[styles.slideHeaderTitle, { color: txt }]}>
                        {slide.header}
                    </Text>

                    {/* Middle Graphic / Content */}
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        {slide.type === 'chart' ? (
                            <>
                                <MaterialCommunityIcons name="poll" size={80} color={accent} />
                                <Text style={[styles.slideMainContent, { color: txt, marginTop: 20 }]}>
                                    {slide.content}
                                </Text>
                            </>
                        ) : slide.type === 'cover' ? (
                            <>
                                <View style={{ width: 60, height: 2, backgroundColor: accent, marginBottom: 20 }} />
                                <Text style={[styles.slideMainContent, { color: txt, textAlign: 'center', fontSize: 32 }]}>
                                    {slide.content}
                                </Text>
                                <Text style={[styles.slideSubtitle, { color: accent, marginTop: 10 }]}>
                                    {slide.subtitle}
                                </Text>
                            </>
                        ) : (
                            // Generic layout for others
                            <>
                                <MaterialCommunityIcons name={
                                    slide.type === 'split' ? 'image-outline' :
                                        slide.type === 'list' ? 'format-list-bulleted' : 'text-box-outline'
                                } size={64} color={isLuxury ? '#334155' : '#E2E8F0'} />
                                <Text style={[styles.slideMainContent, { color: txt, marginTop: 20, textAlign: 'center' }]}>
                                    {slide.content}
                                </Text>
                                <Text style={[styles.slideSubtitle, { color: subTxt, marginTop: 10, textAlign: 'center' }]}>
                                    {slide.subtitle}
                                </Text>
                            </>
                        )}
                    </View>

                    {/* Footer / Page Number */}
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: isLuxury ? '#475569' : '#CBD5E1' }}>
                            PAGE {slide.id}/{SLIDES_DATA.length}
                        </Text>
                    </View>
                </View>
            </View>
        );
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
            {renderHeader('Presentation Builder', 'Select a visual aesthetic for your dynamic listing presentation.')}

            <View style={styles.grid}>
                {STYLE_OPTIONS.map((item) => (
                    <Pressable
                        key={item.id}
                        style={styles.card}
                        onPress={() => handleStyleSelect(item.id)}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name={item.icon as any} size={28} color="#0B2D3E" />
                        </View>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDesc}>{item.description}</Text>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );

    // --- STEP 2: LOADING ---
    const renderLoading = () => {
        const style = getStyleDetails();
        return (
            <View style={styles.centerContainer}>
                <View style={[styles.loaderSpinner, { marginBottom: 30 }]}>
                    <ActivityIndicator size="large" color="#0B2D3E" />
                </View>
                <Text style={styles.loadingTitle}>Building {style.title} Deck...</Text>
                <Text style={styles.loadingSubtitle}>
                    AI is populating slides with market data, property features, and brand voice.
                </Text>
            </View>
        );
    };

    // --- STEP 3: PREVIEW (MOBILE PRO LEVEL DESIGN) ---
    const renderPreview = () => {
        const style = getStyleDetails();
        const currentSlide = SLIDES_DATA[currentSlideIndex];

        return (
            <ScrollView contentContainerStyle={styles.scrollContentPreview} showsVerticalScrollIndicator={false}>
                {/* 1. Header Area with Back Button */}
                <View style={styles.proHeader}>
                    <Pressable style={styles.backButton} onPress={() => setStep('selection')}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
                    </Pressable>
                    <View style={styles.proHeaderTexts}>
                        <Text style={styles.proHeaderTitle}>{style.title}</Text>
                        <Text style={styles.proHeaderTitle}>Presentation</Text>
                        <Text style={styles.proHeaderSubtitle}>Visualize and refine your personalized CMA presentation.</Text>
                    </View>
                </View>

                {/* 2. Action Buttons Row */}
                <View style={styles.actionButtonsRow}>
                    <Pressable style={styles.shuffleBtn} onPress={handleReShuffle}>
                        <MaterialCommunityIcons name="shuffle-variant" size={16} color="#0B2D3E" />
                        <Text style={styles.shuffleBtnText}>Re-shuffle</Text>
                    </Pressable>
                    <Pressable style={styles.exportBtn} onPress={handleExport}>
                        <MaterialCommunityIcons name="file-pdf-box" size={18} color="#FFFFFF" />
                        <Text style={styles.exportBtnText}>Export as PDF</Text>
                    </Pressable>
                </View>

                {/* 3. Slide Status Bar */}
                <View style={styles.slideStatusRow}>
                    <Text style={styles.slideStatusTitle}>{currentSlide.title.toUpperCase()}</Text>
                    <Text style={styles.slideStatusCount}>Slide {currentSlideIndex + 1} of {SLIDES_DATA.length}</Text>
                </View>

                {/* 4. Main Slide Card */}
                <View style={styles.slideCardContainer}>
                    {renderSlideVisual(currentSlide)}
                </View>

                {/* 5. Navigation Controls (Arrows + Dots) */}
                <View style={styles.navControlsContainer}>
                    <Pressable
                        style={styles.circleNavBtn}
                        onPress={handlePrevSlide}
                        disabled={currentSlideIndex === 0}
                    >
                        <MaterialCommunityIcons
                            name="chevron-left"
                            size={28}
                            color={currentSlideIndex === 0 ? "#E2E8F0" : "#0B2D3E"}
                        />
                    </Pressable>

                    <View style={styles.paginationDots}>
                        {SLIDES_DATA.map((_, idx) => (
                            <View
                                key={idx}
                                style={[
                                    styles.dot,
                                    idx === currentSlideIndex ? styles.dotActive : styles.dotInactive
                                ]}
                            />
                        ))}
                    </View>

                    <Pressable
                        style={styles.circleNavBtn}
                        onPress={handleNextSlide}
                        disabled={currentSlideIndex === SLIDES_DATA.length - 1}
                    >
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={28}
                            color={currentSlideIndex === SLIDES_DATA.length - 1 ? "#E2E8F0" : "#0B2D3E"}
                        />
                    </Pressable>
                </View>

            </ScrollView>
        );
    };

    // --- STEP 4: SUCCESS ---
    const renderSuccess = () => {
        const style = getStyleDetails();
        return (
            <View style={styles.centerContainer}>
                <View style={[styles.successCircle, { backgroundColor: '#0B2D3E' }]}>
                    <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>Deck Exported!</Text>
                <Text style={styles.successSubtitle}>
                    Your {style.title} presentation has been generated and is ready for download.
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
    scrollContentPreview: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
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
    // SELECTION STEP
    grid: {
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
        minHeight: 180,
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
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    // LOADING STEP
    loaderSpinner: {
        // just container styles
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
    // PREVIEW STEP (PRO REDESIGN)
    proHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    proHeaderTexts: {
        flex: 1,
        paddingRight: 10,
    },
    proHeaderTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#0B2D3E',
        lineHeight: 32,
    },
    proHeaderSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 6,
        lineHeight: 20,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },
    shuffleBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    shuffleBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    exportBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B2D3E',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
    },
    exportBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    slideStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    slideStatusTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
    },
    slideStatusCount: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
    },
    slideCardContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 30,
    },
    slideCanvas: {
        flex: 1,
    },
    slideHeaderTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    slideMainContent: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
    },
    slideSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    navControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    circleNavBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    paginationDots: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        backgroundColor: '#0B2D3E',
        width: 20,
    },
    dotInactive: {
        backgroundColor: '#CBD5E1',
        width: 8,
    },
    // SUCCESS STEP
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
