import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { Href } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import { memo } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type NavMenuItem = {
  label: string;
  icon: string;
  route?: Href;
};

type NavDrawerProps = {
  visible: boolean;
  translateX: Animated.Value;
  width: number;
  paddingTop: number;
  menuItems: NavMenuItem[];
  onClose: () => void;
  onItemPress: (route?: Href) => void;
};

function NavDrawerComponent({
  visible,
  translateX,
  width,
  paddingTop,
  menuItems,
  onClose,
  onItemPress,
}: NavDrawerProps) {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = '/' + segments.join('/');

  if (!visible) return null;

  const handlePress = (route?: Href) => {
    if (route) router.push(route);
    onItemPress(route);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          { width, paddingTop, transform: [{ translateX }] },
        ]}
      >
        {/* Header */}
        <View style={styles.drawerHeader}>
          <Image
            source={require('@/assets/appImages/nlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
            onPress={onClose}
          >
            <MaterialCommunityIcons name="close" size={18} color={Theme.textPrimary} />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.headerDivider} />

        {/* Nav Items */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => {
            const isActive = item.route ? currentRoute.includes(item.route as string) : false;
            return (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.item,
                  isActive && styles.itemActive,
                  pressed && !isActive && styles.itemPressed,
                ]}
                onPress={() => handlePress(item.route)}
                disabled={!item.route}
              >
                {isActive && (
                  <LinearGradient
                    colors={['#0BA0B2', '#1B5E9A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.activeIconWrap}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={16}
                      color="#fff"
                    />
                  </LinearGradient>
                )}
                {!isActive && (
                  <View style={styles.inactiveIconWrap}>
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={16}
                      color={item.route ? Theme.textSecondary : Theme.inputPlaceholder}
                    />
                  </View>
                )}
                <Text
                  style={[
                    styles.itemText,
                    isActive ? styles.itemTextActive : {},
                    !item.route ? styles.itemTextDisabled : {},
                  ]}
                >
                  {item.label}
                </Text>
                {isActive && (
                  <View style={styles.activePip} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color={Theme.accentTeal} />
            <Text style={styles.footerText}>Guardian AI Active</Text>
            <View style={styles.footerDot} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export const NavDrawer = memo(NavDrawerComponent);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,18,30,0.35)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 8, height: 0 },
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  logo: {
    width: 95,
    height: 38,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Theme.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorder,
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(228,234,242,0.9)',
    marginBottom: 10,
  },
  scroll: {
    flex: 1,
  },
  list: {
    gap: 4,
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  itemActive: {
    backgroundColor: `${Theme.accentTeal}10`,
  },
  itemPressed: {
    backgroundColor: Theme.surfaceIcon,
  },
  activeIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.surfaceIcon,
  },
  itemText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  itemTextActive: {
    color: Theme.accentTeal,
    fontWeight: '800',
  },
  itemTextDisabled: {
    color: Theme.inputPlaceholder,
  },
  activePip: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.accentTeal,
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(228,234,242,0.9)',
    paddingTop: 14,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${Theme.accentTeal}10`,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: `${Theme.accentTeal}20`,
  },
  footerText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: Theme.accentTeal,
  },
  footerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
});
