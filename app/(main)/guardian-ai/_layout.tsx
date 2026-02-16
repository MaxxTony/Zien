import { Stack } from 'expo-router';

export default function GuardianAiLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="monitoring" />
      <Stack.Screen name="risk-charts" />
      <Stack.Screen name="policy-manager" />
      <Stack.Screen name="interventions" />
      <Stack.Screen name="logs-reports" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
