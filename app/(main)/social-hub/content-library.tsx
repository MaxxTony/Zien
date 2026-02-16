import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'ai-generated', label: 'AI Generated' },
  { id: 'property', label: 'Property' },
  { id: 'open-house', label: 'Open House' },
  { id: 'evergreen', label: 'Evergreen' },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface ContentCard {
  id: string;
  tag: string;
  title: string;
  platform: string;
  lastUsed: string;
  usage: number;
  image: any;
}

const ALL_CONTENT: ContentCard[] = [
  {
    id: '1',
    tag: 'PROPERTY',
    title: 'Luxury Villa @ Malibu',
    platform: 'Instagram',
    lastUsed: 'Jan 12',
    usage: 3,
    image: { uri: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  },
  {
    id: '2',
    tag: 'OPEN HOUSE',
    title: 'Weekend OH Promo',
    platform: 'Multi',
    lastUsed: 'Jan 10',
    usage: 1,
    image: { uri: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  },
  {
    id: '3',
    tag: 'AI GENERATED',
    title: 'Malibu Market Report',
    platform: 'LinkedIn',
    lastUsed: 'Jan 05',
    usage: 2,
    image: { uri: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  },
  {
    id: '4',
    tag: 'EVERGREEN',
    title: 'First Time Buyer Tips',
    platform: 'Facebook',
    lastUsed: 'Dec 28',
    usage: 8,
    image: { uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  },
];

function ContentCardItem({ item, width }: { item: ContentCard, width: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.cardImageWrap}>
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={styles.cardGradientOverlay}
        />
        <View style={styles.cardTag}>
          <Text style={styles.cardTagText}>{item.tag}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.platformBadge}>
            <MaterialCommunityIcons
              name={item.platform === 'Multi' ? 'layers-outline' : item.platform.toLowerCase() as any}
              size={12}
              color="#64748B"
            />
            <Text style={styles.platformText}>{item.platform}</Text>
          </View>
          <View style={styles.dotSeparator} />
          <Text style={styles.lastUsedText}>Last used {item.lastUsed}</Text>
          <View style={styles.usageContainer}>
            <MaterialCommunityIcons name="history" size={14} color="#0BA0B2" />
            <Text style={styles.cardUsage}>{item.usage} {item.usage === 1 ? 'Use' : 'Uses'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>


          <View style={styles.cardActions}>
            <Pressable style={styles.iconBtn} hitSlop={8}>
              <MaterialCommunityIcons name="pencil-outline" size={16} color="#475569" />
            </Pressable>
            <Pressable style={styles.iconBtn} hitSlop={8}>
              <MaterialCommunityIcons name="content-copy" size={16} color="#475569" />
            </Pressable>
            <Pressable style={styles.iconBtn} hitSlop={8}>
              <MaterialCommunityIcons name="share-variant-outline" size={16} color="#475569" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ContentLibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const { width } = Dimensions.get('window');
  const padding = 20;
  const gap = 16;
  const isTablet = width > 600;
  const cardWidth = isTablet ? (width - padding * 2 - gap * 2) / 3 : (width - padding * 2 - gap) / 2;

  const filteredCards = useMemo(() => {
    if (activeTab === 'all') return ALL_CONTENT;
    const tagMap: Record<string, string> = {
      'ai-generated': 'AI GENERATED',
      'property': 'PROPERTY',
      'open-house': 'OPEN HOUSE',
      'evergreen': 'EVERGREEN',
    };
    const targetTag = tagMap[activeTab];
    return ALL_CONTENT.filter(c => c.tag === targetTag);
  }, [activeTab]);

  return (
    <LinearGradient
      colors={['#F0F4F8', '#F1F5F9', '#F8FAFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0F172A" />
        </Pressable>
        <View style={styles.headerTop}>
          <Text style={styles.screenTitle}>Content Library</Text>
          <Text style={styles.screenSubtitle}>
            Manage and repurpose your high-performing assets.
          </Text>
        </View>
      </View>

      <View style={styles.controlsSection}>
        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScroll}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Import Button */}
        <Pressable style={styles.importBtn}>
          <LinearGradient
            colors={['#0F172A', '#1E293B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.importBtnGradient}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#FFF" />
            <Text style={styles.importBtnText}>Import Assets</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredCards.map((item) => (
            <ContentCardItem key={item.id} item={item} width={cardWidth} />
          ))}
        </View>
        {filteredCards.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="image-search-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No assets found in this category.</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTop: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  controlsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  tabsScroll: { flexGrow: 0 },
  tabsContainer: {
    gap: 10,
    paddingRight: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  importBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  importBtnGradient: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  importBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 8,
  },
  cardImageWrap: {
    height: 150,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  cardTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(4px)',
  },
  cardTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  cardContent: {
    padding: 16,
  },
  titleRow: {
    height: 44, // Fixed height for alignment
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.3,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  platformText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
  lastUsedText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFEFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardUsage: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0891B2',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },

  emptyState: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  }
});
