import { PageHeader } from '@/components/ui';
import { useAppTheme } from '@/context/ThemeContext';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  isOutgoing: boolean;
  time: string;
};

const conversationSeed = {
  name: 'Jessica Miller',
  channel: 'WhatsApp',
  messages: [
    {
      id: 'msg-1',
      text: 'Hey, is the open house still on for Sunday?',
      isOutgoing: false,
      time: '2m ago',
    },
    {
      id: 'msg-2',
      text: "Absolutely! Looking forward to seeing you there. I'll send you a calendar invite right now.",
      isOutgoing: true,
      time: 'Just now',
    },
  ] as Message[],
};

export default function InboxChatScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  // State for messages and input
  const [messages, setMessages] = useState<Message[]>(conversationSeed.messages);
  const [inputText, setInputText] = useState('');

  const conversation = useMemo(() => {
    if (typeof params.id === 'string') {
      const name = params.id
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return {
        ...conversationSeed,
        name,
      };
    }
    return conversationSeed;
  }, [params.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Function to send a message
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputText.trim(),
      isOutgoing: true,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PageHeader
          title={conversation.name}
          subtitle={`Online • ${conversation.channel}`}
          onBack={() => router.back()}
          rightIcon="account-circle-outline"
          onRightPress={() => router.push('/(main)/crm/profile')}
        />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[styles.bubble, message.isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming]}>
              <Text style={[styles.bubbleText, message.isOutgoing ? styles.bubbleTextOutgoing : null]}>
                {message.text}
              </Text>
              <Text style={[styles.bubbleTime, message.isOutgoing && styles.bubbleTimeOutgoing]}>
                {message.time}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <Pressable style={styles.attachmentButton}>
              <MaterialCommunityIcons name="plus" size={24} color={Theme.accentTeal} />
            </Pressable>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={`Reply via ${conversation.channel}...`}
                placeholderTextColor={Theme.inputPlaceholder}
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                multiline
              />
              <Pressable style={styles.aiAssistBtn}>
                <LinearGradient
                  colors={['#0BA0B2', '#1B5E9A']}
                  style={styles.aiAssistGradient}
                >
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#fff" />
                </LinearGradient>
              </Pressable>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                !inputText.trim() && styles.sendBtnDisabled,
                pressed && { opacity: 0.7 }
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}>
              <MaterialCommunityIcons
                name="send"
                size={20}
                color={inputText.trim() ? Theme.accentTeal : "#C5D0DB"}
              />
            </Pressable>
          </View>

          <View style={styles.actionsBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
              <Pressable style={styles.actionChip}>
                <MaterialCommunityIcons name="file-pdf-box" size={14} color={Theme.textSecondary} />
                <Text style={styles.actionChipText}>Send Brochure</Text>
              </Pressable>
              <Pressable style={styles.actionChip}>
                <MaterialCommunityIcons name="calendar-check" size={14} color={Theme.textSecondary} />
                <Text style={styles.actionChipText}>Book Viewing</Text>
              </Pressable>
              <Pressable style={styles.actionChip}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color={Theme.textSecondary} />
                <Text style={styles.actionChipText}>Share Location</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
  background: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  chatContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12, // Compact gap
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleIncoming: {
    backgroundColor: colors.cardBackground,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  bubbleOutgoing: {
    backgroundColor: colors.accentTeal,
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 14.5,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextOutgoing: {
    color: '#FFFFFF',
  },
  bubbleTime: {
    marginTop: 4,
    fontSize: 10,
    color: colors.inputPlaceholder,
    textAlign: 'right',
    fontWeight: '500',
  },
  bubbleTimeOutgoing: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // ── Input Section ──
  inputBar: {
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  attachmentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingVertical: 6,
  },
  aiAssistBtn: {
    marginLeft: 8,
  },
  aiAssistGradient: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  actionsBar: {
    marginTop: 10,
    paddingBottom: 4,
  },
  actionsScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});
}
