import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

function formatDueDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const TABS = ['Today', 'Upcoming', 'Overdue'] as const;
type TabId = (typeof TABS)[number];

const TODAY_TASKS = [
  { id: '1', title: 'Send Appraisal Report', contact: 'Jessica Miller', dueLabel: 'Today, 2:00 PM', overdue: false },
  { id: '2', title: 'Schedule Second Viewing', contact: 'Robert Chen', dueLabel: 'Today, 4:30 PM', overdue: false },
  { id: '3', title: 'Initial Discovery Call', contact: 'David Wilson', dueLabel: 'Yesterday', overdue: true },
  { id: '4', title: 'Send Similar Listings', contact: 'Sarah Connor', dueLabel: 'Tomorrow', overdue: false },
];

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'] as const;

function TaskCard({
  title,
  contact,
  dueLabel,
  overdue,
}: {
  title: string;
  contact: string;
  dueLabel: string;
  overdue: boolean;
}) {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskCardTop}>
        <View style={[styles.taskIconWrap, overdue && styles.taskIconOverdue]}>
          {overdue ? (
            <MaterialCommunityIcons name="alert" size={22} color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="calendar-clock-outline" size={22} color="#0BA0B2" />
          )}
        </View>
        <View style={styles.taskCardBody}>
          <Text style={styles.taskTitle}>{title}</Text>
          <Text style={styles.taskContact}>Contact: {contact}</Text>
          <View style={styles.taskDueRow}>
            <Text style={styles.taskDueLabel}>DUE DATE</Text>
            <Text style={[styles.taskDueValue, overdue && styles.taskDueOverdue]}>{dueLabel}</Text>
          </View>
        </View>
      </View>
      <View style={styles.taskActions}>
        <Pressable style={styles.taskMarkDoneBtn}>
          <Text style={styles.taskMarkDoneText}>Mark Done</Text>
        </Pressable>
        <Pressable style={styles.taskRescheduleBtn}>
          <Text style={styles.taskRescheduleText}>Reschedule</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function FollowUpsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('Today');
  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState('Send Appraisal Report');
  const [contact, setContact] = useState('Jessica Miller');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDateForPicker, setTempDateForPicker] = useState(() => new Date());
  const [priority, setPriority] = useState<(typeof PRIORITY_OPTIONS)[number]>('High');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const dueDateDisplay = dueDate ? formatDueDate(dueDate) : '';

  const openDatePicker = () => {
    setTempDateForPicker(dueDate ?? new Date());
    setShowDatePicker(true);
  };

  const onDatePickerChange = (_event: { type: string }, selected?: Date) => {
    if (selected != null) setTempDateForPicker(selected);
    if (Platform.OS === 'android') {
      if (_event.type === 'set' && selected != null) setDueDate(selected);
      setShowDatePicker(false);
    }
  };

  const confirmDatePicker = () => {
    setDueDate(tempDateForPicker);
    setShowDatePicker(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPriorityOpen(false);
    setShowDatePicker(false);
  };

  const handleCreateTask = () => {
    closeModal();
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Follow-Ups</Text>
          <Text style={styles.subtitle}>
            Your action items and reminders for today.
          </Text>
        </View>
        <Pressable style={styles.addTaskBtn} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addTaskBtnText}>Add Task</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab}</Text>
              {isActive && <View style={styles.tabUnderline} />}
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'Today' && (
          <View style={styles.taskList}>
            {TODAY_TASKS.map((t) => (
              <TaskCard
                key={t.id}
                title={t.title}
                contact={t.contact}
                dueLabel={t.dueLabel}
                overdue={t.overdue}
              />
            ))}
          </View>
        )}

        {(activeTab === 'Upcoming' || activeTab === 'Overdue') && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No tasks</Text>
            <Text style={styles.emptySub}>
              {activeTab === 'Upcoming' ? 'No upcoming follow-ups.' : 'No overdue tasks.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Follow-Up Task Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <Pressable style={styles.modalBackdrop} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Follow-Up Task</Text>
              <Pressable onPress={closeModal} style={styles.modalCloseBtn} hitSlop={12}>
                <MaterialCommunityIcons name="close" size={22} color="#0B2D3E" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Task</Text>
                <TextInput
                  style={styles.modalInput}
                  value={task}
                  onChangeText={setTask}
                  placeholder="Send Appraisal Report"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Contact</Text>
                <TextInput
                  style={styles.modalInput}
                  value={contact}
                  onChangeText={setContact}
                  placeholder="Jessica Miller"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.modalRow}>
                <View style={[styles.modalField, { flex: 1 }]}>
                  <Text style={styles.modalLabel}>Due Date</Text>
                  <Pressable style={styles.modalInputWithIcon} onPress={openDatePicker}>
                    <Text style={[styles.modalDateText, !dueDateDisplay && styles.modalDatePlaceholder]}>
                      {dueDateDisplay || 'dd/mm/yyyy'}
                    </Text>
                    <MaterialCommunityIcons name="calendar-outline" size={20} color="#5B6B7A" />
                  </Pressable>
                  {Platform.OS === 'android' && showDatePicker && (
                    <DateTimePicker
                      value={tempDateForPicker}
                      mode="date"
                      display="default"
                      onChange={onDatePickerChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
                <View style={[styles.modalField, { flex: 1 }]}>
                  <Text style={styles.modalLabel}>Priority</Text>
                  <Pressable
                    style={styles.modalSelect}
                    onPress={() => setPriorityOpen((v) => !v)}>
                    <Text style={styles.modalSelectText}>{priority}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#5B6B7A" />
                  </Pressable>
                  {priorityOpen && (
                    <View style={styles.modalDropdown}>
                      {PRIORITY_OPTIONS.map((opt) => (
                        <Pressable
                          key={opt}
                          style={styles.modalDropdownItem}
                          onPress={() => {
                            setPriority(opt);
                            setPriorityOpen(false);
                          }}>
                          <Text style={styles.modalDropdownItemText}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add details..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalCancelBtn} onPress={closeModal}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalCreateBtn} onPress={handleCreateTask}>
                  <Text style={styles.modalCreateText}>Create Task</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* iOS date picker modal */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}>
          <Pressable style={styles.datePickerBackdrop} onPress={() => setShowDatePicker(false)}>
            <Pressable style={[styles.datePickerSheet, { paddingBottom: insets.bottom + 16 }]} onPress={(e) => e.stopPropagation()}>
              <View style={styles.datePickerHandle} />
              <Text style={styles.datePickerTitle}>Select due date</Text>
              <DateTimePicker
                value={tempDateForPicker}
                mode="date"
                display="spinner"
                onChange={onDatePickerChange}
                minimumDate={new Date()}
                style={styles.datePickerSpinner}
                textColor="#0B2D3E"
              />
              <Pressable style={styles.datePickerDoneBtn} onPress={confirmDatePicker}>
                <Text style={styles.datePickerDoneText}>Done</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
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
  headerCenter: { flex: 1, minWidth: 0 },
  title: { fontSize: 22, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.2 },
  subtitle: { fontSize: 13, color: '#5B6B7A', fontWeight: '600', marginTop: 4 },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    justifyContent: 'center',
  },
  addTaskBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  tabsWrap: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 },
  tab: { marginRight: 24, paddingVertical: 8, alignItems: 'center' },
  tabLabel: { fontSize: 15, fontWeight: '600', color: '#5B6B7A' },
  tabLabelActive: { color: '#0B2D3E', fontWeight: '800' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#0BA0B2',
    borderRadius: 1,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  taskList: { gap: 12 },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
  },
  taskCardTop: { flexDirection: 'row', gap: 12 },
  taskIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIconOverdue: { backgroundColor: '#DC2626' },
  taskCardBody: { flex: 1, minWidth: 0 },
  taskTitle: { fontSize: 16, fontWeight: '800', color: '#0B2D3E' },
  taskContact: { fontSize: 13, color: '#5B6B7A', marginTop: 4 },
  taskDueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  taskDueLabel: { fontSize: 11, fontWeight: '700', color: '#5B6B7A', letterSpacing: 0.3 },
  taskDueValue: { fontSize: 13, fontWeight: '700', color: '#0B2D3E' },
  taskDueOverdue: { color: '#DC2626' },
  taskActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  taskMarkDoneBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskMarkDoneText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  taskRescheduleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    backgroundColor: '#F8FBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskRescheduleText: { fontSize: 14, fontWeight: '700', color: '#0B2D3E' },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0B2D3E', marginTop: 12 },
  emptySub: { fontSize: 14, color: '#5B6B7A', marginTop: 6 },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0B2D3E' },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: { maxHeight: 520, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  modalRow: { flexDirection: 'row', gap: 12 },
  modalField: { marginBottom: 14 },
  modalLabel: { fontSize: 13, fontWeight: '700', color: '#5B6B7A', marginBottom: 6 },
  modalInput: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0B2D3E',
  },
  modalInputFlex: { flex: 1, fontSize: 15, color: '#0B2D3E', paddingVertical: 0 },
  modalInputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalDateText: { fontSize: 15, color: '#0B2D3E', fontWeight: '500' },
  modalDatePlaceholder: { color: '#9CA3AF', fontWeight: '400' },
  modalTextArea: { minHeight: 80, textAlignVertical: 'top' },
  modalSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalSelectText: { fontSize: 15, fontWeight: '600', color: '#0B2D3E' },
  modalDropdown: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    overflow: 'hidden',
  },
  modalDropdownItem: { paddingVertical: 12, paddingHorizontal: 14 },
  modalDropdownItemText: { fontSize: 15, fontWeight: '600', color: '#0B2D3E' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20, paddingTop: 16 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: '#0B2D3E' },
  modalCreateBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCreateText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  datePickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  datePickerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  datePickerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E3ECF4',
    alignSelf: 'center',
    marginBottom: 16,
  },
  datePickerTitle: { fontSize: 18, fontWeight: '800', color: '#0B2D3E', marginBottom: 8 },
  datePickerSpinner: { marginVertical: 8 },
  datePickerDoneBtn: {
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  datePickerDoneText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
});
