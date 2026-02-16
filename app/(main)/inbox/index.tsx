import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

  return (
    <LinearGradient
      colors={['#F7FAFD', '#FFFFFF']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Inbox</Text>
          <Text style={styles.subtitle}>Stay on top of every conversation.</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['All', 'Email', 'SMS', 'WhatsApp'] as const).map((label) => {
          const isActive = activeFilter === label;
          return (
            <Pressable
              key={label}
              style={[styles.filterPill, isActive ? styles.filterPillActive : null]}
              onPress={() => setActiveFilter(label)}>
              <Text style={[styles.filterText, isActive ? styles.filterTextActive : null]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredConversations.map((item) => (
          <Pressable
            key={item.id}
            style={styles.row}
            onPress={() => router.push(`/(main)/inbox/${item.id}`)}>
            <View style={styles.rowHeader}>
              <Text style={styles.rowName}>{item.name}</Text>
              <View style={styles.rowMeta}>
                <Text style={styles.rowTime}>{item.time}</Text>
                {item.isUnread ? <View style={styles.unreadDot} /> : null}
              </View>
            </View>
            <Text style={styles.rowPreview} numberOfLines={2}>
              {item.preview}
            </Text>
            <Text style={styles.rowChannel}>{item.channel.toUpperCase()}</Text>
          </Pressable>
        ))}
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
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F7FBFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#7B8794',
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF2F6',
  },
  filterPillActive: {
    backgroundColor: '#0B2D3E',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B6B7A',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 28,
    gap: 12,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF4',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTime: {
    fontSize: 11.5,
    color: '#9AA7B6',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#0BA0B2',
  },
  rowPreview: {
    marginTop: 6,
    fontSize: 12.5,
    color: '#5B6B7A',
  },
  rowChannel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#0BA0B2',
  },
});
