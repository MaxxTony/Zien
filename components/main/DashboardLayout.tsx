import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/constants/theme';
import type { NavMenuItem } from './NavDrawer';
import { MainHeader } from './MainHeader';
import { NavDrawer } from './NavDrawer';

const DRAWER_WIDTH = 265;

type DashboardLayoutProps = {
  children: React.ReactNode;
  menuItems: NavMenuItem[];
  userInitials?: string;
  profileRoute?: string;
};

export function DashboardLayout({
  children,
  menuItems,
  userInitials,
  profileRoute,
}: DashboardLayoutProps) {
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const drawerTranslateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const openMenu = useMemo(
    () => () => {
      setIsMenuOpen(true);
      Animated.timing(drawerTranslateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    },
    [drawerTranslateX]
  );

  const closeMenu = useMemo(
    () => () => {
      Animated.timing(drawerTranslateX, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setIsMenuOpen(false);
      });
    },
    [drawerTranslateX]
  );

  const handleMenuPress = useMemo(
    () => (route?: import('expo-router').Href) => {
      closeMenu();
    },
    [closeMenu]
  );

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[...Theme.backgroundGradient]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.background, { paddingTop: insets.top }]}
      >
        <MainHeader
          onMenuPress={openMenu}
          userInitials={userInitials}
          profileRoute={profileRoute as any}
        />
        {children}
      </LinearGradient>
      <NavDrawer
        visible={isMenuOpen}
        translateX={drawerTranslateX}
        width={DRAWER_WIDTH}
        paddingTop={insets.top + 18}
        menuItems={menuItems}
        onClose={closeMenu}
        onItemPress={handleMenuPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
});
