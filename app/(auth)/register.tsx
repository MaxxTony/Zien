import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthCard, AuthLogoBrand, AuthScreenBackground, AuthSubtitle, AuthTitle } from '@/components/auth';

import { Theme } from '@/constants/theme';

const ACCOUNT_TYPES = [
  {
    id: 'solo',
    title: 'Pro Agent (Individual)',
    description: 'Perfect for individual agents growing their business with AI power.',
    icon: 'account-outline',
  },
  {
    id: 'team',
    title: 'Create a Team',
    description: 'Ideal for team leaders looking to scale their productivity and collaboration.',
    icon: 'account-group-outline',
  },
  {
    id: 'join',
    title: 'Join Existing Team',
    description: 'Connecting with your team? Access your workspace with an invite.',
    icon: 'office-building-outline',
  },
  {
    id: 'enterprise',
    title: 'Brokerage / Enterprise',
    description: 'Custom solutions for large organizations. Contact for SSO & setup.',
    icon: 'diamond-outline',
  },
];

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <AuthScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthCard style={styles.cardSoft}>
          <AuthLogoBrand brandLabel="ZIEN" />
          <AuthTitle>Account Type</AuthTitle>
          <AuthSubtitle center>Choose your path to begin your AI journey</AuthSubtitle>

          <View style={styles.list}>
            {ACCOUNT_TYPES.map((item) => (
              <Pressable
                key={item.id}
                style={styles.listItem}
                onPress={() => {
                  if (item.id === 'enterprise') {
                    router.push('/(auth)/enterprise-contact');
                    return;
                  }
                  if (item.id === 'join') {
                    router.push('/(auth)/join-team-invite');
                    return;
                  }
                  if (item.id === 'team') {
                    router.push('/(auth)/team-onboarding');
                    return;
                  }
                  if (item.id === 'solo') {
                    router.push('/(auth)/solo-onboarding');
                    return;
                  }
                  Alert.alert('Coming soon');
                }}>
                <View style={styles.listIcon}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color={Theme.iconMuted} />
                </View>
                <View style={styles.listContent}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.listDescription}>{item.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Link href="/(auth)/login" style={styles.footerLink}>
              Sign in
            </Link>
          </Text>
        </AuthCard>
      </ScrollView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: Theme.screenPadding,
    justifyContent: 'center',
  },
  cardSoft: {
    backgroundColor: Theme.cardBackground,
  },
  list: {
    alignSelf: 'stretch',
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Theme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    padding: 14,
  },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Theme.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  listDescription: {
    fontSize: 12.5,
    color: Theme.textMuted,
  },
  footerText: {
    marginTop: 18,
    fontSize: 12.5,
    color: Theme.textMuted,
  },
  footerLink: {
    color: Theme.link,
    fontWeight: '600',
  },
});
