import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CRM_SECTIONS: Array<{
  id: string;
  label: string;
  icon: 'view-grid-outline' | 'account-group-outline' | 'account-outline' | 'calendar-blank-outline' | 'pipe' | 'rocket-launch-outline' | 'content-copy' | 'lightning-bolt-outline' | 'connection' | 'cog-outline';
  route: Href | null;
  badge?: string;
}> = [
    { id: 'contacts', label: 'Contacts', icon: 'account-group-outline', route: '/(main)/crm/contacts', badge: '1.2k' },
    { id: 'leads', label: 'Leads', icon: 'account-outline', route: '/(main)/crm/leads', badge: '42' },
    { id: 'follow-ups', label: 'Follow-Ups', icon: 'calendar-blank-outline', route: '/(main)/crm/follow-ups', badge: '12' },
    { id: 'deals', label: 'Deals / Pipeline', icon: 'pipe', route: '/(main)/crm/deals' },
    { id: 'campaigns', label: 'Campaigns', icon: 'rocket-launch-outline', route: '/(main)/crm/campaigns' },
    { id: 'templates', label: 'Templates', icon: 'content-copy', route: '/(main)/crm/templates' },
    { id: 'automations', label: 'Automations Rules', icon: 'lightning-bolt-outline', route: '/(main)/crm/automations' },
    { id: 'integrations', label: 'Integrations', icon: 'connection', route: '/(main)/crm/integrations' },
    { id: 'settings', label: 'Settings', icon: 'cog-outline', route: '/(main)/crm/settings' },
  ];

const OVERVIEW_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'lead-sources', label: 'Lead Sources' },
  { id: 'conversion-roi', label: 'Conversion ROI' },
  { id: 'heat-index', label: 'Heat Index Stats' },
] as const;

const METRIC_CARDS = [
  { title: 'TOTAL CONTACTS', value: '1,284', meta: '+12%', icon: 'account-group-outline' as const },
  { title: 'ACTIVE DEALS', value: '18', meta: '+2', icon: 'briefcase-outline' as const },
  { title: 'HOT LEADS', value: '42', meta: '+8', icon: 'fire' as const },
  { title: 'AVG. HEAT INDEX', value: '72', meta: '+4 pts', icon: 'trending-up' as const },
];

const RECENT_LEADS = [
  { id: '1', name: 'Jessica Miller', source: 'Open House QR', score: 94, time: '2m ago' },
  { id: '2', name: 'Robert Chen', source: 'Instagram / Staging', score: 82, time: '1h ago' },
  { id: '3', name: 'David Wilson', source: 'Zillow Clipper', score: 45, time: '3h ago' },
  { id: '4', name: 'Sarah Connor', source: 'Facebook UTM', score: 88, time: '5h ago' },
];

const LEAD_SOURCE_CARDS = [
  { id: '1', source: 'OPEN HOUSE QR', dotColor: '#0BA0B2', leads: 432, convRate: '18.4%', roi: 'High', roiHigh: true },
  { id: '2', source: 'INSTAGRAM ADS', dotColor: '#EA580C', leads: 215, convRate: '12.1%', roi: 'Medium', roiHigh: false },
  { id: '3', source: 'ZILLOW CLIPPER', dotColor: '#0B2D3E', leads: 184, convRate: '9.2%', roi: 'Low', roiHigh: false },
  { id: '4', source: 'WEBSITE FORMS', dotColor: '#7C3AED', leads: 98, convRate: '15.5%', roi: 'High', roiHigh: true },
];

const CONVERSION_FUNNEL_STAGES = [
  { id: '1', label: 'Total Captured Leads', value: '1284', barColor: '#CAD8E4' },
  { id: '2', label: 'Contacted & Engaged', value: '856', barColor: '#B8CCDC' },
  { id: '3', label: 'Showing / Site Visits', value: '412', barColor: '#9FC5D8' },
  { id: '4', label: 'Offers & Negotiations', value: '84', barColor: '#5BA8C9' },
  { id: '5', label: 'Closed Deals', value: '18', barColor: '#0BA0B2' },
];

const HEAT_DISTRIBUTION = [
  { id: 'cold', label: 'Cold', pct: '45%', sub: 'Cold (0-30)', color: '#5B6B7A' },
  { id: 'warm', label: 'Warm', pct: '65%', sub: 'Warm (31-70)', color: '#0BA0B2' },
  { id: 'hot', label: 'Hot', pct: '30%', sub: 'Hot (71-100)', color: '#EA580C' },
];

const HEAT_SURGE_TRIGGERS = [
  { id: '1', label: '3+ Property Views in 24h', pts: '+25 pts' },
  { id: '2', label: 'Email Open (Open House Kit)', pts: '+10 pts' },
  { id: '3', label: 'Video Walkthrough Completion', pts: '+15 pts' },
  { id: '4', label: 'Multiple Listing Comparisons', pts: '+20 pts' },
];

const ACTIVITY_LOG_DATA = [
  { id: '1', actor: 'Jessica Miller', action: 'New lead captured', detail: 'Open House QR', score: 94, time: '2 minutes ago', bgColor: '#E0F7FA', icon: 'account-plus-outline' as const, leftBorder: '#0BA0B2' },
  { id: '2', actor: 'You', action: 'Sent follow-up email', detail: '→ Robert Chen', score: null, time: '15 minutes ago', bgColor: '#F3F4F6', icon: 'email-outline' as const, leftBorder: 'transparent' },
  { id: '3', actor: 'Robert Chen', action: 'Opened email', detail: '"Property Tour Invitation"', score: 82, time: '1 hour ago', bgColor: '#FFF3E0', icon: 'email-open-outline' as const, leftBorder: 'transparent' },
  { id: '4', actor: 'System', action: 'Heat Index updated', detail: '→ Sarah Connor', scoreChange: '+12 pts', score: null, time: '2 hours ago', bgColor: '#F3F4F6', icon: 'cog-outline' as const, leftBorder: 'transparent' },
  { id: '5', actor: 'David Wilson', action: 'New lead captured', detail: 'Zillow Clipper', score: 45, time: '3 hours ago', bgColor: '#E0F7FA', icon: 'account-plus-outline' as const, leftBorder: '#0BA0B2' },
  { id: '6', actor: 'You', action: 'Created new deal', detail: 'Malibu Villa - Sarah Connor', score: null, time: '4 hours ago', bgColor: '#E8F5E9', icon: 'currency-usd' as const, leftBorder: '#15803D' },
  { id: '7', actor: 'Sarah Connor', action: 'Clicked property link', detail: 'Malibu Villa', score: 88, time: '5 hours ago', bgColor: '#FFF3E0', icon: 'cursor-default-click-outline' as const, leftBorder: 'transparent' },
  { id: '8', actor: 'System', action: 'Automation triggered', detail: 'Open House Follow-Up', score: null, time: '6 hours ago', bgColor: '#F3E5F5', icon: 'robot-outline' as const, leftBorder: 'transparent' },
  { id: '9', actor: 'Michael Torres', action: 'New lead captured', detail: 'Instagram Ads', score: 76, time: '7 hours ago', bgColor: '#E0F7FA', icon: 'account-plus-outline' as const, leftBorder: '#0BA0B2' },
  { id: '10', actor: 'You', action: 'Updated contact info', detail: '→ Jessica Miller', score: null, time: '8 hours ago', bgColor: '#F3F4F6', icon: 'pencil-outline' as const, leftBorder: 'transparent' },
  { id: '11', actor: 'Emma Davis', action: 'Scheduled appointment', detail: 'Tomorrow at 2:00 PM', score: null, time: '9 hours ago', bgColor: '#FCE4EC', icon: 'calendar-outline' as const, leftBorder: 'transparent' },
  { id: '12', actor: 'System', action: 'Lead score recalculated', detail: '→ Robert Chen', scoreChange: '+8 pts', score: null, time: '10 hours ago', bgColor: '#F3F4F6', icon: 'cog-outline' as const, leftBorder: 'transparent' },
  { id: '13', actor: 'You', action: 'Added note', detail: '→ David Wilson', score: null, time: '11 hours ago', bgColor: '#F3F4F6', icon: 'note-text-outline' as const, leftBorder: 'transparent' },
];

export default function CRMScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [overviewTab, setOverviewTab] = useState<(typeof OVERVIEW_TABS)[number]['id']>('overview');
  const [showActivityLog, setShowActivityLog] = useState(false);

  const { width } = Dimensions.get('window');
  const padding = 16;
  const gap = 12;
  const statCardWidth = (width - padding * 2 - gap) / 2;
  const chartWidth = Math.max(260, width - padding * 2 - 24);

  const velocityData = useMemo(
    () => ({
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      datasets: [{ data: [8, 12, 10, 15, 14, 18] }],
    }),
    []
  );

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#FFFFFF',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(11, 160, 178, ${opacity * 0.85})`,
      labelColor: (opacity = 1) => `rgba(91, 107, 122, ${opacity})`,
      barPercentage: 0.65,
      propsForBackgroundLines: { stroke: '#E8EEF6', strokeDasharray: '4 6' },
    }),
    []
  );

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <PageHeader
        title="CRM Command Center"
        subtitle="Intelligent database tracking leads from capture to close."
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <Pressable style={[styles.secondaryBtn, { flex: 1, justifyContent: 'center' }]}>
            <Text style={styles.secondaryBtnText}>Download ROI Report</Text>
          </Pressable>
        </View>

        {/* Overview tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScroll}>
          {OVERVIEW_TABS.map((tab) => {
            const isActive = overviewTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setOverviewTab(tab.id)}>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.tabUnderline} />}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Tab content: Overview | Lead Sources | Conversion ROI | Heat Index */}
        {overviewTab === 'overview' && (
          <>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.statsGrid}>
              {METRIC_CARDS.map((card) => (
                <View key={card.title} style={[styles.statCard, { width: statCardWidth }]}>
                  <View style={styles.statHeader}>
                    <View style={styles.statIconWrap}>
                      <MaterialCommunityIcons name={card.icon} size={18} color="#0BA0B2" />
                    </View>
                    <View style={styles.metaBadge}>
                      <Text style={styles.statMeta}>{card.meta}</Text>
                    </View>
                  </View>
                  <View style={styles.statBody}>
                    <Text style={styles.statValue}>{card.value}</Text>
                    <Text style={styles.statTitle}>{card.title}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Lead Velocity & Source Attribution</Text>
                <MaterialCommunityIcons name="information-outline" size={18} color="#94A3B8" />
              </View>
              <View style={styles.chartWrap}>
                <BarChart
                  data={velocityData}
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
                  style={styles.chart}
                />
              </View>
              <LinearGradient
                colors={['#F8FAFC', '#F1F5F9']}
                style={styles.velocityFooter}>
                <View>
                  <Text style={styles.velocityLabel}>TOP PERFORMING SOURCE</Text>
                  <Text style={styles.velocityValue}>Open House - Malibu Villa</Text>
                </View>
                <View style={styles.velocityRight}>
                  <Text style={styles.velocityLabel}>CONVERSION RATE</Text>
                  <Text style={styles.velocityValue}>14.2%</Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recent Lead Flows</Text>
                <Pressable onPress={() => setShowActivityLog(true)}>
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              </View>
              {RECENT_LEADS.map((lead, idx) => (
                <View
                  key={lead.id}
                  style={[styles.leadRow, idx === RECENT_LEADS.length - 1 && styles.leadRowLast]}>
                  <View style={styles.leadAvatar}>
                    <Text style={styles.avatarText}>{lead.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.leadInfo}>
                    <Text style={styles.leadName}>{lead.name}</Text>
                    <Text style={styles.leadSource}>{lead.source}</Text>
                  </View>
                  <View style={styles.leadRight}>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{lead.score}</Text>
                    </View>
                    <Text style={styles.leadTime}>{lead.time}</Text>
                  </View>
                </View>
              ))}
              <Pressable style={styles.cardLinkBtn} onPress={() => setShowActivityLog(true)}>
                <Text style={styles.cardLinkText}>View Continuous Activity Log</Text>
                <MaterialCommunityIcons name="chevron-right" size={16} color="#0BA0B2" />
              </Pressable>
            </View>
          </>
        )}

        {overviewTab === 'lead-sources' && (
          <View style={styles.leadSourceGrid}>
            {LEAD_SOURCE_CARDS.map((item) => (
              <View key={item.id} style={[styles.leadSourceCard, { width: statCardWidth }]}>
                <View style={styles.leadSourceHeader}>
                  <View style={[styles.leadSourceDot, { backgroundColor: item.dotColor }]} />
                  <Text style={styles.leadSourceLabel}>{item.source}</Text>
                </View>
                <Text style={styles.leadSourceValue}>{item.leads}</Text>
                <Text style={styles.leadSourceMeta}>Leads Captured</Text>
                <View style={styles.leadSourceFooter}>
                  <View style={styles.leadSourceRow}>
                    <Text style={styles.leadSourceLabelSmall}>CONV.</Text>
                    <Text style={[styles.leadSourceConv, item.roiHigh && styles.leadSourceConvTeal]}>
                      {item.convRate}
                    </Text>
                  </View>
                  <View style={styles.leadSourceRow}>
                    <Text style={styles.leadSourceLabelSmall}>ROI</Text>
                    <Text style={[styles.leadSourceRoi, item.roiHigh && styles.leadSourceRoiGreen]}>
                      {item.roi}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {overviewTab === 'conversion-roi' && (
          <View style={styles.funnelCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.funnelTitle}>Lead-to-Deal Funnel</Text>
              <MaterialCommunityIcons name="filter-outline" size={20} color="#94A3B8" />
            </View>
            {CONVERSION_FUNNEL_STAGES.map((stage, idx) => (
              <View
                key={stage.id}
                style={[
                  styles.funnelBar,
                  { backgroundColor: stage.barColor, opacity: 1 - idx * 0.1 },
                  idx === CONVERSION_FUNNEL_STAGES.length - 1 && styles.funnelBarLast,
                ]}>
                <Text style={styles.funnelBarLabel}>{stage.label}</Text>
                <View style={styles.funnelValueContainer}>
                  <Text style={styles.funnelBarValue}>{stage.value}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {overviewTab === 'heat-index' && (
          <>
            <View style={styles.heatCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.heatCardTitle}>Global Interest Distribution</Text>
                <MaterialCommunityIcons name="lightning-bolt" size={20} color="#FFD700" />
              </View>
              <View style={styles.heatDistributionRow}>
                {HEAT_DISTRIBUTION.map((item) => (
                  <View key={item.id} style={styles.heatDistributionItem}>
                    <Text style={[styles.heatDistributionPct, { color: item.color }]}>{item.pct}</Text>
                    <Text style={styles.heatDistributionSub}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.heatCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.heatCardTitle}>Interest Surge Triggers</Text>
              </View>
              {HEAT_SURGE_TRIGGERS.map((trigger, idx) => (
                <View
                  key={trigger.id}
                  style={[styles.heatTriggerRow, idx === HEAT_SURGE_TRIGGERS.length - 1 && styles.heatTriggerRowLast]}>
                  <View style={styles.triggerIconWrap}>
                    <MaterialCommunityIcons name="flash-outline" size={16} color="#0BA0B2" />
                  </View>
                  <Text style={styles.heatTriggerLabel}>{trigger.label}</Text>
                  <Text style={styles.heatTriggerPts}>{trigger.pts}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* CRM workspace — same in every tab */}
        <Text style={styles.sectionTitle}>CRM workspace</Text>
        <View style={styles.sectionsList}>
          {CRM_SECTIONS.map((section) => (
            <Pressable
              key={section.id}
              style={({ pressed }) => [styles.sectionRow, pressed && styles.sectionRowPressed]}
              onPress={() => section.route && router.push(section.route)}
              disabled={!section.route}>
              <View style={[styles.sectionIconWrap, !section.route && styles.sectionIconWrapActive]}>
                <MaterialCommunityIcons
                  name={section.icon}
                  size={22}
                  color={!section.route ? '#FFFFFF' : '#0B2D3E'}
                />
              </View>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              {section.route ? (
                <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
              ) : (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Here</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Continuous Activity Log Modal */}
      <Modal
        visible={showActivityLog}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActivityLog(false)}>
        <View style={styles.activityLogContainer}>
          {/* Header */}
          <View style={[styles.activityLogHeader, { paddingTop: insets.top + 16 }]}>
            <View style={styles.activityLogTitleRow}>
              <MaterialCommunityIcons name="pulse" size={24} color="#0B2D3E" />
              <View style={styles.activityLogTitleText}>
                <Text style={styles.activityLogTitle}>Continuous Activity Log</Text>
                <Text style={styles.activityLogSubtitle}>Real-time feed of all CRM activities and interactions</Text>
              </View>
            </View>
            <Pressable onPress={() => setShowActivityLog(false)} style={styles.activityLogCloseBtn}>
              <MaterialCommunityIcons name="close" size={24} color="#64748B" />
            </Pressable>
          </View>

          {/* Activity List */}
          <ScrollView
            style={styles.activityLogScroll}
            contentContainerStyle={[styles.activityLogContent, { paddingBottom: insets.bottom + 80 }]}
            showsVerticalScrollIndicator={false}>
            {ACTIVITY_LOG_DATA.map((activity) => (
              <View
                key={activity.id}
                style={[
                  styles.activityLogItem,
                  {
                    backgroundColor: activity.bgColor,
                    borderLeftColor: activity.leftBorder,
                    borderLeftWidth: activity.leftBorder !== 'transparent' ? 4 : 0,
                  }
                ]}>
                <View style={styles.activityLogIcon}>
                  <MaterialCommunityIcons name={activity.icon} size={20} color="#0B2D3E" />
                </View>
                <View style={styles.activityLogDetails}>
                  <View style={styles.activityLogRow}>
                    <Text style={styles.activityLogActor}>{activity.actor}</Text>
                    <Text style={styles.activityLogAction}>{activity.action}</Text>
                  </View>
                  <Text style={styles.activityLogDetail}>{activity.detail}</Text>
                  {activity.score && (
                    <View style={styles.activityLogScoreBadge}>
                      <Text style={styles.activityLogScoreText}>{activity.score}</Text>
                    </View>
                  )}
                  {activity.scoreChange && (
                    <View style={styles.activityLogScoreChangeBadge}>
                      <Text style={styles.activityLogScoreChangeText}>{activity.scoreChange}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.activityLogTime}>{activity.time}</Text>
              </View>
            ))}

            <View style={styles.activityLogFooterInfo}>
              <Text style={styles.activityLogFooterText}>Showing {ACTIVITY_LOG_DATA.length} recent activities</Text>
            </View>
          </ScrollView>

          {/* Footer Button */}
          <View style={[styles.activityLogFooter, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable style={styles.activityLogCloseButton} onPress={() => setShowActivityLog(false)}>
              <Text style={styles.activityLogCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  secondaryBtnText: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  tabsScroll: { marginHorizontal: -16 },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 4,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  tabLabelActive: { color: '#0F172A', fontWeight: '800' },
  tabUnderline: {
    display: 'none',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statMeta: { fontSize: 11, fontWeight: '800', color: '#10B981' },
  statBody: {
    gap: 2,
  },
  statValue: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  statTitle: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  viewAllText: { fontSize: 13, fontWeight: '700', color: '#0BA0B2' },
  chartWrap: { alignItems: 'center', marginVertical: 10 },
  chart: { borderRadius: 16 },
  velocityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  velocityLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 },
  velocityValue: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 4 },
  velocityRight: { alignItems: 'flex-end' },
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 14,
  },
  leadRowLast: { borderBottomWidth: 0 },
  leadAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  leadInfo: { flex: 1, gap: 2 },
  leadName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  leadSource: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  leadRight: { alignItems: 'flex-end', gap: 4 },
  scoreBadge: {
    backgroundColor: '#F0F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: { fontSize: 13, fontWeight: '800', color: '#0BA0B2' },
  leadScore: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  leadTime: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  cardLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F9FA',
    borderRadius: 12,
    gap: 6,
  },
  cardLinkText: { fontSize: 14, fontWeight: '700', color: '#0BA0B2' },
  leadSourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  leadSourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  leadSourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  leadSourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  leadSourceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  leadSourceValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  leadSourceMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  leadSourceFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  leadSourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadSourceLabelSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  leadSourceConv: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  leadSourceConvTeal: { color: '#0BA0B2' },
  leadSourceRoi: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  leadSourceRoiGreen: { color: '#10B981' },
  funnelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  funnelTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  funnelBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
  },
  funnelBarLast: {
    marginBottom: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(11, 160, 178, 0.4)',
  },
  funnelBarLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  funnelValueContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  funnelBarValue: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  heatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  heatCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  heatDistributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  heatDistributionItem: { flex: 1, alignItems: 'center', gap: 4 },
  heatDistributionPct: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  heatDistributionSub: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  heatTriggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    marginBottom: 8,
    gap: 12,
  },
  heatTriggerRowLast: { marginBottom: 0 },
  triggerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatTriggerLabel: { fontSize: 13, fontWeight: '600', color: '#1E293B', flex: 1 },
  heatTriggerPts: { fontSize: 13, fontWeight: '800', color: '#0BA0B2' },
  sectionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
    marginBottom: 40,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 14,
    borderRadius: 16,
    marginBottom: 4,
  },
  sectionRowPressed: { backgroundColor: '#F8FAFC' },
  sectionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconWrapActive: {
    backgroundColor: '#0F172A',
  },
  sectionLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1E293B' },
  sectionBadge: { fontSize: 13, fontWeight: '700', color: '#64748B', marginRight: 4 },
  currentBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  currentBadgeText: { fontSize: 11, fontWeight: '800', color: '#10B981' },
  // Activity Log Modal Styles
  activityLogContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  activityLogHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF4',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  activityLogTitleRow: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  activityLogTitleText: {
    flex: 1,
  },
  activityLogTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  activityLogSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  activityLogCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLogScroll: {
    flex: 1,
  },
  activityLogContent: {
    padding: 16,
    gap: 12,
  },
  activityLogItem: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  activityLogIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  activityLogDetails: {
    flex: 1,
    gap: 4,
  },
  activityLogRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  activityLogActor: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  activityLogAction: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  activityLogDetail: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '700',
  },
  activityLogScoreBadge: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  activityLogScoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  activityLogScoreChangeBadge: {
    backgroundColor: '#0BA0B2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  activityLogScoreChangeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  activityLogTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    minWidth: 70,
    textAlign: 'right',
  },
  activityLogFooterInfo: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  activityLogFooterText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  activityLogFooter: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  activityLogCloseButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  activityLogCloseButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
