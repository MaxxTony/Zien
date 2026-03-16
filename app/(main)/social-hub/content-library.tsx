import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'ai-generated', label: 'AI Generated' },
  { id: 'property', label: 'Property' },
  { id: 'open-house', label: 'Open House' },
  { id: 'custom', label: 'Custom' },
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
    tag: 'CUSTOM',
    title: 'First Time Buyer Tips',
    platform: 'Facebook',
    lastUsed: 'Dec 28',
    usage: 8,
    image: { uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  },
];

function DeleteConfirmationModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.deleteOverlay}>
        <View style={styles.deleteContainer}>
          <View style={styles.deleteIconWrap}>
            <View style={styles.deleteIconCircle}>
              <MaterialCommunityIcons name="trash-can-outline" size={32} color="#EF4444" />
            </View>
          </View>

          <Text style={styles.deleteTitle}>Delete Asset?</Text>
          <Text style={styles.deleteSubtitle}>
            This action cannot be undone. This asset will be permanently removed from your content library.
          </Text>

          <View style={styles.deleteActions}>
            <Pressable style={styles.deleteCancelBtn} onPress={onClose}>
              <Text style={styles.deleteCancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.deleteConfirmBtn} onPress={onConfirm}>
              <Text style={styles.deleteConfirmBtnText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ContentCardItem({
  item,
  width,
  onDelete,
  onEdit
}: {
  item: ContentCard;
  width: number;
  onDelete: (id: string) => void;
  onEdit: (item: ContentCard) => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.cardImageWrap}>
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardTag}>
          <Text style={styles.cardTagText}>{item.tag}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>

        <Text style={styles.metaText}>
          {item.platform} • Last used {item.lastUsed}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.usageLabel}>Used {item.usage} times</Text>

          <View style={styles.cardActions}>
            <Pressable style={styles.actionIconButton} onPress={() => onEdit(item)}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.textMuted} />
            </Pressable>
            <Pressable style={styles.actionIconButton}>
              <MaterialCommunityIcons name="content-copy" size={18} color={colors.textMuted} />
            </Pressable>
            <Pressable style={styles.actionIconButton}>
              <MaterialCommunityIcons name="share-variant-outline" size={18} color={colors.textMuted} />
            </Pressable>
            <Pressable style={styles.actionIconButton} onPress={() => onDelete(item.id)}>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function ImageSourcePicker({
  visible,
  onClose,
  onSelect
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (source: 'camera' | 'library') => void
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.sourceOverlay} onPress={onClose}>
        <View style={styles.sourceContainer}>
          <Text style={styles.sourceTitle}>Upload Content</Text>
          <View style={styles.sourceGrid}>
            <Pressable
              style={styles.sourceBtn}
              onPress={() => { onSelect('camera'); onClose(); }}
            >
              <View style={[styles.sourceIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <MaterialCommunityIcons name="camera" size={28} color="#3B82F6" />
              </View>
              <Text style={styles.sourceLabel}>Camera</Text>
            </Pressable>
            <Pressable
              style={styles.sourceBtn}
              onPress={() => { onSelect('library'); onClose(); }}
            >
              <View style={[styles.sourceIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <MaterialCommunityIcons name="image-multiple" size={28} color="#22C55E" />
              </View>
              <Text style={styles.sourceLabel}>Gallery</Text>
            </Pressable>
          </View>
          <Pressable style={styles.sourceCancel} onPress={onClose}>
            <Text style={styles.sourceCancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function SelectionDropdown({
  visible,
  options,
  selectedValue,
  onSelect,
  onClose,
  top,
  left,
  width,
}: {
  visible: boolean;
  options: string[];
  selectedValue: string;
  onSelect: (val: string) => void;
  onClose: () => void;
  top: number;
  left: number;
  width: number;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.dropdownOverlay} onPress={onClose}>
        <View style={[styles.dropdownMenu, { top, left, width }]}>
          {options.map((option) => (
            <Pressable
              key={option}
              style={styles.dropdownOption}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <View style={styles.dropdownOptionContent}>
                {selectedValue === option && (
                  <MaterialCommunityIcons name="check" size={16} color="#FFF" style={{ marginRight: 8 }} />
                )}
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

function ContentFormModal({
  visible,
  onClose,
  onSave,
  editingItem
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Partial<ContentCard>) => void;
  editingItem?: ContentCard | null;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('Property');
  const [platform, setPlatform] = useState('Instagram');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sourcePickerVisible, setSourcePickerVisible] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setAssetName(editingItem.title);
      setCategory(editingItem.tag.charAt(0) + editingItem.tag.slice(1).toLowerCase());
      setPlatform(editingItem.platform);
      setSelectedImage(typeof editingItem.image === 'object' ? editingItem.image.uri : null);
    } else {
      setAssetName('');
      setCategory('Property');
      setPlatform('Instagram');
      setSelectedImage(null);
    }
  }, [editingItem, visible]);

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'platform' | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const CATEGORIES = ['AI Generated', 'Property', 'Open House', 'Custom'];
  const PLATFORMS_LIST = ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'Multi-Platform'];

  const categoryRef = useRef<View>(null);
  const platformRef = useRef<View>(null);

  const handleOpenDropdown = (type: 'category' | 'platform', ref: React.RefObject<View | null>) => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownPos({ top: pageY + height + 5, left: pageX, width });
      setActiveDropdown(type);
    });
  };

  const handleImagePick = async (source: 'camera' | 'library') => {
    let result;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera access to take a photo.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need gallery access to pick a photo.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    }

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleInternalSave = () => {
    onSave({
      title: assetName,
      tag: category.toUpperCase(),
      platform: platform,
      image: selectedImage ? { uri: selectedImage } : null,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.modalBg, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose} style={styles.modalCloseBtn}>
            <MaterialCommunityIcons name="close" size={20} color="#0B2341" />
          </Pressable>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Upload Area */}
            <Pressable
              style={styles.uploadArea}
              onPress={() => setSourcePickerVisible(true)}
            >
              <View style={styles.imagePreviewWrap}>
                {selectedImage ? (
                  <>
                    <Image source={{ uri: selectedImage }} style={styles.previewImg} />
                    <Pressable
                      style={styles.previewCloseBtn}
                      onPress={() => setSelectedImage(null)}
                    >
                      <MaterialCommunityIcons name="close" size={14} color="#0B2341" />
                    </Pressable>
                  </>
                ) : (
                  <View style={[styles.uploadPlaceholder, { height: 180, width: '100%' }]}>
                    <View style={styles.uploadIconCircle}>
                      <MaterialCommunityIcons name="plus" size={32} color="#0B2341" />
                    </View>
                    <Text style={styles.uploadTitle}>Upload Content Visual</Text>
                    <Text style={styles.uploadHint}>Recommended: 1080×1080px (PNG, JPG)</Text>
                  </View>
                )}
              </View>
            </Pressable>

            {/* Form Content */}
            <View style={styles.formBody}>
              <Text style={styles.modalMainTitle}>{editingItem ? 'Edit Content Library' : 'Create Library Content'}</Text>
              <Text style={styles.modalSubTitle}>
                {editingItem ? 'Modify the selected high-performing social asset.' : 'Add a new piece of high-performing content to your vault.'}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Asset Identity</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Modern Exterior - Bel Air"
                  value={assetName}
                  onChangeText={setAssetName}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Category Type</Text>
                  <Pressable
                    ref={categoryRef}
                    style={styles.dropdownWrap}
                    onPress={() => handleOpenDropdown('category', categoryRef)}
                  >
                    <Text style={styles.dropdownValue}>{category}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2341" />
                  </Pressable>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Primary Platform</Text>
                  <Pressable
                    ref={platformRef}
                    style={styles.dropdownWrap}
                    onPress={() => handleOpenDropdown('platform', platformRef)}
                  >
                    <Text style={styles.dropdownValue}>{platform}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2341" />
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Buttons at Bottom */}
          <View style={[styles.modalActions, {
            paddingBottom: Math.max(insets.bottom, 24),
            paddingHorizontal: 24,
            paddingTop: 16,
            backgroundColor: colors.cardBackground,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder
          }]}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={handleInternalSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </View>
        </View>

        {/* Custom Dropdown Menus */}
        <SelectionDropdown
          visible={activeDropdown === 'category'}
          options={CATEGORIES}
          selectedValue={category}
          onSelect={setCategory}
          onClose={() => setActiveDropdown(null)}
          {...dropdownPos}
        />
        <SelectionDropdown
          visible={activeDropdown === 'platform'}
          options={PLATFORMS_LIST}
          selectedValue={platform}
          onSelect={setPlatform}
          onClose={() => setActiveDropdown(null)}
          {...dropdownPos}
        />

        <ImageSourcePicker
          visible={sourcePickerVisible}
          onClose={() => setSourcePickerVisible(false)}
          onSelect={handleImagePick}
        />
      </View>
    </Modal>
  );
}

export default function ContentLibraryScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentCard | null>(null);
  const [contentList, setContentList] = useState(ALL_CONTENT);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { width } = Dimensions.get('window');
  const padding = 20;
  const cardWidth = width - padding * 2;

  const filteredCards = useMemo(() => {
    if (activeTab === 'all') return contentList;
    const tagMap: Record<string, string> = {
      'ai-generated': 'AI GENERATED',
      'property': 'PROPERTY',
      'open-house': 'OPEN HOUSE',
      'custom': 'CUSTOM',
    };
    const targetTag = tagMap[activeTab];
    return contentList.filter(c => c.tag === targetTag);
  }, [activeTab, contentList]);

  const handleDelete = () => {
    if (itemToDelete) {
      setContentList(prev => prev.filter(item => item.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const handleSave = (data: Partial<ContentCard>) => {
    if (editingItem) {
      // Edit mode
      setContentList(prev => prev.map(item =>
        item.id === editingItem.id ? { ...item, ...data } as ContentCard : item
      ));
    } else {
      // Create mode
      const newItem: ContentCard = {
        id: Math.random().toString(36).substr(2, 9),
        usage: 0,
        lastUsed: 'Just now',
        ...data,
      } as ContentCard;
      setContentList(prev => [newItem, ...prev]);
    }
    setEditingItem(null);
    setModalVisible(false);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const openEditModal = (item: ContentCard) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>

      <PageHeader
        title="Content Library"
        subtitle="Manage and reuse your high-performing social assets."
        onBack={() => router.back()}
        rightIcon="plus"
        onRightPress={openCreateModal}
      />

      <ContentFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editingItem={editingItem}
      />

      <DeleteConfirmationModal
        visible={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
      />

      <View style={styles.tabsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsLayout}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredCards.map((item) => (
            <ContentCardItem
              key={item.id}
              item={item}
              width={cardWidth}
              onDelete={(id) => setItemToDelete(id)}
              onEdit={openEditModal}
            />
          ))}
        </View>
        {filteredCards.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="image-search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No assets found in this category.</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
  background: { flex: 1 },
  tabsSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  tabsLayout: {
    paddingRight: 20,
    gap: 24,
  },
  tabItem: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.surfaceIcon,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 0, // Cards in image look flat or very slightly rounded
    overflow: 'hidden',
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 12,
  },
  cardImageWrap: {
    height: 200,
    backgroundColor: colors.surfaceSoft,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.accentTeal,
  },
  cardTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 16,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  usageLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionIconButton: {
    padding: 6,
  },

  emptyState: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },

  // Modal Styles
  modalBg: { flex: 1, backgroundColor: colors.cardBackground },
  modalHeader: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalScroll: { flex: 1 },
  modalContent: { paddingBottom: 20 },
  uploadArea: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  uploadPlaceholder: {
    height: 240,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  uploadTitle: { fontSize: 17, fontWeight: '900', color: colors.textPrimary, marginBottom: 4 },
  uploadHint: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },

  imagePreviewWrap: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImg: { width: '100%', height: '100%' },
  previewCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  formBody: { paddingHorizontal: 24 },
  modalMainTitle: { fontSize: 26, fontWeight: '900', color: colors.textPrimary, marginBottom: 8 },
  modalSubTitle: { fontSize: 15, color: colors.textSecondary, fontWeight: '600', marginBottom: 32, lineHeight: 22 },

  inputGroup: { marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginBottom: 10 },
  textInput: {
    height: 58,
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#0B2341',
    paddingHorizontal: 20,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  row: { flexDirection: 'row', gap: 16 },
  dropdownWrap: {
    height: 58,
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  dropdownValue: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  saveBtn: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '900', color: '#FFF' },

  // Dropdown Styles
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: 'rgba(74, 69, 66, 0.95)', // Dark brown/gray translucent
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Source Picker Styles
  sourceOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 35, 65, 0.4)',
    justifyContent: 'flex-end',
  },
  sourceContainer: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sourceTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  sourceGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 32,
  },
  sourceBtn: {
    alignItems: 'center',
    gap: 12,
  },
  sourceIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sourceCancel: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  // Delete Modal Styles
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 35, 65, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  deleteContainer: {
    backgroundColor: colors.cardBackground,
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  deleteIconWrap: {
    marginBottom: 20,
  },
  deleteIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  deleteSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  deleteConfirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  });
}
