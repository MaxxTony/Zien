import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 14;
const H_PADDING = 18;
// Card width for horizontal scroll: ~82% of screen so next card peeks
const SCROLL_CARD_WIDTH = Math.min(320, SCREEN_WIDTH * 0.82);
const MIN_BUTTON_HEIGHT = 48;

// Placeholder images for property cards
const PLACEHOLDER_HOUSE =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800';
const PLACEHOLDER_HOUSE_2 =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
const PLACEHOLDER_INTERIOR =
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800';

type OpenHouseEvent = {
  id: string;
  tag: string;
  address: string;
  dateTime: string;
  image: string;
  visitors: number;
  hotLeads: number;
  rating?: number; // only for completed
  isLive?: boolean;
};

const LIVE_EVENTS: OpenHouseEvent[] = [
  {
    id: 'oh-001',
    tag: 'OH-001',
    address: '123 Business Way, LA',
    dateTime: 'Today • 1:00 PM - 4:00 PM',
    image: PLACEHOLDER_HOUSE,
    visitors: 12,
    hotLeads: 3,
    isLive: true,
  },
];

const UPCOMING_EVENTS: OpenHouseEvent[] = [
  {
    id: 'oh-002',
    tag: 'OH-002',
    address: '88 Gold Coast, Malibu',
    dateTime: 'Jan 25, 2026 • 12:00 PM - 3:00 PM',
    image: PLACEHOLDER_HOUSE,
    visitors: 0,
    hotLeads: 0,
  },
  {
    id: 'oh-003',
    tag: 'OH-003',
    address: '900 Ocean Blvd, Santa Monica',
    dateTime: 'Feb 01, 2026 • 2:00 PM - 5:00 PM',
    image: PLACEHOLDER_HOUSE_2,
    visitors: 0,
    hotLeads: 0,
  },
];

const COMPLETED_EVENTS: OpenHouseEvent[] = [
  {
    id: 'oh-004',
    tag: 'OH-004',
    address: '45 Pine St, Pasadena',
    dateTime: 'Jan 12, 2026 • 2:00 PM - 5:00 PM',
    image: PLACEHOLDER_INTERIOR,
    visitors: 28,
    hotLeads: 9,
    rating: 4.8,
  },
];

function EventCard({
  event,
  variant,
  cardWidth,
  onManage,
}: {
  event: OpenHouseEvent;
  variant: 'live' | 'upcoming' | 'completed';
  cardWidth?: number;
  onManage: (event: OpenHouseEvent) => void;
}) {
  const isLive = variant === 'live';

  const cardStyle =
    variant === 'live'
      ? styles.eventCard
      : [styles.eventCard, styles.eventCardScroll, cardWidth ? { width: cardWidth } : {}];
  const imageWrapStyle =
    variant === 'live'
      ? styles.eventCardImageWrap
      : [styles.eventCardImageWrap, styles.eventCardImageWrapScroll];

  return (
    <View style={cardStyle}>
      <View style={imageWrapStyle}>
        <Image
          source={{ uri: event.image }}
          style={styles.eventCardImage}
          contentFit="cover"
        />
        <View style={[styles.eventTag, isLive ? styles.eventTagLive : styles.eventTagDefault]}>
          <Text style={styles.eventTagText}>{event.tag}</Text>
        </View>
      </View>
      <View style={styles.eventCardBody}>
        <Text style={styles.eventAddress} numberOfLines={2}>
          {event.address}
        </Text>
        <Text style={styles.eventDateTime}>{event.dateTime}</Text>
        <View style={styles.eventMetrics}>
          <View style={styles.eventMetric}>
            <MaterialCommunityIcons name="account-outline" size={16} color="#5B6B7A" />
            <Text style={styles.eventMetricValue}>{event.visitors}</Text>
            <Text style={styles.eventMetricLabel}>VISITORS</Text>
          </View>
          <View style={styles.eventMetric}>
            <MaterialCommunityIcons name="fire" size={16} color="#0D9488" />
            <Text style={[styles.eventMetricValue, styles.hotLeadsValue]}>{event.hotLeads}</Text>
            <Text style={styles.eventMetricLabel}>HOT LEADS</Text>
          </View>
          {variant === 'completed' && event.rating != null && (
            <View style={styles.eventMetric}>
              <MaterialCommunityIcons name="star" size={16} color="#EA580C" />
              <Text style={[styles.eventMetricValue, styles.ratingValue]}>
                {event.rating}/5
              </Text>
              <Text style={styles.eventMetricLabel}>RATING</Text>
            </View>
          )}
        </View>
        <View style={styles.eventCardActions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => onManage(event)}
            hitSlop={8}>
            <Text style={styles.primaryButtonText}>
              {isLive ? 'Manage Live' : 'View Details'}
            </Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} hitSlop={8}>
            <Text style={styles.secondaryButtonText}>Duplicate</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function OpenHouseScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCreateNewEvent = () => {
    router.push('/(main)/open-house/create');
  };

  const handleManageEvent = (event: OpenHouseEvent) => {
    router.push(`/open-house/${event.id}`);
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Open House Management</Text>
          <Text style={styles.subtitle}>
            Track live visitor engagement and measure conversion performance.
          </Text>
        </View>
      </View>

      {/* Performance stats — single refined card */}
      <View style={styles.statsWrap}>
        <View style={styles.performanceCard}>
          <View style={styles.performanceStat}>
            <View style={styles.performanceStatIconWrap}>
              <MaterialCommunityIcons name="account-group-outline" size={20} color="#0B2D3E" />
            </View>
            <View>
              <Text style={styles.performanceValue}>124</Text>
              <Text style={styles.performanceLabel}>Total leads</Text>
            </View>
          </View>
          <View style={styles.performanceDivider} />
          <View style={styles.performanceStat}>
            <View style={[styles.performanceStatIconWrap, styles.performanceStatIconHot]}>
              <MaterialCommunityIcons name="fire" size={20} color="#0D9488" />
            </View>
            <View>
              <Text style={[styles.performanceValue, styles.hotScoreValue]}>84%</Text>
              <Text style={styles.hotScoreLabel}>Hot score</Text>
            </View>
          </View>
        </View>
        <Pressable
          style={styles.createEventButton}
          onPress={handleCreateNewEvent}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}>
          <LinearGradient
            colors={['#0D9488', '#0B2D3E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createEventButtonGradient}>
            <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#FFFFFF" />
            <Text style={styles.createEventButtonText}>Create New Event</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Live Today */}
        {LIVE_EVENTS.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleLive}>Live Today</Text>
              <View style={styles.liveNowPill}>
                <Text style={styles.liveNowPillText}>LIVE NOW</Text>
              </View>
            </View>
            {LIVE_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} variant="live" onManage={handleManageEvent} />
            ))}
            <View style={styles.sectionSpacer} />
          </>
        )}

        {/* Upcoming — horizontal scroll for mobile */}
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
          style={styles.horizontalScroll}>
          {UPCOMING_EVENTS.map((event) => (
            <View key={event.id} style={styles.scrollCardWrap}>
              <EventCard event={event} variant="upcoming" cardWidth={SCROLL_CARD_WIDTH} onManage={handleManageEvent} />
            </View>
          ))}
        </ScrollView>
        <View style={styles.sectionSpacer} />

        {/* Completed — horizontal scroll for mobile */}
        <Text style={styles.sectionTitle}>Completed</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
          style={styles.horizontalScroll}>
          {COMPLETED_EVENTS.map((event) => (
            <View key={event.id} style={styles.scrollCardWrap}>
              <EventCard event={event} variant="completed" cardWidth={SCROLL_CARD_WIDTH} onManage={handleManageEvent} />
            </View>
          ))}
        </ScrollView>
        <View style={{ height: 24 }} />
      </ScrollView>
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
    paddingHorizontal: H_PADDING,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  headerCenter: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 2,
  },
  statsWrap: {
    paddingHorizontal: H_PADDING,
    marginBottom: 24,
    gap: 14,
  },
  performanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.8)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  performanceStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  performanceStatIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 45, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  performanceStatIconHot: {
    backgroundColor: 'rgba(13, 148, 136, 0.2)',
  },
  performanceDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(11, 45, 62, 0.1)',
    marginHorizontal: 4,
  },
  performanceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  performanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B6B7A',
    marginTop: 2,
  },
  hotScoreValue: {
    color: '#0D9488',
  },
  hotScoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
    marginTop: 2,
  },
  createEventButton: {
    borderRadius: 18,
    minHeight: 52,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  createEventButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  createEventButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitleLive: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.2,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  sectionSpacer: {
    height: 28,
  },
  liveNowPill: {
    backgroundColor: '#DC2626',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
        shadowColor: '#DC2626',
      },
    }),
  },
  liveNowPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  horizontalScroll: {
    marginHorizontal: -H_PADDING,
  },
  horizontalScrollContent: {
    paddingLeft: H_PADDING,
    paddingRight: H_PADDING + CARD_GAP,
    paddingBottom: 4,
  },
  scrollCardWrap: {
    marginRight: CARD_GAP,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.9)',
    overflow: 'hidden',
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  eventCardScroll: {
    marginBottom: 0,
  },
  eventCardImageWrap: {
    width: '100%',
    height: 182,
    position: 'relative',
  },
  eventCardImageWrapScroll: {
    height: 130,
  },
  eventCardImage: {
    width: '100%',
    height: '100%',
  },
  eventTag: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  eventTagLive: {
    backgroundColor: 'rgba(11, 45, 62, 0.85)',
  },
  eventTagDefault: {
    backgroundColor: '#059669',
  },
  eventTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  eventCardBody: {
    padding: 16,
  },
  eventAddress: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 5,
    lineHeight: 22,
  },
  eventDateTime: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginBottom: 14,
    lineHeight: 18,
  },
  eventMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 16,
  },
  eventMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventMetricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  hotLeadsValue: {
    color: '#0D9488',
  },
  ratingValue: {
    color: '#EA580C',
  },
  eventMetricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5B6B7A',
    letterSpacing: 0.3,
  },
  eventCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    minHeight: MIN_BUTTON_HEIGHT,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F7FAFE',
    borderRadius: 14,
    minHeight: MIN_BUTTON_HEIGHT,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4EAF2',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
});
