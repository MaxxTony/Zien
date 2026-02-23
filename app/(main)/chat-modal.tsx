import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Voice, {
    SpeechErrorEvent,
    SpeechResultsEvent,
} from '@react-native-voice/voice';
import * as Haptics from 'expo-haptics';
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

const TypewriterText = memo(({
    fullText,
    onComplete,
    onType
}: {
    fullText: string,
    onComplete: () => void,
    onType: () => void
}) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex++;
                if (currentIndex % 3 === 0) { // scroll slightly less often
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onType();
                }
            } else {
                clearInterval(interval);
                onComplete();
            }
            // Faster typing speed (20ms instead of a higher default)
        }, 20);

        return () => clearInterval(interval);
    }, [fullText, onComplete, onType]);

    return <Text style={styles.aiMessageText}>{displayedText}</Text>;
});

export default function ChatModalScreen() {
    const router = useRouter();

    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [showVoiceUI, setShowVoiceUI] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceText, setVoiceText] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const startPulse = useCallback(() => {
        pulseLoop.current = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.4, duration: 600, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ])
        );
        pulseLoop.current.start();
    }, [pulseAnim]);

    const stopPulse = useCallback(() => {
        pulseLoop.current?.stop();
        pulseAnim.setValue(1);
    }, [pulseAnim]);

    useEffect(() => {
        Voice.onSpeechStart = () => {
            setIsListening(true);
            startPulse();
        };

        Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
            const partial = e.value?.[0] ?? '';
            setVoiceText(partial);
        };

        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
            const result = e.value?.[0] ?? '';
            setVoiceText(result);
            setIsListening(false);
            stopPulse();
        };

        Voice.onSpeechError = (_e: SpeechErrorEvent) => {
            setIsListening(false);
            stopPulse();
        };

        Voice.onSpeechEnd = () => {
            setIsListening(false);
            stopPulse();
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, [startPulse, stopPulse]);

    const handleStartVoice = useCallback(async () => {
        setShowVoiceUI(true);
        setVoiceText('');
        try {
            await Voice.start('en-US');
        } catch (e) {
            setShowVoiceUI(false);
        }
    }, []);

    const handleCancelVoice = useCallback(async () => {
        try {
            if (isListening) await Voice.stop();
        } catch (e) { }
        setShowVoiceUI(false);
        setIsListening(false);
        setVoiceText('');
        stopPulse();
    }, [isListening, stopPulse]);

    const handleAcceptVoice = useCallback(async () => {
        try {
            if (isListening) await Voice.stop();
        } catch (e) { }

        const finalizedText = voiceText.trim();
        if (finalizedText) {
            const newValue = inputText ? `${inputText} ${finalizedText}` : finalizedText;
            setInputText(newValue);
        }

        setShowVoiceUI(false);
        setIsListening(false);
        setVoiceText('');
        stopPulse();
    }, [isListening, voiceText, inputText, stopPulse]);

    const handleSubmit = useCallback(() => {
        const text = inputText.trim();
        if (!text || isAiTyping) return;

        const timestamp = Date.now().toString();
        const userMsg: ChatMessage = { id: `u-${timestamp}`, text, isUser: true };

        const aiResponseText = `I've analyzed your request for "${text}". I've identified 3 potential listing matches and optimized your CRM filters to target higher-intent leads. Would you like me to draft the outreach email now?`;
        const aiMsg: ChatMessage = { id: `ai-${timestamp}`, text: aiResponseText, isUser: false, isTyping: true };

        setMessages((prev) => [...prev, userMsg, aiMsg]);
        setInputText('');
        setIsAiTyping(true);

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [inputText, isAiTyping]);

    const handleClear = useCallback(() => {
        setMessages([]);
        setIsAiTyping(false);
    }, []);

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        if (item.isUser) {
            return (
                <View style={styles.userMessageWrap}>
                    <Text style={styles.userMessageText}>{item.text}</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.aiMessageWrap}>
                    <View style={styles.aiIconWrap}>
                        <MaterialCommunityIcons name="star-four-points" size={14} color="#fff" />
                    </View>
                    {item.isTyping ? (
                        <TypewriterText
                            fullText={item.text}
                            onComplete={() => {
                                setIsAiTyping(false);
                                setMessages(prev => prev.map(m => m.id === item.id ? { ...m, isTyping: false } : m));
                            }}
                            onType={() => {
                                flatListRef.current?.scrollToEnd({ animated: false });
                            }}
                        />
                    ) : (
                        <Text style={styles.aiMessageText}>{item.text}</Text>
                    )}
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {messages.length > 0 ? (
                    <View style={styles.headerContent}>
                        <Pressable onPress={handleClear} style={styles.clearBtn} hitSlop={8}>
                            <MaterialCommunityIcons name="refresh" size={14} color={Theme.textSecondary} />
                            <Text style={styles.clearText}>Clear</Text>
                        </Pressable>
                        <Text style={styles.headerTitle}>Intelligence Stream</Text>

                        <Pressable onPress={() => router.back()} style={styles.closeActionBtn} hitSlop={8}>
                            <MaterialCommunityIcons name="close" size={14} color="#FFFFFF" />
                            <Text style={styles.closeActionText}>Close</Text>
                        </Pressable>



                    </View>
                ) : (
                    <View style={styles.headerEmpty}>
                        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.closeBtn}>
                            <MaterialCommunityIcons name="close" size={24} color={Theme.textSecondary} />
                        </Pressable>
                    </View>
                )}
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
            >
                <View style={styles.content}>
                    {messages.length === 0 ? (
                        <View style={styles.centerStage}>
                            <MaterialCommunityIcons name="robot-outline" size={48} color={Theme.accentTeal} />
                            <Text style={styles.centerText}>Ready to process your intelligence request.</Text>
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

                    {/* Bottom Input Area */}
                    <View style={[styles.inputContainer, showVoiceUI && styles.inputContainerListening]}>
                        <MaterialCommunityIcons name="robot-outline" size={18} color={Theme.accentTeal} style={{ opacity: 0.8 }} />

                        {showVoiceUI ? (
                            <>
                                <View style={styles.voiceMiddleContainer}>
                                    {isListening && (
                                        <Animated.View style={[styles.redDot, { transform: [{ scale: pulseAnim }] }]} />
                                    )}
                                    <Text
                                        style={[styles.voiceText, !voiceText && styles.voiceTextPlaceholder]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {voiceText || (isListening ? 'Listening...' : 'Tap accept to use text')}
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
                            <>
                                <TextInput
                                    placeholder={isAiTyping ? "Zien is typing..." : "Ask a follow up..."}
                                    placeholderTextColor={Theme.inputPlaceholder}
                                    style={styles.input}
                                    value={isAiTyping ? '' : inputText}
                                    onChangeText={(t) => {
                                        if (!isAiTyping) setInputText(t);
                                    }}
                                    multiline={false}
                                    returnKeyType="send"
                                    onSubmitEditing={handleSubmit}
                                    editable={!isAiTyping}
                                    autoFocus
                                />

                                {(inputText.trim().length > 0 && !isAiTyping) ? (
                                    <Pressable
                                        onPress={handleSubmit}
                                        style={styles.submitWrap}
                                        hitSlop={8}
                                    >
                                        <View style={styles.submitButton}>
                                            <MaterialCommunityIcons name="arrow-up" size={18} color="#fff" />
                                        </View>
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={handleStartVoice}
                                        style={[styles.micWrap, isAiTyping && { opacity: 0.5 }]}
                                        hitSlop={8}
                                        disabled={isAiTyping}
                                    >
                                        <View style={styles.micButton}>
                                            <MaterialCommunityIcons name="microphone-outline" size={18} color={Theme.iconMuted} />
                                        </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerEmpty: {
        alignItems: 'flex-end',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0B2D3E',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Theme.cardBorder,
    },
    clearText: {
        fontSize: 12,
        fontWeight: '700',
        color: Theme.textSecondary,
    },
    closeActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#EF4444',
    },
    closeActionText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    closeBtnSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 30,
        justifyContent: 'space-between',
    },
    centerStage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: height * 0.1,
    },
    centerText: {
        marginTop: 16,
        fontSize: 15,
        fontWeight: '600',
        color: Theme.textSecondary,
    },

    // Chat List
    chatList: {
        paddingVertical: 20,
        gap: 16,
    },
    userMessageWrap: {
        alignSelf: 'flex-end',
        backgroundColor: '#0B2D3E', // Dark pill
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        maxWidth: '85%',
    },
    userMessageText: {
        color: '#FFFFFF',
        fontSize: 14.5,
        lineHeight: 20,
    },
    aiMessageWrap: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        maxWidth: '90%',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        borderWidth: 1,
        borderColor: Theme.cardBorder,
        gap: 12,
    },
    aiIconWrap: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: Theme.accentTeal,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    aiMessageText: {
        flex: 1,
        color: Theme.textPrimary,
        fontSize: 14.5,
        lineHeight: 22,
    },

    // Input Container
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: 'rgba(13,148,136,0.3)', // Teal tinted border
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: Theme.accentTeal,
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        minHeight: 56,
        marginTop: 10,
    },
    inputContainerListening: {
        borderColor: Theme.accentTeal,
        backgroundColor: 'rgba(13,148,136,0.02)',
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: Theme.textPrimary,
        paddingVertical: 0,
        minHeight: 24,
    },

    // Normal Mic & Submit
    micWrap: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    micButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.04)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitWrap: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    submitButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: Theme.accentBlue,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Voice UI
    voiceMiddleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingRight: 4,
    },
    redDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    voiceText: {
        flex: 1,
        fontSize: 15,
        color: Theme.textPrimary,
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
        borderRadius: 17,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    voiceAcceptBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: Theme.accentTeal,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
