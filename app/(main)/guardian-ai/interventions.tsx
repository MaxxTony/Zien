import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GuardianScreenShell } from './_components/GuardianScreenShell';

const METRIC_CARDS = [
  { id: 'alerts', icon: 'bell-outline' as const, label: 'ACTIVE ALERTS', value: '18', color: '#0BA0B2' },
  { id: 'calls', icon: 'phone-outline' as const, label: 'AUTO-CALLS', value: '42', color: '#0BA0B2' },
  { id: 'rescues', icon: 'alert' as const, label: 'CRITICAL RESCUES', value: '02', color: '#EA580C' },
  { id: 'rate', icon: 'shield-check-outline' as const, label: 'RESOLUTION RATE', value: '100%', color: '#0BA0B2' },
];

const LEDGER_ROWS = [
  { id: '1', timestamp: 'Today 2:18 PM', event: 'Silent Alert Triggered', agent: 'John Olakoya', protocol: 'T-Tap SOS', riskLevel: 'CRITICAL', riskStyle: 'critical', status: 'Resolved' },
  { id: '2', timestamp: 'Yesterday 6:04 PM', event: 'Geo-fence Exit Escalation', agent: 'Maria West', protocol: 'Auto-Call', riskLevel: 'WARNING', riskStyle: 'warning', status: 'Closed' },
  { id: '3', timestamp: 'Feb 05 10:21 AM', event: 'Timer Expiry Auto-Call', agent: 'Evan Hale', protocol: 'Voice-Sync', riskLevel: 'INFO', riskStyle: 'info', status: 'Completed' },
  { id: '4', timestamp: 'Feb 04 1:45 PM', event: 'Biometric Drift Alert', agent: 'Sarah Thompson', protocol: 'Pulse-Audit', riskLevel: 'INFO', riskStyle: 'info', status: 'Resolved' },
  { id: '5', timestamp: 'Feb 02 11:12 AM', event: 'Property Code Deviation', agent: 'David Chen', protocol: 'ID-Recheck', riskLevel: 'WARNING', riskStyle: 'warning', status: 'Resolved' },
];

export default function GuardianInterventionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSimulationModal, setShowSimulationModal] = useState(false);

  return (
    <GuardianScreenShell
      title="Intervention Intelligence"
      subtitle="Historic audit logs of safety escalations, automated responses, and resolution pathways."
      showBack={true}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Action buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.exportBtn}>
            <MaterialCommunityIcons name="download-outline" size={18} color="#0B2D3E" />
            <Text style={styles.exportBtnText}>Intelligence Export</Text>
          </Pressable>
          <Pressable style={styles.simulationBtn} onPress={() => setShowSimulationModal(true)}>
            <MaterialCommunityIcons name="play" size={18} color="#FFFFFF" />
            <Text style={styles.simulationBtnText}>Protocol Simulation</Text>
          </Pressable>
        </View>

        {/* Summary metric cards */}
        <View style={styles.metricRow}>
          {METRIC_CARDS.map((m) => (
            <View key={m.id} style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: `${m.color}20` }]}>
                <MaterialCommunityIcons name={m.icon} size={22} color={m.color} />
              </View>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Master Intervention Ledger */}
        <View style={styles.ledgerCard}>
          <Text style={styles.ledgerTitle}>Master Intervention Ledger</Text>
          <View style={styles.ledgerToolbar}>
            <View style={styles.searchWrap}>
              <MaterialCommunityIcons name="magnify" size={20} color="#7B8794" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                placeholderTextColor="#9AA7B6"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable style={styles.filtersBtn}>
              <MaterialCommunityIcons name="filter-outline" size={18} color="#0B2D3E" />
              <Text style={styles.filtersBtnText}>Filters</Text>
            </Pressable>
          </View>
          {LEDGER_ROWS.map((row, idx) => (
            <View key={row.id} style={[styles.ledgerRow, idx === 0 && { borderTopWidth: 0 }]}>
              <Text style={styles.ledgerRowTimestamp}>{row.timestamp}</Text>
              <Text style={styles.ledgerRowEvent}>{row.event}</Text>
              <Text style={styles.ledgerRowAgent}>{row.agent}</Text>
              <Text style={styles.ledgerRowProtocol}>{row.protocol}</Text>
              <View style={styles.ledgerRowMeta}>
                <View style={[styles.riskPill, row.riskStyle === 'critical' && styles.riskPillCritical, row.riskStyle === 'warning' && styles.riskPillWarning]}>
                  <Text style={[styles.riskPillText, row.riskStyle === 'critical' && styles.riskPillTextCritical, row.riskStyle === 'warning' && styles.riskPillTextWarning]}>
                    {row.riskLevel}
                  </Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{row.status}</Text>
                </View>
              </View>
            </View>
          ))}
          <Pressable style={styles.loadArchiveBtn}>
            <Text style={styles.loadArchiveBtnText}>Load Full Archive</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Protocol Simulation Modal */}
      <Modal
        visible={showSimulationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSimulationModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowSimulationModal(false)}>
          <Pressable style={styles.simModalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.simModalIconWrap}>
              <MaterialCommunityIcons name="lightning-bolt" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.simModalTitle}>Protocol Simulation</Text>
            <Text style={styles.simModalDesc}>
              Initialize a synthetic emergency signal to verify HQ response pathways and notification latency.
            </Text>
            <Pressable style={styles.runSimBtn}>
              <Text style={styles.runSimBtnText}>RUN SIMULATION</Text>
            </Pressable>
            <Pressable style={styles.quitBtn} onPress={() => setShowSimulationModal(false)}>
              <Text style={styles.quitBtnText}>QUIT</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </GuardianScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0BA0B2',
    backgroundColor: '#FFFFFF',
  },
  exportBtnText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  simulationBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
  },
  simulationBtnText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF' },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  metricCard: {
    flex: 1,
    minWidth: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    gap: 6,
  },
  metricIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: { fontSize: 9, fontWeight: '900', color: '#7B8794', letterSpacing: 0.3 },
  metricValue: { fontSize: 13, fontWeight: '900', color: '#0B2D3E' },
  ledgerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  ledgerTitle: { fontSize: 18, fontWeight: '900', color: '#0B2D3E', marginBottom: 14 },
  ledgerToolbar: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7FBFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '700', color: '#0B2D3E', padding: 0 },
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
  },
  filtersBtnText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },
  ledgerRow: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
    gap: 6,
  },
  ledgerRowTimestamp: { fontSize: 12, fontWeight: '700', color: '#7B8794' },
  ledgerRowEvent: { fontSize: 14, fontWeight: '900', color: '#0B2D3E' },
  ledgerRowAgent: { fontSize: 12, fontWeight: '700', color: '#5B6B7A' },
  ledgerRowProtocol: { fontSize: 12, fontWeight: '700', color: '#5B6B7A' },
  ledgerRowMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  riskPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF3F8',
  },
  riskPillCritical: { backgroundColor: 'rgba(220, 38, 38, 0.14)' },
  riskPillWarning: { backgroundColor: 'rgba(234, 88, 12, 0.14)' },
  riskPillText: { fontSize: 11, fontWeight: '800', color: '#5B6B7A' },
  riskPillTextCritical: { color: '#DC2626' },
  riskPillTextWarning: { color: '#EA580C' },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(22, 163, 74, 0.14)',
  },
  statusPillText: { fontSize: 11, fontWeight: '800', color: '#16A34A' },
  loadArchiveBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
  },
  loadArchiveBtnText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  bottomSpacer: { height: 8 },
  // Protocol Simulation Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  simModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  simModalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  simModalTitle: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', marginBottom: 12, textAlign: 'center' },
  simModalDesc: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B6B7A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  runSimBtn: {
    width: '100%',
    backgroundColor: '#0B2D3E',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  runSimBtnText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  quitBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  quitBtnText: { fontSize: 14, fontWeight: '800', color: '#0B2D3E', letterSpacing: 0.4 },
});
