import { PageHeader } from '@/components/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VIDEO_SOURCE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [videoModalVisible, setVideoModalVisible] = useState(false);

    const { width } = Dimensions.get('window');
    const isLargeScreen = width > 768;

    const player = useVideoPlayer(VIDEO_SOURCE, (p) => {
        p.loop = true;
    });

    return (
        <LinearGradient
            colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={[styles.background, { paddingTop: insets.top }]}>

            <PageHeader
                title="Jessica Miller"
                subtitle="High Intensity Lead • Real Estate"
                onBack={() => router.back()}
                rightIcon="dots-vertical"
                onRightPress={() => { }}
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: 24 + insets.bottom }
                ]}
                showsVerticalScrollIndicator={false}>

                <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>

                    {/* Left Column (Main Content) */}
                    <View style={[styles.column, isLargeScreen && { flex: 1.6 }]}>

                        {/* 1. Profile Info Card */}
                        <View style={styles.card}>
                            <View style={styles.profileHeader}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>J</Text>
                                </View>
                                <View style={styles.profileInfo}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.name}>Jessica Miller</Text>
                                        <View style={styles.tagWrap}>
                                            <Text style={styles.tagText}>Hot LEAD</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.contactDetails}>jessica.m@gmail.com • (555) 123-4567</Text>
                                </View>
                            </View>

                            <View style={styles.metaBoxesRow}>
                                <View style={styles.metaBox}>
                                    <Text style={styles.metaLabel}>ATTRIBUTION</Text>
                                    <View style={styles.metaValueWrap}>
                                        <Text style={styles.metaValueTextSecondary}>
                                            <Text style={styles.metaValueTextPrimary}>Staging</Text> → Instagram Post → <Text style={styles.metaValueTextPrimary}>Lead</Text>
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.metaBox}>
                                    <Text style={styles.metaLabel}>BUDGET</Text>
                                    <Text style={styles.metaValueTitle}>$1.5M - $2.0M</Text>
                                </View>
                            </View>

                            <View style={styles.actionsRow}>
                                <Pressable style={styles.btnDark}>
                                    <Text style={styles.btnDarkText}>Send Email</Text>
                                </Pressable>
                                <Pressable style={styles.btnLight}>
                                    <Text style={styles.btnLightText}>Call Case</Text>
                                </Pressable>
                                <Pressable style={styles.btnLight}>
                                    <Text style={styles.btnLightText}>WhatsApp</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* 2. Automated YouTube Content Card */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Automated YouTube Content</Text>
                                <Pressable hitSlop={12} onPress={() => setVideoModalVisible(true)}>
                                    <Text style={styles.linkText}>Manage Video</Text>
                                </Pressable>
                            </View>

                            <View style={styles.videoWrap}>
                                <VideoView
                                    player={player}
                                    style={styles.videoPlayer}
                                    allowsFullscreen
                                    allowsPictureInPicture
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                                    style={styles.videoOverlay}
                                    pointerEvents="none">
                                    <Text style={styles.videoTitle}>Automated Walkthrough for Jessica Miller</Text>
                                </LinearGradient>
                            </View>
                        </View>

                        {/* 3. Activity Timeline Card */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Activity Timeline</Text>

                            <View style={styles.timelineList}>
                                <View style={styles.timelineItem}>
                                    <View style={styles.timelineIconWrap}>
                                        <MaterialCommunityIcons name="youtube" size={18} color="#0B2D3E" />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <View style={styles.timelineRow}>
                                            <Text style={styles.timelineAction}>Viewed YouTube Walkthrough</Text>
                                            <Text style={styles.timelineTime}>1 hour ago</Text>
                                        </View>
                                        <Text style={styles.timelineStatus}>Completed</Text>
                                    </View>
                                </View>

                                <View style={styles.timelineItem}>
                                    <View style={styles.timelineIconWrap}>
                                        <MaterialCommunityIcons name="email-outline" size={18} color="#0B2D3E" />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <View style={styles.timelineRow}>
                                            <Text style={styles.timelineAction}>Email Click: Floor Plan</Text>
                                            <Text style={styles.timelineTime}>3 hours ago</Text>
                                        </View>
                                        <Text style={styles.timelineStatus}>Clicked</Text>
                                    </View>
                                </View>

                                <View style={[styles.timelineItem, styles.timelineItemLast]}>
                                    <View style={styles.timelineIconWrap}>
                                        <MaterialCommunityIcons name="sync" size={18} color="#0B2D3E" />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <View style={styles.timelineRow}>
                                            <Text style={styles.timelineAction}>CRM Sync: Instagram UTM captured</Text>
                                            <Text style={styles.timelineTime}>Yesterday</Text>
                                        </View>
                                        <Text style={styles.timelineStatus}>Logged</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </View>

                    {/* Right Column (Sidebar) */}
                    <View style={[styles.column, isLargeScreen && { flex: 1 }]}>

                        {/* 4. AI Heat Index Card */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>AI Heat Index</Text>
                                <MaterialCommunityIcons name="fire" size={20} color="#5B6B7A" />
                            </View>

                            <View style={styles.heatNumberWrap}>
                                <Text style={styles.heatNumber}>94</Text>
                                <Text style={styles.heatMax}>/100</Text>
                            </View>
                            <Text style={styles.heatSubtitle}>DYNAMIC INTEREST SCORING ACTIVE</Text>

                            <View style={styles.heatList}>
                                <View style={styles.heatItem}>
                                    <Text style={styles.heatItemText}>Property View (Malibu Villa)</Text>
                                    <Text style={styles.heatItemScore}>+15</Text>
                                </View>
                                <View style={styles.heatItem}>
                                    <Text style={styles.heatItemText}>Email Open (Open House Kit)</Text>
                                    <Text style={styles.heatItemScore}>+5</Text>
                                </View>
                                <View style={styles.heatItem}>
                                    <Text style={styles.heatItemText}>Showing Attendance</Text>
                                    <Text style={styles.heatItemScore}>+25</Text>
                                </View>
                            </View>
                        </View>

                        {/* 5. Pipeline Status Card */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Pipeline Status</Text>

                            <View style={styles.pipelineBox}>
                                <Text style={styles.pipelineLabel}>CURRENT STAGE</Text>
                                <Text style={styles.pipelineValue}>Showing</Text>

                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: '40%' }]} />
                                </View>
                            </View>
                        </View>

                    </View>
                </View>
            </ScrollView>

            {/* Video Management Modal */}
            <Modal
                visible={videoModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setVideoModalVisible(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setVideoModalVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Video Management</Text>
                            <Pressable style={styles.modalCloseBtn} onPress={() => setVideoModalVisible(false)} hitSlop={12}>
                                <MaterialCommunityIcons name="close" size={16} color="#1E293B" />
                            </Pressable>
                        </View>

                        <View style={styles.templateBox}>
                            <Text style={styles.templateLabel}>Current Template</Text>
                            <Text style={styles.templateName}>Modern Luxury Walkthrough (v2)</Text>
                        </View>

                        <Pressable
                            style={styles.modalOutlineBtn}
                            onPress={() => {
                                setVideoModalVisible(false);
                                router.push('/(main)/crm/video-studio');
                            }}>
                            <Text style={styles.modalOutlineBtnText}>Regenerate Video</Text>
                        </Pressable>

                        <Pressable
                            style={styles.modalOutlineBtn}
                            onPress={() => {
                                setVideoModalVisible(false);
                                router.push('/(main)/crm/video-studio');
                            }}>
                            <Text style={styles.modalOutlineBtnText}>Change Music / Style</Text>
                        </Pressable>

                        <Pressable style={styles.modalSolidBtn}>
                            <Text style={styles.modalSolidBtnText}>Download MP4</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        gap: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E3ECF4',
    },
    headerCenter: { flex: 1 },
    title: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.2 },
    subtitle: { fontSize: 13, color: '#5B6B7A', fontWeight: '600', marginTop: 4 },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    grid: {
        flexDirection: 'column',
        gap: 16,
    },
    gridLarge: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    column: {
        flexDirection: 'column',
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E3ECF4',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0B2D3E',
        letterSpacing: -0.3,
    },
    linkText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#0BA0B2',
    },
    // Profile Top Card
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#0B2D3E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 4,
    },
    name: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0B2D3E',
        letterSpacing: -0.5,
    },
    tagWrap: {
        backgroundColor: '#FFF1F2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        color: '#F43F5E',
        fontWeight: '900',
        fontSize: 10,
        letterSpacing: 0.5,
    },
    contactDetails: {
        fontSize: 13,
        fontWeight: '600',
        color: '#5B6B7A',
    },
    metaBoxesRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    metaBox: {
        flex: 1,
        backgroundColor: '#F8FBFF',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E3ECF4',
    },
    metaLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    metaValueWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaValueTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0B2D3E',
    },
    metaValueTextSecondary: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5B6B7A',
    },
    metaValueTextPrimary: {
        color: '#0BA0B2',
        fontWeight: '800',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    btnDark: {
        backgroundColor: '#0B2D3E',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnDarkText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 13,
    },
    btnLight: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E3ECF4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnLightText: {
        color: '#0B2D3E',
        fontWeight: '700',
        fontSize: 13,
    },
    // Video Card
    videoWrap: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000000',
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-start', // Place gradient overlay subtly at the top to not interfere heavily with player controls but still allow text legibility
    },
    videoTitle: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    // Timeline Card
    timelineList: {
        marginTop: 16,
        paddingLeft: 4,
    },
    timelineItem: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    timelineItemLast: {
        marginBottom: 0,
    },
    timelineIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F4F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineContent: {
        flex: 1,
    },
    timelineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    timelineAction: {
        fontSize: 13,
        fontWeight: '800',
        color: '#0B2D3E',
        flex: 1,
        paddingRight: 10,
    },
    timelineTime: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    timelineStatus: {
        fontSize: 11,
        fontWeight: '800',
        color: '#0BA0B2',
    },
    // AI Heat Index Card
    heatNumberWrap: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    heatNumber: {
        fontSize: 48,
        fontWeight: '900',
        color: '#EA580C',
        letterSpacing: -1,
    },
    heatMax: {
        fontSize: 16,
        fontWeight: '800',
        color: '#9CA3AF',
        marginLeft: 2,
    },
    heatSubtitle: {
        fontSize: 10,
        fontWeight: '900',
        color: '#0BA0B2',
        letterSpacing: 0.5,
        marginBottom: 20,
    },
    heatList: {
        backgroundColor: '#F8FBFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E3ECF4',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    heatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    heatItemText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5B6B7A',
        flex: 1,
        paddingRight: 10,
    },
    heatItemScore: {
        fontSize: 13,
        fontWeight: '900',
        color: '#0BA0B2',
    },
    // Pipeline Status Card
    pipelineBox: {
        backgroundColor: '#0B2D3E',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    pipelineLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    pipelineValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0BA0B2',
        borderRadius: 2,
    },
    // Video Management Modal Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
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
        color: '#0B2D3E',
        letterSpacing: -0.2,
    },
    modalCloseBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    templateBox: {
        backgroundColor: '#F8FBFF',
        borderWidth: 1,
        borderColor: '#E3ECF4',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    templateLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 4,
    },
    templateName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },
    modalOutlineBtn: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F0F4F8',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    modalOutlineBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#0B2D3E',
    },
    modalSolidBtn: {
        borderRadius: 10,
        backgroundColor: '#0B2D3E',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    modalSolidBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});
