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
    KeyboardAvoidingView,
    Platform,
    Modal
} from 'react-native';
import { AGENCY_BG, AGENCY_MENU_ITEMS, AgencyLogo } from './index';

const TABS = ['Virtual Assistant', 'Submitted Ticket', 'Email Support'];

const FAQS = [
    { q: 'How to add more agent seats?', a: 'You can manage seats in the "My Packages" section or contact your account manager for bulk upgrades.' },
    { q: 'Customizing agent permissions?', a: 'Visit the "Role Permissions" page to configure exactly what each role in your agency can access.' },
    { q: 'Whitelabel options?', a: 'Enterprise agencies have access to custom branding settings in the "Agency Settings" menu.' },
];

const SUPPORT_LINES = [
    { title: 'General Intelligence Support', desc: 'Technical assistance and general platform inquiries.', email: 'support@zien.ai', icon: 'email-outline', action: 'Draft Mail' },
    { title: 'Financial & Licensing Hub', desc: 'Subscription tier adjustments and billing records.', email: 'billing@zien.ai', icon: 'briefcase-outline', action: 'Contact Billing' },
    { title: 'Enterprise Partnerships', desc: 'Custom brokerage architecture and deployment.', email: 'sales@zien.ai', icon: 'handshake-outline', action: 'Reach Sales' },
];

const CustomPicker = ({ label, value, options, onSelect }: any) => {
    const { colors } = useAppTheme();
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text>
            <TouchableOpacity 
                onPress={() => setVisible(true)}
                style={[styles.pickerBtn, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
            >
                <Text style={{ color: value ? colors.textPrimary : colors.textMuted }}>{value || 'Select option'}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: '#FFFFFF' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label}</Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        {options.map((opt: string) => (
                            <TouchableOpacity 
                                key={opt} 
                                onPress={() => { onSelect(opt); setVisible(false); }}
                                style={styles.modalOption}
                            >
                                <Text style={styles.modalOptionText}>{opt}</Text>
                                {value === opt && <MaterialCommunityIcons name="check" size={20} color="#F97316" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const VirtualAssistant = () => {
    const { colors } = useAppTheme();
    return (
        <View style={styles.tabContent}>
            <View style={[styles.chatContainer, { backgroundColor: 'rgba(255,255,255,0.4)', borderColor: colors.cardBorder }]}>
                <View style={styles.emptyChat}>
                    <View style={styles.chatIconWrap}>
                        <MaterialCommunityIcons name="comment-text-outline" size={32} color={colors.textMuted} />
                    </View>
                    <Text style={[styles.chatTitle, { color: colors.textPrimary }]}>How can I help you today?</Text>
                    <Text style={[styles.chatDesc, { color: colors.textSecondary }]}>
                        Our AI assistant is trained on all Zien documentation and can resolve 85% of queries instantly.
                    </Text>
                </View>
            </View>
            <View style={styles.chatInputRow}>
                <TextInput 
                    placeholder="Type your message..."
                    placeholderTextColor={colors.textMuted}
                    style={[styles.chatInput, { backgroundColor: '#fff', borderColor: colors.cardBorder }]}
                />
                <TouchableOpacity style={styles.sendBtn}>
                    <MaterialCommunityIcons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const SubmittedTicket = () => {
    const { colors } = useAppTheme();
    const [form, setForm] = useState({
        category: 'Technical Issue',
        priority: 'Low - General Inquiry',
        subject: '',
        description: ''
    });

    return (
        <View style={styles.tabContent}>
            <View style={[styles.formCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                <Text style={[styles.formHeading, { color: colors.textPrimary }]}>Submit a Support Ticket</Text>
                
                <View style={styles.rowInputs}>
                    <View style={{ flex: 1 }}>
                        <CustomPicker 
                            label="Issue Category" 
                            value={form.category} 
                            options={['Technical Issue', 'Billing Inquiry', 'Account Security', 'Feature Request']}
                            onSelect={(v: string) => setForm({...form, category: v})}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <CustomPicker 
                            label="Priority Level" 
                            value={form.priority} 
                            options={['Low - General Inquiry', 'Medium - Need Assistance', 'High - Critical Bug', 'Urgent - System Outage']}
                            onSelect={(v: string) => setForm({...form, priority: v})}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Subject</Text>
                    <TextInput 
                        style={[styles.textInput, { backgroundColor: colors.surfaceSoft, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                        placeholder="Brief description of the issue"
                        placeholderTextColor={colors.textMuted}
                        value={form.subject}
                        onChangeText={(v) => setForm({...form, subject: v})}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Detailed Description</Text>
                    <TextInput 
                        style={[styles.textArea, { backgroundColor: colors.surfaceSoft, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                        placeholder="Please provide as much detail as possible..."
                        placeholderTextColor={colors.textMuted}
                        multiline
                        textAlignVertical="top"
                        value={form.description}
                        onChangeText={(v) => setForm({...form, description: v})}
                    />
                </View>

                <TouchableOpacity style={styles.submitBtn}>
                    <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
                    <Text style={styles.submitBtnText}>Create Support Ticket</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const EmailSupport = () => {
    const { colors } = useAppTheme();
    return (
        <View style={styles.tabContent}>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Direct Support Lines</Text>
            <Text style={[styles.sectionSubheading, { color: colors.textSecondary }]}>Connect with our specialized enterprise teams for rapid resolution.</Text>
            
            <View style={styles.supportLinesList}>
                {SUPPORT_LINES.map((line, i) => (
                    <View key={i} style={[styles.supportLineCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.supportLineTop}>
                            <View style={[styles.iconBox, { backgroundColor: colors.surfaceSoft }]}>
                                <MaterialCommunityIcons name={line.icon as any} size={24} color={colors.textPrimary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.lineTitle, { color: colors.textPrimary }]}>{line.title}</Text>
                                <Text style={[styles.lineDesc, { color: colors.textSecondary }]}>{line.desc}</Text>
                                <Text style={[styles.lineEmail, { color: '#F97316' }]}>{line.email}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.cardBorder }]}>
                            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>{line.action}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default function Support() {
    const { colors } = useAppTheme();
    const [activeTab, setActiveTab] = useState('Virtual Assistant');

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
                    {/* Page Header */}
                    <View style={styles.header}>
                        <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Agency Support Center</Text>
                        <Text style={[styles.mainSubtitle, { color: colors.textSecondary }]}>Get help from our enterprise support team</Text>
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

                    {/* Active Tab Content */}
                    <View style={styles.activeContent}>
                        {activeTab === 'Virtual Assistant' && <VirtualAssistant />}
                        {activeTab === 'Submitted Ticket' && <SubmittedTicket />}
                        {activeTab === 'Email Support' && <EmailSupport />}
                    </View>

                    {/* FAQs Section */}
                    <View style={styles.faqSection}>
                        <Text style={[styles.faqHeading, { color: colors.textPrimary }]}>Quick FAQs</Text>
                        {FAQS.map((faq, i) => (
                            <View key={i} style={styles.faqItem}>
                                <Text style={[styles.faqQ, { color: colors.textPrimary }]}>{faq.q}</Text>
                                <Text style={[styles.faqA, { color: colors.textSecondary }]}>{faq.a}</Text>
                                {i < FAQS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />}
                            </View>
                        ))}
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
    tabsContainer: {
        marginBottom: 24,
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
    activeContent: {
        marginBottom: 40,
    },
    tabContent: {
        gap: 20,
    },
    chatContainer: {
        height: 300,
        borderRadius: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyChat: {
        alignItems: 'center',
    },
    chatIconWrap: {
        marginBottom: 16,
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 8,
        textAlign: 'center',
    },
    chatDesc: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 20,
    },
    chatInputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    chatInput: {
        flex: 1,
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    sendBtn: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        gap: 20,
    },
    formHeading: {
        fontSize: 18,
        fontWeight: '900',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    pickerBtn: {
        height: 50,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textInput: {
        height: 50,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    textArea: {
        height: 120,
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
    },
    submitBtn: {
        backgroundColor: '#F97316',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '900',
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: '900',
    },
    sectionSubheading: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: -16,
    },
    supportLinesList: {
        gap: 16,
    },
    supportLineCard: {
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
    },
    supportLineTop: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineTitle: {
        fontSize: 15,
        fontWeight: '900',
        marginBottom: 4,
    },
    lineDesc: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
        marginBottom: 8,
    },
    lineEmail: {
        fontSize: 13,
        fontWeight: '700',
    },
    actionBtn: {
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '800',
    },
    faqSection: {
        paddingTop: 32,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    faqHeading: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 20,
    },
    faqItem: {
        marginBottom: 16,
    },
    faqQ: {
        fontSize: 14,
        fontWeight: '900',
        marginBottom: 6,
    },
    faqA: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    modalOptionText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
