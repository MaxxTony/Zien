import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  userId: string | null;
  accessToken: string | null;
  userRole: string | null;
  isLoading: boolean;
  login: (id: string, token: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadStorageData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[1] === 'solo-onboarding' || segments[1] === 'team-onboarding';
    const atRoot = !segments[0];

    if (userId) {
      if ((inAuthGroup && !inOnboarding) || atRoot) {
        // Redirect based on role
        const dashboardPath = userRole === 'agency_user' ? '/agency' : '/(main)/dashboard';
        router.replace(dashboardPath as any);
      }
    } else {
      if (!inAuthGroup) {
        // Redirect to login if not logged in and not at auth pages
        router.replace('/login');
      }
    }
  }, [userId, userRole, segments, isLoading]);

  const loadStorageData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      const storedToken = await AsyncStorage.getItem('access_token');
      const storedRole = await AsyncStorage.getItem('user_role');

      if (storedUserId) {
        setUserId(storedUserId);
      }
      if (storedToken) {
        setAccessToken(storedToken);
      }
      if (storedRole) {
        setUserRole(storedRole);
      }
    } catch (e) {
      console.error('Failed to load auth data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (id: string, token: string, role?: string) => {
    setUserId(id);
    setAccessToken(token);
    if (role) setUserRole(role);
    await AsyncStorage.setItem('user_id', id);
    await AsyncStorage.setItem('access_token', token);
    if (role) await AsyncStorage.setItem('user_role', role);
  };

  const logout = async () => {
    setUserId(null);
    setAccessToken(null);
    setUserRole(null);
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user_role');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ userId, accessToken, userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
