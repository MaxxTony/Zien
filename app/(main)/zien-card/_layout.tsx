import { Stack } from 'expo-router';

export default function ZienCardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="basic-information" />
      <Stack.Screen name="themes-color" />
      <Stack.Screen name="lead-enquiries" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}
