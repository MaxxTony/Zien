import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { GuardianScreenShell } from './_components/GuardianScreenShell';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DURATION_OPTIONS = [
  { label: '15m', minutes: 15 },
  { label: '30m', minutes: 30 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
];

const GUARDIAN_POLICIES = [
  { key: 'notifyBroker' as const, label: 'Notify Broker on Timer Expiry', icon: 'bell-outline' as const },
  { key: 'continuousGps' as const, label: 'Continuous GPS Tracking', icon: 'crosshairs-gps' as const },
  { key: 'silentEmergency' as const, label: 'Silent Emergency Signal', icon: 'alert-circle-outline' as const },
];

const TOP_TABS = [
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'guardian', label: 'Guardian' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'admin', label: 'Admin' },
] as const;

const CLIENTS = [
  {
    id: '1',
    name: 'Jessica Miller',
    status: 'Identity audit complete • 12m ago',
    confidence: 98,
    action: null as string | null,
  },
  {
    id: '2',
    name: 'David Chen',
    status: 'Identity audit complete • 1h ago',
    confidence: 92,
    action: null,
  },
  {
    id: '3',
    name: 'Sarah Thompson',
    status: 'Action required: ID verification',
    confidence: null,
    action: 'Verify',
  },
];

function formatGuardianTime(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const RISK_METRICS = [
  { label: 'Property Area', value: 12, dark: true },
  { label: 'Neighboring', value: 34, dark: false },
  { label: 'Regional Avg', value: 22, dark: false },
  { label: 'Incident Rate', value: 5, dark: true },
  { label: 'Response Time', value: 86, dark: true },
];

const INTERVENTION_HISTORY = [
  { id: '1', title: 'SMS escalation sent', icon: 'bell-outline' as const, time: 'Today 1:38 PM' },
  { id: '2', title: 'Auto-call initiated', icon: 'phone-outline' as const, time: 'Yesterday 6:04 PM' },
  { id: '3', title: 'Silent alert resolved', icon: 'alert-outline' as const, time: 'Mon 10:21 AM' },
  { id: '4', title: 'Guardian app activated', icon: 'shield-check-outline' as const, time: 'Jan 30 2:45 PM' },
];

const ADMIN_PROTOCOLS = [
  { id: '1', title: 'Escalation Ladder', desc: 'Primary → Broker → Emergency agency sequence.', icon: 'shield-check-outline' as const },
  { id: '2', title: 'Timer Grace Period', desc: 'Auto-call activation after 5m expiry.', icon: 'clock-outline' as const },
  { id: '3', title: 'Identity Requirements', desc: 'Mandatory ID upload for all prospects.', icon: 'card-account-details-outline' as const },
  { id: '4', title: 'Silent SOS Trigger', desc: 'Triple-tap volume for stealth alerts.', icon: 'cellphone' as const },
  { id: '5', title: 'Geo-fence Radius', desc: 'Strict 50m radius around showing area.', icon: 'map-marker-radius-outline' as const },
  { id: '6', title: 'Audit Reporting', desc: 'Generate daily safety summary for admin.', icon: 'file-document-outline' as const },
];

const INCIDENT_LOGS = [
  { id: '1', timestamp: 'Today 2:45 PM', level: 'Silent Alert', levelRed: true, agent: 'S. Thompson', protocol: 'T-Tap SOS', resolution: 'Resolved' },
  { id: '2', timestamp: 'Feb 05 6:12 PM', level: 'Timer Expiry', levelRed: false, agent: 'M. Chen', protocol: 'Auto-Call', resolution: 'Broker Action' },
  { id: '3', timestamp: 'Feb 01 10:20 AM', level: 'Risk Deviation', levelRed: false, agent: 'E. Rodriguez', protocol: 'Geo-fence', resolution: 'Passive' },
];

const INTELLIGENCE_TOOLS = [
  {
    id: 'geo',
    title: 'Property Geo-Fence',
    icon: 'map-marker-radius' as const,
    status: 'ACTIVE',
    statusStyle: 'active',
  },
  {
    id: 'route',
    title: 'Safe Route Tracking',
    icon: 'map-marker-path' as const,
    status: 'Enable',
    statusStyle: 'action',
  },
  {
    id: 'biometric',
    title: 'Biometric Pulse Scale',
    icon: 'heart-pulse' as const,
    status: 'Connect',
    statusStyle: 'action',
  },
];

export default function GuardianAiOverviewScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof TOP_TABS)[number]['id']>('intelligence');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [clientIdentityRef, setClientIdentityRef] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [guardianPolicies, setGuardianPolicies] = useState({
    notifyBroker: true,
    continuousGps: true,
    silentEmergency: true,
  });
  const [guardianChatOpen, setGuardianChatOpen] = useState(false);
  const [secureMessage, setSecureMessage] = useState('');
  const [guardianTimerActive, setGuardianTimerActive] = useState(false);
  const [guardianSecondsLeft, setGuardianSecondsLeft] = useState(30 * 60);
  const [showSosModal, setShowSosModal] = useState(false);
  const [metricsView, setMetricsView] = useState<'realtime' | 'historic'>('realtime');
  const [incidentSearch, setIncidentSearch] = useState('');
  const guardianIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetGuardianTimer = () => {
    if (guardianIntervalRef.current) {
      clearInterval(guardianIntervalRef.current);
      guardianIntervalRef.current = null;
    }
    setGuardianTimerActive(false);
    setGuardianSecondsLeft(selectedMinutes * 60);
    setShowSosModal(false);
  };

  const startGuardianTimer = () => {
    setGuardianSecondsLeft(selectedMinutes * 60);
    setGuardianTimerActive(true);
  };

  useEffect(() => {
    if (!guardianTimerActive) return;
    guardianIntervalRef.current = setInterval(() => {
      setGuardianSecondsLeft((prev) => {
        if (prev <= 1) {
          if (guardianIntervalRef.current) {
            clearInterval(guardianIntervalRef.current);
            guardianIntervalRef.current = null;
          }
          setGuardianTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (guardianIntervalRef.current) {
        clearInterval(guardianIntervalRef.current);
        guardianIntervalRef.current = null;
      }
    };
  }, [guardianTimerActive]);

  useEffect(() => {
    if (!guardianTimerActive) setGuardianSecondsLeft(selectedMinutes * 60);
  }, [selectedMinutes, guardianTimerActive]);

  const toggleGuardianChat = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setGuardianChatOpen((prev) => !prev);
  };

  return (
    <GuardianScreenShell
      title="AI Guardian Intelligence"
      subtitle="High-fidelity safety monitoring and automated emergency escalation."
      showBack={true}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topTabs}>
          {TOP_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.topTab, isActive && styles.topTabActive]}
                onPress={() => setActiveTab(tab.id)}>
                <Text style={[styles.topTabText, isActive && styles.topTabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable
              style={styles.missionControl}
              onPress={() => router.push('/(main)/guardian-ai/monitoring')}>
              <MaterialCommunityIcons name="earth" size={22} color="#FFFFFF" />
              <Text style={styles.missionControlText}>Mission Control</Text>
            </Pressable>

        {/* Tab content: sirf niche ka content change */}
        {activeTab === 'intelligence' && (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Client Verification</Text>
                <Pressable style={styles.newAuditBtn} onPress={() => setShowAuditModal(true)}>
                  <Text style={styles.newAuditText}>New Audit</Text>
                </Pressable>
              </View>
              {CLIENTS.map((client, index) => (
                <View
                  key={client.id}
                  style={[styles.clientRow, index === 0 && styles.clientRowFirst]}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {client.name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientStatus}>{client.status}</Text>
                    {client.confidence != null && (
                      <Text style={styles.confidence}>{client.confidence}% CONFIDENCE</Text>
                    )}
                  </View>
                  {client.action && (
                    <Pressable style={styles.verifyBtn}>
                      <Text style={styles.verifyBtnText}>{client.action}</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Operational Intelligence</Text>
              {INTELLIGENCE_TOOLS.map((tool, index) => (
                <View
                  key={tool.id}
                  style={[styles.toolRow, index === 0 && styles.toolRowFirst]}>
                  <View style={styles.toolIconWrap}>
                    <MaterialCommunityIcons name={tool.icon} size={22} color="#0B2D3E" />
                  </View>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Pressable
                    style={[styles.toolBtn, tool.statusStyle === 'active' && styles.toolBtnActive]}>
                    <Text
                      style={[
                        styles.toolBtnText,
                        tool.statusStyle === 'active' && styles.toolBtnTextActive,
                      ]}>
                      {tool.status}
                    </Text>
                  </Pressable>
                </View>
              ))}
              <Text style={styles.toolDescription}>
                Intelligence tools monitor your surroundings and biometric data to trigger
                escalations when anomalies are detected.
              </Text>
            </View>
          </>
        )}

        {activeTab === 'guardian' && (
          <>
            <View style={styles.card}>
              <View style={styles.badgeRow}>
                <MaterialCommunityIcons
                  name={guardianTimerActive ? 'clock-check-outline' : 'clock-outline'}
                  size={14}
                  color="#5B6B7A"
                />
                <Text style={styles.badgeText}>PRIMARY SAFETY ARCHITECTURE</Text>
              </View>
              <View style={styles.timerRing}>
                <Text style={styles.timerValue}>
                  {formatGuardianTime(guardianSecondsLeft)}
                </Text>
                <Text style={styles.timerLabel}>
                  {guardianTimerActive ? 'COUNTDOWN ACTIVE' : 'READY FOR DEPLOYMENT'}
                </Text>
              </View>
              <View style={styles.durationRow}>
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = selectedMinutes === opt.minutes;
                  const disabled = guardianTimerActive;
                  return (
                    <Pressable
                      key={opt.minutes}
                      style={[
                        styles.durationBtn,
                        isSelected && !disabled && styles.durationBtnActive,
                        disabled && styles.durationBtnDisabled,
                      ]}
                      onPress={() => !disabled && setSelectedMinutes(opt.minutes)}
                      disabled={disabled}>
                      <Text
                        style={[
                          styles.durationBtnText,
                          isSelected && !disabled && styles.durationBtnTextActive,
                          disabled && styles.durationBtnTextDisabled,
                        ]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {!guardianTimerActive ? (
                <Pressable style={styles.activateBtn} onPress={startGuardianTimer}>
                  <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
                  <Text style={styles.activateBtnText}>Activate Guardian</Text>
                </Pressable>
              ) : (
                <View style={styles.guardianActionRow}>
                  <Pressable style={styles.pauseProtectionBtn} onPress={resetGuardianTimer}>
                    <MaterialCommunityIcons name="pause" size={20} color="#0B2D3E" />
                    <Text style={styles.pauseProtectionBtnText}>Pause Protection</Text>
                  </Pressable>
                  <Pressable
                    style={styles.emergencySosBtn}
                    onPress={() => setShowSosModal(true)}>
                    <MaterialCommunityIcons name="alert" size={20} color="#FFFFFF" />
                    <Text style={styles.emergencySosBtnText}>EMERGENCY SOS</Text>
                  </Pressable>
                </View>
              )}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="battery-high" size={18} color="#0B2D3E" />
                  <View>
                    <Text style={styles.statValue}>86%</Text>
                    <Text style={styles.statLabel}>DEVICE VITALITY</Text>
                  </View>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="wifi" size={18} color="#0B2D3E" />
                  <View>
                    <Text style={styles.statValue}>Excellent</Text>
                    <Text style={styles.statLabel}>SIGNAL STRENGTH</Text>
                  </View>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#0B2D3E" />
                  <View>
                    <Text style={styles.statValue}>2m ago</Text>
                    <Text style={styles.statLabel}>LAST CHECK-IN</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Real-time Surveillance</Text>
              <View style={[styles.survRow, styles.survRowFirst]}>
                <View style={styles.survIconWrap}>
                  <MaterialCommunityIcons name="crosshairs-gps" size={22} color="#0B2D3E" />
                </View>
                <View style={styles.survText}>
                  <Text style={styles.survTitle}>Live Location Sync</Text>
                  <Text style={styles.survSub}>Streaming coordinates to broker.</Text>
                </View>
                <View style={styles.pillActive}>
                  <Text style={styles.pillActiveText}>ACTIVE</Text>
                </View>
              </View>
              <View style={styles.survRow}>
                <View style={styles.survIconWrap}>
                  <MaterialCommunityIcons name="message-text-outline" size={22} color="#0B2D3E" />
                </View>
                <View style={styles.survText}>
                  <Text style={styles.survTitle}>Guardian Chat</Text>
                  <Text style={styles.survSub}>
                    {guardianChatOpen ? 'Secure channel is live.' : 'Secured p2p comms channel.'}
                  </Text>
                </View>
                <Pressable
                  style={[styles.pillSecure, guardianChatOpen && styles.pillSecureActive]}
                  onPress={toggleGuardianChat}>
                  <Text style={[styles.pillSecureText, guardianChatOpen && styles.pillSecureTextActive]}>
                    {guardianChatOpen ? 'Secure Close' : 'Secure Open'}
                  </Text>
                </Pressable>
              </View>
              {guardianChatOpen && (
                <View style={styles.secureMessageBlock}>
                  <Text style={styles.secureMessageDesc}>
                    <Text style={styles.secureMessageBold}>Guardian AI:</Text> Secure channel initialized. Stay connected during active showings.
                  </Text>
                  <View style={styles.secureMessageRow}>
                    <TextInput
                      style={styles.secureMessageInput}
                      placeholder="Send secure message..."
                      placeholderTextColor="#9AA7B6"
                      value={secureMessage}
                      onChangeText={setSecureMessage}
                    />
                    <Pressable style={styles.secureSendBtn}>
                      <Text style={styles.secureSendBtnText}>Send</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.sosCard}>
              <Text style={styles.sosLabel}>PRIMARY SOS CONTACT</Text>
              <Text style={styles.sosName}>Zien Brokerage - HQ</Text>
              <Pressable style={styles.emergencyCallBtn}>
                <MaterialCommunityIcons name="phone" size={18} color="#0B2D3E" />
                <Text style={styles.emergencyCallBtnText}>Emergency Call</Text>
              </Pressable>
            </View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Automated Policies</Text>
              {GUARDIAN_POLICIES.map((p, index) => (
                <View key={p.key} style={[styles.policyRow, index === 0 && styles.policyRowFirst]}>
                  <MaterialCommunityIcons name={p.icon} size={20} color="#5B6B7A" />
                  <Text style={styles.policyLabel}>{p.label}</Text>
                  <Switch
                    value={guardianPolicies[p.key]}
                    onValueChange={(v) => setGuardianPolicies((prev) => ({ ...prev, [p.key]: v }))}
                    trackColor={{ false: '#D7DEE7', true: '#0B2D3E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'metrics' && (
          <>
            <View style={styles.card}>
              <View style={styles.metricsCardHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Safety Risk Architecture</Text>
                  <Text style={styles.metricsSubtitle}>
                    Projected and active risk metrics based on regional intelligence.
                  </Text>
                </View>
                <View style={styles.metricsToggleRow}>
                  <Pressable
                    style={[styles.metricsToggleBtn, metricsView === 'realtime' && styles.metricsToggleBtnActive]}
                    onPress={() => setMetricsView('realtime')}>
                    <Text style={[styles.metricsToggleText, metricsView === 'realtime' && styles.metricsToggleTextActive]}>
                      Real-time
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.metricsToggleBtn, metricsView === 'historic' && styles.metricsToggleBtnActive]}
                    onPress={() => setMetricsView('historic')}>
                    <Text style={[styles.metricsToggleText, metricsView === 'historic' && styles.metricsToggleTextActive]}>
                      Historic
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.barChartRow}>
                {RISK_METRICS.map((m) => (
                  <View key={m.label} style={styles.barChartItem}>
                    <Text style={styles.barChartValue}>{m.value}%</Text>
                    <View style={styles.barChartBarWrap}>
                      <View
                        style={[
                          styles.barChartBar,
                          { height: Math.max(4, (m.value / 100) * 100) },
                          m.dark ? styles.barChartBarDark : styles.barChartBarLight,
                        ]}
                      />
                    </View>
                    <Text style={styles.barChartLabel} numberOfLines={2}>{m.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Intervention History</Text>
              {INTERVENTION_HISTORY.map((item, index) => (
                <View
                  key={item.id}
                  style={[styles.interventionRow, index === 0 && styles.interventionRowFirst]}>
                  <View style={styles.interventionIconWrap}>
                    <MaterialCommunityIcons name={item.icon} size={20} color="#0B2D3E" />
                  </View>
                  <Text style={styles.interventionTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.interventionTimeRight}>{item.time}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'admin' && (
          <>
            <View style={styles.card}>
              <View style={styles.adminSectionHeader}>
                <Text style={styles.sectionTitle}>Security Architecture Protocols</Text>
                <Pressable style={styles.saveMasterBtn}>
                  <Text style={styles.saveMasterBtnText}>Save Master Policies</Text>
                </Pressable>
              </View>
              <View style={styles.protocolGrid}>
                {ADMIN_PROTOCOLS.map((p) => (
                  <View key={p.id} style={styles.protocolCard}>
                    <MaterialCommunityIcons name={p.icon} size={24} color="#0B2D3E" />
                    <Text style={styles.protocolCardTitle}>{p.title}</Text>
                    <Text style={styles.protocolCardDesc}>{p.desc}</Text>
                    <Pressable style={styles.configureArchBtn}>
                      <Text style={styles.configureArchBtnText}>Configure Architecture</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Master Incident Audit</Text>
              <View style={styles.incidentSearchWrap}>
                <MaterialCommunityIcons name="magnify" size={20} color="#7B8794" />
                <TextInput
                  style={styles.incidentSearchInput}
                  placeholder="Search incident logs..."
                  placeholderTextColor="#9AA7B6"
                  value={incidentSearch}
                  onChangeText={setIncidentSearch}
                />
              </View>
              <View style={styles.incidentList}>
                {INCIDENT_LOGS.map((inc) => (
                  <View key={inc.id} style={styles.incidentCard}>
                    <View style={styles.incidentCardRow}>
                      <Text style={styles.incidentLabel}>TIMESTAMP</Text>
                      <Text style={styles.incidentValue}>{inc.timestamp}</Text>
                    </View>
                    <View style={styles.incidentCardRow}>
                      <Text style={styles.incidentLabel}>INCIDENT LEVEL</Text>
                      <Text style={[styles.incidentValue, inc.levelRed && styles.incidentLevelRed]}>{inc.level}</Text>
                    </View>
                    <View style={styles.incidentCardRow}>
                      <Text style={styles.incidentLabel}>AGENT ASSIGNED</Text>
                      <Text style={styles.incidentValue}>{inc.agent}</Text>
                    </View>
                    <View style={styles.incidentCardRow}>
                      <Text style={styles.incidentLabel}>PROTOCOL TRIGGERED</Text>
                      <Text style={styles.incidentValue}>{inc.protocol}</Text>
                    </View>
                    <View style={[styles.incidentCardRow, styles.incidentCardRowLast]}>
                      <Text style={styles.incidentLabel}>RESOLUTION</Text>
                      <View style={styles.resolutionPill}>
                        <Text style={styles.resolutionPillText}>{inc.resolution}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Intelligence Audit Modal */}
      <Modal
        visible={showAuditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAuditModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowAuditModal(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Intelligence Audit</Text>
                <Text style={styles.modalSubtitle}>Analyze client credentials for field safety.</Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setShowAuditModal(false)}>
                <MaterialCommunityIcons name="close" size={20} color="#5B6B7A" />
              </Pressable>
            </View>

            <Text style={styles.uploadSectionLabel}>Government ID Upload</Text>
            <Pressable style={styles.uploadZone}>
              <MaterialCommunityIcons name="tray-arrow-down" size={36} color="#7B8794" />
              <Text style={styles.uploadZoneTitle}>Upload ID Document</Text>
              <Text style={styles.uploadZoneHint}>Support PDF, JPG, PNG</Text>
            </Pressable>

            <Text style={styles.uploadSectionLabel}>Client Identity Reference</Text>
            <TextInput
              style={styles.identityInput}
              placeholder="e.g. David Thompson"
              placeholderTextColor="#9AA7B6"
              value={clientIdentityRef}
              onChangeText={setClientIdentityRef}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.initAuditBtn}
                onPress={() => setShowAuditModal(false)}>
                <Text style={styles.initAuditBtnText}>Initialize Audit</Text>
              </Pressable>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setShowAuditModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Emergency SOS Modal */}
      <Modal
        visible={showSosModal}
        transparent
        animationType="fade"
        onRequestClose={resetGuardianTimer}>
        <Pressable style={styles.modalOverlay} onPress={resetGuardianTimer}>
          <Pressable style={styles.sosModalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sosModalIconWrap}>
              <MaterialCommunityIcons name="alert" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.sosModalTitle}>Trigger Emergency SOS?</Text>
            <Text style={styles.sosModalBody}>
              This will immediately transmit your live location, audio stream, and biometric data to Zien HQ and local emergency services.
            </Text>
            <View style={styles.sosModalActions}>
              <Pressable style={styles.sosModalConfirmBtn} onPress={resetGuardianTimer}>
                <Text style={styles.sosModalConfirmBtnText}>YES, TRANSMIT SOS</Text>
              </Pressable>
              <Pressable style={styles.sosModalCancelBtn} onPress={resetGuardianTimer}>
                <Text style={styles.sosModalCancelBtnText}>CANCEL</Text>
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
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 24,
  },
  topTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  topTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  topTabActive: {
    borderColor: '#0BA0B2',
    backgroundColor: 'rgba(11, 160, 178, 0.08)',
  },
  topTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B6B7A',
  },
  topTabTextActive: {
    color: '#0B2D3E',
  },
  missionControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0B2D3E',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  missionControlText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#F7FBFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  newAuditBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  newAuditText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  clientRowFirst: { borderTopWidth: 0 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  clientInfo: { flex: 1 },
  clientName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  clientStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 2,
  },
  confidence: {
    fontSize: 10,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  verifyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#0BA0B2',
  },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  toolRowFirst: { borderTopWidth: 0 },
  toolIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  toolBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  toolBtnActive: {
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    borderColor: '#0BA0B2',
  },
  toolBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  toolBtnTextActive: {
    color: '#0BA0B2',
  },
  toolDescription: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
    lineHeight: 18,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  // Guardian tab
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#7B8794', letterSpacing: 0.6 },
  timerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerValue: { fontSize: 32, fontWeight: '900', color: '#0B2D3E' },
  timerLabel: { fontSize: 8, fontWeight: '800', color: '#7B8794', letterSpacing: 0.5, marginTop: 4 },
  durationRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 16 },
  durationBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#FFFFFF',
  },
  durationBtnActive: { backgroundColor: '#0B2D3E', borderColor: '#0B2D3E' },
  durationBtnDisabled: { opacity: 0.6 },
  durationBtnText: { fontSize: 13, fontWeight: '800', color: '#5B6B7A' },
  durationBtnTextActive: { color: '#FFFFFF' },
  durationBtnTextDisabled: { color: '#9AA7B6' },
  activateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0B2D3E',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  activateBtnText: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  guardianActionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  pauseProtectionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0BA0B2',
    paddingVertical: 14,
    borderRadius: 14,
  },
  pauseProtectionBtnText: { fontSize: 13, fontWeight: '900', color: '#0B2D3E' },
  emergencySosBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 14,
  },
  emergencySosBtnText: { fontSize: 12, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.4 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statValue: { fontSize: 13, fontWeight: '900', color: '#0B2D3E' },
  statLabel: { fontSize: 7, fontWeight: '800', color: '#7B8794', letterSpacing: 0.4 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0B2D3E', marginBottom: 14 },
  survRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  survRowFirst: { borderTopWidth: 0 },
  survIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  survText: { flex: 1 },
  survTitle: { fontSize: 14, fontWeight: '800', color: '#0B2D3E' },
  survSub: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', marginTop: 2 },
  pillActive: {
    backgroundColor: 'rgba(22, 163, 74, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillActiveText: { fontSize: 11, fontWeight: '900', color: '#16A34A', letterSpacing: 0.4 },
  pillSecure: { backgroundColor: '#EEF3F8', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  pillSecureActive: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#0BA0B2' },
  pillSecureText: { fontSize: 11, fontWeight: '800', color: '#5B6B7A' },
  pillSecureTextActive: { color: '#0B2D3E' },
  secureMessageBlock: {
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  secureMessageDesc: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5B6B7A',
    lineHeight: 18,
    marginBottom: 12,
  },
  secureMessageBold: { fontWeight: '900', color: '#0B2D3E' },
  secureMessageRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  secureMessageInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  secureSendBtn: {
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  secureSendBtnText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  sosCard: {
    backgroundColor: '#0B2D3E',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sosLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  sosName: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', marginBottom: 16 },
  emergencyCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 14,
  },
  emergencyCallBtnText: { fontSize: 14, fontWeight: '900', color: '#0B2D3E' },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  policyRowFirst: { borderTopWidth: 0 },
  policyLabel: { flex: 1, fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  placeholderCard: {
    backgroundColor: '#F7FBFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  placeholderCardText: { fontSize: 16, fontWeight: '900', color: '#0B2D3E', marginTop: 12 },
  placeholderCardSub: { fontSize: 12, fontWeight: '700', color: '#7B8794', marginTop: 4 },
  // Metrics tab
  metricsCardHeader: { marginBottom: 16 },
  metricsSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 4,
    lineHeight: 18,
  },
  metricsToggleRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  metricsToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EEF3F8',
  },
  metricsToggleBtnActive: { backgroundColor: '#0B2D3E' },
  metricsToggleText: { fontSize: 12, fontWeight: '800', color: '#5B6B7A' },
  metricsToggleTextActive: { color: '#FFFFFF' },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 8,
    minHeight: 140,
  },
  barChartItem: { flex: 1, alignItems: 'center', marginHorizontal: 4 },
  barChartValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  barChartBarWrap: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  barChartBar: {
    width: '70%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  barChartBarDark: { backgroundColor: '#0B2D3E' },
  barChartBarLight: { backgroundColor: '#5B6B7A' },
  barChartLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#5B6B7A',
    marginTop: 6,
    textAlign: 'center',
  },
  interventionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
  },
  interventionRowFirst: { borderTopWidth: 0 },
  interventionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  interventionTitle: { flex: 1, fontSize: 14, fontWeight: '800', color: '#0B2D3E' },
  interventionTimeRight: { fontSize: 12, fontWeight: '700', color: '#7B8794' },
  // Admin tab
  adminSectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  saveMasterBtn: {
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveMasterBtnText: { fontSize: 12, fontWeight: '900', color: '#FFFFFF' },
  protocolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  protocolCard: {
    width: '47%',
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 8,
  },
  protocolCardTitle: { fontSize: 10, fontWeight: '900', color: '#0B2D3E' },
  protocolCardDesc: { fontSize: 11, fontWeight: '700', color: '#5B6B7A', lineHeight: 16 },
  configureArchBtn: {
    backgroundColor: '#EEF3F8',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  configureArchBtnText: { fontSize: 8, fontWeight: '800', color: '#0B2D3E' },
  incidentSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7FBFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  incidentSearchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
    padding: 0,
  },
  incidentList: { gap: 12 },
  incidentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
    gap: 8,
  },
  incidentCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  incidentCardRowLast: { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#EEF2F7' },
  incidentLabel: { fontSize: 10, fontWeight: '900', color: '#7B8794', letterSpacing: 0.4 },
  incidentValue: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  incidentLevelRed: { color: '#DC2626' },
  resolutionPill: {
    backgroundColor: 'rgba(11, 45, 62, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  resolutionPillText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },
  bottomSpacer: { height: 8 },

  // Intelligence Audit Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  modalSubtitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 4,
    lineHeight: 18,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadSectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 10,
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D7DEE7',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#F7FBFF',
  },
  uploadZoneTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B2D3E',
    marginTop: 12,
  },
  uploadZoneHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7B8794',
    marginTop: 4,
  },
  identityInput: {
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  initAuditBtn: {
    flex: 1,
    backgroundColor: '#0B2D3E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  initAuditBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  // Emergency SOS Modal
  sosModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
  },
  sosModalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sosModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    textAlign: 'center',
    marginBottom: 12,
  },
  sosModalBody: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B6B7A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  sosModalActions: { width: '100%', gap: 12 },
  sosModalConfirmBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  sosModalConfirmBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  sosModalCancelBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  sosModalCancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.4,
  },
});
