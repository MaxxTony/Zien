import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';

const SECTIONS: Array<{
  route: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}> = [
  { route: '/(main)/zien-card', label: 'Dashboard', icon: 'view-dashboard-outline' },
  { route: '/(main)/zien-card/basic-information', label: 'Basic Information', icon: 'card-account-details-outline' },
  { route: '/(main)/zien-card/themes-color', label: 'Themes & Color', icon: 'palette-outline' },
  { route: '/(main)/zien-card/lead-enquiries', label: 'Lead Enquiries', icon: 'account-group-outline' },
  { route: '/(main)/zien-card/analytics', label: 'Analytics', icon: 'chart-bar' },
];

export function ZienCardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const normalizedPath = pathname.replace(/\/$/, '') || '';
  const isDashboard =
    !normalizedPath ||
    normalizedPath === '/(main)/zien-card' ||
    normalizedPath === 'zien-card' ||
    normalizedPath.endsWith('/zien-card');
  const basePath = normalizedPath.startsWith('/(main)') ? normalizedPath : `/(main)${normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath}`;

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {SECTIONS.map(({ route, label, icon }) => {
          const isActive =
            route === '/(main)/zien-card'
              ? isDashboard
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

const getStyles = (colors: any) => StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillActive: {
    backgroundColor: '#0BA0B2',
    borderColor: '#0BA0B2',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    maxWidth: 100,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});
