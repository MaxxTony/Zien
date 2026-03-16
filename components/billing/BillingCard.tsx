import { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

type BillingCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

function BillingCardComponent({ children, style }: BillingCardProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  return <View style={[styles.card, style]}>{children}</View>;
}

export const BillingCard = memo(BillingCardComponent);

function getStyles(colors: any) {
  return StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackgroundSoft,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 14,
  },
});
}
