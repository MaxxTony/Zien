import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
  const [showModal, setShowModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDate, setNewItemDate] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [newItemType, setNewItemType] = useState('Calendar Event');
  const [newItemNotes, setNewItemNotes] = useState('');

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

  const handleCreateItem = () => {
    // Handle creation logic here
    setShowModal(false);
    setNewItemTitle('');
    setNewItemDate('');
    setNewItemTime('');
    setNewItemNotes('');
  };

  const renderCalendarTab = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={56} color="#0D9488" />
      </View>
      <Text style={styles.emptyTitle}>Interactive Calendar Interface</Text>
      <Text style={styles.emptySubtitle}>Google & Outlook 2-Way Sync Active</Text>
      <Pressable style={styles.syncButton}>
        <MaterialCommunityIcons name="sync" size={18} color="#FFFFFF" />
        <Text style={styles.syncButtonText}>Calendar Sync (GCal/Outlook)</Text>
      </Pressable>
      <Pressable style={styles.newEventButton} onPress={() => setShowModal(true)}>
        <MaterialCommunityIcons name="plus" size={20} color="#0B2D3E" />
        <Text style={styles.newEventButtonText}>New Event</Text>
      </Pressable>
    </View>
  );

  const renderBookingTab = () => (
    <View style={styles.contentArea}>
      {bookingLinks.map((link) => (
        <View key={link.id} style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <View style={styles.linkIconBox}>
              <MaterialCommunityIcons name="link-variant" size={20} color="#0D9488" />
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{link.duration}</Text>
            </View>
          </View>
          <Text style={styles.bookingTitle}>{link.title}</Text>
          <Text style={styles.bookingType}>Type: {link.type}</Text>
          <View style={styles.urlRow}>
            <Text style={styles.urlText} numberOfLines={1}>
              {link.url}
            </Text>
            <Pressable style={styles.copyButton}>
              <MaterialCommunityIcons name="content-copy" size={16} color="#64748B" />
            </Pressable>
          </View>
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Interface</Text>
          </Pressable>
        </View>
      ))}
      <Pressable style={styles.createCard} onPress={() => setShowModal(true)}>
        <MaterialCommunityIcons name="plus-circle-outline" size={48} color="#94A3B8" />
        <Text style={styles.createText}>Create New Booking Link</Text>
      </Pressable>
    </View>
  );

  const renderTasksTab = () => (
    <View style={styles.tasksArea}>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskCard}>
          <View style={styles.taskCardHeader}>
            <Text style={styles.taskCardTitle}>{task.title}</Text>
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerText}>{task.owner}</Text>
            </View>
          </View>

          <View style={styles.taskCardMeta}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#64748B" />
              <Text style={styles.metaText}>{task.dueDate}</Text>
            </View>
          </View>

          <View style={styles.taskCardFooter}>
            <View style={[styles.priorityBadge, styles[`priority${task.priority}`]]}>
              <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
            </View>
            <View style={[styles.statusBadge, task.status === 'completed' && styles.statusCompleted]}>
              <Text
                style={[styles.statusText, task.status === 'completed' && styles.statusTextCompleted]}>
                {task.status.toUpperCase()}
              </Text>
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
      colors={['#F0F4F8', '#FAFBFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>Scheduling & Workspace</Text>
            <Text style={styles.subtitle}>Sync your calendars, manage booking links, and stay on top of team tasks.</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            style={styles.tab}
            onPress={() => setActiveTab('calendar')}>
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.tabTextActive]}>
              Calendar
            </Text>
            {activeTab === 'calendar' && <View style={styles.tabIndicator} />}
          </Pressable>
          <Pressable
            style={styles.tab}
            onPress={() => setActiveTab('booking')}>
            <Text style={[styles.tabText, activeTab === 'booking' && styles.tabTextActive]}>
              Booking Links
            </Text>
            {activeTab === 'booking' && <View style={styles.tabIndicator} />}
          </Pressable>
          <Pressable
            style={styles.tab}
            onPress={() => setActiveTab('tasks')}>
            <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>
              Team Tasks
            </Text>
            {activeTab === 'tasks' && <View style={styles.tabIndicator} />}
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Calendar Sync (GCal/Outlook)</Text>
          </Pressable>
          <Pressable style={styles.actionButtonPrimary} onPress={() => setShowModal(true)}>
            <Text style={styles.actionButtonPrimaryText}>+ New Item</Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        {tabContent}
      </ScrollView>

      {/* Create New Item Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Item</Text>
              <Pressable onPress={() => setShowModal(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Open House - Malibu Villa"
                  placeholderTextColor="#94A3B8"
                  value={newItemTitle}
                  onChangeText={setNewItemTitle}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="dd/mm/yyyy"
                    placeholderTextColor="#94A3B8"
                    value={newItemDate}
                    onChangeText={setNewItemDate}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Time</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="--:-- --"
                    placeholderTextColor="#94A3B8"
                    value={newItemTime}
                    onChangeText={setNewItemTime}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type</Text>
                <View style={styles.selectInput}>
                  <Text style={styles.selectText}>{newItemType}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#64748B" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add details..."
                  placeholderTextColor="#94A3B8"
                  value={newItemNotes}
                  onChangeText={setNewItemNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Pressable style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.createButton} onPress={handleCreateItem}>
                <Text style={styles.createButtonText}>Create Item</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8EEF4',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  actionButtonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF4',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#0B2D3E',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#0B2D3E',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    minHeight: 400,
    justifyContent: 'center',
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: { elevation: 1 },
    }),
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0D9488',
    borderRadius: 12,
  },
  syncButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8EEF4',
  },
  newEventButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  contentArea: {
    gap: 16,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    gap: 12,
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
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D9488',
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  bookingType: {
    fontSize: 13,
    color: '#64748B',
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8EEF4',
  },
  urlText: {
    fontSize: 13,
    color: '#0D9488',
    fontWeight: '600',
    flex: 1,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  editButton: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EEF4',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 48,
    borderWidth: 2,
    borderColor: '#E8EEF4',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    gap: 12,
  },
  createText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#94A3B8',
  },
  // Task Card Styles
  tasksArea: {
    gap: 14,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
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
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  taskCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2D3E',
    flex: 1,
  },
  taskCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  taskCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priorityhigh: {
    backgroundColor: '#FEE2E2',
  },
  prioritymedium: {
    backgroundColor: '#FEF3C7',
  },
  prioritylow: {
    backgroundColor: '#F1F5F9',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  statusTextCompleted: {
    color: '#059669',
  },
  ownerBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
      },
      android: { elevation: 8 },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#0B2D3E',
    borderWidth: 1,
    borderColor: '#E8EEF4',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 14,
    color: '#0B2D3E',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E8EEF4',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  createButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
