import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GuardianScreenShell } from './_components/GuardianScreenShell';

const STAT_CARDS = [
 {
   id: 'policies',
   icon: 'cog-outline' as const,
   label: 'SECURITY POLICIES',
   value: '14 Active',
 },
 {
   id: 'personnel',
   icon: 'account-group-outline' as const,
   label: 'VERIFIED PERSONNEL',
   value: '86 Total',
 },
 {
   id: 'escalation',
   icon: 'bell-outline' as const,
   label: 'ESCALATION NODES',
   value: '04 HQ',
 },
 {
   id: 'sync',
   icon: 'database-outline' as const,
   label: 'DATABASE SYNC',
   value: 'Optimal',
 },
];

const TEAM_ACCESS_ROLES = [
 {
   id: 'global',
   title: 'Global Administrator',
   desc: 'Full system architecture and policy control.',
   tag: 'Universal',
 },
 {
   id: 'hq',
   title: 'HQ Watch Commander',
   desc: 'Emergency escalation and live stream access.',
   tag: 'Surveillance',
 },
 {
   id: 'supervisor',
   title: 'Team Supervisor',
   desc: 'Report generation and agent oversight.',
   tag: 'Governance',
 },
 {
   id: 'field',
   title: 'Field Agent',
   desc: 'Individual session and safety tools.',
   tag: 'Operational',
 },
];

export default function GuardianAdminScreen() {
  return (
    <GuardianScreenShell
      title="System Governance & Admin"
      subtitle="Manage safety protocols, team escalations, and high-fidelity access control."
      showBack={true}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Action buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.auditBtn}>
            <MaterialCommunityIcons name="refresh" size={20} color="#0B2D3E" />
            <Text style={styles.auditBtnText}>Run Security Audit</Text>
          </Pressable>
          <Pressable style={styles.provisionBtn}>
            <MaterialCommunityIcons name="account-plus-outline" size={20} color="#FFFFFF" />
            <Text style={styles.provisionBtnText}>Provision Access</Text>
          </Pressable>
        </View>

        {/* Summary stat cards */}
        <View style={styles.statRow}>
          {STAT_CARDS.map((s) => (
            <View key={s.id} style={styles.statCard}>
              <View style={styles.statCardIconWrap}>
                <MaterialCommunityIcons name={s.icon} size={22} color="#0B2D3E" />
              </View>
              <Text style={styles.statCardLabel}>{s.label}</Text>
              <Text style={styles.statCardValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* Two-column: Team Access Matrix + API / Governance */}
        <View style={styles.twoCol}>
          <View style={styles.accessMatrixCard}>
            <Text style={styles.sectionTitle}>Team Access Matrix</Text>
            {TEAM_ACCESS_ROLES.map((r, idx) => (
              <View key={r.id} style={[styles.roleRow, idx === 0 && styles.roleRowFirst]}>
                <View style={styles.roleContent}>
                  <Text style={styles.roleTitle}>{r.title}</Text>
                  <Text style={styles.roleDesc}>{r.desc}</Text>
                </View>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{r.tag}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.rightCol}>
            <View style={styles.apiCard}>
              <Text style={styles.sectionTitle}>API Architecture</Text>
              <Text style={styles.apiSubtitle}>
                Secure endpoints for third-party monitoring integration and hardware relay.
              </Text>
              <View style={styles.apiKeyRow}>
                <MaterialCommunityIcons name="key-variant" size={20} color="#0B2D3E" />
                <Text style={styles.apiKeyLabel}>Guardian API Key</Text>
              </View>
              <View style={styles.apiKeyStatusRow}>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
                <TextInput
                  style={styles.apiKeyInput}
                  value="zn_guardian_live_**********"
                  editable={false}
                />
              </View>
              <Pressable style={styles.rotateBtn}>
                <Text style={styles.rotateBtnText}>Rotate Architecture Key</Text>
              </Pressable>
            </View>

            <View style={styles.governanceCard}>
              <View style={styles.governanceHeader}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#FFFFFF" />
                <Text style={styles.governanceTitle}>ENFORCED GOVERNANCE</Text>
              </View>
              <Text style={styles.governanceDesc}>
                Multi-factor authentication is mandatory for all HQ-level command overrides and policy changes.
              </Text>
              <Pressable style={styles.auditLogsBtn}>
                <Text style={styles.auditLogsBtnText}>Audit Access Logs</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </GuardianScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 16,
  },
  auditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  auditBtnText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  provisionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#0B2D3E',
  },
  provisionBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },

  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#F0F4F8',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  statCardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statCardLabel: { fontSize: 10, fontWeight: '800', color: '#5B6B7A', letterSpacing: 0.5 },
  statCardValue: { fontSize: 14, fontWeight: '900', color: '#0B2D3E', marginTop: 4 },

  twoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  accessMatrixCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#F7FBFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0B2D3E', marginBottom: 12 },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E3ECF4',
  },
  roleRowFirst: { borderTopWidth: 0 },
  roleContent: { flex: 1 },
  roleTitle: { fontSize: 14, fontWeight: '800', color: '#0B2D3E' },
  roleDesc: { fontSize: 12, fontWeight: '600', color: '#5B6B7A', marginTop: 4 },
  roleTag: {
    backgroundColor: '#E8EDF2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  roleTagText: { fontSize: 11, fontWeight: '800', color: '#0B2D3E' },

  rightCol: { flex: 1, minWidth: 280, gap: 16 },
  apiCard: {
    backgroundColor: '#F7FBFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  apiSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B6B7A',
    marginBottom: 14,
    lineHeight: 18,
  },
  apiKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  apiKeyLabel: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  apiKeyStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  activeBadge: {
    backgroundColor: '#0D9488',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  apiKeyInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  rotateBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#E8EDF2',
  },
  rotateBtnText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },

  governanceCard: {
    backgroundColor: '#0B2D3E',
    borderRadius: 20,
    padding: 18,
  },
  governanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  governanceTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  governanceDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
    opacity: 0.95,
    marginBottom: 14,
  },
  auditLogsBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  auditLogsBtnText: { fontSize: 12, fontWeight: '800', color: '#0B2D3E' },
});
