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

const INTEGRATIONS = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    desc: 'Deep bi-directional sync with Salesforce CRM for enterprise teams.',
    status: 'COMING SOON' as const,
    icon: 'cloud-outline' as const,
    buttonLabel: 'Register for Early Access',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    desc: 'Automatically push leads and track marketing activity in HubSpot.',
    status: 'COMING SOON' as const,
    icon: 'link-variant' as const,
    buttonLabel: 'Register for Early Access',
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    desc: 'Connect your Zoho workspace for seamless contact management.',
    status: 'COMING SOON' as const,
    icon: 'cube-outline' as const,
    buttonLabel: 'Register for Early Access',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    desc: 'Sync your contact segments directly to Mailchimp audiences.',
    status: 'CONNECTED' as const,
    icon: 'email-outline' as const,
    buttonLabel: 'Manage Connection',
  },
];

export default function IntegrationsScreen() {
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
          <Text style={styles.title}>Tools & Integrations</Text>
          <Text style={styles.subtitle}>
            Connect ZIEN to your existing software stack.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={({ pressed }) => [styles.requestBtn, pressed && { opacity: 0.9 }]}>
          <Text style={styles.requestBtnText}>Request Integration</Text>
        </Pressable>

        <View style={styles.cardsWrap}>
          {INTEGRATIONS.map((int) => (
            <View key={int.id} style={styles.intCard}>
              <View style={styles.intCardTop}>
                <View style={styles.intIconWrap}>
                  <MaterialCommunityIcons name={int.icon} size={28} color="#0BA0B2" />
                </View>
                <View style={[styles.statusPill, int.status === 'CONNECTED' && styles.statusPillConnected]}>
                  <Text style={[styles.statusPillText, int.status === 'CONNECTED' && styles.statusPillTextConnected]}>
                    {int.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.intName}>{int.name}</Text>
              <Text style={styles.intDesc}>{int.desc}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.intActionBtn,
                  int.status === 'CONNECTED' && styles.intActionBtnPrimary,
                  pressed && { opacity: 0.9 },
                ]}>
                <Text style={[
                  styles.intActionBtnText,
                  int.status === 'CONNECTED' && styles.intActionBtnTextPrimary,
                ]}>
                  {int.buttonLabel}
                </Text>
              </Pressable>
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
  requestBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#0B2D3E',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  requestBtnText: { fontSize: 15, fontWeight: '800', color: '#0B2D3E' },
  cardsWrap: { paddingBottom: 4 },
  intCard: {
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
  intCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  intIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  statusPillConnected: {
    backgroundColor: 'rgba(11, 160, 178, 0.15)',
  },
  statusPillText: { fontSize: 11, fontWeight: '800', color: '#64748B' },
  statusPillTextConnected: { color: '#0BA0B2' },
  intName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  intDesc: {
    fontSize: 14,
    color: '#5B6B7A',
    lineHeight: 21,
    marginBottom: 16,
  },
  intActionBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  intActionBtnPrimary: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  intActionBtnText: { fontSize: 15, fontWeight: '700', color: '#0B2D3E' },
  intActionBtnTextPrimary: { color: '#FFFFFF' },
});
