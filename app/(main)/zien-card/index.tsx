import { useAuth } from '@/context/AuthContext';
import { useDigitalCards } from '@/hooks/useDigitalCards';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { ZienCardNav } from './_components/ZienCardNav';
import { ZienCardScreenShell } from './_components/ZienCardScreenShell';

// Sections
import { useAppTheme } from '@/context/ThemeContext';
import { AnalyticsSection } from './_sections/AnalyticsSection';
import { BasicInfoSection } from './_sections/BasicInfoSection';
import { DashboardSection } from './_sections/DashboardSection';
import { LeadEnquiriesSection } from './_sections/LeadEnquiriesSection';
import { ThemesColorSection } from './_sections/ThemesColorSection';

const SECTION_CONFIG: Record<string, { title: string; subtitle: string; Component: any }> = {
  '/(main)/zien-card': {
    title: 'Digital Card Manager',
    subtitle: 'Manage and share your digital business cards.',
    Component: DashboardSection,
  },
  '/(main)/zien-card/basic-information': {
    title: 'Basic Information',
    subtitle: 'Build your profile step-by-step.',
    Component: BasicInfoSection,
  },
  '/(main)/zien-card/themes-color': {
    title: 'Themes & Color',
    subtitle: 'Define the visual style of your card.',
    Component: ThemesColorSection,
  },
  '/(main)/zien-card/lead-enquiries': {
    title: 'Lead Enquiries',
    subtitle: 'Manage and track leads generated from your digital card.',
    Component: LeadEnquiriesSection,
  },
  '/(main)/zien-card/analytics': {
    title: 'Analytics',
    subtitle: 'Track performance and engagement of your digital card.',
    Component: AnalyticsSection,
  },
};

export default function ZienCardDashboardScreen() {
  const { colors } = useAppTheme();
  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Lifted state
  const { data: cards = [], isLoading, refetch } = useDigitalCards();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [saveTrigger, setSaveTrigger] = useState(0);

  // Sync with server whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Use 's' param or default to dashboard
  const activeSectionPath = (params.s as string) || '/(main)/zien-card';
  const isBasicInfo = activeSectionPath === '/(main)/zien-card/basic-information';
  const isThemes = activeSectionPath === '/(main)/zien-card/themes-color';
  const isLeads = activeSectionPath === '/(main)/zien-card/lead-enquiries';
  
  const showGlobalSave = isBasicInfo || isThemes;
  const showExport = isLeads;

  const config = SECTION_CONFIG[activeSectionPath] || SECTION_CONFIG['/(main)/zien-card'];
  const { title, subtitle, Component } = config;

  const activeCard = cards.find(c => String(c.id) === String(activeCardId || cards[0]?.id)) || cards[0];

  const handleSectionChange = (newPath: string) => {
    router.setParams({ s: newPath });
  };

  const onSavePress = () => {
    setSaveTrigger(prev => prev + 1);
  };

  const onExportPress = () => {
    setSaveTrigger(prev => prev + 1); // Reuse trigger or make new one
  };

  const headerRight = (showGlobalSave || showExport) ? (
    <Pressable
      onPress={showGlobalSave ? onSavePress : onExportPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
      })}>
      <MaterialCommunityIcons 
        name={showGlobalSave ? "content-save-outline" : "download"} 
        size={20} 
        color="#FFFFFF" 
      />
    </Pressable>
  ) : undefined;

  return (
    <ZienCardScreenShell
      title={title}
      subtitle={subtitle}
      headerRight={headerRight}
    >
      <View style={{ flex: 1 }}>
        {isLoading && !cards.length ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.accentTeal} />
          </View>
        ) : (
          <Component
            onSectionChange={handleSectionChange}
            cards={cards}
            activeCardId={activeCardId}
            setActiveCardId={setActiveCardId}
            activeCard={activeCard}
            accessToken={accessToken}
            refetch={refetch}
            saveTrigger={saveTrigger}
          />
        )}

        {/* Controlled Navigation */}
        <ZienCardNav
          activeSection={activeSectionPath}
          onSectionChange={handleSectionChange}
        />
      </View>
    </ZienCardScreenShell>
  );
}


