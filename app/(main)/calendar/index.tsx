import { PageHeader } from '@/components/ui';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
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
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(new Date());

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
    setShowModal(false);
    setNewItemTime('');
    setNewItemNotes('');
    setNewItemType('Calendar Event');
    setIsEditing(false);
  };

  const openCreateModal = (type: string = 'Calendar Event') => {
    setIsEditing(false);
    setNewItemTitle('');
    setNewItemDate('');
    setNewItemTime('');
    setNewItemNotes('');
    setNewItemType(type);
    setShowModal(true);
  };

  const openEditModal = (item: any, type: string) => {
    setIsEditing(true);
    setNewItemTitle(item.title);
    setNewItemType(type);
    // For demo purposes, we can pre-set some fields
    setNewItemDate(new Date().toLocaleDateString('en-US'));
    setNewItemTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    setShowModal(true);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateValue(selectedDate);
      setNewItemDate(selectedDate.toLocaleDateString('en-US'));
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTimeValue(selectedTime);
      setNewItemTime(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    }
  };

  const renderCalendarTab = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <MaterialCommunityIcons name="calendar-clock-outline" size={56} color={Theme.accentTeal} />
      </View>
      <Text style={styles.emptyTitle}>Your Workspace Schedule</Text>
      <Text style={styles.emptySubtitle}>Sync your personal and work calendars to see all events here in one place.</Text>

      <View style={styles.syncRow}>
        <Pressable style={styles.syncPill}>
          <MaterialCommunityIcons name="google" size={16} color="#64748B" />
          <Text style={styles.syncPillText}>Google</Text>
        </Pressable>
        <Pressable style={styles.syncPill}>
          <MaterialCommunityIcons name="microsoft-outlook" size={16} color="#64748B" />
          <Text style={styles.syncPillText}>Outlook</Text>
        </Pressable>
      </View>

      <Pressable style={styles.mainActionBtn} onPress={() => openCreateModal('Calendar Event')}>
        <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.mainActionBtnText}>Create New Event</Text>
      </Pressable>
    </View>
  );

  const renderBookingTab = () => (
    <View style={styles.contentArea}>
      {bookingLinks.map((link) => (
        <View key={link.id} style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <View style={styles.linkIconBox}>
              <MaterialCommunityIcons name="link-variant" size={20} color={Theme.accentTeal} />
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
          <Pressable style={styles.editButton} onPress={() => openEditModal(link, 'Booking Link')}>
            <Text style={styles.editButtonText}>Edit Interface</Text>
          </Pressable>
        </View>
      ))}
      <Pressable style={styles.createCard} onPress={() => openCreateModal('Booking Link')}>
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
  }, [activeTab, tasks, bookingLinks]);

  return (
    <View style={[styles.background, { paddingTop: insets.top }]}>
      <PageHeader
        title="Calendar"
        subtitle="Manage events, bookings, and tasks"
        onBack={() => router.back()}
        rightIcon="calendar-sync-outline"
        onRightPress={() => { }}
      />

      <View style={styles.tabContainer}>
        {/* Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, activeTab === 'calendar' && styles.tabActive]}
            onPress={() => setActiveTab('calendar')}>
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.tabTextActive]}>
              Calendar
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'booking' && styles.tabActive]}
            onPress={() => setActiveTab('booking')}>
            <Text style={[styles.tabText, activeTab === 'booking' && styles.tabTextActive]}>
              Bookings
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'tasks' && styles.tabActive]}
            onPress={() => setActiveTab('tasks')}>
            <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>
              Tasks
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.floatingAddBtn}
          onPress={() => openCreateModal()}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}>
        {/* Tab Content */}
        {tabContent}
      </ScrollView>

      {/* Create New Item Full-Page Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalScreen, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Item' : 'Create New Event'}</Text>
            <Pressable onPress={() => setShowModal(false)} style={styles.closeCircle}>
              <MaterialCommunityIcons name="close" size={18} color="#102A43" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>Type</Text>
              <View style={styles.pillRow}>
                {(['Calendar Event', 'Booking Link', 'Team Task'] as const).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setNewItemType(type)}
                    style={[
                      styles.pill,
                      newItemType === type && styles.pillActive
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        type === 'Calendar Event' ? 'calendar-star' :
                          type === 'Booking Link' ? 'link-variant' : 'calendar-check-outline'
                      }
                      size={16}
                      color={newItemType === type ? '#FFF' : '#64748B'}
                    />
                    <Text style={[
                      styles.pillText,
                      newItemType === type && styles.pillTextActive
                    ]}>
                      {type === 'Calendar Event' ? 'Event' : type === 'Booking Link' ? 'Booking' : 'Task'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>Title</Text>
              <TextInput
                style={styles.fullInput}
                placeholder="e.g. Property Listing with David"
                placeholderTextColor={Theme.inputPlaceholder}
                value={newItemTitle}
                onChangeText={setNewItemTitle}
              />
            </View>

            <View style={styles.formSection}>
              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Text style={styles.sectionLabel}>Date</Text>
                  <Pressable
                    style={styles.inputIconBox}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <TextInput
                      style={styles.rowInput}
                      placeholder="dd/mm/yyyy"
                      placeholderTextColor={Theme.inputPlaceholder}
                      value={newItemDate}
                      editable={false}
                      pointerEvents="none"
                    />
                    <MaterialCommunityIcons name="calendar-month-outline" size={18} color="#64748B" />
                  </Pressable>
                </View>
                <View style={styles.formColumn}>
                  <Text style={styles.sectionLabel}>Time</Text>
                  <Pressable
                    style={styles.inputIconBox}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <TextInput
                      style={styles.rowInput}
                      placeholder="--:-- --"
                      placeholderTextColor={Theme.inputPlaceholder}
                      value={newItemTime}
                      editable={false}
                      pointerEvents="none"
                    />
                    <MaterialCommunityIcons name="clock-outline" size={18} color="#64748B" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Bottom Sheet for Date Picker */}
            <Modal
              visible={showDatePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <Pressable style={styles.pickerBackdrop} onPress={() => setShowDatePicker(false)}>
                <View style={styles.pickerSheet}>
                  <View style={styles.pickerToolbar}>
                    <Text style={styles.pickerTitle}>Select Date</Text>
                    <Pressable onPress={() => setShowDatePicker(false)} style={styles.doneBtn}>
                      <Text style={styles.doneBtnText}>Done</Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    textColor="#102A43"
                    style={styles.pickerInternal}
                  />
                </View>
              </Pressable>
            </Modal>

            {/* Bottom Sheet for Time Picker */}
            <Modal
              visible={showTimePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowTimePicker(false)}
            >
              <Pressable style={styles.pickerBackdrop} onPress={() => setShowTimePicker(false)}>
                <View style={styles.pickerSheet}>
                  <View style={styles.pickerToolbar}>
                    <Text style={styles.pickerTitle}>Select Time</Text>
                    <Pressable onPress={() => setShowTimePicker(false)} style={styles.doneBtn}>
                      <Text style={styles.doneBtnText}>Done</Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={timeValue}
                    mode="time"
                    display="spinner"
                    is24Hour={false}
                    onChange={onTimeChange}
                    textColor="#102A43"
                    style={styles.pickerInternal}
                  />
                </View>
              </Pressable>
            </Modal>

            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add details..."
                placeholderTextColor={Theme.inputPlaceholder}
                value={newItemNotes}
                onChangeText={setNewItemNotes}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.saveBtnLarge}
                onPress={handleCreateItem}
              >
                <Text style={styles.saveBtnLargeText}>{isEditing ? 'Save Changes' : 'Save'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 42, 67, 0.04)',
    padding: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#102A43',
  },
  floatingAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#102A43',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#102A43',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: `${Theme.accentTeal}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#102A43',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#627D98',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  syncRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  syncPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  mainActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#102A43',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  mainActionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  contentArea: {
    gap: 12,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  linkIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${Theme.accentTeal}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    backgroundColor: `${Theme.accentTeal}10`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '900',
    color: Theme.accentTeal,
  },
  bookingTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#102A43',
    marginBottom: 4,
  },
  bookingType: {
    fontSize: 13,
    color: '#627D98',
    fontWeight: '500',
    marginBottom: 16,
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  urlText: {
    fontSize: 13,
    color: Theme.accentTeal,
    fontWeight: '700',
    flex: 1,
  },
  copyButton: {
    padding: 4,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#102A43',
  },
  createCard: {
    backgroundColor: 'rgba(16, 42, 67, 0.02)',
    borderRadius: 20,
    padding: 40,
    borderWidth: 2,
    borderColor: '#D1D9E4',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    gap: 12,
  },
  createText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#627D98',
  },
  tasksArea: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#102A43',
    flex: 1,
    marginRight: 10,
  },
  ownerBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#102A43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  taskCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#627D98',
    fontWeight: '600',
  },
  taskCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  priorityhigh: { backgroundColor: '#FEE2E2' },
  prioritymedium: { backgroundColor: '#FEF3C7' },
  prioritylow: { backgroundColor: '#F1F5F9' },
  priorityText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#334E68',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  statusCompleted: { backgroundColor: '#D1FAE5' },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748B',
  },
  statusTextCompleted: { color: '#047857' },

  // ── Modal Styles ──
  modalScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#102A43',
    letterSpacing: -0.5,
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalForm: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#102A43',
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: '#102A43',
    borderColor: '#102A43',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  fullInput: {
    fontSize: 15,
    fontWeight: '600',
    color: '#102A43',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formColumn: {
    flex: 1,
  },
  inputIconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowInput: {
    fontSize: 15,
    fontWeight: '600',
    color: '#102A43',
    flex: 1,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#102A43',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingBottom: 40,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A43',
  },
  saveBtnLarge: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#102A43',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  saveBtnLargeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // ── Picker Bottom Sheet Styles ──
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    alignItems: 'center', // Fixes the centering issue
  },
  pickerInternal: {
    width: Dimensions.get('window').width, // Forces full width container
    height: 220,
  },
  pickerToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    width: '100%', // Ensures the toolbar spans full width even if parent is centered
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#102A43',
  },
  doneBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#102A43',
    borderRadius: 8,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
