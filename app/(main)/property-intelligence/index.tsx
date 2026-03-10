import { PageHeader } from '@/components/ui/PageHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PropertyIntelligenceScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#DDE8F0', '#EBF1F6', '#F5EBEA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <PageHeader
                    title=""
                    onBack={() => router.back()}
                />

                <View style={[styles.content]}>
                    <View style={styles.centerBlock}>
                        <View style={styles.logoContainer}>
                            <View style={styles.iconCircle}>
                                <Image
                                    source={require('@/assets/images/icon.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                        </View>

                        <Text style={styles.title}>Property Intelligence</Text>
                        <Text style={styles.subtitle}>Coming Soon.</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerBlock: {
        alignItems: 'center',
        marginTop: -120, // offset slightly visually upwards to match screenshot
    },
    logoContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(235, 241, 246, 0.7)', // subtle circle background
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0A2F48',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 1,
    },
    logo: {
        width: 44,
        height: 44,
    },
    newBadge: {
        position: 'absolute',
        top: -6,
        right: -8,
        backgroundColor: '#F97316',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#EAF0F6',
        shadowColor: '#F97316',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    newBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0B2D3E',
        letterSpacing: -0.6,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5B6B7A',
    },
});
