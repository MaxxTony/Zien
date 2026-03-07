import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExternalLink } from '../../../../components/external-link';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Overview', 'Visitors', 'Automation', 'Assets & Design', 'Settings', 'Seller Report'];

// Mock Data
const EVENT_DATA = {
    address: '123 Business Way, LA',
    id: 'OH-001',
    visitors: 12,
    hotLeads: 3,
    avgDwell: '8.2m',
    price: '$4,250,000',
    status: 'ACTIVE LISTING',
    description: 'Modern architectural masterpiece with floor-to-ceiling glass and panoramic canyon views.',
    beds: 5,
    baths: 6,
    sqft: '6.4k',
    scheduledDate: 'Jan 15, 2026',
    sessionTime: '1:00 PM - 4:00 PM',
    agent: {
        name: 'John Smith',
        title: 'Zien Estates | DRE# 094021',
        email: 'john@zienestates.com',
        phone: '(555) 094-0211'
    }
};

const TIMELINE_EVENTS = [
    { title: 'New Lead: Jessica Miller', time: '1:20 PM' },
    { title: 'Check-in: Robert Chen', time: '1:45 PM' },
    { title: 'Check-in: David Wilson', time: '2:10 PM' },
    { title: 'Email Follow-up Sent', time: 'Ongoing' },
];

const VISITORS_DATA = [
    { id: 1, name: 'Jessica Miller', signal: 'Hot', timeline: 'Immediate', preApproved: 'Yes', sync: 'CRM', phone: '(555) 123-4567', email: 'jessica@gmail.com' },
    { id: 2, name: 'Robert Chen', signal: 'Top 3', timeline: '3-6 Months', preApproved: 'Yes', sync: 'CRM', phone: '(555) 987-6543', email: 'robert.c@outlook.com' },
    { id: 3, name: 'David Wilson', signal: 'Warm', timeline: '6-12 Months', preApproved: 'No', sync: 'QUEUED', phone: '(555) 456-7890', email: 'david.w@company.com' },
    { id: 4, name: 'Sarah Connor', signal: 'Cold', timeline: 'Just Exploring', preApproved: 'No', sync: 'CRM', phone: '(555) 321-0987', email: 'sarah.c@terminator.com' },
];

const TOP_LEADS = [
    { id: 1, name: 'Jessica Miller', score: 98, avatar: 'JM' },
    { id: 2, name: 'Robert Chen', score: 94, avatar: 'RC' },
    { id: 5, name: 'Emily Blunt', score: 89, avatar: 'EB' },
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
    const [automationRules, setAutomationRules] = useState({
        tag: true,
        crm: true,
        alert: true,
        sms: false,
        dwell: true,
        ghost: true
    });
    const [activeSequence, setActiveSequence] = useState('Open House: Instant Digital Portfolio');
    const [showSequenceDropdown, setShowSequenceDropdown] = useState(false);

    const SEQUENCES = [
        'Open House: Instant Digital Portfolio',
        'Luxury Listing: VIP Walkthrough Nurture',
        'Drip: 7-Day Market Insights',
        'None (Manual Follow-up Only)'
    ];

    const [propertyPhotos, setPropertyPhotos] = useState([
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
    ]);
    const [showPickerOptions, setShowPickerOptions] = useState(false);

    const handleAddPhoto = async (type: 'camera' | 'library') => {
        setShowPickerOptions(false);

        const permissionResult = type === 'camera'
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert(`You need to allow ${type === 'camera' ? 'camera' : 'gallery'} permissions to add photos.`);
            return;
        }

        const result = type === 'camera'
            ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
            : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsMultipleSelection: true });

        if (!result.canceled) {
            const newPhotos = result.assets.map(asset => asset.uri);
            setPropertyPhotos([...propertyPhotos, ...newPhotos]);
        }
    };

    const triggerImagePicker = () => {
        setShowPickerOptions(true);
    };

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
        <View style={styles.tabContentPremium}>
            {/* Top Row: Property Card & Real-Time Timeline */}
            <View style={styles.overviewTopRow}>
                {/* Property Card */}
                <View style={styles.ovPropertyCard}>
                    <View style={styles.ovPropertyImageContainer}>
                        <Image
                            source="file:///Users/macbook/.gemini/antigravity/brain/2a5bd784-7535-43e5-ba0b-d8a9548397a0/modern_house_overview_1772521651338.png"
                            style={styles.ovPropertyImage}
                            contentFit="cover"
                        />
                        <View style={styles.featuredBadge}>
                            <Text style={styles.featuredBadgeText}>FEATURED</Text>
                        </View>
                    </View>
                    <View style={styles.ovPropertyDetails}>
                        <View style={styles.ovMainInfo}>
                            <Text style={styles.ovAddress}>{EVENT_DATA.address}</Text>
                            <View style={styles.ovStatusRow}>
                                <Text style={styles.ovPrice}>{EVENT_DATA.price}</Text>
                                <View style={styles.ovStatusBadge}>
                                    <Text style={styles.ovStatusText}>{EVENT_DATA.status}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.ovFeaturesGrid}>
                            <View style={styles.ovFeatureItem}>
                                <MaterialCommunityIcons name="bed-outline" size={24} color="#0D9488" />
                                <Text style={styles.ovFeatureVal}>{EVENT_DATA.beds}</Text>
                                <Text style={styles.ovFeatureLabel}>Beds</Text>
                            </View>
                            <View style={styles.ovFeatureItem}>
                                <MaterialCommunityIcons name="bathtub-outline" size={24} color="#0D9488" />
                                <Text style={styles.ovFeatureVal}>{EVENT_DATA.baths}</Text>
                                <Text style={styles.ovFeatureLabel}>Baths</Text>
                            </View>
                            <View style={styles.ovFeatureItem}>
                                <MaterialCommunityIcons name="selection" size={24} color="#0D9488" />
                                <Text style={styles.ovFeatureVal}>{EVENT_DATA.sqft}</Text>
                                <Text style={styles.ovFeatureLabel}>Sq Ft</Text>
                            </View>
                        </View>

                        <View style={styles.ovScheduleStrip}>
                            <View style={styles.ovScheduleItem}>
                                <MaterialCommunityIcons name="calendar-outline" size={20} color="#64748B" />
                                <Text style={styles.ovScheduleText}>{EVENT_DATA.scheduledDate}</Text>
                            </View>
                            <View style={styles.ovScheduleDivider} />
                            <View style={styles.ovScheduleItem}>
                                <MaterialCommunityIcons name="clock-outline" size={20} color="#64748B" />
                                <Text style={styles.ovScheduleText}>{EVENT_DATA.sessionTime}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Real-Time Timeline */}
                <View style={styles.ovTimelineCard}>
                    <Text style={styles.ovTimelineTitle}>Real-Time Timeline</Text>
                    <View style={styles.ovTimelineList}>
                        {TIMELINE_EVENTS.map((event, idx) => (
                            <View key={idx} style={styles.ovTimelineItem}>
                                <View style={styles.ovTimelineDot} />
                                <Text style={styles.ovTimelineText} numberOfLines={1}>{event.title}</Text>
                                <Text style={styles.ovTimelineTime}>{event.time}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Bottom Row: QR Check-in & Agent Card */}
            <View style={styles.overviewBottomRow}>
                {/* QR Check-in Card */}
                <View style={styles.ovQrCard}>
                    <View style={styles.ovQrBox}>
                        <QRCode
                            value="https://google.com"
                            size={70}
                            color="#FFFFFF"
                            backgroundColor="transparent"
                        />
                    </View>
                    <View style={styles.ovQrTextContent}>
                        <Text style={styles.ovQrTitle}>EVENT CHECK-IN</Text>
                        <Text style={styles.ovQrSub}>SCAN TO CAPTURE LEAD</Text>
                    </View>
                </View>

                {/* Agent Card */}
                <View style={styles.ovAgentCard}>
                    <Text style={styles.ovAgentSectionTitle}>Agent & Brokerage</Text>
                    <View style={styles.ovAgentMain}>
                        <Image
                            source="file:///Users/macbook/.gemini/antigravity/brain/2a5bd784-7535-43e5-ba0b-d8a9548397a0/agent_headshot_premium_zien_1772521795671.png"
                            style={styles.ovAgentAvatar}
                        />
                        <View style={{ flex: 1 }}>
                            <View style={styles.ovAgentNameRow}>
                                <Text style={styles.ovAgentName}>{EVENT_DATA.agent.name}</Text>
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
                                </View>
                            </View>
                            <Text style={styles.ovAgentTitle}>{EVENT_DATA.agent.title}</Text>
                        </View>
                    </View>
                    <View style={styles.ovAgentContact}>
                        <View style={styles.ovContactItem}>
                            <MaterialCommunityIcons name="email-outline" size={14} color="#64748B" />
                            <Text style={styles.ovContactText}>{EVENT_DATA.agent.email}</Text>
                        </View>
                        <View style={styles.ovContactItem}>
                            <MaterialCommunityIcons name="phone-outline" size={14} color="#64748B" />
                            <Text style={styles.ovContactText}>{EVENT_DATA.agent.phone}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderVisitors = () => (
        <View style={styles.tabContent}>
            {/* Premium Visitor List (No Horizontal Scroll) */}
            <View style={styles.visitorListContainer}>
                {VISITORS_DATA.map((visitor) => (
                    <View key={visitor.id} style={styles.visitorCardNew}>
                        {/* Top Section: Name & Details Button */}
                        <View style={styles.vCardTop}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.visitorNameText}>{visitor.name}</Text>
                                <Text style={styles.visitorEmailText} numberOfLines={1}>{visitor.email}</Text>
                            </View>
                            <Pressable style={styles.vDetailsBtn} onPress={() => setSelectedVisitor(visitor)}>
                                <Text style={styles.vDetailsBtnText}>Details</Text>
                            </Pressable>
                        </View>

                        <View style={styles.vCardDivider} />

                        {/* Bottom Section: Key Stats Badges */}
                        <View style={styles.vCardStatsRow}>
                            <View style={styles.vStatBadge}>
                                <MaterialCommunityIcons
                                    name={visitor.signal.toLowerCase() === 'hot' ? 'fire' :
                                        visitor.signal.toLowerCase() === 'top 3' ? 'trending-up' :
                                            visitor.signal.toLowerCase() === 'warm' ? 'water' : 'snowflake'}
                                    size={14}
                                    color="#1E293B"
                                />
                                <Text style={styles.vStatBadgeText}>{visitor.signal}</Text>
                            </View>

                            <View style={styles.vStatBadge}>
                                <MaterialCommunityIcons name="timeline-outline" size={14} color="#64748B" />
                                <Text style={[styles.vStatBadgeText, { color: '#64748B', fontWeight: '600' }]}>{visitor.timeline}</Text>
                            </View>

                            <View style={styles.vStatBadge}>
                                <Text style={[styles.vStatBadgeText, { fontSize: 9, color: '#94A3B8' }]}>PRE-APP:</Text>
                                <Text style={[styles.vStatBadgeText, { color: visitor.preApproved === 'Yes' ? '#0D9488' : '#64748B' }]}>
                                    {visitor.preApproved.toUpperCase()}
                                </Text>
                            </View>

                            <View style={{ marginLeft: 'auto' }}>
                                <View style={styles.vSyncBadge}>
                                    <MaterialCommunityIcons
                                        name={visitor.sync.toLowerCase() === 'crm' ? 'pulse' : 'clock-outline'}
                                        size={12}
                                        color="#0D9488"
                                    />
                                    <Text style={styles.vSyncBadgeText}>{visitor.sync}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderAutomation = () => (
        <View style={styles.tabContentPremium}>
            {/* Follow-Up Sequence Control */}
            <View style={styles.premiumCard}>
                <Text style={styles.premiumCardHeader}>Follow-Up Sequence Control</Text>

                <View style={styles.automationSelector}>
                    <Text style={styles.selectorLabel}>ACTIVE AUTOMATION SEQUENCE</Text>
                    <Pressable
                        style={styles.selectorBox}
                        onPress={() => setShowSequenceDropdown(!showSequenceDropdown)}
                    >
                        <Text style={styles.selectorValue}>{activeSequence}</Text>
                        <MaterialCommunityIcons
                            name={showSequenceDropdown ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#0B2D3E"
                        />
                    </Pressable>

                    {showSequenceDropdown && (
                        <View style={styles.dropdownMenu}>
                            {SEQUENCES.map((seq) => (
                                <Pressable
                                    key={seq}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setActiveSequence(seq);
                                        setShowSequenceDropdown(false);
                                    }}
                                >
                                    <View style={styles.dropdownItemContent}>
                                        {activeSequence === seq && (
                                            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        )}
                                        <Text style={[
                                            styles.dropdownItemText,
                                            activeSequence === seq && styles.dropdownItemTextActive
                                        ]}>
                                            {seq}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    <Text style={styles.selectorHint}>This sequence triggers automatically for every person who scans the QR code.</Text>
                </View>

                {/* Template Preview Box */}
                <View style={styles.templatePreviewBox}>
                    <View style={styles.templateHeader}>
                        <Text style={styles.templateHeaderText}>TEMPLATE PREVIEW</Text>
                        <Pressable>
                            <Text style={styles.editLink}>EDIT IN BUILDER</Text>
                        </Pressable>
                    </View>
                    <Text style={styles.templateTitle}>"Thank you for visiting {EVENT_DATA.address}!"</Text>
                    <Text style={styles.templateBody} numberOfLines={3}>
                        Hi {"{{first_name}}"}, it was great meeting you today. I've attached the property dossier including the virtual tour and local market report we discussed...
                    </Text>
                    <View style={styles.templateFooter}>
                        <View style={styles.footerIconGroup}>
                            <View style={styles.templateIconBox}>
                                <MaterialCommunityIcons name="file-document-outline" size={16} color="#64748B" />
                            </View>
                            <View style={styles.templateIconBox}>
                                <MaterialCommunityIcons name="lightning-bolt-outline" size={16} color="#64748B" />
                            </View>
                            <Text style={styles.attachmentTextSmall}>+3 attachments</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Event-Specific Rules */}
            <View style={styles.premiumCard}>
                <Text style={styles.premiumCardHeader}>Event-Specific Rules</Text>

                {[
                    { id: 'tag', title: "Apply 'Open House' Tag", icon: "account-tag-outline" },
                    { id: 'crm', title: "Sync to Zien CRM Instantly", icon: "chart-timeline-variant" },
                    { id: 'alert', title: "Mobile Alert for 'Hot' Leads", icon: "fire" },
                    { id: 'sms', title: "Send SMS Confirmation", icon: "message-outline" },
                    { id: 'dwell', title: "Auto-Notify Seller on Dwell > 5m", icon: "pulse" },
                ].map((rule) => (
                    <View key={rule.id} style={styles.premiumRuleItem}>
                        <View style={styles.ruleIconBox}>
                            <MaterialCommunityIcons name={rule.icon as any} size={18} color="#475569" />
                        </View>
                        <Text style={styles.premiumRuleText}>{rule.title}</Text>
                        <Switch
                            trackColor={{ false: "#E2E8F0", true: "#0B2D3E" }}
                            thumbColor={"#FFFFFF"}
                            ios_backgroundColor="#E2E8F0"
                            value={(automationRules as any)[rule.id]}
                            onValueChange={(val) => setAutomationRules(prev => ({ ...prev, [rule.id]: val }))}
                            style={Platform.OS === 'ios' ? {} : { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                        />
                    </View>
                ))}
            </View>

            {/* Ghost Protocol Re-Engagement */}
            <View style={[styles.premiumCard, styles.ghostProtocolCard]}>
                <View style={styles.ghostHeader}>
                    <View style={styles.ghostTitleRow}>
                        <View style={styles.ghostIconBox}>
                            <MaterialCommunityIcons name="lightning-bolt" size={18} color="#0D9488" />
                        </View>
                        <Text style={styles.ghostTitle}>Ghost Protocol Re-Engagement</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#E2E8F0", true: "#0D9488" }}
                        thumbColor={"#FFFFFF"}
                        ios_backgroundColor="#E2E8F0"
                        value={automationRules.ghost}
                        onValueChange={(val) => setAutomationRules(prev => ({ ...prev, ghost: val }))}
                        style={Platform.OS === 'ios' ? {} : { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                    />
                </View>
                <Text style={styles.ghostDesc}>
                    Automatically revive leads from this event if they go silent for more than 48 hours after the showing.
                </Text>
            </View>
        </View>
    );

    const renderAssetsAndDesign = () => (
        <View style={styles.tabContentPremium}>
            {/* Property Gallery */}
            <View style={styles.premiumCard}>
                <Text style={styles.premiumCardHeader}>Property Gallery</Text>
                <View style={styles.galleryGrid}>
                    {propertyPhotos.map((photo, idx) => (
                        <View key={idx} style={styles.galleryItem}>
                            <Image source={photo} style={styles.galleryImage} contentFit="cover" />
                            <Pressable
                                style={styles.deletePhotoBtn}
                                onPress={() => setPropertyPhotos(propertyPhotos.filter((_, i) => i !== idx))}
                            >
                                <MaterialCommunityIcons name="close" size={14} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    ))}
                    <Pressable
                        style={styles.addPhotoBox}
                        onPress={triggerImagePicker}
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="#0D9488" />
                        <Text style={styles.addPhotoText}>ADD PHOTO</Text>
                    </Pressable>
                </View>
            </View>

            {/* Property Specs */}
            <View style={styles.premiumCard}>
                <Text style={styles.premiumCardHeader}>Property Specs</Text>
                <View style={styles.specsContainer}>
                    {[
                        { label: 'Listing Price', value: EVENT_DATA.price, icon: 'currency-usd' },
                        { label: 'Square Footage', value: `${EVENT_DATA.sqft} sqft`, icon: 'square-edit-outline' },
                        { label: 'Bedrooms', value: `${EVENT_DATA.beds} Bedrooms`, icon: 'bed-outline' },
                        { label: 'Bathrooms', value: `${EVENT_DATA.baths} Bathrooms`, icon: 'bathtub-outline' },
                        { label: 'Lot Size', value: '0.45 Acres', icon: 'earth' },
                        { label: 'Year Built', value: '2025', icon: 'calendar-outline' },
                    ].map((spec, idx) => (
                        <View key={idx} style={styles.specRow}>
                            <View style={styles.specLabelGroup}>
                                <MaterialCommunityIcons name={spec.icon as any} size={18} color="#94A3B8" />
                                <Text style={styles.specLabel}>{spec.label}</Text>
                            </View>
                            <Text style={styles.specValue}>{spec.value}</Text>
                        </View>
                    ))}
                </View>

                {/* AI Description */}
                <View style={styles.aiDescriptionBox}>
                    <Text style={styles.aiDescriptionTitle}>AI DESCRIPTION SUMMARY</Text>
                    <Text style={styles.aiDescriptionText}>
                        "Architectural canyon-side estate featuring a floating glass staircase, smart-home automation, and an infinity pool overlooking LA."
                    </Text>
                </View>

                <Pressable style={styles.exportPdfBtn}>
                    <Text style={styles.exportPdfBtnText}>Export PDF Portfolio</Text>
                </Pressable>
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
                    <MaterialCommunityIcons name="arrow-left" size={22} color="#0D9488" />
                </Pressable>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerMainTitle} numberOfLines={1}>
                        <Text style={{ fontWeight: '500', color: '#64748B' }}>Back / </Text>
                        {EVENT_DATA.address} ({EVENT_DATA.id})
                    </Text>
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
                {activeTab === 'Assets & Design' && renderAssetsAndDesign()}
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

            {/* Photo Picker Bottom Sheet */}
            <Modal
                visible={showPickerOptions}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPickerOptions(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setShowPickerOptions(false)}>
                    <View style={styles.pickerModalContent}>
                        <View style={styles.pickerModalHeader}>
                            <View style={styles.pickerHandle} />
                            <Text style={styles.pickerModalTitle}>Add Property Photos</Text>
                        </View>

                        <View style={styles.pickerOptionsContainer}>
                            <Pressable style={styles.pickerOption} onPress={() => handleAddPhoto('camera')}>
                                <View style={styles.pickerIconWrap}>
                                    <MaterialCommunityIcons name="camera" size={24} color="#0B2D3E" />
                                </View>
                                <View style={styles.pickerOptionTextContainer}>
                                    <Text style={styles.pickerOptionText}>Take Photo</Text>
                                    <Text style={styles.pickerOptionSub}>Use camera to capture new photos</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
                            </Pressable>

                            <Pressable style={styles.pickerOption} onPress={() => handleAddPhoto('library')}>
                                <View style={styles.pickerIconWrap}>
                                    <MaterialCommunityIcons name="image-multiple" size={24} color="#0B2D3E" />
                                </View>
                                <View style={styles.pickerOptionTextContainer}>
                                    <Text style={styles.pickerOptionText}>Choose from Gallery</Text>
                                    <Text style={styles.pickerOptionSub}>Select existing photos from library</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
                            </Pressable>
                        </View>

                        <Pressable style={styles.pickerCancelBtn} onPress={() => setShowPickerOptions(false)}>
                            <Text style={styles.pickerCancelBtnText}>Cancel</Text>
                        </Pressable>
                    </View>
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
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerMainTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0B2D3E',
        letterSpacing: -0.2,
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
    pulseDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    bannerBoldText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 11,
        letterSpacing: 0.5,
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
        flex: .55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 14,
        borderRadius: 12,
    },
    actionBtnOutlineText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    actionBtnSolid: {
        flex: .45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        paddingVertical: 14,
        borderRadius: 12,
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
    // Premium Dashboard Styles
    contentLiveBanner: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    indicators: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    bannerBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    bannerBtnText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    qrHeroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    qrIconBox: {
        width: 80,
        height: 80,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrHeroInfo: {
        flex: 1,
    },
    qrHeroTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 4,
    },
    qrHeroSub: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 18,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    dashStatCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    dashStatValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0B2D3E',
    },
    dashStatLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#94A3B8',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    overviewLowerGrid: {
        gap: 16,
    },
    timelineCardDark: {
        backgroundColor: '#0B2D3E',
        borderRadius: 20,
        padding: 20,
    },
    timelineCardTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    overviewTimelineList: {
        gap: 14,
    },
    overviewTimelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timelineStatusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    overviewTimelineText: {
        flex: 1,
        fontSize: 13,
        color: '#E2E8F0',
        fontWeight: '500',
    },
    overviewTimelineTime: {
        fontSize: 11,
        color: '#94A3B8',
    },
    quickActionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    quickActionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    // Visitors Premium Styles
    sectionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0B2D3E',
        marginBottom: 12,
    },
    topLeadsSection: {
        marginBottom: 20,
    },
    topLeadsScroll: {
        gap: 12,
    },
    topLeadCard: {
        width: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
    },
    topLeadAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0B2D3E',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        position: 'relative',
    },
    topLeadAvatarText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    scoreBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#0D9488',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    scoreText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    topLeadName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0B2D3E',
        marginBottom: 2,
    },
    topLeadStatus: {
        fontSize: 9,
        fontWeight: '600',
        color: '#64748B',
    },
    searchBarBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchBarInput: {
        flex: 1,
        fontSize: 14,
        color: '#0B2D3E',
        fontWeight: '500',
    },
    visitorCardPremium: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
    },
    visitorRowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    visitorMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    initialsBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialsText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#64748B',
    },
    // --- Premium Visitor List Styles (Mobile Card) ---
    visitorListContainer: {
        gap: 16,
    },
    visitorCardNew: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#0B2D3E',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
    },
    vCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    visitorNameText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 2,
    },
    visitorEmailText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    vDetailsBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    vDetailsBtnText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#0B2D3E',
    },
    vCardDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 16,
    },
    vCardStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
    },
    vStatBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    vStatBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E293B',
    },
    vSyncBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E0F2F1',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    vSyncBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#0D9488',
        letterSpacing: 0.3,
    },
    // Premium Overview Styles
    tabContentPremium: {
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 16,
    },
    overviewTopRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    ovPropertyCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
        shadowColor: '#0B2D3E',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 5,
    },
    ovPropertyImageContainer: {
        width: '100%',
        height: 220,
        position: 'relative',
    },
    ovPropertyImage: {
        width: '100%',
        height: '100%',
    },
    featuredBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: '#0D9488',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    featuredBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
    },
    ovPropertyDetails: {
        padding: 20,
    },
    ovMainInfo: {
        marginBottom: 20,
    },
    ovAddress: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0B2D3E',
        lineHeight: 34,
        marginBottom: 10,
    },
    ovStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    ovPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#5B6B7A',
    },
    ovStatusBadge: {
        backgroundColor: '#E0F2F1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    ovStatusText: {
        color: '#0D9488',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
    ovFeaturesGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F7F9FC',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
    },
    ovFeatureItem: {
        alignItems: 'center',
        flex: 1,
    },
    ovFeatureVal: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0B2D3E',
        marginTop: 10,
    },
    ovFeatureLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        marginTop: 4,
    },
    ovScheduleStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    ovScheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    ovScheduleText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#5B6B7A',
    },
    ovScheduleDivider: {
        width: 1.5,
        height: 20,
        backgroundColor: '#E2E8F0',
    },
    ovTimelineCard: {
        flex: 1,
        minWidth: SCREEN_WIDTH > 600 ? 300 : '100%',
        backgroundColor: '#0B2D3E',
        borderRadius: 20,
        padding: 20,
    },
    ovTimelineTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    ovTimelineList: {
        gap: 16,
    },
    ovTimelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ovTimelineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    ovTimelineText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    ovTimelineTime: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94A3B8',
    },
    overviewBottomRow: {
        flexDirection: 'column',
        gap: 16,
    },
    ovQrCard: {
        width: '100%',
        backgroundColor: '#0B2D3E',
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    ovQrTextContent: {
        flex: 1,
    },
    ovQrBox: {
        // No margin needed in row layout
    },
    ovQrTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    ovQrSub: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        marginTop: 4,
        letterSpacing: 0.3,
    },
    ovAgentCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
    },
    ovAgentSectionTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 16,
    },
    ovAgentMain: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    ovAgentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    ovAgentNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    ovAgentName: {
        fontSize: 15,
        fontWeight: '900',
        color: '#0B2D3E',
    },
    verifiedBadge: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#7DD3FC',
    },
    verifiedBadgeText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#0D9488',
    },
    ovAgentTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0D9488',
    },
    ovAgentContact: {
        gap: 6,
    },
    ovContactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ovContactText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    // --- Premium Automation Styles ---
    premiumCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
        shadowColor: '#0B2D3E',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 4,
        marginBottom: 16,
    },
    premiumCardHeader: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 20,
    },
    automationSelector: {
        marginBottom: 24,
    },
    selectorLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    selectorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
    },
    selectorValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    selectorHint: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
        lineHeight: 18,
    },
    templatePreviewBox: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        borderRadius: 20,
        padding: 20,
    },
    templateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    templateHeaderText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#0B2D3E',
        letterSpacing: 0.8,
    },
    editLink: {
        fontSize: 11,
        fontWeight: '900',
        color: '#0D9488',
        letterSpacing: 0.5,
    },
    templateTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 8,
    },
    templateBody: {
        fontSize: 14,
        color: '#5B6B7A',
        lineHeight: 22,
        fontWeight: '500',
        marginBottom: 16,
    },
    templateFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerIconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    templateIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    attachmentTextSmall: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        marginLeft: 4,
    },
    premiumRuleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    ruleIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    premiumRuleText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    ghostProtocolCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#0D9488',
        backgroundColor: '#FFFFFF',
    },
    ghostHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    ghostTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    ghostIconBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#E0F2F1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    ghostTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0B2D3E',
        flex: 1,
    },
    ghostDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
        fontWeight: '500',
    },
    // Dropdown Styles
    dropdownMenu: {
        position: 'absolute',
        top: 85, // Adjust based on selector height
        left: 0,
        right: 0,
        backgroundColor: '#4B5563',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 10,
        zIndex: 9999,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    dropdownItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#E5E7EB', // Light grey text
        fontWeight: '500',
    },
    dropdownItemTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    // Assets & Design Styles
    galleryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    galleryItem: {
        width: (SCREEN_WIDTH - 80) / 2, // 2 column grid for better mobile view as per screenshot
        height: 160,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    addPhotoBox: {
        width: (SCREEN_WIDTH - 80) / 2,
        height: 160,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#0D9488',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(13, 148, 136, 0.03)',
    },
    addPhotoText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#0D9488',
        marginTop: 8,
        letterSpacing: 0.5,
    },
    deletePhotoBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(11, 45, 62, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Picker Modal (Bottom Sheet) Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(11, 45, 62, 0.4)',
        justifyContent: 'flex-end',
    },
    pickerModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 44 : 32,
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    pickerModalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    pickerHandle: {
        width: 36,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#E2E8F0',
        marginBottom: 16,
    },
    pickerModalTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0B2D3E',
        letterSpacing: -0.5,
    },
    pickerOptionsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    pickerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    pickerIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: '#0D9488',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    pickerOptionTextContainer: {
        flex: 1,
    },
    pickerOptionText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0B2D3E',
        marginBottom: 2,
    },
    pickerOptionSub: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    pickerCancelBtn: {
        backgroundColor: '#0B2D3E',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerCancelBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#fff',
    },
    specsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    specLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    specLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    specValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    aiDescriptionBox: {
        backgroundColor: '#F0F9FA',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
    },
    aiDescriptionTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: '#0D9488',
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    aiDescriptionText: {
        fontSize: 13,
        color: '#0B2D3E',
        lineHeight: 20,
        fontWeight: '500',
        fontStyle: 'italic',
    },
    exportPdfBtn: {
        backgroundColor: '#0B2D3E',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exportPdfBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
