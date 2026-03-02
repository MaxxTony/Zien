import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Template {
    id: string;
    name: string;
    type: string;
    trigger: string;
    audience: string;
    isActive: boolean;
}

const TEMPLATES_DATA: Template[] = [
    {
        id: '1',
        name: 'Open House Follow-Up',
        type: 'Drip Sequence',
        trigger: 'Check-in + 2m',
        audience: 'Recent Viewers',
        isActive: true,
    },
    {
        id: '2',
        name: 'Virtual Staging Lead Welcome',
        type: 'Instant Response',
        trigger: 'Listing Click (Social)',
        audience: 'Social Leads',
        isActive: true,
    },
    {
        id: '3',
        name: 'Cold Lead Re-engagement',
        type: 'Ghost Protocol',
        trigger: '90 Days Inactivity',
        audience: 'Dormant Leads',
        isActive: true,
    },
    {
        id: '4',
        name: 'Home Anniversary',
        type: 'Lifecycle',
        trigger: '1 Year Post-Close',
        audience: 'Past Clients',
        isActive: false,
    },
    {
        id: '5',
        name: 'Luxury Villa - New Listing',
        type: 'Property Campaign',
        trigger: 'Property Inbound',
        audience: 'High-Net worth List',
        isActive: true,
    },
];

export default function CRM_TemplatesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>(TEMPLATES_DATA);

    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

    // Web-Only Feature Modal State
    const [webOnlyModalVisible, setWebOnlyModalVisible] = useState(false);

    const toggleTemplateStatus = (id: string) => {
        setTemplates(prev =>
            prev.map(t => (t.id === id ? { ...t, isActive: !t.isActive } : t))
        );
    };

    const deleteTemplate = (id: string) => {
        setTemplateToDelete(id);
        setConfirmDeleteVisible(true);
    };

    const handleConfirmDelete = () => {
        if (templateToDelete) {
            setTemplates(prev => prev.filter(t => t.id !== templateToDelete));
            setConfirmDeleteVisible(false);
            setTemplateToDelete(null);
        }
    };

    const renderTemplateCard = (template: Template) => (
        <View key={template.id} style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons name="lightning-bolt-outline" size={20} color="#0B2D3E" />
                </View>
                <View style={styles.headerRight}>
                    <View style={[styles.statusToggle, template.isActive ? styles.activeToggleBg : styles.pausedToggleBg]}>
                        <Text style={[styles.statusLabel, template.isActive ? styles.activeText : styles.pausedText]}>
                            {template.isActive ? 'ACTIVE' : 'PAUSED'}
                        </Text>
                        <Switch
                            value={template.isActive}
                            onValueChange={() => toggleTemplateStatus(template.id)}
                            trackColor={{ false: '#CBD5E1', true: '#0BA0B2' }}
                            thumbColor="#FFFFFF"
                            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                        />
                    </View>
                    <Pressable onPress={() => deleteTemplate(template.id)} hitSlop={8}>
                        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" style={{ marginLeft: 8 }} />
                    </Pressable>
                </View>
            </View>

            <Text style={styles.templateName}>{template.name}</Text>
            <Text style={styles.templateType}>Type: <Text style={styles.typeValue}>{template.type}</Text></Text>

            <View style={styles.detailsRow}>
                <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>TRIGGER</Text>
                    <Text style={styles.detailValue}>{template.trigger}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>AUDIENCE</Text>
                    <Text style={[styles.detailValue, { color: '#0BA0B2' }]}>{template.audience}</Text>
                </View>
            </View>

            <Pressable
                style={styles.editBtn}
                onPress={() => setWebOnlyModalVisible(true)}
            >
                <Text style={styles.editBtnText}>Edit Templates</Text>
            </Pressable>
        </View>
    );

    return (
        <LinearGradient
            colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <PageHeader
                title="Templates"
                subtitle="Set once, and let Zien nurture your leads based on time and behavior."
                onBack={() => router.back()}
                rightIcon="plus"
                onRightPress={() => setWebOnlyModalVisible(true)}
            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
                showsVerticalScrollIndicator={false}
            >
                {templates.map(renderTemplateCard)}
            </ScrollView>

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

            {/* Web-Only Informational Modal */}
            <Modal
                visible={webOnlyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setWebOnlyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModal}>
                        <View style={styles.webIconCircle}>
                            <MaterialCommunityIcons name="monitor" size={32} color="#0BA0B2" />
                        </View>

                        <Text style={styles.confirmTitle}>Check this on Web</Text>
                        <Text style={styles.confirmSubtitle}>
                            Creating and editing templates is optimized for large displays. Please log in to your dashboard on a computer to access full design tools.
                        </Text>

                        <View style={styles.modalActions}>
                            <Pressable
                                style={styles.primaryBtn}
                                onPress={() => setWebOnlyModalVisible(false)}
                            >
                                <Text style={styles.primaryBtnText}>Got it</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 2,
        paddingVertical: 2,
        borderRadius: 20,
        borderWidth: 1,
    },
    activeToggleBg: {
        backgroundColor: '#F0FDFA',
        borderColor: '#0BA0B2',
    },
    pausedToggleBg: {
        backgroundColor: '#F1F5F9',
        borderColor: '#CBD5E1',
    },
    statusLabel: {
        fontSize: 10,
        fontWeight: '900',
        marginRight: 4,
    },
    activeText: {
        color: '#0D9488',
    },
    pausedText: {
        color: '#64748B',
    },
    templateName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 4,
    },
    templateType: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 16,
    },
    typeValue: {
        color: '#0B2D3E',
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    detailBox: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    detailLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '900',
        color: '#0B2D3E',
    },
    editBtn: {
        width: '100%',
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    editBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#0B2D3E',
    },
    // Custom Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    confirmModal: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    trashCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    confirmTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 12,
        textAlign: 'center',
    },
    confirmSubtitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
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
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    cancelBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0B2D3E',
    },
    deleteBtn: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#DC2626',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    // Web Only Info Modal Styles
    webIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F0F9FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    primaryBtn: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#0B2D3E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});
