import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Theme } from '@/constants/theme';

type NotificationItem = {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  actionLabel?: string;
  actionRoute?: string;
  unread?: boolean;
};

const NOTIFICATIONS_BY_SECTION: { section: string; items: NotificationItem[] }[] = [
  {
    section: 'TODAY',
    items: [
      {
        id: '1',
        icon: 'home-city-outline',
        iconColor: '#0BA0B2',
        iconBg: '#0BA0B218',
        title: 'AI Valuation Completed',
        body: 'Valuation report for 124 Ocean Drive is ready. 15% increase in estimated value.',
        time: '2 hours ago',
        actionLabel: 'View Report',
        actionRoute: '/(main)/properties',
        unread: true,
      },
      {
        id: '2',
        icon: 'email-outline',
        iconColor: '#EA580C',
        iconBg: '#EA580C18',
        title: 'Campaign Sent',
        body: 'Monthly Market Update campaign deployed to 450 contacts. Open rates trending at 32%.',
        time: '4 hours ago',
        actionLabel: 'View Analytics',
        actionRoute: '/(main)/crm/campaigns',
        unread: true,
      },
      {
        id: '3',
        icon: 'lightning-bolt-outline',
        iconColor: '#16A34A',
        iconBg: '#16A34A18',
        title: 'New Feature Unlocked',
        body: 'Visual ROI Estimates with spatial AI is now available in your workspace.',
        time: '6 hours ago',
        actionLabel: 'Try now',
        unread: true,
      },
    ],
  },
  {
    section: 'YESTERDAY',
    items: [
      {
        id: '4',
        icon: 'shield-check-outline',
        iconColor: '#16A34A',
        iconBg: '#16A34A18',
        title: 'Guardian AI Activated',
        body: 'Safety monitoring was active for your showing at 88 Summit Ave.',
        time: 'Yesterday at 4:30 PM',
        actionLabel: 'View Log',
        actionRoute: '/(main)/guardian-ai',
      },
      {
        id: '5',
        icon: 'account-group-outline',
        iconColor: '#0BA0B2',
        iconBg: '#0BA0B218',
        title: 'New Leads Acquired',
        body: '3 new leads were captured via your Digital Card NFC tap.',
        time: 'Yesterday at 2:15 PM',
        actionLabel: 'Go to CRM',
        actionRoute: '/(main)/crm/contacts',
      },
    ],
  },
  {
    section: 'EARLIER',
    items: [
      {
        id: '6',
        icon: 'home-city-outline',
        iconColor: '#0BA0B2',
        iconBg: '#0BA0B218',
        title: 'Property Status Changed',
        body: '45 Lakeview Dr has been moved from Active to Pending based on MLS data sync.',
        time: 'Feb 3, 2026',
      },
    ],
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#D8E9F6', '#F1F6FB', '#F5E6DB']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Stay updated with your latest intelligence feed.</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS_BY_SECTION.map(({ section, items }) => (
          <View key={section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section}</Text>
            {items.map((item) => (
              <Pressable
                key={item.id}
                style={styles.card}
                onPress={() => item.actionRoute && router.push(item.actionRoute as any)}>
                {item.unread ? <View style={styles.unreadDot} /> : null}
                <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color={item.iconColor} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardBody}>{item.body}</Text>
                  <Text style={styles.cardTime}>{item.time}</Text>
                  {item.actionLabel ? (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        if (item.actionRoute) router.push(item.actionRoute as any);
                      }}>
                      <Text style={styles.actionLink}>{item.actionLabel}</Text>
                    </Pressable>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    padding: 6,
  },
  headerCenter: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Theme.textMuted,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Theme.cardBackground,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EA580C',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.textPrimary,
    paddingRight: 18,
  },
  cardBody: {
    fontSize: 13,
    color: Theme.textSecondary,
    lineHeight: 19,
  },
  cardTime: {
    fontSize: 12,
    color: Theme.textMuted,
    marginTop: 2,
  },
  actionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.link,
    marginTop: 6,
    textDecorationLine: 'underline',
  },
});
