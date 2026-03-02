import { PageHeader } from '@/components/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    // Notes State
    const [notes, setNotes] = useState([
        { id: '1', text: 'Very interested in modern kitchen and gym space.', date: 'Jan 25, 2026' },
        { id: '2', text: 'Sent the YouTube walkthrough. She confirmed interest.', date: 'Jan 26, 2026' },
    ]);
    const [newNote, setNewNote] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);

    const handleSaveNote = () => {
        if (newNote.trim()) {
            const date = new Date();
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const noteObj = {
                id: Date.now().toString(),
                text: newNote.trim(),
                date: formattedDate
            };

            setNotes([noteObj, ...notes]);
            setNewNote('');
            setIsAddingNote(false);
        }
    };

    return (
        <LinearGradient
            colors={['#F8FAFC', '#F1F5F9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.background, { paddingTop: insets.top }]}>

            <PageHeader
                title="Jessica Miller"
                onBack={() => router.back()}
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: 24 + insets.bottom }
                ]}
                showsVerticalScrollIndicator={false}>

                <View style={styles.contentGrid}>
                    {/* 1. Profile Info Card */}
                    <View style={styles.premiumCard}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarWrap}>
                                <Text style={styles.avatarText}>J</Text>
                            </View>
                            <View style={styles.profileDetails}>
                                <View style={styles.nameBadgeRow}>
                                    <Text style={styles.profileName}>Jessica Miller</Text>
                                    <View style={styles.buyerBadge}>
                                        <Text style={styles.buyerBadgeText}>BUYER</Text>
                                    </View>
                                </View>
                                <Text style={styles.profileContact}>jessica.m@gmail.com • (555) 123-4567</Text>

                                <View style={styles.actionButtonsRow}>
                                    <Pressable
                                        style={styles.actionBtnLight}
                                        onPress={() => Linking.openURL('mailto:jessica.m@gmail.com')}>
                                        <Text style={styles.actionBtnLightText}>Email</Text>
                                    </Pressable>
                                    <Pressable
                                        style={styles.actionBtnLight}
                                        onPress={() => Linking.openURL('tel:+15551234567')}>
                                        <Text style={styles.actionBtnLightText}>Call</Text>
                                    </Pressable>
                                    <Pressable
                                        style={styles.actionBtnLight}
                                        onPress={() => Linking.openURL('https://wa.me/15551234567')}>
                                        <Text style={styles.actionBtnLightText}>WhatsApp</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 2. AI Heat Index Card */}
                    <View style={styles.premiumCard}>
                        <View style={styles.aiHeatHeader}>
                            <Text style={styles.aiHeatTitle}>AI Heat Index</Text>
                            <MaterialCommunityIcons name="fire" size={24} color="#F97316" />
                        </View>
                        <View style={styles.heatScoreContainer}>
                            <View style={styles.heatScoreWrap}>
                                <Text style={styles.heatScoreValue}>94</Text>
                                <Text style={styles.heatScoreMax}>/100</Text>
                            </View>
                            <Text style={styles.heatStatusText}>DYNAMIC SCORING ACTIVE</Text>
                        </View>
                        <View style={styles.heatBreakdown}>
                            <View style={styles.heatItem}>
                                <Text style={styles.heatItemLabel}>Property View (Malibu Villa)</Text>
                                <Text style={styles.heatItemAction}>+15</Text>
                            </View>
                            <View style={styles.heatItem}>
                                <Text style={styles.heatItemLabel}>Email Open (Open House Kit)</Text>
                                <Text style={styles.heatItemAction}>+5</Text>
                            </View>
                            <View style={styles.heatItem}>
                                <Text style={styles.heatItemLabel}>Showing Attendance</Text>
                                <Text style={styles.heatItemAction}>+25</Text>
                            </View>
                        </View>
                    </View>

                    {/* 3. Pipeline Stage Card */}
                    <View style={styles.pipelineCard}>
                        <Text style={styles.pipelineTitleSmall}>CURRENT PIPELINE STAGE</Text>
                        <Text style={styles.pipelineStageName}>Showing</Text>
                        <View style={styles.pipelineProgressContainer}>
                            <View style={[styles.pipelineProgressFill, { width: '75%' }]} />
                        </View>
                    </View>

                    {/* 4. Internal Notes Card */}
                    <View style={styles.premiumCard}>
                        <View style={styles.notesHeaderRow}>
                            <Text style={styles.sectionTitle}>Internal Notes</Text>
                            {!isAddingNote && (
                                <Pressable
                                    style={styles.headerAddBtn}
                                    onPress={() => setIsAddingNote(true)}>
                                    <MaterialCommunityIcons name="plus" size={18} color="#0BA0B2" />
                                    <Text style={styles.headerAddBtnText}>Add Note</Text>
                                </Pressable>
                            )}
                        </View>

                        {/* Inline Note Input */}
                        {isAddingNote && (
                            <View style={styles.inlineNoteContainer}>
                                <View style={styles.noteInputWrapper}>
                                    <TextInput
                                        style={styles.inlineNoteInput}
                                        placeholder="Type your notes here..."
                                        placeholderTextColor="#94A3B8"
                                        multiline
                                        autoFocus
                                        value={newNote}
                                        onChangeText={setNewNote}
                                    />
                                    <View style={styles.inputIconOverlay}>
                                        <View style={styles.aiIconBadge}>
                                            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#0BA0B2" />
                                            <MaterialCommunityIcons name="google" size={14} color="#0B213E" />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.inlineNoteActions}>
                                    <Pressable onPress={() => {
                                        setNewNote('');
                                        setIsAddingNote(false);
                                    }}>
                                        <Text style={styles.cancelNoteText}>Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.saveInlineBtn, !newNote.trim() && styles.saveInlineBtnDisabled]}
                                        onPress={handleSaveNote}
                                        disabled={!newNote.trim()}>
                                        <Text style={styles.saveInlineBtnText}>Save Note</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}

                        <View style={styles.notesList}>
                            {notes.map((note) => (
                                <View key={note.id} style={styles.noteCard}>
                                    <View style={styles.noteHeader}>
                                        <Text style={styles.noteLabel}>NOTE</Text>
                                        <Text style={styles.noteDate}>{note.date}</Text>
                                    </View>
                                    <Text style={styles.noteContent}>{note.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* 5. Activity Timeline Card */}
                    <View style={styles.premiumCard}>
                        <Text style={styles.sectionTitle}>Activity Timeline</Text>
                        <View style={styles.timelineContainer}>
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineIconBg}>
                                    <MaterialCommunityIcons name="play-circle" size={20} color="#0B213E" />
                                </View>
                                <View style={styles.timelineBody}>
                                    <Text style={styles.timelineTitle}>Viewed YouTube Walkthrough</Text>
                                    <View style={styles.timelineMeta}>
                                        <Text style={[styles.statusText, { color: '#0BA0B2' }]}>Completed</Text>
                                        <Text style={styles.metaDivider}>•</Text>
                                        <Text style={styles.timeText}>1 hour ago</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.timelineItem}>
                                <View style={styles.timelineIconBg}>
                                    <MaterialCommunityIcons name="email" size={20} color="#0B213E" />
                                </View>
                                <View style={styles.timelineBody}>
                                    <Text style={styles.timelineTitle}>Email Click: Floor Plan</Text>
                                    <View style={styles.timelineMeta}>
                                        <Text style={[styles.statusText, { color: '#F59E0B' }]}>Clicked</Text>
                                        <Text style={styles.metaDivider}>•</Text>
                                        <Text style={styles.timeText}>3 hours ago</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.timelineItemLast}>
                                <View style={styles.timelineIconBg}>
                                    <MaterialCommunityIcons name="sync" size={20} color="#0B213E" />
                                </View>
                                <View style={styles.timelineBody}>
                                    <Text style={styles.timelineTitle}>CRM Sync: Instagram captured</Text>
                                    <View style={styles.timelineMeta}>
                                        <Text style={[styles.statusText, { color: '#64748B' }]}>Logged</Text>
                                        <Text style={styles.metaDivider}>•</Text>
                                        <Text style={styles.timeText}>Yesterday</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16 },
    contentGrid: { gap: 16 },

    premiumCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },

    // Header Content
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    avatarWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0B213E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    profileDetails: { flex: 1 },
    nameBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0B213E',
        letterSpacing: -0.5,
    },
    buyerBadge: {
        backgroundColor: '#EBFDFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    buyerBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#0BA0B2',
        letterSpacing: 0.5,
    },
    profileContact: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 16,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    actionBtnDark: {
        backgroundColor: '#0B213E',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    actionBtnDarkText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    actionBtnLight: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#0BA0B2',
    },
    actionBtnLightText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#0BA0B2',
    },

    // AI Heat Index
    aiHeatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    aiHeatTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0B213E',
        letterSpacing: -0.5,
    },
    heatScoreContainer: {
        marginBottom: 20,
    },
    heatScoreWrap: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    heatScoreValue: {
        fontSize: 42,
        fontWeight: '900',
        color: '#F97316',
        letterSpacing: -1,
    },
    heatScoreMax: {
        fontSize: 16,
        fontWeight: '700',
        color: '#94A3B8',
    },
    heatStatusText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#0BA0B2',
        letterSpacing: 0.8,
        marginTop: 4,
    },
    heatBreakdown: {
        gap: 12,
    },
    heatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    heatItemLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#5B6B7A',
    },
    heatItemAction: {
        fontSize: 14,
        fontWeight: '900',
        color: '#0BA0B2',
    },

    // Pipeline Card
    pipelineCard: {
        backgroundColor: '#0B213E',
        borderRadius: 10,
        padding: 24,
    },
    pipelineTitleSmall: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 8,
    },
    pipelineStageName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    pipelineProgressContainer: {
        height: 4,
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderRadius: 2,
    },
    pipelineProgressFill: {
        height: '100%',
        backgroundColor: '#0BA0B2',
        borderRadius: 2,
    },

    // Section Titles
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0B213E',
        letterSpacing: -0.5,
    },
    notesHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EBFDFF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    headerAddBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#0BA0B2',
    },

    // Internal Notes
    inlineNoteContainer: {
        borderWidth: 1.5,
        borderColor: '#0BA0B2',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
    },
    noteInputWrapper: {
        minHeight: 120,
        position: 'relative',
    },
    inlineNoteInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        textAlignVertical: 'top',
        lineHeight: 22,
    },
    inputIconOverlay: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    aiIconBadge: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 6,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inlineNoteActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
        marginTop: 12,
    },
    cancelNoteText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    saveInlineBtn: {
        backgroundColor: '#0B213E',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: '#0B213E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    saveInlineBtnDisabled: {
        opacity: 0.5,
        shadowOpacity: 0,
    },
    saveInlineBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    notesList: { gap: 12 },
    noteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    noteLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    noteDate: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
    },
    noteContent: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        lineHeight: 20,
    },

    // Activity Timeline
    timelineContainer: {
        marginTop: 8,
    },
    timelineItem: {
        flexDirection: 'row',
        gap: 16,
        paddingBottom: 24,
    },
    timelineItemLast: {
        flexDirection: 'row',
        gap: 16,
    },
    timelineIconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    timelineBody: {
        flex: 1,
        justifyContent: 'center',
    },
    timelineTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#0B213E',
        marginBottom: 4,
    },
    timelineMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
    },
    metaDivider: {
        fontSize: 12,
        color: '#CBD5E1',
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
    },
});
