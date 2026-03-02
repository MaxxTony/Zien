import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CampaignStatus = 'COMPLETED' | 'PAUSED' | 'SCHEDULED';
type Channel = 'Email' | 'SMS' | 'WhatsApp';

interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  audience: string;
  date: string;
  opens: number;
  clicks: number;
  replies: number;
  conv: number;
  status: CampaignStatus;
}

const CAMPAIGNS_DATA: Campaign[] = [
  {
    id: '1',
    name: 'Spring Luxury Newsletter',
    channel: 'Email',
    audience: 'ALL BUYERS',
    date: 'Jan 24, 2026',
    opens: 42,
    clicks: 12,
    replies: 5,
    conv: 2,
    status: 'COMPLETED',
  },
  {
    id: '2',
    name: 'Malibu Villa - Price Drop',
    channel: 'SMS',
    audience: 'HOT LEADS',
    date: 'Jan 20, 2026',
    opens: 95,
    clicks: 28,
    replies: 15,
    conv: 8,
    status: 'COMPLETED',
  },
  {
    id: '3',
    name: 'Open House Follow-up',
    channel: 'WhatsApp',
    audience: 'BUSINESS WAY LEADS',
    date: 'Jan 15, 2026',
    opens: 88,
    clicks: 15,
    replies: 22,
    conv: 5,
    status: 'PAUSED',
  },
  {
    id: '4',
    name: 'Exclusive Coastal Listings',
    channel: 'Email',
    audience: 'INVESTOR GROUP',
    date: 'Feb 02, 2026',
    opens: 0,
    clicks: 0,
    replies: 0,
    conv: 0,
    status: 'SCHEDULED',
  },
];

export default function CRMCampaignsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  const [isChannelDropdownOpen, setChannelDropdownOpen] = useState(false);
  const [newCampaignVisible, setNewCampaignVisible] = useState(false);

  // New Campaign Form State
  const [formCampaignName, setFormCampaignName] = useState('');
  const [commChannel, setCommChannel] = useState<'EMAIL' | 'SMS' | 'WHATSAPP'>('EMAIL');
  const [targetSegment, setTargetSegment] = useState('All Contacts');
  const [emailTemplate, setEmailTemplate] = useState('Open House Follow-Up');
  const [sendingAccount, setSendingAccount] = useState('SendGrid (Connected)');
  const [sendSchedule, setSendSchedule] = useState<'NOW' | 'SCHEDULE'>('NOW');
  const [abTesting, setAbTesting] = useState(false);
  const [versionA, setVersionA] = useState('');
  const [versionB, setVersionB] = useState('');

  // Dropdown states for form
  const [segmentDropdown, setSegmentDropdown] = useState(false);
  const [templateDropdown, setTemplateDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_DATA);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);

  const resetForm = () => {
    setFormCampaignName('');
    setCommChannel('EMAIL');
    setTargetSegment('All Contacts');
    setEmailTemplate('Open House Follow-Up');
    setSendingAccount('SendGrid (Connected)');
    setSendSchedule('NOW');
    setAbTesting(false);
    setVersionA('');
    setVersionB('');
    setEditingCampaignId(null);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaignId(campaign.id);
    setFormCampaignName(campaign.name);
    setCommChannel(campaign.channel.toUpperCase() as any);
    setTargetSegment(campaign.audience);
    // Values below are static/mocked for now as they're not in the Campaign interface
    setEmailTemplate('Open House Follow-Up');
    setSendingAccount('SendGrid (Connected)');
    setSendSchedule('SCHEDULE');
    setAbTesting(true);
    setVersionA("You won't believe this price drop...");
    setVersionB("New Pricing: Malibu Villa is now $1.2M");
    setNewCampaignVisible(true);
  };

  const openNewCampaignModal = () => {
    resetForm();
    setNewCampaignVisible(true);
  };

  // Campaign Intelligence State
  const [intelligenceVisible, setIntelligenceVisible] = useState(false);
  const [selectedCampaignForIntelligence, setSelectedCampaignForIntelligence] = useState<Campaign | null>(null);

  const handleOpenIntelligence = (campaign: Campaign) => {
    setSelectedCampaignForIntelligence(campaign);
    setIntelligenceVisible(true);
  };

  // AI Campaign Form State
  const [aiCampaignVisible, setAiCampaignVisible] = useState(false);
  const [aiSegment, setAiSegment] = useState('All Contacts');
  const [aiTemplate, setAiTemplate] = useState('Luxury Showcase');
  const [aiDescription, setAiDescription] = useState('');
  const [aiSegmentDropdown, setAiSegmentDropdown] = useState(false);
  const [aiTemplateDropdown, setAiTemplateDropdown] = useState(false);

  const handleToggleStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        // Toggle between PAUSED and SCHEDULED
        const nextStatus: CampaignStatus = c.status === 'PAUSED' ? 'SCHEDULED' : 'PAUSED';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Deletion Logic
  const handleDeleteCampaign = (id: string) => {
    Alert.alert(
      "Delete Campaign",
      "Are you sure you want to delete this campaign? This action cannot be undone.",
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

  // Filtering Logic
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesChannel = true;
    if (selectedChannel === 'Email Only') matchesChannel = campaign.channel === 'Email';
    else if (selectedChannel === 'SMS Only') matchesChannel = campaign.channel === 'SMS';
    else if (selectedChannel === 'WhatsApp Only') matchesChannel = campaign.channel === 'WhatsApp';

    return matchesSearch && matchesChannel;
  });

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case 'Email': return 'email-outline';
      case 'SMS': return 'message-text-outline';
      case 'WhatsApp': return 'whatsapp';
      default: return 'email-outline';
    }
  };

  const getStatusStyle = (status: CampaignStatus) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#ECFDF5', text: '#10B981' };
      case 'PAUSED': return { bg: '#FEF2F2', text: '#EF4444' };
      case 'SCHEDULED': return { bg: '#FFF7ED', text: '#F59E0B' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const renderCampaignCard = (campaign: Campaign) => {
    const statusStyle = getStatusStyle(campaign.status);

    return (
      <View key={campaign.id} style={styles.campaignCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.campaignName} numberOfLines={1}>{campaign.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{campaign.status}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.channelInfo}>
            <MaterialCommunityIcons name={getChannelIcon(campaign.channel)} size={16} color="#64748B" />
            <Text style={styles.channelText}>{campaign.channel}</Text>
          </View>
          <View style={styles.audienceBadge}>
            <Text style={styles.audienceText}>{campaign.audience}</Text>
          </View>
          <Text style={styles.dateText}>{campaign.date}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>ENGAGEMENT</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statSubLabel}>Opens:</Text>
              <Text style={styles.statValue}>{campaign.opens}%</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statSubLabel}>Clicks:</Text>
              <Text style={[styles.statValue, { color: '#0BA0B2' }]}>{campaign.clicks}%</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>REPLIES</Text>
            <Text style={[styles.mainStatValue, { color: '#F59E0B' }]}>{campaign.replies}%</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>CONV.</Text>
            <Text style={styles.mainStatValue}>{campaign.conv}%</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <View style={styles.actionLeftIcons}>
            <Pressable
              style={styles.actionIconBtn}
              onPress={() => handleOpenIntelligence(campaign)}
            >
              <MaterialCommunityIcons name="chart-timeline-variant-shimmer" size={20} color="#3B82F6" />
            </Pressable>
            <Pressable
              style={[
                styles.actionIconBtn,
                campaign.status !== 'PAUSED' && campaign.status !== 'COMPLETED' && styles.activeStatusBtn
              ]}
              onPress={() => handleToggleStatus(campaign.id)}
            >
              <MaterialCommunityIcons
                name={campaign.status === 'PAUSED' ? "play-outline" : "pause"}
                size={20}
                color={campaign.status === 'PAUSED' ? "#10B981" : "#3B82F6"}
              />
            </Pressable>
            <Pressable
              style={styles.actionIconBtn}
              onPress={() => handleEditCampaign(campaign)}
            >
              <MaterialCommunityIcons name="pencil-outline" size={20} color="#64748B" />
            </Pressable>
          </View>
          <Pressable
            style={styles.actionIconBtn}
            onPress={() => handleDeleteCampaign(campaign.id)}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <PageHeader
        title="Campaigns"
        subtitle="Scalable marketing with full provider transparency and A/B analytics."
        onBack={() => router.back()}
      />

      <View style={styles.topActionsRow}>
        <Pressable
          style={styles.aiCampaignBtn}
          onPress={() => setAiCampaignVisible(true)}
        >
          <Text style={styles.aiCampaignBtnText}>AI Campaign</Text>
        </Pressable>
        <Pressable
          style={styles.launchBtn}
          onPress={openNewCampaignModal}
        >
          <Text style={styles.launchBtnText}>Launch New Campaign</Text>
        </Pressable>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search campaigns or segments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.channelFilterWrapper}>
          <MaterialCommunityIcons name="filter-variant" size={20} color="#64748B" />
          <Pressable
            style={styles.channelSelector}
            onPress={() => setChannelDropdownOpen(!isChannelDropdownOpen)}
          >
            <Text style={styles.channelSelectorText}>{selectedChannel}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
          </Pressable>

          {isChannelDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {['All Channels', 'Email Only', 'SMS Only', 'WhatsApp Only'].map((opt) => (
                <Pressable
                  key={opt}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedChannel(opt);
                    setChannelDropdownOpen(false);
                  }}
                >
                  {selectedChannel === opt && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color="#FFFFFF"
                      style={{ position: 'absolute', left: 12 }}
                    />
                  )}
                  <Text style={[styles.dropdownItemText, selectedChannel === opt && { fontWeight: '700' }]}>
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map(renderCampaignCard)
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="filter-variant-remove" size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateText}>No campaigns found matching your filters.</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Launch New Campaign Modal ── */}
      <Modal
        visible={newCampaignVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          setNewCampaignVisible(false);
          setEditingCampaignId(null);
        }}
      >
        <LinearGradient
          colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
          style={{ flex: 1, paddingTop: insets.top }}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleBox}>
              <Text style={styles.modalTitle}>{editingCampaignId ? 'Edit Campaign' : 'Campaigns'}</Text>
              <Text style={styles.modalSubtitle}>Scalable marketing with full provider transparency.</Text>
            </View>

            <Pressable
              onPress={() => {
                setNewCampaignVisible(false);
                setEditingCampaignId(null);
              }}
              hitSlop={12}
              style={{ marginLeft: 16 }}
            >
              <MaterialCommunityIcons name="close" size={28} color="#0B2D3E" />
            </Pressable>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Campaign Configuration */}
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Campaign Configuration</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Campaign Name</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formCampaignName}
                    onChangeText={setFormCampaignName}
                    placeholder="e.g. Summer Listing Collection"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={[styles.inputGroup]}>
                  <Text style={styles.inputLabel}>Communication Channel</Text>
                  <View style={styles.channelTabs}>
                    <Pressable
                      style={[styles.channelTab, commChannel === 'EMAIL' && styles.channelTabActive]}
                      onPress={() => setCommChannel('EMAIL')}
                    >
                      <MaterialCommunityIcons name="email-outline" size={18} color={commChannel === 'EMAIL' ? '#FFFFFF' : '#64748B'} />
                      <Text style={[styles.channelTabText, commChannel === 'EMAIL' && styles.channelTextActive]}>EMAIL</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.channelTab, commChannel === 'SMS' && styles.channelTabActive]}
                      onPress={() => setCommChannel('SMS')}
                    >
                      <MaterialCommunityIcons name="message-text-outline" size={18} color={commChannel === 'SMS' ? '#FFFFFF' : '#64748B'} />
                      <Text style={[styles.channelTabText, commChannel === 'SMS' && styles.channelTextActive]}>SMS</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.channelTab, commChannel === 'WHATSAPP' && styles.channelTabActive]}
                      onPress={() => setCommChannel('WHATSAPP')}
                    >
                      <MaterialCommunityIcons name="whatsapp" size={18} color={commChannel === 'WHATSAPP' ? '#FFFFFF' : '#64748B'} />
                      <Text style={[styles.channelTabText, commChannel === 'WHATSAPP' && styles.channelTextActive]}>WHATSAPP</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Target Segment</Text>
                  <Pressable
                    style={styles.formSelector}
                    onPress={() => setSegmentDropdown(!segmentDropdown)}
                  >
                    <Text style={styles.formSelectorText}>{targetSegment}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                  </Pressable>
                  {segmentDropdown && (
                    <View style={styles.formDropdown}>
                      {['All Contacts', 'Buyers', 'Leads'].map(opt => (
                        <Pressable key={opt} style={styles.formDropDownItem} onPress={() => { setTargetSegment(opt); setSegmentDropdown(false); }}>
                          <Text style={styles.formDropDownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>Email Template</Text>
                    <Text style={styles.manageLink}>Manage Templates</Text>
                  </View>
                  <Pressable
                    style={styles.formSelector}
                    onPress={() => setTemplateDropdown(!templateDropdown)}
                  >
                    <Text style={styles.formSelectorText}>{emailTemplate}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                  </Pressable>
                  {templateDropdown && (
                    <View style={styles.formDropdown}>
                      {['Open House Follow-Up', 'Monthly Newsletter', 'New Listing Alert'].map(opt => (
                        <Pressable key={opt} style={styles.formDropDownItem} onPress={() => { setEmailTemplate(opt); setTemplateDropdown(false); }}>
                          <Text style={styles.formDropDownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Sending Account</Text>
                  <Pressable
                    style={styles.formSelector}
                    onPress={() => setAccountDropdown(!accountDropdown)}
                  >
                    <Text style={styles.formSelectorText}>{sendingAccount}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                  </Pressable>
                  {accountDropdown && (
                    <View style={styles.formDropdown}>
                      {['SendGrid (Connected)', 'Mailchimp', 'Custom SMTP'].map(opt => (
                        <Pressable key={opt} style={styles.formDropDownItem} onPress={() => { setSendingAccount(opt); setAccountDropdown(false); }}>
                          <Text style={styles.formDropDownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Sending Schedule</Text>
                  <View style={styles.scheduleTabs}>
                    <Pressable
                      style={[styles.scheduleTab, sendSchedule === 'NOW' && styles.scheduleTabActive]}
                      onPress={() => setSendSchedule('NOW')}
                    >
                      <Text style={[styles.scheduleTabText, sendSchedule === 'NOW' && styles.scheduleTextActive]}>SEND NOW</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.scheduleTab, sendSchedule === 'SCHEDULE' && styles.scheduleTabActive]}
                      onPress={() => setSendSchedule('SCHEDULE')}
                    >
                      <Text style={[styles.scheduleTabText, sendSchedule === 'SCHEDULE' && styles.scheduleTextActive]}>SCHEDULE</Text>
                    </Pressable>
                  </View>
                </View>

                {/* A/B Subject Line Testing */}
                <View style={styles.abContainer}>
                  <View style={styles.abHeader}>
                    <Text style={styles.abTitle}>A/B Subject Line Testing</Text>
                    <Switch
                      value={abTesting}
                      onValueChange={setAbTesting}
                      trackColor={{ false: '#E2E8F0', true: '#EA580C' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  {abTesting && (
                    <View style={styles.abContent}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.abLabel}>VERSION A (50%)</Text>
                        <TextInput
                          style={styles.abInput}
                          value={versionA}
                          onChangeText={setVersionA}
                          placeholder="You won't believe this price drop..."
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.abLabel}>VERSION B (50%)</Text>
                        <TextInput
                          style={styles.abInput}
                          value={versionB}
                          onChangeText={setVersionB}
                          placeholder="New Pricing: Malibu Villa is now $1.2M"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Compliance & Delivery */}
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Compliance & Delivery</Text>

                <View style={styles.complianceItem}>
                  <View>
                    <Text style={styles.complianceTitle}>Unsubscribe Enforcement</Text>
                    <Text style={styles.complianceDesc}>Automatically exclude opted-out contacts.</Text>
                  </View>
                  <Text style={styles.activePill}>ACTIVE</Text>
                </View>

                <View style={styles.complianceItem}>
                  <View>
                    <Text style={styles.complianceTitle}>Bounce Protection</Text>
                    <Text style={styles.complianceDesc}>Remove invalid emails after first fail.</Text>
                  </View>
                  <Text style={styles.activePill}>ACTIVE</Text>
                </View>

                <View style={styles.audienceBox}>
                  <Text style={styles.audienceLabel}>AUDIENCE PREVIEW</Text>
                  <Text style={styles.audienceCount}>482</Text>
                  <Text style={styles.audienceSubText}>Contacts match your current filters.</Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Fixed Footer */}
          <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 12 }]}>
            <Pressable
              style={styles.finalLaunchBtn}
              onPress={() => {
                setNewCampaignVisible(false);
                setEditingCampaignId(null);
              }}
            >
              <Text style={styles.finalLaunchBtnText}>
                {editingCampaignId ? 'UPDATE & RESCHEDULE' : 'LAUNCH CAMPAIGN PIPELINE'}
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Modal>

      {/* ── Campaign Intelligence Modal ── */}
      <Modal
        visible={intelligenceVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIntelligenceVisible(false)}
      >
        <LinearGradient
          colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
          style={{ flex: 1, paddingTop: insets.top }}
        >
          {/* Intelligence Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleBox}>
              <Text style={styles.modalTitle}>Campaign Intelligence</Text>
              <Text style={styles.modalSubtitle}>ROI & Conversion Attribution for {selectedCampaignForIntelligence?.id.substring(0, 8)}</Text>
            </View>
            <Pressable
              onPress={() => setIntelligenceVisible(false)}
              hitSlop={12}
            >
              <MaterialCommunityIcons name="close" size={28} color="#0B2D3E" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Stats Grid */}
            <View style={styles.intelStatsGrid}>
              <View style={styles.intelStatCard}>
                <View style={styles.intelStatHeader}>
                  <MaterialCommunityIcons name="email-outline" size={16} color="#64748B" />
                  <View style={[styles.intelBadge, { backgroundColor: '#ECFDF5' }]}>
                    <Text style={[styles.intelBadgeText, { color: '#10B981' }]}>99.8%</Text>
                  </View>
                </View>
                <Text style={styles.intelStatLabel}>DELIVERED</Text>
                <Text style={styles.intelStatLargeValue}>12,482</Text>
              </View>

              <View style={styles.intelStatCard}>
                <View style={styles.intelStatHeader}>
                  <MaterialCommunityIcons name="near-me" size={16} color="#64748B" />
                  <View style={[styles.intelBadge, { backgroundColor: '#F0FDFA' }]}>
                    <Text style={[styles.intelBadgeText, { color: '#0D9488' }]}>+14%</Text>
                  </View>
                </View>
                <Text style={styles.intelStatLabel}>OPEN RATE</Text>
                <Text style={styles.intelStatLargeValue}>42.4%</Text>
              </View>

              <View style={styles.intelStatCard}>
                <View style={styles.intelStatHeader}>
                  <MaterialCommunityIcons name="lightning-bolt-outline" size={16} color="#64748B" />
                  <View style={[styles.intelBadge, { backgroundColor: '#F0F9FF' }]}>
                    <Text style={[styles.intelBadgeText, { color: '#0284C7' }]}>High</Text>
                  </View>
                </View>
                <Text style={styles.intelStatLabel}>CLICK-TO-CONV</Text>
                <Text style={styles.intelStatLargeValue}>8.2%</Text>
              </View>

              <View style={styles.intelStatCard}>
                <View style={styles.intelStatHeader}>
                  <MaterialCommunityIcons name="target" size={16} color="#64748B" />
                  <View style={[styles.intelBadge, { backgroundColor: '#F5F3FF' }]}>
                    <Text style={[styles.intelBadgeText, { color: '#7C3AED' }]}>+8%</Text>
                  </View>
                </View>
                <Text style={styles.intelStatLabel}>MARKET DEPTH</Text>
                <Text style={styles.intelStatLargeValue}>92%</Text>
              </View>
            </View>

            {/* Live Attribution Stream */}
            <View style={styles.streamCard}>
              <View style={styles.streamHeader}>
                <Text style={styles.streamTitle}>Live Attribution Stream</Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE PIPELINE</Text>
                </View>
              </View>

              <View style={styles.streamTable}>
                {/* Column Headers */}
                <View style={styles.streamTableHead}>
                  <Text style={[styles.streamHeadText, { flex: 2 }]}>LEAD CONTACT</Text>
                  <Text style={[styles.streamHeadText, { flex: 1.5 }]}>ACTIVITY</Text>
                  <Text style={[styles.streamHeadText, { flex: 1 }]}>SCORE</Text>
                </View>

                {/* Rows */}
                {[
                  { name: 'Jessica Miller', action: 'CLICKED LINK', score: '+15', color: '#10B981' },
                  { name: 'Michael Chen', action: 'REPLIED', score: '+45', color: '#0BA0B2' },
                  { name: 'Sarah Johnson', action: 'OPENED', score: '+5', color: '#F59E0B' },
                  { name: 'David Wilson', action: 'CLICKED LINK', score: '+12', color: '#3B82F6' },
                ].map((row, idx) => (
                  <View key={idx} style={styles.streamRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.rowName}>{row.name}</Text>
                      <Text style={styles.rowSub}>2 mins ago • WhatsApp</Text>
                    </View>
                    <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                      <View style={[styles.actionBadge, { backgroundColor: '#F1F5F9' }]}>
                        <Text style={styles.actionBadgeText}>{row.action}</Text>
                      </View>
                    </View>
                    <Text style={[styles.rowScore, { flex: 1, color: row.color }]}>{row.score}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Pipeline Engagement */}
            <View style={styles.engagementCard}>
              <Text style={styles.cardTitle}>Pipeline Engagement</Text>

              <View style={styles.progressItem}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Click Through Rate</Text>
                  <Text style={styles.progressValue}>12.8%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '12.8%', backgroundColor: '#0B2D3E' }]} />
                </View>
              </View>

              <View style={styles.progressItem}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Reply Velocity</Text>
                  <Text style={styles.progressValue}>Fast</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '85%', backgroundColor: '#2DD4BF' }]} />
                </View>
              </View>

              <View style={styles.progressItem}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Direct Conversion</Text>
                  <Text style={styles.progressValue}>4.2%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '40%', backgroundColor: '#F97316' }]} />
                </View>
              </View>

              <View style={styles.progressItem}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Unsubscribe Rate</Text>
                  <Text style={styles.progressValue}>0.04%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '5%', backgroundColor: '#10B981' }]} />
                </View>
              </View>

              <View style={styles.optimizedWindowBox}>
                <Text style={styles.windowLabel}>NEXT OPTIMIZED SEND WINDOW</Text>
                <View style={styles.windowTimeRow}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.windowTime}>Friday @ 09:15 EST</Text>
                </View>
                <Text style={styles.windowSub}>Based on past engagement patterns.</Text>
              </View>
            </View>

            {/* A/B Testing Outcome */}
            <View style={styles.abOutcomeCard}>
              <Text style={styles.cardTitle}>A/B testing Outcome</Text>
              <View style={styles.winnerBox}>
                <View style={styles.winnerHeader}>
                  <Text style={styles.winnerTopic}>Subject Line "Malibu..."</Text>
                  <Text style={styles.winnerLabel}>WINNER</Text>
                </View>
                <Text style={styles.winnerStat}>+45% Open Rate</Text>
              </View>
            </View>

          </ScrollView>
        </LinearGradient>
      </Modal>

      <Modal
        visible={aiCampaignVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setAiCampaignVisible(false)}
      >
        <LinearGradient
          colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
          style={{ flex: 1, paddingTop: insets.top }}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleBox}>
              <Text style={styles.modalTitle}>AI Campaign</Text>
              <Text style={styles.modalSubtitle}>Generate smart marketing campaigns with AI.</Text>
            </View>
            <Pressable
              onPress={() => setAiCampaignVisible(false)}
              hitSlop={12}
            >
              <MaterialCommunityIcons name="close" size={28} color="#0B2D3E" />
            </Pressable>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formCard}>
                <View style={[styles.aiRow, { zIndex: 3000 }]}>
                  <View style={styles.aiCol}>
                    <Text style={styles.aiLabel}>TARGET SEGMENT</Text>
                    <Pressable
                      style={styles.aiSelector}
                      onPress={() => {
                        setAiSegmentDropdown(!aiSegmentDropdown);
                        setAiTemplateDropdown(false);
                      }}
                    >
                      <Text style={styles.aiSelectorText} numberOfLines={1}>{aiSegment}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                    </Pressable>
                    {aiSegmentDropdown && (
                      <View style={[styles.aiDropdown, { top: 68 }]}>
                        {['All Contacts', 'Buyers', 'Leads'].map(opt => (
                          <Pressable key={opt} style={styles.aiDropdownItem} onPress={() => { setAiSegment(opt); setAiSegmentDropdown(false); }}>
                            <Text style={styles.aiDropdownItemText}>{opt}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.aiCol}>
                    <Text style={styles.aiLabel}>BRAND TEMPLATE</Text>
                    <Pressable
                      style={styles.aiSelector}
                      onPress={() => {
                        setAiTemplateDropdown(!aiTemplateDropdown);
                        setAiSegmentDropdown(false);
                      }}
                    >
                      <Text style={styles.aiSelectorText} numberOfLines={1}>{aiTemplate}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                    </Pressable>
                    {aiTemplateDropdown && (
                      <View style={[styles.aiDropdown, { top: 68 }]}>
                        {['Luxury Showcase', 'Minimalist', 'Modern'].map(opt => (
                          <Pressable key={opt} style={styles.aiDropdownItem} onPress={() => { setAiTemplate(opt); setAiTemplateDropdown(false); }}>
                            <Text style={styles.aiDropdownItemText}>{opt}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.aiInputGroup}>
                  <Text style={styles.aiLabel}>CAMPAIGN OBJECTIVE & DESCRIPTION</Text>
                  <TextInput
                    style={styles.aiTextArea}
                    multiline={true}
                    placeholder="Describe the campaign you want to generate. e.g., 'Re-engage buyers who looked at luxury condos in West Hollywood last month with a price drop alert.'"
                    placeholderTextColor="#94A3B8"
                    value={aiDescription}
                    onChangeText={setAiDescription}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.aiModalActions}>
              <Pressable
                style={styles.aiCancelBtn}
                onPress={() => setAiCampaignVisible(false)}
              >
                <Text style={styles.aiCancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.aiGenerateBtn}
                onPress={() => setAiCampaignVisible(false)}
              >
                <Text style={styles.aiGenerateBtnText}>Generate Campaign</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  aiCampaignBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCampaignBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  launchBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0B2D3E',
  },
  channelFilterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 100,
  },
  channelSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  channelSelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 28,
    right: 0,
    backgroundColor: '#6A7D8C',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 36,
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  campaignCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  audienceBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  audienceText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statSubLabel: {
    fontSize: 10,
    color: '#94A3B8',
    width: 35,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  mainStatValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionLeftIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStatusBtn: {
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  emptyState: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalHeaderTitleBox: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalScroll: {
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: '#0B2D3E',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  manageLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0BA0B2',
    textDecorationLine: 'underline',
  },
  channelTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  channelTab: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  channelTabActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  channelTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  channelTextActive: {
    color: '#FFFFFF',
  },
  formSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  formSelectorText: {
    fontSize: 14,
    color: '#0B2D3E',
    fontWeight: '600',
  },
  scheduleTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    width: 220,
  },
  scheduleTab: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleTabActive: {
    backgroundColor: '#0B2D3E',
  },
  scheduleTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  scheduleTextActive: {
    color: '#FFFFFF',
  },
  abContainer: {
    marginTop: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FDEDEC',
    borderRadius: 16,
    backgroundColor: '#FFFAFA',
    padding: 16,
  },
  abHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  abTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EA580C',
  },
  abContent: {
    gap: 12,
  },
  abLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
    marginBottom: 8,
  },
  abInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
    color: '#0B2D3E',
  },
  complianceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  complianceDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  activePill: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
  },
  audienceBox: {
    backgroundColor: '#FAFBFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  audienceLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 1,
  },
  audienceCount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0BA0B2',
    marginVertical: 4,
  },
  audienceSubText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  finalLaunchBtn: {
    backgroundColor: '#0B2D3E',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  finalLaunchBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  formDropdown: {
    marginTop: 4,
    backgroundColor: '#6A7D8C',
    borderRadius: 12,
    paddingVertical: 8,
    zIndex: 1000,
  },
  formDropDownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  formDropDownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  aiModalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 500,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  aiModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  aiModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  aiRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    zIndex: 2000,
  },
  aiCol: {
    flex: 1,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  aiSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  aiSelectorText: {
    fontSize: 13,
    color: '#0B2D3E',
    fontWeight: '600',
    flex: 1,
  },
  aiDropdown: {
    position: 'absolute',
    top: 68, // position below the selector + label
    left: 0,
    right: 0,
    backgroundColor: '#6A7D8C',
    borderRadius: 12,
    paddingVertical: 8,
    zIndex: 2100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aiDropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  aiDropdownItemText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  aiInputGroup: {
    marginBottom: 24,
  },
  aiTextArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    height: 120,
    fontSize: 14,
    color: '#0B2D3E',
    lineHeight: 20,
  },
  aiModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  aiCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  aiGenerateBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#5A6E7D', // Slate grey from screenshot
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiGenerateBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerUpdateBtn: {
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  headerUpdateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  // Campaign Intelligence Dashboard Styles
  intelStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  intelStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  intelStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  intelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  intelBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  intelStatLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
  },
  intelStatLargeValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  streamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  streamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  streamTable: {
    gap: 12,
  },
  streamTableHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  streamHeadText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  streamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  rowName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  rowSub: {
    fontSize: 10,
    color: '#64748B',
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  rowScore: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  engagementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  optimizedWindowBox: {
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  windowLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
  },
  windowTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  windowTime: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  windowSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  abOutcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  winnerBox: {
    borderWidth: 1,
    borderColor: '#10B981',
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 16,
  },
  winnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  winnerTopic: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
  },
  winnerLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  winnerStat: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0D9488',
  },
});
