import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 20;

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
    value: '$12,800,000',
    confidence: 72,
    image: PLACEHOLDER_VILLA,
  },
  {
    id: 'ZN-94023-SM',
    address: '900 Ocean Blvd',
    cityState: 'Santa Monica, CA',
    type: 'Condo',
    status: 'Ready',
    value: '$1,150,000',
    confidence: 95,
    image: PLACEHOLDER_CONDO,
  },
  {
    id: 'ZN-94024-PD',
    address: '45 Pine Street',
    cityState: 'Pasadena, CA',
    type: 'Apartment',
    status: 'DRAFT',
    value: '$3,400,000',
    confidence: 45,
    image: PLACEHOLDER_APARTMENT,
  },
];

function ConfidenceBar({ value }: { value: number }) {
  const isHigh = value >= 85;
  const isMedium = value >= 60 && value < 85;
  const barColor = isHigh ? '#0D9488' : isMedium ? '#EA580C' : '#DC2626';

  return (
    <View style={styles.confidenceContainer}>
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

  // Matching screenshot styles more closely
  const bg = isReady ? 'rgba(13, 148, 136, 0.12)' : isReview ? 'rgba(234, 88, 12, 0.12)' : 'rgba(241, 245, 249, 1)';
  const color = isReady ? '#0D9488' : isReview ? '#C2410C' : '#64748B';
  const label = isReady ? 'Ready' : isReview ? 'Review Needed' : 'Draft';

  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={[styles.statusPillText, { color }]}>{label}</Text>
    </View>
  );
}

function PropertyRowCard({
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

      {/* Top Section: Image + Main Info */}
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: property.image }}
          style={styles.cardThumb}
          contentFit="cover"
        />
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.cardAddress} numberOfLines={1}>{property.address}</Text>
          <Text style={styles.cardCity}>{property.cityState}</Text>
          <Text style={styles.cardId}>{property.id}</Text>
        </View>
        <StatusPill status={property.status} />
      </View>

      <View style={styles.divider} />

      {/* Grid Details */}
      <View style={styles.cardStatsGrid}>
        <View style={styles.statsCol}>
          <Text style={styles.statsLabel}>TYPE</Text>
          <Text style={styles.statsValue}>{property.type}</Text>
        </View>

        <View style={styles.statsCol}>
          <Text style={styles.statsLabel}>VALUE / PRICE</Text>
          <Text style={styles.statsValue}>{property.value}</Text>
        </View>

        <View style={[styles.statsCol, { flex: 1.2 }]}>
          <Text style={styles.statsLabel}>CONFIDENCE</Text>
          <ConfidenceBar value={property.confidence} />
        </View>
      </View>

      {/* Action Footer */}
      <View style={styles.cardActionRow}>
        <Pressable
          style={({ pressed }) => [styles.manageBtn, pressed && { opacity: 0.7 }]}
          onPress={() => onManage(property)}
        >
          <Text style={styles.manageBtnText}>Manage Data</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#0EA5E9" />
        </Pressable>
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
    router.push({
      pathname: '/(main)/properties/[id]',
      params: { id: property.id },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Gradient - subtle soft blue/gray from screenshot */}
      <LinearGradient
        colors={['#F0F4F8', '#E2E8F0', '#F0F4F8']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Property Inventory</Text>
          <Text style={styles.subtitle}>Manage your high-confidence property data.</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Create Listing Button - Moved here */}
        <Pressable
          style={({ pressed }) => [styles.createListingBlock, pressed && { opacity: 0.95 }]}
          onPress={handleCreateListing}
        >
          <LinearGradient
            colors={['#0f172a', '#334155']}
            style={styles.createListingGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.createIconCircle}>
              <MaterialCommunityIcons name="plus" size={20} color="#0f172a" />
            </View>
            <Text style={styles.createListingText}>Create New Listing</Text>
          </LinearGradient>
        </Pressable>

        {/* Stats Row - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsRow}
          contentContainerStyle={styles.statsRowContent}
        >
          {/* Active Card */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <MaterialCommunityIcons name="home-outline" size={24} color="#1E293B" />
            </View>
            <View>
              <Text style={styles.statBigNum}>12 Active</Text>
              <Text style={styles.statSub}>Total Properties tracked</Text>
            </View>
          </View>

          {/* Avg Score Card */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={24} color="#1E293B" />
            </View>
            <View>
              <Text style={styles.statBigNum}>94% Avg.</Text>
              <Text style={styles.statSub}>Data Confidence Score</Text>
            </View>
          </View>

          {/* Drafts Card */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <MaterialCommunityIcons name="file-document-edit-outline" size={24} color="#1E293B" />
            </View>
            <View>
              <Text style={styles.statBigNum}>3 Drafts</Text>
              <Text style={styles.statSub}>Need manual verification</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>PROPERTY</Text>
          {/* <Text style={styles.listTitleRight}>STATUS</Text> */}
        </View>

        {/* Listings */}
        <View style={styles.listContainer}>
          {PROPERTIES.map((property) => (
            <PropertyRowCard
              key={property.id}
              property={property}
              onManage={handleManageData}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  createListingBlock: {
    marginHorizontal: H_PADDING,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createListingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  createIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createListingText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  statsRow: {
    marginBottom: 24,
    maxHeight: 110,
  },
  statsRowContent: {
    paddingHorizontal: H_PADDING,
    paddingRight: 8,
  },
  statCard: {
    backgroundColor: '#FFF',
    width: 220,
    height: 100,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBigNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    maxWidth: 120,
    lineHeight: 14,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING + 4,
    marginBottom: 10,
    opacity: 0.5,
  },
  listTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },
  listTitleRight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },
  listContainer: {
    paddingHorizontal: H_PADDING,
    gap: 16,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  propertyCardPressed: {
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  cardHeaderInfo: {
    flex: 1,
    paddingTop: 0, // Align with top of image
  },
  cardAddress: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
    marginBottom: 2,
  },
  cardCity: {
    fontSize: 13,
    color: '#64748B',
  },
  cardId: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  cardStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  statsCol: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  confidenceTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    minWidth: 34,
    textAlign: 'right',
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  manageBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
