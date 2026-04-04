import { PageHeader } from '@/components/ui/PageHeader';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PropertyIntelligenceLayout() {
    const { colors } = useAppTheme();
    const styles = getStyles(colors);
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { id: 'index', label: 'Search', icon: 'magnify', route: '/(main)/property-intelligence' },
        { id: 'recent', label: 'Recent', icon: 'history', route: '/(main)/property-intelligence/recent' },
        { id: 'saved', label: 'Saved', icon: 'bookmark-outline', route: '/(main)/property-intelligence/saved' },
        { id: 'settings', label: 'Settings', icon: 'cog-outline', route: '/(main)/property-intelligence/settings' },
    ];

    const currentTabId = pathname.endsWith('property-intelligence') ? 'index' : pathname.split('/').pop() || 'index';

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={colors.backgroundGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <PageHeader
                    title="Property Intelligence"
                    onBack={() => router.back()}
                />

                <View style={styles.tabsContainer}>
                    {tabs.map((tab) => {
                        const isActive = currentTabId === tab.id;
                        return (
                            <Pressable 
                                key={tab.id}
                                onPress={() => router.replace(tab.route as any)}
                                style={[styles.tab, isActive && styles.activeTab]}
                            >
                                <MaterialCommunityIcons 
                                    name={tab.icon as any} 
                                    size={18} 
                                    color={isActive ? colors.accent : colors.textSecondary} 
                                />
                                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.content}>
                    <Slot />
                </View>
            </SafeAreaView>
        </View>
    );
}

function getStyles(colors: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        tabsContainer: {
            flexDirection: 'row',
            backgroundColor: colors.surfaceSoft,
            marginHorizontal: 16,
            borderRadius: 14,
            padding: 4,
            marginBottom: 10,
        },
        tab: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            borderRadius: 10,
            gap: 2,
        },
        activeTab: {
            backgroundColor: colors.cardBackground,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 2,
        },
        tabText: {
            fontSize: 10,
            fontWeight: '700',
            color: colors.textSecondary,
        },
        activeTabText: {
            color: colors.textPrimary,
        },
        content: {
            flex: 1,
        }
    });
}
