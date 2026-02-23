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
import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const MENU_ITEMS: NavMenuItem[] = [
  { label: 'Dashboard', icon: 'view-dashboard-outline', route: '/(main)/dashboard' as const },
  { label: 'Inbox', icon: 'email-outline', route: '/(main)/inbox' as const },
  { label: 'Calendar', icon: 'calendar-blank-outline', route: '/(main)/calendar' as const },
  { label: 'CRM', icon: 'account-group-outline', route: '/(main)/crm' as const },
  { label: 'Properties', icon: 'home-city-outline', route: '/(main)/properties' as const },
  { label: 'Open House', icon: 'home-outline', route: '/(main)/open-house' as const },
  { label: 'Social Media', icon: 'message-outline', route: '/(main)/social-hub' as const },
  { label: 'AI Sweep', icon: 'star-four-points-outline', route: '/(main)/ai-content' as const },
  { label: 'Landing Pages', icon: 'web', route: '/(main)/landing' as const },
  { label: 'Images & Staging', icon: 'image-outline', route: '/(main)/images-staging' as const },
  { label: 'Zien Card', icon: 'card-text-outline', route: '/(main)/zien-card' as const },
  { label: 'Guardian AI', icon: 'shield-outline', route: '/(main)/guardian-ai' as const },
  { label: 'Billing & Usage', icon: 'credit-card-outline', route: '/(main)/billing-usage' as const },
];

const QUICK_ACTIONS = [
  { label: 'Create Listing', icon: 'home-outline', route: '/(main)/properties/create' as Href },
  { label: 'Find Properties', icon: 'magnify', route: '/(main)/properties' as Href },
  { label: 'Guardian AI', icon: 'shield-outline', route: '/(main)/guardian-ai' as Href },
  { label: 'Social Omni', icon: 'rocket-launch-outline', route: '/(main)/social-hub' as Href },
  { label: 'CRM Engine', icon: 'chart-bar', route: '/(main)/crm' as Href },
  { label: 'Zien Card', icon: 'card-text-outline', route: '/(main)/zien-card' as Href },
  { label: 'Contacts', icon: 'account-group-outline', route: '/(main)/crm/contacts' as Href },
];

const STATS = [
  { title: 'Total Leads', value: '1,284', meta: '12% vs last month', metaTone: 'positive' as const, icon: 'account-group-outline', color: '#0EA5E9' },
  { title: 'Active Listings', value: '42', meta: '3 new this week', metaTone: 'positive' as const, icon: 'home-city-outline', color: '#8B5CF6' },
  { title: 'Est. Revenue', value: '$420k', meta: '8% pipeline growth', metaTone: 'positive' as const, icon: 'cash-multiple', color: '#10B981' },
  { title: 'Guardian Alerts', value: '0', meta: 'Safe · No threats detected', metaTone: 'neutral' as const, icon: 'shield-check-outline', color: '#F59E0B' },
];

const ACTIVE_LEADS = [
  { name: 'Sarah Jenkins', note: 'Looking for 3bd/2ba', badge: 'HOT', badgeTone: 'hot' as const, color: '#FACC15' },
  { name: 'Mike Ross', note: 'Investment Inquiry', badge: 'NEW', badgeTone: 'new' as const, color: '#9CA3AF' },
  { name: 'Elena G.', note: 'Listing Consultant', badge: 'Lead', badgeTone: 'muted' as const, color: '#D97706' },
  { name: 'David K.', note: 'Open House Guest', badge: 'Lead', badgeTone: 'muted' as const, color: '#7C3AED' },
];

const LATEST_UPDATES = [
  { icon: 'robot-outline', title: 'AI Valuation Completed', description: 'Processed valuation report for 124 Ocean Drive.', time: '2 hours ago' },
  { icon: 'email-outline', title: 'Campaign Sent', description: 'Monthly market update sent to 450 contacts.', time: '4 hours ago' },
  { icon: 'shield-outline', title: 'Guardian AI Activated', description: 'Safety monitoring active for showing at 88 Summit Ave.', time: 'Yesterday' },
];

const CONTENT_PADDING_H = 18;
const CARD_GAP = 14;
/* ... skipping component body ... */
/* ... inside StyleSheet.create ... */
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: CONTENT_PADDING_H,
    paddingTop: 12,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 10,
    marginBottom: 14,
  },
  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    flexShrink: 1,
    minWidth: 220,
  },
  greetingLogo: {
    width: 28,
    height: 28,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  greetingName: {
    color: Theme.accentTeal,
  },
  greetingSubtitle: {
    marginTop: 4,
    fontSize: 13.5,
    color: Theme.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#0B2D3E',
    fontWeight: '500',
  },
  micIcon: {
    marginLeft: 10,
    padding: 4,
  },
  actionsContainer: {
    marginBottom: 24,
    marginHorizontal: -20,
  },
  actionsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    width: 140,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F7FAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  statsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  statRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  statRowIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statRowContent: {
    flex: 1,
  },
  statRowTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  statRowValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  statRowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statRowBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  twoCol: {
    gap: 12,
    marginBottom: 14,
  },
  twoColRow: {
    flexDirection: 'row',
  },
  twoColCol: {
    flexDirection: 'column',
  },
  chartWrap: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  segment: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.surfaceSoft,
    gap: 6,
    justifyContent: "flex-end",
    alignSelf: "flex-end"
  },
  segmentItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  segmentItemActive: {
    backgroundColor: Theme.accentTeal,
  },
  segmentText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: Theme.textSecondary,
  },
  segmentTextActive: {
    color: Theme.textOnAccent,
  },
  viewAllButton: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.surfaceSoft,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  updatesList: {
    gap: 0,
  },
  updateRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 12,
  },
  updateBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  updateIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  updateInfo: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 4,
  },
  updateDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  crmSnapshotCard: {
    backgroundColor: '#0B2D3E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },
  snapshotGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  snapshotItem: {
    alignItems: 'center',
    flex: 1,
  },
  snapshotValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  snapshotLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6AD3E0',
    textTransform: 'uppercase',
  },
  pipelineButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pipelineButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
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
  const chartWidth = Math.max(240, sectionColumnWidth - 32);

  const leadVelocityData = useMemo(() => {
    const labels = velocityRange === '7d' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['1', '5', '10', '15', '20', '25', '30'];
    const data = velocityRange === '7d' ? [10, 12, 9, 14, 16, 13, 18] : [6, 10, 12, 11, 15, 14, 18];
    return { labels, datasets: [{ data }] };
  }, [velocityRange]);

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: Theme.cardBackgroundSoft,
      backgroundGradientTo: Theme.cardBackgroundSoft,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(11, 160, 178, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(91, 107, 122, ${opacity})`,
      fillShadowGradientFrom: Theme.accentTeal,
      fillShadowGradientTo: Theme.accentBlue,
      fillShadowGradientOpacity: 1,
      barPercentage: 0.72,
      propsForBackgroundLines: {
        stroke: Theme.borderLight,
        strokeDasharray: '4 6',
      },
    }),
    []
  );

  return (
    <DashboardLayout menuItems={MENU_ITEMS} userInitials="VP">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeft}>
            <Image
              source={require('@/assets/images/react-logo.png')}
              style={styles.greetingLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greetingTitle}>
                Hi <Text style={styles.greetingName}>John</Text>
              </Text>
              <Text style={styles.greetingSubtitle}>Here is your daily intelligence briefing.</Text>
            </View>
          </View>
        </View>

        <SearchBar />

        <ActionPillsRow items={QUICK_ACTIONS} />

        <View style={styles.statsContainer}>
          {STATS.map((stat, idx) => (
            <View key={stat.title} style={styles.statRowCard}>
              <View style={[styles.statRowIcon, { backgroundColor: `${stat.color}15` }]}>
                <MaterialCommunityIcons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <View style={styles.statRowContent}>
                <Text style={styles.statRowTitle}>{stat.title}</Text>
                <Text style={styles.statRowValue}>{stat.value}</Text>
              </View>
              <View style={[styles.statRowBadge, { backgroundColor: stat.metaTone === 'positive' ? '#ECFDF5' : '#F3F4F6' }]}>
                <MaterialCommunityIcons
                  name={stat.metaTone === 'positive' ? 'trending-up' : 'shield-check'}
                  size={14}
                  color={stat.metaTone === 'positive' ? '#10B981' : '#64748B'}
                />
                <Text style={[styles.statRowBadgeText, { color: stat.metaTone === 'positive' ? '#059669' : '#475569' }]}>
                  {stat.meta}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.twoCol, isTablet ? styles.twoColRow : styles.twoColCol]}>
          <SectionCard title="Lead Velocity" style={{ flex: 1 }}>
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
                height={180}
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
            onLinkPress={() => router.push('/(main)/crm')}
            style={{ flex: 1 }}
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
              <Pressable style={styles.viewAllButton}>
                <Text style={styles.viewAllButtonText}>View All Leads</Text>
              </Pressable>
            </View>
          </SectionCard>
        </View>

        <View style={[styles.twoCol, isTablet ? styles.twoColRow : styles.twoColCol]}>
          <SectionCard
            title="Latest Updates"
            linkLabel="View All"
            onLinkPress={() => router.push('/(main)/notifications')}
            style={{ flex: 1 }}
          >
            <View style={{ marginTop: 6 }}>
              {LATEST_UPDATES.slice(0, 2).map((u) => (
                <UpdateRow
                  key={u.title}
                  icon={u.icon}
                  title={u.title}
                  description={u.description}
                  time={u.time}
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
            onButtonPress={() => router.push('/(main)/crm/deals')}
            style={{ flex: 1 }}
          />
        </View>

        <View style={{ height: CARD_GAP }} />
      </ScrollView>
    </DashboardLayout>
  );
}
