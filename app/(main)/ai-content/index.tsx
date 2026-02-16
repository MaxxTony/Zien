import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CONTENT_TOOLS = [
  {
    id: 'property-description',
    title: 'Property Description',
    description: 'Generate high-converting listing copy automatically.',
    icon: 'home-city-outline',
    color: '#0BA0B2',
  },
  {
    id: 'social-media',
    title: 'Social Media Posts',
    description: 'Adapt listings for Instagram, LinkedIn, and Facebook.',
    icon: 'cellphone',
    color: '#F59E0B',
  },
  {
    id: 'email-templates',
    title: 'Email Templates',
    description: 'Craft follow-ups, newsletters, and just-listed alerts.',
    icon: 'email-outline',
    color: '#3B82F6',
  },
  {
    id: 'neighborhood-guide',
    title: 'Neighborhood Guide',
    description: 'Hyper-local community insights and market trends.',
    icon: 'map-marker-radius-outline',
    color: '#8B5CF6',
  },
  {
    id: 'image-enhancer',
    title: 'Image Enhancer',
    description: 'AI-driven virtual staging and quality upscaling.',
    icon: 'image-auto-adjust',
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
    typeColor: '#E0F2FE',
    typeTextColor: '#0369A1',
    date: 'Jan 18, 2026',
    usage: 12,
  },
  {
    id: '2',
    title: 'Ocean View Condo',
    context: '88 Gold Coast',
    type: 'INSTAGRAM CAROUSEL',
    typeColor: '#DCFCE7',
    typeTextColor: '#15803D',
    date: 'Jan 17, 2026',
    usage: 68,
  },
  {
    id: '3',
    title: 'Q1 Market Update',
    context: 'Multiple Properties',
    type: 'NEWSLETTER',
    typeColor: '#F3E8FF',
    typeTextColor: '#7E22CE',
    date: 'Jan 15, 2026',
    usage: 24,
  },
  {
    id: '4',
    title: 'Draft: Modern Loft',
    context: '900 Ocean Blvd',
    type: 'EMAIL SEQUENCE',
    typeColor: '#F1F5F9',
    typeTextColor: '#475569',
    date: 'Jan 10, 2026',
    usage: 0,
  },
];

export default function AiContentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State for content list
  const [entries, setEntries] = useState(INITIAL_ENTRIES);

  // State for Edit Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContext, setEditContext] = useState('');

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

  const handleEdit = (item: typeof INITIAL_ENTRIES[0]) => {
    setEditId(item.id);
    setEditTitle(item.title);
    setEditContext(item.context);
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (!editId) return;
    setEntries((prev) =>
      prev.map((item) =>
        item.id === editId
          ? { ...item, title: editTitle, context: editContext }
          : item
      )
    );
    setModalVisible(false);
    setEditId(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F0F6FA', '#E0ECF4', '#F4F0EE']}
        style={[styles.background, { paddingTop: insets.top }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI Content Suite</Text>
            <Text style={styles.headerSubtitle}>
              Your 24/7 autonomous marketing engine.
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Action */}
          <Pressable
            style={styles.createButton}
            onPress={() => router.push('/(main)/ai-content/create')}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create New Content</Text>
          </Pressable>

          {/* Tools Grid */}
          <Text style={styles.sectionTitle}>Content Tools</Text>
          <View style={styles.grid}>
            {CONTENT_TOOLS.map((tool) => (
              <Pressable
                key={tool.id}
                style={styles.toolCard}
                onPress={() => {
                  if (tool.id === 'property-description') {
                    router.push('/(main)/ai-content/property-description');
                  } else if (tool.id === 'social-media') {
                    router.push('/(main)/ai-content/social-media-posts');
                  } else if (tool.id === 'email-templates') {
                    router.push('/(main)/ai-content/email-templates');
                  } else if (tool.id === 'neighborhood-guide') {
                    router.push('/(main)/ai-content/neighborhood-guide');
                  } else if (tool.id === 'image-enhancer') {
                    router.push('/(main)/ai-content/image-enhancer');
                  } else if (tool.id === 'presentation-builder') {
                    router.push('/(main)/ai-content/presentation-builder');
                  }
                }}
              >
                <View style={styles.toolHeader}>
                  <View style={[styles.toolIcon, { backgroundColor: `${tool.color}15` }]}>
                    <MaterialCommunityIcons name={tool.icon as any} size={22} color={tool.color} />
                  </View>
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#94A3B8" />
                </View>
                <Text style={styles.toolCardTitle}>{tool.title}</Text>
                <Text style={styles.toolCardDesc} numberOfLines={3}>
                  {tool.description}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Library Section */}
          <Text style={styles.sectionTitle}>Content Library</Text>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color="#64748B"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your library..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.libraryList}>
            {entries.map((item) => (
              <View key={item.id} style={styles.libraryCard}>
                <View style={styles.cardRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Pressable>
                    <MaterialCommunityIcons name="dots-horizontal" size={20} color="#94A3B8" />
                  </Pressable>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.itemContext}>
                    <MaterialCommunityIcons name="map-marker-outline" size={12} color="#64748B" />{' '}
                    {item.context}
                  </Text>
                </View>

                <View style={[styles.cardRow, { marginTop: 8 }]}>
                  <View style={[styles.badge, { backgroundColor: item.typeColor }]}>
                    <Text style={[styles.badgeText, { color: item.typeTextColor }]}>
                      {item.type}
                    </Text>
                  </View>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>

                <View style={styles.divider} />

                <View style={[styles.cardRow, { justifyContent: 'space-between' }]}>
                  <View style={styles.usageContainer}>
                    <Text style={styles.usageLabel}>Usage</Text>
                    <View style={styles.usageBarBg}>
                      <View
                        style={[
                          styles.usageBarFill,
                          { width: `${Math.min(item.usage, 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.usageValue}>{item.usage}</Text>
                  </View>
                  <View style={styles.actions}>
                    <Pressable style={styles.textBtn} onPress={() => handleEdit(item)}>
                      <Text style={[styles.textBtnTitle, { color: '#0BA0B2' }]}>Edit</Text>
                    </Pressable>
                    <Pressable style={styles.textBtn} onPress={() => handleDelete(item.id)}>
                      <Text style={[styles.textBtnTitle, { color: '#EF4444' }]}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Edit Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Content</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#64748B" />
                </Pressable>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Content Title</Text>
                <TextInput
                  style={styles.input}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Ex. Brentwood Luxury Suite"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Property / Context</Text>
                <TextInput
                  style={styles.input}
                  value={editContext}
                  onChangeText={setEditContext}
                  placeholder="Ex. 123 Business Way"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={saveEdit}
                >
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  createButton: {
    backgroundColor: '#0B2D3E',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#0B2D3E',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 32,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  toolCard: {
    width: (SCREEN_WIDTH - 40 - 12) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    minHeight: 140,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 6,
    lineHeight: 20,
  },
  toolCardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#0B2D3E',
  },
  libraryList: {
    gap: 16,
  },
  libraryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  itemContext: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemDate: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  usageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  usageBarBg: {
    width: 60,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  usageBarFill: {
    height: '100%',
    backgroundColor: '#0B2D3E',
    borderRadius: 3,
  },
  usageValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textBtn: {
    paddingVertical: 4,
  },
  textBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  saveBtn: {
    backgroundColor: '#0B2D3E',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
