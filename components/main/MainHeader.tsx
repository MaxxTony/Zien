import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { memo, useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MainHeaderProps = {
  onMenuPress: () => void;
  userInitials?: string;
  userName?: string;
  userEmail?: string;
  profileRoute?: Href;
};

// ── User Menu Bottom Sheet ──────────────────────────────
type MenuAction = {
  id: string;
  icon: string;
  label: string;
  color?: string;
  onPress: () => void;
};

type UserMenuSheetProps = {
  visible: boolean;
  onClose: () => void;
  userInitials: string;
  userName: string;
  userEmail: string;
  actions: MenuAction[];
};

function UserMenuSheet({
  visible, onClose, userInitials, userName, userEmail, actions,
}: UserMenuSheetProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onShow = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 300, duration: 240, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [slideAnim, fadeAnim, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      onShow={onShow}
    >
      {/* Backdrop */}
      <Animated.View style={[sheetStyles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={{ flex: 1 }} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          sheetStyles.sheet,
          { paddingBottom: insets.bottom + 16, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Drag handle */}
        <View style={sheetStyles.handle} />

        {/* User info header */}
        <View style={sheetStyles.userRow}>
          <LinearGradient
            colors={['#0BA0B2', '#1B5E9A']}
            style={sheetStyles.userAvatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={sheetStyles.userAvatarText}>{userInitials}</Text>
          </LinearGradient>
          <View style={sheetStyles.userInfo}>
            <Text style={sheetStyles.userName}>{userName}</Text>
            <Text style={sheetStyles.userEmail}>{userEmail}</Text>
          </View>
          {/* Online badge */}
          <View style={sheetStyles.onlineBadge}>
            <View style={sheetStyles.onlineDot} />
            <Text style={sheetStyles.onlineText}>Online</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={sheetStyles.divider} />

        {/* Actions */}
        <View style={sheetStyles.actions}>
          {actions.map((action, idx) => {
            const isLast = idx === actions.length - 1;
            const isDestructive = action.color === '#EF4444';
            return (
              <View key={action.id}>
                {isDestructive && <View style={sheetStyles.divider} />}
                <Pressable
                  style={({ pressed }) => [
                    sheetStyles.actionRow,
                    pressed && sheetStyles.actionRowPressed,
                  ]}
                  onPress={() => { handleClose(); setTimeout(action.onPress, 260); }}
                >
                  <View style={[
                    sheetStyles.actionIcon,
                    isDestructive && sheetStyles.actionIconDestructive,
                  ]}>
                    <MaterialCommunityIcons
                      name={action.icon as any}
                      size={20}
                      color={action.color ?? Theme.textPrimary}
                    />
                  </View>
                  <Text style={[
                    sheetStyles.actionLabel,
                    isDestructive && sheetStyles.actionLabelDestructive,
                  ]}>
                    {action.label}
                  </Text>
                  {!isDestructive && (
                    <MaterialCommunityIcons name="chevron-right" size={18} color={Theme.inputPlaceholder} />
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </Animated.View>
    </Modal>
  );
}

const sheetStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,20,35,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -10 },
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D9E0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 14,
    marginBottom: 18,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0BA0B2',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  userAvatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.textPrimary,
    letterSpacing: 0.1,
  },
  userEmail: {
    fontSize: 13,
    color: Theme.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  onlineText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  actions: {
    gap: 2,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 14,
  },
  actionRowPressed: {
    backgroundColor: Theme.surfaceSoft,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Theme.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorder,
  },
  actionIconDestructive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  actionLabelDestructive: {
    color: '#EF4444',
  },
});

// ── Main Header ────────────────────────────────────────
function MainHeaderComponent({
  onMenuPress,
  userInitials = 'VP',
  userName = 'John Octane',
  userEmail = 'john@zien.ai',
  profileRoute = '/(main)/profile' as Href,
}: MainHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Zien?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/login'),
        },
      ],
      { cancelable: true }
    );
  }, [router]);

  const MENU_ACTIONS: MenuAction[] = [
    {
      id: 'profile',
      icon: 'account-circle-outline',
      label: 'My Profile',
      onPress: () => router.push(profileRoute),
    },
    {
      id: 'notifications',
      icon: 'bell-outline',
      label: 'Notifications',
      onPress: () => router.push('/(main)/notifications'),
    },
    {
      id: 'signout',
      icon: 'logout-variant',
      label: 'Sign Out',
      color: '#EF4444',
      onPress: handleSignOut,
    },
  ];

  return (
    <>
      <View style={styles.header}>
        {/* Hamburger */}
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          onPress={onMenuPress}
        >
          <MaterialCommunityIcons name="menu" size={22} color={Theme.textPrimary} />
        </Pressable>

        {/* Brand logo centered */}
        <View style={styles.center}>
          <Image
            source={require('@/assets/appImages/nlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Avatar → opens bottom sheet */}
        <Pressable
          style={({ pressed }) => [styles.avatarWrap, pressed && { opacity: 0.8 }]}
          onPress={() => setMenuOpen(true)}
        >
          <LinearGradient
            colors={['#0BA0B2', '#1B5E9A']}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>{userInitials}</Text>
          </LinearGradient>
          <View style={styles.onlineDot} />
        </Pressable>
      </View>

      {/* Bottom sheet user menu */}
      <UserMenuSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        userInitials={userInitials}
        userName={userName}
        userEmail={userEmail}
        actions={MENU_ACTIONS}
      />
    </>
  );
}

export const MainHeader = memo(MainHeaderComponent);

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(225,232,242,0.8)',
    shadowColor: '#0A2F48',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 46,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0BA0B2',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
