import { BillingCard, BillingScreenHeader, PlanModal, type BillingTabKey } from '@/components/billing';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type UsageRow = {
  label: string;
  used: number;
  limit: number;
  tone: 'primary' | 'warning' | 'muted';
};

type InvoiceRow = {
  id: string;
  billingCycle: string;
  description: string;
  amount: string;
  status: 'paid' | 'due';
};

type TeamRow = {
  id: string;
  memberName: string;
  totalCredits: string;
  primaryAction: string;
  lastActive: string;
};

type AnalyticsLeaderboardRow = {
  id: string;
  name: string;
  initials: string;
  monthlyConsumption: string;
  primaryDomain: string;
  peakActivity: string;
  resourceHealth: number;
  healthColor: string;
};

type MarketplaceItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  unit: string;
  category: string;
  icon: string;
};

function formatPercent(used: number, limit: number) {
  if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return 0;
  return Math.max(0, Math.min(1, used / limit));
}

function toneColor(tone: UsageRow['tone']) {
  switch (tone) {
    case 'warning':
      return { fill: '#F59E0B', track: Theme.surfaceIcon };
    case 'muted':
      return { fill: Theme.accentBlue, track: Theme.surfaceIcon };
    default:
      return { fill: Theme.accentTeal, track: Theme.surfaceIcon };
  }
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function UsageProgressRow({ row }: { row: UsageRow }) {
  const pct = formatPercent(row.used, row.limit);
  const colors = toneColor(row.tone);
  const widthPct = `${Math.round(pct * 100)}%` as const;

  return (
    <View style={styles.usageRow}>
      <View style={styles.usageRowHeader}>
        <Text style={styles.usageLabel}>{row.label}</Text>
        <Text style={styles.usageValue}>
          {row.used.toLocaleString()} / {row.limit.toLocaleString()}
        </Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.track }]}>
        <View style={[styles.progressFill, { width: widthPct, backgroundColor: colors.fill }]} />
      </View>
    </View>
  );
}

type LedgerRow = {
  id: string;
  settlementDate: string;
  description: string;
  transactionId: string;
  paymentSource: string;
  amount: string;
  status: 'paid' | 'pending';
};

export default function BillingUsageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BillingTabKey>('overview');
  const scrollRef = useRef<ScrollView>(null);

  const handleInvoiceDownload = (_invoiceId: string) => {
    // TODO: wire to real invoice PDF URL / file when backend is ready.
  };

  const goToTab = (tab: BillingTabKey) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  const [showPlanModal, setShowPlanModal] = useState(false);
  const goToPlans = () => setShowPlanModal(true);

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null);
  const openSettlementModal = (inv: InvoiceRow) => setSelectedInvoice(inv);
  const closeSettlementModal = () => setSelectedInvoice(null);

  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credHolderName, setCredHolderName] = useState('John Olakoya');
  const [credCardNumber, setCredCardNumber] = useState('**** **** **** 4242');
  const [credExpiry, setCredExpiry] = useState('12/26');
  const [credCvc, setCredCvc] = useState('');
  const openCredentialsModal = () => setShowCredentialsModal(true);
  const closeCredentialsModal = () => {
    Keyboard.dismiss();
    setShowCredentialsModal(false);
  };
  const handleAuthorizeUpdate = () => {
    Keyboard.dismiss();
    setShowCredentialsModal(false);
    // TODO: submit to backend
  };

  const [acquireModalItem, setAcquireModalItem] = useState<MarketplaceItem | null>(null);
  const [settlementConfirmedVisible, setSettlementConfirmedVisible] = useState(false);
  const openAcquireModal = (item: MarketplaceItem) => setAcquireModalItem(item);
  const closeAcquireModal = () => setAcquireModalItem(null);
  const handleAuthorizeCapitalRelease = () => {
    closeAcquireModal();
    setSettlementConfirmedVisible(true);
  };
  const closeSettlementConfirmed = () => setSettlementConfirmedVisible(false);
  const referenceNo = (id: string) => 'INV-' + id.replace(/^inv-/, '').toUpperCase();

  const usageRows = useMemo<UsageRow[]>(
    () => [
      { label: 'AI Visual Enhancement', used: 420, limit: 1000, tone: 'primary' },
      { label: 'Virtual Staging Studio', used: 12, limit: 50, tone: 'warning' },
      { label: 'Neighborhood Intelligence', used: 85, limit: 200, tone: 'muted' },
    ],
    []
  );

  const invoices = useMemo<InvoiceRow[]>(
    () => [
      { id: 'inv-2026-01', billingCycle: 'Jan 01, 2026', description: 'Pro Team Monthly - 10 Seats', amount: '$249.00', status: 'paid' },
      { id: 'inv-2025-12', billingCycle: 'Dec 01, 2025', description: 'Pro Team Monthly - 10 Seats', amount: '$249.00', status: 'paid' },
      { id: 'inv-2025-11', billingCycle: 'Nov 01, 2025', description: 'Pro Team Monthly - 10 Seats', amount: '$249.00', status: 'paid' },
    ],
    []
  );

  const teamRows = useMemo<TeamRow[]>(
    () => [
      { id: 'm-1', memberName: 'Jane Smith', totalCredits: '4,200', primaryAction: 'Staging', lastActive: '2m ago' },
      { id: 'm-2', memberName: 'Mike Johnson', totalCredits: '1,850', primaryAction: 'Open House', lastActive: '1h ago' },
      { id: 'm-3', memberName: 'Sarah Lee', totalCredits: '1,120', primaryAction: 'Image Gen', lastActive: '4h ago' },
    ],
    []
  );

  const marketplaceItems = useMemo<MarketplaceItem[]>(
    () => [
      {
        id: 'svc-virtual-staging',
        title: 'Virtual Staging Pro',
        subtitle: 'Transform empty spaces with high-end designer furniture templates.',
        price: '$2.99',
        unit: 'per room',
        category: 'VISUALS',
        icon: 'home-outline',
      },
      {
        id: 'svc-neighborhood',
        title: 'AI Neighborhood Insight',
        subtitle: 'Custom demographics and school data reports for listing packages.',
        price: '$5.00',
        unit: 'per zip',
        category: 'INTELLIGENCE',
        icon: 'map-marker-outline',
      },
      {
        id: 'svc-brochure',
        title: 'Luxury Brochure Pack',
        subtitle: 'Premium print-ready marketing materials with custom branding.',
        price: '$15.00',
        unit: '10 designs',
        category: 'MARKETING',
        icon: 'file-document-outline',
      },
      {
        id: 'svc-seat',
        title: 'Team Seat Expansion',
        subtitle: 'Add an additional seat for a temporary agent or assistant.',
        price: '$15.00',
        unit: 'per month',
        category: 'SCALE',
        icon: 'plus',
      },
    ],
    []
  );

  const availableCapital = '$1,248.50';

  const ledgerRows = useMemo<LedgerRow[]>(
    () => [
      { id: '1', settlementDate: 'Jan 01, 2026', description: 'Pro Team Monthly - 10 Seats', transactionId: 'INV-2026-001', paymentSource: 'Visa .... 4242', amount: '$249.00', status: 'paid' },
      { id: '2', settlementDate: 'Dec 01, 2025', description: 'Pro Team Monthly - 10 Seats', transactionId: 'INV-2025-012', paymentSource: 'Visa .... 4242', amount: '$249.00', status: 'paid' },
      { id: '3', settlementDate: 'Nov 01, 2025', description: 'Professional Monthly - 2 Seats', transactionId: 'INV-2025-011', paymentSource: 'Visa .... 4242', amount: '$99.00', status: 'paid' },
    ],
    []
  );

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: '#F7FBFF',
      backgroundGradientTo: '#F7FBFF',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(11, 160, 178, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(91, 107, 122, ${opacity})`,
      fillShadowGradientFrom: '#0BA0B2',
      fillShadowGradientTo: '#1B5E9A',
      fillShadowGradientOpacity: 1,
      barPercentage: 0.64,
      propsForBackgroundLines: {
        stroke: '#E8EEF6',
        strokeDasharray: '4 6',
      },
    }),
    []
  );

  const consumptionTrendMonthly = useMemo(
    () => ({
      labels: ['Jan 01', 'Jan 05', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
      datasets: [{ data: [450, 780, 320, 950, 640, 820, 560] }],
    }),
    []
  );

  const consumptionTrendYearly = useMemo(
    () => ({
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{ data: [2840, 3120, 2680, 2950] }],
    }),
    []
  );

  const allocationPieData = useMemo(
    () => [
      { name: 'Visual Staging', population: 75, color: Theme.accentTeal, legendFontColor: Theme.textSecondary, legendFontSize: 12 },
      { name: 'Market Insight', population: 15, color: '#F97316', legendFontColor: Theme.textSecondary, legendFontSize: 12 },
      { name: 'Other Ops', population: 10, color: Theme.accentDark, legendFontColor: Theme.textSecondary, legendFontSize: 12 },
    ],
    []
  );

  const analyticsLeaderboardRows = useMemo<AnalyticsLeaderboardRow[]>(
    () => [
      { id: 'lb-1', name: 'Sarah Thompson', initials: 'ST', monthlyConsumption: '4,280 Units', primaryDomain: 'Visual Staging', peakActivity: 'Tuesdays', resourceHealth: 92, healthColor: Theme.accentTeal },
      { id: 'lb-2', name: 'Michael Chen', initials: 'MC', monthlyConsumption: '2,150 Units', primaryDomain: 'Flyer Design', peakActivity: 'Mondays', resourceHealth: 45, healthColor: '#F97316' },
      { id: 'lb-3', name: 'Elena Rodriguez', initials: 'ER', monthlyConsumption: '1,890 Units', primaryDomain: 'Direct Outreach', peakActivity: 'Fridays', resourceHealth: 78, healthColor: Theme.accentDark },
      { id: 'lb-4', name: 'David Smith', initials: 'DS', monthlyConsumption: '940 Units', primaryDomain: 'CRM Sync', peakActivity: 'Daily', resourceHealth: 98, healthColor: Theme.accentTeal },
    ],
    []
  );

  const [analyticsTimeRange, setAnalyticsTimeRange] = useState<'monthly' | 'yearly'>('monthly');
  const [leaderboardFilter, setLeaderboardFilter] = useState('');
  const filteredLeaderboardRows = useMemo(
    () =>
      leaderboardFilter.trim()
        ? analyticsLeaderboardRows.filter(
            (r) =>
              r.name.toLowerCase().includes(leaderboardFilter.toLowerCase().trim()) ||
              r.primaryDomain.toLowerCase().includes(leaderboardFilter.toLowerCase().trim())
          )
        : analyticsLeaderboardRows,
    [analyticsLeaderboardRows, leaderboardFilter]
  );

  const renderHistory = () => (
    <View style={{ gap: 16 }}>
      <BillingCard>
        <Text style={styles.cardTitle}>Full Financial Ledger</Text>
        <View style={styles.historyActions}>
          <Pressable style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Export CSV</Text>
          </Pressable>
          <Pressable style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Date Range</Text>
          </Pressable>
        </View>
        <View style={styles.ledgerList}>
          {ledgerRows.map((row, index) => (
            <View key={row.id} style={[styles.ledgerRow, index === 0 && styles.ledgerRowFirst]}>
              <Pressable
                style={styles.ledgerRowMain}
                onPress={() =>
                  openSettlementModal({
                    id: row.id,
                    billingCycle: row.settlementDate,
                    description: row.description,
                    amount: row.amount,
                    status: row.status === 'pending' ? 'due' : 'paid',
                  })
                }
              >
                <Text style={styles.ledgerDate}>{row.settlementDate}</Text>
                <Text style={styles.ledgerDesc} numberOfLines={1}>{row.description}</Text>
                <Pressable onPress={() => {}}>
                  <Text style={styles.ledgerId}>{row.transactionId}</Text>
                </Pressable>
                <Text style={styles.ledgerSource}>{row.paymentSource}</Text>
                <View style={styles.ledgerRowMeta}>
                  <Text style={styles.ledgerAmount}>{row.amount}</Text>
                  <View style={[styles.statusPill, row.status === 'paid' ? styles.statusPaid : styles.statusDue]}>
                    <Text style={[styles.statusText, row.status === 'paid' ? styles.statusTextPaid : styles.statusTextDue]}>
                      {row.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Pressable onPress={() => handleInvoiceDownload(row.id)} style={styles.downloadPdfButton}>
                <MaterialCommunityIcons name="download" size={20} color={Theme.textOnAccent} />
                <Text style={styles.downloadPdfButtonText}>PDF</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </BillingCard>
    </View>
  );

  const renderOverview = () => (
    <View style={{ gap: 16 }}>
      <View style={[styles.twoCol, styles.twoColMobile]}>
        <BillingCard>
          <View style={styles.planHeader}>
            <View style={styles.planIcon}>
              <MaterialCommunityIcons name="diamond-stone" size={18} color={Theme.accentTeal} />
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ENTERPRISE ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.planName}>Pro Team Edition</Text>
          <Text style={styles.planPrice}>
            $249.00 <Text style={styles.planPriceUnit}>/ monthly billing cycle</Text>
          </Text>
          <View style={styles.planFeatureList}>
            <View style={styles.planFeatureRow}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={Theme.textSecondary} />
              <Text style={styles.planFeatureText}>10 Professional Agent Seats</Text>
            </View>
            <View style={styles.planFeatureRow}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={Theme.textSecondary} />
              <Text style={styles.planFeatureText}>Full CRM & Data Integration</Text>
            </View>
            <View style={styles.planFeatureRow}>
              <MaterialCommunityIcons name="calendar" size={18} color={Theme.textSecondary} />
              <Text style={styles.planFeatureText}>Renews on Feb 12, 2026</Text>
            </View>
          </View>
          <Pressable style={styles.primaryButton} onPress={goToPlans}>
            <Text style={styles.primaryButtonText}>Manage Enterprise Tier</Text>
          </Pressable>
        </BillingCard>

        <BillingCard>
          <View style={styles.resourceCardHeader}>
            <Text style={styles.cardTitle}>Resource Consumption</Text>
            <Text style={styles.resourceSubtitle}>Real-time Audit</Text>
          </View>
          <View style={{ gap: 14 }}>
            {usageRows.map((row) => (
              <UsageProgressRow key={row.label} row={row} />
            ))}
          </View>
          <View style={styles.autoReplenishRow}>
            <View style={styles.autoReplenishLeft}>
              <View style={styles.autoReplenishIcon}>
                <MaterialCommunityIcons name="reload" size={18} color={Theme.accentTeal} />
              </View>
              <View>
                <Text style={styles.autoReplenishTitle}>Auto-Replenish Active</Text>
                <Text style={styles.autoReplenishSub}>Top up when below 10%</Text>
              </View>
            </View>
            <Pressable style={styles.adjustButton}>
              <Text style={styles.adjustButtonText}>Adjust</Text>
            </Pressable>
          </View>
        </BillingCard>
      </View>

      <View style={styles.financialSection}>
        <View style={styles.financialSectionHeader}>
          <Text style={styles.sectionTitle}>Financial History & Billing</Text>
          <Pressable onPress={() => goToTab('history')}>
            <Text style={styles.linkText}>View Full Ledger →</Text>
          </Pressable>
        </View>
        <BillingCard>
          {invoices.map((inv, index) => (
            <View key={inv.id} style={[styles.billingHistoryRow, index === 0 && styles.billingHistoryRowFirst]}>
              <Pressable style={styles.billingHistoryRowMain} onPress={() => openSettlementModal(inv)}>
                <Text style={styles.billingHistoryRowDate}>{inv.billingCycle}</Text>
                <Text style={styles.billingHistoryRowDesc} numberOfLines={1}>{inv.description}</Text>
                <View style={styles.billingHistoryRowMeta}>
                  <Text style={styles.billingHistoryRowAmount}>{inv.amount}</Text>
                  <View style={[styles.statusPill, styles.statusPaid]}>
                    <Text style={[styles.statusText, styles.statusTextPaid]}>{inv.status.toUpperCase()}</Text>
                  </View>
                </View>
              </Pressable>
              <Pressable onPress={() => handleInvoiceDownload(inv.id)} style={styles.downloadPdfButton}>
                <MaterialCommunityIcons name="download" size={20} color={Theme.textOnAccent} />
                <Text style={styles.downloadPdfButtonText}>PDF</Text>
              </Pressable>
            </View>
          ))}
        </BillingCard>
      </View>

      <BillingCard>
        <Text style={styles.paymentArchitectureTitle}>PRIMARY PAYMENT ARCHITECTURE</Text>
        <View style={styles.paymentCard}>
          <View style={styles.paymentIcon}>
            <MaterialCommunityIcons name="credit-card" size={20} color={Theme.iconMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentTitle}>Visa ending in 4242</Text>
            <Text style={styles.paymentSub}>Professional Corporate Account</Text>
          </View>
        </View>
        <View style={styles.paymentFooter}>
          <Text style={styles.paymentExpiry}>Expires 12/2026</Text>
          <Pressable onPress={openCredentialsModal}>
            <Text style={styles.linkText}>Update Credentials</Text>
          </Pressable>
        </View>
        <Pressable style={styles.outlineButton} onPress={() => {}}>
          <MaterialCommunityIcons name="plus" size={18} color={Theme.textPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.outlineButtonText}>Add Security Backup</Text>
        </Pressable>
      </BillingCard>
    </View>
  );

  const renderAnalytics = () => {
    const chartWidth = Math.max(280, Dimensions.get('window').width - 18 * 2 - 32);
    const consumptionData = analyticsTimeRange === 'monthly' ? consumptionTrendMonthly : consumptionTrendYearly;
    return (
      <View style={{ gap: 16 }}>
        <BillingCard>
          <View style={styles.analyticsCardHeader}>
            <View style={styles.analyticsCardHeaderTitle}>
              <Text style={styles.cardTitle}>Credit Consumption Trends</Text>
              <Text style={styles.cardSubtitle}>Resource utilization across all team members.</Text>
            </View>
           
          </View>
          <View style={styles.analyticsToggleRow}>
              <Pressable
                style={[styles.analyticsToggleBtn, analyticsTimeRange === 'monthly' && styles.analyticsToggleBtnActive]}
                onPress={() => setAnalyticsTimeRange('monthly')}
              >
                <Text style={[styles.analyticsToggleText, analyticsTimeRange === 'monthly' && styles.analyticsToggleTextActive]}>Monthly</Text>
              </Pressable>
              <Pressable
                style={[styles.analyticsToggleBtn, analyticsTimeRange === 'yearly' && styles.analyticsToggleBtnActive]}
                onPress={() => setAnalyticsTimeRange('yearly')}
              >
                <Text style={[styles.analyticsToggleText, analyticsTimeRange === 'yearly' && styles.analyticsToggleTextActive]}>Yearly</Text>
              </Pressable>
            </View>
          <View style={{ marginTop: 14, alignItems: 'center' }}>
            <BarChart
              data={consumptionData}
              width={chartWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars={true}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>
        </BillingCard>

        <View style={[styles.twoCol, styles.twoColMobile]}>
          <BillingCard>
            <Text style={styles.cardTitle}>Sub-Account Allocation</Text>
            <View style={styles.allocationCenterLabel}>
              <Text style={styles.allocationCenterValue}>10k</Text>
              <Text style={styles.allocationCenterUnit}>TOTAL UNITS</Text>
            </View>
            <View style={styles.allocationChartWrap}>
              <PieChart
                data={allocationPieData}
                width={Math.min(chartWidth * 0.9, 260)}
                height={160}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                center={[0, 0]}
                hasLegend={true}
                absolute={false}
              />
            </View>
          </BillingCard>

          <BillingCard style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Team Efficiency Leaderboard</Text>
            <View style={styles.leaderboardSearchWrap}>
              <MaterialCommunityIcons name="magnify" size={20} color={Theme.textSecondary} />
              <TextInput
                style={styles.leaderboardSearchInput}
                placeholder="Filter by agent..."
                placeholderTextColor={Theme.inputPlaceholder}
                value={leaderboardFilter}
                onChangeText={setLeaderboardFilter}
              />
            </View>
            <View style={styles.leaderboardCardList}>
              {filteredLeaderboardRows.length === 0 ? (
                <Text style={styles.leaderboardEmpty}>No agents match your search.</Text>
              ) : (
                filteredLeaderboardRows.map((row) => (
                  <View key={row.id} style={styles.leaderboardAgentCard}>
                    <View style={styles.leaderboardAgentCardHeader}>
                      <View style={[styles.leaderboardInitials, { backgroundColor: Theme.accentDark }]}>
                        <Text style={styles.leaderboardInitialsText}>{row.initials}</Text>
                      </View>
                      <Text style={styles.leaderboardAgentCardName}>{row.name}</Text>
                    </View>
                    <View style={styles.leaderboardAgentCardRow}>
                      <Text style={styles.leaderboardAgentCardLabel}>Monthly consumption</Text>
                      <Text style={styles.leaderboardAgentCardValue}>{row.monthlyConsumption}</Text>
                    </View>
                    <View style={styles.leaderboardAgentCardRow}>
                      <Text style={styles.leaderboardAgentCardLabel}>Primary domain</Text>
                      <Text style={styles.leaderboardAgentCardValue}>{row.primaryDomain}</Text>
                    </View>
                    <View style={styles.leaderboardAgentCardRow}>
                      <Text style={styles.leaderboardAgentCardLabel}>Peak activity</Text>
                      <Text style={styles.leaderboardAgentCardValue}>{row.peakActivity}</Text>
                    </View>
                    <View style={styles.leaderboardAgentCardRow}>
                      <Text style={styles.leaderboardAgentCardLabel}>Resource health</Text>
                      <View style={styles.leaderboardAgentCardHealth}>
                        <View style={styles.leaderboardHealthTrack}>
                          <View style={[styles.leaderboardHealthFill, { width: `${row.resourceHealth}%`, backgroundColor: row.healthColor }]} />
                        </View>
                        <Text style={styles.leaderboardHealthPct}>{row.resourceHealth}%</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </BillingCard>
        </View>
      </View>
    );
  };

  const renderMarketplace = () => (
    <View style={styles.marketplaceSection}>
      <View style={styles.marketplaceHeader}>
        <View style={styles.marketplaceHeaderText}>
          <Text style={styles.marketplaceTitle}>Premium Service Studio</Text>
          <Text style={styles.marketplaceSubtitle}>Acquire specialized AI resources for immediate professional deployment.</Text>
        </View>
      
      </View>
      <View style={styles.availableCapitalPill}>
          <MaterialCommunityIcons name="wallet-outline" size={18} color={Theme.textPrimary} />
          <View>
            <Text style={styles.availableCapitalLabel}>AVAILABLE CAPITAL</Text>
            <Text style={styles.availableCapitalValue}>{availableCapital}</Text>
          </View>
        </View>

      <View style={styles.marketplaceCardList}>
        {marketplaceItems.map((item) => (
          <View key={item.id} style={styles.marketplaceServiceCard}>
            <View style={styles.marketplaceCardTop}>
              <View style={styles.marketplaceCardIcon}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color={Theme.textSecondary} />
              </View>
              <View style={styles.marketplaceCategoryTag}>
                <Text style={styles.marketplaceCategoryText}>{item.category}</Text>
              </View>
            </View>
            <Text style={styles.marketplaceServiceTitle}>{item.title}</Text>
            <Text style={styles.marketplaceServiceDesc}>{item.subtitle}</Text>
            <View style={styles.marketplacePriceRow}>
              <Text style={styles.marketplacePrice}>{item.price}</Text>
              <Text style={styles.marketplaceUnit}> {item.unit}</Text>
            </View>
            <Pressable style={styles.marketplaceAcquireBtn} onPress={() => openAcquireModal(item)}>
              <MaterialCommunityIcons name="cart-outline" size={20} color={Theme.textOnAccent} />
              <Text style={styles.marketplaceAcquireBtnText}>Acquire Service</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.marketplaceBundlesSection}>
        <Text style={styles.marketplaceBundlesTag}>PRO PARTNERSHIP</Text>
        <Text style={styles.marketplaceBundlesTitle}>Brokerage Scale Bundles</Text>
        <Text style={styles.marketplaceBundlesDesc}>
          Deploy high-volume AI infrastructure across your entire team. Volume licensing includes custom support and dedicated compute resource allocation.
        </Text>
        <Pressable style={styles.marketplaceBundlesBtn} onPress={() => {}}>
          <Text style={styles.marketplaceBundlesBtnText}>View Enterprise Bundles</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={Theme.textPrimary} />
        </Pressable>
      </View>
    </View>
  );

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'history':
        return renderHistory();
      case 'analytics':
        return renderAnalytics();
      case 'marketplace':
        return renderMarketplace();
      default:
        return renderOverview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, chartConfig, usageRows, invoices, teamRows, marketplaceItems, ledgerRows, analyticsTimeRange, leaderboardFilter, filteredLeaderboardRows, consumptionTrendMonthly, consumptionTrendYearly, allocationPieData]);

  return (
    <>
      <LinearGradient
        colors={[...Theme.backgroundGradient]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.background, { paddingTop: insets.top }]}>
        <BillingScreenHeader activeTab={activeTab} onTabChange={goToTab} />
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {tabContent}
        </ScrollView>
      </LinearGradient>
      <PlanModal visible={showPlanModal} onClose={() => setShowPlanModal(false)} />

      <Modal visible={selectedInvoice !== null} transparent animationType="fade">
        <Pressable style={styles.settlementModalOverlay} onPress={closeSettlementModal}>
          <Pressable style={styles.settlementModalCard} onPress={(e) => e.stopPropagation()}>
            {selectedInvoice && (
              <>
                <View style={styles.settlementModalHeader}>
                  <View>
                    <Text style={styles.settlementModalTitle}>Official Settlement</Text>
                    <Text style={styles.settlementModalRef}>Reference No: {referenceNo(selectedInvoice.id)}</Text>
                  </View>
                  <Pressable onPress={closeSettlementModal} style={styles.settlementModalClose} hitSlop={12}>
                    <MaterialCommunityIcons name="close" size={22} color={Theme.textOnAccent} />
                  </Pressable>
                </View>
                <View style={styles.settlementModalBody}>
                  <View style={styles.settlementBillRow}>
                    <View>
                      <Text style={styles.settlementLabel}>BILL TO</Text>
                      <Text style={styles.settlementValue}>John Olakoya</Text>
                      <Text style={styles.settlementValue}>Zien Real Estate Group</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.settlementLabel}>ISSUE DATE</Text>
                      <Text style={styles.settlementValue}>{selectedInvoice.billingCycle}</Text>
                    </View>
                  </View>
                  <View style={styles.settlementDivider} />
                  <View style={styles.settlementLineRow}>
                    <Text style={styles.settlementLineDesc}>{selectedInvoice.description}</Text>
                    <Text style={styles.settlementLineAmount}>{selectedInvoice.amount}</Text>
                  </View>
                  <View style={styles.settlementLineRow}>
                    <Text style={styles.settlementLineDescMuted}>Tax (0.00%)</Text>
                    <Text style={styles.settlementLineAmountMuted}>$0.00</Text>
                  </View>
                  <View style={styles.settlementDivider} />
                  <View style={styles.settlementLineRow}>
                    <Text style={styles.settlementTotalLabel}>Total Amount Paid</Text>
                    <Text style={styles.settlementTotalAmount}>{selectedInvoice.amount}</Text>
                  </View>
                </View>
                <View style={styles.settlementModalFooter}>
                  <Pressable style={styles.settlementDownloadBtn} onPress={() => { handleInvoiceDownload(selectedInvoice.id); closeSettlementModal(); }}>
                    <Text style={styles.settlementDownloadBtnText}>Download Document</Text>
                    <MaterialCommunityIcons name="download" size={20} color={Theme.textOnAccent} />
                  </Pressable>
                  <Pressable style={styles.settlementCloseBtn} onPress={closeSettlementModal}>
                    <Text style={styles.settlementCloseBtnText}>Close</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={showCredentialsModal} transparent animationType="fade">
        <View style={styles.credentialsModalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeCredentialsModal} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.credentialsModalKAV}
          >
            <Pressable style={styles.credentialsModalCard} onPress={() => {}}>
                  <View style={styles.credentialsModalHeader}>
                    <View>
                      <Text style={styles.credentialsModalTitle}>Security Architecture</Text>
                      <Text style={styles.credentialsModalSubtitle}>Update your primary settlement credentials.</Text>
                    </View>
                    <Pressable onPress={closeCredentialsModal} style={styles.credentialsModalClose} hitSlop={12}>
                      <MaterialCommunityIcons name="close" size={22} color={Theme.textPrimary} />
                    </Pressable>
                  </View>
                  <ScrollView
                    style={styles.credentialsModalScroll}
                    contentContainerStyle={styles.credentialsModalScrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.credentialsInputLabel}>Account Holder Name</Text>
                    <TextInput
                      style={styles.credentialsInput}
                      value={credHolderName}
                      onChangeText={setCredHolderName}
                      placeholder="John Olakoya"
                      placeholderTextColor={Theme.inputPlaceholder}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                    <Text style={styles.credentialsInputLabel}>Primary Card Number</Text>
                    <TextInput
                      style={styles.credentialsInput}
                      value={credCardNumber}
                      onChangeText={setCredCardNumber}
                      placeholder="**** **** **** 4242"
                      placeholderTextColor={Theme.inputPlaceholder}
                      keyboardType="number-pad"
                      maxLength={19}
                    />
                    <View style={styles.credentialsRow}>
                      <View style={styles.credentialsRowItem}>
                        <Text style={styles.credentialsInputLabel}>Expiration Date</Text>
                        <TextInput
                          style={styles.credentialsInput}
                          value={credExpiry}
                          onChangeText={setCredExpiry}
                          placeholder="MM/YY"
                          placeholderTextColor={Theme.inputPlaceholder}
                          keyboardType="number-pad"
                          maxLength={5}
                        />
                      </View>
                      <View style={styles.credentialsRowItem}>
                        <Text style={styles.credentialsInputLabel}>Security Code (CVC)</Text>
                        <TextInput
                          style={styles.credentialsInput}
                          value={credCvc}
                          onChangeText={setCredCvc}
                          placeholder="•••"
                          placeholderTextColor={Theme.inputPlaceholder}
                          keyboardType="number-pad"
                          secureTextEntry
                          maxLength={4}
                        />
                      </View>
                    </View>
                    <View style={styles.credentialsSecurityBox}>
                      <MaterialCommunityIcons name="shield-check" size={20} color={Theme.textSecondary} />
                      <Text style={styles.credentialsSecurityText}>
                        Payments are secured with 256-bit bank-grade encryption. ZIEN never stores your full CVV on our servers.
                      </Text>
                    </View>
                  </ScrollView>
                  <View style={styles.credentialsModalFooter}>
                    <Pressable style={styles.credentialsAuthorizeBtn} onPress={handleAuthorizeUpdate}>
                      <Text style={styles.credentialsAuthorizeBtnText}>Authorize Update</Text>
                    </Pressable>
                    <Pressable style={styles.credentialsCancelBtn} onPress={closeCredentialsModal}>
                      <Text style={styles.credentialsCancelBtnText}>Cancel</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </KeyboardAvoidingView>
            </View>
      </Modal>

      <Modal visible={acquireModalItem !== null} transparent animationType="fade">
        <View style={styles.secureAccessModalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeAcquireModal} />
          <View style={styles.secureAccessModalCard}>
            <View style={styles.secureAccessModalHeader}>
              <Text style={styles.secureAccessModalTitle}>Secure Access</Text>
              <Pressable onPress={closeAcquireModal} style={styles.secureAccessModalClose} hitSlop={12}>
                <MaterialCommunityIcons name="close" size={22} color={Theme.textPrimary} />
              </Pressable>
            </View>
            {acquireModalItem && (
              <>
                <View style={styles.secureAccessServiceCard}>
                  <View style={styles.marketplaceCardIcon}>
                    <MaterialCommunityIcons name={acquireModalItem.icon as any} size={22} color={Theme.textSecondary} />
                  </View>
                  <View style={styles.secureAccessServiceInfo}>
                    <Text style={styles.secureAccessServiceName}>{acquireModalItem.title}</Text>
                    <Text style={styles.secureAccessServiceMeta}>System Allocation: Immediate</Text>
                  </View>
                  <Text style={styles.secureAccessServicePrice}>{acquireModalItem.price}</Text>
                </View>
                <View style={styles.secureAccessTotalRow}>
                  <Text style={styles.secureAccessTotalLabel}>Total Settlement Due</Text>
                  <Text style={styles.secureAccessTotalValue}>{acquireModalItem.price}</Text>
                </View>
                <Text style={styles.secureAccessPaymentLabel}>Confirm Payment Architecture</Text>
                <View style={styles.secureAccessPaymentRow}>
                  <MaterialCommunityIcons name="credit-card" size={22} color={Theme.iconMuted} />
                  <Text style={styles.secureAccessPaymentText}>Visa **** 4242</Text>
                  <MaterialCommunityIcons name="check-circle" size={24} color="#16A34A" />
                </View>
                <Pressable style={styles.secureAccessAuthorizeBtn} onPress={handleAuthorizeCapitalRelease}>
                  <Text style={styles.secureAccessAuthorizeBtnText}>Authorize Capital Release</Text>
                  <MaterialCommunityIcons name="arrow-top-right" size={20} color={Theme.textOnAccent} />
                </Pressable>
                <Text style={styles.secureAccessDisclaimer}>By confirming, you authorize ZIEN to process this one-time transaction.</Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={settlementConfirmedVisible} transparent animationType="fade">
        <View style={styles.settlementConfirmedOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSettlementConfirmed} />
          <View style={styles.settlementConfirmedCard}>
            <View style={styles.settlementConfirmedIcon}>
              <MaterialCommunityIcons name={'sparkles' as any} size={32} color={Theme.textOnAccent} />
            </View>
            <Text style={styles.settlementConfirmedTitle}>Settlement Confirmed</Text>
            <Text style={styles.settlementConfirmedDesc}>
              Your resource allocation has been updated and capital has been authorized for release.
            </Text>
            <Pressable style={styles.settlementConfirmedBtn} onPress={closeSettlementConfirmed}>
              <Text style={styles.settlementConfirmedBtnText}>Return to Dashboard</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 16,
  },
  twoCol: {
    gap: 16,
  },
  twoColMobile: {
    flexDirection: 'column' as const,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  exportButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.surfaceSoft,
  },
  exportButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  ledgerList: {
    marginTop: 16,
    gap: 0,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Theme.rowBorder,
  },
  ledgerRowFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  ledgerRowMain: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  ledgerRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  ledgerDate: {
    fontSize: 14,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  ledgerDesc: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  ledgerId: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.accentTeal,
  },
  ledgerSource: {
    fontSize: 12,
    color: Theme.textSecondary,
  },
  ledgerAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  downloadIconButton: {
    padding: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: '#5B6B7A',
    marginTop: 4,
  },
  linkText: {
    fontSize: 12.5,
    color: '#0BA0B2',
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  planIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Theme.cardBackgroundSoft,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planName: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.textPrimary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.accentTeal,
  },
  planPriceUnit: {
    fontSize: 13,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  planFeatureList: {
    gap: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planFeatureText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  activeBadge: {
    backgroundColor: Theme.cardBackgroundSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Theme.textSecondary,
    letterSpacing: 0.5,
  },
  resourceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resourceSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  autoReplenishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Theme.rowBorder,
  },
  autoReplenishLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  autoReplenishIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Theme.cardBackgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoReplenishTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  autoReplenishSub: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  adjustButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.surfaceSoft,
  },
  adjustButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  financialSection: {
    gap: 10,
  },
  financialSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billingHistoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Theme.rowBorder,
  },
  billingHistoryRowFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  billingHistoryRowMain: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  billingHistoryRowDate: {
    fontSize: 14,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  billingHistoryRowDesc: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  billingHistoryRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  billingHistoryRowAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  downloadPdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Theme.accentTeal,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    minWidth: 72,
  },
  downloadPdfButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.textOnAccent,
  },
  billingTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Theme.rowBorder,
    gap: 8,
  },
  billingTableHeaderText: {
    fontSize: 10,
    fontWeight: '900',
    color: Theme.textSecondary,
    letterSpacing: 0.5,
  },
  billingTableDescCol: {
    flex: 1,
    minWidth: 0,
  },
  billingTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.rowBorder,
    gap: 8,
  },
  pdfDownload: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pdfDownloadText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.accentTeal,
  },
  paymentArchitectureTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Theme.textPrimary,
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  paymentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  paymentExpiry: {
    fontSize: 12,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  planMetaGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  planMetaItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 6,
  },
  metaLabel: {
    fontSize: 11.5,
    color: '#7B8794',
    fontWeight: '700',
  },
  metaValue: {
    fontSize: 12.5,
    color: '#0B2D3E',
    fontWeight: '800',
  },
  primaryButton: {
    backgroundColor: '#0B2D3E',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12.5,
  },
  usageRow: {
    gap: 10,
  },
  usageRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  usageLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  usageValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7B8794',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    borderRadius: 999,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F7FBFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: '#5B6B7A',
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  invoiceLeft: {
    flex: 1,
    gap: 6,
  },
  invoiceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  invoiceCycle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  invoiceDesc: {
    fontSize: 12.5,
    color: '#5B6B7A',
  },
  invoiceAmount: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B2D3E',
    minWidth: 72,
    textAlign: 'right',
  },
  billingList: {
    marginTop: 12,
    gap: 12,
  },
  billingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
    gap: 12,
  },
  billingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  billingDate: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  billingDesc: {
    marginTop: 4,
    fontSize: 12.5,
    color: '#5B6B7A',
    fontWeight: '700',
    lineHeight: 17,
  },
  billingRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  billingAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  invoiceDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  invoiceDownloadIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EAF6F8',
    borderWidth: 1,
    borderColor: '#CFECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceDownloadTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  invoiceDownloadSub: {
    marginTop: 2,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#7B8794',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  statusPaid: {
    backgroundColor: '#EAF6F8',
    borderColor: '#CFECEF',
  },
  statusDue: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  statusTextPaid: {
    color: '#0BA0B2',
  },
  statusTextDue: {
    color: '#B45309',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  paymentSub: {
    marginTop: 2,
    fontSize: 12,
    color: '#7B8794',
    fontWeight: '700',
  },
  outlineButton: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: '#0B2D3E',
    fontWeight: '900',
    fontSize: 12.5,
  },
  chart: {
    borderRadius: 18,
  },
  analyticsCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  analyticsCardHeaderTitle: {
    flex: 1,
    minWidth: 0,
  },
  analyticsToggleRow: {
    flexDirection: 'row',
    gap: 5,
    flexShrink: 0,
    alignSelf:"flex-end"
  },
  analyticsToggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsToggleBtnActive: {
    backgroundColor: Theme.accentDark,
    borderColor: Theme.accentDark,
  },
  analyticsToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  analyticsToggleTextActive: {
    color: Theme.textOnAccent,
  },
  allocationChartWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  allocationCenterLabel: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  allocationCenterValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  allocationCenterUnit: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  leaderboardSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Theme.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  leaderboardSearchInput: {
    flex: 1,
    fontSize: 14,
    color: Theme.textPrimary,
    padding: 0,
  },
  leaderboardCardList: {
    gap: 12,
    marginTop: 4,
  },
  leaderboardEmpty: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
  leaderboardAgentCard: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    padding: 16,
    gap: 12,
  },
  leaderboardAgentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  leaderboardAgentCardName: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.textPrimary,
    flex: 1,
  },
  leaderboardAgentCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  leaderboardAgentCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  leaderboardAgentCardValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  leaderboardAgentCardHealth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    justifyContent: 'flex-end',
  },
  leaderboardTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.rowBorder,
    gap: 8,
  },
  leaderboardTh: {
    fontSize: 9,
    fontWeight: '900',
    color: Theme.textSecondary,
    letterSpacing: 0.4,
  },
  leaderboardThAgent: {
    flex: 1.2,
    minWidth: 0,
  },
  leaderboardThNarrow: {
    flex: 0.7,
    minWidth: 0,
  },
  leaderboardThDomain: {
    flex: 0.9,
    minWidth: 0,
  },
  leaderboardThPeak: {
    flex: 0.6,
    minWidth: 0,
  },
  leaderboardThHealth: {
    flex: 0.8,
    minWidth: 0,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.rowBorder,
    gap: 8,
  },
  leaderboardAgent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1.2,
    minWidth: 0,
  },
  leaderboardInitials: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardInitialsText: {
    fontSize: 11,
    fontWeight: '900',
    color: Theme.textOnAccent,
  },
  leaderboardName: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.textPrimary,
    flex: 1,
  },
  leaderboardCell: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  leaderboardHealthCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardHealthTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.surfaceIcon,
    overflow: 'hidden',
    flex: 1,
    minWidth: 40,
  },
  leaderboardHealthFill: {
    height: 8,
    borderRadius: 4,
  },
  leaderboardHealthPct: {
    fontSize: 11,
    fontWeight: '800',
    color: Theme.textPrimary,
    marginLeft: 6,
    minWidth: 28,
  },
  tableHeader: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#7B8794',
    letterSpacing: 0.6,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  teamName: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  teamMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#7B8794',
    fontWeight: '700',
  },
  teamCredits: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0BA0B2',
  },
  marketTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  marketPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0BA0B2',
  },
  marketUnit: {
    fontSize: 12.5,
    color: '#7B8794',
    fontWeight: '800',
  },
  marketplaceSection: {
    gap: 20,
  },
  marketplaceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  marketplaceHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  marketplaceTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  marketplaceSubtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  availableCapitalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Theme.cardBackground,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    alignSelf:"flex-end"
  },
  availableCapitalLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Theme.textSecondary,
    letterSpacing: 0.8,
  },
  availableCapitalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textPrimary,
    marginTop: 2,
  },
  marketplaceCardList: {
    gap: 14,
  },
  marketplaceServiceCard: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    padding: 18,
    gap: 12,
  },
  marketplaceCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  marketplaceCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Theme.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketplaceCategoryTag: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
  },
  marketplaceCategoryText: {
    fontSize: 10,
    fontWeight: '900',
    color: Theme.textPrimary,
    letterSpacing: 0.5,
  },
  marketplaceServiceTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  marketplaceServiceDesc: {
    fontSize: 13,
    color: Theme.textSecondary,
    lineHeight: 19,
    fontWeight: '600',
  },
  marketplacePriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  marketplacePrice: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  marketplaceUnit: {
    fontSize: 13,
    color: Theme.textSecondary,
    fontWeight: '700',
    marginLeft: 4,
  },
  marketplaceAcquireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.accentDark,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  marketplaceAcquireBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textOnAccent,
  },
  marketplaceBundlesSection: {
    backgroundColor: Theme.accentDark,
    borderRadius: 22,
    padding: 22,
    gap: 12,
  },
  marketplaceBundlesTag: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.8,
  },
  marketplaceBundlesTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.textOnAccent,
  },
  marketplaceBundlesDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    fontWeight: '600',
  },
  marketplaceBundlesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.cardBackground,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  marketplaceBundlesBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  secureAccessModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  secureAccessModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Theme.cardBackground,
    borderRadius: 22,
    padding: 22,
    overflow: 'hidden',
  },
  secureAccessModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  secureAccessModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  secureAccessModalClose: {
    padding: 4,
  },
  secureAccessServiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Theme.surfaceMuted,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  secureAccessServiceInfo: {
    flex: 1,
    minWidth: 0,
  },
  secureAccessServiceName: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  secureAccessServiceMeta: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  secureAccessServicePrice: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  secureAccessTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  secureAccessTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  secureAccessTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  secureAccessPaymentLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.textPrimary,
    marginBottom: 10,
  },
  secureAccessPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Theme.cardBackground,
    borderWidth: 1,
    borderColor: Theme.borderInput,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  secureAccessPaymentText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textPrimary,
    flex: 1,
  },
  secureAccessAuthorizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.accentDark,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  secureAccessAuthorizeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textOnAccent,
  },
  secureAccessDisclaimer: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  settlementConfirmedOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  settlementConfirmedCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Theme.cardBackground,
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
  },
  settlementConfirmedIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  settlementConfirmedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.textPrimary,
    marginBottom: 10,
  },
  settlementConfirmedDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  settlementConfirmedBtn: {
    width: '100%',
    backgroundColor: Theme.accentDark,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  settlementConfirmedBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textOnAccent,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 45, 62, 0.45)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  modalCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  modalSubtitle: {
    marginTop: 4,
    fontSize: 12.5,
    color: '#5B6B7A',
    fontWeight: '700',
  },
  planScroller: {
    paddingTop: 14,
    paddingBottom: 4,
    gap: 12,
  },
  planCard: {
    width: 230,
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 12,
    overflow: 'hidden',
  },
  planCardCurrent: {
    borderColor: '#0BA0B2',
    backgroundColor: '#FFFFFF',
  },
  currentPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0B2D3E',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  currentPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  planTier: {
    fontSize: 11,
    fontWeight: '900',
    color: '#7B8794',
    letterSpacing: 0.9,
  },
  planModalPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  planModalUnit: {
    paddingBottom: 5,
    fontSize: 12,
    fontWeight: '800',
    color: '#7B8794',
  },
  planBulletList: {
    gap: 8,
  },
  planBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: '#0BA0B2',
  },
  planBulletText: {
    flex: 1,
    fontSize: 12.25,
    fontWeight: '700',
    color: '#0B2D3E',
    lineHeight: 16.5,
  },
  planCta: {
    marginTop: 6,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  planCtaDark: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  planCtaAccent: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  planCtaDisabled: {
    backgroundColor: '#EEF3F8',
    borderColor: '#E3ECF4',
  },
  planCtaText: {
    fontSize: 12.5,
    fontWeight: '900',
  },
  planCtaTextDark: {
    color: '#FFFFFF',
  },
  planCtaTextAccent: {
    color: '#FFFFFF',
  },
  planCtaTextDisabled: {
    color: '#9AA7B6',
  },
  warningIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTitle: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    textAlign: 'center',
  },
  confirmBody: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5B6B7A',
    textAlign: 'center',
    lineHeight: 18,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  confirmOutline: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  confirmOutlineText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  confirmPrimary: {
    flex: 1,
    backgroundColor: '#F97316',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmPrimaryText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sparkleIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#EAF6F8',
    borderWidth: 1,
    borderColor: '#CFECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    textAlign: 'center',
  },
  successBody: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5B6B7A',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Official Settlement modal
  settlementModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  settlementModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Theme.cardBackground,
    borderRadius: 20,
    overflow: 'hidden',
  },
  settlementModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: Theme.accentDark,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  settlementModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.textOnAccent,
  },
  settlementModalRef: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  settlementModalClose: {
    padding: 4,
  },
  settlementModalBody: {
    padding: 20,
    gap: 16,
  },
  settlementBillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  settlementLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  settlementValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  settlementDivider: {
    height: 1,
    backgroundColor: Theme.rowBorder,
  },
  settlementLineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementLineDesc: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textPrimary,
    flex: 1,
  },
  settlementLineAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  settlementLineDescMuted: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textSecondary,
    flex: 1,
  },
  settlementLineAmountMuted: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  settlementTotalLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  settlementTotalAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  settlementModalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.rowBorder,
  },
  settlementDownloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.accentDark,
    paddingVertical: 14,
    borderRadius: 14,
  },
  settlementDownloadBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textOnAccent,
  },
  settlementCloseBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.cardBackground,
    justifyContent: 'center',
  },
  settlementCloseBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
  // Security Architecture (Update Credentials) modal
  credentialsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  credentialsModalKAV: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  credentialsModalCard: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 24,
    overflow: 'hidden',
    maxHeight: '100%',
  },
  credentialsModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  credentialsModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.textPrimary,
  },
  credentialsModalSubtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginTop: 4,
  },
  credentialsModalClose: {
    padding: 4,
  },
  credentialsModalScroll: {
    maxHeight: 400,
  },
  credentialsModalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  credentialsInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.textPrimary,
    marginBottom: 6,
  },
  credentialsInput: {
    backgroundColor: Theme.cardBackground,
    borderWidth: 1,
    borderColor: Theme.borderInput,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Theme.textPrimary,
  },
  credentialsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  credentialsRowItem: {
    flex: 1,
  },
  credentialsSecurityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Theme.surfaceMuted,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  credentialsSecurityText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Theme.textSecondary,
    lineHeight: 18,
  },
  credentialsModalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.rowBorder,
  },
  credentialsAuthorizeBtn: {
    flex: 1,
    backgroundColor: Theme.accentDark,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  credentialsAuthorizeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textOnAccent,
  },
  credentialsCancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    backgroundColor: Theme.cardBackground,
    justifyContent: 'center',
  },
  credentialsCancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.textPrimary,
  },
});

