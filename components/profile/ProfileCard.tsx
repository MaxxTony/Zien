import { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Theme } from '@/constants/theme';

type ProfileCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

function ProfileCardComponent({ children, style }: ProfileCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export const ProfileCard = memo(ProfileCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    shadowColor: Theme.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
});
