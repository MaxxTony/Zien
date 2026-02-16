import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExternalLink } from '../../../../components/external-link';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Overview', 'Visitors', 'Automation', 'Settings', 'Seller Report'];

// Mock Data
const EVENT_DATA = {
    address: '123 Business Way, Los Angeles',
    id: 'OH-001',
    visitors: 12,
    hotLeads: 3,
    avgDwell: '8.2m',
};

const VISITORS_DATA = [
    { id: 1, name: 'Jessica Miller', signal: 'Hot', timeline: 'Immediate', preApproved: 'Yes', sync: 'CRM' },
    { id: 2, name: 'Robert Chen', signal: 'Top 3', timeline: '3-6 Months', preApproved: 'Yes', sync: 'CRM' },
    { id: 3, name: 'David Wilson', signal: 'Warm', timeline: '6-12 Months', preApproved: 'No', sync: 'Queued' },
    { id: 4, name: 'Sarah Connor', signal: 'Cold', timeline: 'Just Exploring', preApproved: 'No', sync: 'CRM' },
];

export default function EventDashboardScreen() {
    const { id, mode } = useLocalSearchParams();
    const isLiveMode = mode !== 'view';
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
    const [anonymizeLeads, setAnonymizeLeads] = useState(true);
    const [hideVisitorNames, setHideVisitorNames] = useState(true);

    // Animation for blinking dot
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    const renderOverview = () => (
        <View style={styles.tabContent}>
            {/* Event Summary Card */}
            <View style={styles.card}>
                <View style={styles.qrContainer}>
                    <MaterialCommunityIcons name="qrcode-scan" size={40} color="#0F172A" />
                    <Text style={styles.qrText}>Scan to Check In</Text>
                </View>
                <View style={styles.summaryContent}>
                    <Text style={styles.cardTitle}>Event Summary</Text>
                    <Text style={styles.cardDescription}>
                        Lead capture is synced directly to ZIEN Hub. Visitors receive an Instant Follow-up Package upon check-in.
                    </Text>
                    <View style={styles.timeRow}>
                        <View>
                            <Text style={styles.timeValue}>Jan 15</Text>
                            <Text style={styles.timeLabel}>SCHEDULED DATE</Text>
                        </View>
                        <View>
                            <Text style={styles.timeValue}>1-4 PM</Text>
                            <Text style={styles.timeLabel}>TIME SLOT</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Live Stats */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Live Stats</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{EVENT_DATA.visitors}</Text>
                        <Text style={styles.statLabel}>VISITORS</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{EVENT_DATA.hotLeads}</Text>
                        <Text style={styles.statLabel}>HOT LEADS</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{EVENT_DATA.avgDwell}</Text>
                        <Text style={styles.statLabel}>AVG DWELL</Text>
                    </View>
                </View>
            </View>

            {/* Timeline - Simplified for Mobile */}
            <View style={[styles.card, { backgroundColor: '#0F172A' }]}>
                <Text style={[styles.cardTitle, { color: '#FFF' }]}>Real-Time Timeline</Text>
                <View style={styles.timelineList}>
                    {VISITORS_DATA.slice(0, 3).map((visitor, index) => (
                        <View key={visitor.id} style={styles.timelineItem}>
                            <View style={styles.timelineDot} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.timelineText}>Check-in: {visitor.name}</Text>
                            </View>
                            <Text style={styles.timelineTime}>Just now</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderVisitors = () => (
        <View style={styles.tabContent}>
            {VISITORS_DATA.map((visitor) => (
                <View key={visitor.id} style={styles.visitorCard}>
                    <View style={styles.visitorHeader}>
                        <Text style={styles.visitorName}>{visitor.name}</Text>
                        <Pressable style={styles.actionBtn} onPress={() => setSelectedVisitor(visitor)}>
                            <Text style={styles.actionBtnText}>Details</Text>
                        </Pressable>
                    </View>

                    <View style={styles.visitorDetailsGrid}>
                        <View style={styles.visitorDetailItem}>
                            <Text style={styles.detailLabel}>SIGNAL</Text>
                            <View style={styles.signalBadge}>
                                <MaterialCommunityIcons
                                    name={visitor.signal === 'Hot' ? 'fire' : visitor.signal === 'Top 3' ? 'trending-up' : 'snowflake'}
                                    size={12}
                                    color={visitor.signal === 'Hot' ? '#DC2626' : '#0F172A'}
                                />
                                <Text style={[styles.detailValue, { marginLeft: 4 }]}>{visitor.signal}</Text>
                            </View>
                        </View>
                        <View style={styles.visitorDetailItem}>
                            <Text style={styles.detailLabel}>TIMELINE</Text>
                            <Text style={styles.detailValue}>{visitor.timeline}</Text>
                        </View>
                        <View style={styles.visitorDetailItem}>
                            <Text style={styles.detailLabel}>PRE-APPROVED</Text>
                            <Text style={styles.detailValue}>{visitor.preApproved}</Text>
                        </View>
                        <View style={styles.visitorDetailItem}>
                            <Text style={styles.detailLabel}>SYNC</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <MaterialCommunityIcons name="check-circle-outline" size={12} color="#0F172A" />
                                <Text style={styles.detailValue}>{visitor.sync}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderAutomation = () => (
        <View style={styles.tabContent}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Follow-Up Automation</Text>
                <View style={styles.automationPreview}>
                    <Text style={styles.previewLabel}>EMAIL TEMPLATE PREVIEW</Text>
                    <Text style={styles.previewTitle}>"Thank you for visiting {EVENT_DATA.address}!"</Text>
                    <Text style={styles.previewBody}>
                        Hi [Visitor Name], it was great meeting you today. I've attached the property dossier including the virtual tour...
                    </Text>
                    <View style={styles.attachmentsRow}>
                        <View style={styles.attachmentBox} />
                        <View style={styles.attachmentBox} />
                        <Text style={styles.attachmentText}>+3 dynamic assets attached</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Automation Rules</Text>
                {['Send email instantly on check-in', "Apply 'Hot' tag if 'Offer' selected", 'Sync to CRM within 2 minutes', 'Notify agent mobile on check-in'].map((rule, idx) => (
                    <View key={idx} style={styles.ruleItem}>
                        <Text style={styles.ruleText}>{rule}</Text>
                        <MaterialCommunityIcons name="checkbox-marked" size={20} color="#0F172A" />
                    </View>
                ))}
            </View>
        </View>
    );

    const renderSettings = () => (
        <View style={styles.tabContent}>
            {/* Event Configuration */}
            <View style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <MaterialCommunityIcons name="cog-outline" size={20} color="#0F172A" />
                    <Text style={styles.cardTitle}>Event Configuration</Text>
                </View>

                {/* Event Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Event Name</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputValue}>123 Business Way Open House</Text>
                    </View>
                </View>

                {/* Date & Time */}
                <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Date</Text>
                        <View style={[styles.inputBox, { flexDirection: 'row', alignItems: 'center' }]}>
                            <MaterialCommunityIcons name="calendar" size={16} color="#64748B" style={{ marginRight: 8 }} />
                            <Text style={styles.inputValue}>15/01/2026</Text>
                        </View>
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Time</Text>
                        <View style={[styles.inputBox, { flexDirection: 'row', alignItems: 'center' }]}>
                            <MaterialCommunityIcons name="clock-outline" size={16} color="#64748B" style={{ marginRight: 8 }} />
                            <Text style={styles.inputValue}>1:00 PM - 4:00 PM</Text>
                        </View>
                    </View>
                </View>

                {/* Property Address */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Property Address</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputValue}>123 Business Way, Los Angeles, CA 90210</Text>
                    </View>
                </View>

                {/* Agent Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Agent Name</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputValue}>John Smith</Text>
                    </View>
                </View>
            </View>

            {/* Notification Settings */}
            <View style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <MaterialCommunityIcons name="bell-outline" size={20} color="#0F172A" />
                    <Text style={styles.cardTitle}>Notification Settings</Text>
                </View>
                {[
                    { title: 'Real-time Check-in Alerts', desc: 'Get notified when visitors check in', active: true },
                    { title: 'Hot Lead Notifications', desc: 'Alert when high-interest leads arrive', active: true },
                    { title: 'Email Summaries', desc: 'Daily recap of visitor activity', active: true }
                ].map((setting, idx) => (
                    <View key={idx} style={styles.ruleItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.settingTitle}>{setting.title}</Text>
                            <Text style={styles.settingDesc}>{setting.desc}</Text>
                        </View>
                        <View style={[styles.checkbox, setting.active && styles.checkboxActive]}>
                            {setting.active && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
                        </View>
                    </View>
                ))}
            </View>

            {/* QR Code Settings */}
            <View style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <MaterialCommunityIcons name="qrcode-scan" size={20} color="#0F172A" />
                    <Text style={styles.cardTitle}>QR Code Settings</Text>
                </View>
                {[
                    { title: 'Enable QR Check-in', checked: true },
                    { title: 'Require Email', checked: true },
                    { title: 'Require Phone', checked: false }
                ].map((setting, idx) => (
                    <View key={idx} style={styles.ruleItem}>
                        <Text style={styles.settingTitle}>{setting.title}</Text>
                        <View style={[styles.checkbox, setting.checked && styles.checkboxActive]}>
                            {setting.checked && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
                        </View>
                    </View>
                ))}

                <Pressable style={styles.downloadQrBtn}>
                    <MaterialCommunityIcons name="qrcode" size={18} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.downloadQrText}>Download QR Code</Text>
                </Pressable>
            </View>

            {/* Data & Privacy */}
            <View style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <MaterialCommunityIcons name="file-document-outline" size={20} color="#0F172A" />
                    <Text style={styles.cardTitle}>Data & Privacy</Text>
                </View>

                {/* Action Cards Grid */}
                <View style={styles.dataActionGrid}>
                    <View style={styles.dataActionCard}>
                        <MaterialCommunityIcons name="account-group-outline" size={24} color="#0F172A" />
                        <Text style={styles.dataActionTitle}>Export Visitors</Text>
                        <Pressable style={styles.dataActionBtn}>
                            <Text style={styles.dataActionBtnText}>Download CSV</Text>
                        </Pressable>
                    </View>
                    <View style={styles.dataActionCard}>
                        <MaterialCommunityIcons name="email-outline" size={24} color="#0F172A" />
                        <Text style={styles.dataActionTitle}>Email Templates</Text>
                        <Pressable style={styles.dataActionBtn}>
                            <Text style={styles.dataActionBtnText}>Customize</Text>
                        </Pressable>
                    </View>
                    <View style={styles.dataActionCard}>
                        <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="#0F172A" />
                        <Text style={styles.dataActionTitle}>Analytics</Text>
                        <Pressable style={styles.dataActionBtn}>
                            <Text style={styles.dataActionBtnText}>View Report</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.dangerZone}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.dangerTitle}>Danger Zone</Text>
                        <Text style={styles.dangerDesc}>Permanently delete this open house event and all associated data</Text>
                    </View>
                    <Pressable style={styles.deleteBtn}>
                        <Text style={styles.deleteBtnText}>Delete Event</Text>
                    </Pressable>
                </View>
            </View>

            {/* Footer Actions */}
            <View style={styles.footerActions}>
                <Pressable style={styles.cancelBtn}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                </Pressable>
            </View>
        </View>
    );

    const renderSellerReport = () => (
        <View style={styles.tabContent}>
            <View style={styles.card}>
                <Text style={[styles.cardTitle, { textAlign: 'center', fontSize: 20 }]}>SELLER PERFORMANCE REPORT</Text>
                <Text style={[styles.cardDescription, { textAlign: 'center', marginBottom: 24 }]}>123 BUSINESS WAY • LIVE STATS</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { fontSize: 24 }]}>{EVENT_DATA.visitors}</Text>
                        <Text style={styles.statLabel}>CURR. VISITORS</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { fontSize: 24 }]}>25%</Text>
                        <Text style={styles.statLabel}>HOT LEAD RATIO</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { fontSize: 24 }]}>9.5</Text>
                        <Text style={styles.statLabel}>AVG INTEREST</Text>
                    </View>
                </View>

                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.cardTitle, { fontSize: 14, marginBottom: 12 }]}>Market Sentiment Breakdown</Text>
                    <View style={styles.sentimentItem}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={styles.sentimentLabel}>High Price Concern</Text>
                            <Text style={styles.sentimentValue}>15%</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '15%' }]} />
                        </View>
                    </View>
                    <View style={styles.sentimentItem}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={styles.sentimentLabel}>Love the Kitchen Reno</Text>
                            <Text style={styles.sentimentValue}>65%</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '65%' }]} />
                        </View>
                    </View>
                </View>
            </View>

            {/* Seller Visibility Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Seller Visibility</Text>
                <Text style={styles.cardDescription}>Control what the seller sees in their dashboard.</Text>

                <View style={{ marginTop: 16 }}>
                    <Pressable
                        style={styles.visibilityRow}
                        onPress={() => setAnonymizeLeads(!anonymizeLeads)}
                    >
                        <Text style={styles.visibilityLabel}>Anonymize Leads</Text>
                        <View style={[styles.checkbox, anonymizeLeads && styles.checkboxActive]}>
                            {anonymizeLeads && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
                        </View>
                    </Pressable>

                    <Pressable
                        style={styles.visibilityRow}
                        onPress={() => setHideVisitorNames(!hideVisitorNames)}
                    >
                        <Text style={styles.visibilityLabel}>Hide Visitor Names</Text>
                        <View style={[styles.checkbox, hideVisitorNames && styles.checkboxActive]}>
                            {hideVisitorNames && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
                        </View>
                    </Pressable>
                </View>

                <Pressable style={styles.pushReportBtn}>
                    <Text style={styles.pushReportText}>Push Live Report to Seller</Text>
                </Pressable>
            </View>
        </View>
    )

    return (
        <LinearGradient
            colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={[styles.background, { paddingTop: insets.top }]}>

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
                </Pressable>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{EVENT_DATA.address}</Text>
                    <Text style={styles.headerSubtitle}>{EVENT_DATA.id}</Text>
                </View>

            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <ExternalLink href="https://zien.codesmile.in/check-in/OH-001/" asChild>
                    <Pressable style={styles.actionBtnOutline}>
                        <MaterialCommunityIcons name="open-in-new" size={16} color="#0B2D3E" style={{ marginRight: 6 }} />
                        <Text style={styles.actionBtnOutlineText}>Open Public Check-In</Text>
                    </Pressable>
                </ExternalLink>
                <Pressable style={styles.actionBtnSolid}>
                    <Text style={styles.actionBtnSolidText}>Generate Sheet</Text>
                </Pressable>
            </View>

            {/* Live Banner */}
            {isLiveMode && (
                <View style={styles.liveBanner}>
                    <View style={styles.liveIndicator}>
                        <Animated.View style={[styles.blinkingDot, { opacity: fadeAnim }]} />
                        <Text style={styles.liveText}>LIVE EVENT MODE ACTIVE</Text>
                    </View>
                    <Pressable style={styles.endEventBtn}>
                        <Text style={styles.endEventText}>End Event</Text>
                    </Pressable>
                </View>
            )}

            {/* Tabs */}
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsContainer}
                >
                    {TABS.map(tab => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            {activeTab === tab && <View style={styles.activeTabIndicator} />}
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {activeTab === 'Overview' && renderOverview()}
                {activeTab === 'Visitors' && renderVisitors()}
                {activeTab === 'Automation' && renderAutomation()}
                {activeTab === 'Settings' && renderSettings()}
                {activeTab === 'Seller Report' && renderSellerReport()}
            </ScrollView>

            <Modal
                visible={selectedVisitor != null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedVisitor(null)}>
                <Pressable style={styles.visitorModalBackdrop} onPress={() => setSelectedVisitor(null)}>
                    <Pressable style={styles.visitorModalCard} onPress={(e) => e.stopPropagation()}>
                        <Pressable style={styles.visitorModalClose} onPress={() => setSelectedVisitor(null)} hitSlop={12}>
                            <MaterialCommunityIcons name="close" size={24} color="#5B6B7A" />
                        </Pressable>
                        {selectedVisitor && (
                            <>
                                <View style={styles.visitorModalHeader}>
                                    <View style={styles.visitorModalAvatar}>
                                        <Text style={styles.visitorModalAvatarText}>
                                            {selectedVisitor.name.charAt(0)}
                                        </Text>
                                    </View>
                                    <View style={styles.visitorModalHeaderText}>
                                        <View style={styles.visitorModalNameRow}>
                                            <Text style={styles.visitorModalName}>{selectedVisitor.name}</Text>
                                            {selectedVisitor.signal === 'Hot' && (
                                                <View style={styles.visitorModalHotBadge}>
                                                    <MaterialCommunityIcons name="fire" size={12} color="#FFFFFF" />
                                                    <Text style={styles.visitorModalHotBadgeText}>HOT LEAD</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.visitorModalContact}>
                                            {selectedVisitor.email || 'email@example.com'} • {selectedVisitor.phone || '(555) 123-4567'}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.visitorModalSectionLabel}>VISITOR CONTEXT</Text>
                                <View style={styles.visitorModalContextRow}>
                                    <Text style={styles.visitorModalContextLabel}>Timeline</Text>
                                    <Text style={styles.visitorModalContextValue}>{selectedVisitor.timeline}</Text>
                                </View>
                                <View style={styles.visitorModalContextRow}>
                                    <Text style={styles.visitorModalContextLabel}>Pre-Approved</Text>
                                    <Text style={styles.visitorModalContextValue}>{selectedVisitor.preApproved}</Text>
                                </View>
                                <View style={styles.visitorModalContextRow}>
                                    <Text style={styles.visitorModalContextLabel}>Lead Score</Text>
                                    <Text style={styles.visitorModalContextScore}>85/100</Text>
                                </View>
                                <Text style={[styles.visitorModalSectionLabel, styles.visitorModalSectionLabelTop]}>SMART FOLLOW-UP</Text>
                                <Pressable style={styles.visitorModalBtnPrimary}>
                                    <Text style={styles.visitorModalBtnPrimaryText}>Send Investment Analysis</Text>
                                    <MaterialCommunityIcons name="star" size={18} color="#FFFFFF" />
                                </Pressable>
                                <Pressable style={styles.visitorModalBtnSecondary}>
                                    <Text style={styles.visitorModalBtnSecondaryText}>Schedule Private Showing</Text>
                                </Pressable>
                                <Pressable style={styles.visitorModalBtnSecondaryBlue}>
                                    <Text style={styles.visitorModalBtnSecondaryBlueText}>Send Similar Listings</Text>
                                </Pressable>
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>

        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    iconBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 20,
    },
    liveBanner: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 16,
        shadowColor: '#EF4444',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    blinkingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    liveText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    // Action Row Styles
    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 5,
        marginBottom: 16,
    },
    actionBtnOutline: {
        flex: .6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 12,
        borderRadius: 8,
    },
    actionBtnOutlineText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    actionBtnSolid: {
        flex: .4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        paddingVertical: 12,
        borderRadius: 8,
    },
    actionBtnSolidText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    endEventBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    endEventText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    tabsContainer: {
        paddingHorizontal: 16,
        gap: 24,
        paddingBottom: 12,
    },
    tabItem: {
        paddingBottom: 8,
        position: 'relative',
    },
    activeTabItem: {
        // borderBottomWidth: 2,
        // borderBottomColor: '#0F172A',
    },
    tabText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#0F172A',
        fontWeight: '800',
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#0F172A',
        borderRadius: 2,
    },
    tabContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        width: 60,
        height: 60,
        borderRadius: 12,
        marginBottom: 12,
    },
    qrText: {
        fontSize: 8,
        marginTop: 4,
        color: '#64748B',
        textAlign: 'center',
    },
    summaryContent: {
        gap: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    cardDescription: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
    },
    timeRow: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 8,
    },
    timeValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0F172A',
    },
    timeLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
        padding: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        marginHorizontal: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
    },
    statLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#64748B',
        marginTop: 4,
    },
    timelineList: {
        marginTop: 16,
        gap: 16,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timelineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#38BDF8',
    },
    timelineText: {
        color: '#E2E8F0',
        fontSize: 13,
        fontWeight: '500',
    },
    timelineTime: {
        color: '#94A3B8',
        fontSize: 11,
    },
    visitorCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    visitorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: 12,
    },
    visitorName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    actionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 6,
    },
    actionBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0F172A',
    },
    visitorDetailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    visitorDetailItem: {
        width: '45%',
    },
    detailLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 13,
        color: '#0F172A',
        fontWeight: '600',
    },
    signalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Automation Styles
    automationPreview: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    previewLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#64748B',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    previewBody: {
        fontSize: 12,
        color: '#475569',
        lineHeight: 18,
        marginBottom: 12,
    },
    attachmentsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    attachmentBox: {
        width: 24,
        height: 24,
        backgroundColor: '#CBD5E1',
        borderRadius: 4,
    },
    attachmentText: {
        fontSize: 11,
        color: '#94A3B8',
        fontStyle: 'italic',
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    ruleText: {
        fontSize: 13,
        color: '#0F172A',
        fontWeight: '500',
        flex: 1,
        marginRight: 12,
    },

    // Settings Styles
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 6,
    },
    inputBox: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 12,
        borderRadius: 8,
    },
    inputValue: {
        fontSize: 13,
        color: '#0F172A',
        fontWeight: '600',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    settingTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    settingDesc: {
        fontSize: 11,
        color: '#94A3B8',
    },

    // Seller Report
    sentimentItem: {
        marginBottom: 16,
    },
    sentimentLabel: {
        fontSize: 12,
        color: '#0F172A',
        fontWeight: '700',
    },
    sentimentValue: {
        fontSize: 12,
        color: '#0F172A',
        fontWeight: '800',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginTop: 6,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0F172A',
        borderRadius: 3,
    },
    // Modal Styles
    visitorModalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(11, 45, 62, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    visitorModalCard: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        paddingTop: 44,
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
    },
    visitorModalClose: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    visitorModalHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        gap: 14,
    },
    visitorModalAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0B2D3E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    visitorModalAvatarText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    visitorModalHeaderText: {
        flex: 1,
        minWidth: 0,
    },
    visitorModalNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 6,
    },
    visitorModalName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0B2D3E',
    },
    visitorModalHotBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#EF4444',
    },
    visitorModalHotBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    visitorModalContact: {
        fontSize: 13,
        fontWeight: '500',
        color: '#5B6B7A',
        lineHeight: 18,
    },
    visitorModalSectionLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    visitorModalSectionLabelTop: {
        marginTop: 18,
        marginBottom: 10,
    },
    visitorModalContextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    visitorModalContextLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#5B6B7A',
    },
    visitorModalContextValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    visitorModalContextScore: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0D9488',
    },
    visitorModalBtnPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#0B2D3E',
        marginBottom: 10,
    },
    visitorModalBtnPrimaryText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    visitorModalBtnSecondary: {
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        marginBottom: 10,
    },
    visitorModalBtnSecondaryText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    visitorModalBtnSecondaryBlue: {
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#0D9488',
        alignItems: 'center',
    },
    visitorModalBtnSecondaryBlueText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0D9488',
    },
    // Seller Visibility Styles
    visibilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    visibilityLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    pushReportBtn: {
        backgroundColor: '#0B2D3E',
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pushReportText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },

    // New Styles for Settings
    downloadQrBtn: {
        backgroundColor: '#0F172A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 16,
    },
    downloadQrText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    dataActionGrid: {
        flexDirection: 'row', // Make it scrollable or wrapped on small screens? The layout had 3 columns.
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    dataActionCard: {
        flex: 1, // Distribute space evenly
        minWidth: '28%', // Ensure they don't get too squished
        backgroundColor: '#FFFFFF', // Changed to white as per card standard or maybe slight grey
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowOffset: { width: 0, height: 2 },
    },
    dataActionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
    },
    dataActionBtn: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 4,
        width: '100%',
        alignItems: 'center',
    },
    dataActionBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0F172A',
    },
    dangerZone: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    dangerTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#DC2626',
        marginBottom: 4,
    },
    dangerDesc: {
        fontSize: 11,
        color: '#B91C1C',
        lineHeight: 16,
    },
    deleteBtn: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    deleteBtnText: {
        color: '#DC2626',
        fontSize: 12,
        fontWeight: '700',
    },
    footerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8,
        paddingHorizontal: 16, // Match other padding
    },
    cancelBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cancelBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    saveBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#0F172A',
        borderRadius: 8,
    },
    saveBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
