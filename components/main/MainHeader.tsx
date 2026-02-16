import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type MainHeaderProps = {
  onMenuPress: () => void;
  userInitials?: string;
  profileRoute?: Href;
};

function MainHeaderComponent({ onMenuPress, userInitials = 'VP', profileRoute = '/(main)/profile' }: MainHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable style={styles.headerSlot} onPress={onMenuPress}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="menu" size={25} color={Theme.textPrimary} />
        </View>
      </Pressable>
      <View style={styles.headerCenter}>
        <View style={styles.brandContainer}>
          <Image
            source={require('@/assets/appImages/nlogo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.headerSlot}>
        <Pressable style={styles.userBadge} onPress={() => router.push(profileRoute)}>
          <Text style={styles.userBadgeText}>{userInitials}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export const MainHeader = memo(MainHeaderComponent);

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  headerSlot: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 100,
    height: 45,
  },
  userBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Theme.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  userBadgeText: {
    color: Theme.textOnAccent,
    fontWeight: '700',
    fontSize: 12,
  },
});
