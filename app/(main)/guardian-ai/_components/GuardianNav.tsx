import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SECTIONS: Array<{
  route: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}> = [
  { route: '/(main)/guardian-ai', label: 'Overview', icon: 'view-dashboard-outline' },
  { route: '/(main)/guardian-ai/monitoring', label: 'Monitoring', icon: 'target' },
  { route: '/(main)/guardian-ai/risk-charts', label: 'Risk Charts', icon: 'chart-line' },
  { route: '/(main)/guardian-ai/policy-manager', label: 'Policy', icon: 'shield-check-outline' },
  { route: '/(main)/guardian-ai/interventions', label: 'Interventions', icon: 'bell-badge-outline' },
  { route: '/(main)/guardian-ai/logs-reports', label: 'Logs', icon: 'file-document-outline' },
  { route: '/(main)/guardian-ai/admin', label: 'Admin', icon: 'cog-outline' },
];

export  function GuardianNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const normalizedPath = pathname.replace(/\/$/, '') || '';
  const isOverview =
    !normalizedPath ||
    normalizedPath === '/(main)/guardian-ai' ||
    normalizedPath === 'guardian-ai' ||
    normalizedPath.endsWith('/guardian-ai');
  const basePath = normalizedPath.startsWith('/(main)') ? normalizedPath : `/(main)${normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath}`;

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom}]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {SECTIONS.map(({ route, label, icon }) => {
          const isActive =
            route === '/(main)/guardian-ai'
              ? isOverview
              : basePath === route;
          return (
            <Pressable
              key={route}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => router.push(route as any)}>
              <MaterialCommunityIcons
                name={icon}
                size={18}
                color={isActive ? '#FFFFFF' : '#5B6B7A'}
              />
              <Text style={[styles.pillText, isActive && styles.pillTextActive]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(247, 251, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#E3ECF4',
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  pillActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5B6B7A',
    maxWidth: 72,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});
