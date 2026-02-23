import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

function SearchBarComponent({
  placeholder = 'Ask Zien to find properties, create content, or manage leads...',
  value,
  onChangeText,
}: SearchBarProps) {
  const [isListening, setIsListening] = useState(false);
  const [partialText, setPartialText] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  // ── Pulse animation while recording ──────────────────────────────────────
  const startPulse = useCallback(() => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  // ── Voice event handlers ──────────────────────────────────────────────────
  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true);
      startPulse();
    };

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      const partial = e.value?.[0] ?? '';
      setPartialText(partial);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      const result = e.value?.[0] ?? '';
      if (result) {
        onChangeText?.(result);
      }
      setPartialText('');
      setIsListening(false);
      stopPulse();
    };

    Voice.onSpeechError = (_e: SpeechErrorEvent) => {
      setIsListening(false);
      setPartialText('');
      stopPulse();
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
      stopPulse();
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onChangeText, startPulse, stopPulse]);

  // ── Toggle mic ────────────────────────────────────────────────────────────
  const handleMicPress = useCallback(async () => {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
        stopPulse();
      } else {
        setPartialText('');
        await Voice.start('en-US');
      }
    } catch (e) {
      setIsListening(false);
      stopPulse();
    }
  }, [isListening, stopPulse]);

  const displayValue = isListening && partialText ? partialText : value;
  const displayPlaceholder = isListening ? 'Listening...' : placeholder;

  return (
    <View>
      <View style={[styles.card, isListening && styles.cardListening]}>
        <MaterialCommunityIcons name="plus" size={18} color={Theme.iconMuted} />
        <TextInput
          placeholder={displayPlaceholder}
          placeholderTextColor={isListening ? Theme.accentTeal : Theme.inputPlaceholder}
          style={[styles.input, isListening && styles.inputListening]}
          value={displayValue}
          onChangeText={onChangeText}
          multiline={false}
          returnKeyType="search"
          editable={!isListening}
        />

        {/* Mic button with pulse ring */}
        <Pressable onPress={handleMicPress} style={styles.micWrap} hitSlop={8}>
          <Animated.View
            style={[
              styles.micRing,
              isListening && styles.micRingActive,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <View style={[styles.micButton, isListening && styles.micButtonActive]}>
            <MaterialCommunityIcons
              name={isListening ? 'microphone' : 'microphone-outline'}
              size={18}
              color={isListening ? '#fff' : Theme.iconMuted}
            />
          </View>
        </Pressable>
      </View>

      {/* Listening indicator pill */}
      {isListening && (
        <View style={styles.listeningPill}>
          <View style={styles.listeningDot} />
          <Text style={styles.listeningText}>
            {partialText ? `"${partialText}"` : 'Speak now...'}
          </Text>
        </View>
      )}
    </View>
  );
}

export const SearchBar = memo(SearchBarComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    marginBottom: 6,
  },
  cardListening: {
    borderColor: Theme.accentTeal,
    borderWidth: 1.5,
    shadowColor: Theme.accentTeal,
    shadowOpacity: 0.14,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
    color: Theme.textPrimary,
    paddingVertical: 0,
  },
  inputListening: {
    color: Theme.accentTeal,
    fontWeight: '600',
  },

  // Mic
  micWrap: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micRing: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'transparent',
  },
  micRingActive: {
    backgroundColor: 'rgba(13,148,136,0.15)',
  },
  micButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Theme.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: Theme.accentTeal,
  },

  // Listening pill
  listeningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(13,148,136,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(13,148,136,0.18)',
  },
  listeningDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Theme.accentTeal,
  },
  listeningText: {
    flex: 1,
    fontSize: 13,
    color: Theme.accentTeal,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
