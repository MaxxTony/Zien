import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { ZienCardScreenShell } from './_components/ZienCardScreenShell';

const KPI_CARDS = [
  { key: 'views', label: 'Total Views', value: '1,248', icon: 'eye-outline' as const, trend: '+12%', trendUp: true },
  { key: 'clicks', label: 'Link Clicks', value: '384', icon: 'cursor-default-click-outline' as const, trend: '+5%', trendUp: true },
  { key: 'saves', label: 'Contact Saves', value: '156', icon: 'download-outline' as const, trend: '-2%', trendUp: false },
  { key: 'shares', label: 'Shares', value: '89', icon: 'share-variant-outline' as const, trend: '+8%', trendUp: true },
];

// Demo: Activity Mon–Sun (two series)
const ACTIVITY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const ACTIVITY_DATA_BLUE = [18, 35, 52, 48, 78, 65, 42];
const ACTIVITY_DATA_GREEN = [12, 28, 40, 38, 58, 48, 30];

// Demo: Traffic source
const TRAFFIC_DATA = [
  { name: 'Mobile', population: 75, color: '#0B6B9E', legendFontColor: '#5B6B7A', legendFontSize: 12 },
  { name: 'Desktop', population: 20, color: '#059669', legendFontColor: '#5B6B7A', legendFontSize: 12 },
  { name: 'Tablet', population: 5, color: '#EA580C', legendFontColor: '#5B6B7A', legendFontSize: 12 },
];

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(11, 45, 62, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(91, 107, 122, ${opacity})`,
  strokeWidth: 2,
  propsForDots: { r: '3' },
  propsForBackgroundLines: { stroke: '#E8EEF4', strokeDasharray: '4 4' },
  fillShadowGradientFrom: '#0B6B9E',
  fillShadowGradientTo: '#0B6B9E',
  fillShadowGradientOpacity: 0.25,
};

export default function ZienCardAnalyticsScreen() {
  const [dateRange] = useState<string>('Last 7 Days');
  const { width } = Dimensions.get('window');
  const chartWidth = Math.max(280, width - 18 * 2 - 24);

  const activityChartData = useMemo(
    () => ({
      labels: ACTIVITY_LABELS,
      datasets: [
        {
          data: ACTIVITY_DATA_BLUE,
          color: (opacity = 1) => `rgba(11, 107, 158, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: ACTIVITY_DATA_GREEN,
          color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    }),
    []
  );

  const lineChartConfig = useMemo(
    () => ({
      ...chartConfig,
      color: (opacity = 1) => `rgba(11, 107, 158, ${opacity})`,
    }),
    []
  );

  return (
    <ZienCardScreenShell
      title="Analytics"
      subtitle="Track performance and engagement of your digital card."
     >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
           <Pressable
          style={styles.dateRangeBtn}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Date range">
          <MaterialCommunityIcons name="calendar-outline" size={18} color="#5B6B7A" />
          <Text style={styles.dateRangeBtnText}>{dateRange}</Text>
        </Pressable>
        {/* KPI cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiRow}
          style={styles.kpiScroll}>
          {KPI_CARDS.map((kpi) => (
            <View key={kpi.key} style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <MaterialCommunityIcons name={kpi.icon} size={20} color="#0B2D3E" />
              </View>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <View style={styles.trendRow}>
                <MaterialCommunityIcons
                  name={kpi.trendUp ? 'trending-up' : 'trending-down'}
                  size={14}
                  color={kpi.trendUp ? '#059669' : '#DC2626'}
                />
                <Text style={[styles.trendText, { color: kpi.trendUp ? '#059669' : '#DC2626' }]}>
                  {kpi.trend}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Activity Overview */}
        <View style={styles.chartCard}>
          <Text style={styles.chartCardTitle}>Activity Overview</Text>
          <View style={styles.lineChartWrap}>
            <LineChart
              data={activityChartData}
              width={chartWidth}
              height={200}
              withDots
              withInnerLines
              withVerticalLabels
              withHorizontalLabels
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={lineChartConfig as any}
              style={styles.chartStyle}
              bezier
            />
          </View>
        </View>

        {/* Traffic Source */}
        <View style={styles.chartCard}>
          <Text style={styles.chartCardTitle}>Traffic Source</Text>
          <View style={styles.pieChartWrap}>
            <PieChart
              data={TRAFFIC_DATA}
              width={Math.min(chartWidth, 270)}
              height={170}
              chartConfig={chartConfig as any}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              center={[0, 0]}
              hasLegend
              absolute={false}
            />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ZienCardScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24 },
  dateRangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  dateRangeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B6B7A',
  },
  kpiScroll: { marginHorizontal: -18, marginBottom: 20 },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  kpiCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
  },
  kpiIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8EEF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '800',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
    marginBottom: 16,
  },
  chartCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 14,
  },
  lineChartWrap: {
    marginHorizontal: -8,
    alignItems: 'center',
  },
  chartStyle: {
    borderRadius: 12,
  },
  pieChartWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  bottomSpacer: { height: 24 },
});
