import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  marginTop?: number;
};

type NavDrawerProps = {
  visible: boolean;
  translateX: Animated.Value;
  width: number;
  paddingTop: number;
  menuItems: NavMenuItem[];
  onClose: () => void;
  onItemPress: (route?: Href) => void;
  customLogo?: React.ReactNode;
  customBackground?: string;
  backToMainRoute?: Href;
};

function NavDrawerComponent({
  visible,
  translateX,
  width,
  paddingTop,
  menuItems,
  onClose,
  onItemPress,
  customLogo,
  customBackground,
  backToMainRoute,
}: NavDrawerProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments.length > 0 ? '/' + segments.join('/') : '/dashboard';

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
          customBackground ? { backgroundColor: customBackground } : {},
        ]}
      >
        {/* Header */}
        <View style={styles.drawerHeader}>
          {customLogo ? (
            customLogo
          ) : (
            <Image
              source={require('@/assets/appImages/nlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
            onPress={onClose}
          >
            <MaterialCommunityIcons name="close" size={18} color={customBackground ? '#5B6B7A' : colors.textSecondary} />
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
            const itemRoute = (item.route as string) || '';
            const isActive = itemRoute === currentRoute ||
              (itemRoute.includes('(main)') && currentRoute === itemRoute.replace('/(main)', '')) ||
              (currentRoute === '/dashboard' && itemRoute.includes('dashboard'));

            return (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.item,
                  isActive && styles.itemActive,
                  pressed && !isActive && styles.itemPressed,
                  item.marginTop ? { marginTop: item.marginTop } : {},
                ]}
                onPress={() => handlePress(item.route)}
                disabled={!item.route}
              >
                {isActive && <View style={styles.activeIndicator} />}

                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color={isActive ? colors.accentTeal : (customBackground ? 'rgba(255,255,255,0.7)' : colors.textSecondary)}
                  />
                </View>

                <Text
                  style={[
                    styles.itemText,
                    isActive ? styles.itemTextActive : {},
                    !item.route ? styles.itemTextDisabled : {},
                    customBackground ? { color: isActive ? colors.accentTeal : 'rgba(255,255,255,0.7)' } : {},
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Back to main link at the bottom if provided */}
        {backToMainRoute && (
          <View style={{ paddingTop: 10, borderTopWidth: 1, borderTopColor: customBackground ? 'rgba(255,255,255,0.1)' : colors.divider }}>
            <Pressable
              style={({ pressed }) => [styles.item, { marginBottom: 20 }, pressed && { opacity: 0.7 }]}
              onPress={() => router.push(backToMainRoute)}
            >
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons 
                    name="arrow-left" 
                    size={20} 
                    color={customBackground ? '#fff' : colors.textSecondary} 
                />
              </View>
              <Text style={[styles.itemText, customBackground ? { color: '#fff' } : {}]}>Back to Main App</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

export const NavDrawer = memo(NavDrawerComponent);

function getStyles(colors: any) {
  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(8, 20, 35, 0.45)',
    },
    drawer: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.cardBackground,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 20,
      shadowOffset: { width: 4, height: 0 },
      elevation: 8,
    },
    drawerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    logo: {
      width: 80,
      height: 32,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    headerDivider: {
      height: 1,
      backgroundColor: colors.divider,
      marginHorizontal: 20,
      marginBottom: 8,
      opacity: 0.6,
    },
    scroll: {
      flex: 1,
    },
    list: {
      paddingVertical: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      position: 'relative',
      height: 48,
    },
    itemActive: {
      backgroundColor: `${colors.accentTeal}15`,
    },
    itemPressed: {
      backgroundColor: colors.surfaceSoft,
    },
    activeIndicator: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: colors.accentTeal,
    },
    iconWrap: {
      width: 24,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    itemTextActive: {
      color: colors.textPrimary,
      fontWeight: '700',
    },
    itemTextDisabled: {
      color: colors.inputPlaceholder,
    },
  });
}
