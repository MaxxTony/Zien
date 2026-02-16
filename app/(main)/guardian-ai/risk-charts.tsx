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
import { LineChart } from 'react-native-chart-kit';
import { GuardianScreenShell } from './_components/GuardianScreenShell';

const METRIC_CARDS = [
  {
    id: 'situational',
    icon: 'alert' as const,
    label: 'SITUATIONAL RISK',
    value: '12%',
    status: 'Dynamic Rating: Low',
    statusRed: true,
  },
  {
    id: 'regional',
    icon: 'chart-line' as const,
    label: 'REGIONAL SAFETY',
    value: '94%',
    status: 'Zone Protocol: Stable',
    statusRed: false,
  },
  {
    id: 'success',
    icon: 'shield-check-outline' as const,
    label: 'SUCCESS QUOTIENT',
    value: '99.8%',
    status: 'Escalations Avoided',
    statusRed: false,
  },
];

const RISK_DRIVERS = [
  { id: '1', icon: 'cog-outline' as const, name: 'Night Protocol Deficit', pts: '+18.4 pts' },
  { id: '2', icon: 'crosshairs' as const, name: 'Identity Verification Latency', pts: '+22.1 pts' },
  { id: '3', icon: 'lightning-bolt-outline' as const, name: 'Regional Incident Surge', pts: '+14.8 pts' },
  { id: '4', icon: 'timer-sand' as const, name: 'Escalation Timer Buffer', pts: '+20.2 pts' },
];

const CHART_LABELS = ['0h', '4h', '8h', '12h', '16h', '20h', 'Now'];

// Demo data: risk trajectory over 24h (lower = better)
const ACTIVE_RISK_DATA = [22, 18, 25, 14, 20, 16, 12];
const HISTORIC_RISK_DATA = [28, 24, 30, 22, 26, 20, 18];

export default function GuardianRiskChartsScreen() {
  const [trajectoryView, setTrajectoryView] = useState<'active' | 'historic'>('active');
  const { width } = Dimensions.get('window');
  const chartWidth = Math.max(280, width - 18 * 2 - 36);

  const trajectoryData = useMemo(
    () => ({
      labels: CHART_LABELS,
      datasets: [
        {
          data: trajectoryView === 'active' ? ACTIVE_RISK_DATA : HISTORIC_RISK_DATA,
        },
      ],
    }),
    [trajectoryView]
  );

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#FFFFFF',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(11, 160, 178, ${opacity * 0.9})`,
      labelColor: (opacity = 1) => `rgba(91, 107, 122, ${opacity})`,
      strokeWidth: 2,
      propsForDots: { r: '4' },
      propsForBackgroundLines: { stroke: '#E8EEF6', strokeDasharray: '4 6' },
    }),
    []
  );

  return (
    <GuardianScreenShell
      title="Security Risk Architecture"
      subtitle="High-precision predictive modeling for regional and situational risk factors."
      showBack={true}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Export Intelligence */}
        <Pressable style={styles.exportBtn}>
          <MaterialCommunityIcons name="download-outline" size={18} color="#0B2D3E" />
          <Text style={styles.exportBtnText}>Export Intelligence</Text>
        </Pressable>

        {/* Key metric cards */}
        <View style={styles.metricRow}>
          {METRIC_CARDS.map((m) => (
            <View key={m.id} style={styles.metricCard}>
              <View style={[styles.metricIconWrap, m.statusRed && styles.metricIconWrapRed]}>
                <MaterialCommunityIcons
                  name={m.icon}
                  size={20}
                  color={m.statusRed ? '#DC2626' : '#0BA0B2'}
                />
              </View>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={[styles.metricStatus, m.statusRed && styles.metricStatusRed]}>
                {m.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Predictive Risk Trajectory */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Predictive Risk Trajectory</Text>
          <Text style={styles.cardSubtitle}>
            AI-driven analysis of incident likelihood over the next 24h.
          </Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleBtn, trajectoryView === 'active' && styles.toggleBtnActive]}
              onPress={() => setTrajectoryView('active')}>
              <Text style={[styles.toggleText, trajectoryView === 'active' && styles.toggleTextActive]}>
                Active
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, trajectoryView === 'historic' && styles.toggleBtnActive]}
              onPress={() => setTrajectoryView('historic')}>
              <Text style={[styles.toggleText, trajectoryView === 'historic' && styles.toggleTextActive]}>
                Historic
              </Text>
            </Pressable>
          </View>
          <View style={styles.chartWrap}>
            <LineChart
              data={trajectoryData}
              width={chartWidth}
              height={160}
              withDots
              withInnerLines
              withVerticalLabels
              withHorizontalLabels
              fromZero
              yAxisSuffix="%"
              chartConfig={chartConfig as any}
              style={styles.chartStyle}
              bezier
            />
          </View>
        </View>

        {/* Dynamic Risk Drivers */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dynamic Risk Drivers</Text>
          {RISK_DRIVERS.map((d, idx) => (
            <View key={d.id} style={[styles.driverRow, idx === 0 && { borderTopWidth: 0 }]}>
              <MaterialCommunityIcons name={d.icon} size={22} color="#0B2D3E" />
              <Text style={styles.driverName}>{d.name}</Text>
              <Text style={styles.driverPts}>{d.pts}</Text>
            </View>
          ))}
        </View>

        {/* Protocol Enforcement */}
        <View style={styles.protocolCard}>
          <MaterialCommunityIcons name="shield-outline" size={28} color="#FFFFFF" />
          <View style={styles.protocolText}>
            <Text style={styles.protocolLabel}>PROTOCOL ENFORCEMENT</Text>
            <Text style={styles.protocolDesc}>
              Based on active risk drivers, the system has prioritized high-fidelity verification for all new prospects.
            </Text>
          </View>
          <Pressable style={styles.counterMeasuresBtn}>
            <Text style={styles.counterMeasuresBtnText}>Deploy Counter-Measures</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </GuardianScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24 },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  exportBtnText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 6,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconWrapRed: { backgroundColor: 'rgba(220, 38, 38, 0.1)' },
  metricLabel: { fontSize: 9, fontWeight: '900', color: '#7B8794', letterSpacing: 0.4 },
  metricValue: { fontSize: 20, fontWeight: '900', color: '#0B2D3E' },
  metricStatus: { fontSize: 11, fontWeight: '800', color: '#16A34A' },
  metricStatusRed: { color: '#DC2626' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    marginBottom: 16,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0B2D3E' },
  cardSubtitle: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', marginTop: 4, lineHeight: 18 },
  toggleRow: { flexDirection: 'row', gap: 10, marginTop: 14, marginBottom: 12 },
  toggleBtn: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0BA0B2',
    backgroundColor: '#FFFFFF',
  },
  toggleBtnActive: { backgroundColor: 'rgba(11, 160, 178, 0.12)' },
  toggleText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  toggleTextActive: { color: '#0B2D3E' },
  chartWrap: {
    marginTop: 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  chartStyle: { borderRadius: 16, paddingRight: 20 },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  driverName: { flex: 1, fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  driverPts: { fontSize: 13, fontWeight: '800', color: '#DC2626' },
  protocolCard: {
    backgroundColor: '#0B2D3E',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 14,
  },
  protocolText: { gap: 6 },
  protocolLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
  },
  protocolDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  counterMeasuresBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  counterMeasuresBtnText: { fontSize: 14, fontWeight: '900', color: '#0B2D3E' },
  bottomSpacer: { height: 8 },
});
