import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    if (activeFilter === 'All') {
      return conversations;
    }
    return conversations.filter((item) => item.channel === activeFilter);
  }, [activeFilter, conversations]);

  const unreadCount = conversations.filter((c) => c.isUnread).length;

  return (
    <LinearGradient
      colors={['#F0F4F8', '#FAFBFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Inbox</Text>
          </View>
          <Text style={styles.subtitle}>Stay on top of every conversation.</Text>
        </View>
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

      {/* Conversation List */}
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}>
        {filteredConversations.map((item, index) => {
          const channelColor = getChannelColor(item.channel);
          const channelIcon = getChannelIcon(item.channel);

          return (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.card,
                item.isUnread && styles.cardUnread,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push(`/(main)/inbox/${item.id}`)}>
              {/* Channel Icon Badge */}
              <View style={[styles.channelBadge, { backgroundColor: channelColor }]}>
                <MaterialCommunityIcons name={channelIcon} size={18} color="#FFFFFF" />
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardName, item.isUnread && styles.cardNameUnread]}>
                    {item.name}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardTime}>{item.time}</Text>
                    {item.isUnread && <View style={styles.unreadIndicator} />}
                  </View>
                </View>

                <Text style={styles.cardPreview} numberOfLines={2}>
                  {item.preview}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={[styles.channelTag, { backgroundColor: `${channelColor}15` }]}>
                    <Text style={[styles.channelTagText, { color: channelColor }]}>
                      {item.channel}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={18} color="#C5D0DB" />
                </View>
              </View>
            </Pressable>
          );
        })}
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
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.5,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8EEF4',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingTop: 8,
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  cardUnread: {
    borderColor: '#0D9488',
    borderWidth: 1.5,
    backgroundColor: '#F0FDFA',
  },
  cardPressed: {
    opacity: 0.7,
  },
  channelBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  cardContent: {
    flex: 1,
    gap: 8,
    minWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2D3E',
    flex: 1,
  },
  cardNameUnread: {
    fontWeight: '800',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  cardTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#EF4444',
  },
  cardPreview: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  channelTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  channelTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
