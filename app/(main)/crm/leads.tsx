import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUMMARY_CARDS = [
  { id: 'new', label: 'NEW', count: 2 },
  { id: 'qualified', label: 'QUALIFIED', count: 1 },
  { id: 'unqualified', label: 'UNQUALIFIED', count: 1 },
  { id: 'archived', label: 'ARCHIVED', count: 0 },
];

type LeadStatus = 'NEW' | 'QUALIFIED' | 'UNQUALIFIED';

const LEADS = [
  { id: '1', name: 'Jessica Miller', status: 'NEW' as LeadStatus, source: 'Open House', date: 'Today', score: 94 },
  { id: '2', name: 'Robert Chen', status: 'QUALIFIED' as LeadStatus, source: 'Website', date: 'Yesterday', score: 82 },
  { id: '3', name: 'David Wilson', status: 'UNQUALIFIED' as LeadStatus, source: 'Manual', date: '2 days ago', score: 25 },
  { id: '4', name: 'Sarah Connor', status: 'NEW' as LeadStatus, source: 'Referral', date: '3 days ago', score: 88 },
];

function LeadCard({ lead }: { lead: (typeof LEADS)[number] }) {
  const statusStyle =
    lead.status === 'NEW'
      ? styles.statusNew
      : lead.status === 'QUALIFIED'
        ? styles.statusQualified
        : styles.statusUnqualified;

  return (
    <View style={styles.leadCard}>
      <View style={styles.leadCardTop}>
        <View style={styles.leadCardIconWrap}>
          <MaterialCommunityIcons name="account-outline" size={24} color="#0BA0B2" />
        </View>
        <View style={[styles.leadCardStatusTag, statusStyle]}>
          <Text style={styles.leadCardStatusText}>{lead.status}</Text>
        </View>
      </View>
      <Text style={styles.leadCardName}>{lead.name}</Text>
      <Text style={styles.leadCardSource}>{lead.source} • {lead.date}</Text>
      <View style={styles.leadCardScoreRow}>
        <Text style={styles.leadCardScoreLabel}>AI Lead Score</Text>
        <Text style={styles.leadCardScoreValue}>{lead.score}/100</Text>
      </View>
      <View style={styles.leadCardActions}>
        <Pressable style={styles.leadCardConvertBtn}>
          <Text style={styles.leadCardConvertText}>Convert</Text>
        </Pressable>
        <Pressable style={styles.leadCardArchiveBtn}>
          <Text style={styles.leadCardArchiveText}>Archive</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function LeadsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const padding = 16;
  const gap = 12;
  const summaryCardWidth = (width - padding * 2 - gap) / 2;

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
          <Text style={styles.title}>Leads</Text>
          <Text style={styles.subtitle}>
            Incoming inquiries and potential opportunities.
          </Text>
        </View>
        <Pressable style={styles.importBtn}>
          <Text style={styles.importBtnText}>Import Leads</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {/* Summary cards — 2x2 grid on mobile */}
        <View style={styles.summaryGrid}>
          {SUMMARY_CARDS.map((card) => (
            <View key={card.id} style={[styles.summaryCard, { width: summaryCardWidth }]}>
              <Text style={styles.summaryLabel}>{card.label}</Text>
              <Text style={styles.summaryCount}>{card.count}</Text>
            </View>
          ))}
        </View>

        {/* Lead cards — vertical list, mobile-friendly */}
        <Text style={styles.sectionTitle}>Leads</Text>
        <View style={styles.leadList}>
          {LEADS.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
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
  headerCenter: { flex: 1, minWidth: 0 },
  title: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.2 },
  subtitle: { fontSize: 13, color: '#5B6B7A', fontWeight: '600', marginTop: 4 },
  importBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    justifyContent: 'center',
  },
  importBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
  },
  summaryLabel: { fontSize: 12, fontWeight: '700', color: '#5B6B7A', letterSpacing: 0.5 },
  summaryCount: { fontSize: 24, fontWeight: '900', color: '#0B2D3E', marginTop: 6 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 12,
  },
  leadList: { gap: 12 },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
  },
  leadCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leadCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardStatusTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  leadCardStatusText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  statusNew: { backgroundColor: '#E11D48' },
  statusQualified: { backgroundColor: '#0EA5E9' },
  statusUnqualified: { backgroundColor: '#0B2D3E' },
  leadCardName: { fontSize: 16, fontWeight: '800', color: '#0B2D3E' },
  leadCardSource: { fontSize: 13, color: '#5B6B7A', marginTop: 4 },
  leadCardScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  leadCardScoreLabel: { fontSize: 12, fontWeight: '600', color: '#5B6B7A' },
  leadCardScoreValue: { fontSize: 15, fontWeight: '800', color: '#0B2D3E' },
  leadCardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  leadCardConvertBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardConvertText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  leadCardArchiveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCardArchiveText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
});
