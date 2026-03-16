import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import {
    ActivityIndicator,
    Clipboard,
    Image,
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



interface PropertyOption {
    id: string;
    title: string;
    address: string;
    image: string | null;
    defaultValue: string;
}

const PROPERTY_OPTIONS: PropertyOption[] = [
    {
        id: 'generic',
        title: 'Generic Property',
        address: 'Start from scratch',
        image: null,
        defaultValue: '',
    },
    {
        id: 'prop-1',
        title: 'Los Angeles Villa',
        address: '123 Business Way',
        image: 'https://images.unsplash.com/photo-1600596542815-6ad4c727dddf?auto=format&fit=crop&w=400&q=80',
        defaultValue: 'Stunning property at 123 Business Way, Los Angeles, CA. High ceilings, natural light, premium finishes.',
    },
    {
        id: 'prop-2',
        title: 'Malibu Villa',
        address: '88 Gold Coast',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
        defaultValue: 'Stunning property at 88 Gold Coast, Malibu, CA. High ceilings, natural light, premium finishes.',
    },
    {
        id: 'prop-3',
        title: 'Beverly Hills Villa',
        address: '45 Sunset Blvd',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
        defaultValue: 'Stunning property at 45 Sunset Blvd, Beverly Hills, CA. High ceilings, natural light, premium finishes.',
    },
    {
        id: 'prop-4',
        title: 'Miami Villa',
        address: '22 Ocean Drive',
        image: 'https://images.unsplash.com/photo-1512918766671-ed6a07be301f?auto=format&fit=crop&w=400&q=80',
        defaultValue: 'Stunning property at 22 Ocean Drive, Miami, FL. High ceilings, natural light, premium finishes.',
    },
];

const STYLE_OPTIONS = ['Cinematic', 'Professional', 'Minimalist', 'Emotional'];

const MOCK_OUTPUT = `Perched majestically above the shimmering coastline,`;

export default function PropertyDescriptionLabScreen() {
    const { colors } = useAppTheme();
    const styles = getStyles(colors);

    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [selectedProperty, setSelectedProperty] = useState('generic');
    const [inputFeatures, setInputFeatures] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('Cinematic');
    const [isGenerating, setIsGenerating] = useState(false);
    const [output, setOutput] = useState('');
    const [hasGenerated, setHasGenerated] = useState(false);

    const handleGenerate = () => {
        if (!inputFeatures.trim()) return;

        Keyboard.dismiss();
        setIsGenerating(true);
        setHasGenerated(false);
        setOutput('');

        // Simulate thinking time
        setTimeout(() => {
            setIsGenerating(false);
            setHasGenerated(true);

            // Start typing animation
            let index = 0;
            const textToType = MOCK_OUTPUT;
            const speed = 20; // ms per character

            const timer = setInterval(() => {
                if (index < textToType.length) {
                    setOutput((prev) => prev + textToType.charAt(index));
                    index++;
                } else {
                    clearInterval(timer);
                }
            }, speed);
        }, 1500);
    };

    const copyToClipboard = () => {
        Clipboard.setString(output);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={colors.backgroundGradient as any}
                style={[styles.background, { paddingTop: insets.top }]}
            >
                <PageHeader
                    title="Property Description Lab"
                    subtitle="Transform raw property details into high-converting architectural narratives."
                    onBack={() => router.back()}
                />

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Property Selector */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.propertyList}
                    >
                        {PROPERTY_OPTIONS.map((prop) => (
                            <Pressable
                                key={prop.id}
                                style={[
                                    styles.propertyCard,
                                    selectedProperty === prop.id && styles.propertyCardSelected,
                                ]}
                                onPress={() => {
                                    setSelectedProperty(prop.id);
                                    setInputFeatures(prop.defaultValue);
                                }}
                            >
                                <View style={styles.propertyIconContainer}>
                                    {prop.image ? (
                                        <Image source={{ uri: prop.image }} style={styles.propertyImage} />
                                    ) : (
                                        <View style={styles.genericIconBox}>
                                            <MaterialCommunityIcons name="cube-outline" size={20} color="#0B2341" />
                                        </View>
                                    )}
                                </View>
                                <View style={styles.propertyText}>
                                    <Text style={styles.propertyTitle} numberOfLines={1}>{prop.title}</Text>
                                    <Text style={styles.propertyAddress} numberOfLines={1}>{prop.address}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Input Features Card */}
                    <View style={styles.inputCard}>
                        <Text style={styles.cardHeading}>Input Features</Text>
                        <Text style={styles.cardSubtitle}>Describe key details like rooms, views, materials, or special amenities.</Text>

                        <TextInput
                            style={styles.textArea}
                            multiline
                            placeholder="e.g. 5 bedrooms, infinity pool, floor-to-ceiling windows with ocean views, Italian marble kitchen..."
                            placeholderTextColor="#94A3B8"
                            value={inputFeatures}
                            onChangeText={setInputFeatures}
                            textAlignVertical="top"
                        />

                        <View style={styles.inputFooter}>
                            <Pressable
                                style={[styles.generateBtn, !inputFeatures.trim() && styles.generateBtnDisabled]}
                                onPress={handleGenerate}
                                disabled={isGenerating || !inputFeatures.trim()}
                            >
                                {isGenerating ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Text style={styles.generateBtnText}>Generate</Text>
                                    </>
                                )}
                            </Pressable>


                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleList} scrollEnabled={false}>
                            {STYLE_OPTIONS.map((style) => (
                                <Pressable
                                    key={style}
                                    onPress={() => setSelectedStyle(style)}
                                    style={[
                                        styles.stylePill,
                                        selectedStyle === style && styles.stylePillActive,
                                    ]}
                                >
                                    <Text style={[
                                        styles.stylePillText,
                                        selectedStyle === style && styles.stylePillTextActive,
                                    ]}>
                                        {style}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* AI Output Card */}
                    <View style={styles.outputCard}>
                        <View style={styles.outputHeader}>
                            <View style={styles.outputStatus}>
                                <View style={styles.statusDot} />
                                <Text style={styles.outputTitle}>AI GENERATION OUTPUT</Text>
                            </View>
                            {hasGenerated && (
                                <View style={styles.outputActions}>
                                    <Pressable style={styles.iconAction} onPress={copyToClipboard}>
                                        <MaterialCommunityIcons name="content-copy" size={18} color="#94A3B8" />
                                    </Pressable>
                                    <Pressable style={styles.saveBtn}>
                                        <MaterialCommunityIcons name="content-save-outline" size={18} color="#FFFFFF" />
                                        <Text style={styles.saveBtnText}>SAVE</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>

                        <View style={styles.outputArea}>
                            {isGenerating ? (
                                <View style={styles.placeholderState}>
                                    <ActivityIndicator size="large" color="#0BA0B2" />
                                    <Text style={styles.placeholderTitle}>AI is Crafting...</Text>
                                </View>
                            ) : hasGenerated ? (
                                <TextInput
                                    style={styles.outputText}
                                    multiline
                                    value={output}
                                    onChangeText={setOutput}
                                    textAlignVertical="top"
                                />
                            ) : (
                                <View style={styles.placeholderState}>
                                    <MaterialCommunityIcons name="lightning-bolt-outline" size={48} color="#1E293B" />
                                    <Text style={styles.placeholderTitle}>Your Masterpiece Awaits</Text>
                                    <Text style={styles.placeholderSubtitle}>
                                        Fill in the property details and click generate to see the magic happen.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

function getStyles(colors: any) {
    return StyleSheet.create({
        container: { flex: 1 },
        background: { flex: 1 },
        scroll: { flex: 1 },
        scrollContent: { paddingHorizontal: 20 },

        // Property Selector
        propertyList: {
            paddingVertical: 10,
            gap: 12,
            marginBottom: 20,
        },
        propertyCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardBackground,
            borderRadius: 14,
            padding: 12,
            width: 220,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            shadowColor: colors.cardShadowColor,
            shadowOpacity: 0.02,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 1,
        },
        propertyCardSelected: {
            borderColor: '#0BA0B2',
            borderWidth: 2,
            backgroundColor: colors.cardBackground,
        },
        propertyIconContainer: {
            width: 44,
            height: 44,
            borderRadius: 10,
            overflow: 'hidden',
            marginRight: 12,
            backgroundColor: colors.surfaceSoft,
            alignItems: 'center',
            justifyContent: 'center',
        },
        propertyImage: {
            width: '100%',
            height: '100%',
        },
        genericIconBox: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surfaceMuted,
        },
        propertyText: { flex: 1 },
        propertyTitle: {
            fontSize: 14,
            fontWeight: '800',
            color: colors.textPrimary,
            marginBottom: 2,
        },
        propertyAddress: {
            fontSize: 11,
            color: colors.textMuted,
            fontWeight: '600',
        },

        // Input Features Card
        inputCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
            shadowColor: colors.cardShadowColor,
            shadowOpacity: 0.04,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 20,
            elevation: 4,
        },
        cardHeading: {
            fontSize: 18,
            fontWeight: '900',
            color: colors.textPrimary,
            marginBottom: 8,
        },
        cardSubtitle: {
            fontSize: 13,
            color: colors.textSecondary,
            lineHeight: 18,
            marginBottom: 20,
        },
        textArea: {
            backgroundColor: colors.surfaceSoft,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            borderRadius: 16,
            padding: 16,
            height: 180,
            fontSize: 15,
            color: colors.textPrimary,
            fontWeight: '600',
            marginBottom: 20,
        },
        inputFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        generateBtn: {
            backgroundColor: colors.accentTeal,
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 120,
        },
        generateBtnDisabled: {
            opacity: 0.6,
        },
        generateBtnText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '800',
        },
        styleList: { flex: 1, marginTop: 10 },
        stylePill: {
            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 8,
            backgroundColor: colors.surfaceSoft,
            marginRight: 8,
            height: 32,
            justifyContent: 'center',
        },
        stylePillActive: {
            backgroundColor: colors.surfaceMuted,
        },
        stylePillText: {
            fontSize: 8,
            color: colors.textSecondary,
            fontWeight: '700',
        },
        stylePillTextActive: {
            color: colors.textPrimary,
        },

        // Output Card
        outputCard: {
            backgroundColor: colors.cardBackgroundSemi,
            borderRadius: 24,
            padding: 24,
            minHeight: 400,
            shadowColor: colors.cardShadowColor,
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 30,
            elevation: 8,
            borderWidth: 1,
            borderColor: colors.cardBorder,
        },
        outputHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        outputStatus: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#0BA0B2',
            marginRight: 8,
        },
        outputTitle: {
            fontSize: 12,
            fontWeight: '900',
            color: colors.textPrimary,
            letterSpacing: 1,
        },
        outputActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        iconAction: {
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: colors.surfaceSoft,
            alignItems: 'center',
            justifyContent: 'center',
        },
        saveBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#0BA0B2',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            gap: 6,
        },
        saveBtnText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '900',
        },
        outputArea: {
            flex: 1,
        },
        outputText: {
            fontSize: 16,
            color: colors.textPrimary,
            lineHeight: 28,
            fontWeight: '500',
        },
        placeholderState: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        placeholderTitle: {
            fontSize: 18,
            fontWeight: '900',
            color: colors.textSecondary,
            marginTop: 16,
            marginBottom: 8,
        },
        placeholderSubtitle: {
            fontSize: 13,
            color: colors.textMuted,
            textAlign: 'center',
            lineHeight: 20,
            paddingHorizontal: 20,
        },
    });
}

