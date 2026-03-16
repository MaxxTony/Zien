import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type Status = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DRAFT';

type Campaign = {
  id: string;
  name: string;
  platform: string;
  audience: string;
  launchDate: string;
  impressions: string;
  engagement: string;
  clicks: string;
  conversions: string;
  status: Status;
  // Advanced fields from new mockup
  audienceStrategy?: string;
  templateArchitecture?: string;
  publishSetting?: 'NOW' | 'SCHEDULE';
  aiOptimizationEnabled?: boolean;
  captionA?: string;
  captionB?: string;
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Luxury Malibu - Spring Launch',
    platform: 'instagram',
    audience: 'CALIFORNIA HIGH-NET-WORTH',
    launchDate: 'Feb 12, 2026',
    impressions: '24k',
    engagement: '1.2k',
    clicks: '450',
    conversions: '18',
    status: 'ACTIVE',
    audienceStrategy: 'High Engagement (Top 10%)',
    templateArchitecture: 'Listing Showcase',
    publishSetting: 'NOW',
    aiOptimizationEnabled: true,
    captionA: 'Discover your dream villa in Malibu today...',
    captionB: 'Price drop alert! Iconic Malibu Waterfront now available...',
  },
  {
    id: '2',
    name: 'Open House Blitz - Weekend OH',
    platform: 'facebook',
    audience: 'LOCAL HOMEBUYERS',
    launchDate: 'Feb 05, 2026',
    impressions: '18.5k',
    engagement: '950',
    clicks: '280',
    conversions: '12',
    status: 'COMPLETED',
    audienceStrategy: 'All Followers',
    templateArchitecture: 'Open House Blitz',
  },
  {
    id: '3',
    name: 'Real Estate Market Insights',
    platform: 'linkedin',
    audience: 'PROFESSIONAL NETWORKS',
    launchDate: 'Jan 28, 2026',
    impressions: '12.2k',
    engagement: '640',
    clicks: '185',
    conversions: '5',
    status: 'COMPLETED',
    audienceStrategy: 'Geo-Targeted (Local Leads)',
    templateArchitecture: 'Market Insight Series',
  },
];

const AVAILABLE_PLATFORMS = ['instagram', 'facebook', 'linkedin', 'tiktok'];

const AUDIENCE_STRATEGIES = [
  'All Followers',
  'High Engagement (Top 10%)',
  'Lookalike Audience - Recent Buyers',
  'Geo-Targeted (Local Leads)',
  'Retargeting - Website Visitors',
];

const TEMPLATE_ARCHITECTURES = [
  'Listing Showcase',
  'Open House Blitz',
  'Market Insight Series',
  'Property Price Drop',
];

const PLATFORM_ICONS: Record<string, any> = {
  instagram: 'instagram',
  facebook: 'facebook',
  linkedin: 'linkedin',
  tiktok: 'music-note',
};

function StatusPill({ status }: { status: Status }) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const isActive = status === 'ACTIVE';
  const isCompleted = status === 'COMPLETED';

  let bg = '#F1F5F9';
  let text = '#475569';

  if (isActive) {
    bg = '#DCFCE7';
    text = '#15803D';
  } else if (isCompleted) {
    bg = '#F1F5F9';
    text = '#0B2341';
  } else if (status === 'PAUSED') {
    bg = '#FFFBEB';
    text = '#F59E0B';
  }

  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={[styles.statusText, { color: text }]}>
        {status}
      </Text>
    </View>
  );
}

export default function CampaignsScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [platformFilter, setPlatformFilter] = useState('All Platforms');
  const [search, setSearch] = useState('');
  const [platformDropdownVisible, setPlatformDropdownVisible] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [analyticsVisible, setAnalyticsVisible] = useState(false);
  const [analyticsCampaign, setAnalyticsCampaign] = useState<Campaign | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formAudience, setFormAudience] = useState('');
  const [formPlatform, setFormPlatform] = useState('instagram');
  const [formStatus, setFormStatus] = useState<Status>('DRAFT');
  const [formAudienceStrategy, setFormAudienceStrategy] = useState(AUDIENCE_STRATEGIES[0]);
  const [formTemplate, setFormTemplate] = useState(TEMPLATE_ARCHITECTURES[0]);
  const [formPublish, setFormPublish] = useState<'NOW' | 'SCHEDULE'>('NOW');
  const [formAiEnabled, setFormAiEnabled] = useState(true);
  const [formCaptionA, setFormCaptionA] = useState('');
  const [formCaptionB, setFormCaptionB] = useState('');

  // Custom Dropdown States
  const [audienceDropdownVisible, setAudienceDropdownVisible] = useState(false);
  const [templateDropdownVisible, setTemplateDropdownVisible] = useState(false);

  // Scheduling States
  const [formScheduledDate, setFormScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setFormScheduledDate(selectedDate);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesPlatform = platformFilter === 'All Platforms' || c.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.audience.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormAudience('');
    setFormPlatform('instagram');
    setFormStatus('DRAFT');
    setFormAudienceStrategy(AUDIENCE_STRATEGIES[0]);
    setFormTemplate(TEMPLATE_ARCHITECTURES[0]);
    setFormPublish('NOW');
    setFormAiEnabled(true);
    setFormCaptionA('');
    setFormCaptionB('');
    setFormScheduledDate(new Date());
    setModalVisible(true);
  };

  const handleOpenEdit = (c: Campaign) => {
    setEditingId(c.id);
    setFormName(c.name);
    setFormAudience(c.audience);
    setFormPlatform(c.platform);
    setFormStatus(c.status);
    setFormAudienceStrategy(c.audienceStrategy || AUDIENCE_STRATEGIES[0]);
    setFormTemplate(c.templateArchitecture || TEMPLATE_ARCHITECTURES[0]);
    setFormPublish(c.publishSetting || 'NOW');
    setFormAiEnabled(c.aiOptimizationEnabled ?? true);
    setFormCaptionA(c.captionA || '');
    setFormCaptionB(c.captionB || '');
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Campaign",
      "Are you sure you want to delete this campaign? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          style: "destructive",
          onPress: () => {
            setCampaigns(prev => prev.filter(c => c.id !== id));
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        if (c.status === 'ACTIVE') return { ...c, status: 'PAUSED' as Status };
        if (c.status === 'PAUSED') return { ...c, status: 'ACTIVE' as Status };
      }
      return c;
    }));
  };

  const handleSave = () => {
    if (!formName.trim()) {
      Alert.alert("Missing Fields", "Please enter a campaign name.");
      return;
    }

    const updatedData = {
      name: formName,
      platform: formPlatform,
      audience: formAudience || (formAudienceStrategy.toUpperCase()),
      status: formStatus,
      audienceStrategy: formAudienceStrategy,
      templateArchitecture: formTemplate,
      publishSetting: formPublish,
      aiOptimizationEnabled: formAiEnabled,
      captionA: formCaptionA,
      captionB: formCaptionB,
    };

    if (editingId) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === editingId) {
          return { ...c, ...updatedData };
        }
        return c;
      }));
    } else {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        launchDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        impressions: '0',
        engagement: '0',
        clicks: '0',
        conversions: '0',
        ...updatedData,
      };
      setCampaigns(prev => [newCampaign, ...prev]);
    }
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>

      <PageHeader
        title="Campaigns"
        subtitle="High-impact social audience targeting with AI-driven optimization."
        onBack={() => router.back()}
        rightIcon="plus"
        onRightPress={handleOpenCreate}
      />

      <View style={styles.controlsSection}>
        {/* Search */}
        <View style={styles.topControls}>
          <View style={styles.searchWrap}>
            <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search social campaigns or audiences..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.filterGroup}>
            <Pressable style={styles.filterBtn}>
              <MaterialCommunityIcons name="filter-variant" size={20} color="#0B2341" />
            </Pressable>
            <Pressable
              style={styles.platformSelector}
              onPress={() => setPlatformDropdownVisible(true)}
            >
              <Text style={styles.platformSelectorText}>
                {platformFilter === 'instagram' ? 'Instagram' :
                  platformFilter === 'facebook' ? 'Facebook' :
                    platformFilter === 'linkedin' ? 'LinkedIn' :
                      platformFilter === 'tiktok' ? 'TikTok' : platformFilter}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#0B2341" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>

        {/* Campaign List */}
        <View style={styles.list}>
          {filteredCampaigns.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.platformIconWrap}>
                  <MaterialCommunityIcons
                    name={PLATFORM_ICONS[c.platform] || 'web'}
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.platformName}>
                    {c.platform === 'linkedin' ? 'LinkedIn' :
                      c.platform === 'tiktok' ? 'TikTok' :
                        c.platform.charAt(0).toUpperCase() + c.platform.slice(1)}
                  </Text>
                </View>
                <StatusPill status={c.status} />
              </View>

              <Text style={styles.campaignName}>{c.name}</Text>

              <View style={styles.audienceSection}>
                <View style={styles.audienceTag}>
                  <Text style={styles.audienceTagText}>{c.audience}</Text>
                </View>
                <Text style={styles.launchDate}>{c.launchDate}</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>IMPRESSIONS</Text>
                  <Text style={styles.statValue}>{c.impressions}</Text>
                </View>
                <View style={[styles.statBox, { borderLeftWidth: 1, borderLeftColor: '#F1F5F9' }]}>
                  <Text style={styles.statLabel}>ENGAGEMENT</Text>
                  <Text style={styles.statValue}>{c.engagement}</Text>
                  <Text style={styles.statSubValue}>{c.clicks} clicks</Text>
                </View>
                <View style={[styles.statBox, { borderLeftWidth: 1, borderLeftColor: '#F1F5F9' }]}>
                  <Text style={styles.statLabel}>CONV.</Text>
                  <Text style={styles.statValue}>{c.conversions}</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <View style={styles.actionGroup}>
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => {
                      setAnalyticsCampaign(c);
                      setAnalyticsVisible(true);
                    }}
                  >
                    <MaterialCommunityIcons name="chart-bar" size={20} color={colors.textSecondary} />
                  </Pressable>
                  {(c.status === 'ACTIVE' || c.status === 'PAUSED') && (
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => handleToggleStatus(c.id)}
                    >
                      <MaterialCommunityIcons
                        name={c.status === 'ACTIVE' ? "pause" : "play"}
                        size={c.status === 'ACTIVE' ? 20 : 24}
                        color={c.status === 'ACTIVE' ? "#F59E0B" : "#22C55E"}
                      />
                    </Pressable>
                  )}
                  <Pressable style={styles.actionBtn} onPress={() => handleOpenEdit(c)}>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.textSecondary} />
                  </Pressable>
                  <Pressable style={styles.actionBtn} onPress={() => handleDelete(c.id)}>
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

      {/* Advanced Full Screen Edit Modal */}
      <Modal visible={modalVisible} transparent={false} animationType="slide">
        <View style={[styles.fullModalSub, { paddingTop: insets.top }]}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.fullModalContent}>

            <View style={styles.fullModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fullModalTitle}>{editingId ? 'Edit Campaign' : 'Create Campaign'}</Text>
                <Text style={styles.fullModalSubtitle}>
                  {editingId ? 'Refine your AI-powered social strategy.' : 'Launch a high-impact social audience strategy.'}
                </Text>
              </View>
              <View style={styles.headerActionRow}>
                {editingId && (
                  <Pressable
                    onPress={() => handleDelete(editingId)}
                    style={[styles.closeBtn, { backgroundColor: '#FFF1F2' }]}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color="#E11D48" />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.closeBtn}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#0B2341" />
                </Pressable>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.fullModalScroll}
            >
              <View style={styles.formSection}>
                <View style={styles.sectionTitleRow}>
                  <MaterialCommunityIcons name="flash-outline" size={20} color="#0BA0B2" />
                  <Text style={styles.sectionTitle}>Campaign</Text>
                </View>

                <Text style={styles.advancedLabel}>Campaign Name</Text>
                <TextInput
                  style={styles.advancedInput}
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="e.g. Luxury Malibu - Spring Launch"
                  placeholderTextColor="#94A3B8"
                />

                <Text style={styles.advancedLabel}>Primary Social Platform</Text>
                <View style={styles.advancedPlatformRow}>
                  {AVAILABLE_PLATFORMS.map(p => {
                    const selected = formPlatform === p;
                    return (
                      <Pressable
                        key={p}
                        style={[styles.platformCard, selected && styles.platformCardActive]}
                        onPress={() => setFormPlatform(p)}
                      >
                        <MaterialCommunityIcons
                          name={PLATFORM_ICONS[p] || 'web'}
                          size={24}
                          color={selected ? '#E11D48' : '#64748B'}
                        />
                        <Text style={[styles.platformCardText, selected && styles.platformCardTextActive]}>
                          {p.toUpperCase()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.dropdownGrid}>
                  <View style={styles.dropdownHalf}>
                    <Text style={styles.advancedLabel}>Audience Strategy</Text>
                    <Pressable
                      style={styles.advancedDropdown}
                      onPress={() => setAudienceDropdownVisible(true)}
                    >
                      <Text style={styles.advancedDropdownText} numberOfLines={1}>{formAudienceStrategy}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2341" />
                    </Pressable>
                  </View>
                  <View style={styles.dropdownHalf}>
                    <View style={styles.labelWithAction}>
                      <Text style={styles.advancedLabel}>Template Architecture</Text>
                      <Pressable>
                        <Text style={styles.inlineActionText}>Edit Template</Text>
                      </Pressable>
                    </View>
                    <Pressable
                      style={styles.advancedDropdown}
                      onPress={() => setTemplateDropdownVisible(true)}
                    >
                      <Text style={styles.advancedDropdownText} numberOfLines={1}>{formTemplate}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2341" />
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.advancedLabel}>Publishing Schedule</Text>
                <View style={styles.schedulerRow}>
                  <Pressable
                    style={[styles.scheduleBtn, formPublish === 'NOW' && styles.scheduleBtnActive]}
                    onPress={() => setFormPublish('NOW')}
                  >
                    <Text style={[styles.scheduleBtnText, formPublish === 'NOW' && styles.scheduleBtnTextActive]}>POST NOW</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.scheduleBtn, formPublish === 'SCHEDULE' && styles.scheduleBtnActive]}
                    onPress={() => setFormPublish('SCHEDULE')}
                  >
                    <Text style={[styles.scheduleBtnText, formPublish === 'SCHEDULE' && styles.scheduleBtnTextActive]}>SCHEDULE</Text>
                  </Pressable>
                </View>

                {formPublish === 'SCHEDULE' && (
                  <View style={styles.schedulingFields}>
                    <Text style={styles.advancedLabel}>Global Launch Time</Text>
                    <View style={styles.scheduledInputsRow}>
                      <Pressable
                        style={styles.scheduleInputField}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <MaterialCommunityIcons name="calendar-outline" size={18} color={colors.textMuted} />
                        <Text style={styles.scheduleInputText}>
                          {formScheduledDate.toLocaleDateString('en-GB')}
                        </Text>
                        <MaterialCommunityIcons name="calendar" size={18} color="#0B2341" />
                      </Pressable>

                      <Pressable
                        style={styles.scheduleInputField}
                        onPress={() => setShowTimePicker(true)}
                      >
                        <MaterialCommunityIcons name="clock-outline" size={18} color={colors.textMuted} />
                        <Text style={styles.scheduleInputText}>
                          {formScheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </Text>
                        <MaterialCommunityIcons name="clock" size={18} color="#0B2341" />
                      </Pressable>
                    </View>

                    {/* Android Pickers */}
                    {Platform.OS === 'android' && showDatePicker && (
                      <DateTimePicker
                        value={formScheduledDate}
                        mode="date"
                        display="default"
                        onChange={onDateTimeChange}
                      />
                    )}
                    {Platform.OS === 'android' && showTimePicker && (
                      <DateTimePicker
                        value={formScheduledDate}
                        mode="time"
                        display="default"
                        onChange={onDateTimeChange}
                      />
                    )}
                  </View>
                )}

                <View style={styles.aiOptimizationBox}>
                  <View style={styles.aiHeader}>
                    <View style={styles.aiTitleRow}>
                      <MaterialCommunityIcons name="auto-fix" size={20} color="#0BA0B2" />
                      <Text style={styles.aiTitle}>AI Optimization (A/B)</Text>
                    </View>
                    <Switch
                      value={formAiEnabled}
                      onValueChange={setFormAiEnabled}
                      trackColor={{ false: '#E2E8F0', true: '#0BA0B2' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <Text style={styles.aiSubLabel}>CAPTION VARIATION A (OPTIMIZED FOR REACH)</Text>
                  <TextInput
                    style={styles.aiInput}
                    value={formCaptionA}
                    onChangeText={setFormCaptionA}
                    placeholder="Discover your dream villa in Malibu today..."
                    placeholderTextColor="#94A3B8"
                    multiline
                  />

                  <Text style={styles.aiSubLabel}>CAPTION VARIATION B (OPTIMIZED FOR CLICKS)</Text>
                  <TextInput
                    style={styles.aiInput}
                    value={formCaptionB}
                    onChangeText={setFormCaptionB}
                    placeholder="Price drop alert! Iconic Malibu Waterfront now available..."
                    placeholderTextColor="#94A3B8"
                    multiline
                  />
                </View>

                <Pressable style={styles.fullSaveBtn} onPress={handleSave}>
                  <Text style={styles.fullSaveBtnText}>{editingId ? 'Update Campaign' : 'Launch Campaign'}</Text>
                </Pressable>
              </View>

              {/* Side Stats on Mobile (stacked) */}
              <View style={styles.sideStats}>
                <View style={styles.statCard}>
                  <Text style={styles.statCardTitle}>Predictive Analytics</Text>
                  <Text style={styles.statCardLabel}>ESTIMATED REACH</Text>
                  <View style={styles.reachRow}>
                    <Text style={styles.reachValue}>18.2k - 24k</Text>
                    <Text style={styles.reachTrend}>+12% vs AVG</Text>
                  </View>
                  <Text style={styles.statCardLabel}>PEAK ENGAGEMENT TIME</Text>
                  <View style={styles.peakRow}>
                    <Text style={styles.peakValue}>TUESDAY, 6:45 PM</Text>
                    <Text style={styles.aiBadge}>AI SUGGESTED</Text>
                  </View>

                  <View style={styles.penetrationBox}>
                    <Text style={styles.penetrationLabel}>AUDIENCE PENETRATION</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: '68%' }]} />
                    </View>
                    <View style={styles.penetrationFoot}>
                      <Text style={styles.penetrationSubText}>EST. 6,842 CONTACTS</Text>
                      <Text style={styles.penetrationSubText}>68% SEGMENT DEPTH</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.complianceCard}>
                  <Text style={styles.complianceTitle}>Platform Compliance</Text>
                  <View style={styles.complianceItem}>
                    <MaterialCommunityIcons name="flash" size={16} color="#0BA0B2" />
                    <Text style={styles.complianceText}>Image Policy Check: PASS</Text>
                  </View>
                  <View style={styles.complianceItem}>
                    <MaterialCommunityIcons name="flash" size={16} color="#0BA0B2" />
                    <Text style={styles.complianceText}>Hashtag Optimization: OPTIMAL</Text>
                  </View>
                  <View style={styles.complianceItem}>
                    <MaterialCommunityIcons name="flash" size={16} color="#0BA0B2" />
                    <Text style={styles.complianceText}>Link Validation: SECURE</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>

        {/* Custom Dropdown Modal - Audience */}
        <Modal visible={audienceDropdownVisible} transparent animationType="fade">
          <Pressable
            style={styles.modalOverlayTransparent}
            onPress={() => setAudienceDropdownVisible(false)}
          >
            <View style={[styles.dropdownContainerFixed, { top: 400 }]}>
              {AUDIENCE_STRATEGIES.map((opt) => (
                <Pressable
                  key={opt}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFormAudienceStrategy(opt);
                    setAudienceDropdownVisible(false);
                  }}
                >
                  <View style={styles.checkWrap}>
                    {formAudienceStrategy === opt && <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.dropdownText}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>

        {/* Custom Dropdown Modal - Template */}
        <Modal visible={templateDropdownVisible} transparent animationType="fade">
          <Pressable
            style={styles.modalOverlayTransparent}
            onPress={() => setTemplateDropdownVisible(false)}
          >
            <View style={[styles.dropdownContainerFixed, { top: 400 }]}>
              {TEMPLATE_ARCHITECTURES.map((opt) => (
                <Pressable
                  key={opt}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFormTemplate(opt);
                    setTemplateDropdownVisible(false);
                  }}
                >
                  <View style={styles.checkWrap}>
                    {formTemplate === opt && <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.dropdownText}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>

        {/* iOS Date/Time Bottom Sheet Modal */}
        {Platform.OS === 'ios' && (
          <Modal
            visible={showDatePicker || showTimePicker}
            transparent
            animationType="slide"
          >
            <View style={styles.modalOverlayDark}>
              <View style={styles.pickerModalContent}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>
                    {showDatePicker ? 'Select Date' : 'Select Time'}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setShowDatePicker(false);
                      setShowTimePicker(false);
                    }}
                  >
                    <Text style={styles.pickerDoneText}>DONE</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={formScheduledDate}
                  mode={showDatePicker ? 'date' : 'time'}
                  display="spinner"
                  onChange={onDateTimeChange}
                  textColor="#0B2341"
                />
              </View>
            </View>
          </Modal>
        )}
      </Modal>

      {/* Platform Filter Dropdown Modal */}
      <Modal visible={platformDropdownVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlayTransparent}
          onPress={() => setPlatformDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            {['All Platforms', ...AVAILABLE_PLATFORMS].map((p) => {
              const label = p === 'All Platforms' ? 'All Platforms' :
                p === 'instagram' ? 'Instagram' :
                  p === 'facebook' ? 'Facebook' :
                    p === 'linkedin' ? 'LinkedIn' :
                      p === 'tiktok' ? 'TikTok' : p;
              const isSelected = platformFilter === p;
              return (
                <Pressable
                  key={p}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPlatformFilter(p);
                    setPlatformDropdownVisible(false);
                  }}
                >
                  <View style={styles.checkWrap}>
                    {isSelected && <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.dropdownText}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>




      {/* Campaign Intelligence Analytics Modal */}
      <Modal visible={analyticsVisible} transparent={false} animationType="slide">
        <View style={[styles.fullModalSub, { paddingTop: insets.top }]}>
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.fullModalContent}>
            <View style={styles.fullModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fullModalTitle}>Campaign Intelligence</Text>
                <Text style={styles.fullModalSubtitle}>
                  Comprehensive attribution & reach metrics for {analyticsCampaign?.id || 'ID-SOCIAL-X'}
                </Text>
              </View>
              <Pressable
                onPress={() => setAnalyticsVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialCommunityIcons name="close" size={24} color="#0B2341" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.fullModalScroll}>
              {/* Top Stats Grid */}
              <View style={styles.analyticsStatsGrid}>
                {[
                  { icon: 'account-group-outline', label: 'NEURAL REACH', value: '24.8k', trend: '+12%', color: '#16A34A' },
                  { icon: 'trending-up', label: 'PULSE INDEX', value: '5.12%', trend: '+0.8%', color: '#16A34A' },
                  { icon: 'lightning-bolt-outline', label: 'ATTRIBUTED CONV.', value: '18', trend: 'High', color: '#16A34A' },
                  { icon: 'heart-outline', label: 'AVG SENTIMENT', value: 'Positive', trend: '92%', color: '#16A34A' },
                ].map((stat, i) => (
                  <View key={i} style={styles.intelligenceCard}>
                    <View style={styles.intelHeader}>
                      <View style={styles.intelIconBox}>
                        <MaterialCommunityIcons name={stat.icon as any} size={18} color="#0B2341" />
                      </View>
                      <View style={styles.intelTrendBox}>
                        <Text style={styles.intelTrendText}>{stat.trend}</Text>
                      </View>
                    </View>
                    <Text style={stat.label && styles.intelLabel}>{stat.label}</Text>
                    <Text style={stat.value && styles.intelValue}>{stat.value}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.analyticsMainRow}>
                <View style={styles.analyticsCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.analyticsSectionTitle}>Dynamic Interaction Stream</Text>
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE MONITOR</Text>
                    </View>
                  </View>

                  <View style={styles.streamList}>
                    {[
                      { user: '@jess_realestate', action: 'DIRECT MESSAGE', platform: 'Instagram', impact: '+15', time: 'Just now' },
                      { user: 'Michael Chen (LI)', action: 'SHARED POST', platform: 'Linkedin', impact: '+45', time: '14m ago' },
                      { user: '@property_hunter', action: 'COMMENTED', platform: 'Instagram', impact: '+8', time: '1h ago' },
                      { user: 'David Wilson', action: 'POST SAVED', platform: 'Facebook', impact: '+12', time: '3h ago' },
                    ].map((row, i) => (
                      <View key={i} style={styles.streamItem}>
                        <View style={styles.streamLeft}>
                          <View style={[styles.streamAvatar, { backgroundColor: ['#FFEDD5', '#E0F2FE', '#F0FDF4', '#FEF2F2'][i % 4] }]}>
                            <Text style={[styles.streamAvatarText, { color: ['#9A3412', '#075985', '#166534', '#991B1B'][i % 4] }]}>
                              {row.user.startsWith('@') ? row.user.charAt(1).toUpperCase() : row.user.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View style={styles.streamInfo}>
                            <Text style={styles.streamUserName} numberOfLines={1}>{row.user}</Text>
                            <View style={styles.streamMetaRow}>
                              <Text style={styles.streamMetaLabel}>{row.platform}</Text>
                              <View style={styles.metaDot} />
                              <Text style={styles.streamMetaLabel}>{row.time}</Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.streamRight}>
                          <View style={styles.actionPillMinimal}>
                            <Text style={styles.actionPillTextMinimal}>{row.action}</Text>
                          </View>
                          <Text style={styles.streamImpactHighlight}>{row.impact}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={{ gap: 20 }}>
                  <View style={styles.analyticsCard}>
                    <Text style={styles.analyticsSectionTitle}>Peak Performance Hub</Text>
                    <View style={styles.metricItem}>
                      <View style={styles.metricLabelRow}>
                        <Text style={styles.metricLabel}>Carousel Depth</Text>
                        <Text style={styles.metricVal}>86%</Text>
                      </View>
                      <View style={styles.metricBarBg}>
                        <View style={[styles.metricBarFill, { width: '86%', backgroundColor: '#0B2341' }]} />
                      </View>
                    </View>
                    <View style={styles.metricItem}>
                      <View style={styles.metricLabelRow}>
                        <Text style={styles.metricLabel}>Lead Velocity</Text>
                        <Text style={styles.metricVal}>High</Text>
                      </View>
                      <View style={styles.metricBarBg}>
                        <View style={[styles.metricBarFill, { width: '92%', backgroundColor: '#0BA0B2' }]} />
                      </View>
                    </View>
                    <View style={styles.republishBox}>
                      <Text style={styles.republishLabel}>SUGGESTED RE-PUBLISH WINDOW</Text>
                      <Text style={styles.republishValue}>Tuesday @ 18:45 PST</Text>
                      <Text style={styles.republishSub}>Based on historical engagement spikes.</Text>
                    </View>
                  </View>

                  <View style={styles.analyticsCard}>
                    <Text style={styles.analyticsSectionTitle}>Attribution Focus</Text>
                    <View style={styles.attributionWinner}>
                      <View style={styles.winnerHeader}>
                        <Text style={styles.winnerLabel}>AI Caption Variant B</Text>
                        <View style={styles.winnerBadge}><Text style={styles.winnerBadgeText}>WINNER</Text></View>
                      </View>
                      <Text style={styles.winnerReach}>+48.2% Reach</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

    </LinearGradient>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
  background: { flex: 1 },
  topControls: {
    gap: 12,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformSelector: {
    flex: 1,
    height: 44,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  platformSelectorText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2341',
  },
  controlsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    gap: 10,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0B2341',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  list: { gap: 16 },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  platformIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  platformName: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  campaignName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2341',
    lineHeight: 22,
    marginBottom: 12,
  },
  audienceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  audienceTag: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  audienceTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  launchDate: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FBFDFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B2341',
  },
  statSubValue: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3B82F6',
    marginTop: 2,
  },
  cardActions: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 16,
  },
  actionGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Full Screen Modal Styles
  fullModalSub: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  fullModalContent: {
    flex: 1,
  },
  fullModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  fullModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2341',
  },
  fullModalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  closeBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fullModalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2341',
  },
  advancedLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2341',
    marginBottom: 8,
    marginTop: 16,
  },
  advancedInput: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0B2341',
  },
  advancedPlatformRow: {
    flexDirection: 'row',
    gap: 8,
  },
  platformCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  platformCardActive: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
  },
  platformCardText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  platformCardTextActive: {
    color: '#E11D48',
  },
  dropdownGrid: {
    // flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  dropdownHalf: {
    flex: 1,
  },
  advancedDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  advancedDropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2341',
    flex: 1,
  },
  labelWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inlineActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0BA0B2',
  },
  schedulerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    padding: 4,
    marginTop: 4,
  },
  scheduleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  scheduleBtnActive: {
    backgroundColor: '#0B2341',
  },
  scheduleBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  scheduleBtnTextActive: {
    color: '#FFFFFF',
  },
  aiOptimizationBox: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#0BA0B2',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#F0FDFA',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0BA0B2',
  },
  aiSubLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0BA0B2',
    marginTop: 12,
    marginBottom: 4,
  },
  aiInput: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0B2341',
    minHeight: 60,
  },
  fullSaveBtn: {
    backgroundColor: '#0B2341',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  fullSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  // Side Stats
  sideStats: {
    marginTop: 24,
    gap: 16,
  },
  statCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statCardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2341',
    marginBottom: 16,
  },
  statCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    marginTop: 12,
  },
  reachRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  reachValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2341',
  },
  reachTrend: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 4,
  },
  peakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  peakValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2341',
  },
  aiBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0BA0B2',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  penetrationBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
  },
  penetrationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.cardBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0B2341',
  },
  penetrationFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  penetrationSubText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  complianceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  complianceTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2341',
    marginBottom: 16,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  complianceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2341',
  },

  // Generic Dropdown stuff
  modalOverlayTransparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdownContainerFixed: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#3F3F3F',
    borderRadius: 16,
    padding: 12,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 250,
    right: 20,
    width: 200,
    backgroundColor: '#3F3F3F',
    borderRadius: 16,
    padding: 12,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  checkWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schedulingFields: {
    marginTop: 8,
  },
  scheduledInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scheduleInputField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  scheduleInputText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2341',
  },
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2341',
  },
  pickerGrid: {
    gap: 12,
  },
  pickerItem: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  pickerItemActive: {
    backgroundColor: '#0B2341',
  },
  pickerItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2341',
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
  },
  pickerDoneText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0BA0B2',
    letterSpacing: 0.5,
  },

  // Analytics Dashboard Styles
  analyticsStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  intelligenceCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  intelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  intelIconBox: {
    width: 32,
    height: 32,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intelTrendBox: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  intelTrendText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  intelLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 4,
  },
  intelValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2341',
  },
  analyticsMainRow: {
    gap: 20,
  },
  analyticsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  analyticsSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B2341',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  streamList: {
    marginTop: 10,
  },
  streamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  streamLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  streamAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamAvatarText: {
    fontSize: 14,
    fontWeight: '900',
  },
  streamInfo: {
    flex: 1,
  },
  streamUserName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2341',
  },
  streamMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  streamMetaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
  streamRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  actionPillMinimal: {
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionPillTextMinimal: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  streamImpactHighlight: {
    fontSize: 13,
    fontWeight: '900',
    color: '#16A34A',
  },
  metricItem: {
    marginBottom: 16,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0B2341',
  },
  metricBarBg: {
    height: 6,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  republishBox: {
    marginTop: 20,
    backgroundColor: '#0B2341',
    borderRadius: 16,
    padding: 20,
  },
  republishLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  republishValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  republishSub: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 4,
  },
  attributionWinner: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    padding: 16,
  },
  winnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  winnerLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  winnerBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  winnerBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#16A34A',
  },
  winnerReach: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0BA0B2',
  },
  });
}


