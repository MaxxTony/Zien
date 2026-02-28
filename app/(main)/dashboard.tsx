import {
  ActionPillsRow,
  DarkSectionCard,
  LeadRow,
  SearchBar,
  SectionCard,
  UpdateRow
} from '@/components/dashboard';
import type { NavMenuItem } from '@/components/main';
import { DashboardLayout } from '@/components/main';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const MENU_ITEMS: NavMenuItem[] = [
  { label: 'Dashboard', icon: 'view-grid-outline', route: '/(main)/dashboard' as const },
  { label: 'Chat', icon: 'chat-processing-outline', route: '/(main)/chat' as const },
  { label: 'Inbox', icon: 'inbox-outline', route: '/(main)/inbox' as const },
  { label: 'Calendar', icon: 'calendar-blank-outline', route: '/(main)/calendar' as const },
  { label: 'CRM', icon: 'account-group-outline', route: '/(main)/crm' as const },
  { label: 'Properties', icon: 'home-outline', route: '/(main)/properties' as const },
  { label: 'Open House', icon: 'map-marker-radius-outline', route: '/(main)/open-house' as const },
  { label: 'Social Media', icon: 'share-variant-outline', route: '/(main)/social-hub' as const },
  { label: 'AI Sweep', icon: 'brain', route: '/(main)/ai-content' as const },
  { label: 'Leads Capture', icon: 'form-select', route: '/(main)/leads-capture' as const },
  { label: 'Landing Pages', icon: 'web', route: '/(main)/landing' as const },
  { label: 'Images & Staging', icon: 'image-outline', route: '/(main)/images-staging' as const },
  { label: 'Zien Card', icon: 'card-account-details-outline', route: '/(main)/zien-card' as const },
  { label: 'Zien Guardian', icon: 'target', route: '/(main)/guardian-ai' as const },
  { label: 'Billing & Usage', icon: 'credit-card-outline', route: '/(main)/billing-usage' as const },
];



const QUICK_ACTIONS = [
  { label: 'Add Property', icon: 'home-outline', route: '/(main)/properties/create' as Href },
  { label: 'Open House', icon: 'map-marker-outline', route: '/(main)/open-house' as Href },
  { label: 'Zien Guardian', icon: 'shield-outline', route: '/(main)/guardian-ai' as Href },
  { label: 'Social Media', icon: 'share-variant-outline', route: '/(main)/social-hub' as Href },
  { label: 'Zien Card', icon: 'card-text-outline', route: '/(main)/zien-card' as Href },
];

const STATS = [
  {
    title: 'Total Leads',
    value: '1,284',
    meta: '+12% vs last month',
    metaTone: 'positive' as const,
    icon: 'account-group-outline',
    gradient: ['#0BA0B2', '#1B5E9A'] as [string, string],
  },
  {
    title: 'Active Listings',
    value: '42',
    meta: '3 new this week',
    metaTone: 'positive' as const,
    icon: 'home-city-outline',
    gradient: ['#6B4EFF', '#9A7BFF'] as [string, string],
  },
  {
    title: 'Est. Revenue',
    value: '$420k',
    meta: '+8% pipeline growth',
    metaTone: 'positive' as const,
    icon: 'cash-multiple',
    gradient: ['#10B981', '#059669'] as [string, string],
  },
  {
    title: 'Guardian Alerts',
    value: '0',
    meta: 'Safe · No threats',
    metaTone: 'neutral' as const,
    icon: 'shield-check-outline',
    gradient: ['#F59E0B', '#D97706'] as [string, string],
  },
];

const ACTIVE_LEADS = [
  { name: 'Sarah Jenkins', note: 'Looking for 3bd/2ba', badge: 'HOT', badgeTone: 'hot' as const, color: '#F59E0B' },
  { name: 'Mike Ross', note: 'Investment Inquiry', badge: 'NEW', badgeTone: 'new' as const, color: '#6B4EFF' },
  { name: 'Elena G.', note: 'Listing Consultant', badge: 'Lead', badgeTone: 'muted' as const, color: '#0BA0B2' },
  { name: 'David K.', note: 'Open House Guest', badge: 'Lead', badgeTone: 'muted' as const, color: '#10B981' },
];

const LATEST_UPDATES = [
  { icon: 'robot-outline', title: 'AI Valuation Completed', description: 'Processed valuation report for 124 Ocean Drive.', time: '2h ago', accent: '#6B4EFF' },
  { icon: 'email-outline', title: 'Campaign Sent', description: 'Monthly market update sent to 450 contacts.', time: '4h ago', accent: '#0BA0B2' },
  { icon: 'shield-outline', title: 'Guardian AI Activated', description: 'Safety monitoring active for 88 Summit Ave.', time: 'Yesterday', accent: '#F59E0B' },
];

const CONTENT_PADDING_H = 18;
const CARD_GAP = 14;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: CONTENT_PADDING_H,
    paddingTop: 8,
  },

  // ── Greeting ───────────────────────────────────────
  greetingCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0A2F48',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  greetingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  greetingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  greetingTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
  greetingDateText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: 'rgba(190,220,240,0.8)',
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  greetingName: {
    color: '#0ECFDF',
  },
  greetingSubtitle: {
    fontSize: 13,
    color: 'rgba(190,220,240,0.85)',
    fontWeight: '500',
    lineHeight: 18,
  },

  // ── Stats ───────────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 22,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  statCardInner: {
    flex: 1,
  },
  statCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  statBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.2,
  },

  // ── Two-col layout ──────────────────────────────────
  twoCol: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  twoColRow: { flexDirection: 'row' },
  twoColCol: { flexDirection: 'column' },

  // ── Segment control ─────────────────────────────────
  segment: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.surfaceSoft,
    alignSelf: 'flex-end',
    gap: 4,
  },
  segmentItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  segmentItemActive: {
    backgroundColor: Theme.accentTeal,
    shadowColor: Theme.accentTeal,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.textSecondary,
  },
  segmentTextActive: {
    color: '#fff',
  },

  // ── Chart ───────────────────────────────────────────
  chartWrap: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // ── View all button ─────────────────────────────────
  viewAllButton: {
    marginTop: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },
  viewAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${Theme.accentTeal}30`,
    backgroundColor: `${Theme.accentTeal}08`,
  },
  viewAllButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.accentTeal,
  },
});

export default function DashboardScreen() {
  const router = useRouter();
  const [velocityRange, setVelocityRange] = useState<'7d' | '30d'>('30d');

  const windowWidth = Dimensions.get('window').width;
  const isTablet = windowWidth >= 768;
  const sectionColumnWidth = isTablet
    ? Math.floor((windowWidth - CONTENT_PADDING_H * 2 - CARD_GAP) / 2)
    : windowWidth - CONTENT_PADDING_H * 2;
  const chartWidth = Math.max(240, sectionColumnWidth - 36);

  const leadVelocityData = useMemo(() => {
    const labels = velocityRange === '7d'
      ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
      : ['1', '5', '10', '15', '20', '25', '30'];
    const data = velocityRange === '7d'
      ? [10, 12, 9, 14, 16, 13, 18]
      : [6, 10, 12, 11, 15, 14, 18];
    return { labels, datasets: [{ data }] };
  }, [velocityRange]);

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#FFFFFF',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(11, 160, 178, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(91, 107, 122, ${opacity})`,
      fillShadowGradientFrom: Theme.accentTeal,
      fillShadowGradientTo: '#1B5E9A',
      fillShadowGradientOpacity: 1,
      barPercentage: 0.65,
      propsForBackgroundLines: {
        stroke: '#EEF2F7',
        strokeDasharray: '4 6',
      },
    }),
    []
  );

  // Format current date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <DashboardLayout menuItems={MENU_ITEMS} userInitials="VP">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting Card ── */}
        <LinearGradient
          colors={['#0D2F45', '#0B2D3E', '#082030']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.greetingCard}
        >
          {/* Glow accents */}
          <View style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(11,160,178,0.18)' }} />
          <View style={{ position: 'absolute', bottom: -10, left: 30, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(107,78,255,0.12)' }} />

          <View style={styles.greetingTopRow}>
            <View style={styles.greetingTag}>
              <MaterialCommunityIcons name="star-four-points" size={11} color="rgba(255,255,255,0.9)" />
              <Text style={styles.greetingTagText}>Intelligence Briefing</Text>
            </View>
            <Text style={styles.greetingDateText}>{dateStr}</Text>
          </View>

          <Text style={styles.greetingTitle}>
            Hi <Text style={styles.greetingName}>John</Text> 👋
          </Text>
          <Text style={styles.greetingSubtitle}>
            Your pipeline is healthy. 3 new leads need follow-up today.
          </Text>
        </LinearGradient>

        {/* ── Search / AI prompt bar ── */}
        <SearchBar />

        {/* ── Quick Actions ── */}
        <ActionPillsRow items={QUICK_ACTIONS} />

        {/* ── Stat Cards (2×2 grid) ── */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <LinearGradient
              key={stat.title}
              colors={stat.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statCardTop}>
                <View style={styles.statIconWrap}>
                  <MaterialCommunityIcons name={stat.icon as any} size={20} color="#fff" />
                </View>
                <View style={styles.statBadge}>
                  <MaterialCommunityIcons
                    name={stat.metaTone === 'positive' ? 'trending-up' : 'shield-check'}
                    size={10}
                    color="#fff"
                  />
                  <Text style={styles.statBadgeText}>
                    {stat.metaTone === 'positive' ? '+' : ''}
                  </Text>
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={[styles.statBadgeText, { color: 'rgba(255,255,255,0.7)', marginTop: 4 }]}>{stat.meta}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* ── Lead Velocity + Active Leads (side by side on tablet) ── */}
        <View style={[styles.twoCol, isTablet ? styles.twoColRow : styles.twoColCol]}>
          <SectionCard title="Lead Velocity" style={{ flex: 1 }} accent="#0BA0B2">
            <View style={styles.segment}>
              <Pressable
                onPress={() => setVelocityRange('7d')}
                style={[styles.segmentItem, velocityRange === '7d' && styles.segmentItemActive]}
              >
                <Text style={[styles.segmentText, velocityRange === '7d' && styles.segmentTextActive]}>7 Days</Text>
              </Pressable>
              <Pressable
                onPress={() => setVelocityRange('30d')}
                style={[styles.segmentItem, velocityRange === '30d' && styles.segmentItemActive]}
              >
                <Text style={[styles.segmentText, velocityRange === '30d' && styles.segmentTextActive]}>30 Days</Text>
              </Pressable>
            </View>
            <View style={styles.chartWrap}>
              <BarChart
                data={leadVelocityData}
                width={chartWidth}
                height={175}
                fromZero
                showValuesOnTopOfBars={false}
                withInnerLines
                withHorizontalLabels
                withVerticalLabels
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig as any}
                style={{ borderRadius: 16 }}
              />
            </View>
          </SectionCard>

          <SectionCard
            title="Active Leads"
            linkLabel="View CRM"
            onLinkPress={() => router.push('/(main)/crm/leads' as Href)}
            style={{ flex: 1 }}
            accent="#6B4EFF"
          >
            <View style={{ marginTop: 8 }}>
              {ACTIVE_LEADS.slice(0, 3).map((lead) => (
                <LeadRow
                  key={lead.name}
                  name={lead.name}
                  note={lead.note}
                  badge={lead.badge}
                  badgeTone={lead.badgeTone}
                  color={lead.color}
                />
              ))}
              <Pressable
                style={({ pressed }) => [styles.viewAllButton, pressed && { opacity: 0.8 }]}
                onPress={() => router.push('/(main)/crm/leads' as Href)}
              >
                <View style={styles.viewAllGradient}>
                  <Text style={styles.viewAllButtonText}>View All Leads</Text>
                  <MaterialCommunityIcons name="arrow-right" size={15} color={Theme.accentTeal} />
                </View>
              </Pressable>
            </View>
          </SectionCard>
        </View>

        {/* ── Latest Updates + CRM Snapshot ── */}
        <View style={[styles.twoCol, isTablet ? styles.twoColRow : styles.twoColCol]}>
          <SectionCard
            title="Latest Updates"
            linkLabel="View All"
            onLinkPress={() => router.push('/(main)/notifications' as Href)}
            style={{ flex: 1 }}
            accent="#F59E0B"
          >
            <View style={{ marginTop: 4 }}>
              {LATEST_UPDATES.slice(0, 2).map((u) => (
                <UpdateRow
                  key={u.title}
                  icon={u.icon}
                  title={u.title}
                  description={u.description}
                  time={u.time}
                  accentColor={u.accent}
                />
              ))}
            </View>
          </SectionCard>

          <DarkSectionCard
            title="CRM Snapshot"
            items={[
              { value: '14', label: 'New' },
              { value: '8', label: 'Negotiation' },
              { value: '3', label: 'Closing' },
            ]}
            buttonLabel="Go to Pipeline"
            onButtonPress={() => router.push('/(main)/crm/deals' as Href)}
            style={{ flex: 1 }}
          />
        </View>

        <View style={{ height: CARD_GAP }} />
      </ScrollView>
    </DashboardLayout>
  );
}
