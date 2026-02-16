import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 20;

const LIVE_EVENTS = [
  {
    id: 'oh-001',
    tag: 'OH-001',
    address: '123 Business Way, LA',
    date: 'Today',
    time: '1:00 PM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    visitors: 12,
    hotLeads: 3,
    isLive: true,
  },
];

const UPCOMING_EVENTS = [
  {
    id: 'oh-002',
    tag: 'OH-002',
    address: '88 Gold Coast, Malibu',
    date: 'Jan 25, 2026',
    time: '12:00 PM - 3:00 PM',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', // Reusing for demo match
    visitors: 0,
    hotLeads: 0,
  },
  {
    id: 'oh-003',
    tag: 'OH-003',
    address: '900 Ocean Blvd, Santa Monica',
    date: 'Feb 01, 2026',
    time: '2:00 PM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    visitors: 0,
    hotLeads: 0,
  },
];

const COMPLETED_EVENTS = [
  {
    id: 'oh-004',
    tag: 'OH-004',
    address: '45 Pine St, Pasadena', // Not visible in screenshot but good to have
    date: 'Jan 12, 2026',
    time: '2:00 PM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    visitors: 28,
    hotLeads: 9,
  },
];

function EventCard({ event, variant }: { event: any; variant: 'live' | 'upcoming' | 'completed' }) {
  const isLive = variant === 'live';
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: event.image }} style={styles.cardImage} contentFit="cover" />
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{event.tag}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{event.address}</Text>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="calendar-blank" size={14} color="#64748B" />
          <Text style={styles.metaText}>{event.date} • {event.time}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={16} color="#475569" />
            <Text style={styles.statValue}>{event.visitors}</Text>
            <Text style={styles.statLabel}>VISITORS</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fire" size={16} color="#475569" />
            <Text style={styles.statValue}>{event.hotLeads}</Text>
            <Text style={styles.statLabel}>HOT LEADS</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              router.push({
                pathname: '/(main)/open-house/[id]',
                params: { id: event.id, mode: isLive ? 'live' : 'view' }
              });
            }}
          >
            {isLive && <MaterialCommunityIcons name="play" size={14} color="#FFF" style={{ marginRight: 4 }} />}
            {!isLive && <MaterialCommunityIcons name="eye-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />}
            <Text style={styles.primaryBtnText}>{isLive ? 'Manage Live' : 'View Details'}</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn}>
            <MaterialCommunityIcons name="content-copy" size={14} color="#0F172A" style={{ marginRight: 4 }} />
            <Text style={styles.secondaryBtnText}>Duplicate</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function OpenHouseScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>Open House Management</Text>
            <Text style={styles.screenSubtitle}>Track live visitor engagement and measure convention performance.</Text>
          </View>
        </View>

        <View style={styles.headerControls}>
          <View style={styles.kpiCard}>
            <View style={styles.kpiItem}>
              <Text style={styles.kpiValue}>124</Text>
              <Text style={styles.kpiLabel}>TOTAL LEADS</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Text style={[styles.kpiValue, { color: '#0D9488' }]}>84%</Text>
              <Text style={[styles.kpiLabel, { color: '#94A3B8' }]}>HOT SCORE</Text>
            </View>
          </View>

          <Pressable style={styles.createBtn} onPress={() => router.push('/(main)/open-house/create')}>
            <MaterialCommunityIcons name="plus" size={16} color="#FFF" />
            <Text style={styles.createBtnText}>Create New Event</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>


        <View style={styles.contentSection}>
          {/* Live Today */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Today</Text>
            <View style={styles.liveBadge}>
              <MaterialCommunityIcons name="play" size={10} color="#DC2626" />
              <Text style={styles.liveBadgeText}>LIVE NOW</Text>
            </View>
          </View>
          {LIVE_EVENTS.map(event => (
            <EventCard key={event.id} event={event} variant="live" />
          ))}

          {/* Upcoming */}
          <Text style={[styles.sectionTitle, { marginVertical: 20 }]}>Upcoming</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
            {UPCOMING_EVENTS.map(event => (
              <View key={event.id} style={{ width: 300 }}>
                <EventCard event={event} variant="upcoming" />
              </View>
            ))}
          </ScrollView>

          {/* Completed */}
          <Text style={[styles.sectionTitle, { marginVertical: 20 }]}>Completed</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            {COMPLETED_EVENTS.map(event => (
              <View key={event.id} style={{ width: 300, marginRight: 16 }}>
                <EventCard event={event} variant="completed" />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#64748B',
    maxWidth: '80%',
    lineHeight: 18,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  kpiCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flex: 1,
    justifyContent: 'space-around'
  },
  kpiItem: {
    alignItems: 'flex-start',
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  createBtn: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  contentSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#64748B',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  cardImageContainer: {
    height: 180,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statItem: {
    flexDirection: 'row', // icon next to number then label below? No, design shows: Icon Number \n Label
    alignItems: 'center', // Design: Icon, Number (Big), Label (Small)
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
    marginLeft: 2, // fine tune
  },

  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 8,
  },
  secondaryBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
});
