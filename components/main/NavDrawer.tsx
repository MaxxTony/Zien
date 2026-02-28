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
            <MaterialCommunityIcons name="close" size={18} color="#5B6B7A" />
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
            // Updated active check: if route is /(main)/dashboard, match /dashboard too
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
                ]}
                onPress={() => handlePress(item.route)}
                disabled={!item.route}
              >
                {isActive && <View style={styles.activeIndicator} />}

                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color={isActive ? '#0BA0B2' : '#5B6B7A'}
                    style={isActive ? styles.activeIcon : {}}
                  />
                </View>

                <Text
                  style={[
                    styles.itemText,
                    isActive ? styles.itemTextActive : {},
                    !item.route ? styles.itemTextDisabled : {},
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>



      </Animated.View>
    </View>
  );
}

export const NavDrawer = memo(NavDrawerComponent);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F8FAFC', // Slightly off-white background like web
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 5, height: 0 },
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
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
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
    backgroundColor: '#E1F0F2', // Light teal background for active item
  },
  itemPressed: {
    backgroundColor: '#F1F5F9',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#0BA0B2', // Teal vertical line on left
  },
  iconWrap: {
    width: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    // Optional: add some glow or specific styling for active icon
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5B6B7A', // Grey text for inactive
  },
  itemTextActive: {
    color: '#0D2F45', // Dark teal for active text
    fontWeight: '700',
  },
  itemTextDisabled: {
    color: '#CBD5E1',
  },

});
