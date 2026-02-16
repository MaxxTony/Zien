import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

export type BillingTabKey = 'overview' | 'history' | 'analytics' | 'marketplace';

const TABS: Array<{
  key: BillingTabKey;
  label: string;
  icon: string;
}> = [
  { key: 'overview', label: 'Overview', icon: 'view-dashboard-outline' },
  { key: 'history', label: 'History', icon: 'history' },
  { key: 'analytics', label: 'Analytics', icon: 'chart-bar' },
  { key: 'marketplace', label: 'Marketplace', icon: 'storefront-outline' },
];

type BillingScreenHeaderProps = {
  activeTab: BillingTabKey;
  onTabChange: (tab: BillingTabKey) => void;
};

function BillingScreenHeaderComponent({ activeTab, onTabChange }: BillingScreenHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={Theme.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Subscription & Capital</Text>
          <Text style={styles.subtitle}>
            Manage your enterprise tier, financial history, and resource allocation.
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
        style={styles.tabsScroll}
      >
        {TABS.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <Pressable
              key={t.key}
              style={[styles.tabPill, isActive && styles.tabPillActive]}
              onPress={() => onTabChange(t.key)}
            >
              <MaterialCommunityIcons
                name={t.icon as any}
                size={16}
                color={isActive ? Theme.textOnAccent : Theme.textSecondary}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export const BillingScreenHeader = memo(BillingScreenHeaderComponent);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Theme.surfaceSoft,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  tabsScroll: {
    flexGrow: 0,
  },
  tabsContent: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 18,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Theme.surfaceSoft,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 12.5,
    color: Theme.textSecondary,
    fontWeight: '700',
  },
  tabPillActive: {
    backgroundColor: Theme.accentDark,
    borderColor: Theme.accentDark,
  },
  tabTextActive: {
    color: Theme.textOnAccent,
  },
});
