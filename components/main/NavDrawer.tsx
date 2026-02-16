import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
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
import { Theme } from '@/constants/theme';

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

  if (!visible) return null;

  const handlePress = (route?: Href) => {
    if (route) router.push(route);
    onItemPress(route);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.drawer,
          {
            width,
            paddingTop,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Image
            source={require('@/assets/appImages/nlogo.png')}
            style={styles.drawerLogo}
            resizeMode="contain"
          />
          <Pressable style={styles.drawerCloseButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={20} color={Theme.textPrimary} />
          </Pressable>
        </View>
        <ScrollView
          style={styles.drawerScroll}
          contentContainerStyle={styles.drawerList}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              style={styles.drawerItem}
              onPress={() => handlePress(item.route)}
              disabled={!item.route}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={18}
                color={item.route ? Theme.textPrimary : Theme.textSecondary}
              />
              <Text
                style={[
                  styles.drawerItemText,
                  item.route ? styles.drawerItemTextActive : null,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

export const NavDrawer = memo(NavDrawerComponent);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 20, 30, 0.2)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Theme.cardBackground,
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderRightWidth: 1,
    borderRightColor: Theme.drawerBorder,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  drawerLogo: {
    width: 100,
    height: 40,
  },
  drawerCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.cardBackground,
    borderWidth: 1,
    borderColor: Theme.drawerBorder,
  },
  drawerList: {
    gap: 10,
    paddingBottom: 12,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  drawerItemText: {
    fontSize: 13.5,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  drawerItemTextActive: {
    color: Theme.textPrimary,
  },
});
