import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { CRMTemplate, deleteCRMTemplate, getCRMTemplates, patchCRMTemplateStatus } from '@/services/crmService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function CRM_TemplatesScreen() {
    const { colors, theme } = useAppTheme();
    const styles = getStyles(colors, theme);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { accessToken } = useAuth();

    const { data: templateList, isLoading, refetch } = useQuery({
        queryKey: ['crmTemplates'],
        queryFn: () => getCRMTemplates(accessToken || ''),
        enabled: !!accessToken,
    });

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [webOnlyModalVisible, setWebOnlyModalVisible] = useState(false);

    const queryClient = useQueryClient();

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: number }) => 
            patchCRMTemplateStatus(accessToken || '', id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crmTemplates'] });
        },
        onError: (error) => {
            Alert.alert('Error', 'Failed to update status. Please try again.');
            console.error(error);
        }
    });

    const toggleTemplateStatus = (id: string, newStatus: number) => {
        statusMutation.mutate({ id, status: newStatus });
    };


    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCRMTemplate(accessToken || '', id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crmTemplates'] });
        },
        onError: (error) => {
            Alert.alert('Error', 'Failed to delete template. Please try again.');
            console.error(error);
        }
    });

    const deleteTemplate = (id: string) => {
        setTemplateToDelete(id);
        setConfirmDeleteVisible(true);
    };

    const handleConfirmDelete = () => {
        if (templateToDelete) {
            deleteMutation.mutate(templateToDelete);
            setConfirmDeleteVisible(false);
            setTemplateToDelete(null);
        }
    };

    const handleSelectTemplateType = () => {
        setCreateModalVisible(false);
        // Slight delay for smooth transition between modals
        setTimeout(() => {
            setWebOnlyModalVisible(true);
        }, 300);
    };

    const getComponentIcon = (type: string) => {
        switch (type) {
            case 'Branding': return 'seal-variant';
            case 'Property Header':
            case 'Property Details': return 'home-analytics';
            case 'Text Block': return 'format-text';
            case 'CTA Button': return 'gesture-tap-button';
            case 'YouTube Video': return 'play-box-outline';
            case 'Image Gallery': return 'image-multiple-outline';
            case 'Document Attachment': return 'file-document-outline';
            case 'Social Links': return 'share-variant-outline';
            case 'Email Signature': return 'signature-freehand';
            case 'Campaign': return 'bullhorn-outline';
            case 'Divider': return 'minus';
            case 'Spacer': return 'arrow-up-down';
            case 'Page Link': return 'link-variant';
            default: return 'card-bulleted-outline';
        }
    };

    const renderTemplateCard = (template: CRMTemplate) => {
        const isEmail = template.template_type.toUpperCase() === 'EMAIL';
        const isSMS = template.template_type.toUpperCase() === 'SMS';
        const isWA = template.template_type.toUpperCase() === 'WHATSAPP';

        const typeColor = isEmail ? '#3B82F6' : isSMS ? '#10B981' : '#25D366';
        const typeBg = isEmail ? 'rgba(59, 130, 246, 0.1)' : isSMS ? 'rgba(16, 185, 129, 0.1)' : 'rgba(37, 211, 102, 0.1)';

        // Extract some preview text if possible
        const firstTextBlock = template.content_json?.components?.find(c => c.type === 'Text Block')?.content || 'No preview text...';

        return (
            <View key={template.id} style={styles.card}>
                {/* Architectural Background Icon */}
                <View style={styles.cardBgIconWrap}>
                    <MaterialCommunityIcons
                        name={isEmail ? 'email-open-outline' : isSMS ? 'message-text-outline' : 'whatsapp'}
                        size={120}
                        color={typeColor}
                        style={styles.cardBgIcon}
                    />
                </View>

                <View style={styles.cardInner}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.typeBadge, { backgroundColor: typeBg }]}>
                            <MaterialCommunityIcons
                                name={isEmail ? 'email-outline' : isSMS ? 'message-text-outline' : 'whatsapp'}
                                size={14}
                                color={typeColor}
                            />
                            <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                                {template.template_type.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.headerRight}>
                            <View style={styles.statusToggleWrap}>
                                <Text style={[styles.statusToggleLabel, { color: template.status === 1 ? '#10B981' : colors.textSecondary }]}>
                                    {template.status === 1 ? 'ACTIVE' : 'PAUSED'}
                                </Text>
                                <Switch
                                    value={template.status === 1}
                                    onValueChange={(val) => toggleTemplateStatus(template.id, val ? 1 : 2)}
                                    trackColor={{ false: '#CBD5E1', true: 'rgba(16, 185, 129, 0.4)' }}
                                    thumbColor={template.status === 1 ? '#10B981' : '#94A3B8'}
                                    ios_backgroundColor="#CBD5E1"
                                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                />
                            </View>
                            <Pressable onPress={() => deleteTemplate(template.id)} hitSlop={12} style={styles.deletePressable}>
                                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
                            </Pressable>
                        </View>
                    </View>

                    <Text style={styles.templateName}>{template.name}</Text>

                    {isEmail && template.subject && (
                        <View style={styles.subjectRow}>
                            <MaterialCommunityIcons name="format-title" size={14} color={colors.textSecondary} />
                            <Text style={styles.subjectText} numberOfLines={1}>{template.subject}</Text>
                        </View>
                    )}

                    <Text style={styles.templatePreview} numberOfLines={2}>{firstTextBlock}</Text>

                    {/* Module Blueprint Visualization */}
                    <View style={styles.blueprintRow}>
                        <View style={styles.blueprintLabelWrap}>
                            <Text style={styles.blueprintLabel}>ARCHITECTURE</Text>
                            <Text style={styles.blueprintCount}>{template.content_json?.components?.length || 0} MODULES</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moduleIconsWrap}>
                            {template.content_json?.components?.slice(0, 8).map((comp, idx) => (
                                <View key={idx} style={styles.moduleIconBox}>
                                    <MaterialCommunityIcons name={getComponentIcon(comp.type)} size={16} color={colors.textPrimary} />
                                </View>
                            ))}
                            {(template.content_json?.components?.length || 0) > 8 && (
                                <View style={styles.moduleIconBox}>
                                    <Text style={styles.moreModulesText}>+{template.content_json.components.length - 8}</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardFooter}>
                        <View style={styles.metaInfo}>
                            <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textSecondary} />
                            <Text style={styles.metaText}>
                                {new Date(template.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                        <Pressable
                            style={styles.uniqueEditBtn}
                            onPress={() => setWebOnlyModalVisible(true)}
                        >
                            <Text style={styles.uniqueEditBtnText}>Configure</Text>
                            <MaterialCommunityIcons name="arrow-right" size={16} color="#FFFFFF" />
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={colors.backgroundGradient as any}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <PageHeader
                title="Templates"
                subtitle="Set once, and let Zien nurture your leads based on time and behavior."
                onBack={() => router.back()}

            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentTeal} />
                }
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.accentTeal} />
                    </View>
                ) : templateList && templateList.length > 0 ? (
                    templateList.map(renderTemplateCard)
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="file-document-outline" size={48} color={colors.surfaceIcon} />
                        <Text style={styles.emptyText}>No templates found.</Text>
                    </View>
                )}
            </ScrollView>

            <Pressable
                style={[styles.fab, { bottom: insets.bottom + 24 }]}
                onPress={() => setCreateModalVisible(true)}
            >
                <MaterialCommunityIcons name="plus" size={32} color="#FFFFFF" />
            </Pressable>

            {/* Custom Delete Confirmation Modal */}
            <Modal
                visible={confirmDeleteVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmDeleteVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModal}>
                        <View style={styles.trashCircle}>
                            <MaterialCommunityIcons name="trash-can-outline" size={32} color="#EF4444" />
                        </View>

                        <Text style={styles.confirmTitle}>Delete Template?</Text>
                        <Text style={styles.confirmSubtitle}>
                            This action cannot be undone. This template will be permanently removed from your library.
                        </Text>

                        <View style={styles.modalActions}>
                            <Pressable
                                style={styles.cancelBtn}
                                onPress={() => setConfirmDeleteVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={styles.deleteBtn}
                                onPress={handleConfirmDelete}
                            >
                                <Text style={styles.deleteBtnText}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Template Type Selection Modal */}
            <Modal
                visible={createModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.selectionModal}>
                        <View style={styles.modalHeader}>
                            <View style={styles.headerTitleWrap}>
                                <Text style={styles.selectionModalTitle}>Select Starting Template</Text>
                                <Text style={styles.selectionModalSub}>Choose a base to start building your automation.</Text>
                            </View>
                            <Pressable
                                onPress={() => setCreateModalVisible(false)}
                                style={styles.closeBtn}
                            >
                                <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
                            </Pressable>
                        </View>

                        <View style={styles.selectionGrid}>
                            <Pressable
                                style={styles.selectionCard}
                                onPress={handleSelectTemplateType}
                            >
                                <View style={[styles.selIconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.08)' }]}>
                                    <MaterialCommunityIcons name="email-outline" size={28} color="#3B82F6" />
                                </View>
                                <Text style={styles.selTitle}>Email Template</Text>
                                <Text style={styles.selSub}>Rich HTML emails</Text>
                            </Pressable>

                            <Pressable
                                style={styles.selectionCard}
                                onPress={handleSelectTemplateType}
                            >
                                <View style={[styles.selIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
                                    <MaterialCommunityIcons name="cellphone" size={28} color="#10B981" />
                                </View>
                                <Text style={styles.selTitle}>SMS Template</Text>
                                <Text style={styles.selSub}>Short text updates</Text>
                            </Pressable>

                            <Pressable
                                style={styles.selectionCard}
                                onPress={handleSelectTemplateType}
                            >
                                <View style={[styles.selIconWrap, { backgroundColor: 'rgba(37, 211, 102, 0.08)' }]}>
                                    <MaterialCommunityIcons name="whatsapp" size={28} color="#25D366" />
                                </View>
                                <Text style={styles.selTitle}>WhatsApp Template</Text>
                                <Text style={styles.selSub}>Direct chat engagement</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Web Only Info Modal */}
            <Modal
                visible={webOnlyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setWebOnlyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModal}>
                        <View style={styles.webIconCircle}>
                            <MaterialCommunityIcons name="monitor" size={32} color={colors.accentTeal} />
                        </View>

                        <Text style={styles.confirmTitle}>Web Only Feature</Text>
                        <Text style={styles.confirmSubtitle}>
                            Advanced template design and customization are exclusively available on our web platform for a professional experience.
                        </Text>

                        <View style={styles.modalActions}>
                            <Pressable
                                style={styles.primaryBtn}
                                onPress={() => setWebOnlyModalVisible(false)}
                            >
                                <Text style={styles.primaryBtnText}>GOT IT</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

function getStyles(colors: any, theme?: string) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {
            flex: 1,
        },
        card: {
            backgroundColor: colors.cardBackground,
            borderRadius: 32,
            marginBottom: 24,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.cardBorder,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 8,
        },
        cardInner: {
            padding: 24,
            zIndex: 2,
        },
        cardBgIconWrap: {
            position: 'absolute',
            right: -20,
            top: -20,
            opacity: 0.05,
            zIndex: 1,
        },
        cardBgIcon: {
            transform: [{ rotate: '-15deg' }],
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        statusToggleWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surfaceSoft,
            paddingLeft: 12,
            paddingRight: 4,
            paddingVertical: 2,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.cardBorder,
        },
        statusToggleLabel: {
            fontSize: 10,
            fontWeight: '900',
            letterSpacing: 0.5,
            marginRight: 4,
        },
        statusIndicator: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 10,
        },
        statusIndicatorText: {
            fontSize: 9,
            fontWeight: '900',
            color: '#FFFFFF',
            letterSpacing: 0.5,
        },
        deletePressable: {
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: colors.surfaceSoft,
            alignItems: 'center',
            justifyContent: 'center',
        },
        templateName: {
            fontSize: 22,
            fontWeight: '900',
            color: colors.textPrimary,
            marginBottom: 8,
            letterSpacing: -0.5,
        },
        subjectRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 12,
            backgroundColor: colors.surfaceSoft,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
        },
        subjectText: {
            fontSize: 13,
            color: colors.textSecondary,
            fontWeight: '600',
            flex: 1,
        },
        templatePreview: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 22,
            marginBottom: 24,
            fontWeight: '500',
        },
        blueprintRow: {
            marginBottom: 24,
        },
        blueprintLabelWrap: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        blueprintLabel: {
            fontSize: 10,
            fontWeight: '900',
            color: colors.textMuted,
            letterSpacing: 1.5,
        },
        blueprintCount: {
            fontSize: 10,
            fontWeight: '800',
            color: colors.accentTeal,
        },
        moduleIconsWrap: {
            flexDirection: 'row',
        },
        moduleIconBox: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: colors.surfaceSoft,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
        },
        moreModulesText: {
            fontSize: 11,
            fontWeight: '900',
            color: colors.textSecondary,
        },
        divider: {
            height: 1,
            backgroundColor: colors.cardBorder,
            marginBottom: 20,
        },
        cardFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        metaInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        metaText: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: '700',
        },
        uniqueEditBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#0B2D3E',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 16,
        },
        uniqueEditBtnText: {
            fontSize: 14,
            fontWeight: '900',
            color: '#FFFFFF',
        },
        typeBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            gap: 6,
        },
        typeBadgeText: {
            fontSize: 11,
            fontWeight: '900',
            letterSpacing: 0.5,
        },
        loadingContainer: {
            padding: 40,
            alignItems: 'center',
        },
        emptyContainer: {
            padding: 60,
            alignItems: 'center',
            gap: 16,
        },
        emptyText: {
            fontSize: 15,
            color: colors.textSecondary,
            fontWeight: '600',
        },
        fab: {
            position: 'absolute',
            right: 24,
            width: 72,
            height: 72,
            borderRadius: 24,
            backgroundColor: '#0B2D3E',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0B2D3E',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.4,
            shadowRadius: 18,
            elevation: 12,
            zIndex: 1000,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
        },
        confirmModal: {
            width: '100%',
            backgroundColor: colors.cardBackground,
            borderRadius: 32,
            padding: 32,
            alignItems: 'center',
        },
        trashCircle: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
        },
        confirmTitle: {
            fontSize: 24,
            fontWeight: '900',
            color: colors.textPrimary,
            marginBottom: 12,
            textAlign: 'center',
        },
        confirmSubtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 32,
            fontWeight: '500',
        },
        modalActions: {
            flexDirection: 'row',
            gap: 12,
            width: '100%',
        },
        cancelBtn: {
            flex: 1,
            height: 56,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.cardBackground,
        },
        cancelBtnText: {
            fontSize: 16,
            fontWeight: '800',
            color: colors.textPrimary,
        },
        deleteBtn: {
            flex: 1,
            height: 56,
            borderRadius: 18,
            backgroundColor: '#EF4444',
            alignItems: 'center',
            justifyContent: 'center',
        },
        deleteBtnText: {
            fontSize: 16,
            fontWeight: '800',
            color: '#FFFFFF',
        },
        webIconCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(11, 160, 178, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
        },
        primaryBtn: {
            flex: 1,
            height: 56,
            borderRadius: 18,
            backgroundColor: colors.accentTeal,
            alignItems: 'center',
            justifyContent: 'center',
        },
        primaryBtnText: {
            fontSize: 16,
            fontWeight: '900',
            color: '#FFFFFF',
            letterSpacing: 1,
        },
        fullModal: {
            width: '100%',
            height: '85%',
            backgroundColor: colors.cardBackground,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingTop: 32,
        },
        selectionModal: {
            width: '100%',
            backgroundColor: colors.cardBackground,
            borderRadius: 32,
            padding: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.2,
            shadowRadius: 30,
            elevation: 20,
        },
        selectionModalTitle: {
            fontSize: 17,
            fontWeight: '900',
            color: colors.textPrimary,
            marginBottom: 4,
        },
        selectionModalSub: {
            fontSize: 14,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        headerTitleWrap: {
            flex: 1,
            paddingRight: 16,
        },
        closeBtn: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surfaceSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
        },
        selectionGrid: {
            gap: 12,
        },
        selectionCard: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            borderRadius: 24,
            borderWidth: 1.5,
            borderColor: colors.cardBorder,
            backgroundColor: colors.cardBackground,
        },
        selIconWrap: {
            width: 64,
            height: 64,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
        },
        selTitle: {
            fontSize: 16,
            fontWeight: '900',
            color: colors.textPrimary,
            marginBottom: 4,
            textAlign: 'center',
        },
        selSub: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: '600',
            textAlign: 'center',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 28,
        },
        modalHeaderTitle: {
            fontSize: 24,
            fontWeight: '900',
            color: colors.textPrimary,
        },
        modalBody: {
            flex: 1,
            paddingHorizontal: 32,
        },
        webOnlyNotice: {
            fontSize: 15,
            color: colors.textSecondary,
            lineHeight: 24,
            textAlign: 'center',
            padding: 24,
            backgroundColor: colors.surfaceSoft,
            borderRadius: 24,
            marginBottom: 24,
            fontWeight: '600',
        },
        modalFooter: {
            padding: 32,
            paddingBottom: 40,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
        },
        launchBtn: {
            height: 64,
            backgroundColor: '#0B2D3E',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0B2D3E',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
            elevation: 8,
        },
        launchBtnText: {
            fontSize: 18,
            fontWeight: '900',
            color: '#FFFFFF',
        },
    });
}