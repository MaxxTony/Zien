import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const TEMPLATES_DATA = [
    {
        id: '1',
        title: 'Listing Showcase',
        status: 'ACTIVE',
        latest: '2H AGO',
        usage_count: '124 posts',
        conv_rate: '88%',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        platform_icon: 'instagram'
    },
    {
        id: '2',
        title: 'Open House Blitz',
        status: 'ACTIVE',
        latest: '1D AGO',
        usage_count: '86 posts',
        conv_rate: '94%',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        platform_icon: 'lightning-bolt'
    },
    {
        id: '3',
        title: 'Market Insight Series',
        status: 'DRAFT',
        latest: '3D AGO',
        usage_count: '42 posts',
        conv_rate: '88%',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        platform_icon: 'office-building'
    },
    {
        id: '4',
        title: 'Property Price Drop',
        status: 'PAUSED',
        latest: '5D AGO',
        usage_count: '15 posts',
        conv_rate: '94%',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        platform_icon: 'twitter'
    },
];

export default function SocialTemplatesScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [templates, setTemplates] = useState(TEMPLATES_DATA);
    const [webOnlyModalVisible, setWebOnlyModalVisible] = useState(false);

    const handleDuplicate = (id: string) => {
        const index = templates.findIndex(t => t.id === id);
        if (index === -1) return;

        const original = templates[index];
        const baseTitle = original.title.split(' (copy')[0];

        // Find all siblings that are copies of the same base title
        const copies = templates.filter(t => t.title === baseTitle || t.title.startsWith(`${baseTitle} (copy`));

        let maxCopy = 0;
        copies.forEach(t => {
            if (t.title === `${baseTitle} (copy)`) {
                maxCopy = Math.max(maxCopy, 1);
            } else {
                const match = t.title.match(/\(copy\s(\d+)\)$/);
                if (match) {
                    maxCopy = Math.max(maxCopy, parseInt(match[1]));
                }
            }
        });

        const nextNumber = maxCopy + 1;
        const newTitle = nextNumber === 1
            ? `${baseTitle} (copy)`
            : `${baseTitle} (copy ${nextNumber})`;

        const newTemplate = {
            ...original,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: newTitle,
        };

        const newTemplates = [...templates];
        newTemplates.splice(index + 1, 0, newTemplate);
        setTemplates(newTemplates);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Template',
            'Are you sure you want to delete this template? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    style: 'destructive',
                    onPress: () => {
                        setTemplates(prev => prev.filter(t => t.id !== id));
                    },
                },
            ]
        );
    };

    const renderTemplate = ({ item }: { item: typeof templates[0] }) => (
        <View style={styles.templateCard}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.templateImage} contentFit="cover" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.imageGradient}
                />
                <View style={styles.platformBadge}>
                    <MaterialCommunityIcons name={item.platform_icon as any} size={14} color={colors.textPrimary} />
                </View>
                <Text style={styles.overlayTitle}>{item.title}</Text>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.statusRow}>
                    <Text style={styles.latestText}>LATEST: {item.latest}</Text>
                    <View style={[styles.statusBadge, item.status === 'ACTIVE' ? styles.statusActive : styles.statusOther]}>
                        <Text style={[styles.statusText, item.status === 'ACTIVE' ? styles.statusTextActive : styles.statusTextOther]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.metricsGrid}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>USAGE</Text>
                        <Text style={styles.metricValue}>{item.usage_count}</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>CONV.</Text>
                        <Text style={styles.metricValue}>{item.conv_rate}</Text>
                    </View>
                    <View style={styles.circlesVisual}>
                        <View style={[styles.overlapCircle, { backgroundColor: colors.accentDark }]} />
                        <View style={[styles.overlapCircle, { backgroundColor: colors.accentTeal, marginLeft: -8 }]} />
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <Pressable
                        style={styles.editBtn}
                        onPress={() => setWebOnlyModalVisible(true)}
                    >
                        <Text style={styles.editBtnText}>Edit Template</Text>
                    </Pressable>
                    <Pressable
                        style={styles.iconActionBtn}
                        onPress={() => handleDuplicate(item.id)}
                    >
                        <MaterialCommunityIcons name="plus" size={18} color={colors.textMuted} />
                    </Pressable>
                    <Pressable
                        style={styles.iconActionBtn}
                        onPress={() => handleDelete(item.id)}
                    >
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color="#F87171" />
                    </Pressable>
                </View>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={colors.backgroundGradient as any}
            style={[styles.background, { paddingTop: insets.top }]}>

            <PageHeader
                title="Templates"
                subtitle="Design premium visual templates for automated social posting."
                onBack={() => router.back()}
            />


            <FlatList
                key="single-column"
                data={templates}
                keyExtractor={(item) => item.id}
                renderItem={renderTemplate}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="image-off-outline" size={48} color={colors.textMuted} />
                        <Text style={styles.emptyText}>No templates found.</Text>
                    </View>
                }
            />

            {/* Floating Create Button */}
            <View style={[styles.floatingHint, { bottom: insets.bottom + 20 }]}>
                <Pressable
                    style={styles.aiButton}
                    onPress={() => setWebOnlyModalVisible(true)}
                >
                    <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
                    <Text style={styles.aiButtonText}>New Template</Text>
                </Pressable>
            </View>
            {/* Web Only Feature Modal */}
            <Modal
                visible={webOnlyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setWebOnlyModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlayDark}
                    onPress={() => setWebOnlyModalVisible(false)}
                >
                    <View style={styles.infoModalContent}>
                        <View style={styles.infoIconBox}>
                            <MaterialCommunityIcons name="monitor" size={32} color={colors.textPrimary} />
                        </View>
                        <Text style={styles.infoModalTitle}>Web-Only Feature</Text>
                        <Text style={styles.infoModalDesc}>
                            Advanced template design and customization are exclusively available on our web platform for a professional experience.
                        </Text>
                        <Pressable
                            style={styles.infoGotItBtn}
                            onPress={() => setWebOnlyModalVisible(false)}
                        >
                            <Text style={styles.infoGotItText}>GOT IT</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </LinearGradient>
    );
}

function getStyles(colors: any) {
  return StyleSheet.create({
    background: { flex: 1 },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    templateCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...Platform.select({
            ios: { shadowColor: colors.cardShadowColor, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20 },
            android: { elevation: 4 },
        }),
    },
    imageContainer: {
        height: 160,
        width: '100%',
        position: 'relative',
    },
    templateImage: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    platformBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.surfaceIcon,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayTitle: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    cardContent: {
        padding: 16,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    latestText: {
        fontSize: 10,
        fontWeight: '800',
        color: colors.textMuted,
        letterSpacing: 0.5,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusActive: {
        backgroundColor: '#ECFDF5',
    },
    statusOther: {
        backgroundColor: colors.surfaceSoft,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
    },
    statusTextActive: {
        color: '#10B981',
    },
    statusTextOther: {
        color: colors.textSecondary,
    },
    metricsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceSoft,
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
        gap: 20,
    },
    metricItem: {
        flex: 1,
    },
    metricLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: colors.textMuted,
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 13,
        fontWeight: '900',
        color: colors.textPrimary,
    },
    circlesVisual: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    overlapCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.cardBorder,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    editBtn: {
        flex: 1,
        height: 44,
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    iconActionBtn: {
        width: 44,
        height: 44,
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
    },
    floatingHint: {
        position: 'absolute',
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    aiButton: {
        backgroundColor: colors.accentTeal,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 28,
        paddingVertical: 18,
        borderRadius: 30,
        shadowColor: '#0B2341',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 15,
        elevation: 10,
    },
    aiButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: -0.2,
    },
    modalOverlayDark: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    infoModalContent: {
        backgroundColor: colors.cardBackground,
        borderRadius: 32,
        padding: 30,
        width: '100%',
        alignItems: 'center',
    },
    infoIconBox: {
        width: 64,
        height: 64,
        backgroundColor: colors.surfaceSoft,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    infoModalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    infoModalDesc: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    infoGotItBtn: {
        backgroundColor: colors.accentTeal,
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 16,
    },
    infoGotItText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
  });
}
