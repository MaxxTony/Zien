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

const HUB_SECTIONS = [
  { id: 'create-post', label: 'Create Post', icon: 'plus-box-outline' as const, route: '/(main)/social-hub/create-post' as const },
  { id: 'content-library', label: 'Content Library', icon: 'file-document-outline' as const, route: '/(main)/social-hub/content-library' as const },
  { id: 'scheduler', label: 'Scheduler', icon: 'calendar-blank-outline' as const, route: '/(main)/social-hub/scheduler' as const },
  { id: 'campaigns', label: 'Campaigns', icon: 'flag-outline' as const, route: '/(main)/social-hub/campaigns' as const },
  { id: 'analytics', label: 'Analytics', icon: 'chart-bar' as const, route: '/(main)/social-hub/analytics' as const },
  { id: 'automation-rules', label: 'Automation Rules', icon: 'lightning-bolt-outline' as const, route: '/(main)/social-hub/automation-rules' as const },
  { id: 'accounts', label: 'Accounts', icon: 'account-group-outline' as const, route: '/(main)/social-hub/accounts' as const },
];

const STAT_CARDS = [
  { title: 'Scheduled Posts', value: '12', meta: '+2', icon: 'calendar-clock-outline' as const },
  { title: 'Published (30D)', value: '48', meta: '+15%', icon: 'share-outline' as const },
  { title: 'Engagement Rate', value: '4.8%', meta: '+0.6%', icon: 'heart-outline' as const },
  { title: 'Best Platform', value: 'Instagram', meta: '92% reach', icon: 'instagram' as const },
];

const UPCOMING_POSTS = [
  { id: '1', title: 'New Listing: 123 Business Way', platform: 'Instagram', when: 'Today, 3:00 PM' },
  { id: '2', title: 'Open House Weekend', platform: 'Facebook', when: 'Tomorrow, 10:00 AM' },
  { id: '3', title: 'Market Update Q1', platform: 'LinkedIn', when: 'Jan 22, 2:00 PM' },
];

const AI_TEMPLATES = [
  'Just Listed Announcement',
  'Open House Promo (Weekend)',
  'Sold: Success Story',
  'Market Insight Digest',
];

export default function SocialHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const padding = 16;
  const gap = 12;
  const statCardWidth = (width - padding * 2 - gap) / 2;

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Social Media Hub</Text>
          <Text style={styles.subtitle}>Automate your property promotion and engage with your audience.</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Actions row */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/(main)/social-hub/accounts')}>
            <MaterialCommunityIcons name="cog-outline" size={18} color="#0B2D3E" />
            <Text style={styles.secondaryBtnText}>Account Settings</Text>
          </Pressable>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.push('/(main)/social-hub/create-post')}>
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Create New Post</Text>
          </Pressable>
        </View>

        {/* Stats cards */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((card, idx) => (
            <View key={card.title} style={[styles.statCard, { width: statCardWidth }]}>
              <View style={styles.statIconWrap}>
                <MaterialCommunityIcons name={card.icon} size={20} color="#0B2D3E" />
              </View>
              <Text style={styles.statValue}>{card.value}</Text>
              <Text style={styles.statTitle}>{card.title}</Text>
              <Text style={styles.statMeta}>{card.meta}</Text>
            </View>
          ))}
        </View>



        {/* Upcoming Posts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Upcoming Posts</Text>
            <Pressable onPress={() => router.push('/(main)/social-hub/scheduler')}>
              <Text style={styles.cardLink}>View Calendar →</Text>
            </Pressable>
          </View>
          {UPCOMING_POSTS.map((post) => (
            <View key={post.id} style={styles.postRow}>
              <View style={styles.postThumb} />
              <View style={styles.postInfo}>
                <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                <Text style={styles.postMeta}>{post.platform} · {post.when}</Text>
              </View>
              <Pressable style={styles.editPostBtn}>
                <Text style={styles.editPostText}>Edit Post</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Quick AI Templates */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick AI Templates</Text>
          {AI_TEMPLATES.map((name, i) => (
            <Pressable key={name} style={styles.templateRow}>
              <MaterialCommunityIcons name="star-four-points" size={18} color="#0BA0B2" />
              <Text style={styles.templateText}>{name}</Text>
            </Pressable>
          ))}
        </View>

        {/* Power-Ups */}
        <View style={styles.powerUpCard}>
          <Text style={styles.powerUpTitle}>Power-Ups</Text>
          <Text style={styles.powerUpDesc}>
            Connect more accounts to unlock advanced analytics and multi-platform posting.
          </Text>
          <View style={styles.platformRow}>
            <View style={styles.platformIcon}>
              <MaterialCommunityIcons name="instagram" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.platformIcon}>
              <MaterialCommunityIcons name="facebook" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.platformIcon}>
              <MaterialCommunityIcons name="linkedin" size={24} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* AI Credits Card */}
        <View style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <View style={styles.usageTitleRow}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color="#0BA0B2" />
              <Text style={styles.usageTitle}>AI Usage</Text>
            </View>
            <Text style={styles.usagePercent}>85%</Text>
          </View>
          <View style={styles.usageBarBg}>
            <LinearGradient
              colors={['#0BA0B2', '#2DD4BF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: '85%', height: '100%', borderRadius: 4 }}
            />
          </View>
          <Text style={styles.usageSubtext}>850 of 1,000 credits used this month.</Text>
        </View>

        {/* Hub sections */}
        <Text style={styles.sectionTitle}>Hub sections</Text>
        <View style={styles.sectionsList}>
          {HUB_SECTIONS.map((section) => (
            <Pressable
              key={section.id}
              style={({ pressed }) => [styles.sectionRow, pressed && styles.sectionRowPressed]}
              onPress={() => section.route && router.push(section.route)}
              disabled={!section.route}>
              <View style={styles.sectionIconWrap}>
                <MaterialCommunityIcons name={section.icon} size={22} color="#0B2D3E" />
              </View>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              {section.route ? (
                <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
              ) : (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Here</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
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
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
  },
  primaryBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 45, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 20, fontWeight: '900', color: '#0B2D3E' },
  statTitle: { fontSize: 12, fontWeight: '600', color: '#5B6B7A', marginTop: 2 },
  statMeta: { fontSize: 11, fontWeight: '700', color: '#0BA0B2', marginTop: 2 },
  sectionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  sectionRowPressed: { backgroundColor: '#F8FBFF' },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#0B2D3E' },
  currentBadge: {
    backgroundColor: '#0BA0B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0B2D3E', marginBottom: 12 },
  cardLink: { fontSize: 13, fontWeight: '700', color: '#0BA0B2' },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
    gap: 12,
  },
  postThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E8EEF6',
  },
  postInfo: { flex: 1 },
  postTitle: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  postMeta: { fontSize: 12, color: '#5B6B7A', marginTop: 2 },
  editPostBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  editPostText: { fontSize: 13, fontWeight: '700', color: '#0BA0B2' },
  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  templateText: { fontSize: 14, fontWeight: '600', color: '#0B2D3E' },
  powerUpCard: {
    backgroundColor: '#0B2D3E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  powerUpTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  powerUpDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 14 },
  platformRow: { flexDirection: 'row', gap: 12 },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformEmoji: { fontSize: 16, color: '#FFFFFF' },
  usageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  usageTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  usagePercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0BA0B2',
  },
  usageBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  usageSubtext: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
