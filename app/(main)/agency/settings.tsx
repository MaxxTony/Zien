import { DashboardLayout } from '@/components/main';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    TextInput,
    Switch,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import { AGENCY_BG, AGENCY_MENU_ITEMS, AgencyLogo } from './index';

const { width } = Dimensions.get('window');

const TABS = ['Branding', 'Security & Access', 'Notifications', 'Billing Methods'];

const InputField = ({ label, value, onChangeText, placeholder, multiline = false, secureTextEntry = false }: any) => {
    const { colors } = useAppTheme();
    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text>
            <TextInput 
                style={[
                    multiline ? styles.textArea : styles.textInput, 
                    { backgroundColor: colors.surfaceSoft, borderColor: colors.cardBorder, color: colors.textPrimary }
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                multiline={multiline}
                secureTextEntry={secureTextEntry}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
};

const BrandingTab = () => {
    const { colors } = useAppTheme();
    return (
        <View style={styles.tabContent}>
            <View style={styles.logoSection}>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>AGENCY LOGO</Text>
                <TouchableOpacity style={[styles.uploadBox, { backgroundColor: colors.surfaceSoft, borderColor: colors.cardBorder, borderStyle: 'dashed' }]}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={32} color={colors.textMuted} />
                    <Text style={[styles.uploadText, { color: colors.textMuted }]}>UPLOAD</Text>
                </TouchableOpacity>
                <Text style={[styles.uploadHint, { color: colors.textMuted }]}>PNG or SVG recommended. Transparent background looks best.</Text>
            </View>

            <View style={styles.formSection}>
                <InputField label="Agency Legal Name" placeholder="Becker & Co Properties" />
                <InputField label="Website URL" placeholder="becker.zien.ai" />
                <InputField label="Agency Description" placeholder="Specializing in ultra-luxury coastal estates..." multiline={true} />
                <InputField label="Support Email" placeholder="hello@beckerpro.com" />
                <InputField label="Public Phone" placeholder="+1 310 902 4432" />
                <InputField label="Headquarters Address" placeholder="23400 Pacific Coast Hwy, Malibu, CA 90265" />
                
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#0D1B2A' }]}>
                    <MaterialCommunityIcons name="check-decagram" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Save Branding Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const SecurityTab = () => {
    const { colors } = useAppTheme();
    const [tfa, setTfa] = useState(false);

    return (
        <View style={styles.tabContent}>
            <View style={[styles.settingCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                <View style={styles.settingRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Two-Factor Authentication</Text>
                        <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Secure your account with an additional verification layer.</Text>
                    </View>
                    <Switch 
                        value={tfa} 
                        onValueChange={setTfa}
                        trackColor={{ false: 'rgba(0,0,0,0.1)', true: '#10B981' }}
                    />
                </View>
            </View>

            <View style={styles.formSection}>
                <Text style={[styles.formHeader, { color: colors.textPrimary }]}>Change Password</Text>
                <InputField label="Current Password" placeholder="••••••••••••" secureTextEntry={true} />
                <InputField label="New Password" placeholder="New password" secureTextEntry={true} />
                <InputField label="Confirm New Password" placeholder="Confirm new password" secureTextEntry={true} />
                
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#0D1B2A' }]}>
                    <MaterialCommunityIcons name="key-variant" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Update Security Key</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const NotificationsTab = () => {
    const { colors } = useAppTheme();
    const NOTIFS = [
        { id: 'lead', title: 'Lead Activity', desc: 'Notify when a new lead is captured or assigned.' },
        { id: 'campaign', title: 'Campaign Updates', desc: 'Alert when a scheduled campaign starts or completes.' },
        { id: 'system', title: 'System Alerts', desc: 'Critical infrastructure and billing notifications.' },
        { id: 'news', title: 'AI Assistant News', desc: 'Updates on neural processing and new AI features.' },
    ];

    const [states, setStates] = useState<any>({
        lead_email: true, lead_push: true,
        campaign_email: true, campaign_push: true,
        system_email: true, system_push: true,
        news_email: false, news_push: true,
    });

    const toggle = (id: string, type: 'email' | 'push') => {
        const key = `${id}_${type}`;
        setStates((prev: any) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <View style={styles.tabContent}>
            {NOTIFS.map((item, i) => (
                <View key={i} style={styles.notifItem}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.notifTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                        <Text style={[styles.notifDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
                    </View>
                    <View style={styles.notifToggles}>
                        <View style={styles.toggleGroup}>
                            <Text style={[styles.toggleTag, { color: colors.textMuted }]}>EMAIL</Text>
                            <Switch 
                                value={states[`${item.id}_email`]}
                                onValueChange={() => toggle(item.id, 'email')}
                                trackColor={{ false: 'rgba(0,0,0,0.1)', true: '#10B981' }} 
                                style={{ transform: [{ scale: 0.8 }] }} 
                            />
                        </View>
                        <View style={styles.toggleGroup}>
                            <Text style={[styles.toggleTag, { color: colors.textMuted }]}>PUSH</Text>
                            <Switch 
                                value={states[`${item.id}_push`]}
                                onValueChange={() => toggle(item.id, 'push')}
                                trackColor={{ false: 'rgba(0,0,0,0.1)', true: '#10B981' }} 
                                style={{ transform: [{ scale: 0.8 }] }} 
                            />
                        </View>
                    </View>
                    {i < NOTIFS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.rowBorder }]} />}
                </View>
            ))}
        </View>
    );
};

const BillingTab = () => {
    const { colors } = useAppTheme();
    return (
        <View style={styles.tabContent}>
            <View style={[styles.planCard, { backgroundColor: '#0D1B2A' }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.planBadge}>CURRENT PLAN</Text>
                    <Text style={styles.planTitle}>Agency Professional</Text>
                    <Text style={styles.planInfo}>Next billing cycle: March 24, 2026</Text>
                </View>
                <TouchableOpacity style={styles.upgradeBtn}>
                    <Text style={styles.upgradeText}>UPGRADE</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.paymentSection}>
                <Text style={[styles.formHeader, { color: colors.textPrimary }]}>Payment Methods</Text>
                <View style={[styles.cardItem, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.visaBox}>
                        <Text style={styles.visaText}>VISA</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.cardNumber, { color: colors.textPrimary }]}>Visa ending in 4242</Text>
                        <Text style={[styles.cardExpiry, { color: colors.textSecondary }]}>Expires 12/28</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={[styles.editText, { color: colors.accentTeal }]}>Edit</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={[styles.addCardBtn, { borderColor: colors.cardBorder }]}>
                    <MaterialCommunityIcons name="plus" size={20} color={colors.textSecondary} />
                    <Text style={[styles.addCardText, { color: colors.textSecondary }]}>Add New Card</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function AgencySettings() {
    const { colors } = useAppTheme();
    const [activeTab, setActiveTab] = useState('Branding');

    return (
        <DashboardLayout 
            menuItems={AGENCY_MENU_ITEMS} 
            customLogo={<AgencyLogo />}
            customBackground={AGENCY_BG}
            customHeaderBackground="#FFFFFF"
            backToMainRoute="/(main)/dashboard"
            isAgency={true}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTitleRow}>
                            <MaterialCommunityIcons name="cog-outline" size={28} color={colors.textPrimary} />
                            <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Agency Settings</Text>
                        </View>
                        <Text style={[styles.mainSubtitle, { color: colors.textSecondary }]}>Configure your agency-wide preferences</Text>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                            {TABS.map((tab) => (
                                <TouchableOpacity 
                                    key={tab} 
                                    onPress={() => setActiveTab(tab)}
                                    style={[
                                        styles.tab, 
                                        { backgroundColor: colors.surfaceSoft },
                                        activeTab === tab && { backgroundColor: '#0D1B2A' }
                                    ]}
                                >
                                    <Text style={[
                                        styles.tabText, 
                                        { color: colors.textSecondary },
                                        activeTab === tab && { color: '#FFFFFF', fontWeight: '900' }
                                    ]}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {activeTab === 'Branding' && <BrandingTab />}
                        {activeTab === 'Security & Access' && <SecurityTab />}
                        {activeTab === 'Notifications' && <NotificationsTab />}
                        {activeTab === 'Billing Methods' && <BillingTab />}
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </DashboardLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 28,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    mainSubtitle: {
        fontSize: 13,
        fontWeight: '500',
    },
    tabsContainer: {
        marginBottom: 28,
        marginLeft: -24,
        marginRight: -24,
    },
    tabsScroll: {
        paddingHorizontal: 24,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '700',
    },
    content: {
        gap: 24,
    },
    tabContent: {
        gap: 28,
    },
    logoSection: {
        alignItems: 'center',
    },
    sectionHeading: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    uploadBox: {
        width: 120,
        height: 120,
        borderRadius: 24,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    uploadText: {
        fontSize: 10,
        fontWeight: '900',
        marginTop: 4,
    },
    uploadHint: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 40,
    },
    formSection: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    textInput: {
        height: 50,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    textArea: {
        height: 100,
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        fontSize: 14,
    },
    saveBtn: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 12,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '900',
    },
    settingCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '900',
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
    },
    formHeader: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 8,
    },
    notifItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 20,
        position: 'relative',
    },
    notifTitle: {
        fontSize: 15,
        fontWeight: '900',
        marginBottom: 4,
    },
    notifDesc: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
    },
    notifToggles: {
        flexDirection: 'row',
        gap: 12,
    },
    toggleGroup: {
        alignItems: 'center',
        gap: 4,
    },
    toggleTag: {
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    planCard: {
        padding: 24,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    planBadge: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 6,
    },
    planTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 4,
    },
    planInfo: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '500',
    },
    upgradeBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    upgradeText: {
        color: '#0D1B2A',
        fontSize: 12,
        fontWeight: '900',
    },
    paymentSection: {
        gap: 20,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        gap: 16,
    },
    visaBox: {
        width: 48,
        height: 32,
        backgroundColor: '#111',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    visaText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    cardNumber: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    cardExpiry: {
        fontSize: 12,
        fontWeight: '500',
    },
    editText: {
        fontSize: 13,
        fontWeight: '800',
    },
    addCardBtn: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addCardText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
