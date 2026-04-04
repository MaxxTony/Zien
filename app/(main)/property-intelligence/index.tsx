import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { BrokerDetailsTab } from './components/BrokerDetailsTab';
import { NearbyPlacesTab } from './components/NearbyPlacesTab';
import { OverviewTab } from './components/OverviewTab';
import { PriceTrendTab } from './components/PriceTrendTab';
import { RiskEnvironmentTab } from './components/RiskEnvironmentTab';

export default function PropertySearchScreen() {
    const { colors } = useAppTheme();
    const styles = getStyles(colors);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [activeSubTab, setActiveSubTab] = useState('Overview');

    const SUB_TABS = ['Overview', 'Price Trend', 'Risk & Environment', 'Broker Details', 'Nearby Places'];
    const [activeTab, setActiveTab] = useState('search'); // 'search', 'recent', 'saved'

    const FEATURED_PROPERTIES = [
        {
            id: '1',
            type: 'SINGLE FAMILY',
            address: '4521 Wilshire Blvd, Los Angeles, CA',
            price: '$1,285,000',
            appreciation: '+6.8%',
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
        },
        {
            id: '2',
            type: 'CONDO',
            address: '2901 Ocean Ave, Santa Monica, CA',
            price: '$2,140,000',
            appreciation: '+9.2%',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        },
        {
            id: '3',
            type: 'TOWNHOUSE',
            address: '812 Rosecrans Ave, Manhattan Beach, CA',
            price: '$1,870,000',
            appreciation: '+4.1%',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        }
    ];

    const SUGGESTIONS = [
        '4521 Wilshire Blvd, Los Angeles, CA',
        '2901 Ocean Ave, Santa Monica, CA',
        '7845 Hillside Ave, Hollywood Hills, CA'
    ];

    const renderHeader = () => (
        <View style={styles.heroSection}>
            <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Property Intelligence Hub</Text>
                <Text style={styles.heroSubtitle}>
                    Structural data, valuation, risk, price trends & neighborhood insights — all in one place.
                </Text>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter a US property address..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Pressable style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>Search</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.suggestionsContainer}>
                    <Text style={styles.tryLabel}>TRY:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                        {SUGGESTIONS.map((addr, idx) => (
                            <Pressable
                                key={idx}
                                style={styles.suggestionChip}
                                onPress={() => setSearchQuery(addr)}
                            >
                                <Text style={styles.suggestionText} numberOfLines={1}>{addr}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );



    const renderPropertyBar = () => (
        <View style={styles.propertyBar}>
            <View style={styles.propertyBarLeft}>
                <MaterialCommunityIcons name="map-marker" size={16} color={colors.accent} />
                <Text style={styles.propertyBarAddress} numberOfLines={1}>
                    {selectedProperty?.address || '4521 Wilshire Blvd, Los Angeles, CA'}
                </Text>
            </View>

            <Pressable
                style={styles.newSearchBtn}
                onPress={() => setSelectedProperty(null)}
            >
                <Text style={styles.newSearchBtnText}>New Search</Text>
                <MaterialCommunityIcons name="magnify" size={12} color={colors.textSecondary} />
            </Pressable>
        </View>
    );

    const renderSubTabs = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subTabsScroll}
        >
            {SUB_TABS.map((tab) => {
                const isActive = activeSubTab === tab;
                return (
                    <Pressable
                        key={tab}
                        style={[styles.subTab, isActive && styles.subTabActive]}
                        onPress={() => setActiveSubTab(tab)}
                    >
                        <Text style={[styles.subTabText, isActive && styles.subTabTextActive]}>{tab}</Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );

    const renderDetailView = () => (
        <View style={styles.detailContainer}>
            {renderPropertyBar()}
            {renderSubTabs()}

            {activeSubTab === 'Overview' ? (
                <OverviewTab property={selectedProperty} />
            ) : activeSubTab === 'Price Trend' ? (
                <PriceTrendTab property={selectedProperty} />
            ) : activeSubTab === 'Risk & Environment' ? (
                <RiskEnvironmentTab property={selectedProperty} />
            ) : activeSubTab === 'Broker Details' ? (
                <BrokerDetailsTab property={selectedProperty} />
            ) : activeSubTab === 'Nearby Places' ? (
                <NearbyPlacesTab property={selectedProperty} />
            ) : (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={48} color={colors.surfaceMuted} />
                    <Text style={styles.emptyTitle}>{activeSubTab} Data</Text>
                    <Text style={styles.emptySubtitle}>Detailed analytics for {activeSubTab} will be shown here.</Text>
                </View>
            )}
        </View>
    );

    const renderFeaturedView = () => (
        <>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                    <MaterialCommunityIcons name="trending-up" size={18} color={colors.accent} />
                    <Text style={styles.sectionTitle}>FEATURED PROPERTIES</Text>
                </View>
            </View>

            <FlatList
                horizontal
                data={FEATURED_PROPERTIES}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.propertyCard}
                        onPress={() => setSelectedProperty(item)}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.propertyImage} />
                            <View style={styles.appreciationBadge}>
                                <Text style={styles.appreciationText}>{item.appreciation}</Text>
                            </View>
                        </View>
                        <View style={styles.propertyDetails}>
                            <Text style={styles.propertyType}>{item.type}</Text>
                            <Text style={styles.propertyAddress} numberOfLines={2}>{item.address}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.propertyPrice}>{item.price}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textSecondary} />
                            </View>
                        </View>
                    </Pressable>
                )}
            />
        </>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {renderHeader()}

                {selectedProperty ? renderDetailView() : renderFeaturedView()}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

function getStyles(colors: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
        },
        heroSection: {
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 30,
        },
        heroContent: {
            backgroundColor: colors.cardBackground, // Dark navy matches Zien cardBackground
            borderRadius: 24,
            padding: 24,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 10 },
            elevation: 8,
        },
        heroTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 10,
        },
        heroSubtitle: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 24,
        },
        searchContainer: {
            width: '100%',
            marginBottom: 20,
        },
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            paddingLeft: 14,
            paddingRight: 6,
            height: 52,
        },
        searchInput: {
            flex: 1,
            fontSize: 14,
            color: '#0F172A',
            paddingHorizontal: 10,
        },
        searchButton: {
            backgroundColor: colors.accent,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 10,
        },
        searchButtonText: {
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '800',
        },
        suggestionsContainer: {
            width: '100%',
        },
        tryLabel: {
            fontSize: 11,
            fontWeight: '800',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 10,
            letterSpacing: 1,
        },
        suggestionsScroll: {
            gap: 8,
        },
        suggestionChip: {
            backgroundColor: 'rgba(255,255,255,0.1)',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 10,
            maxWidth: 240,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
        },
        suggestionText: {
            color: 'rgba(255,255,255,0.9)',
            fontSize: 12,
            fontWeight: '600',
        },
        sectionHeader: {
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        sectionTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        sectionTitle: {
            fontSize: 12,
            fontWeight: '900',
            color: colors.textSecondary,
            letterSpacing: 1,
        },
        featuredList: {
            paddingHorizontal: 20,
            gap: 16,
        },
        propertyCard: {
            width: 280,
            backgroundColor: colors.cardBackground,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            overflow: 'hidden',
        },
        imageContainer: {
            width: '100%',
            height: 160,
        },
        propertyImage: {
            width: '100%',
            height: '100%',
        },
        appreciationBadge: {
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#10B981',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#065F46',
        },
        appreciationText: {
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: '900',
        },
        propertyDetails: {
            padding: 16,
        },
        propertyType: {
            fontSize: 11,
            fontWeight: '800',
            color: colors.accent,
            marginBottom: 8,
        },
        propertyAddress: {
            fontSize: 15,
            fontWeight: '800',
            color: colors.textPrimary,
            lineHeight: 22,
            marginBottom: 12,
            height: 44,
        },
        priceRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        propertyPrice: {
            fontSize: 18,
            fontWeight: '900',
            color: colors.textPrimary,
        },
        detailContainer: {
            paddingHorizontal: 20,
        },
        propertyBar: {
            // flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surfaceSoft,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            marginBottom: 16,
            gap: 10
        },
        propertyBarLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flex: 1,

        },
        propertyBarAddress: {
            flex: 1,
            fontSize: 12,
            fontWeight: '800',
            color: colors.textPrimary,
        },
        barDivider: {
            width: 1,
            height: 16,
            backgroundColor: colors.cardBorder,
            marginHorizontal: 8,
        },
        newSearchBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: colors.cardBackground,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            alignSelf: "flex-end"
        },
        newSearchBtnText: {
            fontSize: 10,
            fontWeight: '900',
            color: colors.textSecondary,
        },
        subTabsScroll: {
            paddingBottom: 16,
            gap: 10,
        },
        subTab: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: 'transparent',
        },
        subTabActive: {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
        },
        subTabText: {
            fontSize: 13,
            fontWeight: '700',
            color: colors.textSecondary,
        },
        subTabTextActive: {
            color: colors.accent,
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 40,
            gap: 12,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: colors.textPrimary,
        },
        emptySubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
        },
    });
}
