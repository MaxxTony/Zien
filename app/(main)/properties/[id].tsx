import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 16;

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
];

type PropertyStatus = 'Ready' | 'REVIEW NEEDED' | 'DRAFT';

type School = { name: string; rating: string; info: string; distance: string };

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
  garage: string;
  roof: string;
  foundation: string;
  basement: string;
  heating: string;
  cooling: string;
  parking: string;
  mlsListPrice: string;
  zienAvmEst: string;
  pricingConflict: boolean;
  walkScore: number;
  walkLabel: string;
  transitScore: number;
  bikeScore: number;
  coordinates: { latitude: number; longitude: number };
  nearbySchools: School[];
  neighborhoodDesc: string;
  aiInsight: string;
};

const PROPERTIES_DETAIL: Record<string, PropertyDetail> = {
  'ZN-94021-LA': {
    id: 'ZN-94021-LA',
    address: '123 Business Way',
    cityState: 'Los Angeles, CA',
    type: 'Residential SFH',
    status: 'Ready',
    value: '$4,250,000',
    avmEst: '$4,185,200',
    confidence: 98,
    image: MOCK_IMAGES[0],
    photoCount: 5,
    beds: 5,
    baths: 4.5,
    sqft: '4,200',
    acres: '0.4',
    lastSync: '2 min ago',
    lotSize: '18,500 sqft',
    stories: 2,
    yearBuilt: 2004,
    garage: '3 Car Attached',
    roof: 'Asphalt Shingle',
    foundation: 'Concrete Slab',
    basement: 'Fully Finished',
    heating: 'Forced Air',
    cooling: 'Central Air',
    parking: '4 Garage',
    mlsListPrice: '$4,250,000',
    zienAvmEst: '$4,185,200',
    pricingConflict: true,
    walkScore: 88,
    walkLabel: 'EXTREMELY WALKABLE',
    transitScore: 72,
    bikeScore: 65,
    coordinates: { latitude: 34.0989, longitude: -118.4662 },
    nearbySchools: [
      { name: 'Bel-Air Elementary', rating: '9/10', info: 'Public • Serving K-5', distance: '0.4 mi' },
      { name: 'Westside Academy', rating: '10/10', info: 'Public • Serving K-5', distance: '1.2 mi' },
      { name: 'Roscomare Road', rating: '8/10', info: 'Public • Serving K-5', distance: '1.5 mi' },
    ],
    neighborhoodDesc:
      'Prime location in the heart of Bel-Air with private entrance and gated security.',
    aiInsight:
      'Our AI suggests this property is priced 2% below market based on recent Bel-Air luxury comps.',
  },
  'ZN-90210-BH': {
    id: 'ZN-90210-BH',
    address: '88 Gold Coast Dr',
    cityState: 'Malibu, CA',
    type: 'Luxury Villa',
    status: 'REVIEW NEEDED',
    value: '$12,800,000',
    avmEst: '$12,600,000',
    confidence: 72,
    image: MOCK_IMAGES[1],
    photoCount: 5,
    beds: 6,
    baths: 7,
    sqft: '6,500',
    acres: '1.2',
    lastSync: '5 min ago',
    lotSize: '52,272 sqft',
    stories: 2,
    yearBuilt: 2018,
    garage: '6 Car Attached',
    roof: 'Flat / TPO',
    foundation: 'Concrete Slab',
    basement: 'None',
    heating: 'Radiant Floor',
    cooling: 'Central Air',
    parking: '6 Garage',
    mlsListPrice: '$12,800,000',
    zienAvmEst: '$12,600,000',
    pricingConflict: true,
    walkScore: 45,
    walkLabel: 'CAR-DEPENDENT',
    transitScore: 30,
    bikeScore: 28,
    coordinates: { latitude: 34.0259, longitude: -118.7798 },
    nearbySchools: [
      { name: 'Malibu High School', rating: '8/10', info: 'Public • Serving 9-12', distance: '1.8 mi' },
      { name: 'Webster Elementary', rating: '9/10', info: 'Public • Serving K-5', distance: '2.1 mi' },
      { name: 'Malibu Middle School', rating: '7/10', info: 'Public • Serving 6-8', distance: '2.3 mi' },
    ],
    neighborhoodDesc: 'Oceanfront Malibu estate with private beach access.',
    aiInsight:
      'Luxury coastal comps suggest strong demand; consider highlighting views and beach access in marketing.',
  },
  'ZN-91101-PA': {
    id: 'ZN-91101-PA',
    address: '45 Pine St',
    cityState: 'Pasadena, CA',
    type: 'Condo',
    status: 'Ready',
    value: '$1,150,000',
    avmEst: '$1,115,000',
    confidence: 95,
    image: MOCK_IMAGES[2],
    photoCount: 5,
    beds: 3,
    baths: 3,
    sqft: '2,100',
    acres: '—',
    lastSync: '1 hr ago',
    lotSize: '—',
    stories: 1,
    yearBuilt: 2010,
    garage: '2 Car Attached',
    roof: 'Flat',
    foundation: 'Slab',
    basement: 'None',
    heating: 'Forced Air',
    cooling: 'Central Air',
    parking: '2 Garage',
    mlsListPrice: '$1,150,000',
    zienAvmEst: '$1,115,000',
    pricingConflict: false,
    walkScore: 95,
    walkLabel: "WALKER'S PARADISE",
    transitScore: 91,
    bikeScore: 88,
    coordinates: { latitude: 34.1478, longitude: -118.1445 },
    nearbySchools: [
      { name: 'Pasadena Prep', rating: '10/10', info: 'Private • Serving K-12', distance: '0.3 mi' },
      { name: 'McKinley School', rating: '8/10', info: 'Public • Serving K-8', distance: '0.7 mi' },
      { name: 'Blair High School', rating: '7/10', info: 'Public • Serving 9-12', distance: '1.1 mi' },
    ],
    neighborhoodDesc: 'Walk to beach, pier, and downtown Santa Monica.',
    aiInsight:
      'Walk Score and transit scores are excellent; emphasize urban lifestyle in listings.',
  },
  'ZN-90401-SM': {
    id: 'ZN-90401-SM',
    address: '900 Ocean Blvd',
    cityState: 'Santa Monica, CA',
    type: 'Apartment',
    status: 'DRAFT',
    value: '$3,400,000',
    avmEst: '$3,280,000',
    confidence: 45,
    image: MOCK_IMAGES[3],
    photoCount: 5,
    beds: 4,
    baths: 3,
    sqft: '3,400',
    acres: '—',
    lastSync: '10 min ago',
    lotSize: '—',
    stories: 1,
    yearBuilt: 1995,
    garage: '1 Car',
    roof: 'Flat',
    foundation: 'Slab',
    basement: 'None',
    heating: 'Forced Air',
    cooling: 'Window Units',
    parking: '1 Garage',
    mlsListPrice: '$3,400,000',
    zienAvmEst: '$3,280,000',
    pricingConflict: false,
    walkScore: 78,
    walkLabel: 'VERY WALKABLE',
    transitScore: 85,
    bikeScore: 76,
    coordinates: { latitude: 34.0195, longitude: -118.4912 },
    nearbySchools: [
      { name: 'Santa Monica Elem.', rating: '8/10', info: 'Public • Serving K-5', distance: '0.5 mi' },
      { name: 'Lincoln Middle School', rating: '7/10', info: 'Public • Serving 6-8', distance: '0.9 mi' },
      { name: 'Santa Monica High', rating: '9/10', info: 'Public • Serving 9-12', distance: '1.4 mi' },
    ],
    neighborhoodDesc: 'Quiet Pasadena neighborhood near parks and schools.',
    aiInsight: 'Data integrity needs improvement. Please review and complete missing fields.',
  },
};

function getPropertyById(id: string | undefined): PropertyDetail | null {
  if (!id) return null;
  return PROPERTIES_DETAIL[id] ?? null;
}

// ── Score Bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={mapStyles.scoreRow}>
      <Text style={mapStyles.scoreLabel}>{label}</Text>
      <View style={mapStyles.scoreTrack}>
        <View style={[mapStyles.scoreFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={[mapStyles.scoreValue, { color }]}>{value}/100</Text>
    </View>
  );
}

// ── Neighborhood Map Modal ─────────────────────────────────────────────────────
function NeighborhoodMapModal({
  visible,
  onClose,
  property,
}: {
  visible: boolean;
  onClose: () => void;
  property: PropertyDetail;
}) {
  const MapComponent = Platform.OS === 'ios' ? AppleMaps.View : GoogleMaps.View;
  const { latitude, longitude } = property.coordinates;

  const openInMaps = () => {
    const label = encodeURIComponent(property.address);
    const url = Platform.OS === 'ios'
      ? `maps://0,0?q=${label}&ll=${latitude},${longitude}`
      : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
    Linking.openURL(url).catch(() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={mapStyles.modal}>
        {/* Header */}
        <View style={mapStyles.header}>
          <View style={mapStyles.headerText}>
            <Text style={mapStyles.title}>Neighborhood Intelligence</Text>
            <Text style={mapStyles.subtitle}>Satellite visualization and spatial points of interest</Text>
          </View>
          <Pressable onPress={onClose} style={mapStyles.closeBtn} hitSlop={12}>
            <MaterialCommunityIcons name="close" size={20} color="#64748B" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Map */}
          <View style={mapStyles.mapWrap}>
            <MapComponent
              style={mapStyles.map}
              cameraPosition={{
                coordinates: property.coordinates,
                zoom: 15,
              }}
              markers={[
                {
                  id: 'property',
                  coordinates: property.coordinates,
                  title: property.address,
                },
              ]}
            />
          </View>

          {/* Open in Maps button */}
          <Pressable
            style={({ pressed }) => [mapStyles.openMapsBtn, pressed && { opacity: 0.8 }]}
            onPress={openInMaps}
          >
            <MaterialCommunityIcons name="navigation" size={16} color="#FFF" />
            <Text style={mapStyles.openMapsBtnText}>Open in Maps</Text>
          </Pressable>

          <View style={mapStyles.body}>
            {/* Grade Scores */}
            <Text style={mapStyles.sectionLabel}>INSTITUTIONAL GRADE SCORES</Text>
            <ScoreBar label="Walk Score" value={property.walkScore} color="#0D9488" />
            <ScoreBar label="Transit Score" value={property.transitScore} color="#0EA5E9" />
            <ScoreBar label="Bike Score" value={property.bikeScore} color="#8B5CF6" />

            {/* Schools */}
            <Text style={[mapStyles.sectionLabel, { marginTop: 20 }]}>NEARBY SCHOOLS (TOP RATED)</Text>
            {property.nearbySchools.map((school, i) => (
              <View key={i} style={mapStyles.schoolCard}>
                <View style={mapStyles.schoolLeft}>
                  <Text style={mapStyles.schoolName}>{school.name}</Text>
                  <Text style={mapStyles.schoolInfo}>{school.info} • {school.distance}</Text>
                </View>
                <Text style={mapStyles.schoolRating}>{school.rating}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const mapStyles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  headerText: { flex: 1, marginRight: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 17 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },
  mapWrap: {
    height: 280,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  map: { flex: 1 },
  openMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  openMapsBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  body: { padding: 16 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  scoreLabel: { fontSize: 13, fontWeight: '600', color: '#334155', width: 100 },
  scoreTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: { height: '100%', borderRadius: 3 },
  scoreValue: { fontSize: 12, fontWeight: '800', width: 46, textAlign: 'right' },
  schoolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  schoolLeft: { flex: 1, marginRight: 12 },
  schoolName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  schoolInfo: { fontSize: 11, color: '#64748B', marginTop: 2 },
  schoolRating: { fontSize: 14, fontWeight: '800', color: '#0D9488' },
});


// ── Spec Cell ─────────────────────────────────────────────────────────────────
function SpecCell({
  label,
  value,
  dot,
}: {
  label: string;
  value: string | number;
  dot?: boolean;
}) {
  return (
    <View style={styles.specCell}>
      <Text style={styles.specCellLabel}>{label}</Text>
      <View style={styles.specCellValueRow}>
        <Text style={styles.specCellValue}>{value}</Text>
        {dot && <View style={styles.specDot} />}
      </View>
    </View>
  );
}

export default function PropertyDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currImageIndex, setCurrImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const carouselRef = React.useRef<ScrollView>(null);

  const jumpToImage = (index: number) => {
    carouselRef.current?.scrollTo({
      x: index * (SCREEN_WIDTH - 2 * H_PADDING),
      animated: true,
    });
    setCurrImageIndex(index);
    setShowGallery(false);
  };

  const handleNext = () => {
    if (currImageIndex < MOCK_IMAGES.length - 1) {
      const nextIndex = currImageIndex + 1;
      carouselRef.current?.scrollTo({
        x: nextIndex * (SCREEN_WIDTH - 2 * H_PADDING),
        animated: true,
      });
      setCurrImageIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (currImageIndex > 0) {
      const prevIndex = currImageIndex - 1;
      carouselRef.current?.scrollTo({
        x: prevIndex * (SCREEN_WIDTH - 2 * H_PADDING),
        animated: true,
      });
      setCurrImageIndex(prevIndex);
    }
  };

  const property = useMemo(() => getPropertyById(id), [id]);

  if (!property) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>Property not found</Text>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
      </View>
    );
  }

  const fullAddress = `${property.address}, ${property.cityState}`;
  const isReady = property.status === 'Ready';
  const statusColor = isReady ? '#0D9488' : property.status === 'REVIEW NEEDED' ? '#C2410C' : '#64748B';
  const statusBg = isReady ? 'rgba(13,148,136,0.12)' : property.status === 'REVIEW NEEDED' ? 'rgba(234,88,12,0.12)' : 'rgba(100,116,139,0.10)';
  const statusLabel = isReady ? 'Ready for Use' : property.status === 'REVIEW NEEDED' ? 'Review Needed' : 'Draft';

  const confColor = property.confidence >= 85 ? '#0D9488' : property.confidence >= 60 ? '#EA580C' : '#DC2626';

  return (
    <LinearGradient
      colors={['#EEF2F7', '#E2E8F0', '#EEF2F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* ── PREMIUM MOBILE HEADER ── */}
      <PageHeader
        title={property.id}
        onBack={() => router.back()}
        rightIcon="pencil"
        onRightPress={() => router.push(`/(main)/properties/edit/${property.id}`)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTopArea}>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerAddress} numberOfLines={2}>
              {fullAddress}
            </Text>
          </View>

          <View style={styles.headerMetaRow}>
            <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusLabel, { color: statusColor }]}>{statusLabel}</Text>
            </View>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {property.type} • Last sync: {property.lastSync}
            </Text>
          </View>

          <View style={styles.headerActionsRow}>
            <View style={styles.confidenceBadgePremium}>
              <View style={styles.confBarSmall}>
                <View style={[styles.confBarFill, { width: `${property.confidence}%`, backgroundColor: confColor }]} />
              </View>
              <Text style={styles.confBadgeTextPremium}>
                <Text style={{ fontWeight: '900', color: '#0B2D3E' }}>{property.confidence}% </Text>
                <Text style={{ fontWeight: '500', color: '#0B2D3E' }}>Confidence</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ── HERO CAROUSEL ── */}
        <Pressable onPress={() => setShowGallery(true)} style={styles.heroWrap}>
          <ScrollView
            ref={carouselRef}
            style={{ flex: 1 }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
              );
              setCurrImageIndex(newIndex);
            }}
            scrollEventThrottle={16}
          >
            {MOCK_IMAGES.map((img, i) => (
              <View key={i} style={{ width: SCREEN_WIDTH - 2 * H_PADDING, height: '100%' }}>
                <Image source={{ uri: img }} style={styles.heroImage} contentFit="cover" />
              </View>
            ))}
          </ScrollView>

          {/* Left/Right arrows */}
          <View style={styles.carouselArrows} pointerEvents="box-none">
            <Pressable style={styles.arrowBtn} onPress={(e) => { e.stopPropagation(); handlePrev(); }}>
              <MaterialCommunityIcons name="chevron-left" size={22} color="#FFF" />
            </Pressable>
            <Pressable style={styles.arrowBtn} onPress={(e) => { e.stopPropagation(); handleNext(); }}>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#FFF" />
            </Pressable>
          </View>

          {/* Top-right phase badge */}
          <View style={styles.phaseBadge}>
            <Text style={styles.phaseBadgeText}>
              {currImageIndex + 1}/{MOCK_IMAGES.length} HIGH-RES PHASES
            </Text>
          </View>

          {/* Tap-to-expand hint */}
          <View style={styles.expandHint}>
            <MaterialCommunityIcons name="image-multiple-outline" size={14} color="#FFF" />
            <Text style={styles.expandHintText}>Tap to view all</Text>
          </View>
        </Pressable>

        {/* ── PROPERTY PROFILE CARD ── */}
        <View style={styles.card}>
          {/* Card header */}
          <View style={styles.profileHeaderRow}>
            <View style={styles.profileTitleBlock}>
              <Text style={styles.profileTitle}>Property Profile</Text>
              <Text style={styles.profileSubtitle}>Comprehensive structural and interior assessment</Text>
            </View>
            <View style={styles.autoScanBadge}>
              <Text style={styles.autoScanText}>ARCHITECTURAL{`\n`}AUTO-SCAN</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* 2-column spec grid */}
          <View style={styles.specGrid}>
            <SpecCell label="PROPERTY TYPE" value={property.type} dot />
            <SpecCell label="YEAR BUILT" value={property.yearBuilt} dot />
          </View>

          <View style={styles.specRowDivider} />

          <View style={styles.specGrid}>
            <SpecCell label="LOT SIZE" value={property.lotSize} dot />
            <SpecCell label="SQ FT" value={`${property.sqft} sqft`} dot />
          </View>

          <View style={styles.specRowDivider} />

          <View style={styles.specGrid}>
            <SpecCell label="BEDS" value={`${property.beds}`} dot />
            <SpecCell label="BATHS" value={`${property.baths}`} dot />
          </View>

          <View style={styles.specRowDivider} />

          <View style={styles.specGrid}>
            <SpecCell label="GARAGE" value={property.garage} dot />
            <SpecCell label="ROOF" value={property.roof} dot />
          </View>

          <View style={styles.specRowDivider} />

          <View style={styles.specGrid}>
            <SpecCell label="FOUNDATION" value={property.foundation} />
            <SpecCell label="BASEMENT" value={property.basement} />
          </View>

          <View style={styles.specRowDivider} />

          <View style={[styles.specGrid, { marginBottom: 0 }]}>
            <SpecCell label="HEATING" value={property.heating} />
            <SpecCell label="COOLING" value={property.cooling} />
          </View>

          <View style={styles.cardDivider} />

          {/* Neighborhood context */}
          <Text style={styles.neighborhoodContextLabel}>NEIGHBORHOOD CONTEXT</Text>
          <Text style={styles.neighborhoodContextText}>{property.neighborhoodDesc}</Text>
        </View>

        {/* ── AI VALUATION CARD ── */}
        <View style={styles.card}>
          {/* AI Valuation badge */}
          <View style={styles.aiValuationBadge}>
            <Text style={styles.aiValuationBadgeText}>AI VALUATION</Text>
          </View>

          <Text style={styles.valuationPrice}>{property.value}</Text>
          <Text style={styles.valuationLabel}>Current Estimated Market Value</Text>

          <View style={styles.cardDivider} />

          {/* MLS List Price row */}
          <View style={styles.valuationRow}>
            <Text style={styles.valuationRowLabel}>MLS List Price</Text>
            <Text style={styles.valuationRowValue}>{property.mlsListPrice}</Text>
          </View>

          {/* Zien AVM row */}
          <View style={[styles.valuationRow, styles.avmRow]}>
            <Text style={styles.avmLabel}>Zien AVM Est.</Text>
            <Text style={styles.avmValue}>{property.zienAvmEst}</Text>
          </View>

          <View style={styles.cardDivider} />

          {/* Automated Insight */}
          <View style={styles.insightRow}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#0D9488" />
            <Text style={styles.insightHeading}>AUTOMATED INSIGHT</Text>
          </View>
          <Text style={styles.insightText}>{property.aiInsight}</Text>
        </View>

        {/* ── LOCATION ANALYSIS CARD ── */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>LOCATION ANALYSIS</Text>

          <View style={styles.walkScoreRow}>
            <View style={styles.walkScoreLeft}>
              <MaterialCommunityIcons name="map-marker-outline" size={22} color="#0f172a" />
              <View>
                <Text style={styles.walkScoreNum}>{property.walkScore}</Text>
                <Text style={styles.walkScoreSmall}>WALK SCORE</Text>
              </View>
            </View>
            <Text style={styles.walkLabel}>{property.walkLabel}</Text>
          </View>

          <Pressable style={styles.mapBtn} onPress={() => setShowMapModal(true)}>
            <Text style={styles.mapBtnText}>View Neighborhood Map</Text>
          </Pressable>
        </View>

        {/* ── DATA INTEGRITY SCORE CARD ── */}
        <View style={styles.card}>
          <View style={styles.integrityHeaderRow}>
            <Text style={styles.sectionHeading}>DATA INTEGRITY SCORE</Text>
            <Text style={[styles.integrityPct, { color: confColor }]}>
              {property.confidence}%
            </Text>
          </View>
          <View style={styles.integrityTrack}>
            <View
              style={[
                styles.integrityFill,
                {
                  width: `${property.confidence}%`,
                  backgroundColor: confColor,
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>

      {/* ── GALLERY MODAL ── */}
      <Modal
        visible={showGallery}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGallery(false)}
      >
        <View style={styles.galleryModal}>
          {/* Modal header */}
          <View style={styles.galleryHeader}>
            <View>
              <Text style={styles.galleryTitle}>
                Property Images ({MOCK_IMAGES.length})
              </Text>
              <Text style={styles.gallerySubtitle}>Manage all property photos and media</Text>
            </View>
            <Pressable
              onPress={() => setShowGallery(false)}
              style={styles.galleryCloseX}
              hitSlop={10}
            >
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          {/* Image grid */}
          <ScrollView
            contentContainerStyle={styles.galleryGrid}
            showsVerticalScrollIndicator={false}
          >
            {MOCK_IMAGES.map((img, i) => {
              const isCurrent = i === currImageIndex;
              return (
                <Pressable
                  key={i}
                  style={({ pressed }) => [
                    styles.galleryThumbWrap,
                    isCurrent && styles.galleryThumbActive,
                    pressed && { opacity: 0.85 },
                  ]}
                  onPress={() => jumpToImage(i)}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.galleryThumb}
                    contentFit="cover"
                  />
                  {/* Badges for current image */}
                  {isCurrent && (
                    <View style={styles.galleryBadgeRow}>
                      <View style={styles.galleryBadgeCurrent}>
                        <Text style={styles.galleryBadgeText}>CURRENT</Text>
                      </View>
                      <View style={styles.galleryBadgeMain}>
                        <Text style={styles.galleryBadgeText}>MAIN</Text>
                      </View>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* ── NEIGHBORHOOD MAP MODAL ── */}
      <NeighborhoodMapModal
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        property={property}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 16, color: '#5B6B7A', marginBottom: 16 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  // ── Premium Header ──
  headerTopArea: {
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTitleBox: {
    marginBottom: 10,
  },
  headerAddress: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metaRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  confidenceBadgePremium: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  confBadgeTextPremium: {
    fontSize: 13,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: H_PADDING, paddingBottom: 24 },

  // ── Status ──
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  confBarSmall: {
    width: 30,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confBarFill: { height: '100%', borderRadius: 2 },

  // ── Hero ──
  heroWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
    ...Platform.select({
      ios: { shadowColor: '#0B2D3E', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  heroImage: { width: '100%', height: '100%' },
  carouselArrows: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(13,148,136,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  phaseBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  // ── Shared card ──
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },

  // ── Property Profile card ──
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 4,
  },
  profileTitleBlock: { flex: 1 },
  profileTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  profileSubtitle: { fontSize: 11, color: '#94A3B8', marginTop: 3, lineHeight: 16 },
  autoScanBadge: {
    backgroundColor: 'rgba(13,148,136,0.10)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  autoScanText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.4,
    textAlign: 'center',
    lineHeight: 13,
  },

  // Spec grid — 2-column
  specGrid: {
    flexDirection: 'row',
    gap: 0,
    marginBottom: 0,
    paddingVertical: 12,
  },
  specRowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
  },
  specCell: { flex: 1, paddingHorizontal: 4 },
  specCellLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  specCellValueRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  specCellValue: { fontSize: 14, fontWeight: '700', color: '#0f172a', flexShrink: 1 },
  specDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#0D9488' },

  neighborhoodContextLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  neighborhoodContextText: {
    fontSize: 13,
    color: '#5B6B7A',
    lineHeight: 19,
  },

  // ── Gallery modal ──
  galleryModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  galleryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  gallerySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  galleryCloseX: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  galleryThumbWrap: {
    width: (SCREEN_WIDTH - 16 * 2 - 12) / 2,
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  galleryThumbActive: {
    borderWidth: 2.5,
    borderColor: '#0D9488',
  },
  galleryThumb: {
    width: '100%',
    height: '100%',
  },
  galleryBadgeRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  galleryBadgeCurrent: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  galleryBadgeMain: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  galleryBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // ── Carousel expand hint ──
  expandHint: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expandHintText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },

  // ── AI Valuation card ──
  aiValuationBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#0D9488',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  aiValuationBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  valuationPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  valuationLabel: { fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 4 },
  valuationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    marginBottom: 8,
  },
  avmRow: {
    backgroundColor: 'rgba(234,88,12,0.06)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#EA580C',
    marginBottom: 0,
  },
  valuationRowLabel: { fontSize: 13, color: '#5B6B7A', fontWeight: '500' },
  valuationRowValue: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  avmLabel: { fontSize: 13, color: '#C2410C', fontWeight: '700' },
  avmValue: { fontSize: 15, fontWeight: '800', color: '#C2410C' },
  insightRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  insightHeading: { fontSize: 11, fontWeight: '800', color: '#0D9488', letterSpacing: 0.5 },
  insightText: { fontSize: 13, color: '#334155', lineHeight: 19 },

  // ── Location Analysis card ──
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  walkScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  walkScoreLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  walkScoreNum: { fontSize: 28, fontWeight: '900', color: '#0f172a', lineHeight: 30 },
  walkScoreSmall: { fontSize: 9, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 },
  walkLabel: { fontSize: 11, fontWeight: '800', color: '#0EA5E9', letterSpacing: 0.3 },
  mapBtn: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  mapBtnText: { fontSize: 13, fontWeight: '700', color: '#0f172a' },

  // ── Data Integrity Score card ──
  integrityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  integrityPct: { fontSize: 15, fontWeight: '800' },
  integrityTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  integrityFill: { height: '100%', borderRadius: 4 },


});
