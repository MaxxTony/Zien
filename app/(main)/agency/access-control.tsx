import { DashboardLayout } from '@/components/main';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AGENCY_BG, AGENCY_MENU_ITEMS, AgencyLogo } from './index';

const { width } = Dimensions.get('window');

const ROLES = ['Senior Agent', 'Agent', 'Support Agent', 'Observer'];

const MODULE_LIST = [
    { id: 'dashboard', name: 'Agent Dashboard', desc: 'Personal performance overview and Quick Actions' },
    { id: 'crm', name: 'CRM Engine', desc: 'Manage Leads, Contacts, and follow-up sequences' },
    { id: 'aicontent', name: 'AI Content', desc: 'Neural content generation and AI copywriter' },
    { id: 'aistudio', name: 'AI Studio', desc: 'High-fidelity image generation and editing' },
    { id: 'properties', name: 'Properties', desc: 'Personal property inventory and listings' },
    { id: 'social', name: 'Social Hub', desc: 'Campaign scheduling and multi-platform posting' },
    { id: 'security', name: 'Security (Guard)', desc: 'Safety suite and client verification bridge' },
    { id: 'visual', name: 'Visual Hub', desc: 'Virtual tours, 3D renderings, and floor plans' },
    { id: 'deals', name: 'Deals & Rooms', desc: 'Secure transaction management and document signing' },
    { id: 'cards', name: 'Digital Cards', desc: 'Interactive AI-powered business cards' },
    { id: 'inbox', name: 'Inbox', desc: 'Smart inbox with AI summary and categorization' },
    { id: 'landing', name: 'Landing Pages', desc: 'Dynamic lead capture and property microsites' },
    { id: 'calendar', name: 'Calendar', desc: 'Meeting scheduling and automated appointments' },
    { id: 'branding', name: 'Branding Kit', desc: 'Personal branding assets and template management' },
    { id: 'openhouse', name: 'Open House', desc: 'Event management and visitor lead capture' },
    { id: 'integrations', name: 'Integrations', desc: 'Connect external tools (Zillow, MLS, Slack)' },
    { id: 'notifications', name: 'Notifications', desc: 'System alerts and activity push hub' },
    { id: 'profile', name: 'In-App Profile', desc: 'Individual profile and preference settings' },
    { id: 'subscription', name: 'Subscription', desc: 'Agent-level plan oversight and upgrades' },
    { id: 'teamhub', name: 'Team Hub', desc: 'Collaborative space for internal team chat' },
    { id: 'roleinfo', name: 'User Role Info', desc: 'Transparency into current role capabilities' },
    { id: 'devportal', name: 'Developer Portal', desc: 'API keys and webhook management for agents' },
];

const ModuleControlCard = ({ module, permissions, onToggle }: any) => {
    const { colors } = useAppTheme();
    const isEnabled = permissions.enabled;

    const PermissionToggle = ({ label, value, keyName }: any) => (
        <View
            style={[
                styles.toggleItem,
                { backgroundColor: colors.surfaceSoft, borderColor: colors.cardBorder },
                value && { borderColor: '#10B981', backgroundColor: colors.accentGreen + '10' }
            ]}
        >
            <Text
                style={[styles.toggleLabel, { color: value ? colors.textPrimary : colors.textSecondary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {label}
            </Text>
            <Switch
                value={value}
                onValueChange={() => onToggle(module.id, keyName)}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: '#10B981' }}
                thumbColor="#fff"
                ios_backgroundColor="rgba(0,0,0,0.1)"
                style={{ transform: [{ scale: 0.8 }] }}
            />
        </View>
    );

    return (
        <View style={[
            styles.controlCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
            !isEnabled && { opacity: 0.8 }
        ]}>
            <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
                    <Text style={[styles.componentTag, { color: '#F97316' }]}>DASHBOARD COMPONENT</Text>
                </View>
                <Text style={[styles.moduleName, { color: colors.textPrimary }]}>{module.name}</Text>
                <Text style={[styles.moduleDesc, { color: colors.textSecondary }]}>{module.desc}</Text>
            </View>

            <View style={styles.togglesGrid}>
                <View style={styles.toggleRow}>
                    <PermissionToggle label="Enable Module" value={permissions.enabled} keyName="enabled" />
                    <PermissionToggle label="Team Data" value={permissions.teamData} keyName="teamData" />
                </View>
                <View style={styles.toggleRow}>
                    <PermissionToggle label="Allow Export" value={permissions.export} keyName="export" />
                    <PermissionToggle label="Allow Delete" value={permissions.delete} keyName="delete" />
                </View>
            </View>
        </View>
    );
};

export default function AccessControl() {
    const { colors } = useAppTheme();
    const [selectedRole, setSelectedRole] = useState('Senior Agent');

    // Initialize permissions state for all roles and modules
    const [rolePermissions, setRolePermissions] = useState<any>(() => {
        const state: any = {};
        ROLES.forEach(role => {
            state[role] = {};
            MODULE_LIST.forEach(mod => {
                state[role][mod.id] = {
                    enabled: true,
                    teamData: role === 'Senior Agent',
                    export: role === 'Senior Agent',
                    delete: role === 'Senior Agent'
                };
            });
        });
        return state;
    });

    const handleToggle = (moduleId: string, permissionKey: string) => {
        setRolePermissions((prev: any) => ({
            ...prev,
            [selectedRole]: {
                ...prev[selectedRole],
                [moduleId]: {
                    ...prev[selectedRole][moduleId],
                    [permissionKey]: !prev[selectedRole][moduleId][permissionKey]
                }
            }
        }));
    };

    return (
        <DashboardLayout
            menuItems={AGENCY_MENU_ITEMS}
            customLogo={<AgencyLogo />}
            customBackground={colors.cardBackground}
            customHeaderBackground={colors.cardBackground}
            backToMainRoute="/(main)/dashboard"
            isAgency={true}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
            >
                {/* Header Section */}
                <View style={styles.headerArea}>
                    <View style={styles.headerTopRow}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <MaterialCommunityIcons name="shield-lock" size={24} color={colors.textPrimary} />
                                <Text style={[styles.mainHeading, { color: colors.textPrimary }]}>Access Control</Text>
                            </View>
                            <Text style={[styles.mainSubheading, { color: colors.textSecondary }]}>Configure visibility for all 22 workspace modules</Text>
                        </View>
                        <TouchableOpacity style={[styles.syncBtn, { backgroundColor: colors.textPrimary }]}>
                            <MaterialCommunityIcons name="sync" size={18} color={colors.cardBackground} />
                            <Text style={[styles.syncBtnText, { color: colors.cardBackground }]}>Sync</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Notice */}
                    <View style={[styles.infoNotice, { backgroundColor: 'rgba(249, 115, 22, 0.05)', borderColor: 'rgba(249, 115, 22, 0.1)' }]}>
                        <MaterialCommunityIcons name="information-outline" size={16} color="#F97316" />
                        <Text style={[styles.infoNoticeText, { color: colors.textSecondary }]}>
                            These controls map directly to the <Text style={{ fontWeight: '800' }}>src/app/(dashboard)</Text> infrastructure.
                        </Text>
                    </View>
                </View>

                {/* Sticky Section Wrapper */}
                <View style={[styles.stickyWrapper, { backgroundColor: colors.cardBackground, borderBottomColor: colors.cardBorder, borderBottomWidth: 1 }]}>
                    {/* Role Tabs */}
                    <View style={styles.tabsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                            {ROLES.map((role) => (
                                <TouchableOpacity
                                    key={role}
                                    onPress={() => setSelectedRole(role)}
                                    style={[
                                        styles.roleTab,
                                        { backgroundColor: colors.surfaceSoft },
                                        selectedRole === role && { backgroundColor: colors.textPrimary }
                                    ]}
                                >
                                    <Text style={[
                                        styles.roleTabText,
                                        { color: colors.textSecondary },
                                        selectedRole === role && { color: colors.cardBackground, fontWeight: '900' }
                                    ]}>
                                        {role}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Managing Label */}
                    <View style={styles.labelRow}>
                        <Text style={[styles.managingLabel, { color: colors.textPrimary }]}>
                            Managing <Text style={{ color: '#F97316' }}>{selectedRole}</Text> Access
                        </Text>
                    </View>
                </View>

                {/* Modules List */}
                <View style={styles.modulesGrid}>
                    {MODULE_LIST.map((mod) => (
                        <ModuleControlCard
                            key={mod.id}
                            module={mod}
                            permissions={rolePermissions[selectedRole][mod.id]}
                            onToggle={handleToggle}
                        />
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </DashboardLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 24,
    },
    headerArea: {
        marginBottom: 28,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 20,
    },
    mainHeading: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    mainSubheading: {
        fontSize: 13,
        fontWeight: '500',
    },
    syncBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    syncBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '900',
    },
    infoNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    infoNoticeText: {
        fontSize: 11,
        fontWeight: '500',
        flex: 1,
    },
    stickyWrapper: {
        zIndex: 10,
        marginLeft: -24,
        marginRight: -24,
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 4,
    },
    tabsContainer: {
        marginBottom: 16,
    },
    tabsScroll: {
        gap: 12,
    },
    roleTab: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
    },
    roleTabText: {
        fontSize: 13,
        fontWeight: '600',
    },
    labelRow: {
        marginBottom: 12,
    },
    managingLabel: {
        fontSize: 16,
        fontWeight: '900',
    },
    modulesGrid: {
        gap: 20,
    },
    controlCard: {
        borderRadius: 28,
        borderWidth: 1,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 15,
        elevation: 2,
    },
    cardHeader: {
        marginBottom: 24,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10,
    },
    componentTag: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    moduleName: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 4,
    },
    moduleDesc: {
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 18,
        opacity: 0.8,
    },
    togglesGrid: {
        gap: 12,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 12,
    },
    toggleItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    toggleTextPart: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        marginRight: 4,
    },
    toggleLabel: {
        fontSize: 10,
        fontWeight: '800',
    },
});
