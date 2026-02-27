import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Voice, {
    SpeechErrorEvent,
    SpeechResultsEvent,
} from '@react-native-voice/voice';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const { height } = Dimensions.get('window');

type ChatMessage = {
    id: string;
    text: string;
    isUser: boolean;
    isTyping?: boolean;
};

// ──────────────────────────────────────────────────────
// Typewriter effect for AI responses
// ──────────────────────────────────────────────────────
const TypewriterText = memo(({
    fullText,
    onComplete,
    onType,
}: {
    fullText: string;
    onComplete: () => void;
    onType: () => void;
}) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex++;
                if (currentIndex % 3 === 0) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onType();
                }
            } else {
                clearInterval(interval);
                onComplete();
            }
        }, 20);
        return () => clearInterval(interval);
    }, [fullText, onComplete, onType]);

    return <Text style={styles.aiMessageText}>{displayedText}</Text>;
});

// ──────────────────────────────────────────────────────
// Suggestion chips shown on empty state
// ──────────────────────────────────────────────────────
const SUGGESTIONS = [
    { icon: 'home-search-outline', label: 'Find listings near me' },
    { icon: 'account-group-outline', label: 'Summarize my leads' },
    { icon: 'chart-line', label: 'Show pipeline stats' },
    { icon: 'email-fast-outline', label: 'Draft outreach email' },
];

// ──────────────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────────────
export default function ChatModalScreen() {
    const router = useRouter();

    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [showVoiceUI, setShowVoiceUI] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceText, setVoiceText] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const ringScaleAnim = useRef(new Animated.Value(1)).current;

    // ── Pulse animation for voice ──────────────────────
    const startPulse = useCallback(() => {
        pulseLoop.current = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.45, duration: 700, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            ])
        );
        pulseLoop.current.start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(ringScaleAnim, { toValue: 1.8, duration: 900, useNativeDriver: true }),
                Animated.timing(ringScaleAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, [pulseAnim, ringScaleAnim]);

    const stopPulse = useCallback(() => {
        pulseLoop.current?.stop();
        pulseAnim.setValue(1);
        ringScaleAnim.setValue(1);
    }, [pulseAnim, ringScaleAnim]);

    // ── Voice event handlers ───────────────────────────
    useEffect(() => {
        Voice.onSpeechStart = () => { setIsListening(true); startPulse(); };
        Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => setVoiceText(e.value?.[0] ?? '');
        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
            setVoiceText(e.value?.[0] ?? '');
            setIsListening(false);
            stopPulse();
        };
        Voice.onSpeechError = (_e: SpeechErrorEvent) => { setIsListening(false); stopPulse(); };
        Voice.onSpeechEnd = () => { setIsListening(false); stopPulse(); };
        return () => { Voice.destroy().then(Voice.removeAllListeners); };
    }, [startPulse, stopPulse]);

    const handleStartVoice = useCallback(async () => {
        setShowVoiceUI(true);
        setVoiceText('');
        try { await Voice.start('en-US'); }
        catch (e) { setShowVoiceUI(false); }
    }, []);

    const handleCancelVoice = useCallback(async () => {
        try { if (isListening) await Voice.stop(); } catch (e) { }
        setShowVoiceUI(false);
        setIsListening(false);
        setVoiceText('');
        stopPulse();
    }, [isListening, stopPulse]);

    const handleAcceptVoice = useCallback(async () => {
        try { if (isListening) await Voice.stop(); } catch (e) { }
        const finalizedText = voiceText.trim();
        if (finalizedText) {
            setInputText(inputText ? `${inputText} ${finalizedText}` : finalizedText);
        }
        setShowVoiceUI(false);
        setIsListening(false);
        setVoiceText('');
        stopPulse();
    }, [isListening, voiceText, inputText, stopPulse]);

    const handleSubmit = useCallback((overrideText?: string) => {
        const text = (overrideText ?? inputText).trim();
        if (!text || isAiTyping) return;

        const timestamp = Date.now().toString();
        const userMsg: ChatMessage = { id: `u-${timestamp}`, text, isUser: true };
        const aiResponseText = `I've analyzed your request for "${text}". I've identified 3 potential listing matches and optimized your CRM filters to target higher-intent leads. Would you like me to draft the outreach email now?`;
        const aiMsg: ChatMessage = { id: `ai-${timestamp}`, text: aiResponseText, isUser: false, isTyping: true };

        setMessages((prev) => [...prev, userMsg, aiMsg]);
        setInputText('');
        setIsAiTyping(true);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, [inputText, isAiTyping]);

    const handleClear = useCallback(() => {
        setMessages([]);
        setIsAiTyping(false);
    }, []);

    // ── Message renderer ───────────────────────────────
    const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
        if (item.isUser) {
            return (
                <View style={styles.userRow}>
                    <LinearGradient
                        colors={['#0D2F45', '#0B2D3E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.userBubble}
                    >
                        <Text style={styles.userMessageText}>{item.text}</Text>
                    </LinearGradient>
                </View>
            );
        }

        return (
            <View style={styles.aiRow}>
                {/* AI avatar */}
                <LinearGradient
                    colors={['#0BA0B2', '#1B5E9A']}
                    style={styles.aiAvatar}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <MaterialCommunityIcons name="star-four-points" size={13} color="#fff" />
                </LinearGradient>

                <View style={styles.aiBubble}>
                    {/* AI label */}
                    <Text style={styles.aiLabel}>Zien Intelligence</Text>
                    {item.isTyping ? (
                        <TypewriterText
                            fullText={item.text}
                            onComplete={() => {
                                setIsAiTyping(false);
                                setMessages(prev =>
                                    prev.map(m => m.id === item.id ? { ...m, isTyping: false } : m)
                                );
                            }}
                            onType={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        />
                    ) : (
                        <Text style={styles.aiMessageText}>{item.text}</Text>
                    )}
                </View>
            </View>
        );
    };

    const hasMessages = messages.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            {/* Extra top breathing room */}
            <View style={{ height: 10 }} />

            {/* ── Header ── */}
            <View style={styles.header}>
                {/* LEFT: AI badge + title/subtitle only */}
                <View style={styles.headerLeft}>
                    <LinearGradient
                        colors={['#0BA0B2', '#1B5E9A']}
                        style={styles.headerAiDot}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <MaterialCommunityIcons name="star-four-points" size={14} color="#fff" />
                    </LinearGradient>
                    <View>
                        <Text style={styles.headerTitle}>Zien Intelligence</Text>
                        <Text style={styles.headerSub}>
                            {isAiTyping ? 'Thinking…' : 'Online · Ready'}
                        </Text>
                    </View>
                </View>

                {/* RIGHT: Clear icon (when messages) + Close */}
                <View style={styles.headerRight}>
                    {hasMessages && (
                        <Pressable
                            onPress={handleClear}
                            style={({ pressed }) => [styles.headerIconBtn, pressed && { opacity: 0.7 }]}
                            hitSlop={8}
                        >
                            <MaterialCommunityIcons name="refresh" size={16} color={Theme.textSecondary} />
                        </Pressable>
                    )}
                    <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
                    >
                        <MaterialCommunityIcons name="close" size={18} color={Theme.textPrimary} />
                    </Pressable>
                </View>
            </View>

            {/* Thin header divider */}
            <View style={styles.headerDivider} />

            {/* ── Body ── */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
            >
                <View style={styles.body}>

                    {/* Empty state */}
                    {!hasMessages ? (
                        <View style={styles.emptyState}>

                            <Text style={styles.emptyTitle}>How can I help you today?</Text>
                            <Text style={styles.emptySubtitle}>Ask me anything about your pipeline, leads, listings, or content.</Text>

                            {/* Suggestion chips */}
                            <View style={styles.suggestions}>
                                {SUGGESTIONS.map((s) => (
                                    <Pressable
                                        key={s.label}
                                        style={({ pressed }) => [styles.suggestionChip, pressed && { opacity: 0.7 }]}
                                        onPress={() => handleSubmit(s.label)}
                                    >
                                        <MaterialCommunityIcons name={s.icon as any} size={14} color={Theme.accentTeal} />
                                        <Text style={styles.suggestionText}>{s.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderMessage}
                            contentContainerStyle={styles.chatList}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    {/* ── Input Bar ── */}
                    <View style={[
                        styles.inputBar,
                        inputFocused && styles.inputBarFocused,
                        showVoiceUI && styles.inputBarListening,
                    ]}>

                        {showVoiceUI ? (
                            /* ── Voice Mode ── */
                            <>
                                {/* Animated mic ring */}
                                <View style={styles.voiceMicContainer}>
                                    <Animated.View style={[styles.voiceRing, { transform: [{ scale: ringScaleAnim }] }]} />
                                    <Animated.View style={[styles.voiceDot, { transform: [{ scale: pulseAnim }] }]} />
                                </View>

                                <View style={styles.voiceMiddle}>
                                    <Text
                                        style={[styles.voiceText, !voiceText && styles.voiceTextPlaceholder]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {voiceText || (isListening ? 'Listening…' : 'Tap accept to use')}
                                    </Text>
                                </View>

                                <View style={styles.voiceControls}>
                                    <Pressable onPress={handleCancelVoice} style={styles.voiceCancelBtn} hitSlop={8}>
                                        <MaterialCommunityIcons name="close" size={16} color={Theme.textSecondary} />
                                    </Pressable>
                                    <Pressable onPress={handleAcceptVoice} style={styles.voiceAcceptBtn} hitSlop={8}>
                                        <MaterialCommunityIcons name="check" size={18} color="#fff" />
                                    </Pressable>
                                </View>
                            </>
                        ) : (
                            /* ── Text Mode ── */
                            <>
                                <TextInput
                                    placeholder={isAiTyping ? 'Zien is thinking…' : 'Ask Zien to find properties, create content, or manage leads...'}
                                    placeholderTextColor={Theme.inputPlaceholder}
                                    style={styles.input}
                                    value={isAiTyping ? '' : inputText}
                                    onChangeText={(t) => { if (!isAiTyping) setInputText(t); }}
                                    multiline={false}
                                    returnKeyType="send"
                                    onSubmitEditing={() => handleSubmit()}
                                    editable={!isAiTyping}
                                    onFocus={() => setInputFocused(true)}
                                    onBlur={() => setInputFocused(false)}
                                />

                                {/* Right action: mic or send */}
                                {inputText.trim().length > 0 && !isAiTyping ? (
                                    <Pressable
                                        onPress={() => handleSubmit()}
                                        style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.8 }]}
                                        hitSlop={8}
                                    >
                                        <LinearGradient
                                            colors={['#0BA0B2', '#1B5E9A']}
                                            style={styles.sendBtnGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <MaterialCommunityIcons name="arrow-up" size={18} color="#fff" />
                                        </LinearGradient>
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={handleStartVoice}
                                        style={({ pressed }) => [styles.micBtn, pressed && { opacity: 0.8 }, isAiTyping && { opacity: 0.4 }]}
                                        hitSlop={8}
                                        disabled={isAiTyping}
                                    >
                                        <MaterialCommunityIcons name="microphone-outline" size={19} color={Theme.textSecondary} />
                                    </Pressable>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ──────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB',
    },

    // ── Header ────────────────────────────────────────
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerAiDot: {
        width: 38,
        height: 38,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0BA0B2',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    headerTitle: {
        fontSize: 15.5,
        fontWeight: '800',
        color: Theme.textPrimary,
        letterSpacing: 0.1,
    },
    headerSub: {
        fontSize: 11.5,
        fontWeight: '600',
        color: Theme.accentTeal,
        marginTop: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Theme.cardBorder,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    headerIconBtn: {
        width: 34,
        height: 34,
        borderRadius: 11,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Theme.cardBorder,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    headerBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: Theme.textSecondary,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Theme.cardBorder,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    headerDivider: {
        height: 1,
        backgroundColor: 'rgba(228,234,242,0.9)',
        marginHorizontal: 18,
    },

    // ── Body ──────────────────────────────────────────
    body: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 16 : 24,
        justifyContent: 'space-between',
    },

    // ── Empty State ───────────────────────────────────
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: height * 0.06,
    },
    heroWrap: {
        width: 96,
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    heroGlowOuter: {
        position: 'absolute',
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(11,160,178,0.1)',
    },
    heroGlowInner: {
        position: 'absolute',
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(11,160,178,0.15)',
    },
    heroIcon: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0BA0B2',
        shadowOpacity: 0.45,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Theme.textPrimary,
        letterSpacing: -0.2,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 13.5,
        color: Theme.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 280,
        marginBottom: 28,
    },
    suggestions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        maxWidth: 340,
    },
    suggestionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: `${Theme.accentTeal}30`,
        shadowColor: '#0A2F48',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
    },
    suggestionText: {
        fontSize: 12.5,
        fontWeight: '700',
        color: Theme.textPrimary,
    },

    // ── Chat List ────────────────────────────────────
    chatList: {
        paddingVertical: 18,
        gap: 18,
    },

    // User message
    userRow: {
        alignItems: 'flex-end',
    },
    userBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderBottomRightRadius: 6,
        maxWidth: '82%',
        shadowColor: '#0B2D3E',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        elevation: 4,
    },
    userMessageText: {
        color: '#FFFFFF',
        fontSize: 14.5,
        fontWeight: '500',
        lineHeight: 21,
    },

    // AI message
    aiRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        maxWidth: '92%',
    },
    aiAvatar: {
        width: 30,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        shadowColor: '#0BA0B2',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        flexShrink: 0,
    },
    aiBubble: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderTopLeftRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#0A2F48',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(228,234,242,0.9)',
    },
    aiLabel: {
        fontSize: 11.5,
        fontWeight: '800',
        color: Theme.accentTeal,
        letterSpacing: 0.3,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    aiMessageText: {
        color: Theme.textPrimary,
        fontSize: 14.5,
        lineHeight: 22,
        fontWeight: '400',
    },

    // ── Input Bar ────────────────────────────────────
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: Theme.cardBorder,
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginTop: 10,
        minHeight: 56,
        shadowColor: '#0A2F48',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
    },
    inputBarFocused: {
        borderColor: `${Theme.accentTeal}60`,
        shadowColor: Theme.accentTeal,
        shadowOpacity: 0.1,
        shadowRadius: 16,
    },
    inputBarListening: {
        borderColor: Theme.accentTeal,
        backgroundColor: `${Theme.accentTeal}06`,
    },
    input: {
        flex: 1,
        fontSize: 14.5,
        color: Theme.textPrimary,
        paddingVertical: 0,
        minHeight: 24,
        fontWeight: '400',
    },
    sendBtn: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    sendBtnGradient: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0BA0B2',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    micBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: Theme.surfaceIcon,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Theme.cardBorder,
    },

    // ── Voice UI ─────────────────────────────────────
    voiceMicContainer: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    voiceRing: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: `${Theme.accentTeal}40`,
    },
    voiceDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#EF4444',
    },
    voiceMiddle: {
        flex: 1,
        paddingRight: 4,
    },
    voiceText: {
        fontSize: 14.5,
        color: Theme.textPrimary,
        fontWeight: '500',
    },
    voiceTextPlaceholder: {
        fontStyle: 'italic',
        color: Theme.accentTeal,
    },
    voiceControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    voiceCancelBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: Theme.surfaceIcon,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Theme.cardBorder,
    },
    voiceAcceptBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: Theme.accentTeal,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Theme.accentTeal,
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
});
