import { DashboardLayout } from '@/components/main';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Dimensions 
} from 'react-native';
import { AGENCY_BG, AGENCY_MENU_ITEMS, AgencyLogo } from './index';

const { width } = Dimensions.get('window');

const ACTIVE_MODULES = [
    { name: 'Lead Command', icon: 'account-filter' },
    { name: 'Property Hub', icon: 'home-group' },
    { name: 'Team Management', icon: 'account-group' },
    { name: 'Access Control', icon: 'shield-lock' },
    { name: 'AI Neural Engine', icon: 'brain' },
    { name: 'Agency Support', icon: 'customer-service' },
    { name: 'Agency Analytics', icon: 'chart-box' },
    { name: 'Custom Branding', icon: 'palette' },
];

const PlanMetric = ({ label, value, icon }: any) => {
    const { colors } = useAppTheme();
    return (
        <View style={styles.metricItem}>
            <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                <MaterialCommunityIcons name={icon} size={18} color="#FFFFFF" />
            </View>
            <View>
                <Text style={styles.metricLabel}>{label}</Text>
                <Text style={styles.metricValue}>{value}</Text>
            </View>
        </View>
    );
};

export default function BillingPlan() {
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
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Page Title */}
                <View style={styles.header}>
                    <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>My Subscription Package</Text>
                    <Text style={[styles.mainSubtitle, { color: colors.textSecondary }]}>Overview of your current plan and active modules</Text>
                </View>

                {/* Primary Plan Card */}
                <LinearGradient
                    colors={['#0D1B2A', '#1B263B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.planCard}
                >
                    <View style={styles.planHeader}>
                        <View style={styles.planBadge}>
                            <Text style={styles.planBadgeText}>CURRENT PLAN</Text>
                        </View>
                        <MaterialCommunityIcons name="star-circle" size={32} color="#F97316" />
                    </View>

                    <View style={styles.planMainInfo}>
                        <View style={styles.boxIconWrap}>
                            <MaterialCommunityIcons name="cube-outline" size={32} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.planName}>Enterprise Agency</Text>
                            <Text style={styles.planPrice}>€499<Text style={styles.planPeriod}>/month</Text></Text>
                        </View>
                    </View>

                    <View style={styles.metricsGrid}>
                        <PlanMetric label="Agent Seats" value="20 Agents" icon="account-multiple" />
                        <PlanMetric label="AI Credits" value="100,000 / mo" icon="lightning-bolt" />
                        <PlanMetric label="Next Billing" value="March 15, 2026" icon="calendar-clock" />
                    </View>

                    <View style={styles.planActions}>
                        <TouchableOpacity activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#F97316', '#EA580C']}
                                style={styles.upgradeBtn}
                            >
                                <MaterialCommunityIcons name="rocket-launch" size={18} color="#fff" />
                                <Text style={styles.upgradeBtnText}>Upgrade Plan</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.manageBtn}>
                            <Text style={styles.manageBtnText}>Manage Billing</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Active Modules Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Active Modules</Text>
                    <View style={[styles.activeBadge, { backgroundColor: '#E1F8E9' }]}>
                        <Text style={styles.activeBadgeText}>8 Modules Active</Text>
                    </View>
                </View>

                <View style={styles.modulesGrid}>
                    {ACTIVE_MODULES.map((mod, index) => (
                        <View key={index} style={[styles.moduleItem, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.moduleRow}>
                                <View style={styles.checkIconWrap}>
                                    <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                                </View>
                                <Text style={[styles.moduleName, { color: colors.textPrimary }]} numberOfLines={1}>{mod.name}</Text>
                            </View>
                            <Text style={styles.moduleStatus}>INCLUDED</Text>
                        </View>
                    ))}
                </View>

                {/* Support Banner */}
                <TouchableOpacity style={[styles.supportBanner, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
                    <View style={[styles.supportIconWrap, { backgroundColor: '#E0F2FE' }]}>
                        <MaterialCommunityIcons name="shield-search" size={24} color="#0EA5E9" />
                    </View>
                    <View style={styles.supportTextWrap}>
                        <Text style={styles.supportTitle}>Need more modules?</Text>
                        <Text style={styles.supportDesc}>Contact your account manager for custom enterprise features.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#0EA5E9" />
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </DashboardLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 24,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    mainSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 4,
    },
    planCard: {
        borderRadius: 32,
        padding: 24,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    planBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    planBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    planMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 32,
    },
    boxIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    planName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 4,
    },
    planPrice: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
    },
    planPeriod: {
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.6,
    },
    metricsGrid: {
        gap: 16,
        marginBottom: 32,
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 16,
        borderRadius: 20,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metricIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: '600',
    },
    metricValue: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    planActions: {
        gap: 12,
    },
    upgradeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    upgradeBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '900',
    },
    manageBtn: {
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
    },
    manageBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    activeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    activeBadgeText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '900',
    },
    modulesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    moduleItem: {
        width: (width - 48 - 12) / 2,
        padding: 12,
        borderRadius: 18,
        borderWidth: 1,
    },
    moduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    checkIconWrap: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moduleName: {
        fontSize: 11,
        fontWeight: '800',
        flex: 1,
    },
    moduleStatus: {
        color: '#94A3B8',
        fontSize: 9,
        fontWeight: '900',
        marginLeft: 22,
    },
    supportBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        gap: 16,
    },
    supportIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    supportTextWrap: {
        flex: 1,
    },
    supportTitle: {
        color: '#0369A1',
        fontSize: 14,
        fontWeight: '900',
        marginBottom: 2,
    },
    supportDesc: {
        color: '#64748B',
        fontSize: 11,
        fontWeight: '500',
        lineHeight: 16,
    },
});
