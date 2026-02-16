import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

export type ProfileTabKey = 'identity' | 'professional' | 'security' | 'organization';

const TABS: { key: ProfileTabKey; label: string; icon: string }[] = [
  { key: 'identity', label: 'Identity', icon: 'account-outline' },
  { key: 'professional', label: 'Professional Info', icon: 'briefcase-outline' },
  { key: 'security', label: 'Security', icon: 'lock-outline' },
  { key: 'organization', label: 'Organization', icon: 'office-building-outline' },
];

type ProfileTabsProps = {
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
};

function ProfileTabsComponent({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab.key)}
          >
            <MaterialCommunityIcons
              name={tab.icon as any}
              size={18}
              color={isActive ? Theme.accentTeal : Theme.textSecondary}
            />
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const ProfileTabs = memo(ProfileTabsComponent);

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 16,
  },
  container: {
    gap: 10,
    paddingRight: 18,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Theme.surfaceSoft,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
  },
  tabActive: {
    borderColor: Theme.accentTeal,
    backgroundColor: Theme.cardBackgroundSoft,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  tabTextActive: {
    color: Theme.textPrimary,
  },
});
