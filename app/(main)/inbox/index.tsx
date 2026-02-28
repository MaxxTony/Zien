import { PageHeader } from '@/components/ui';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ChannelType = 'WhatsApp' | 'Email' | 'SMS';

type Conversation = {
  id: string;
  name: string;
  channel: ChannelType;
  preview: string;
  time: string;
  isUnread?: boolean;
};

const getChannelIcon = (channel: ChannelType) => {
  switch (channel) {
    case 'WhatsApp':
      return 'whatsapp';
    case 'Email':
      return 'email-outline';
    case 'SMS':
      return 'message-text-outline';
  }
};

const getChannelColor = (channel: ChannelType) => {
  switch (channel) {
    case 'WhatsApp':
      return '#0D9488'; // Teal
    case 'Email':
      return '#0EA5E9'; // Blue
    case 'SMS':
      return '#64748B'; // Slate Grey
  }
};

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'All' | ChannelType>('All');

  const [searchQuery, setSearchQuery] = useState('');

  const conversations = useMemo<Conversation[]>(
    () => [
      {
        id: 'jessica-miller',
        name: 'Jessica Miller',
        channel: 'WhatsApp',
        preview: 'Hey, is the open house still on for Sunday?',
        time: '2m ago',
        isUnread: true,
      },
      {
        id: 'robert-chen',
        name: 'Robert Chen',
        channel: 'Email',
        preview: "I received the appraisal, thank you! Let's chat soon.",
        time: '1h ago',
      },
      {
        id: 'david-wilson',
        name: 'David Wilson',
        channel: 'SMS',
        preview: 'Can we schedule a call for tomorrow morning?',
        time: '3h ago',
      },
      {
        id: 'sarah-connor',
        name: 'Sarah Connor',
        channel: 'Email',
        preview: 'The offer has been sent to your email.',
        time: '5h ago',
      },
      {
        id: 'michael-scott',
        name: 'Michael Scott',
        channel: 'WhatsApp',
        preview: "I'm really interested in the Slough Ave property.",
        time: '1d ago',
      },
    ],
    []
  );

  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      const matchesFilter = activeFilter === 'All' || item.channel === activeFilter;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.preview.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, conversations, searchQuery]);

  const renderConversation = ({ item }: { item: Conversation }) => {
    const channelColor = getChannelColor(item.channel);
    const channelIcon = getChannelIcon(item.channel);

    return (
      <Pressable
        key={item.id}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={() => router.push(`/(main)/inbox/${item.id}`)}>
        {/* Compact Avatar/Icon */}
        <View style={[styles.avatarBox, { backgroundColor: `${channelColor}12` }]}>
          <MaterialCommunityIcons name={channelIcon} size={20} color={channelColor} />
          {item.isUnread && <View style={styles.unreadDot} />}
        </View>

        {/* Content */}
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardName, item.isUnread && styles.cardNameUnread]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>

          <View style={styles.previewRow}>
            <Text style={[styles.cardPreview, item.isUnread && styles.cardPreviewUnread]} numberOfLines={1}>
              {item.preview}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={16} color="#BCCCDC" />
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={['#F4F7FB', '#FFFFFF']}
      style={[styles.container, { paddingTop: insets.top }]}>

      <PageHeader
        title="Inbox"
        subtitle="Conversations from all channels"
        onBack={() => router.back()}
      />

      <View style={styles.actionSection}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
          <TextInput
            placeholder="Search name or message..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['All', 'Email', 'SMS', 'WhatsApp'] as const).map((label) => {
            const isActive = activeFilter === label;
            return (
              <Pressable
                key={label}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(label)}>
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="message-off-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Theme.textPrimary,
    marginLeft: 10,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#102A43',
    borderColor: '#102A43',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 2, // Tight gap for list style
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardPressed: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A43',
  },
  cardNameUnread: {
    fontWeight: '900',
  },
  cardTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardPreview: {
    fontSize: 13,
    color: '#627D98',
    lineHeight: 18,
  },
  cardPreviewUnread: {
    color: '#334E68',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
