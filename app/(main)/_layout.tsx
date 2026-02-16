import { Stack } from 'expo-router';

/**
 * Layout for the (main) route group. Required so the root layout's
 * <Stack.Screen name="(main)" /> resolves correctly—without this file,
 * Expo Router reports: "No route named '(main)' exists in nested children".
 */
export default function MainLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
