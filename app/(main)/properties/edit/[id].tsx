import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ProgressStep, ProgressSteps } from 'react-native-progress-steps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');
const H = 18;

// ─── Brand colors ──────────────────────────────────────────────────────────
const TEAL = '#0D9488';
const NAVY = '#0f172a';
const SKY = '#0EA5E9';
const SLATE = '#64748B';
const LIGHT_BG = '#F1F5F9';
const CARD_BG = '#FFFFFF';

// ─── Mock Data ─────────────────────────────────────────────────────────────
const PROPERTY_DATA: Record<string, any> = {
    'ZN-94021-LA': {
        address: '123 Business Way',
        cityState: 'Los Angeles, CA',
        image1: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        image2: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    },
};

// ─── ProgressSteps shared style props ──────────────────────────────────────
const PS_PROPS = {
    activeStepIconBorderColor: TEAL,
    activeStepIconColor: TEAL,
    completedStepIconColor: TEAL,
    completedProgressBarColor: TEAL,
    progressBarColor: '#CBD5E1',
    disabledStepIconColor: '#CBD5E1',
    labelColor: SLATE,
    activeLabelColor: TEAL,
    completedLabelColor: TEAL,
    labelFontSize: 10,
    activeLabelFontSize: 10,
    activeStepNumColor: '#fff',
    completedCheckColor: '#fff',
    completedStepNumColor: '#fff',
    disabledStepNumColor: '#94A3B8',
    borderWidth: 2,
    topOffset: 15,
    marginBottom: 15,
};

// ─── Shared button style props for ProgressStep ────────────────────────────
const BTN_PROPS = {
    buttonFillColor: NAVY,
    buttonBorderColor: 'transparent',
    buttonNextTextColor: '#fff',
    buttonPreviousTextColor: SLATE,
};

// ─── Section chip toggle ────────────────────────────────────────────────────
function Chip({
    label,
    selected,
    onToggle,
}: {
    label: string;
    selected: boolean;
    onToggle: () => void;
}) {
    return (
        <TouchableOpacity
            style={[styles.chip, selected && styles.chipActive]}
            onPress={onToggle}
            activeOpacity={0.75}
        >
            {selected && (
                <MaterialCommunityIcons
                    name="check-circle"
                    size={13}
                    color={TEAL}
                    style={{ marginRight: 4 }}
                />
            )}
            <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

// ─── Select row ─────────────────────────────────────────────────────────────
function SelectRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.selectBox}>
                <Text style={styles.selectValue}>{value}</Text>
                <MaterialCommunityIcons name="chevron-down" size={18} color={SLATE} />
            </View>
        </View>
    );
}

// ─── Text input row ──────────────────────────────────────────────────────────
function InputRow({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#94A3B8"
            />
        </View>
    );
}

// ─── Info row for identify card ─────────────────────────────────────────────
function InfoRow({
    icon,
    label,
    children,
}: {
    icon: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
                <MaterialCommunityIcons name={icon as any} size={16} color={TEAL} />
            </View>
            <Text style={styles.infoLabel}>{label}</Text>
            <View style={styles.infoValueWrap}>{children}</View>
        </View>
    );
}

// ─── Section heading ─────────────────────────────────────────────────────────
function SectionHeading({ label }: { label: string }) {
    return (
        <View style={styles.sectionHeadRow}>
            <View style={styles.sectionHeadBar} />
            <Text style={styles.sectionHeadText}>{label}</Text>
        </View>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1 — Identify
// ═══════════════════════════════════════════════════════════════════════════
function Step1Identify({ propId, address }: { propId: string; address: string }) {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.stepScroll}
        >
            {/* Hero card */}
            <LinearGradient
                colors={['rgba(13,148,136,0.08)', 'rgba(14,165,233,0.05)']}
                style={styles.heroCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.heroIconRing}>
                    <MaterialCommunityIcons name="home-search-outline" size={26} color={TEAL} />
                </View>
                <Text style={styles.heroTitle}>Property Identification</Text>
                <Text style={styles.heroSub}>Confirm the identity of the property being edited.</Text>
            </LinearGradient>

            {/* Details card */}
            <View style={styles.card}>
                <InfoRow icon="map-marker-outline" label="Address">
                    <Text style={styles.infoValue}>
                        {address}, Los Angeles, CA
                    </Text>
                </InfoRow>
                <View style={styles.cardDivider} />
                <InfoRow icon="identifier" label="Property ID">
                    <Text style={[styles.infoValue, { color: SKY }]}>{propId}</Text>
                </InfoRow>
                <View style={styles.cardDivider} />
                <InfoRow icon="home-city-outline" label="Type">
                    <Text style={styles.infoValue}>Single Family</Text>
                </InfoRow>
                <View style={styles.cardDivider} />
                <InfoRow icon="star-circle-outline" label="Status">
                    <View style={styles.readyPill}>
                        <View style={styles.readyDot} />
                        <Text style={styles.readyText}>READY</Text>
                    </View>
                </InfoRow>
            </View>

            {/* Confidence mini stat */}
            <View style={styles.statRow}>
                {[
                    { icon: 'chart-line', label: 'Confidence', value: '98%', color: TEAL },
                    { icon: 'currency-usd', label: 'Valuation', value: '$4.25M', color: NAVY },
                    { icon: 'calendar-outline', label: 'Listed', value: '2024', color: SLATE },
                ].map((s) => (
                    <View key={s.label} style={styles.statCard}>
                        <MaterialCommunityIcons name={s.icon as any} size={18} color={s.color} />
                        <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2 — Enrich Data
// ═══════════════════════════════════════════════════════════════════════════
function Step2EnrichData() {
    const [yearBuilt, setYearBuilt] = useState('1995');
    const [livingArea, setLivingArea] = useState('3,250 Sq Ft');
    const [flooring, setFlooring] = useState(['Hardwood', 'Tile']);
    const [appliances, setAppliances] = useState(['Refrigerator', 'Oven', 'Dishwasher']);
    const [smart, setSmart] = useState(['Thermostat']);

    const toggle = (list: string[], set: (v: string[]) => void, item: string) =>
        set(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.stepScroll}
            keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <View style={styles.stepHeaderRow}>
                <View style={styles.stepHeaderIcon}>
                    <MaterialCommunityIcons name="check-decagram-outline" size={22} color={TEAL} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.stepHeaderTitle}>Institutional Data Sync</Text>
                    <Text style={styles.stepHeaderSub}>Review and refine the synchronized property attributes.</Text>
                </View>
            </View>

            {/* Structural Specs */}
            <SectionHeading label="STRUCTURAL SPECS" />
            <View style={styles.card}>
                <View style={styles.twoCol}>
                    <SelectRow label="Property Type" value="Residential SFH" />
                    <SelectRow label="Beds" value="5" />
                </View>
                <View style={styles.fieldDivider} />
                <View style={styles.twoCol}>
                    <SelectRow label="Baths" value="4.5" />
                    <SelectRow label="Garage Spaces" value="None" />
                </View>
                <View style={styles.fieldDivider} />
                <View style={styles.twoCol}>
                    <SelectRow label="Roof Material" value="Asphalt Shingle" />
                    <SelectRow label="Foundation" value="Concrete Slab" />
                </View>
                <View style={styles.fieldDivider} />
                <View style={styles.twoCol}>
                    <InputRow label="Year Built" value={yearBuilt} onChange={setYearBuilt} />
                    <InputRow label="Living Area" value={livingArea} onChange={setLivingArea} />
                </View>
            </View>

            {/* Interior & Energy */}
            <SectionHeading label="INTERIOR & ENERGY" />
            <View style={styles.card}>
                <View style={styles.twoCol}>
                    <SelectRow label="Heating" value="Forced Air" />
                    <SelectRow label="Cooling" value="Central Air" />
                </View>
                <View style={styles.fieldDivider} />
                <SelectRow label="Basement" value="Fully Finished" />
            </View>

            {/* Chip Groups */}
            {[
                { title: 'Flooring', items: ['Hardwood', 'Tile', 'Carpet', 'Laminate', 'Vinyl', 'Concrete'], state: flooring, setState: setFlooring },
                { title: 'Appliances', items: ['Refrigerator', 'Oven', 'Dishwasher', 'Microwave', 'Washer', 'Dryer'], state: appliances, setState: setAppliances },
                { title: 'Smart Home', items: ['Thermostat', 'Security', 'Lighting', 'Audio', 'Locks'], state: smart, setState: setSmart },
            ].map((group) => (
                <View key={group.title}>
                    <SectionHeading label={group.title.toUpperCase()} />
                    <View style={[styles.card, { paddingVertical: 14 }]}>
                        <View style={styles.chipWrap}>
                            {group.items.map((item) => (
                                <Chip
                                    key={item}
                                    label={item}
                                    selected={group.state.includes(item)}
                                    onToggle={() => toggle(group.state, group.setState, item)}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            ))}

            <View style={{ height: 12 }} />
        </ScrollView>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3 — AI Media
// ═══════════════════════════════════════════════════════════════════════════
function Step3AIMedia({ img1, img2 }: { img1: string; img2: string }) {
    const [prompt, setPrompt] = useState('');

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.stepScroll}
            keyboardShouldPersistTaps="handled"
        >
            {/* Hero */}
            <LinearGradient
                colors={['rgba(13,148,136,0.09)', 'rgba(14,165,233,0.06)']}
                style={[styles.heroCard, { paddingBottom: 20 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.heroIconRing}>
                    <MaterialCommunityIcons name="auto-fix" size={26} color={TEAL} />
                </View>
                <Text style={styles.heroTitle}>AI Marketing Suite</Text>
                <Text style={styles.heroSub}>
                    Upload your photos or use Zien AI to generate high-end architectural visuals.
                </Text>
            </LinearGradient>

            {/* Upload panel */}
            <TouchableOpacity style={styles.uploadCard} activeOpacity={0.8}>
                <View style={styles.uploadDashedInner}>
                    <MaterialCommunityIcons name="image-plus" size={32} color={TEAL} />
                    <Text style={styles.uploadTitle}>Upload Media</Text>
                    <Text style={styles.uploadSub}>Tap to add multiple property photos</Text>
                    <View style={styles.selectBtn}>
                        <MaterialCommunityIcons name="plus" size={14} color={TEAL} />
                        <Text style={styles.selectBtnText}>Select Photos</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* AI Studio */}
            <View style={styles.card}>
                <View style={styles.aiStudioHeaderRow}>
                    <LinearGradient
                        colors={[TEAL, SKY]}
                        style={styles.aiStudioIconBox}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <MaterialCommunityIcons name="auto-fix" size={18} color="#fff" />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.aiStudioTitle}>AI Studio Generator</Text>
                        <Text style={styles.aiStudioSub}>Describe the architectural scene to synthesize.</Text>
                    </View>
                </View>
                <Text style={styles.promptLabel}>GENERATION PROMPT</Text>
                <TextInput
                    style={styles.promptInput}
                    placeholder="e.g. A high-end modern living room with floor-to-ceiling windows at golden hour, minimalist furniture, marble floors..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    value={prompt}
                    onChangeText={setPrompt}
                    textAlignVertical="top"
                />
                <TouchableOpacity activeOpacity={0.85}>
                    <LinearGradient
                        colors={[NAVY, '#1e3a5f']}
                        style={styles.generateBtn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <MaterialCommunityIcons name="auto-fix" size={16} color="#fff" />
                        <Text style={styles.generateBtnText}>Generate with AI</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Photo gallery */}
            <SectionHeading label="UPLOADED MEDIA" />
            <View style={styles.photoGrid}>
                {[
                    { uri: img1, label: 'Scene 1' },
                    { uri: img2, label: 'Scene 2' },
                ].map(({ uri, label }) => (
                    <View key={label} style={styles.photoCard}>
                        <Image source={{ uri }} style={styles.photoImg} contentFit="cover" />
                        <LinearGradient
                            colors={['transparent', 'rgba(15,23,42,0.7)']}
                            style={styles.photoOverlay}
                        />
                        <TouchableOpacity style={styles.photoRemove}>
                            <MaterialCommunityIcons name="close" size={13} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.photoFooter}>
                            <View>
                                <Text style={styles.photoMeta}>ORIGINAL MEDIA</Text>
                                <Text style={styles.photoName}>{label}</Text>
                            </View>
                            <TouchableOpacity style={styles.magicBtn}>
                                <MaterialCommunityIcons name="auto-fix" size={12} color={TEAL} />
                                <Text style={styles.magicBtnText}>Enhance</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            <View style={{ height: 12 }} />
        </ScrollView>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4 — Publish (Final Review)
// ═══════════════════════════════════════════════════════════════════════════
function Step4Publish({ img1, img2 }: { img1: string; img2: string }) {
    const rows = [
        { label: 'Address', value: '123 Business Way, Los Angeles, CA' },
        { label: 'Property Type', value: 'Residential SFH' },
        { label: 'Beds', value: '5' },
        { label: 'Baths', value: '4.5' },
        { label: 'Garage Spaces', value: '3 Car Attached' },
        { label: 'Roof Material', value: 'Asphalt Shingle' },
    ];

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.stepScroll}
        >
            {/* Header */}
            <View style={styles.stepHeaderRow}>
                <View style={styles.stepHeaderIcon}>
                    <MaterialCommunityIcons name="file-document-check-outline" size={22} color={TEAL} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.stepHeaderTitle}>Final Review</Text>
                    <Text style={styles.stepHeaderSub}>Snapshot of your optimized property listing.</Text>
                </View>
            </View>

            {/* Data profile */}
            <SectionHeading label="DATA PROFILE" />
            <View style={styles.card}>
                {rows.map((row, i) => (
                    <View key={row.label}>
                        <View style={styles.profileRow}>
                            <Text style={styles.profileLabel}>{row.label}</Text>
                            <Text style={styles.profileValue}>{row.value}</Text>
                        </View>
                        {i < rows.length - 1 && <View style={styles.cardDivider} />}
                    </View>
                ))}
            </View>

            {/* Media gallery */}
            <SectionHeading label="MEDIA GALLERY (2)" />
            <View style={styles.galleryRow}>
                <Image source={{ uri: img1 }} style={styles.galleryImg} contentFit="cover" />
                <Image source={{ uri: img2 }} style={styles.galleryImg} contentFit="cover" />
            </View>

            {/* Publish note */}
            <View style={styles.publishNote}>
                <MaterialCommunityIcons name="information-outline" size={16} color={TEAL} />
                <Text style={styles.publishNoteText}>
                    Clicking "Save & Publish" will make this listing live across all connected channels.
                </Text>
            </View>

            <View style={{ height: 12 }} />
        </ScrollView>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUCCESS SCREEN
// ═══════════════════════════════════════════════════════════════════════════
function SuccessScreen({ propId, onDone }: { propId: string; onDone: () => void }) {
    const scale = useRef(new Animated.Value(0)).current;
    const fade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
            Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const nextActions = [
        { icon: 'home-city-outline', title: 'Property Inventory', desc: 'Return to your vault and manage all listings.' },
        { icon: 'calendar-check-outline', title: 'Schedule Open House', desc: 'Activate digital check-in and visitor tracking.' },
        { icon: 'share-variant-outline', title: 'Add to Social Media', desc: 'Broadcast to Instagram and LinkedIn with AI captions.' },
        { icon: 'bullhorn-outline', title: 'Add to Campaign', desc: 'Connect to active marketing and drip flows.' },
    ];

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepScroll}>
            {/* Success hero */}
            <Animated.View style={[styles.successHero, { opacity: fade }]}>
                <Animated.View style={[styles.successRing, { transform: [{ scale }] }]}>
                    <LinearGradient
                        colors={[TEAL, SKY]}
                        style={styles.successGradientCircle}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <MaterialCommunityIcons name="check-bold" size={36} color="#fff" />
                    </LinearGradient>
                </Animated.View>
                <Text style={styles.successTitle}>Updates Saved!</Text>
                <Text style={styles.successBody}>
                    {'Your property at '}
                    <Text style={{ fontWeight: '800', color: NAVY }}>123 Business Way, Los Angeles, CA</Text>
                    {' has been successfully updated.'}
                </Text>
                <Text style={styles.successId}>ID: {propId}</Text>
            </Animated.View>

            {/* Next phase */}
            <SectionHeading label="LISTING ACTIVATED: CHOOSE NEXT PHASE" />
            <View style={styles.actionsGrid}>
                {nextActions.map((a) => (
                    <TouchableOpacity key={a.title} style={styles.actionCard} activeOpacity={0.8} onPress={onDone}>
                        <View style={styles.actionIconBox}>
                            <MaterialCommunityIcons name={a.icon as any} size={20} color={NAVY} />
                        </View>
                        <Text style={styles.actionTitle}>{a.title}</Text>
                        <Text style={styles.actionDesc}>{a.desc}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Secondary */}
            <SectionHeading label="SECONDARY ACTIVATION" />
            <TouchableOpacity style={styles.landingCard} activeOpacity={0.8} onPress={onDone}>
                <View style={styles.landingIcon}>
                    <MaterialCommunityIcons name="web" size={20} color={TEAL} />
                </View>
                <View>
                    <Text style={styles.landingTitle}>Landing Page</Text>
                    <Text style={styles.landingSub}>Create a dedicated property site</Text>
                </View>
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={SLATE}
                    style={{ marginLeft: 'auto' }}
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.85}>
                <LinearGradient
                    colors={[NAVY, '#1e3a5f']}
                    style={styles.doneBtnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <MaterialCommunityIcons name="home-outline" size={18} color="#fff" />
                    <Text style={styles.doneBtnText}>Back to Property Inventory</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════
export default function EditPropertyScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [activeStep, setActiveStep] = useState(0); // 0-indexed for library
    const [published, setPublished] = useState(false);

    const propId = (id as string) ?? 'ZN-94021-LA';
    const data = PROPERTY_DATA[propId] ?? PROPERTY_DATA['ZN-94021-LA'];

    const handleBack = () => {
        if (activeStep === 0) {
            router.back();
        } else {
            setActiveStep((s) => s - 1);
        }
    };

    // config per step
    const footerConfig = [
        {
            nextLabel: 'Continue to Enrich Data',
            nextColors: [NAVY, '#1e3a5f'] as [string, string],
            nextIcon: 'arrow-right',
            onNext: () => setActiveStep(1),
            showBack: false,
        },
        {
            nextLabel: 'Continue to AI Media',
            nextColors: [NAVY, '#1e3a5f'] as [string, string],
            nextIcon: 'arrow-right',
            onNext: () => setActiveStep(2),
            showBack: true,
        },
        {
            nextLabel: 'Finalize Listing',
            nextColors: [NAVY, '#1e3a5f'] as [string, string],
            nextIcon: 'arrow-right',
            onNext: () => setActiveStep(3),
            showBack: true,
        },
        {
            nextLabel: 'Save & Publish Listing',
            nextColors: [TEAL, SKY] as [string, string],
            nextIcon: 'cloud-upload-outline',
            onNext: () => setPublished(true),
            showBack: true,
        },
    ];
    const currentFooter = footerConfig[activeStep] ?? footerConfig[0];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Background */}
            <LinearGradient
                colors={['#EEF2F7', '#E8EDF5', '#EEF2F7']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* ── HEADER ── */}
            <View style={styles.header}>
                <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
                    <MaterialCommunityIcons name="arrow-left" size={20} color={NAVY} />
                </Pressable>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Edit Property</Text>
                    <Text style={styles.headerSub}>Managing data for {propId}</Text>
                </View>
            </View>

            {/* ── SUCCESS ── */}
            {published ? (
                <View style={styles.contentArea}>
                    <SuccessScreen propId={propId} onDone={() => router.back()} />
                </View>
            ) : (
                /* ── PROGRESS STEPS + fixed footer ── */
                <>
                    <View style={[styles.contentArea, { paddingBottom: 0 }]}>
                        <ProgressSteps
                            {...PS_PROPS}
                            activeStep={activeStep}
                        >
                            {/* ── Step 1 ── */}
                            <ProgressStep
                                label="Identify"
                                {...BTN_PROPS}
                                removeBtnRow
                                onNext={() => setActiveStep(1)}
                                onPrevious={() => router.back()}
                                scrollable={false}
                            >
                                <View style={styles.psContent}>
                                    <Step1Identify propId={propId} address={data.address} />
                                </View>
                            </ProgressStep>

                            {/* ── Step 2 ── */}
                            <ProgressStep
                                label="Enrich Data"
                                {...BTN_PROPS}
                                removeBtnRow
                                onNext={() => setActiveStep(2)}
                                onPrevious={() => setActiveStep(0)}
                                scrollable={false}
                            >
                                <View style={styles.psContent}>
                                    <Step2EnrichData />
                                </View>
                            </ProgressStep>

                            {/* ── Step 3 ── */}
                            <ProgressStep
                                label="AI Media"
                                {...BTN_PROPS}
                                removeBtnRow
                                onNext={() => setActiveStep(3)}
                                onPrevious={() => setActiveStep(1)}
                                scrollable={false}
                            >
                                <View style={styles.psContent}>
                                    <Step3AIMedia img1={data.image1} img2={data.image2} />
                                </View>
                            </ProgressStep>

                            {/* ── Step 4 ── */}
                            <ProgressStep
                                label="Publish"
                                {...BTN_PROPS}
                                removeBtnRow
                                onSubmit={() => setPublished(true)}
                                onPrevious={() => setActiveStep(2)}
                                scrollable={false}
                            >
                                <View style={styles.psContent}>
                                    <Step4Publish img1={data.image1} img2={data.image2} />
                                </View>
                            </ProgressStep>
                        </ProgressSteps>
                    </View>

                    {/* ── FIXED FOOTER (outside ProgressSteps) ── */}
                    <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                        {currentFooter.showBack && (
                            <TouchableOpacity
                                style={styles.backFooterBtn}
                                onPress={handleBack}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={16} color={SLATE} />
                                <Text style={styles.backFooterText}>Back</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={currentFooter.showBack ? styles.nextBtn : styles.nextBtnFull}
                            onPress={currentFooter.onNext}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={currentFooter.nextColors}
                                style={styles.nextBtnGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.nextBtnText}>{currentFooter.nextLabel}</Text>
                                <MaterialCommunityIcons
                                    name={currentFooter.nextIcon as any}
                                    size={18}
                                    color="#fff"
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: H,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: LIGHT_BG,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: NAVY,
        letterSpacing: -0.3,
    },
    headerSub: { fontSize: 11, color: SLATE, marginTop: 1 },
    stepBadge: {
        backgroundColor: LIGHT_BG,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    stepBadgeText: { fontSize: 12, fontWeight: '800', color: NAVY },

    accentLine: { height: 0, width: '100%' },

    contentArea: { flex: 1, backgroundColor: '#FFF' },


    psContent: { flex: 1 },

    // Step scroll
    stepScroll: {
        paddingHorizontal: H,
        paddingTop: 14,
        paddingBottom: 4,
    },

    // Hero card
    heroCard: {
        borderRadius: 20,
        padding: 22,
        alignItems: 'center',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(13,148,136,0.14)',
    },
    heroIconRing: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(13,148,136,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        borderWidth: 2,
        borderColor: 'rgba(13,148,136,0.2)',
    },
    heroTitle: { fontSize: 18, fontWeight: '800', color: NAVY, textAlign: 'center', marginBottom: 6 },
    heroSub: { fontSize: 13, color: SLATE, textAlign: 'center', lineHeight: 18 },

    // Card
    card: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 14,
        shadowColor: '#94A3B8',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 2 },
    fieldDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },

    // Info rows (identify)
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 10,
    },
    infoIconWrap: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: 'rgba(13,148,136,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoLabel: { fontSize: 12, color: SLATE, fontWeight: '600', width: 88 },
    infoValueWrap: { flex: 1, alignItems: 'flex-end' },
    infoValue: { fontSize: 13, fontWeight: '700', color: NAVY, textAlign: 'right' },
    readyPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(13,148,136,0.12)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    readyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: TEAL },
    readyText: { fontSize: 10, fontWeight: '800', color: TEAL, letterSpacing: 0.6 },

    // Stat row (identify step)
    statRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 14,
    },
    statCard: {
        flex: 1,
        backgroundColor: CARD_BG,
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#94A3B8',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    statValue: { fontSize: 15, fontWeight: '800' },
    statLabel: { fontSize: 10, color: SLATE, fontWeight: '600' },

    // Section heading
    sectionHeadRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 4 },
    sectionHeadBar: { width: 3, height: 14, borderRadius: 2, backgroundColor: TEAL },
    sectionHeadText: { fontSize: 10, fontWeight: '800', color: SLATE, letterSpacing: 1.2, textTransform: 'uppercase' },

    // Step header
    stepHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    stepHeaderIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(13,148,136,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(13,148,136,0.15)',
    },
    stepHeaderTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
    stepHeaderSub: { fontSize: 12, color: SLATE, marginTop: 3, lineHeight: 16 },

    // Two column layout
    twoCol: { flexDirection: 'row', gap: 10 },

    // Fields
    fieldWrap: { flex: 1, paddingVertical: 8 },
    fieldLabel: { fontSize: 10, fontWeight: '700', color: SLATE, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: LIGHT_BG,
    },
    selectValue: { fontSize: 13, color: NAVY, fontWeight: '600', flex: 1 },
    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 13,
        color: NAVY,
        backgroundColor: LIGHT_BG,
        fontWeight: '600',
    },

    // Chips
    chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#CBD5E1',
        backgroundColor: LIGHT_BG,
    },
    chipActive: {
        borderColor: TEAL,
        backgroundColor: 'rgba(13,148,136,0.07)',
    },
    chipText: { fontSize: 12, fontWeight: '600', color: SLATE },
    chipTextActive: { color: TEAL, fontWeight: '700' },

    // AI Media
    uploadCard: {
        marginBottom: 14,
        borderRadius: 16,
        overflow: 'hidden',
    },
    uploadDashedInner: {
        borderWidth: 2,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 28,
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    uploadTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginTop: 12, marginBottom: 4 },
    uploadSub: { fontSize: 12, color: SLATE, marginBottom: 16 },
    selectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderWidth: 1.5,
        borderColor: TEAL,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    selectBtnText: { fontSize: 13, color: TEAL, fontWeight: '700' },

    aiStudioHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14, paddingTop: 6 },
    aiStudioIconBox: {
        width: 38,
        height: 38,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiStudioTitle: { fontSize: 14, fontWeight: '800', color: NAVY },
    aiStudioSub: { fontSize: 11, color: SLATE, marginTop: 2 },
    promptLabel: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 7 },
    promptInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 10,
        fontSize: 13,
        color: NAVY,
        minHeight: 88,
        backgroundColor: LIGHT_BG,
        marginBottom: 10,
        fontWeight: '500',
    },
    generateBtn: {
        borderRadius: 10,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 13,
        backgroundColor: NAVY,
    },
    generateBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

    // Photo grid
    photoGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    photoCard: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#F1F5F9',
    },
    photoImg: { width: '100%', height: 130 },
    photoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
    },
    photoRemove: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(239,68,68,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingBottom: 8,
        paddingTop: 4,
    },
    photoMeta: { fontSize: 7, color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: 0.5 },
    photoName: { fontSize: 12, fontWeight: '800', color: '#fff' },
    magicBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 7,
        paddingHorizontal: 7,
        paddingVertical: 4,
    },
    magicBtnText: { fontSize: 10, color: TEAL, fontWeight: '700' },

    // Final review
    profileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 11,
    },
    profileLabel: { fontSize: 13, color: SLATE, fontWeight: '500' },
    profileValue: { fontSize: 13, fontWeight: '800', color: NAVY, textAlign: 'right', flex: 1, paddingLeft: 12 },
    galleryRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    galleryImg: { flex: 1, height: 100, borderRadius: 12 },
    publishNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: 'rgba(13,148,136,0.07)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(13,148,136,0.15)',
        marginBottom: 8,
    },
    publishNoteText: { fontSize: 12, color: TEAL, flex: 1, lineHeight: 17, fontWeight: '500' },

    // Success
    successHero: {
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 8,
    },
    successRing: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 18,
        shadowColor: TEAL,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    successGradientCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successTitle: { fontSize: 26, fontWeight: '900', color: NAVY, letterSpacing: -0.5, marginBottom: 10 },
    successBody: { fontSize: 14, color: SLATE, textAlign: 'center', lineHeight: 21, paddingHorizontal: 10 },
    successId: { fontSize: 11, color: '#94A3B8', fontWeight: '700', marginTop: 10, letterSpacing: 0.5 },

    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
    actionCard: {
        width: (SW - H * 2 - 10) / 2,
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#94A3B8',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    },
    actionIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: LIGHT_BG,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    actionTitle: { fontSize: 12, fontWeight: '800', color: NAVY, marginBottom: 4 },
    actionDesc: { fontSize: 11, color: SLATE, lineHeight: 15 },

    landingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: CARD_BG,
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    landingIcon: {
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: 'rgba(13,148,136,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    landingTitle: { fontSize: 14, fontWeight: '800', color: NAVY },
    landingSub: { fontSize: 12, color: SLATE },

    doneBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 4 },
    doneBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 15,
    },
    doneBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

    // Footer buttons
    footer: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: H,
        paddingTop: 12,
        backgroundColor: CARD_BG,
        borderTopWidth: 1,
        borderTopColor: '#E8EDF5',
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 8,
    },
    backFooterBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 15,
        borderRadius: 14,
        backgroundColor: LIGHT_BG,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    backFooterText: { fontSize: 14, fontWeight: '700', color: SLATE },
    nextBtn: { flex: 2, borderRadius: 14, overflow: 'hidden' },
    nextBtnFull: { flex: 1, borderRadius: 14, overflow: 'hidden' },
    nextBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
    },
    nextBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
