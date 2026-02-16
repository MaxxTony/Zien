import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const LIBRARY_CARD_WIDTH = SCREEN_WIDTH * 0.72;
const LIBRARY_CARD_MARGIN = 16;

// Neutral icon background to match web (no colorful accents)
const ENGINE_ICON_BG = '#E8EEF4';

const CREATIVE_ENGINES = [
  {
    id: 'staging',
    title: 'Virtual Staging',
    description: 'Turn empty rooms into beautifully furnished professional spaces.',
    icon: 'sofa' as const,
  },
  {
    id: 'enhancement',
    title: 'Image Enhancement',
    description: 'HDR correction, sky replacement, and lighting.',
    icon: 'star-four-points' as const,
  },
  {
    id: 'removal',
    title: 'Object Removal',
    description: 'Clean up clutter and personal items automatically.',
    icon: 'broom' as const,
  },
  {
    id: 'twilight',
    title: 'Twilight Effect',
    description: 'Convert daytime photos to stunning evening shots.',
    icon: 'weather-sunset' as const,
  },
  {
    id: 'renovation',
    title: 'Virtual Renovation',
    description: 'Re-imagine floors, paints, and kitchen architecture with AI.',
    icon: 'hammer' as const,
  },
];

// Deep blue tag for all (web style)
const ASSET_TAG_BG = '#0B2D3E';

const VISUAL_LIBRARY_ASSETS = [
  {
    id: '1',
    tag: 'STAGED',
    title: 'Living Room Modern',
    address: '123 Business Way',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
  },
  {
    id: '2',
    tag: 'TWILIGHT',
    title: 'Exterior Twilight',
    address: '88 Gold Coast',
    time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
  },
  {
    id: '3',
    tag: 'ENHANCED',
    title: 'Master Bed Clean',
    address: '900 Ocean Blvd',
    time: '3 days ago',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600',
  },
  {
    id: '4',
    tag: 'RENOVATED',
    title: 'Kitchen Reno',
    address: '123 Business Way',
    time: 'Jan 12, 2026',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600',
  },
  {
    id: '5',
    tag: 'STAGED',
    title: 'Dining Area',
    address: '45 Harbor View',
    time: '5 days ago',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
  },
];

export default function ImagesStagingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const totalAssets = useMemo(() => VISUAL_LIBRARY_ASSETS.length, []);

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Visual Intelligence Studio</Text>
          <Text style={styles.subtitle}>
            High-fidelity creative engines and architectural visualization suite.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top actions: Batch Process (secondary) + Upload Raw Assets (primary) */}
        <View style={styles.topActions}>
          <Pressable style={styles.secondaryButton} onPress={() => {}}>
            <MaterialCommunityIcons name="database-outline" size={18} color="#0B2D3E" />
            <Text style={styles.secondaryButtonText}>Batch Process</Text>
          </Pressable>
          <Pressable
            style={styles.uploadButton}
            onPress={() => router.push('/(main)/images-staging/upload')}>
            <MaterialCommunityIcons name="upload-outline" size={18} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Upload Raw Assets</Text>
          </Pressable>
        </View>

        {/* Creative Engines */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Creative Engines</Text>
          <Text style={styles.sectionLabel}>NEURAL PERFORMANCE OPTIMIZED</Text>
        </View>
        <View style={styles.enginesGrid}>
          {CREATIVE_ENGINES.map((engine) => (
            <Pressable
              key={engine.id}
              style={styles.engineCard}
              onPress={() => router.push(`/(main)/images-staging/upload?type=${engine.id}`)}>
              <View style={styles.engineIconWrap}>
                <MaterialCommunityIcons name={engine.icon} size={24} color="#0B2D3E" />
              </View>
              <View style={styles.engineTextWrap}>
                <Text style={styles.engineTitle}>{engine.title}</Text>
                <Text style={styles.engineDesc}>{engine.description}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>

        {/* Visual Library */}
        <View style={styles.librarySectionHead}>
          <View>
            <Text style={styles.sectionTitle}>Visual Library</Text>
            <Text style={styles.librarySubtitle}>
              Secured storage for post-processed architectural assets.
            </Text>
          </View>
          <Pressable style={styles.allAssetsButton} hitSlop={8}>
            <MaterialCommunityIcons name="folder-outline" size={18} color="#0B2D3E" />
            <Text style={styles.allAssetsButtonText}>All Master Assets ({totalAssets})</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.libraryScroll}
          snapToInterval={LIBRARY_CARD_WIDTH + CARD_GAP}
          snapToAlignment="start"
          decelerationRate="fast">
          {VISUAL_LIBRARY_ASSETS.map((asset) => (
            <View key={asset.id} style={[styles.assetCard, { width: LIBRARY_CARD_WIDTH }]}>
              <View style={styles.assetImageWrap}>
                <Image
                  source={{ uri: asset.image }}
                  style={styles.assetImage}
                  contentFit="cover"
                />
                <View style={styles.assetTag}>
                  <Text style={styles.assetTagText}>{asset.tag}</Text>
                </View>
              </View>
              <Text style={styles.assetTitle} numberOfLines={1}>{asset.title}</Text>
              <Text style={styles.assetMeta} numberOfLines={1}>
                {asset.address} · {asset.time}
              </Text>
              <View style={styles.assetActions}>
                <Pressable style={styles.assetActionBtn}>
                  <MaterialCommunityIcons name="download-outline" size={18} color="#0B2D3E" />
                </Pressable>
                <Pressable style={styles.assetActionBtn}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color="#5B6B7A" />
                </Pressable>
              </View>
            </View>
          ))}
          <View style={{ width: LIBRARY_CARD_MARGIN }} />
        </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  headerCenter: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    flex: 1,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flex: 1,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionHead: {
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  enginesGrid: {
    gap: CARD_GAP,
    marginBottom: 28,
  },
  engineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 12,
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  engineIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENGINE_ICON_BG,
  },
  engineTextWrap: {
    flex: 1,
  },
  engineTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  engineDesc: {
    fontSize: 12,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 2,
  },
  librarySectionHead: {
    marginBottom: 12,
    gap: 8,
  },
  librarySubtitle: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 4,
  },
  allAssetsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  allAssetsButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  libraryScroll: {
    paddingLeft: 0,
    gap: CARD_GAP,
    paddingRight: 4,
  },
  assetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  assetImageWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
  },
  assetImage: {
    width: '100%',
    height: '100%',
  },
  assetTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: ASSET_TAG_BG,
  },
  assetTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  assetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  assetMeta: {
    fontSize: 12,
    color: '#5B6B7A',
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 10,
  },
  assetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  assetActionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#E8EEF4',
  },
});
