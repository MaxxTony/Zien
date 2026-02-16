import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabKey = 'calendar' | 'booking' | 'tasks';

type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  owner: string;
};

type BookingLink = {
  id: string;
  title: string;
  duration: string;
  type: string;
  url: string;
};

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('calendar');

  const tasks = useMemo<Task[]>(
    () => [
      {
        id: 'task-1',
        title: 'Follow up with Jessica Miller',
        dueDate: 'Today, 2:00 PM',
        priority: 'high',
        status: 'pending',
        owner: 'BS',
      },
      {
        id: 'task-2',
        title: 'Prepare CMA for Malibu Villa',
        dueDate: 'Tomorrow',
        priority: 'medium',
        status: 'pending',
        owner: 'BS',
      },
      {
        id: 'task-3',
        title: 'Send anniversary email to Sam',
        dueDate: 'Jan 31',
        priority: 'low',
        status: 'completed',
        owner: 'BS',
      },
    ],
    []
  );

  const bookingLinks = useMemo<BookingLink[]>(
    () => [
      {
        id: 'link-1',
        title: '15 Min Consultation',
        duration: '15M',
        type: 'Virtual',
        url: 'zien.ai/becker/consult',
      },
      {
        id: 'link-2',
        title: 'Property Showing',
        duration: '45M',
        type: 'On-Site',
        url: 'zien.ai/becker/showing',
      },
      {
        id: 'link-3',
        title: 'Listing Presentation',
        duration: '60M',
        type: 'Virtual/In-Person',
        url: 'zien.ai/becker/pitch',
      },
    ],
    []
  );

  const renderCalendarTab = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={48} color="#7B8794" />
      </View>
      <Text style={styles.emptyTitle}>Interactive Calendar Interface</Text>
      <Text style={styles.emptySubtitle}>Google & Outlook 2-Way Sync Active</Text>
      <Pressable style={styles.syncButton}>
        <Text style={styles.syncButtonText}>Calendar Sync (GCal/Outlook)</Text>
      </Pressable>
    </View>
  );

  const renderBookingTab = () => (
    <View style={styles.contentArea}>
      {bookingLinks.map((link) => (
        <View key={link.id} style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <View style={styles.linkIconBox}>
              <MaterialCommunityIcons name="link-variant" size={18} color="#5B6B7A" />
            </View>
            <Text style={styles.bookingDuration}>{link.duration}</Text>
          </View>
          <Text style={styles.bookingTitle}>{link.title}</Text>
          <Text style={styles.bookingType}>Type: {link.type}</Text>
          <View style={styles.urlRow}>
            <Text style={styles.urlText}>{link.url}</Text>
            <Pressable style={styles.copyButton}>
              <MaterialCommunityIcons name="content-copy" size={14} color="#7B8794" />
            </Pressable>
          </View>
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Interface</Text>
          </Pressable>
        </View>
      ))}
      <Pressable style={styles.createCard}>
        <MaterialCommunityIcons name="plus" size={32} color="#9AA7B6" />
        <Text style={styles.createText}>Create New Booking Link</Text>
      </Pressable>
    </View>
  );

  const renderTasksTab = () => (
    <View style={styles.taskContainer}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskHeaderText}>ASSIGNMENT / TASK</Text>
        <Text style={styles.taskHeaderText}>DUE</Text>
      </View>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskRow}>
          <View style={styles.taskLeft}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={styles.taskMeta}>
              <View style={[styles.priorityBadge, styles[`priority-${task.priority}`]]}>
                <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, task.status === 'completed' ? styles.statusCompleted : null]}>
                <Text style={[styles.statusText, task.status === 'completed' ? styles.statusTextCompleted : null]}>
                  {task.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.taskRight}>
            <Text style={styles.taskDue}>{task.dueDate}</Text>
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerText}>{task.owner}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'booking':
        return renderBookingTab();
      case 'tasks':
        return renderTasksTab();
      default:
        return renderCalendarTab();
    }
  }, [activeTab]);

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#0B2D3E" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>Scheduling & Workspace</Text>
            <Text style={styles.subtitle}>Sync calendars, booking links, and team tasks.</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, activeTab === 'calendar' ? styles.tabActive : null]}
            onPress={() => setActiveTab('calendar')}>
            <Text style={[styles.tabText, activeTab === 'calendar' ? styles.tabTextActive : null]}>Calendar</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'booking' ? styles.tabActive : null]}
            onPress={() => setActiveTab('booking')}>
            <Text style={[styles.tabText, activeTab === 'booking' ? styles.tabTextActive : null]}>Booking Links</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'tasks' ? styles.tabActive : null]}
            onPress={() => setActiveTab('tasks')}>
            <Text style={[styles.tabText, activeTab === 'tasks' ? styles.tabTextActive : null]}>Team Tasks</Text>
          </Pressable>
        </View>

        {tabContent}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 18,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#5B6B7A',
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  tabActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#7B8794',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#F7FBFF',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    minHeight: 380,
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B2D3E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#7B8794',
  },
  syncButton: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  syncButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  contentArea: {
    gap: 16,
  },
  bookingCard: {
    backgroundColor: '#F7FBFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 10,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingDuration: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  bookingType: {
    fontSize: 12,
    color: '#7B8794',
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  urlText: {
    fontSize: 12,
    color: '#0BA0B2',
    fontWeight: '600',
    flex: 1,
  },
  copyButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FBFF',
  },
  editButton: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  editButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  createCard: {
    backgroundColor: '#F7FBFF',
    borderRadius: 18,
    padding: 48,
    borderWidth: 2,
    borderColor: '#DFE6EF',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  createText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9AA7B6',
    marginTop: 10,
  },
  taskContainer: {
    backgroundColor: '#F7FBFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    gap: 14,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E3ECF4',
  },
  taskHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7B8794',
    letterSpacing: 0.5,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3F8',
  },
  taskLeft: {
    flex: 1,
    gap: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  'priority-high': {
    backgroundColor: '#FFE5E5',
  },
  'priority-medium': {
    backgroundColor: '#FFF4E5',
  },
  'priority-low': {
    backgroundColor: '#F0F0F0',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F0F0F0',
  },
  statusCompleted: {
    backgroundColor: '#E5F8F0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  statusTextCompleted: {
    color: '#0BA688',
  },
  taskRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  taskDue: {
    fontSize: 12.5,
    color: '#5B6B7A',
  },
  ownerBadge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
