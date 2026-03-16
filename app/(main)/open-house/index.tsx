import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import {
  Alert,
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

function EventCard({ event, variant, onDelete }: { event: any; variant: 'live' | 'upcoming' | 'completed'; onDelete: () => void }) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

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
          <MaterialCommunityIcons name="calendar-blank" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{event.date} • {event.time}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={16} color={colors.textSecondary} />
            <Text style={styles.statValue}>{event.visitors}</Text>
            <Text style={styles.statLabel}>VISITORS</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fire" size={16} color={colors.textSecondary} />
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
            {isLive ? (
              <MaterialCommunityIcons name="play-outline" size={14} color="#FFF" style={{ marginRight: 6 }} />
            ) : (
              <MaterialCommunityIcons name="eye-outline" size={14} color="#FFF" style={{ marginRight: 6 }} />
            )}
            <Text style={styles.primaryBtnText}>{isLive ? 'Manage' : 'View'}</Text>
          </Pressable>

          <Pressable style={styles.iconBtn} onPress={() => router.push(`/(main)/open-house/edit/${event.id}` as any)}>
            <MaterialCommunityIcons name="pencil-outline" size={16} color={colors.accentTeal} />
          </Pressable>

          <Pressable style={styles.iconBtnDanger} onPress={onDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={16} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function OpenHouseScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [liveEvents, setLiveEvents] = useState(LIVE_EVENTS);
  const [upcomingEvents, setUpcomingEvents] = useState(UPCOMING_EVENTS);
  const [completedEvents, setCompletedEvents] = useState(COMPLETED_EVENTS);

  const handleDelete = (id: string, variant: 'live' | 'upcoming' | 'completed') => {
    Alert.alert(
      '',
      'Are you sure you want to delete this open house event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            if (variant === 'live') {
              setLiveEvents(prev => prev.filter(e => e.id !== id));
            } else if (variant === 'upcoming') {
              setUpcomingEvents(prev => prev.filter(e => e.id !== id));
            } else {
              setCompletedEvents(prev => prev.filter(e => e.id !== id));
            }
          }
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <PageHeader
        title="Open House Management"
        subtitle="Track live visitor engagement and measure convention performance."
        onBack={() => router.back()}
      />




      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerControls}>
          <View style={styles.kpiCard}>
            <View style={styles.kpiItem}>
              <Text style={styles.kpiValue}>124</Text>
              <Text style={styles.kpiLabel}>TOTAL LEADS</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Text style={[styles.kpiValue, { color: colors.accentTeal }]}>84%</Text>
              <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>HOT SCORE</Text>
            </View>
          </View>

          <Pressable style={styles.createBtn} onPress={() => router.push('/(main)/open-house/create')}>
            <MaterialCommunityIcons name="plus" size={16} color="#FFF" />
            <Text style={styles.createBtnText}>Create New Event</Text>
          </Pressable>
        </View>

        <View style={styles.contentSection}>
          {/* Live Today */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Today</Text>
            <View style={styles.liveBadge}>
              <MaterialCommunityIcons name="play" size={10} color={colors.danger} />
              <Text style={styles.liveBadgeText}>LIVE NOW</Text>
            </View>
          </View>
          {liveEvents.map(event => (
            <EventCard key={event.id} event={event} variant="live" onDelete={() => handleDelete(event.id, 'live')} />
          ))}

          {/* Upcoming */}
          <Text style={[styles.sectionTitle, { marginVertical: 20 }]}>Upcoming</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
            {upcomingEvents.map(event => (
              <View key={event.id} style={{ width: 300 }}>
                <EventCard event={event} variant="upcoming" onDelete={() => handleDelete(event.id, 'upcoming')} />
              </View>
            ))}
          </ScrollView>

          {/* Completed */}
          <Text style={[styles.sectionTitle, { marginVertical: 20 }]}>Completed</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            {completedEvents.map(event => (
              <View key={event.id} style={{ width: 300, marginRight: 16 }}>
                <EventCard event={event} variant="completed" onDelete={() => handleDelete(event.id, 'completed')} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

    </LinearGradient>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerControls: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20
  },
  kpiCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: colors.cardShadowColor,
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
    color: colors.textPrimary,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 12,
  },
  createBtn: {
    backgroundColor: colors.accentTeal,
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
    color: colors.textPrimary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.danger,
    letterSpacing: 0.5,
  },

  // Card
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  cardImageContainer: {
    height: 180,
    backgroundColor: colors.surfaceSoft,
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
    backgroundColor: colors.surfaceIcon,
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
    color: colors.textPrimary,
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
    color: colors.textSecondary,
    fontWeight: '500',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  statItem: {
    flexDirection: 'row', // icon next to number then label below? No, design shows: Icon Number \n Label
    alignItems: 'center', // Design: Icon, Number (Big), Label (Small)
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
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
    backgroundColor: colors.accentTeal,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  iconBtn: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
  },
  iconBtnDanger: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.dangerBorder, // Soft red pinkish border
    borderRadius: 8,
  },
  });
}