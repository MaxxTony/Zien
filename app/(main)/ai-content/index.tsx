import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CONTENT_TOOLS = [
  {
    id: 'property-description',
    title: 'Property Description',
    description: 'Generate high-converting listing copy automatically.',
    icon: 'home-variant-outline',
    color: '#0BA0B2',
  },
  {
    id: 'social-media',
    title: 'Social Media Posts',
    description: 'Adapt listings for Instagram, LinkedIn, and Facebook.',
    icon: 'cellphone-text',
    color: '#3B82F6',
  },
  {
    id: 'email-templates',
    title: 'Email Templates',
    description: 'Craft follow-ups, newsletters, and just-listed alerts.',
    icon: 'email-variant',
    color: '#8B5CF6',
  },
  {
    id: 'image-enhancer',
    title: 'Image Enhancer',
    description: 'AI-driven virtual staging and quality upscaling.',
    icon: 'image-multiple-outline',
    color: '#10B981',
  },
  {
    id: 'presentation-builder',
    title: 'Presentation Builder',
    description: 'Dynamic listing presentations and CMA decks.',
    icon: 'chart-pie',
    color: '#EC4899',
  },
];

const INITIAL_ENTRIES = [
  {
    id: '1',
    title: 'Brentwood Luxury Suite',
    context: '123 Business Way',
    type: 'LISTING DESCRIPTION',
    typeColor: '#F0FDFA',
    typeTextColor: '#0D9488',
    date: 'Jan 18, 2026',
    usage: 12,
  },
  {
    id: '2',
    title: 'Malibu Villa Highlights',
    context: '88 Gold Coast',
    type: 'INSTAGRAM CAROUSEL',
    typeColor: '#F0F9FF',
    typeTextColor: '#0284C7',
    date: 'Jan 16, 2026',
    usage: 45,
  },
  {
    id: '3',
    title: 'Pasadena Monthly Update',
    context: 'Multiple Properties',
    type: 'NEWSLETTER',
    typeColor: '#FDF4FF',
    typeTextColor: '#A21CAF',
    date: 'Jan 12, 2026',
    usage: 89,
  },
  {
    id: '4',
    title: 'Draft: Modern Loft',
    context: '900 Ocean Blvd',
    type: 'EMAIL SEQUENCE',
    typeColor: '#F8FAFC',
    typeTextColor: '#64748B',
    date: 'Jan 10, 2026',
    usage: 0,
  },
];

export default function AiContentScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State for content library
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [search, setSearch] = useState('');



  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Content',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEntries((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };


  const filteredEntries = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.context.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.backgroundGradient as any}
        style={[styles.background, { paddingTop: insets.top }]}
      >
        <PageHeader
          title="AI Sweep"
          subtitle="Your 24/7 autonomous marketing engine for the modern real estate professional."
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Featured Virtual Staging Tool */}
          <Pressable 
            style={styles.featuredCard} 
            onPress={() => router.push('/(main)/ai-content/virtual-staging')}
          >
            <LinearGradient
              colors={['#083344', '#0891B2']} 
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredRight}>
                {/* Side-by-Side Images */}
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' }} 
                  style={styles.halfImage} 
                />
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80' }} 
                  style={styles.halfImage} 
                />
                <View style={styles.labelBefore}><Text style={styles.labelText}>Before</Text></View>
                <View style={styles.labelAfter}><Text style={styles.labelText}>After</Text></View>
              </View>

              <View style={styles.featuredLeft}>
                <Text style={styles.featuredBadge}>Premiere Innovation</Text>
                <Text style={styles.featuredTitle}>Virtual Staging</Text>
                <Text style={styles.featuredSubtitle}>
                  Turn cold, empty architectural shells into warm, hyper-realistic spaces.
                </Text>
                <View style={styles.tryBtn}>
                  <Text style={styles.tryBtnText}>Try this</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Content Tools Section */}
          <Text style={styles.sectionTitle}>Content Tools</Text>
          <View style={styles.toolsGrid}>
            {CONTENT_TOOLS.map((tool) => (
              <Pressable
                key={tool.id}
                style={styles.toolCard}
                onPress={() => {
                  if (tool.id === 'property-description') router.push('/(main)/ai-content/property-description');
                  else if (tool.id === 'social-media') router.push('/(main)/ai-content/social-media-posts');
                  else if (tool.id === 'email-templates') router.push('/(main)/ai-content/email-templates');
                  else if (tool.id === 'image-enhancer') router.push('/(main)/ai-content/image-enhancer');
                  else if (tool.id === 'presentation-builder') router.push('/(main)/ai-content/presentation-builder');
                }}
              >
                <View style={[styles.toolIconBox, { backgroundColor: `${tool.color}10` }]}>
                  <MaterialCommunityIcons name={tool.icon as any} size={22} color={tool.color} />
                </View>
                <View style={styles.toolContent}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolDesc} numberOfLines={2}>{tool.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Library Section */}
          <View style={styles.libraryHeader}>
            <Text style={styles.sectionTitle}>Content Library</Text>
            <View style={styles.searchBar}>
              <MaterialCommunityIcons name="magnify" size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your library..."
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>

          <View style={styles.libraryList}>
            {filteredEntries.map((item) => (
              <View key={item.id} style={styles.contentCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardContext}>{item.context}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <Pressable
                      onPress={() => router.push('/(main)/ai-content/property-description')}
                      style={styles.iconActionBtn}
                    >
                      <MaterialCommunityIcons name="pencil-outline" size={18} color="#3B82F6" />
                    </Pressable>
                    <Pressable onPress={() => handleDelete(item.id)} style={styles.iconActionBtn}>
                      <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.cardMetadata}>
                  <View style={[styles.typeBadge, { backgroundColor: item.typeColor }]}>
                    <Text style={[styles.typeBadgeText, { color: item.typeTextColor }]}>{item.type}</Text>
                  </View>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </View>

                <View style={styles.usageContainer}>
                  <View style={styles.usageInfo}>
                    <View style={styles.usageBarBg}>
                      <View style={[styles.usageBarFill, { width: `${item.usage}%` }]} />
                    </View>
                    <Text style={styles.usageCount}>{item.usage}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>


    </View>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.textPrimary,
      marginBottom: 16,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    featuredCard: {
      borderRadius: 24,
      overflow: 'hidden',
      marginBottom: 32,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 6,
    },
    featuredGradient: {
      flexDirection: 'column',
      padding: 16,
    },
    featuredLeft: {
      marginTop: 20,
    },
    featuredBadge: {
      color: '#E0F2FE',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
      marginBottom: 6,
      textTransform: 'uppercase',
    },
    featuredTitle: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '900',
      marginBottom: 8,
    },
    featuredSubtitle: {
      color: '#E0F2FE',
      fontSize: 12,
      lineHeight: 18,
      marginBottom: 16,
    },
    tryBtn: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      alignSelf: 'flex-start',
    },
    tryBtnText: {
      color: '#0891B2',
      fontWeight: '900',
      fontSize: 12,
    },
    featuredRight: {
      width: '100%',
      aspectRatio: 1.4,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      position: 'relative',
      flexDirection: 'row',
    },
    halfImage: {
      width: '50%',
      height: '100%',
      resizeMode: 'cover',
    },
    afterImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    labelBefore: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'rgba(0,0,0,0.4)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    labelAfter: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: '#0891B2',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    labelText: {
      color: '#FFFFFF',
      fontSize: 8,
      fontWeight: '900',
    },
    toolsGrid: {
      marginBottom: 32,
      gap: 12,
    },
    toolCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 16,
      shadowColor: colors.cardShadowColor,
      shadowOpacity: 0.04,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    toolIconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    toolContent: { flex: 1 },
    toolTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    toolDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    libraryHeader: {
      marginBottom: 16,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 44,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    libraryList: { gap: 16 },
    contentCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      shadowColor: colors.cardShadowColor,
      shadowOpacity: 0.03,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 1,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    cardInfo: { flex: 1 },
    cardTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    cardContext: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    cardActions: {
      flexDirection: 'row',
      gap: 8,
    },
    iconActionBtn: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    cardMetadata: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    typeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    typeBadgeText: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    cardDate: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '700',
    },
    usageContainer: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.cardBorder,
    },
    usageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    usageBarBg: {
      flex: 1,
      height: 6,
      backgroundColor: colors.surfaceSoft,
      borderRadius: 3,
      marginRight: 12,
      overflow: 'hidden',
    },
    usageBarFill: {
      height: '100%',
      backgroundColor: colors.accentTeal,
    },
    usageCount: {
      fontSize: 12,
      fontWeight: '900',
      color: colors.textPrimary,
      minWidth: 24,
      textAlign: 'right',
    },
  });
};
