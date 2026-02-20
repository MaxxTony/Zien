import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SEQUENCES = [
  {
    id: '1',
    title: 'Open House Follow-Up',
    type: 'Drip Sequence',
    trigger: 'Check-in + 2m',
    status: 'ACTIVE' as const,
  },
  {
    id: '2',
    title: 'Virtual Staging Lead Welcome',
    type: 'Instant Response',
    trigger: 'Listing Click (Social)',
    status: 'ACTIVE' as const,
  },
  {
    id: '3',
    title: 'Cold Lead Re-engagement',
    type: 'Ghost Protocol',
    trigger: '90 Days Inactivity',
    status: 'ACTIVE' as const,
  },
  {
    id: '4',
    title: 'Home Anniversary',
    type: 'Lifecycle',
    trigger: '1 Year Post-Close',
    status: 'PAUSED' as const,
  },
];

export default function CRMAutomationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.back()}
          hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Follow-Up Automation</Text>
          <Text style={styles.subtitle}>
            Set once, and let ZIEN nurture your leads based on time and behavior.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardsWrap}>
          {SEQUENCES.map((seq) => (
            <View key={seq.id} style={styles.sequenceCard}>
              <View style={styles.sequenceCardHeader}>
                <View style={styles.sequenceIconWrap}>
                  <MaterialCommunityIcons name="lightning-bolt-outline" size={22} color="#0BA0B2" />
                </View>
                <View style={[styles.statusPill, seq.status === 'PAUSED' && styles.statusPillPaused]}>
                  <Text style={[styles.statusText, seq.status === 'PAUSED' && styles.statusTextPaused]}>
                    {seq.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.sequenceTitle}>{seq.title}</Text>
              <Text style={styles.sequenceType}>Type: {seq.type}</Text>
              <View style={styles.triggerBox}>
                <Text style={styles.triggerLabel}>TRIGGER</Text>
                <Text style={styles.triggerValue}>{seq.trigger}</Text>
              </View>
              <View style={[styles.editWorkflowBtn, { opacity: 0.5 }]}>
                <Text style={styles.editWorkflowBtnText}>Edit Workflow & Templates</Text>
              </View>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.8)',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  headerCenter: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 20,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  cardsWrap: { paddingBottom: 4 },
  sequenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sequenceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sequenceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(11, 160, 178, 0.15)',
  },
  statusPillPaused: {
    backgroundColor: '#F1F5F9',
  },
  statusText: { fontSize: 11, fontWeight: '800', color: '#0BA0B2' },
  statusTextPaused: { color: '#64748B' },
  sequenceTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  sequenceType: {
    fontSize: 14,
    color: '#0B2D3E',
    fontWeight: '500',
    marginBottom: 14,
  },
  triggerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  triggerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  triggerValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  editWorkflowBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  editWorkflowBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },
});
