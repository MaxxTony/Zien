import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 16;

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
  syncStatus: string;
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
    syncStatus: 'SYNCED',
  },
  {
    id: 'ZN-90210-BH',
    address: '88 Gold Coast Dr',
    cityState: 'Malibu, CA',
    type: 'Luxury Villa',
    status: 'REVIEW NEEDED',
    value: '$12,800,000',
    confidence: 72,
    image: PLACEHOLDER_VILLA,
    syncStatus: 'SYNCED',
  },
  {
    id: 'ZN-91101-PA',
    address: '45 Pine St',
    cityState: 'Pasadena, CA',
    type: 'Condo',
    status: 'Ready',
    value: '$1,150,000',
    confidence: 95,
    image: PLACEHOLDER_CONDO,
    syncStatus: 'SYNCED',
  },
  {
    id: 'ZN-90401-SM',
    address: '900 Ocean Blvd',
    cityState: 'Santa Monica, CA',
    type: 'Apartment',
    status: 'DRAFT',
    value: '$3,400,000',
    confidence: 45,
    image: PLACEHOLDER_APARTMENT,
    syncStatus: 'SYNCED',
  },
];

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.statCard}>
      <View style={styles.statIconBox}>
        <MaterialCommunityIcons name={icon as any} size={22} color={colors.textPrimary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Confidence Bar ────────────────────────────────────────────────────────────
function ConfidenceBar({ value }: { value: number }) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const barColor =
    value >= 85 ? '#0D9488' : value >= 60 ? '#EA580C' : '#DC2626';
  return (
    <View style={styles.confidenceWrap}>
      <Text style={[styles.confidencePct, { color: barColor }]}>{value}%</Text>
      <View style={styles.confidenceTrack}>
        <View
          style={[
            styles.confidenceFill,
            { width: `${Math.min(100, value)}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

// ── Status Pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: PropertyStatus }) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const isReady = status === 'Ready';
  const isReview = status === 'REVIEW NEEDED';
  const bg = isReady
    ? 'rgba(13,148,136,0.12)'
    : isReview
      ? 'rgba(234,88,12,0.12)'
      : 'rgba(100,116,139,0.10)';
  const color = isReady ? '#0D9488' : isReview ? '#C2410C' : '#64748B';
  const dot = isReady ? '#0D9488' : isReview ? '#C2410C' : '#94A3B8';
  const label = isReady ? 'READY' : isReview ? 'REVIEW' : 'DRAFT';

  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <View style={[styles.statusDot, { backgroundColor: dot }]} />
      <Text style={[styles.statusText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({
  property,
  onCancel,
  onConfirm,
}: {
  property: Property | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <Modal
      visible={!!property}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={styles.modalCard} onPress={() => { }}>
          {/* Icon */}
          <View style={styles.modalIconWrap}>
            <MaterialCommunityIcons name="trash-can-outline" size={30} color="#EF4444" />
          </View>

          {/* Title */}
          <Text style={styles.modalTitle}>Delete Property?</Text>

          {/* Body */}
          <Text style={styles.modalBody}>
            {'Are you sure you want to delete '}
            <Text style={styles.modalBodyBold}>{property?.id}</Text>
            {'?\nThis action cannot be undone.'}
          </Text>

          {/* Buttons */}
          <View style={styles.modalBtnRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalDeleteBtn}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.modalDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Property Row Card ─────────────────────────────────────────────────────────
function PropertyRowCard({
  property,
  onManage,
  onEdit,
  onDeletePress,
}: {
  property: Property;
  onManage: (p: Property) => void;
  onEdit: (p: Property) => void;
  onDeletePress: (p: Property) => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.propertyCard}>
      {/* Row 1: Thumb + Address block + Status pill */}
      <View style={styles.row1}>
        <Image
          source={{ uri: property.image }}
          style={styles.thumb}
          contentFit="cover"
        />
        <View style={styles.addressBlock}>
          <Text style={styles.addressText} numberOfLines={1}>
            {property.address}, {property.cityState}
          </Text>
          <Text style={styles.idText}>ID: {property.id}</Text>
        </View>
        <StatusPill status={property.status} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Row 2: Type · Valuation · Confidence */}
      <View style={styles.row2}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>LISTING TYPE</Text>
          <Text style={styles.metaValue}>{property.type}</Text>
        </View>
        <View style={[styles.metaCol, styles.metaColCenter]}>
          <Text style={styles.metaLabel}>VALUATION</Text>
          <Text style={styles.metaValueBold}>{property.value}</Text>
        </View>
        <View style={[styles.metaCol, { flex: 1.3 }]}>
          <Text style={styles.metaLabel}>CONFIDENCE</Text>
          <ConfidenceBar value={property.confidence} />
        </View>
      </View>

      {/* Row 3: Sync badge + action icons */}
      <View style={styles.row3}>
        <View style={styles.syncBadge}>
          <MaterialCommunityIcons name="cloud-check" size={11} color={colors.textSecondary} />
          <Text style={styles.syncText}>{property.syncStatus}</Text>
        </View>
        <View style={styles.actionIcons}>
          <Pressable
            onPress={() => onManage(property)}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            hitSlop={6}
          >
            <MaterialCommunityIcons name="eye-outline" size={20} color={colors.accentTeal} />
          </Pressable>
          <Pressable
            onPress={() => onEdit(property)}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            hitSlop={6}
          >
            <MaterialCommunityIcons name="square-edit-outline" size={20} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            onPress={() => onDeletePress(property)}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            hitSlop={6}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function PropertyInventoryScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  const handleCreateListing = () => {
    router.push('/(main)/properties/create');
  };

  const handleManageData = (property: Property) => {
    router.push({
      pathname: '/(main)/properties/[id]',
      params: { id: property.id },
    });
  };

  const handleEditProperty = (property: Property) => {
    router.push({
      pathname: '/(main)/properties/edit/[id]',
      params: { id: property.id },
    });
  };

  const handleDeletePress = (property: Property) => {
    setDeleteTarget(property);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={colors.backgroundGradient as any}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <PageHeader
        title="Property Inventory"
        subtitle="Manage your high-confidence property data."
        onBack={() => router.back()}
        rightIcon="plus"
        onRightPress={handleCreateListing}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 4 STAT CARDS (2×2 grid) ── */}
        <View style={styles.statsGrid}>
          <StatCard icon="currency-usd" value="$21.6M" label="Portfolio Value" />
          <StatCard icon="home-outline" value="12 Active" label="Total Properties" />
          <StatCard icon="chart-bell-curve-cumulative" value="94% Avg." label="Data Confidence" />
          <StatCard icon="file-document-edit-outline" value="3 Drafts" label="Need Review" />
        </View>



        {/* ── LIST HEADER ── */}
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeaderText}>PROPERTY IDENTITY</Text>
          <Text style={styles.tableHeaderText}>STATUS</Text>
        </View>

        {/* ── PROPERTY LIST ── */}
        <View style={styles.listContainer}>
          {properties.map((property) => (
            <PropertyRowCard
              key={property.id}
              property={property}
              onManage={handleManageData}
              onEdit={handleEditProperty}
              onDeletePress={handleDeletePress}
            />
          ))}
        </View>

        {/* ── DELETE MODAL ── */}
        <DeleteConfirmModal
          property={deleteTarget}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const CARD_GAP = 12;
const CARD_W = (SCREEN_WIDTH - H_PADDING * 2 - CARD_GAP) / 2;

function getStyles(colors: any) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },



  // ── Scroll ──
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 4,
  },

  // ── Stat Cards Grid ──
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: H_PADDING,
    gap: CARD_GAP,
    marginBottom: 20,
  },
  statCard: {
    width: CARD_W,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 14,
  },



  // ── Table header row ──
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING + 4,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.inputPlaceholder,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── List ──
  listContainer: {
    paddingHorizontal: H_PADDING,
    gap: 14,
  },

  // ── Property Card ──
  propertyCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Row 1
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
  },
  addressBlock: {
    flex: 1,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  idText: {
    fontSize: 10,
    color: colors.accentTeal,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.2,
  },

  // Status pill
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.surfaceSoft,
    marginVertical: 12,
  },

  // Row 2
  row2: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  metaCol: {
    flex: 1,
  },
  metaColCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 8,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.inputPlaceholder,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metaValueBold: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  // Confidence
  confidenceWrap: {
    gap: 4,
  },
  confidencePct: {
    fontSize: 13,
    fontWeight: '800',
  },
  confidenceTrack: {
    height: 5,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Row 3
  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    fontSize: 10,
    color: colors.inputPlaceholder,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

  // ── Delete Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239,68,68,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  modalBodyBold: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalDeleteBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  });
}