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
      colors={['#F8FAFC', '#FFFFFF']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#0B2D3E" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{conversation.name}</Text>
            <Text style={styles.subtitle}>Channel: {conversation.channel}</Text>
          </View>
          <Pressable style={styles.profileButton}>
            <Text style={styles.profileButtonText}>View Profile</Text>
          </Pressable>
        </View>

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

        <View style={[styles.inputBar, { paddingBottom: Math.max(12, insets.bottom) }]}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Reply via WhatsApp..."
              placeholderTextColor="#9AA7B6"
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              multiline
            />
            <Pressable style={styles.sparkleButton}>
              <MaterialCommunityIcons name="creation" size={16} color="#0B2D3E" />
            </Pressable>
            <Pressable
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}>
              <Text style={styles.sendButtonText}>Send</Text>
            </Pressable>
          </View>
          <View style={styles.helperRow}>
            <Pressable style={styles.helperItem}>
              <MaterialCommunityIcons name="paperclip" size={14} color="#0BA0B2" />
              <Text style={styles.helperText}>Attach Property Kit</Text>
            </Pressable>
            <Pressable style={styles.helperItem}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={14} color="#0BA0B2" />
              <Text style={styles.helperText}>Schedule Showing</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF4',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F7FBFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  subtitle: {
    fontSize: 11.5,
    color: '#7B8794',
    marginTop: 2,
  },
  profileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
  },
  profileButtonText: {
    fontSize: 11.5,
    color: '#0B2D3E',
    fontWeight: '600',
  },
  chatContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 24,
    gap: 18,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
  },
  bubbleIncoming: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignSelf: 'flex-start',
  },
  bubbleOutgoing: {
    backgroundColor: '#0B2D3E',
    alignSelf: 'flex-end',
  },
  bubbleText: {
    fontSize: 13,
    color: '#0B2D3E',
    lineHeight: 18,
  },
  bubbleTextOutgoing: {
    color: '#FFFFFF',
  },
  bubbleTime: {
    marginTop: 8,
    fontSize: 10.5,
    color: '#9AA7B6',
    textAlign: 'right',
  },
  bubbleTimeOutgoing: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7FAFD',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#0B2D3E',
    maxHeight: 100,
  },
  sparkleButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2F6',
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#0B2D3E',
  },
  sendButtonDisabled: {
    backgroundColor: '#C5D0DB',
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helperRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 10,
  },
  helperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helperText: {
    fontSize: 11.5,
    color: '#0BA0B2',
    fontWeight: '600',
  },
});
