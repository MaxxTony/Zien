import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HUB_TABS = [
  { id: 'Overview', label: 'Overview', icon: 'view-grid-outline' as const },
  { id: 'Create Post', label: 'Create Post', icon: 'plus-box-outline' as const, route: '/(main)/social-hub/create-post' },
  { id: 'Content Library', label: 'Content Library', icon: 'image-outline' as const, route: '/(main)/social-hub/content-library' },
  { id: 'Scheduler', label: 'Scheduler', icon: 'calendar-blank-outline' as const, route: '/(main)/social-hub/scheduler' },
  { id: 'Campaigns', label: 'Campaigns', icon: 'flag-outline' as const, route: '/(main)/social-hub/campaigns' },
  { id: 'Templates', label: 'Templates', icon: 'content-copy' as const, route: '/(main)/social-hub/templates' },
  { id: 'Analytics', label: 'Analytics', icon: 'chart-bar' as const, route: '/(main)/social-hub/analytics' },
  { id: 'Automation Rules', label: 'Automation Rules', icon: 'lightning-bolt-outline' as const, route: '/(main)/social-hub/automation-rules' },
  { id: 'Accounts Setting', label: 'Accounts Setting', icon: 'account-group-outline' as const, route: '/(main)/social-hub/accounts' },
];

const STAT_CARDS = [
  { title: 'Scheduled Posts', value: '12', meta: '+2', icon: 'calendar-clock-outline' as const },
  { title: 'Published (30D)', value: '48', meta: '+15%', icon: 'share-outline' as const },
  { title: 'Engagement Rate', value: '4.8%', meta: '+0.6%', icon: 'heart-outline' as const },
  { title: 'Best Platform', value: 'Instagram', meta: '92% reach', icon: 'instagram' as const },
];

const UPCOMING_POSTS = [
  { id: '1', title: 'New Listing: 123 Business Way', platform: 'Instagram', when: 'Today, 3:00 PM', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200' },
  { id: '2', title: 'Open House This Weekend!', platform: 'Facebook', when: 'Tomorrow, 10:00 AM', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200' },
  { id: '3', title: 'Market Update: Los Angeles', platform: 'LinkedIn', when: 'Jan 22, 2:00 PM', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200' },
];

const SOCIAL_TEMPLATES = [
  { id: '1', title: 'Listing Showcase', sub: 'Instagram • High Impact', icon: 'image-outline' as const },
  { id: '2', title: 'Open House Promo', sub: 'Facebook • Event Drive', icon: 'calendar-star' as const },
  { id: '3', title: 'Market Success Story', sub: 'LinkedIn • B2B Trust', icon: 'trending-up' as const },
];


export default function SocialHubScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const hPadding = 18;
  const gap = 12;
  const statCardWidth = (width - hPadding * 2 - gap) / 2;



  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>

      {/* Page Header */}
      <PageHeader
        title="Social Media"
        subtitle="Automate your property promotion and engage with your audience."
        onBack={() => router.back()}
      />



      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>


        {/* Header Actions */}
        <View style={styles.headerActionsMobile}>
          <Pressable style={styles.accountBtn} onPress={() => router.push('/(main)/social-hub/accounts')}>
            <Text style={styles.accountBtnText}>Account Setting</Text>
          </Pressable>
          <Pressable style={styles.createBtn} onPress={() => router.push('/(main)/social-hub/create-post')}>
            <MaterialCommunityIcons name="plus" size={16} color="#FFF" />
            <Text style={styles.createBtnText}>Create New Post</Text>
          </Pressable>
        </View>

        {/* Overview Section Heading */}
        <View style={styles.overviewHeader}>
          <MaterialCommunityIcons name="view-grid-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.overviewHeaderText}>Overview</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((card) => (
            <View key={card.title} style={[styles.statCardPremium, { width: statCardWidth }]}>
              <View style={styles.statTop}>
                <View style={styles.statIconCircle}>
                  <MaterialCommunityIcons name={card.icon} size={18} color={colors.textPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statLabel}>{card.title.toUpperCase()}</Text>
                  <View style={styles.statValueRow}>
                    <Text style={[styles.statValueText, typeof card.value === 'string' && card.value.length > 8 && { fontSize: 14 }]}>
                      {card.value}
                    </Text>
                    {card.meta && <Text style={styles.statMetaText}>{card.meta}</Text>}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Upcoming Posts Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleText}>Upcoming Posts</Text>
            <Pressable onPress={() => router.push('/(main)/social-hub/scheduler')}>
              <Text style={styles.sectionLinkText}>View Calendar →</Text>
            </Pressable>
          </View>
          <View style={styles.postsList}>
            {UPCOMING_POSTS.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <Image source={{ uri: post.image }} style={styles.postImage} />
                <View style={styles.postContent}>
                  <Text style={styles.postTitleText} numberOfLines={1}>{post.title}</Text>
                  <Text style={styles.postSubText}>{post.platform} • {post.when}</Text>
                </View>
                <Pressable style={styles.editBtn}>
                  <Text style={styles.editBtnText}>Edit Post</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Stacked Layout for Mobile: Templates & Powerups each taking full width */}
        <View style={styles.stackedCardCol}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleText} numberOfLines={1}>Social Templates</Text>
              <Pressable hitSlop={10}>
                <Text style={styles.sectionLinkText}>Manage →</Text>
              </Pressable>
            </View>
            <View style={styles.templatesList}>
              {SOCIAL_TEMPLATES.map((tmp) => (
                <View key={tmp.id} style={styles.templateCard}>
                  <View style={styles.templateIconSmall}>
                    <MaterialCommunityIcons name={tmp.icon} size={16} color={colors.textPrimary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.templateTitleText}>{tmp.title}</Text>
                    <Text style={styles.templateSubText}>{tmp.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Power-Ups Card */}
          <View style={styles.powerUpFixedCard}>
            <Text style={styles.powerUpTitleText}>Power-Ups</Text>
            <Text style={styles.powerUpDescText}>
              Connect more accounts to unlock advanced analytics.
            </Text>
            <View style={styles.platformIconRow}>
              <View style={styles.platformIconCircle}><MaterialCommunityIcons name="instagram" size={18} color="#FFF" /></View>
              <View style={styles.platformIconCircle}><MaterialCommunityIcons name="facebook" size={18} color="#FFF" /></View>
              <View style={styles.platformIconCircle}><MaterialCommunityIcons name="linkedin" size={18} color="#FFF" /></View>
            </View>
          </View>
        </View>

        {/* AI Usage Card (Simplified) */}
        <View style={styles.usageCardPremium}>
          <View style={styles.usageInfo}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={colors.accentTeal} />
            <Text style={styles.usageLabel}>AI Generation Credits: <Text style={{ fontWeight: '800' }}>150/1000 left</Text></Text>
          </View>
          <View style={styles.usageBar}>
            <View style={[styles.usageFill, { width: '85%' }]} />
          </View>
        </View>

        {/* Restore Hub Sections List at bottom */}
        <View style={styles.restoreHubContainer}>
          <Text style={styles.restoreHubTitle}>Explore Social Hub</Text>
          <View style={styles.restoreHubList}>
            {HUB_TABS.filter(t => t.id !== 'Overview').map((tab) => (
              <Pressable
                key={tab.id}
                style={styles.restoreHubRow}
                onPress={() => tab.route && router.push(tab.route as any)}>
                <View style={styles.restoreHubIconWrap}>
                  <MaterialCommunityIcons name={tab.icon} size={20} color={colors.textPrimary} />
                </View>
                <Text style={styles.restoreHubLabel}>{tab.label}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>


        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

// Custom Image component to avoid errors if expo-image is missing, but it was in header
import { Image } from 'expo-image';

function getStyles(colors: any) {
  return StyleSheet.create({
  background: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18 },



  // Overview Header
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  overviewHeaderText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },

  // Restore Hub Sections
  restoreHubContainer: {
    marginTop: 24,
  },
  restoreHubTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  restoreHubList: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  restoreHubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  restoreHubIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreHubLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Header Actions Mobile
  headerActionsMobile: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    paddingTop: 8,
  },
  accountBtn: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    justifyContent: 'center',
  },
  accountBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  createBtn: {
    flex: 1,
    backgroundColor: colors.accentTeal,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },

  // Stats Premium
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCardPremium: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    ...Platform.select({
      ios: { shadowColor: colors.cardShadowColor, shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8 },
      android: { elevation: 2 }
    })
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    flexWrap: 'wrap',
  },
  statValueText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  statMetaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },

  // Sections
  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: colors.cardShadowColor, shadowOpacity: 0.03, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10 },
      android: { elevation: 1 }
    })
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  sectionLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentTeal,
  },

  // Posts
  postsList: { gap: 12 },
  postCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    padding: 12,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  postImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.cardBorder,
  },
  postContent: { flex: 1 },
  postTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  postSubText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  editBtn: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  // Stacked Row
  stackedCardCol: {
    gap: 12,
    marginBottom: 16,
  },
  templatesList: { gap: 10 },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surfaceSoft,
    padding: 10,
    borderRadius: 12,
  },
  templateIconSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  templateTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  templateSubText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
  },

  // Power Up Fixed
  powerUpFixedCard: {
    backgroundColor: colors.accentTeal,
    borderRadius: 20,
    padding: 18,
    justifyContent: 'center',
  },
  powerUpTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 6,
  },
  powerUpDescText: {
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginBottom: 16,
  },
  platformIconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  platformIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Usage Premium
  usageCardPremium: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  usageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  usageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  usageBar: {
    height: 6,
    backgroundColor: colors.cardBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  usageFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 3,
  },
  });
}

