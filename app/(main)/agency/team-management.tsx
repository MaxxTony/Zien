import { DashboardLayout } from '@/components/main';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    Dimensions,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { AGENCY_BG, AGENCY_MENU_ITEMS, AgencyLogo } from './index';

const { width } = Dimensions.get('window');

const STATS = [
    { icon: 'account-group', value: '12 / 20', label: 'MY TEAM SIZE' },
    { icon: 'account-check', value: '10', label: 'ACTIVE AGENTS' },
    { icon: 'view-grid', value: '45', label: 'TOTAL MODULES' },
    { icon: 'chart-line', value: '6.4', label: 'AVG ACCESS' },
];

const MODULES = [
    "CRM Engine (Master Access)",
    "AI Studio & Content Hub",
    "Property Portfolio HQ",
    "Social Hub & Campaigns",
    "Zien Security Guard",
    "Visual Hub (3D & Tours)",
    "Deal Rooms & Docs",
    "Landing Page Studio"
];

const AGENTS = [
    { id: '1', name: 'Michael Chen', email: 'michael@skyline.com', role: 'Senior Agent', status: 'Active', joined: 'Jan 10, 2026', initial: 'M' },
    { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@skyline.com', role: 'Support Agent', status: 'Active', joined: 'Jan 15, 2026', initial: 'S' },
    { id: '3', name: 'David Miller', email: 'david@skyline.com', role: 'Senior Agent', status: 'Inactive', joined: 'Feb 02, 2026', initial: 'D' },
    { id: '4', name: 'Jessica Wong', email: 'jessica@skyline.com', role: 'Agent', status: 'Pending', joined: 'Feb 12, 2026', initial: 'J' },
    { id: '5', name: 'Robert Wilson', email: 'robert@skyline.com', role: 'Manager', status: 'Active', joined: 'Dec 20, 2023', initial: 'R' },
];

const StatCard = ({ icon, value, label }: any) => {
    const { colors } = useAppTheme();
    return (
        <View style={[styles.statPanel, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={styles.statIconBox}>
                <MaterialCommunityIcons name={icon} size={20} color={colors.accentTeal} />
            </View>
            <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
            </View>
        </View>
    );
};

const AgentModal = ({ visible, onClose, agent, onSave }: any) => {
    const { colors } = useAppTheme();
    const isEdit = !!agent;
    const [form, setForm] = useState<any>({
        name: '',
        email: '',
        role: 'Agent',
        status: 'Active',
        selectedModules: [MODULES[0]]
    });

    useEffect(() => {
        if (visible) {
            if (agent) {
                setForm({ ...agent });
            } else {
                setForm({
                    name: '',
                    email: '',
                    role: 'Agent',
                    status: 'Active',
                    selectedModules: [MODULES[0]]
                });
            }
        }
    }, [agent, visible]);

    const toggleModule = (module: string) => {
        const current = form.selectedModules || [];
        if (current.includes(module)) {
            setForm({ ...form, selectedModules: current.filter((m: string) => m !== module) });
        } else {
            setForm({ ...form, selectedModules: [...current, module] });
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
            <View style={[styles.modalContainer, { backgroundColor: '#FFFFFF' }]}>
                <View style={[styles.modalHeader, { borderBottomColor: colors.cardBorder }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{isEdit ? "Edit Agent Configuration" : "Register New Agent"}</Text>
                        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>{isEdit ? "Update professional details and status" : "Add a new member to your agency team"}</Text>
                    </View>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        {/* Form Grid */}
                        <View style={styles.formGrid}>
                            <View style={styles.inputWrap}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
                                <TextInput 
                                    style={[styles.modalInput, { backgroundColor: colors.surfaceSoft, color: colors.textPrimary, borderColor: colors.cardBorder }]}
                                    value={form.name}
                                    placeholder="Enter agent name"
                                    placeholderTextColor={colors.textSecondary}
                                    onChangeText={(t) => setForm({ ...form, name: t })}
                                />
                            </View>
                            <View style={styles.inputWrap}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address</Text>
                                <TextInput 
                                    style={[styles.modalInput, { backgroundColor: colors.surfaceSoft, color: colors.textPrimary, borderColor: colors.cardBorder }]}
                                    value={form.email}
                                    placeholder="agent@company.com"
                                    placeholderTextColor={colors.textSecondary}
                                    onChangeText={(t) => setForm({ ...form, email: t })}
                                />
                            </View>
                            <View style={styles.inputWrap}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Agency Role</Text>
                                <TouchableOpacity style={[styles.modalPicker, { backgroundColor: colors.surfaceSoft, borderColor: colors.cardBorder }]}>
                                    <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{form.role}</Text>
                                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputWrap}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Account Status</Text>
                                <TouchableOpacity style={[styles.modalPicker, { backgroundColor: colors.surfaceSoft, borderColor: colors.cardBorder }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: form.status === 'Active' ? '#10B981' : '#94A3B8' }} />
                                        <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{form.status}</Text>
                                    </View>
                                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Notice Card */}
                        <View style={[styles.noticeCard, { backgroundColor: isEdit ? 'rgba(249, 115, 22, 0.05)' : 'rgba(11, 160, 178, 0.05)', borderColor: isEdit ? 'rgba(249, 115, 22, 0.1)' : 'rgba(11, 160, 178, 0.1)' }]}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={[styles.noticeIcon, { backgroundColor: isEdit ? 'rgba(249, 115, 22, 0.1)' : 'rgba(11, 160, 178, 0.1)' }]}>
                                    <MaterialCommunityIcons name="information-outline" size={20} color={isEdit ? '#F97316' : '#0BA0B2'} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.noticeTitle, { color: isEdit ? '#F97316' : '#0BA0B2' }]}>{isEdit ? "Security Notice" : "Onboarding Note"}</Text>
                                    <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                                        {isEdit 
                                            ? "Email changes require a new verification cycle. The agent will be locked out until their new email is confirmed."
                                            : "Once registered, the agent will receive an invitation email to set their temporary password and access their dashboard."
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Module Access */}
                        <View style={styles.moduleSection}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <MaterialCommunityIcons name="shield-lock-outline" size={20} color="#F97316" />
                                <Text style={[styles.inputLabel, { color: colors.textPrimary, fontSize: 14, textTransform: 'none' }]}>
                                    {isEdit ? "Updated Module Access" : "Role-Based Module Access"}
                                </Text>
                            </View>
                            <Text style={[styles.moduleDesc, { color: colors.textSecondary }]}>
                                Changes to this agent's role will automatically update their permissions in the next sync.
                            </Text>

                            <View style={styles.moduleGrid}>
                                {MODULES.map((mod) => {
                                    const isSelected = form.selectedModules?.includes(mod);
                                    return (
                                        <TouchableOpacity 
                                            key={mod} 
                                            style={[styles.moduleItem, { backgroundColor: colors.surfaceSoft, borderColor: isSelected ? colors.accentTeal : colors.cardBorder }]}
                                            onPress={() => toggleModule(mod)}
                                        >
                                            <View style={[styles.checkbox, { backgroundColor: isSelected ? colors.accentTeal : 'transparent', borderColor: isSelected ? colors.accentTeal : colors.textSecondary }]}>
                                                {isSelected && <MaterialCommunityIcons name="check" size={12} color="#fff" />}
                                            </View>
                                            <Text style={[styles.moduleText, { color: colors.textPrimary }]}>{mod}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <TouchableOpacity style={[styles.saveBtnFull, { backgroundColor: '#0D1B2A' }]} onPress={() => onSave(form)}>
                            <MaterialCommunityIcons name={isEdit ? "content-save-outline" : "account-plus-outline"} size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.saveBtnTextFull}>{isEdit ? "Save Agent Changes" : "Confirm Registration"}</Text>
                        </TouchableOpacity>
                        
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const AgentCard = ({ agent, onDelete, onEdit }: { agent: any; onDelete: (id: string) => void; onEdit: (agent: any) => void }) => {
    const { colors } = useAppTheme();
    const router = useRouter();
    const isInactive = agent.status === 'Inactive';
    const isPending = agent.status === 'Pending';
    
    const statusBg = isInactive ? 'rgba(148, 163, 184, 0.1)' : isPending ? 'rgba(249, 115, 22, 0.1)' : 'rgba(16, 185, 129, 0.1)';
    const statusColor = isInactive ? '#94A3B8' : isPending ? '#F97316' : '#10B981';

    const handleDelete = () => {
        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete ${agent.name}? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: () => onDelete(agent.id) 
                }
            ]
        );
    };

    const handleKeyAction = () => {
        router.push('/(main)/dashboard');
    };

    return (
        <View style={[styles.agentCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={styles.agentCardTop}>
                <View style={[styles.avatarBox, { backgroundColor: colors.surfaceSoft }]}>
                    <Text style={[styles.avatarText, { color: colors.textPrimary }]}>{agent.initial}</Text>
                </View>
                <View style={styles.agentBasicInfo}>
                    <Text style={[styles.agentName, { color: colors.textPrimary }]}>{agent.name}</Text>
                    <Text style={[styles.agentEmail, { color: colors.textSecondary }]}>{agent.email}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                    <Text style={[styles.statusPillText, { color: statusColor }]}>{agent.status}</Text>
                </View>
            </View>

            <View style={styles.agentCardDivider} />

            <View style={styles.agentCardDetails}>
                <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>ROLE</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{agent.role}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>JOINED</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{agent.joined}</Text>
                </View>
            </View>

            <View style={styles.agentCardFooter}>
                <View style={styles.moduleAccessPreview}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary, marginBottom: 4 }]}>MODULE ACCESS</Text>
                    <Text style={[styles.moduleSubtitle, { color: colors.textSecondary }]}>
                        CRM · AI STUDIO · VISUALS · SAFETY · SOCIAL · +3 MORE
                    </Text>
                </View>
                <View style={styles.agentActions}>
                    <View style={styles.actionBtnGroup}>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleKeyAction}>
                            <MaterialCommunityIcons name="key-variant" size={18} color={colors.accentTeal} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(agent)}>
                            <MaterialCommunityIcons name="pencil" size={18} color={colors.accentTeal} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
                            <MaterialCommunityIcons name="delete" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default function TeamManagement() {
    const { colors } = useAppTheme();
    const [selectedTab, setSelectedTab] = useState('All Agents');
    const [agents, setAgents] = useState(AGENTS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAgent, setEditingAgent] = useState<any>(null);

    const handleDeleteAgent = (id: string) => {
        setAgents(prev => prev.filter(a => a.id !== id));
    };

    const handleOpenAdd = () => {
        setEditingAgent(null);
        setModalVisible(true);
    };

    const handleOpenEdit = (agent: any) => {
        setEditingAgent(agent);
        setModalVisible(true);
    };

    const handleSaveAgent = (formData: any) => {
        if (editingAgent) {
            setAgents(prev => prev.map(a => a.id === editingAgent.id ? { ...a, ...formData } : a));
        } else {
            const newAgent = {
                ...formData,
                id: Math.random().toString(36).substr(2, 9),
                joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                initial: formData.name.charAt(0).toUpperCase()
            };
            setAgents(prev => [newAgent, ...prev]);
        }
        setModalVisible(false);
    };

    return (
        <DashboardLayout 
            menuItems={AGENCY_MENU_ITEMS} 
            customLogo={<AgencyLogo />}
            customBackground={AGENCY_BG}
            customHeaderBackground="#FFFFFF"
            backToMainRoute="/(main)/dashboard"
            isAgency={true}
        >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.headerArea}>
                    <Text style={[styles.mainHeading, { color: colors.textPrimary }]}>Team Management</Text>
                    <Text style={[styles.mainSubheading, { color: colors.textSecondary }]}>Monitor and manage your agency's professional agent roster</Text>
                </View>

                {/* Stats Row */}
                <View style={styles.statsGrid}>
                    {STATS.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsRow}>
                    {['All Agents', 'Active', 'Pending', 'Inactive'].map((tab) => (
                        <TouchableOpacity 
                            key={tab} 
                            onPress={() => setSelectedTab(tab)}
                            style={[styles.tab, selectedTab === tab && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, { color: selectedTab === tab ? colors.textPrimary : colors.textSecondary }, selectedTab === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Search Box */}
                <View style={[styles.searchBox, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, marginBottom: 20 }]}>
                    <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
                    <TextInput 
                        placeholder="Search team members..." 
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                    />
                </View>

                {/* Mobile Agent List */}
                <View style={styles.agentListContainer}>
                    {agents.filter(a => selectedTab === 'All Agents' || a.status === selectedTab).map(agent => (
                        <AgentCard key={agent.id} agent={agent} onDelete={handleDeleteAgent} onEdit={handleOpenEdit} />
                    ))}
                </View>

                <AgentModal 
                    visible={modalVisible} 
                    onClose={() => setModalVisible(false)} 
                    agent={editingAgent}
                    onSave={handleSaveAgent}
                />

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity style={[styles.fab, { backgroundColor: '#0D1B2A' }]} onPress={handleOpenAdd}>
                <MaterialCommunityIcons name="plus" size={28} color="#fff" />
            </TouchableOpacity>
        </DashboardLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 24,
    },
    agentListContainer: {
        gap: 16,
    },
    agentCard: {
        borderRadius: 24,
        borderWidth: 1,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
    },
    agentCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    agentBasicInfo: {
        flex: 1,
    },
    agentCardDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 14,
    },
    agentCardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    detailItem: {
        gap: 4,
    },
    detailLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.8,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '800',
    },
    agentCardFooter: {
        marginTop: 4,
        gap: 16,
    },
    moduleAccessPreview: {
        width: '100%',
    },
    agentActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionBtnGroup: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0D1B2A',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    headerArea: {
        marginBottom: 28,
    },
    mainHeading: {
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    mainSubheading: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    statPanel: {
        flex: 1,
        minWidth: (width - 48 - 16) / 2,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statIconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(11, 160, 178, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        opacity: 0.6,
        letterSpacing: 0.8,
        marginTop: 2,
    },
    searchBox: {
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    tab: {
        paddingVertical: 8,
    },
    tabActive: {
        borderBottomWidth: 3,
        borderBottomColor: '#0D1B2A',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
    },
    tabTextActive: {
        fontWeight: '900',
    },
    avatarBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '900',
    },
    agentName: {
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: -0.4,
    },
    agentEmail: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 1,
    },
    moduleSubtitle: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    statusPillText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 24,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    modalSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
    },
    modalScroll: {
        padding: 24,
    },
    formGrid: {
        gap: 20,
        marginBottom: 24,
    },
    inputWrap: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    modalInput: {
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 14,
        fontWeight: '600',
    },
    modalPicker: {
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    noticeCard: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 16,
        marginBottom: 32,
    },
    noticeIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noticeTitle: {
        fontSize: 14,
        fontWeight: '900',
        marginBottom: 2,
    },
    noticeText: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
    },
    moduleSection: {
        marginBottom: 32,
    },
    moduleDesc: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 20,
        lineHeight: 18,
    },
    moduleGrid: {
        gap: 12,
    },
    moduleItem: {
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moduleText: {
        fontSize: 13,
        fontWeight: '700',
    },
    saveBtnFull: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    saveBtnTextFull: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '900',
    },
});
