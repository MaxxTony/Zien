import { DashboardLayout } from '@/components/main';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const AGENCY_MENU_ITEMS = [
    { label: 'Agency Dashboard', icon: 'view-dashboard-outline', route: '/(main)/agency' as Href },
    { label: 'Team Management', icon: 'account-group-outline', route: '/(main)/agency/team-management' as Href },
    { label: 'Access Control', icon: 'lock-outline', route: '/(main)/agency/access-control' as Href },
    { label: 'Billing & Plan', icon: 'credit-card-outline', route: '/(main)/agency/billing-plan' as Href },
    { label: 'Agency Support', icon: 'help-circle-outline', route: '/(main)/agency/support' as Href },
    { label: 'Agency Settings', icon: 'cog-outline', route: '/(main)/agency/settings' as Href },
];

export const AgencyLogo = () => (
    <View style={styles.logoBlock}>
        <View style={styles.logoRow}>
            <Image source={require('@/assets/images/rem.png')} style={{ height: 28, width: 28, resizeMode: 'contain' }} />
            <Text style={styles.logoText}>Zien</Text>
        </View>
        <Text style={styles.logoSubtext}>AGENCY CONTROL</Text>
    </View>
);

export const AGENCY_BG = '#0D1B2A'; // Dark blue background for the agency panel

const StatCard = ({ icon, value, label, badge, avatarHint }: any) => {
    const { colors } = useAppTheme();
    return (
        <View style={[styles.statPanel, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            {badge && (
                <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{badge}</Text>
                </View>
            )}
            
            <View style={styles.statTopPart}>
                <View style={styles.statIconBox}>
                    <MaterialCommunityIcons name={icon} size={22} color={colors.accentTeal} />
                </View>
                
                {avatarHint && (
                    <View style={styles.avatarHint}>
                        <Text style={styles.avatarHintText}>+4</Text>
                    </View>
                )}
            </View>

            <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
            </View>
        </View>
    );
};

const ActivityItem = ({ icon, title, subtitle, time, color }: any) => {
    const { colors } = useAppTheme();
    return (
        <View style={styles.activityRow}>
            <View style={[styles.activityDot, { backgroundColor: color }]} />
            <View style={styles.activityMain}>
                <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>{title}</Text>
                <Text style={[styles.activitySubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            </View>
            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>{time}</Text>
        </View>
    );
};

const UsageBar = ({ label, progress, color }: any) => {
    const { colors } = useAppTheme();
    return (
        <View style={styles.usageBarGroup}>
            <View style={styles.usageBarHeader}>
                <Text style={[styles.usageBarLabel, { color: colors.textSecondary }]}>{label}</Text>
            </View>
            <View style={[styles.usageBarTrack, { backgroundColor: colors.surfaceSoft }]}>
                <View style={[styles.usageBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
            </View>
        </View>
    );
};

export default function AgencyDashboard() {
    const { colors } = useAppTheme();

    return (
        <DashboardLayout
            menuItems={AGENCY_MENU_ITEMS}
            customLogo={<AgencyLogo />}
            customBackground={AGENCY_BG}
            customHeaderBackground="#FFFFFF"
            backToMainRoute="/(main)/dashboard"
            isAgency={true}
        >
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerArea}>
                    <Text style={[styles.mainHeading, { color: colors.textPrimary }]}>Agency Control Center</Text>
                    <Text style={[styles.mainSubheading, { color: colors.textSecondary }]}>Manage your company, agents, and permissions</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard icon="account-group" value="42" label="My Agents" avatarHint />
                    <StatCard icon="view-module" value="12" label="Team Modules" badge="Active" />
                    <StatCard icon="lightning-bolt" value="85,000" label="Total Credits" badge="Premium" />
                    <StatCard icon="domain" value="Enterprise" label="Platform Tier" badge="Active" />
                </View>

                {/* Main Content Area */}
                <View style={styles.contentLayout}>
                    {/* Activity Feed */}
                    <View style={[styles.mainCard, { flex: 1.6, backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.cardHeader}>
                            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>My Team Activity</Text>
                            <TouchableOpacity><Text style={[styles.viewAllBtn, { color: colors.accentTeal }]}>View All</Text></TouchableOpacity>
                        </View>
                        <View style={styles.activityList}>
                            <ActivityItem icon="account-plus" title="New Agent Added" subtitle="Michael Chen" time="8 mins ago" color="#0BA0B2" />
                            <ActivityItem icon="shield-edit" title="Permission Updated" subtitle="Sarah Jenkins" time="20 mins ago" color="#F97316" />
                            <ActivityItem icon="refresh" title="Package Renewed" subtitle="Agency Admin" time="1 hour ago" color="#10B981" />
                            <ActivityItem icon="view-module" title="Module View Changed" subtitle="David Miller" time="3 hours ago" color="#6366F1" />
                            <ActivityItem icon="help-circle" title="Support Ticket Closed" subtitle="System" time="8 hours ago" color="#94A3B8" />
                        </View>
                    </View>

                    {/* Usage Insights */}
                    <View style={[styles.mainCard, { flex: 1, backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.cardHeader}>
                            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>My Package Usage</Text>
                        </View>

                        <View style={styles.usageCenterArea}>
                            <View style={[styles.usageCircle, { borderColor: colors.accentTeal + '20' }]}>
                                <View style={styles.usageCircleInner}>
                                    <Text style={[styles.usagePct, { color: colors.textPrimary }]}>34%</Text>
                                    <Text style={[styles.usageLabel, { color: colors.textSecondary }]}>USED</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.usageBarsArea}>
                            <UsageBar label="Agent Seats" progress={0.65} color="#0D1B2A" />
                            <UsageBar label="Module Access" progress={0.88} color="#F97316" />
                            <UsageBar label="API Requests" progress={0.22} color="#0BA0B2" />
                        </View>
                    </View>
                </View>

                <View style={{ height: 40 }} />
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
        marginBottom: 24,
    },
    statPanel: {
        flex: 1,
        minWidth: (width - 48 - 16) / 2,
        padding: 16,
        paddingTop: 18,
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    statTopPart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    statIconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(11, 160, 178, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statContent: {
        marginTop: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.6,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
        opacity: 0.7,
    },
    statusPill: {
        position: 'absolute',
        top: 14,
        right: 14,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
    },
    statusPillText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#10B981',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    avatarHint: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#0D1B2A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarHintText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#fff',
    },
    contentLayout: {
        flexDirection: 'row',
        gap: 20,
        flexWrap: 'wrap',
    },
    mainCard: {
        borderRadius: 24,
        borderWidth: 1,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 15,
        elevation: 2,
        minWidth: 320,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    viewAllBtn: {
        fontSize: 12,
        fontWeight: '700',
    },
    activityList: {
        gap: 18,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activityMain: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    activitySubtitle: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 1,
    },
    activityTime: {
        fontSize: 11,
        fontWeight: '500',
    },
    usageCenterArea: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    usageCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 12,
        alignItems: 'center',
        justifyContent: 'center',
        // In a real app we'd use a Progress Circle library
    },
    usageCircleInner: {
        alignItems: 'center',
    },
    usagePct: {
        fontSize: 28,
        fontWeight: '900',
    },
    usageLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        marginTop: -4,
    },
    usageBarsArea: {
        marginTop: 20,
        gap: 20,
    },
    usageBarGroup: {
        gap: 8,
    },
    usageBarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    usageBarLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    usageBarTrack: {
        height: 4,
        borderRadius: 2,
        width: '100%',
    },
    usageBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    logoBlock: {
        alignItems: 'flex-start',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
    },
    logoSubtext: {
        fontSize: 10,
        fontWeight: '900',
        color: '#F97316',
        letterSpacing: 1.2,
        marginTop: 5,
    }
});

