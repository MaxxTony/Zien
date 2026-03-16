import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    LayoutChangeEvent,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const SCREEN_WIDTH = Dimensions.get('window').width;

const BANNER_SLIDES = [
    {
        id: 1,
        badge: 'NEXT-GEN VISUAL AI',
        title: 'Virtual',
        titleAccent: 'Staging',
        titleSuffix: 'Elite',
        desc: 'High-end synthetic interior design powered by next-gen neural rendering.',
        features: ['8K Rendering', 'Depth Awareness', 'Global Lighting'],
        imageLeft: 'https://images.unsplash.com/photo-1600585152220-90363fe44548?w=800',
        imageRight: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    },
    {
        id: 2,
        badge: 'NEXT-GEN VISUAL AI',
        title: 'Landscape',
        titleAccent: 'Mastery',
        titleSuffix: 'Outdoor',
        desc: 'Reimagine gardens and exteriors with hyper-realistic vegetation and lighting.',
        features: ['Flora Synthesis', 'Day/Night Cycle', 'Ground Mapping'],
        imageLeft: 'https://images.unsplash.com/photo-1576016770956-debb63d92058?w=800',
        imageRight: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=800',
    },
    {
        id: 3,
        badge: 'NEXT-GEN VISUAL AI',
        title: 'Commercial',
        titleAccent: 'Redesign',
        titleSuffix: 'Office',
        desc: 'Convert empty shells into modern, productive workspace environments.',
        features: ['Furniture Fitting', 'Texture Realism', 'Brand Styling'],
        imageLeft: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        imageRight: 'https://images.unsplash.com/photo-1497366783946-12e688000ea3?w=800',
    }
];

const KIT_ITEMS = [
    { id: 1, title: 'Change Style', icon: 'palette-outline', desc: 'Professional AI-driven change style for hyper-realistic results.', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400' },
    { id: 2, title: 'Swap Sofa', icon: 'content-cut', desc: 'Professional AI-driven swap sofa for hyper-realistic results.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { id: 3, title: 'Find Items', icon: 'magnify-scan', desc: 'Professional AI-driven find items for hyper-realistic results.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
    { id: 4, title: 'Fill Room', icon: 'home-plus-outline', desc: 'Professional AI-driven fill room for hyper-realistic results.', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400' }
];

const CATEGORIES = ['Living Room', 'Primary Bedroom', 'Guest Bedroom', 'Luxury Kitchen', 'Formal Dining', 'Executive Office', 'Modern Bathroom', 'Outdoor Terrace'];

const STYLES = [
    { id: 1, name: 'Scandi-Modern', image: 'https://images.unsplash.com/photo-1615876234567-ca1af98f79f8?w=200' },
    { id: 2, name: 'Industrial Loft', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=200' },
    { id: 3, name: 'Classic Luxury', image: 'https://images.unsplash.com/photo-1600210492493-09472156d2ee?w=200' },
    { id: 4, name: 'Coastal Zen', image: 'https://images.unsplash.com/photo-1544207617-07399fc73909?w=200' },
    { id: 5, name: 'Mid-Century', image: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=200' }
];

// Custom Before/After image slider
function BeforeAfterSlider({ beforeUri, afterUri, height }: { beforeUri: string; afterUri: string; height: number }) {
    const position = useSharedValue(0.5);
    const startPosition = useSharedValue(0.5);
    const trackWidthRef = useRef(SCREEN_WIDTH - 40);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) trackWidthRef.current = w;
    }, []);

    const panGesture = Gesture.Pan()
        .onStart(() => { startPosition.value = position.value; })
        .onUpdate((e) => {
            const w = trackWidthRef.current;
            if (w <= 0) return;
            position.value = Math.max(0, Math.min(1, startPosition.value + (e.translationX / w)));
        })
        .onEnd(() => { position.value = withSpring(position.value, { damping: 22, stiffness: 220 }); });

    const clipStyle = useAnimatedStyle(() => ({ width: `${position.value * 100}%` }));
    const thumbStyle = useAnimatedStyle(() => ({ left: `${position.value * 100}%`, marginLeft: -14 }));

    return (
        <View style={[styles.compareContainer, { height }]} onLayout={onLayout}>
            <Image source={{ uri: beforeUri }} style={styles.compareFullImage} />
            <Animated.View style={[styles.compareClip, clipStyle]}>
                <Image source={{ uri: afterUri }} style={styles.compareFullImage} />
            </Animated.View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.compareThumb, thumbStyle]}>
                    <MaterialCommunityIcons name="drag-horizontal" size={20} color="#0B2D3E" />
                </Animated.View>
            </GestureDetector>
            <View style={styles.rawLabel}><Text style={styles.rawLabelText}>BEFORE</Text></View>
            <View style={styles.stagedLabel}><Text style={styles.stagedLabelText}>AFTER</Text></View>
        </View>
    );
}

export default function VirtualStagingScreen() {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [viewMode, setViewMode] = useState<'dashboard' | 'config' | 'loading' | 'studio'>('dashboard');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState<'Low'|'Medium'|'High'>('Medium');
    const [selectedStyleId, setSelectedStyleId] = useState(1);
    
    const scrollRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) setSelectedImage(result.assets[0].uri);
    };

    const handleGenerate = () => {
        setViewMode('loading');
        setTimeout(() => setViewMode('studio'), 3000); // simulate 3 sec load
    };

    if (viewMode === 'loading') {
        return (
            <LinearGradient colors={colors.backgroundGradient as any} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0BA0B2" />
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Architecting Your Vision</Text>
                <Text style={[styles.sectionSubtitle, { textAlign: 'center' }]}>Generating {STYLES.find(s=>s.id===selectedStyleId)?.name} environment for {category}...</Text>
            </LinearGradient>
        );
    }

    if (viewMode === 'studio') {
        return (
            <LinearGradient colors={colors.backgroundGradient as any} style={[styles.container, { paddingTop: insets.top }]}>
                <Pressable onPress={() => setViewMode('config')} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={16} color={colors.textPrimary} />
                    <Text style={styles.backBtnText}>Back</Text>
                </Pressable>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text style={styles.sectionTitle}>AI Generation Studio</Text>
                    <Text style={[styles.sectionSubtitle, { marginBottom: 20 }]}>Refining customstyle with precision rendering.</Text>
                    
                    <View style={styles.studioCard}>
                        <BeforeAfterSlider 
                            beforeUri={selectedImage || 'https://images.unsplash.com/photo-1600585152220-90363fe44548?w=800'} 
                            afterUri={'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'} 
                            height={300} 
                        />
                    </View>
                    
                    <Pressable style={styles.tryThisBtn} onPress={() => setViewMode('dashboard')}>
                        <Text style={styles.tryThisBtnText}>Done / Dashboard</Text>
                    </Pressable>
                </ScrollView>
            </LinearGradient>
        );
    }

    if (viewMode === 'config') {
        return (
            <LinearGradient colors={colors.backgroundGradient as any} style={[styles.container, { paddingTop: insets.top }]}>
                <Pressable onPress={() => setViewMode('dashboard')} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={16} color={colors.textPrimary} />
                    <Text style={styles.backBtnText}>Back</Text>
                </Pressable>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text style={[styles.sectionTitle, { fontSize: 24, textAlign: 'center' }]}>Let's Build Your Vision</Text>
                    <Text style={[styles.sectionSubtitle, { textAlign: 'center', marginBottom: 24 }]}>Configure your customstyle preferences below.</Text>

                    <View style={styles.configCard}>
                        <Text style={styles.configLabel}>CHOOSE IMAGE</Text>
                        <Pressable style={styles.uploadBox} onPress={pickImage}>
                            {selectedImage ? (
                                <Image source={{ uri: selectedImage }} style={styles.uploadPreview} />
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <MaterialCommunityIcons name="upload" size={32} color="#0BA0B2" />
                                    <Text style={styles.uploadTextBold}>Upload picture</Text>
                                    <Text style={styles.uploadTextSmall}>Supports JPG, PNG up to 20MB</Text>
                                </View>
                            )}
                        </Pressable>

                        <Text style={styles.configLabel}>CATEGORY</Text>
                        <Pressable style={styles.dropdownBtn} onPress={() => setShowCategoryDropdown(true)}>
                            <Text style={styles.dropdownText}>{category}</Text>
                            <MaterialCommunityIcons name="chevron-down" size={18} color="#64748B" />
                        </Pressable>

                        <Text style={styles.configLabel}>ADD DESCRIPTION</Text>
                        <TextInput 
                            style={styles.textArea} 
                            placeholder="e.g. Add a large gray velvet sofa, a coffee table..." 
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={3}
                            value={description}
                            onChangeText={setDescription}
                        />

                        <Text style={styles.configLabel}>SELECT LEVEL</Text>
                        <View style={styles.pillRow}>
                            {['Low', 'Medium', 'High'].map((l) => (
                                <Pressable 
                                    key={l} 
                                    style={[styles.pill, level === l && styles.pillActive]} 
                                    onPress={() => setLevel(l as any)}
                                >
                                    <Text style={[styles.pillText, level === l && styles.pillTextActive]}>{l}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.configLabel}>SELECT STYLE</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleGrid}>
                            {STYLES.map((s) => (
                                <Pressable 
                                    key={s.id} 
                                    style={[styles.styleCard, selectedStyleId === s.id && styles.styleCardActive]} 
                                    onPress={() => setSelectedStyleId(s.id)}
                                >
                                    <Image source={{ uri: s.image }} style={styles.styleImage} />
                                    <Text style={styles.styleText}>{s.name}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Pressable style={styles.generateBtn} onPress={handleGenerate}>
                            <Text style={styles.generateBtnText}>Generate Vision</Text>
                        </Pressable>
                    </View>
                </ScrollView>

                {/* Category Modal dropdown */}
                <Modal visible={showCategoryDropdown} transparent animationType="fade">
                    <Pressable style={styles.modalOverlay} onPress={() => setShowCategoryDropdown(false)}>
                        <View style={styles.modalContent}>
                            {CATEGORIES.map((c) => (
                                <Pressable 
                                    key={c} 
                                    style={styles.modalItem} 
                                    onPress={() => { setCategory(c); setShowCategoryDropdown(false); }}
                                >
                                    <Text style={styles.modalItemText}>{c}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
            </LinearGradient>
        );
    }

    // Default: Dashboard View
    return (
        <View style={styles.container}>
            <LinearGradient colors={colors.backgroundGradient as any} style={[styles.background, { paddingTop: insets.top }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={16} color={colors.textPrimary} />
                    <Text style={styles.backBtnText}>Back</Text>
                </Pressable>
                <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
                    {/* Carousel */}
                    <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} style={styles.carouselContainer} snapToInterval={SCREEN_WIDTH - 40} decelerationRate="fast">
                        {BANNER_SLIDES.map((slide) => (
                            <View key={slide.id} style={styles.bannerCard}>
                                <LinearGradient colors={['#0B2046', '#1A365D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bannerGradient}>
                                    <View style={styles.bannerImageContainer}>
                                        <Image source={{ uri: slide.imageLeft }} style={styles.bannerHalfImage} />
                                        <Image source={{ uri: slide.imageRight }} style={styles.bannerHalfImage} />
                                    </View>
                                    <View style={styles.bannerContent}>
                                        <Text style={styles.bannerTitle}>{slide.title} <Text style={{ color: '#0BA0B2' }}>{slide.titleAccent}</Text></Text>
                                        <Text style={styles.bannerDesc}>{slide.desc}</Text>
                                        <Pressable style={styles.tryThisBtn} onPress={() => setViewMode('config')}><Text style={styles.tryThisBtnText}>Try This</Text></Pressable>
                                    </View>
                                </LinearGradient>
                            </View>
                        ))}
                    </ScrollView>

                    {/* AI Design Kit */}
                    <Text style={styles.sectionTitle}>AI Design Kit</Text>
                    <View style={styles.kitGrid}>
                        {KIT_ITEMS.map((item) => (
                            <View key={item.id} style={styles.kitCard}>
                                <Image source={{ uri: item.image }} style={styles.kitImageWrapper} />
                                <View style={{ padding: 12 }}>
                                    <Text style={styles.kitBadgeText}>{item.title}</Text>
                                    <Pressable style={styles.kitBtn} onPress={() => setViewMode('config')}><Text style={styles.kitBtnText}>Try This</Text></Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 6 },
    backBtnText: { fontSize: 13, fontWeight: '800', color: '#FFF' },

    // Carousel
    carouselContainer: { marginBottom: 32 },
    bannerCard: { width: SCREEN_WIDTH - 40, borderRadius: 24, overflow: 'hidden' },
    bannerGradient: { padding: 16 },
    bannerImageContainer: { width: '100%', aspectRatio: 1.6, borderRadius: 16, overflow: 'hidden', flexDirection: 'row', marginBottom: 20 },
    bannerHalfImage: { width: '50%', height: '100%', resizeMode: 'cover' },
    bannerContent: { flex: 1 },
    bannerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginBottom: 8 },
    bannerDesc: { color: '#94A3B8', fontSize: 12, lineHeight: 18, marginBottom: 16 },
    tryThisBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0BA0B2', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, alignSelf: 'flex-start' },
    tryThisBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },

    // Section Kit
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 4 },
    sectionSubtitle: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },

    // Kit Grid
    kitGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
    kitCard: { width: (SCREEN_WIDTH - 52) / 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden' },
    kitImageWrapper: { width: '100%', aspectRatio: 1.3 },
    kitBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', marginBottom: 8 },
    kitBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    kitBtnText: { fontSize: 11, fontWeight: '800', color: '#FFF' },

    // Config form component styling
    configCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20 },
    configLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
    uploadBox: { width: '100%', aspectRatio: 1.5, borderRadius: 16, borderWidth: 1, borderColor: '#0BA0B2', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    uploadPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
    uploadPlaceholder: { alignItems: 'center' },
    uploadTextBold: { color: '#FFF', fontSize: 14, fontWeight: '900', marginTop: 8 },
    uploadTextSmall: { color: '#64748B', fontSize: 10, marginTop: 4 },
    dropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12 },
    dropdownText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
    textArea: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, color: '#FFF', textAlignVertical: 'top' },
    pillRow: { flexDirection: 'row', gap: 10 },
    pill: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
    pillActive: { backgroundColor: 'rgba(11, 160, 178, 0.1)', borderColor: '#0BA0B2' },
    pillText: { color: '#64748B', fontSize: 13, fontWeight: '800' },
    pillTextActive: { color: '#0BA0B2' },
    styleGrid: { flexDirection: 'row', marginTop: 8 },
    styleCard: { marginRight: 12, width: 100, alignItems: 'center' },
    styleCardActive: { borderColor: '#0BA0B2', borderWidth: 1, borderRadius: 12, padding: 4 },
    styleImage: { width: '100%', height: 70, borderRadius: 10, marginBottom: 6 },
    styleText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
    generateBtn: { backgroundColor: '#0BA0B2', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    generateBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' },

    // Dropdown Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: '#1E293B', borderRadius: 16, padding: 10 },
    modalItem: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    modalItemText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

    // Studio Component Comparisons
    studioCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
    compareContainer: { width: '100%', position: 'relative', overflow: 'hidden', borderRadius: 16 },
    compareFullImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
    compareClip: { position: 'absolute', left: 0, top: 0, bottom: 0, overflow: 'hidden' },
    compareThumb: { position: 'absolute', top: '50%', marginTop: -18, width: 28, height: 36, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0BA0B2' },
    rawLabel: { position: 'absolute', top: 12, left: 12, backgroundColor: '#0B2046', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    rawLabelText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
    stagedLabel: { position: 'absolute', top: 12, right: 12, backgroundColor: '#0BA0B2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    stagedLabelText: { color: '#FFF', fontSize: 9, fontWeight: '900' }
});
