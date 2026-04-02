import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  userId: string | null;
  isLoading: boolean;
  login: (id: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadStorageData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const atRoot = !segments[0];

    if (userId) {
      if (inAuthGroup || atRoot) {
        // Redirect to dashboard if logged in and at auth pages or root
        router.replace('/(main)/dashboard');
      }
    } else {
      if (!inAuthGroup) {
        // Redirect to login if not logged in and not at auth pages
        router.replace('/login');
      }
    }
  }, [userId, segments, isLoading]);

  const loadStorageData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (e) {
      console.error('Failed to load auth data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (id: string) => {
    setUserId(id);
    await AsyncStorage.setItem('user_id', id);
  };

  const logout = async () => {
    setUserId(null);
    await AsyncStorage.removeItem('user_id');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ userId, isLoading, login, logout }}>
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
