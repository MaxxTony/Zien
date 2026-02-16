import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 18;
const CARD_GAP = 14;

const PLACEHOLDER_HOUSE =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800';
const PLACEHOLDER_VILLA =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
const PLACEHOLDER_CONDO =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';
const PLACEHOLDER_APARTMENT =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';

type PropertyStatus = 'Ready' | 'REVIEW NEEDED' | 'DRAFT';

type Property = {
  id: string;
  address: string;
  cityState: string;
  type: string;
  status: PropertyStatus;
  value: string;
  confidence: number;
  image: string;
};

const PROPERTIES: Property[] = [
  {
    id: 'ZN-94021-LA',
    address: '123 Business Way',
    cityState: 'Los Angeles, CA',
    type: 'Single Family',
    status: 'Ready',
    value: '$4,250,000',
    confidence: 98,
    image: PLACEHOLDER_HOUSE,
  },
  {
    id: 'ZN-94022-MB',
    address: '88 Gold Coast Dr',
    cityState: 'Malibu, CA',
    type: 'Luxury Villa',
    status: 'REVIEW NEEDED',
    value: '$8,750,000',
    confidence: 72,
    image: PLACEHOLDER_VILLA,
  },
  {
    id: 'ZN-94023-SM',
    address: '900 Ocean Blvd',
    cityState: 'Santa Monica, CA',
    type: 'Condo',
    status: 'DRAFT',
    value: '$1,920,000',
    confidence: 45,
    image: PLACEHOLDER_CONDO,
  },
  {
    id: 'ZN-94024-PD',
    address: '45 Pine Street',
    cityState: 'Pasadena, CA',
    type: 'Apartment',
    status: 'Ready',
    value: '$685,000',
    confidence: 95,
    image: PLACEHOLDER_APARTMENT,
  },
];

function ConfidenceBar({ value }: { value: number }) {
  const isHigh = value >= 85;
  const isMedium = value >= 60 && value < 85;
  const barColor = isHigh ? '#0D9488' : isMedium ? '#EA580C' : '#DC2626';
  return (
    <View style={styles.confidenceRow}>
      <View style={styles.confidenceTrack}>
        <View
          style={[
            styles.confidenceFill,
            { width: `${Math.min(100, value)}%`, backgroundColor: barColor },
          ]}
        />
      </View>
      <Text style={styles.confidenceText}>{value}%</Text>
    </View>
  );
}

function StatusPill({ status }: { status: PropertyStatus }) {
  const isReady = status === 'Ready';
  const isReview = status === 'REVIEW NEEDED';
  return (
    <View
      style={[
        styles.statusPill,
        isReady && styles.statusPillReady,
        isReview && styles.statusPillReview,
        status === 'DRAFT' && styles.statusPillDraft,
      ]}>
      <Text
        style={[
          styles.statusPillText,
          isReady && styles.statusPillTextReady,
          isReview && styles.statusPillTextReview,
          status === 'DRAFT' && styles.statusPillTextDraft,
        ]}>
        {status}
      </Text>
    </View>
  );
}

function PropertyCard({
  property,
  onManage,
}: {
  property: Property;
  onManage: (p: Property) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.propertyCard, pressed && styles.propertyCardPressed]}
      onPress={() => onManage(property)}>
      <View style={styles.propertyCardImageWrap}>
        <Image
          source={{ uri: property.image }}
          style={styles.propertyCardImage}
          contentFit="cover"
        />
      </View>
      <View style={styles.propertyCardBody}>
        <Text style={styles.propertyAddress} numberOfLines={2}>
          {property.address}
        </Text>
        <Text style={styles.propertyCityState}>{property.cityState}</Text>
        <Text style={styles.propertyId}>ID: {property.id}</Text>
        <View style={styles.propertyMeta}>
          <Text style={styles.propertyType}>{property.type}</Text>
          <StatusPill status={property.status} />
        </View>
        <View style={styles.propertyValueRow}>
          <Text style={styles.propertyValueLabel}>Value / Price</Text>
          <Text style={styles.propertyValue}>{property.value}</Text>
        </View>
        <View style={styles.propertyConfidenceSection}>
          <Text style={styles.propertyConfidenceLabel}>Confidence</Text>
          <ConfidenceBar value={property.confidence} />
        </View>
        <View style={styles.manageDataLink}>
          <Text style={styles.manageDataLinkText}>Manage Data</Text>
          <MaterialCommunityIcons name="chevron-right" size={14} color="#5B6B7A" />
        </View>
      </View>
    </Pressable>
  );
}

export default function PropertyInventoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCreateListing = () => {
    router.push('/(main)/properties/create');
  };

  const handleManageData = (property: Property) => {
    router.push(`/(main)/properties/${property.id}`);
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Property Inventory</Text>
          <Text style={styles.subtitle}>
            Manage your high-confidence property data vault.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Create Listing — primary CTA, refined */}
        <Pressable
          style={({ pressed }) => [styles.createListingButton, pressed && styles.createListingButtonPressed]}
          onPress={handleCreateListing}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}>
          <LinearGradient
            colors={['#0D9488', '#0F766E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createListingButtonGradient}>
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.createListingButtonText}>Create Listing</Text>
          </LinearGradient>
        </Pressable>

        {/* Summary cards — horizontal scroll on mobile */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScrollContent}
          style={styles.statsScroll}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <MaterialCommunityIcons name="home-outline" size={22} color="#0B2D3E" />
            </View>
            <Text style={styles.statValue}>12 Active</Text>
            <Text style={styles.statLabel}>Total Properties tracked</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <MaterialCommunityIcons name="chart-line" size={22} color="#0B2D3E" />
            </View>
            <Text style={styles.statValue}>94% Avg.</Text>
            <Text style={styles.statLabel}>Data Confidence Score</Text>
          </View>
          <View style={[styles.statCard, styles.statCardDrafts]}>
            <View style={[styles.statIconWrap, styles.statIconWrapOrange]}>
              <MaterialCommunityIcons name="file-document-outline" size={22} color="#EA580C" />
            </View>
            <Text style={[styles.statValue, styles.statValueOrange]}>3 Drafts</Text>
            <Text style={styles.statLabel}>Need manual verification</Text>
          </View>
        </ScrollView>

        {/* Property list */}
        <Text style={styles.sectionTitle}>Your listings</Text>
        {PROPERTIES.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onManage={handleManageData}
          />
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: H_PADDING,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
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
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 8,
  },
  createListingButton: {
    borderRadius: 16,
    minHeight: 50,
    overflow: 'hidden',
    marginBottom: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  createListingButtonPressed: {
    opacity: 0.9,
  },
  createListingButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 24,
    minHeight: 50,
  },
  createListingButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsScroll: {
    marginHorizontal: -H_PADDING,
    marginBottom: 26,
  },
  statsScrollContent: {
    paddingHorizontal: H_PADDING,
    paddingRight: H_PADDING + CARD_GAP,
  },
  statCard: {
    width: SCREEN_WIDTH * 0.7,
    maxWidth: 260,
    marginRight: CARD_GAP,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
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
  statCardDrafts: {},
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 45, 62, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconWrapOrange: {
    backgroundColor: 'rgba(234, 88, 12, 0.12)',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  statValueOrange: {
    color: '#C2410C',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B6B7A',
    marginTop: 4,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: CARD_GAP,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  propertyCardPressed: {
    opacity: 0.92,
  },
  propertyCardImageWrap: {
    width: '100%',
    height: 160,
  },
  propertyCardImage: {
    width: '100%',
    height: '100%',
  },
  propertyCardBody: {
    padding: 18,
  },
  propertyAddress: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B2D3E',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  propertyCityState: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5B6B7A',
    marginTop: 2,
  },
  propertyId: {
    fontSize: 11,
    color: '#8B9AAA',
    fontWeight: '500',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  propertyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  propertyType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  statusPill: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusPillReady: {
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
  },
  statusPillReview: {
    backgroundColor: 'rgba(234, 88, 12, 0.14)',
  },
  statusPillDraft: {
    backgroundColor: 'rgba(11, 45, 62, 0.08)',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statusPillTextReady: {
    color: '#0D9488',
  },
  statusPillTextReview: {
    color: '#C2410C',
  },
  statusPillTextDraft: {
    color: '#5B6B7A',
  },
  propertyValueRow: {
    marginTop: 16,
  },
  propertyValueLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B9AAA',
    marginBottom: 4,
  },
  propertyValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  propertyConfidenceSection: {
    marginTop: 14,
  },
  propertyConfidenceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B9AAA',
    marginBottom: 6,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confidenceTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(11, 45, 62, 0.08)',
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2D3E',
    minWidth: 32,
  },
  manageDataLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 16,
    gap: 2,
  },
  manageDataLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6B7A',
  },
});
