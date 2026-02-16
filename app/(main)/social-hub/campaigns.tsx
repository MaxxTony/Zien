import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Status = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DRAFT';

type Campaign = {
  id: string;
  name: string;
  type: string;
  posts: string;
  platforms: string[];
  engagement: string;
  status: Status;
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Malibu Waterfront Launch',
    type: 'New Listing',
    posts: '8',
    platforms: ['instagram', 'facebook', 'linkedin'],
    engagement: '12.4k',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'January Open House Blitz',
    type: 'Open House',
    posts: '12',
    platforms: ['instagram', 'facebook'],
    engagement: '8.1k',
    status: 'COMPLETED',
  },
  {
    id: '3',
    name: 'Market Leader Awareness',
    type: 'Branding',
    posts: '4',
    platforms: ['linkedin'],
    engagement: '-',
    status: 'DRAFT',
  },
  {
    id: '4',
    name: 'Spring Buyers Guide',
    type: 'Educational',
    posts: '6',
    platforms: ['instagram', 'tiktok'],
    engagement: '2.3k',
    status: 'PAUSED',
  },
];

const TABS = ['All', 'Active', 'Paused', 'Completed', 'Draft'];

const PLATFORM_ICONS: Record<string, any> = {
  instagram: 'instagram',
  facebook: 'facebook',
  linkedin: 'linkedin',
  tiktok: 'music-note',
};

const AVAILABLE_PLATFORMS = ['instagram', 'facebook', 'linkedin', 'tiktok'];

function StatusPill({ status }: { status: Status }) {
  const isPaused = status === 'PAUSED';
  const isActive = status === 'ACTIVE';
  const isCompleted = status === 'COMPLETED';
  const isDraft = status === 'DRAFT';

  let bg = '#E2E8F0';
  let text = '#64748B';

  if (isActive) {
    bg = '#0B2D3E';
    text = '#FFFFFF';
  } else if (isCompleted) {
    bg = '#E8EEF6';
    text = '#0B2D3E';
  } else if (isDraft) {
    bg = '#F1F5F9';
    text = '#64748B';
  } else if (isPaused) {
    bg = '#FFFFFF';
    text = '#0BA0B2';
  }

  return (
    <View
      style={[
        styles.statusPill,
        { backgroundColor: isPaused ? 'transparent' : bg },
        isPaused && { borderWidth: 1, borderColor: '#0BA0B2' }
      ]}>
      <Text
        style={[
          styles.statusText,
          { color: isPaused ? '#0BA0B2' : text }
        ]}>
        {status}
      </Text>
    </View>
  );
}

export default function CampaignsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('');
  const [formStatus, setFormStatus] = useState<Status>('DRAFT');
  const [formPlatforms, setFormPlatforms] = useState<string[]>([]);


  const filteredCampaigns = campaigns.filter(c => {
    const matchesTab = activeTab === 'All' || c.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormType('');
    setFormStatus('DRAFT');
    setFormPlatforms([]);
    setModalVisible(true);
  };

  const handleOpenEdit = (c: Campaign) => {
    setEditingId(c.id);
    setFormName(c.name);
    setFormType(c.type);
    setFormStatus(c.status);
    setFormPlatforms(c.platforms);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Campaign",
      "Are you sure? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setCampaigns(prev => prev.filter(c => c.id !== id));
          }
        }
      ]
    );
  };

  const handleSave = () => {
    if (!formName.trim() || !formType.trim()) {
      Alert.alert("Missing Fields", "Please enter a campaign name and type.");
      return;
    }

    if (editingId) {
      // Edit existing
      setCampaigns(prev => prev.map(c => {
        if (c.id === editingId) {
          return {
            ...c,
            name: formName,
            type: formType,
            status: formStatus,
            platforms: formPlatforms,
          };
        }
        return c;
      }));
    } else {
      // Create new
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: formName,
        type: formType,
        posts: '0', // default
        engagement: '-', // default
        status: formStatus,
        platforms: formPlatforms,
      };
      setCampaigns(prev => [newCampaign, ...prev]);
    }
    setModalVisible(false);
  };

  const togglePlatform = (p: string) => {
    if (formPlatforms.includes(p)) {
      setFormPlatforms(prev => prev.filter(item => item !== p));
    } else {
      setFormPlatforms(prev => [...prev, p]);
    }
  };

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
          <Text style={styles.title}>Campaigns</Text>
          <Text style={styles.subtitle}>
            Organize your social strategy into goal-oriented campaigns.
          </Text>
        </View>
        <Pressable style={styles.createBtnSmall} onPress={handleOpenCreate}>
          <MaterialCommunityIcons name="plus" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.controlsSection}>
        {/* Search */}
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search campaigns..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          style={styles.tabsScroll}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>

        {/* Campaign List */}
        <View style={styles.list}>
          {filteredCampaigns.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.campaignName}>{c.name}</Text>
                  <Text style={styles.campaignType}>{c.type}</Text>
                </View>
                <StatusPill status={c.status} />
              </View>

              <View style={styles.divider} />

              <View style={styles.cardStatsRow}>
                {/* Posts */}
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>POSTS</Text>
                  <Text style={styles.statValue}>{c.posts}</Text>
                </View>

                {/* Engagement */}
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>ENGAGEMENT</Text>
                  <Text style={styles.statValue}>{c.engagement}</Text>
                </View>

                {/* Platforms */}
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>PLATFORMS</Text>
                  <View style={styles.platformRow}>
                    {c.platforms.map(p => (
                      <MaterialCommunityIcons
                        key={p}
                        name={PLATFORM_ICONS[p] || 'web'}
                        size={16}
                        color="#5B6B7A"
                      />
                    ))}
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.cardActions}>
                <View style={styles.actionIcons}>
                  <Pressable style={styles.iconBtn} hitSlop={8} onPress={() => Alert.alert("Analytics", "Analytics view coming soon!")}>
                    <MaterialCommunityIcons name="chart-bar" size={20} color="#5B6B7A" />
                  </Pressable>
                  <Pressable style={styles.iconBtn} hitSlop={8} onPress={() => handleOpenEdit(c)}>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#5B6B7A" />
                  </Pressable>
                  <Pressable style={styles.iconBtn} hitSlop={8} onPress={() => handleDelete(c.id)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
          {filteredCampaigns.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No campaigns found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit/Create Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit Campaign' : 'New Campaign'}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={12}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Campaign Name</Text>
              <TextInput
                style={styles.input}
                value={formName}
                onChangeText={setFormName}
                placeholder="e.g. Summer Sale"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.label}>Campaign Type</Text>
              <TextInput
                style={styles.input}
                value={formType}
                onChangeText={setFormType}
                placeholder="e.g. New Listing, Branding"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.label}>Status</Text>
              <View style={styles.pillRow}>
                {(['ACTIVE', 'PAUSED', 'DRAFT', 'COMPLETED'] as Status[]).map(s => (
                  <Pressable
                    key={s}
                    style={[styles.optionPill, formStatus === s && styles.optionPillSelected]}
                    onPress={() => setFormStatus(s)}
                  >
                    <Text style={[styles.optionPillText, formStatus === s && styles.optionPillTextSelected]}>
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Platforms</Text>
              <View style={styles.pillRow}>
                {AVAILABLE_PLATFORMS.map(p => {
                  const selected = formPlatforms.includes(p);
                  return (
                    <Pressable
                      key={p}
                      style={[styles.optionPill, selected && styles.optionPillSelected]}
                      onPress={() => togglePlatform(p)}
                    >
                      <MaterialCommunityIcons
                        name={PLATFORM_ICONS[p] || 'web'}
                        size={16}
                        color={selected ? '#FFFFFF' : '#64748B'}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[styles.optionPillText, selected && styles.optionPillTextSelected]}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ height: 20 }} />

              <Pressable style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Campaign</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  headerCenter: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#5B6B7A',
    fontWeight: '600',
    marginTop: 2,
  },
  createBtnSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0B2D3E',
  },
  tabsScroll: { flexGrow: 0 },
  tabsContent: { gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0BA0B2',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6B7A',
  },
  tabTextActive: {
    color: '#0BA0B2',
    fontWeight: '700',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  list: { gap: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderInfo: { flex: 1, paddingRight: 8 },
  campaignName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 4,
  },
  campaignType: {
    fontSize: 13,
    color: '#5B6B7A',
    fontWeight: '600',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginBottom: 12,
  },
  cardStatsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
    paddingTop: 10,
    marginTop: 4,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#5B6B7A',
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', // for center popup, or 'flex-end' for bottom sheet
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0B2D3E',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  optionPillSelected: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  optionPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  optionPillTextSelected: {
    color: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: '#0BA0B2',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  }
});

