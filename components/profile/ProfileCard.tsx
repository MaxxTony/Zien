import { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

type ProfileCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

function ProfileCardComponent({ children, style }: ProfileCardProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  return <View style={[styles.card, style]}>{children}</View>;
}

export const ProfileCard = memo(ProfileCardComponent);

function getStyles(colors: any) {
  return StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
});
}
