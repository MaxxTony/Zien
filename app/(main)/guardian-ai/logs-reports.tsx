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
  { id: 'telemetry', icon: 'console' as const, label: 'Total Telemetry', value: '4.2k' },
  { id: 'compliance', icon: 'sync' as const, label: 'Compliance Rate', value: '100%' },
  { id: 'sessions', icon: 'chart-line' as const, label: 'Active Sessions', value: '12' },
  { id: 'integrity', icon: 'lock-outline' as const, label: 'Audit Integrity', value: 'Vaulted' },
];

const AUDIT_ROWS = [
  { id: '1', time: 'Today 3:42 PM', event: 'Operational Check-in', category: 'Session', agent: 'John Olakoya', severity: 'LOW' as const },
  { id: '2', time: 'Today 2:15 PM', event: 'Geo-fence Protocol Deviation', category: 'Alert', agent: 'Maria West', severity: 'WARNING' as const },
  { id: '3', time: 'Today 1:04 PM', event: 'ID Verification Terminal Pass', category: 'Compliance', agent: 'Evan Hale', severity: 'LOW' as const },
  { id: '4', time: 'Yesterday 6:55 PM', event: 'Silent SOS Gesture Pulse', category: 'Emergency', agent: 'Sarah Thompson', severity: 'CRITICAL' as const },
  { id: '5', time: 'Yesterday 10:20 AM', event: 'Device Heartland Sync', category: 'System', agent: 'David Chen', severity: 'LOW' as const },
  { id: '6', time: 'Feb 05 9:14 AM', event: 'Broker Escalation Resolved', category: 'Incident', agent: 'HQ Commander', severity: 'LOW' as const },
];

export default function GuardianLogsReportsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [incidentCategory, setIncidentCategory] = useState('Situational Anomalies');
  const [disclosureText, setDisclosureText] = useState('');

  return (
    <GuardianScreenShell
      title="Audit Logs & Governance"
      subtitle="Centralized repository for operational telemetry and safety compliance records."
      showBack={true}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Action buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.exportBtn}>
            <MaterialCommunityIcons name="download-outline" size={18} color="#0B2D3E" />
            <Text style={styles.exportBtnText}>Export Master Archive</Text>
          </Pressable>
          <Pressable style={styles.fileReportBtn} onPress={() => setShowSafetyModal(true)}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color="#FFFFFF" />
            <Text style={styles.fileReportBtnText}>File Safety Report</Text>
          </Pressable>
        </View>

        {/* Metric cards */}
        <View style={styles.metricRow}>
          {METRIC_CARDS.map((m) => (
            <View key={m.id} style={styles.metricCard}>
              <View style={styles.metricIconWrap}>
                <MaterialCommunityIcons name={m.icon} size={22} color="#0B2D3E" />
              </View>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Operation Audit Trail */}
        <View style={styles.trailCard}>
          <Text style={styles.trailTitle}>Operation Audit Trail</Text>
          <View style={styles.trailToolbar}>
            <View style={styles.searchWrap}>
              <MaterialCommunityIcons name="magnify" size={20} color="#7B8794" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by agent, event, or category..."
                placeholderTextColor="#9AA7B6"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable style={styles.toolbarBtn}>
              <MaterialCommunityIcons name="calendar-outline" size={18} color="#0B2D3E" />
              <Text style={styles.toolbarBtnText}>Date Range</Text>
            </Pressable>
            <Pressable style={styles.toolbarBtn}>
              <MaterialCommunityIcons name="filter-outline" size={18} color="#0B2D3E" />
              <Text style={styles.toolbarBtnText}>Advanced</Text>
            </Pressable>
          </View>
          {AUDIT_ROWS.map((row, idx) => (
            <View key={row.id} style={[styles.auditRow, idx === 0 && { borderTopWidth: 0 }]}>
              <View style={styles.auditRowTime}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#7B8794" />
                <Text style={styles.auditTimeText}>{row.time}</Text>
              </View>
              <Text style={styles.auditEvent}>{row.event}</Text>
              <View style={styles.auditRowMeta}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{row.category}</Text>
                </View>
                <Text style={styles.auditAgent}>{row.agent}</Text>
              </View>
              <View style={[styles.severityDot, row.severity === 'CRITICAL' && styles.severityCritical, row.severity === 'WARNING' && styles.severityWarning]}>
                <Text style={[styles.severityText, row.severity === 'CRITICAL' && styles.severityTextCritical, row.severity === 'WARNING' && styles.severityTextWarning]}>
                  • {row.severity}
                </Text>
              </View>
            </View>
          ))}
          <Pressable style={styles.loadArchivedBtn}>
            <Text style={styles.loadArchivedBtnText}>Load Archived Logs</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Safety Disclosure Modal */}
      <Modal
        visible={showSafetyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSafetyModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowSafetyModal(false)}>
          <Pressable style={styles.safetyModalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.safetyModalHeader}>
              <View>
                <Text style={styles.safetyModalTitle}>Safety Disclosure</Text>
                <Text style={styles.safetyModalSubtitle}>File a manual incident or situational safety report.</Text>
              </View>
              <Pressable style={styles.safetyModalClose} onPress={() => setShowSafetyModal(false)}>
                <MaterialCommunityIcons name="close" size={22} color="#5B6B7A" />
              </Pressable>
            </View>
            <Text style={[styles.formLabel, { marginTop: 0 }]}>Incident Category</Text>
            <Pressable style={styles.dropdown}>
              <Text style={styles.dropdownText}>{incidentCategory}</Text>
              <MaterialCommunityIcons name="chevron-down" size={22} color="#5B6B7A" />
            </Pressable>
            <Text style={styles.formLabel}>Detailed Disclosure</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Provide high-fidelity details regarding the situational anomaly..."
              placeholderTextColor="#9AA7B6"
              value={disclosureText}
              onChangeText={setDisclosureText}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.formLabel}>Evidence / Documentation (Optional)</Text>
            <Pressable style={styles.uploadZone}>
              <MaterialCommunityIcons name="tray-arrow-up" size={32} color="#7B8794" />
              <Text style={styles.uploadZoneText}>Upload Incident Documentation</Text>
            </Pressable>
            <View style={styles.safetyModalActions}>
              <Pressable style={styles.submitVaultBtn}>
                <Text style={styles.submitVaultBtnText}>Submit to Vault</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setShowSafetyModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
            </View>
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
  exportBtnText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },
  fileReportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
  },
  fileReportBtnText: { fontSize: 12, fontWeight: '900', color: '#FFFFFF' },
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
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: { fontSize: 9, fontWeight: '900', color: '#7B8794', letterSpacing: 0.3 },
  metricValue: { fontSize: 16, fontWeight: '900', color: '#0B2D3E' },
  trailCard: {
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
  trailTitle: { fontSize: 18, fontWeight: '900', color: '#0B2D3E', marginBottom: 14 },
  trailToolbar: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  searchWrap: {
    flex: 1,
    minWidth: 140,
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
  searchInput: { flex: 1, fontSize: 13, fontWeight: '700', color: '#0B2D3E', padding: 0 },
  toolbarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
  },
  toolbarBtnText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },
  auditRow: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
    gap: 6,
  },
  auditRowTime: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  auditTimeText: { fontSize: 12, fontWeight: '700', color: '#7B8794' },
  auditEvent: { fontSize: 14, fontWeight: '900', color: '#0B2D3E' },
  auditRowMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF3F8',
  },
  categoryPillText: { fontSize: 11, fontWeight: '800', color: '#0B2D3E' },
  auditAgent: { fontSize: 12, fontWeight: '700', color: '#5B6B7A' },
  severityDot: {},
  severityText: { fontSize: 12, fontWeight: '800', color: '#16A34A' },
  severityCritical: {},
  severityWarning: {},
  severityTextCritical: { color: '#DC2626' },
  severityTextWarning: { color: '#EA580C' },
  loadArchivedBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
  },
  loadArchivedBtnText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  bottomSpacer: { height: 8 },
  // Safety Disclosure Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  safetyModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  safetyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  safetyModalTitle: { fontSize: 20, fontWeight: '900', color: '#0B2D3E' },
  safetyModalSubtitle: { fontSize: 12.5, fontWeight: '700', color: '#5B6B7A', marginTop: 4, lineHeight: 18 },
  safetyModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formLabel: { fontSize: 13, fontWeight: '800', color: '#0B2D3E', marginBottom: 8, marginTop: 14 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7FBFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dropdownText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  textArea: {
    backgroundColor: '#F7FBFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D7DEE7',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FBFF',
    marginBottom: 8,
  },
  uploadZoneText: { fontSize: 13, fontWeight: '800', color: '#5B6B7A' },
  safetyModalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  submitVaultBtn: {
    flex: 1,
    backgroundColor: '#0B2D3E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitVaultBtnText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '800', color: '#0B2D3E' },
});
