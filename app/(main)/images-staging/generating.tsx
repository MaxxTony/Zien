import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 24;
const IMAGE_HEIGHT = 320;

// Placeholder: staged bedroom image (in real app this would be the image being generated)
const GENERATING_IMAGE =
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800';

const REVEAL_DURATION = 3500;
const SCREEN_DURATION = 5500; // total time before going to next screen

export default function GeneratingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const coverProgress = useSharedValue(0); // 0 = cover in place, 1 = cover lifted off

  useEffect(() => {
    // Cover lifts up (translateY 0 -> -IMAGE_HEIGHT)
    coverProgress.value = withTiming(1, {
      duration: REVEAL_DURATION,
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/(main)/images-staging/generation-complete');
    }, SCREEN_DURATION);
    return () => clearTimeout(t);
  }, [router]);

  const coverStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -coverProgress.value * IMAGE_HEIGHT }],
  }));

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.center}>
        <View style={styles.card}>
          <View style={styles.imageWrap}>
            <Image
              source={{ uri: GENERATING_IMAGE }}
              style={styles.image}
              contentFit="cover"
            />
            {/* Cover that lifts up to reveal image */}
            <Animated.View style={[styles.cover, coverStyle]} />
            <View style={styles.overlayTextWrap} pointerEvents="none">
              <View style={styles.overlayPill}>
                <Text style={styles.overlayPillText}>NEURAL GENERATION IN PROGRESS</Text>
              </View>
              <Text style={styles.overlayText}>CONSTRUCTING VARIATIONS...</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: CARD_MARGIN,
  },
  card: {
    width: '100%',
    maxWidth: SCREEN_WIDTH - CARD_MARGIN * 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
    backgroundColor: '#E8F4F8',
  },
  overlayTextWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 14,
  },
  overlayPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.8,
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: 0.6,
  },
});
