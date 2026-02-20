import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STYLES = ['Modern Luxury', 'Minimalist Tour', 'Fast Paced'];
const VIDEO_SOURCE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

export default function VideoStudioScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const { width } = Dimensions.get('window');
    const isLargeScreen = width > 768;

    const player = useVideoPlayer(VIDEO_SOURCE, (p) => {
        p.loop = true;
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
                </Pressable>
                <View style={styles.headerCenter}>
                    <Text style={styles.title}>Automated Video Studio</Text>
                    <Text style={styles.subtitle}>
                        Customize AI-generated content for <Text style={styles.boldText}>C-001</Text>.
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <Pressable style={styles.btnOutline}>
                        <MaterialCommunityIcons name="magic-staff" size={16} color="#0B2D3E" style={{ marginRight: 6 }} />
                        <Text style={styles.btnOutlineText}>Regenerate Preview</Text>
                    </Pressable>
                    <Pressable style={styles.btnSolid}>
                        <MaterialCommunityIcons name="download" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.btnSolidText}>Export MP4</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>

                    {/* Video App View (Left) */}
                    <View style={[styles.videoContainer, isLargeScreen && { flex: 2.2 }]}>
                        <VideoView
                            player={player}
                            style={styles.videoPlayer}
                            allowsFullscreen
                            allowsPictureInPicture
                        />
                    </View>

                    {/* Customization Sidebar (Right) */}
                    <View style={[styles.sidebar, isLargeScreen && { flex: 1 }]}>
                        <Text style={styles.sidebarTitle}>Customization</Text>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialCommunityIcons name="view-dashboard-outline" size={18} color="#0B2D3E" />
                                <Text style={styles.sectionTitle}>Video Style / Template</Text>
                            </View>

                            <View style={styles.optionsList}>
                                {STYLES.map((styleName, idx) => {
                                    const isSelected = idx === 0;
                                    return (
                                        <Pressable
                                            key={styleName}
                                            style={[
                                                styles.optionBox,
                                                isSelected && styles.optionBoxSelected
                                            ]}>
                                            <Text style={[
                                                styles.optionText,
                                                isSelected && styles.optionTextSelected
                                            ]}>
                                                {styleName}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialCommunityIcons name="music-note-outline" size={18} color="#0B2D3E" />
                                <Text style={styles.sectionTitle}>Background Music</Text>
                            </View>

                            <Pressable style={styles.dropdownBox}>
                                <Text style={styles.dropdownText}>Upbeat Corporate</Text>
                                <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                            </Pressable>
                        </View>

                        <View style={styles.tipBox}>
                            <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#5B6B7A" style={{ marginTop: 2, marginRight: 8 }} />
                            <Text style={styles.tipText}>
                                <Text style={styles.tipTextBold}>Pro Tip: </Text>
                                Changing templates will regenerate the scene transitions automatically.
                            </Text>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Setting clean white background mimicking screenshot
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        flexWrap: 'wrap',
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
    headerCenter: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0B2D3E',
        letterSpacing: -0.2
    },
    subtitle: {
        fontSize: 13,
        color: '#5B6B7A',
        fontWeight: '600',
        marginTop: 4
    },
    boldText: {
        fontWeight: '900',
        color: '#0B2D3E',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    btnOutline: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E3ECF4',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    btnOutlineText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    btnSolid: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0B2D3E',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    btnSolidText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    grid: {
        flexDirection: 'column',
        gap: 24,
    },
    gridLarge: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    // Left side
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000000',
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
    },
    // Right side
    sidebar: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E3ECF4',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 24,
        elevation: 8,
    },
    sidebarTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 24,
        letterSpacing: -0.3,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0B2D3E',
    },
    optionsList: {
        gap: 10,
    },
    optionBox: {
        borderWidth: 1,
        borderColor: '#E3ECF4',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    optionBoxSelected: {
        borderColor: '#0BA0B2',
        backgroundColor: '#F0FDFA', // Super faint teal/cyan
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5B6B7A',
    },
    optionTextSelected: {
        color: '#0B2D3E',
        fontWeight: '800',
    },
    dropdownBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E3ECF4',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    dropdownText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0B2D3E',
    },
    tipBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F8FBFF',
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
    },
    tipText: {
        flex: 1,
        fontSize: 13,
        color: '#5B6B7A',
        lineHeight: 20,
        fontWeight: '500',
    },
    tipTextBold: {
        fontWeight: '800',
        color: '#0B2D3E',
    },
});
