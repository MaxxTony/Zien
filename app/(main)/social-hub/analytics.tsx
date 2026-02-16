import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PLATFORMS = [
  { name: 'Instagram', pct: 65, color: '#7C3AED' },
  { name: 'Facebook', pct: 20, color: '#5B6B7A' },
  { name: 'LinkedIn', pct: 15, color: '#0BA0B2' },
];

const KPI_CARDS = [
  { title: 'CLICK THRU RATE', value: '3.2%', change: '+0.8% vs last mo', valueColor: '#0BA0B2' },
  { title: 'WEB VISITS', value: '1,420', change: '+240 vs last mo', valueColor: '#0B2D3E' },
  { title: 'LEADS GENERATED', value: '28', change: '+12 vs last mo', valueColor: '#EA580C' },
];

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [dateRange] = useState('Last 30 Days');

  const { width } = Dimensions.get('window');
  const padding = 16;
  const chartWidth = Math.max(280, width - padding * 2 - 24);

  const engagementData = useMemo(
    () => ({
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      datasets: [{ data: [12, 18, 14, 22, 19, 26] }],
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
          <Text style={styles.title}>Performance Analytics</Text>
          <Text style={styles.subtitle}>
            Deep dive into your social reach and lead conversion.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {/* Date range + Export */}
        <View style={styles.topActions}>
          <Pressable style={styles.dateRangeBtn}>
            <Text style={styles.dateRangeText}>{dateRange}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
          </Pressable>
          <Pressable style={styles.exportBtn}>
            <Text style={styles.exportBtnText}>Export Report</Text>
          </Pressable>
        </View>

        {/* Engagement Growth */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Engagement Growth</Text>
          <View style={styles.chartWrap}>
            <BarChart
              data={engagementData}
              width={chartWidth}
              height={200}
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
        </View>

        {/* Platform Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Platform Distribution</Text>
          {PLATFORMS.map((p) => (
            <View key={p.name} style={styles.platformRow}>
              <Text style={styles.platformName}>{p.name}</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${p.pct}%`, backgroundColor: p.color }]} />
              </View>
              <Text style={styles.platformPct}>{p.pct}%</Text>
            </View>
          ))}
          <View style={styles.aiInsight}>
            <MaterialCommunityIcons name="star-four-points" size={16} color="#0BA0B2" />
            <Text style={styles.aiInsightLabel}>AI INSIGHT</Text>
          </View>
          <Text style={styles.aiInsightText}>
            "Instagram Stories perform 42% better for video-tours between 6 PM and 8 PM."
          </Text>
        </View>

        {/* KPI cards - stack on mobile */}
        <View style={styles.kpiGrid}>
          {KPI_CARDS.map((kpi) => (
            <View key={kpi.title} style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>{kpi.title}</Text>
              <Text style={[styles.kpiValue, { color: kpi.valueColor }]}>{kpi.value}</Text>
              <Text style={styles.kpiChange}>{kpi.change}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 4,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  dateRangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  dateRangeText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  exportBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0BA0B2',
    backgroundColor: 'rgba(11, 160, 178, 0.08)',
  },
  exportBtnText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 14,
  },
  chartWrap: { marginHorizontal: -8, alignItems: 'center' },
  chart: { borderRadius: 16 },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  platformName: { fontSize: 14, fontWeight: '600', color: '#0B2D3E', width: 72 },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#E8EEF6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 5 },
  platformPct: { fontSize: 13, fontWeight: '700', color: '#5B6B7A', width: 36, textAlign: 'right' },
  aiInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 6,
  },
  aiInsightLabel: { fontSize: 11, fontWeight: '800', color: '#0BA0B2', letterSpacing: 0.5 },
  aiInsightText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6B7A',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
  },
  kpiTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  kpiValue: { fontSize: 24, fontWeight: '900' },
  kpiChange: { fontSize: 12, fontWeight: '600', color: '#16A34A', marginTop: 4 },
});
