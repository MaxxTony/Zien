import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GuardianScreenShell } from './_components/GuardianScreenShell';

const AUDIT_ITEMS = [
  { id: '1', label: 'ENCRYPTION LAYER', value: 'AES-256 GCM', status: 'Optimal', icon: 'lock-outline' as const },
  { id: '2', label: 'TRIANGULATION LINK', value: 'Active (8 Sat)', status: 'Excellent', icon: 'connection' as const },
  { id: '3', label: 'BIOMETRIC STREAM', value: 'Synchronized', status: 'Secure', icon: 'fingerprint' as const },
  { id: '4', label: 'CLOUD HANDSHAKE', value: '0.42ms Latency', status: 'High-Speed', icon: 'chart-line' as const },
];

const STATUS_CARDS = [
  { id: 'network', icon: 'access-point' as const, value: '98%', sub: 'Stable', label: 'Network Signal' },
  { id: 'gps', icon: 'crosshairs-gps' as const, value: 'High', sub: '8 Satellites', label: 'GPS Precision' },
  { id: 'battery', icon: 'cellphone' as const, value: '84%', sub: 'Normal', label: 'Device Battery' },
  { id: 'security', icon: 'shield-check-outline' as const, value: '94', sub: 'Optimal', label: 'Security Score' },
];

const TELEMETRY_LINES_BASE = [
  '[12:45:02] System initialized. Ready for deployment.',
  '[12:45:05] GPS link established with 8 satellites.',
  '[12:45:10] Biometric stream synchronized.',
];
const TELEMETRY_SESSION_LINE = '[17:49:10] NEW SESSION ESTABLISHED. GUARDIAN ENGAGED.';

const RESPONDERS = [
  { id: '1', name: 'Maria West', role: 'HQ Commander', initials: 'MW', online: true, onCall: false },
  { id: '2', name: 'Evan Hale', role: 'Security Agent', initials: 'EH', online: false, onCall: true },
];

const ACTIVE_ALERTS = [
  { id: '1', icon: 'bell-outline' as const, title: 'Silent check-in required', time: 'Now', color: '#EAB308' },
  { id: '2', icon: 'map-marker-alert-outline' as const, title: 'Geo-fence deviation', time: '8m ago', color: '#DC2626' },
  { id: '3', icon: 'heart-pulse' as const, title: 'System heartbeat normal', time: '14m ago', color: '#0BA0B2' },
];

export default function GuardianMonitoringScreen() {
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [sessionDeployed, setSessionDeployed] = useState(false);
  const [assetId, setAssetId] = useState('John Olakoya (S-142)');
  const [deployZone, setDeployZone] = useState('742 Evergreen Terrace, NY');

  const handleAuthenticateDeploy = () => {
    setShowDeployModal(false);
    setSessionDeployed(true);
  };

  const telemetryLines = sessionDeployed ? [TELEMETRY_SESSION_LINE, ...TELEMETRY_LINES_BASE] : TELEMETRY_LINES_BASE;

  return (
    <GuardianScreenShell
      title="Mission Control & Monitoring"
      subtitle="High-fidelity surveillance architecture for active field operations."
      showBack={true}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Action buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.systemAuditBtn} onPress={() => setShowAuditModal(true)}>
            <Text style={styles.systemAuditBtnText}>System Audit</Text>
          </Pressable>
          <Pressable style={styles.startSessionBtn} onPress={() => setShowDeployModal(true)}>
            <MaterialCommunityIcons name="play" size={18} color="#FFFFFF" />
            <Text style={styles.startSessionBtnText}>Start New Session</Text>
          </Pressable>
        </View>

        {/* Status cards 2x2 */}
        <View style={styles.statusGrid}>
          {STATUS_CARDS.map((s) => (
            <View key={s.id} style={styles.statusCard}>
              <MaterialCommunityIcons name={s.icon} size={22} color="#0B2D3E" />
              <Text style={styles.statusCardValue}>{s.value}</Text>
              <Text style={styles.statusCardSub}>{s.sub}</Text>
              <Text style={styles.statusCardLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Live Surveillance Feed */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text style={styles.sectionTitle}>Live Surveillance Feed</Text>
              <Text style={styles.cardSubtitle}>Active GPS triangulation and asset tracking.</Text>
            </View>
            {sessionDeployed ? (
              <View style={styles.liveBadge}>
                <View style={styles.liveBadgeDot} />
                <Text style={styles.liveBadgeText}>LIVE </Text>
              </View>
            ) : (
              <Text style={styles.standbyBadge}>STANDBY</Text>
            )}
          </View>
          {sessionDeployed ? (
            <View style={styles.feedLive}>
              <View style={styles.feedLiveIconWrap}>
                <MaterialCommunityIcons name="map-marker" size={48} color="#0B2D3E" />
              </View>
              <Text style={styles.feedLiveAsset}>Asset: S-142 (John O.)</Text>
              <Text style={styles.feedLiveCoords}>40.7128° N, 74.0060° W</Text>
            </View>
          ) : (
            <View style={styles.feedPlaceholder}>
              <ActivityIndicator size="large" color="#9AA7B6" />
              <Text style={styles.feedPlaceholderText}>PENDING DEPLOYMENT</Text>
            </View>
          )}
        </View>

        {/* Live System Telemetry */}
        <View style={styles.telemetryCard}>
          <View style={styles.telemetryHeader}>
            <Text style={styles.telemetryHeaderText}>LIVE SYSTEM TELEMETRY</Text>
            <View style={styles.telemetryDots}>
              <View style={[styles.dot, styles.dotRed]} />
              <View style={[styles.dot, styles.dotYellow]} />
              <View style={[styles.dot, styles.dotGreen]} />
            </View>
          </View>
          <View style={styles.telemetryBody}>
            {telemetryLines.map((line, i) => (
              <Text
                key={i}
                style={[
                  styles.telemetryLine,
                  sessionDeployed && i === 0 && styles.telemetryLineHighlight,
                ]}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        {/* Master Responders */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.sectionTitle}>Master Responders</Text>
            <Pressable hitSlop={12}>
              <MaterialCommunityIcons name="dots-horizontal" size={22} color="#5B6B7A" />
            </Pressable>
          </View>
          {RESPONDERS.map((r, idx) => (
            <View key={r.id} style={[styles.responderRow, idx === 0 && styles.responderRowFirst]}>
              <View style={styles.responderAvatar}>
                <Text style={styles.responderInitials}>{r.initials}</Text>
              </View>
              <View style={styles.responderInfo}>
                <Text style={styles.responderName}>{r.name}</Text>
                <Text style={styles.responderRole}>{r.role}</Text>
              </View>
              <View style={styles.onlinePill}>
                <Text style={styles.onlinePillText}>{r.onCall ? 'On-call' : 'Online'}</Text>
              </View>
            </View>
          ))}
          <Pressable style={styles.deployAgentBtn}>
            <Text style={styles.deployAgentBtnText}>Deploy Extra Agent</Text>
          </Pressable>
        </View>

        {/* Active Alerts */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Active Alerts</Text>
          {ACTIVE_ALERTS.map((a, idx) => (
            <View key={a.id} style={[styles.alertRow, idx === 0 && styles.alertRowFirst]}>
              <View style={[styles.alertIconWrap, { borderColor: a.color }]}>
                <MaterialCommunityIcons name={a.icon} size={20} color={a.color} />
              </View>
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>{a.title}</Text>
                <Text style={styles.alertTime}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Force Intervene */}
        <View style={styles.forceCard}>
          <View style={styles.forceTitleRow}>
            <MaterialCommunityIcons name="alert" size={22} color="#DC2626" />
            <Text style={styles.forceTitle}>Force Intervene</Text>
          </View>
          <Text style={styles.forceDesc}>
            Bypass security protocols and force an emergency response sequence.
          </Text>
          <Pressable style={styles.forceBtn}>
            <Text style={styles.forceBtnText}>FORCE SES SIGNAL</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Security Architecture Audit Modal */}
      <Modal
        visible={showAuditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAuditModal(false)}>
        <Pressable style={styles.auditModalOverlay} onPress={() => setShowAuditModal(false)}>
          <Pressable style={styles.auditModalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.auditModalHeader}>
              <View>
                <Text style={styles.auditModalTitle}>Security Architecture Audit</Text>
                <Text style={styles.auditModalSubtitle}>
                  Technical verification of active safety protocols.
                </Text>
              </View>
              <Pressable style={styles.auditModalClose} onPress={() => setShowAuditModal(false)}>
                <MaterialCommunityIcons name="close" size={20} color="#5B6B7A" />
              </Pressable>
            </View>
            {AUDIT_ITEMS.map((item) => (
              <View key={item.id} style={styles.auditItemRow}>
                <MaterialCommunityIcons name={item.icon} size={20} color="#0B2D3E" />
                <View style={styles.auditItemCenter}>
                  <Text style={styles.auditItemLabel}>{item.label}</Text>
                  <Text style={styles.auditItemValue}>{item.value}</Text>
                </View>
                <View style={styles.auditStatusPill}>
                  <Text style={styles.auditStatusPillText}>{item.status}</Text>
                </View>
              </View>
            ))}
            <View style={styles.auditIntegrityBlock}>
              <View style={styles.auditIntegrityIcon}>
                <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.auditIntegrityText}>
                <Text style={styles.auditIntegrityTitle}>Core Integrity Verified</Text>
                <Text style={styles.auditIntegritySub}>
                  All safety subsystems are operating within nominal enterprise parameters.
                </Text>
              </View>
            </View>
            <Pressable style={styles.auditCloseBtn} onPress={() => setShowAuditModal(false)}>
              <Text style={styles.auditCloseBtnText}>Close Technical Audit</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Deployment Architecture Modal */}
      <Modal
        visible={showDeployModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeployModal(false)}>
        <Pressable style={styles.auditModalOverlay} onPress={() => setShowDeployModal(false)}>
          <Pressable style={styles.deployModalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.auditModalHeader}>
              <View>
                <Text style={styles.auditModalTitle}>Deployment Architecture</Text>
                <Text style={styles.auditModalSubtitle}>
                  Initialize a new secure monitoring session.
                </Text>
              </View>
              <Pressable style={styles.auditModalClose} onPress={() => setShowDeployModal(false)}>
                <MaterialCommunityIcons name="close" size={20} color="#5B6B7A" />
              </Pressable>
            </View>
            <Text style={[styles.deployLabel, { marginTop: 0 }]}>Asset Identification</Text>
            <View style={styles.deployInputWrap}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#7B8794" />
              <TextInput
                style={styles.deployInput}
                value={assetId}
                onChangeText={setAssetId}
                placeholder="Asset Identification"
                placeholderTextColor="#9AA7B6"
              />
            </View>
            <Text style={styles.deployLabel}>Deployment Zone</Text>
            <View style={styles.deployInputWrap}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#7B8794" />
              <TextInput
                style={styles.deployInput}
                value={deployZone}
                onChangeText={setDeployZone}
                placeholder="Deployment Zone"
                placeholderTextColor="#9AA7B6"
              />
            </View>
            <Text style={styles.deployLabel}>Session Duration</Text>
            <Pressable style={styles.deployDropdown}>
              <Text style={styles.deployDropdownText}>30 Minutes</Text>
              <MaterialCommunityIcons name="chevron-down" size={22} color="#5B6B7A" />
            </Pressable>
            <Text style={styles.deployLabel}>Escalation Policy</Text>
            <Pressable style={styles.deployDropdown}>
              <Text style={styles.deployDropdownText}>Standard Ladder</Text>
              <MaterialCommunityIcons name="chevron-down" size={22} color="#5B6B7A" />
            </Pressable>
            <Pressable style={styles.authenticateDeployBtn} onPress={handleAuthenticateDeploy}>
              <Text style={styles.authenticateDeployBtnText}>AUTHENTICATE & DEPLOY</Text>
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
  systemAuditBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  systemAuditBtnText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  startSessionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
  },
  startSessionBtnText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF' },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statusCard: {
    width: '47%',
    minWidth: 140,
    backgroundColor: '#F7FBFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 4,
  },
  statusCardValue: { fontSize: 16, fontWeight: '900', color: '#0B2D3E' },
  statusCardSub: { fontSize: 12, fontWeight: '700', color: '#0BA0B2' },
  statusCardLabel: { fontSize: 10, fontWeight: '800', color: '#7B8794', letterSpacing: 0.3 },
  card: {
    backgroundColor: '#F7FBFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    marginBottom: 16,
  },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0B2D3E' },
  cardSubtitle: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', marginTop: 4, lineHeight: 18 },
  standbyBadge: { fontSize: 10, fontWeight: '800', color: '#7B8794', letterSpacing: 0.5 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveBadgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16A34A' },
  liveBadgeText: { fontSize: 10, fontWeight: '800', color: '#0B2D3E', letterSpacing: 0.5 },
  feedPlaceholder: {
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  feedPlaceholderText: { fontSize: 12, fontWeight: '800', color: '#9AA7B6' },
  feedLive: {
    height: 160,
    backgroundColor: '#EEF3F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  feedLiveIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedLiveAsset: { fontSize: 14, fontWeight: '900', color: '#0B2D3E' },
  feedLiveCoords: { fontSize: 12, fontWeight: '700', color: '#7B8794' },
  telemetryCard: { marginBottom: 16, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#0B2D3E' },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  telemetryHeaderText: { fontSize: 11, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  telemetryDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotRed: { backgroundColor: '#DC2626' },
  dotYellow: { backgroundColor: '#EAB308' },
  dotGreen: { backgroundColor: '#16A34A' },
  telemetryBody: {
    backgroundColor: '#0B2D3E',
    padding: 14,
    gap: 6,
  },
  telemetryLine: { fontSize: 11, fontFamily: 'monospace', color: '#E8EEF4', fontWeight: '600' },
  telemetryLineHighlight: { color: '#16A34A', fontWeight: '800' },
  responderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  responderRowFirst: { borderTopWidth: 0 },
  responderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  responderInitials: { fontSize: 12, fontWeight: '900', color: '#FFFFFF' },
  responderInfo: { flex: 1 },
  responderName: { fontSize: 14, fontWeight: '900', color: '#0B2D3E' },
  responderRole: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', marginTop: 2 },
  onlinePill: { backgroundColor: 'rgba(22, 163, 74, 0.14)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  onlinePillText: { fontSize: 11, fontWeight: '800', color: '#16A34A' },
  deployAgentBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  deployAgentBtnText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E8EEF4' },
  alertRowFirst: { borderTopWidth: 0 },
  alertIconWrap: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  alertTime: { fontSize: 12, fontWeight: '700', color: '#7B8794', marginTop: 2 },
  forceCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
    borderColor: '#DC2626',
    marginBottom: 16,
  },
  forceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  forceTitle: { fontSize: 16, fontWeight: '900', color: '#0B2D3E' },
  forceDesc: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', lineHeight: 18, marginBottom: 14 },
  forceBtn: { backgroundColor: '#DC2626', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  forceBtnText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.4 },
  bottomSpacer: { height: 8 },
  // Security Architecture Audit Modal
  auditModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  auditModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  auditModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  auditModalTitle: { fontSize: 20, fontWeight: '900', color: '#0B2D3E' },
  auditModalSubtitle: { fontSize: 12.5, fontWeight: '700', color: '#5B6B7A', marginTop: 4, lineHeight: 18 },
  auditModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  auditItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    marginBottom: 10,
    backgroundColor: '#F7FBFF',
  },
  auditItemCenter: { flex: 1 },
  auditItemLabel: { fontSize: 10, fontWeight: '900', color: '#7B8794', letterSpacing: 0.4 },
  auditItemValue: { fontSize: 14, fontWeight: '900', color: '#0B2D3E', marginTop: 2 },
  auditStatusPill: {
    backgroundColor: 'rgba(22, 163, 74, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  auditStatusPillText: { fontSize: 12, fontWeight: '800', color: '#16A34A' },
  auditIntegrityBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#0B2D3E',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  auditIntegrityIcon: {
    width: 30,
    height: 30,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  auditIntegrityText: { flex: 1 },
  auditIntegrityTitle: { fontSize: 13, fontWeight: '900', color: '#FFFFFF' },
  auditIntegritySub: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.85)', marginTop: 4, lineHeight: 18 },
  auditCloseBtn: {
    backgroundColor: '#0B2D3E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  auditCloseBtnText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  // Deployment Architecture Modal
  deployModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  deployLabel: { fontSize: 12, fontWeight: '800', color: '#0B2D3E', marginBottom: 8, marginTop: 14 },
  deployInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F7FBFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  deployInput: { flex: 1, fontSize: 14, fontWeight: '700', color: '#0B2D3E', padding: 0 },
  deployDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7FBFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 0,
  },
  deployDropdownText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  authenticateDeployBtn: {
    backgroundColor: '#0B2D3E',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  authenticateDeployBtnText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
});
