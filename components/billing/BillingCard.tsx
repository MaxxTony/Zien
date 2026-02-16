import { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Theme } from '@/constants/theme';

type BillingCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

function BillingCardComponent({ children, style }: BillingCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export const BillingCard = memo(BillingCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackgroundSoft,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.cardBorder,
    gap: 14,
  },
});
