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
  icon: 'view-grid-outline' | 'account-group-outline' | 'account-outline' | 'calendar-blank-outline' | 'pipe' | 'rocket-launch-outline' | 'lightning-bolt-outline' | 'connection' | 'cog-outline';
  route: Href | null;
  badge?: string;
}> = [
    { id: 'contacts', label: 'Contacts', icon: 'account-group-outline', route: '/(main)/crm/contacts', badge: '1.2k' },
    { id: 'leads', label: 'Leads', icon: 'account-outline', route: '/(main)/crm/leads', badge: '42' },
    { id: 'follow-ups', label: 'Follow-Ups', icon: 'calendar-blank-outline', route: '/(main)/crm/follow-ups', badge: '12' },
    { id: 'deals', label: 'Deals / Pipeline', icon: 'pipe', route: '/(main)/crm/deals' },
    { id: 'campaigns', label: 'Campaigns', icon: 'rocket-launch-outline', route: '/(main)/crm/campaigns' },
    { id: 'automations', label: 'Automations', icon: 'lightning-bolt-outline', route: '/(main)/crm/automations' },
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
  const [showAIModal, setShowAIModal] = useState(false);
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
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>CRM Command Center</Text>
          <Text style={styles.subtitle}>
            Intelligent database tracking leads from capture to close.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Download ROI Report</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={() => setShowAIModal(true)}>
            <Text style={styles.primaryBtnText}>Generate AI Insights</Text>
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
            <Text style={styles.sectionTitle}>Key metrics</Text>
            <View style={styles.statsGrid}>
              {METRIC_CARDS.map((card) => (
                <View key={card.title} style={[styles.statCard, { width: statCardWidth }]}>
                  <View style={styles.statIconWrap}>
                    <MaterialCommunityIcons name={card.icon} size={20} color="#0B2D3E" />
                  </View>
                  <Text style={styles.statValue}>{card.value}</Text>
                  <Text style={styles.statTitle}>{card.title}</Text>
                  <Text style={styles.statMeta}>{card.meta}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Lead Velocity & Source Attribution</Text>
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
              <View style={styles.velocityFooter}>
                <View>
                  <Text style={styles.velocityLabel}>TOP PERFORMING SOURCE</Text>
                  <Text style={styles.velocityValue}>Open House - Malibu Villa</Text>
                </View>
                <View style={styles.velocityRight}>
                  <Text style={styles.velocityLabel}>CONVERSION RATE</Text>
                  <Text style={styles.velocityValue}>14.2%</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Lead Flows</Text>
              {RECENT_LEADS.map((lead, idx) => (
                <View
                  key={lead.id}
                  style={[styles.leadRow, idx === RECENT_LEADS.length - 1 && styles.leadRowLast]}>
                  <View style={styles.leadInfo}>
                    <Text style={styles.leadName}>{lead.name}</Text>
                    <Text style={styles.leadSource}>{lead.source}</Text>
                  </View>
                  <Text style={styles.leadScore}>{lead.score}</Text>
                  <Text style={styles.leadTime}>{lead.time}</Text>
                </View>
              ))}
              <Pressable style={styles.cardLinkBtn} onPress={() => setShowActivityLog(true)}>
                <Text style={styles.cardLinkText}>View Continuous Activity Log</Text>
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
                <Text style={styles.leadSourceMeta}>Total Leads Captured</Text>
                <View style={styles.leadSourceFooter}>
                  <Text style={[styles.leadSourceConv, item.roiHigh && styles.leadSourceConvTeal]} numberOfLines={1}>
                    CONV. RATE {item.convRate}
                  </Text>
                  <Text style={[styles.leadSourceRoi, item.roiHigh && styles.leadSourceRoiGreen]} numberOfLines={1}>
                    EST. ROI {item.roi}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {overviewTab === 'conversion-roi' && (
          <View style={styles.funnelCard}>
            <Text style={styles.funnelTitle}>Lead-to-Deal Conversion Funnel</Text>
            {CONVERSION_FUNNEL_STAGES.map((stage, idx) => (
              <View
                key={stage.id}
                style={[
                  styles.funnelBar,
                  { backgroundColor: stage.barColor },
                  idx === CONVERSION_FUNNEL_STAGES.length - 1 && styles.funnelBarLast,
                ]}>
                <Text style={styles.funnelBarLabel}>{stage.label}</Text>
                <Text style={styles.funnelBarValue}>{stage.value}</Text>
              </View>
            ))}
          </View>
        )}

        {overviewTab === 'heat-index' && (
          <>
            <View style={styles.heatCard}>
              <Text style={styles.heatCardTitle}>Global Interest Distribution</Text>
              <View style={styles.heatDistributionRow}>
                {HEAT_DISTRIBUTION.map((item) => (
                  <View key={item.id} style={styles.heatDistributionItem}>
                    <Text style={[styles.heatDistributionPct, { color: item.color }]}>{item.pct}</Text>
                    <Text style={styles.heatDistributionSub}>{item.sub}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.heatCard}>
              <Text style={styles.heatCardTitle}>Interest Surge Trigger</Text>
              {HEAT_SURGE_TRIGGERS.map((trigger, idx) => (
                <View
                  key={trigger.id}
                  style={[styles.heatTriggerRow, idx === HEAT_SURGE_TRIGGERS.length - 1 && styles.heatTriggerRowLast]}>
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

      {/* AI CRM Analysis Modal */}
      <Modal
        visible={showAIModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAIModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowAIModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.sparkleIcon}>✨</Text>
                <Text style={styles.modalTitle}>AI CRM Analysis</Text>
              </View>
              <Pressable onPress={() => setShowAIModal(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>Based on your recent CRM activity:</Text>

              <View style={styles.insightsList}>
                <View style={styles.insightItem}>
                  <Text style={styles.insightNumber}>1.</Text>
                  <Text style={styles.insightText}>
                    Lead response time has improved by 15% this week.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightNumber}>2.</Text>
                  <Text style={styles.insightText}>
                    "Open House - Malibu Villa" is your highest converting source (18.4%).
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightNumber}>3.</Text>
                  <Text style={styles.insightText}>
                    12 contacts have a Heat Index above 85 - prioritize follow-ups.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightNumber}>4.</Text>
                  <Text style={styles.insightText}>
                    Recommended Action: Send a personalized video update to the "Warm" segment.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable style={styles.closeAnalysisButton} onPress={() => setShowAIModal(false)}>
                <Text style={styles.closeAnalysisButtonText}>Close Analysis</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  headerCenter: { flex: 1 },
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  secondaryBtnText: { fontSize: 12, fontWeight: '700', color: '#0B2D3E' },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
  },
  primaryBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  tabsScroll: { marginHorizontal: -16 },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginRight: 20,
    alignItems: 'center',
  },
  tabActive: {},
  tabLabel: { fontSize: 14, fontWeight: '600', color: '#5B6B7A' },
  tabLabelActive: { color: '#0B2D3E', fontWeight: '800' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: '#0BA0B2',
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 45, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 20, fontWeight: '900', color: '#0B2D3E' },
  statTitle: { fontSize: 12, fontWeight: '600', color: '#5B6B7A', marginTop: 2 },
  statMeta: { fontSize: 11, fontWeight: '700', color: '#0BA0B2', marginTop: 2 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0B2D3E', marginBottom: 12 },
  chartWrap: { alignItems: 'center', marginBottom: 12 },
  chart: { borderRadius: 12 },
  velocityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  velocityLabel: { fontSize: 10, fontWeight: '800', color: '#5B6B7A', letterSpacing: 0.5 },
  velocityValue: { fontSize: 13, fontWeight: '700', color: '#0B2D3E', marginTop: 2 },
  velocityRight: { alignItems: 'flex-end' },
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
    gap: 12,
  },
  leadRowLast: {},
  leadInfo: { flex: 1 },
  leadName: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  leadSource: { fontSize: 12, color: '#5B6B7A', marginTop: 2 },
  leadScore: { fontSize: 14, fontWeight: '800', color: '#0B2D3E', minWidth: 28 },
  leadTime: { fontSize: 12, color: '#5B6B7A', minWidth: 48 },
  cardLinkBtn: { marginTop: 8, paddingVertical: 8 },
  cardLinkText: { fontSize: 13, fontWeight: '700', color: '#0BA0B2' },
  leadSourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  leadSourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
  },
  leadSourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  leadSourceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  leadSourceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5B6B7A',
    letterSpacing: 0.5,
  },
  leadSourceValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  leadSourceMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B6B7A',
    marginTop: 4,
  },
  leadSourceFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
    gap: 4,
  },
  leadSourceConv: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5B6B7A',
    letterSpacing: 0.3,
  },
  leadSourceConvTeal: { color: '#0BA0B2' },
  leadSourceRoi: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.3,
  },
  leadSourceRoiGreen: { color: '#15803D' },
  funnelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
    marginBottom: 20,
  },
  funnelTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 14,
  },
  funnelBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  funnelBarLast: {
    marginBottom: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(11, 160, 178, 0.4)',
  },
  funnelBarLabel: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  funnelBarValue: { fontSize: 15, fontWeight: '800', color: '#0B2D3E' },
  heatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
    marginBottom: 16,
  },
  heatCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 14,
  },
  heatDistributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  heatDistributionItem: { flex: 1, alignItems: 'center' },
  heatDistributionPct: { fontSize: 20, fontWeight: '800' },
  heatDistributionSub: { fontSize: 12, fontWeight: '600', color: '#5B6B7A', marginTop: 4 },
  heatTriggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    marginBottom: 8,
  },
  heatTriggerRowLast: { marginBottom: 0 },
  heatTriggerLabel: { fontSize: 14, fontWeight: '600', color: '#0B2D3E', flex: 1 },
  heatTriggerPts: { fontSize: 14, fontWeight: '700', color: '#0BA0B2' },
  sectionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    overflow: 'hidden',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  sectionRowPressed: { backgroundColor: '#F8FBFF' },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconWrapActive: {
    backgroundColor: '#0BA0B2',
  },
  sectionLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#0B2D3E' },
  sectionBadge: { fontSize: 13, fontWeight: '700', color: '#5B6B7A', marginRight: 4 },
  currentBadge: {
    backgroundColor: '#0BA0B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 440,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sparkleIcon: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 24,
    maxHeight: 400,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    fontWeight: '600',
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    gap: 10,
  },
  insightNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
    minWidth: 20,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    color: '#0B2D3E',
    lineHeight: 22,
  },
  modalFooter: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  closeAnalysisButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
  },
  closeAnalysisButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
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
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  activityLogSubtitle: {
    fontSize: 12,
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
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#0B2D3E',
  },
  activityLogAction: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  activityLogDetail: {
    fontSize: 13,
    color: '#0B2D3E',
    fontWeight: '600',
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
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
  },
  activityLogCloseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
