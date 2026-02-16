import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ZienCardNav } from './ZienCardNav';

type ZienCardScreenShellProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  children: ReactNode;
  showNav?: boolean;
  /** Optional element shown on the right side of the header (e.g. save icon). */
  headerRight?: ReactNode;
};

export function ZienCardScreenShell({
  title,
  subtitle,
  showBack = true,
  children,
  showNav = true,
  headerRight,
}: ZienCardScreenShellProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.headerWrap}>
        <View style={styles.header}>
          {showBack && (
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
            </Pressable>
          )}
          <View style={[styles.headerText, !showBack && styles.headerTextFull]}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {headerRight != null ? headerRight : null}
        </View>
      </View>
      {children}
      {showNav && <ZienCardNav />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  headerWrap: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F7FBFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  headerText: { flex: 1 },
  headerTextFull: { marginLeft: 0 },
  title: { fontSize: 20, fontWeight: '900', color: '#0B2D3E' },
  subtitle: { fontSize: 12.5, color: '#5B6B7A', marginTop: 4, fontWeight: '700' },
});
