import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const H_PADDING = 18;
const PLACEHOLDER_HOUSE =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800';

type PropertyStatus = 'Ready' | 'REVIEW NEEDED' | 'DRAFT';

type PropertyDetail = {
  id: string;
  address: string;
  cityState: string;
  type: string;
  status: PropertyStatus;
  value: string;
  avmEst?: string;
  confidence: number;
  image: string;
  photoCount: number;
  beds: number;
  baths: number;
  sqft: string;
  acres: string;
  lastSync: string;
  lotSize: string;
  stories: number;
  yearBuilt: number;
  parking: string;
  mlsListPrice: string;
  zienAvmEst: string;
  pricingConflict: boolean;
  walkScore: number;
  neighborhoodDesc: string;
  aiInsight: string;
};

const PROPERTIES_DETAIL: Record<string, PropertyDetail> = {
  'ZN-94021-LA': {
    id: 'ZN-94021-LA',
    address: '123 Business Way',
    cityState: 'Los Angeles, CA',
    type: 'Single Family',
    status: 'Ready',
    value: '$4,250,000',
    avmEst: '$4,185,200',
    confidence: 98,
    image: PLACEHOLDER_HOUSE,
    photoCount: 18,
    beds: 5,
    baths: 4,
    sqft: '4,2k sf',
    acres: '0.4 Ac',
    lastSync: '2 min ago',
    lotSize: '18,500 sqft',
    stories: 2,
    yearBuilt: 2004,
    parking: '4 Garage',
    mlsListPrice: '$4,250,000',
    zienAvmEst: '$4,185,200',
    pricingConflict: true,
    walkScore: 88,
    neighborhoodDesc:
      'Prime location in the heart of Bel-Air with private entrance and gated security.',
    aiInsight:
      'Our AI suggests this property is priced 2% below market for its zip code based on recent comparable luxury sales in Bel-Air.',
  },
  'ZN-94022-MB': {
    id: 'ZN-94022-MB',
    address: '88 Gold Coast Dr',
    cityState: 'Malibu, CA',
    type: 'Luxury Villa',
    status: 'REVIEW NEEDED',
    value: '$8,750,000',
    avmEst: '$8,600,000',
    confidence: 72,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    photoCount: 12,
    beds: 6,
    baths: 7,
    sqft: '6,5k sf',
    acres: '1.2 Ac',
    lastSync: '5 min ago',
    lotSize: '52,272 sqft',
    stories: 2,
    yearBuilt: 2018,
    parking: '6 Garage',
    mlsListPrice: '$8,750,000',
    zienAvmEst: '$8,600,000',
    pricingConflict: true,
    walkScore: 45,
    neighborhoodDesc: 'Oceanfront Malibu estate with private beach access.',
    aiInsight:
      'Luxury coastal comps suggest strong demand; consider highlighting views and beach access in marketing.',
  },
  'ZN-94023-SM': {
    id: 'ZN-94023-SM',
    address: '900 Ocean Blvd',
    cityState: 'Santa Monica, CA',
    type: 'Condo',
    status: 'DRAFT',
    value: '$1,920,000',
    avmEst: '$1,880,000',
    confidence: 45,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    photoCount: 8,
    beds: 3,
    baths: 3,
    sqft: '2,1k sf',
    acres: '—',
    lastSync: '1 hr ago',
    lotSize: '—',
    stories: 1,
    yearBuilt: 2010,
    parking: '2 Garage',
    mlsListPrice: '$1,920,000',
    zienAvmEst: '$1,880,000',
    pricingConflict: false,
    walkScore: 95,
    neighborhoodDesc: 'Walk to beach, pier, and downtown Santa Monica.',
    aiInsight:
      'Walk Score and transit scores are excellent; emphasize urban lifestyle in listings.',
  },
  'ZN-94024-PD': {
    id: 'ZN-94024-PD',
    address: '45 Pine Street',
    cityState: 'Pasadena, CA',
    type: 'Apartment',
    status: 'Ready',
    value: '$685,000',
    avmEst: '$672,000',
    confidence: 95,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    photoCount: 6,
    beds: 2,
    baths: 2,
    sqft: '1,2k sf',
    acres: '—',
    lastSync: '10 min ago',
    lotSize: '—',
    stories: 1,
    yearBuilt: 1995,
    parking: '1 Garage',
    mlsListPrice: '$685,000',
    zienAvmEst: '$672,000',
    pricingConflict: false,
    walkScore: 78,
    neighborhoodDesc: 'Quiet Pasadena neighborhood near parks and schools.',
    aiInsight:
      'Data integrity is high; property is ready for listing and marketing.',
  },
};

function getPropertyById(id: string | undefined): PropertyDetail | null {
  if (!id) return null;
  return PROPERTIES_DETAIL[id] ?? null;
}

function AccordionSection({
  title,
  icon,
  conflict,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  conflict?: boolean;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.accordionCard}>
      <Pressable style={styles.accordionHeader} onPress={onToggle}>
        <View style={styles.accordionTitleRow}>
          <MaterialCommunityIcons name={icon as any} size={22} color="#0B2D3E" />
          <Text style={styles.accordionTitle}>{title}</Text>
          {conflict && (
            <View style={styles.conflictPill}>
              <Text style={styles.conflictPillText}>CONFLICT</Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'minus' : 'plus'}
          size={20}
          color="#5B6B7A"
        />
      </Pressable>
      {expanded && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
}

export default function PropertyDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [specsOpen, setSpecsOpen] = useState(true);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [neighborhoodOpen, setNeighborhoodOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const property = useMemo(() => getPropertyById(id), [id]);

  if (!property) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>Property not found</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const fullAddress = `${property.address}, ${property.cityState}`;
  const isReady = property.status === 'Ready';

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header — title + subtitle only */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerAddress} numberOfLines={2}>
            {fullAddress}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {isReady ? 'Ready for Use' : property.status} • {property.type} • Last sync: {property.lastSync}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + 72 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: property.image }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.photoCount}>
              {1}/{property.photoCount} Photos
            </Text>
            <Pressable style={styles.droneBtn}>
              <Text style={styles.droneBtnText}>Drone View</Text>
            </Pressable>
          </View>
        </View>

        {/* Price & data integrity row */}
        <View style={styles.priceRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceValue}>{property.value}</Text>
            <Text style={styles.priceLabel}>Estimated Market Value</Text>
          </View>
          <View style={styles.integrityBadge}>
            <Text style={styles.integrityText}>{property.confidence}% DATA INTEGRITY</Text>
          </View>
        </View>

        {/* Beds, baths, sqft, acres */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="bed" size={20} color="#5B6B7A" />
            <Text style={styles.featureText}>{property.beds} Beds</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="shower" size={20} color="#5B6B7A" />
            <Text style={styles.featureText}>{property.baths} Baths</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="floor-plan" size={20} color="#5B6B7A" />
            <Text style={styles.featureText}>{property.sqft}</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="tree-outline" size={20} color="#5B6B7A" />
            <Text style={styles.featureText}>{property.acres}</Text>
          </View>
        </View>

        {/* Automated Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Automated Insights</Text>
          <Text style={styles.insightsText}>{property.aiInsight}</Text>
          <View style={styles.insightsActions}>
            <Pressable style={styles.insightBtn}>
              <Text style={styles.insightBtnText}>Check Comps</Text>
            </Pressable>
            <Pressable style={styles.insightBtn}>
              <Text style={styles.insightBtnText}>Market Trends</Text>
            </Pressable>
          </View>
        </View>

        {/* Accordion sections */}
        <AccordionSection
          title="Property Specifications"
          icon="briefcase-outline"
          expanded={specsOpen}
          onToggle={() => setSpecsOpen((v) => !v)}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Lot Size</Text>
            <Text style={styles.specValue}>{property.lotSize}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Stories</Text>
            <Text style={styles.specValue}>{property.stories}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Year Built</Text>
            <Text style={styles.specValue}>{property.yearBuilt}</Text>
          </View>
          <View style={[styles.specRow, styles.specRowLast]}>
            <Text style={styles.specLabel}>Parking</Text>
            <Text style={styles.specValue}>{property.parking}</Text>
          </View>
        </AccordionSection>

        <AccordionSection
          title="Pricing & History"
          icon="currency-usd"
          conflict={property.pricingConflict}
          expanded={pricingOpen}
          onToggle={() => setPricingOpen((v) => !v)}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>MLS List Price</Text>
            <Text style={styles.pricingValue}>{property.mlsListPrice}</Text>
          </View>
          <View style={[styles.pricingRow, styles.pricingRowAvm]}>
            <Text style={styles.pricingLabelAvm}>Zien AVM Est.</Text>
            <Text style={styles.pricingValueAvm}>{property.zienAvmEst}</Text>
          </View>
        </AccordionSection>

        <AccordionSection
          title="AI Marketing Assets"
          icon="image-multiple-outline"
          expanded={marketingOpen}
          onToggle={() => setMarketingOpen((v) => !v)}>
          <View style={styles.marketingRow}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.marketingCard}>
                <View style={styles.marketingCardPlaceholder} />
                <Text style={styles.marketingCardLabel}>AI ENHANCED</Text>
              </View>
            ))}
          </View>
        </AccordionSection>

        <AccordionSection
          title="Neighborhood Analysis"
          icon="map-marker-outline"
          expanded={neighborhoodOpen}
          onToggle={() => setNeighborhoodOpen((v) => !v)}>
          <View style={styles.neighborhoodRow}>
            <Text style={styles.neighborhoodLabel}>Walk Score</Text>
            <Text style={styles.walkScoreValue}>{property.walkScore}/100</Text>
          </View>
          <Text style={styles.neighborhoodDesc}>{property.neighborhoodDesc}</Text>
        </AccordionSection>
      </ScrollView>

      {/* Fixed bottom action bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, paddingTop: 12 }]}>
        {isEditMode ? (
          <Pressable
            style={[styles.bottomBarBtn, styles.bottomBarBtnSave]}
            onPress={() => setIsEditMode(false)}>
            <MaterialCommunityIcons name="content-save" size={20} color="#FFFFFF" />
            <Text style={styles.bottomBarBtnTextSave}>Save Data</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.bottomBarBtn} onPress={() => setIsEditMode(true)}>
            <MaterialCommunityIcons name="pencil" size={20} color="#0B2D3E" />
            <Text style={styles.bottomBarBtnText}>Edit Data</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.bottomBarBtn, styles.bottomBarBtnStaging]}
          onPress={() => router.push('/(main)/images-staging/upload')}>
          <MaterialCommunityIcons name="home-outline" size={20} color="#0B2D3E" />
          <View style={styles.aiStagingBadge} />
          <Text style={styles.bottomBarBtnText}>AI Staging</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#5B6B7A',
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 16,
    color: '#0B2D3E',
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: H_PADDING,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  headerCenter: {
    flex: 1,
    minWidth: 0,
  },
  headerAddress: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '500',
    marginTop: 4,
  },
  aiStagingBadge: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EA580C',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: H_PADDING,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(11, 45, 62, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  bottomBarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(11, 45, 62, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  bottomBarBtnStaging: {
    position: 'relative',
  },
  bottomBarBtnSave: {
    backgroundColor: '#0D9488',
    borderColor: '#0F766E',
  },
  bottomBarBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  bottomBarBtnTextSave: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 24,
  },
  heroWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingBottom: 14,
  },
  photoCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  droneBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  droneBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  priceBlock: {
    flex: 1,
  },
  priceValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.5,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B6B7A',
    marginTop: 2,
  },
  integrityBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
  },
  integrityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
    letterSpacing: 0.3,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  insightsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 10,
  },
  insightsText: {
    fontSize: 14,
    color: '#5B6B7A',
    lineHeight: 20,
    marginBottom: 14,
  },
  insightsActions: {
    flexDirection: 'row',
    gap: 10,
  },
  insightBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 45, 62, 0.06)',
  },
  insightBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2D3E',
    flex: 1,
  },
  conflictPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
  },
  conflictPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C2410C',
    letterSpacing: 0.2,
  },
  accordionBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 0,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(11, 45, 62, 0.08)',
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  specLabel: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 45, 62, 0.04)',
    marginBottom: 10,
  },
  pricingRowAvm: {
    backgroundColor: 'rgba(234, 88, 12, 0.08)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#EA580C',
    marginBottom: 0,
  },
  pricingLabel: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '500',
  },
  pricingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  pricingLabelAvm: {
    fontSize: 13,
    color: '#C2410C',
    fontWeight: '600',
  },
  pricingValueAvm: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C2410C',
  },
  marketingRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  marketingCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 45, 62, 0.06)',
  },
  marketingCardPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  marketingCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D9488',
    textAlign: 'center',
    paddingVertical: 8,
  },
  neighborhoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  neighborhoodLabel: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
  },
  walkScoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D9488',
  },
  neighborhoodDesc: {
    fontSize: 14,
    color: '#5B6B7A',
    lineHeight: 20,
  },
});
