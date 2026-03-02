import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = ['All', 'Today', 'Upcoming', 'Overdue', 'Completed'] as const;
type TabId = (typeof TABS)[number];

const TASKS = [
  {
    id: '1',
    title: 'Send Appraisal Report',
    contact: 'Jessica Miller',
    tags: ['#Urgent', '#Report'],
    group: 'Sales',
    dueDate: 'Today, 14:00',
    priority: 'High',
    status: 'pending',
    icon: 'calendar-check-outline',
    isOverdue: false,
  },
  {
    id: '2',
    title: 'Schedule Second Viewing',
    contact: 'Robert Chen',
    tags: ['#Follow-up'],
    group: 'Viewing',
    dueDate: 'Today, 16:30',
    priority: 'Medium',
    status: 'pending',
    icon: 'calendar-clock-outline',
    isOverdue: false,
  },
  {
    id: '3',
    title: 'Initial Discovery Call',
    contact: 'David Wilson',
    tags: ['#New'],
    group: 'Leads',
    dueDate: 'Yesterday',
    priority: 'High',
    status: 'overdue',
    icon: 'alert-circle-outline',
    isOverdue: true,
  },
  {
    id: '4',
    title: 'Send Similar Listings',
    contact: 'Sarah Connor',
    tags: ['#Inventory'],
    group: 'Sales',
    dueDate: 'Tomorrow',
    priority: 'Low',
    status: 'pending',
    icon: 'calendar-text-outline',
    isOverdue: false,
  },
  {
    id: '5',
    title: 'Contract Review',
    contact: 'Michael Scott',
    tags: ['#Archived'],
    group: 'Legal',
    dueDate: '12 Feb 2026',
    priority: 'Medium',
    status: 'completed',
    icon: 'check-circle-outline',
    isOverdue: false,
  },
];

function TaskCard({
  task,
  onEdit,
  onDelete,
  onReschedule,
  onDone
}: {
  task: typeof TASKS[number],
  onEdit: () => void,
  onDelete: () => void,
  onReschedule: () => void,
  onDone: () => void
}) {
  const isHigh = task.priority === 'High';
  const isMedium = task.priority === 'Medium';
  const isLow = task.priority === 'Low';
  const isCompleted = task.status === 'completed';

  const priorityColor = isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#64748B';
  const priorityBg = isHigh ? '#FEF2F2' : isMedium ? '#FFFBEB' : '#F1F5F9';

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      <View style={styles.cardMain}>
        <View style={[styles.cardIconWrap, task.isOverdue && styles.cardIconOverdue, isCompleted && styles.cardIconCompleted]}>
          <MaterialCommunityIcons
            name={isCompleted ? 'check-circle' : task.icon as any}
            size={22}
            color={task.isOverdue ? '#EF4444' : isCompleted ? '#10B981' : '#64748B'}
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, isCompleted && styles.cardTitleCompleted]} numberOfLines={1}>
              {task.title}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: priorityBg }]}>
              <Text style={[styles.priorityText, { color: priorityColor }]}>{task.priority}</Text>
            </View>
          </View>

          <Text style={styles.cardContact}>
            Contact: <Text style={styles.cardContactName}>{task.contact}</Text>
          </Text>

          <View style={styles.tagsRow}>
            {task.tags.map(tag => (
              <View style={styles.tagPill} key={tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="folder-outline" size={14} color="#64748B" />
              <Text style={styles.infoText}>{task.group}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name={task.isOverdue ? "alert-circle-outline" : "clock-outline"}
                size={14}
                color={task.isOverdue ? "#EF4444" : "#64748B"}
              />
              <Text style={[styles.infoText, task.isOverdue && { color: '#EF4444', fontWeight: '700' }]}>
                {task.dueDate}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.cardActions, isCompleted && { justifyContent: 'flex-end' }]}>
        {!isCompleted && (
          <View style={styles.actionIcons}>
            <Pressable style={styles.actionIconBtn} onPress={onDone}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color="#0B2D3E"
              />
            </Pressable>
            <Pressable style={styles.actionIconBtn} onPress={onEdit}>
              <MaterialCommunityIcons name="pencil-outline" size={20} color="#0B2D3E" />
            </Pressable>
            <Pressable style={styles.actionIconBtn} onPress={onDelete}>
              <MaterialCommunityIcons name="delete-outline" size={20} color="#EF4444" />
            </Pressable>
          </View>
        )}

        {isCompleted ? (
          <View style={styles.completedBadge}>
            <MaterialCommunityIcons name="check" size={14} color="#10B981" />
            <Text style={styles.completedLabel}>Completed</Text>
          </View>
        ) : (
          <Pressable style={styles.rescheduleBtn} onPress={onReschedule}>
            <MaterialCommunityIcons name="calendar-sync-outline" size={16} color="#0B2D3E" />
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function FollowUpsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('All');
  const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<typeof TASKS[number] | null>(null);
  const [deletingTask, setDeletingTask] = useState<typeof TASKS[number] | null>(null);
  const [tasksList, setTasksList] = useState(TASKS);
  const [rescheduleTask, setRescheduleTask] = useState<typeof TASKS[number] | null>(null);

  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [tagFilter, setTagFilter] = useState('All Tags');
  const [isGroupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setTagDropdownOpen] = useState(false);

  // Add Task Modal Form States
  const [modalSubject, setModalSubject] = useState('');
  const [modalContact, setModalContact] = useState('');
  const [modalDate, setModalDate] = useState(new Date());
  const [modalGroup, setModalGroup] = useState('Viewing');
  const [modalTag, setModalTag] = useState('Report');
  const [modalPriority, setModalPriority] = useState('Low');
  const [modalColor, setModalColor] = useState('#8B5CF6');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalGroupDropdownOpen, setModalGroupDropdownOpen] = useState(false);
  const [isModalTagDropdownOpen, setModalTagDropdownOpen] = useState(false);

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState(new Date());
  const [showReschedulePicker, setShowReschedulePicker] = useState(false);

  const TAG_COLORS = ['#0BA0B2', '#F97316', '#0F172A', '#6366F1', '#10B981', '#64748B', '#EC4899', '#8B5CF6'];
  const GROUP_OPTIONS = ['All Groups', 'Sales', 'Viewing', 'Leads', 'Legal'];
  const TAG_OPTIONS = ['All Tags', '#Urgent', '#Report', '#Follow-up', '#New', '#Inventory', '#Archived'];

  const MODAL_GROUP_OPTIONS = ['Sales', 'Marketing', 'Viewing', 'Custom Group...'];
  const MODAL_TAG_OPTIONS = ['Urgent', 'Follow-up', 'Report', 'Custom Tag...'];

  const openAddModal = () => {
    setEditingTask(null);
    setModalSubject('');
    setModalContact('');
    setModalDate(new Date());
    setModalGroup('Viewing');
    setModalTag('Report');
    setModalPriority('Low');
    setModalColor('#8B5CF6');
    setAddTaskModalVisible(true);
  };

  const openEditModal = (task: typeof TASKS[number]) => {
    setEditingTask(task);
    setModalSubject(task.title);
    setModalContact(task.contact);
    // Rough date parsing for demo
    setModalDate(new Date());
    setModalGroup(task.group);
    setModalTag(task.tags[0].replace('#', ''));
    setModalPriority(task.priority);
    setModalColor('#0BA0B2');
    setAddTaskModalVisible(true);
  };

  const filteredTasks = tasksList.filter(task => {
    const matchGroup = groupFilter === 'All Groups' || task.group === groupFilter;
    const matchTag = tagFilter === 'All Tags' || task.tags.includes(tagFilter);
    if (!matchGroup || !matchTag) return false;

    if (activeTab === 'Today') {
      return task.dueDate.startsWith('Today') && task.status !== 'completed';
    }
    if (activeTab === 'Upcoming') {
      return !task.dueDate.startsWith('Today') && !task.isOverdue && task.status !== 'completed';
    }
    if (activeTab === 'Overdue') {
      return task.isOverdue && task.status !== 'completed';
    }
    if (activeTab === 'Completed') {
      return task.status === 'completed';
    }

    return true;
  });

  const markTaskDone = (id: string) => {
    setTasksList(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', isOverdue: false } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasksList(prev => prev.filter(t => t.id !== id));
    setDeletingTask(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageHeader
        title="Follow-Ups"
        subtitle="Manage automated and manual interactions with your prospects."
        onBack={() => router.back()}
        rightIcon="plus"
        onRightPress={openAddModal}
      />

      <View style={styles.topTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.searchAndFilterBar}>
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#8DA4B5" />
          <TextInput
            placeholder="Search by contact or subject..."
            placeholderTextColor="#8DA4B5"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.refineByRow}>
        <Text style={styles.refineLabel}>Refine by:</Text>
        <View style={styles.filterActionsRow}>
          <View style={{ zIndex: 2000 }}>
            <Pressable
              style={styles.filterDropdown}
              onPress={() => { setGroupDropdownOpen(!isGroupDropdownOpen); setTagDropdownOpen(false); }}
            >
              <Text style={styles.filterDropdownText}>{groupFilter}</Text>
              <MaterialCommunityIcons name={isGroupDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
            </Pressable>
            {isGroupDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {GROUP_OPTIONS.map(opt => (
                  <Pressable key={opt} style={styles.dropdownItem} onPress={() => { setGroupFilter(opt); setGroupDropdownOpen(false); }}>
                    {groupFilter === opt && (
                      <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={styles.dropdownCheckIcon} />
                    )}
                    <Text style={[styles.dropdownItemText, groupFilter === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={{ zIndex: 1000 }}>
            <Pressable
              style={styles.filterDropdown}
              onPress={() => { setTagDropdownOpen(!isTagDropdownOpen); setGroupDropdownOpen(false); }}
            >
              <Text style={styles.filterDropdownText}>{tagFilter}</Text>
              <MaterialCommunityIcons name={isTagDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
            </Pressable>
            {isTagDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {TAG_OPTIONS.map(opt => (
                  <Pressable key={opt} style={styles.dropdownItem} onPress={() => { setTagFilter(opt); setTagDropdownOpen(false); }}>
                    {tagFilter === opt && (
                      <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={styles.dropdownCheckIcon} />
                    )}
                    <Text style={[styles.dropdownItemText, tagFilter === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {filteredTasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onEdit={() => openEditModal(t)}
            onDelete={() => setDeletingTask(t)}
            onDone={() => markTaskDone(t.id)}
            onReschedule={() => setRescheduleTask(t)}
          />
        ))}
        {filteredTasks.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#8DA4B5', fontWeight: 'bold' }}>No tasks found matching these filters.</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Task Modal (Full Page) */}
      <Modal
        visible={isAddTaskModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddTaskModalVisible(false)}
      >
        <View style={[styles.fullPageModal, { paddingTop: insets.top }]}>
          <View style={styles.premiumModalHeader}>
            <View>
              <Text style={styles.fullScreenModalTitle}>
                {editingTask ? 'Edit Follow-Up' : 'Add Follow-Up'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {editingTask
                  ? 'Update your follow-up task details below.'
                  : 'Schedule a manual follow-up task with intelligence.'}
              </Text>
            </View>
            <Pressable style={styles.fullScreenModalCloseIcon} onPress={() => setAddTaskModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContent} contentContainerStyle={{ paddingBottom: 120 }}>
            <View style={styles.modalBody}>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Subject</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Call to discuss pricing"
                  placeholderTextColor="#8DA4B5"
                  value={modalSubject}
                  onChangeText={setModalSubject}
                />
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Contact Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Search contacts..."
                  placeholderTextColor="#8DA4B5"
                  value={modalContact}
                  onChangeText={setModalContact}
                />
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Due Date</Text>
                <Pressable style={styles.modalInputWithIcon} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.modalDateText}>
                    {modalDate.toLocaleDateString('en-GB')} {modalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <MaterialCommunityIcons name="calendar-outline" size={18} color="#0B2D3E" />
                </Pressable>
              </View>

              <View style={[styles.modalFieldGroup, { zIndex: 3000 }]}>
                <Text style={styles.modalLabel}>Group</Text>
                <Pressable
                  style={styles.modalDropdownTrigger}
                  onPress={() => { setModalGroupDropdownOpen(!isModalGroupDropdownOpen); setModalTagDropdownOpen(false); }}
                >
                  <Text style={styles.modalDropdownText}>{modalGroup}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {isModalGroupDropdownOpen && (
                  <View style={styles.modalFormDropdownMenu}>
                    {MODAL_GROUP_OPTIONS.map(opt => (
                      <Pressable
                        key={opt}
                        style={styles.modalFormDropdownItem}
                        onPress={() => { setModalGroup(opt); setModalGroupDropdownOpen(false); }}
                      >
                        {modalGroup === opt && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={styles.modalDropdownCheckIcon} />
                        )}
                        <Text style={[styles.modalFormDropdownItemText, modalGroup === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={[styles.modalFieldGroup, { zIndex: 2000 }]}>
                <Text style={styles.modalLabel}>Tag</Text>
                <Pressable
                  style={styles.modalDropdownTrigger}
                  onPress={() => { setModalTagDropdownOpen(!isModalTagDropdownOpen); setModalGroupDropdownOpen(false); }}
                >
                  <Text style={styles.modalDropdownText}>{modalTag}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#0B2D3E" />
                </Pressable>
                {isModalTagDropdownOpen && (
                  <View style={styles.modalFormDropdownMenu}>
                    {MODAL_TAG_OPTIONS.map(opt => (
                      <Pressable
                        key={opt}
                        style={styles.modalFormDropdownItem}
                        onPress={() => { setModalTag(opt); setModalTagDropdownOpen(false); }}
                      >
                        {modalTag === opt && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" style={styles.modalDropdownCheckIcon} />
                        )}
                        <Text style={[styles.modalFormDropdownItemText, modalTag === opt && { fontWeight: '700' }]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Tag Color Preset</Text>
                <View style={styles.colorPresetRow}>
                  {TAG_COLORS.map(color => (
                    <Pressable
                      key={color}
                      onPress={() => setModalColor(color)}
                      style={[styles.modalTagColorCircleOuter, modalColor === color && { borderColor: color }]}
                    >
                      <View style={[styles.modalTagColorCircle, { backgroundColor: color }]} />
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Priority</Text>
                <View style={styles.priorityRow}>
                  {['High', 'Medium', 'Low'].map((p) => (
                    <Pressable
                      key={p}
                      style={[styles.priorityPillBtn, modalPriority === p && styles.priorityPillBtnActive]}
                      onPress={() => setModalPriority(p)}
                    >
                      <Text style={[styles.priorityPillText, modalPriority === p && styles.priorityPillTextActive]}>{p}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <Pressable style={styles.pickerOverlay} onPress={() => setShowDatePicker(false)}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>Select Date & Time</Text>
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.pickerDoneBtn}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={modalDate}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') setShowDatePicker(false);
                    if (selectedDate) setModalDate(selectedDate);
                  }}
                  textColor="#0B2D3E"
                />
              </View>
            </Pressable>
          </Modal>

          <View style={[styles.fixedBottomActions, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <Pressable style={styles.modalCancelBtn} onPress={() => setAddTaskModalVisible(false)}>
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.modalSaveBtn} onPress={() => setAddTaskModalVisible(false)}>
              <Text style={styles.modalSaveBtnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Reschedule Task Modal (Bottom Sheet Style) */}
      <Modal
        visible={!!rescheduleTask}
        transparent
        animationType="slide"
        onRequestClose={() => setRescheduleTask(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setRescheduleTask(null)}>
          <View style={[styles.bottomFixModal, { paddingBottom: Math.max(insets.bottom, 20) }]} onStartShouldSetResponder={() => true}>
            <View style={styles.premiumModalHeader}>
              <View>
                <Text style={[styles.fullScreenModalTitle, { fontSize: 24 }]}>Reschedule Task</Text>
                <Text style={styles.modalSubtitle}>Choose a new date and time for this follow-up.</Text>
              </View>
              <Pressable style={styles.fullScreenModalCloseIcon} onPress={() => setRescheduleTask(null)}>
                <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
              </Pressable>
            </View>

            <View style={[styles.modalBody, { paddingBottom: 20 }]}>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>New Due Date</Text>
                <Pressable style={styles.modalInputWithIcon} onPress={() => setShowReschedulePicker(true)}>
                  <Text style={styles.modalDateText}>
                    {rescheduleDate.toLocaleDateString('en-GB')} {rescheduleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <MaterialCommunityIcons name="calendar-outline" size={18} color="#0B2D3E" />
                </Pressable>
              </View>

              <View style={styles.modalActions}>
                <Pressable style={[styles.modalCancelBtn, { flex: 1 }]} onPress={() => setRescheduleTask(null)}>
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.modalSaveBtn, { flex: 1.5 }]} onPress={() => setRescheduleTask(null)}>
                  <Text style={styles.modalSaveBtnText}>Save Changes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>

        <Modal
          visible={showReschedulePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReschedulePicker(false)}
        >
          <Pressable style={styles.pickerOverlay} onPress={() => setShowReschedulePicker(false)}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Date & Time</Text>
                <Pressable onPress={() => setShowReschedulePicker(false)}>
                  <Text style={styles.pickerDoneBtn}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={rescheduleDate}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') setShowReschedulePicker(false);
                  if (selectedDate) setRescheduleDate(selectedDate);
                }}
                textColor="#0B2D3E"
              />
            </View>
          </Pressable>
        </Modal>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={!!deletingTask}
        transparent
        animationType="fade"
        onRequestClose={() => setDeletingTask(null)}
      >
        <Pressable style={styles.alertOverlay} onPress={() => setDeletingTask(null)}>
          <View style={styles.alertContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.alertIconCircle}>
              <MaterialCommunityIcons name="alert-outline" size={32} color="#EF4444" />
            </View>

            <Text style={styles.alertTitle}>Delete Follow-Up?</Text>
            <Text style={styles.alertDescription}>
              This action cannot be undone. This task will be permanently removed from your schedule.
            </Text>

            <View style={styles.alertActions}>
              <Pressable style={styles.alertCancelBtn} onPress={() => setDeletingTask(null)}>
                <Text style={styles.alertCancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.alertDeleteBtn} onPress={() => deletingTask && handleDeleteTask(deletingTask.id)}>
                <Text style={styles.alertDeleteBtnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topTabsContainer: { marginBottom: 16 },
  tabsScroll: { paddingHorizontal: 20, gap: 10 },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  tabItemActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E'
  },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },

  searchAndFilterBar: { paddingHorizontal: 20, marginBottom: 12 },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#0B2D3E', fontWeight: '500' },

  refineByRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    zIndex: 100
  },
  filterActionsRow: {
    flexDirection: 'row',
    gap: 12,
    zIndex: 2000,
  },
  refineLabel: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    gap: 6
  },
  filterDropdownText: { fontSize: 13, fontWeight: '700', color: '#0B2D3E' },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    minWidth: 160,
    backgroundColor: '#6A7D8C',
    borderRadius: 16,
    paddingVertical: 10,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingLeft: 40
  },
  dropdownCheckIcon: {
    position: 'absolute',
    left: 14
  },
  dropdownItemText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  dropdownItemTextActive: { fontWeight: '900' },

  scroll: { flex: 1 },
  listContainer: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4
  },
  cardCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#EAEFF3',
    opacity: 0.8,
  },
  cardMain: { flexDirection: 'row', gap: 16 },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardIconOverdue: { backgroundColor: '#FEF2F2' },
  cardIconCompleted: { backgroundColor: '#ECFDF5' },
  cardContent: { flex: 1 },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  cardTitle: { fontSize: 17, fontWeight: '900', color: '#0B2D3E', flex: 1, marginRight: 8 },
  cardTitleCompleted: { color: '#8DA4B5', textDecorationLine: 'line-through' },

  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },

  cardContact: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  cardContactName: { fontWeight: '800', color: '#0B2D3E' },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  tagPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  infoGrid: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 16
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12
  },
  actionIcons: { flexDirection: 'row', gap: 10 },
  actionIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  rescheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 12,
  },
  rescheduleText: { color: '#0B2D3E', fontSize: 13, fontWeight: '800' },

  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
  },
  completedLabel: { fontSize: 13, fontWeight: '900', color: '#10B981' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'flex-end',
  },
  rescheduleModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '90%',
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6A7D8C',
    fontWeight: '500',
    marginTop: 4,
  },
  modalCloseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  modalFieldGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalInput: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0B2D3E',
    backgroundColor: '#FFFFFF',
    fontWeight: '600',
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalInputWithIcon: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  modalDateText: {
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityPillBtn: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityPillBtnActive: {
    borderColor: '#0B2D3E',
    backgroundColor: '#0B2D3E',
  },
  priorityPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  priorityPillTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalCancelBtnText: { color: '#0B2D3E', fontSize: 14, fontWeight: '800' },
  modalCreateBtn: {
    flex: 1.5,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCreateBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  // --- New Modal Styles ---
  fullPageModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  premiumModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  fullScreenModalTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.5,
  },
  fullScreenModalCloseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  modalDropdownTrigger: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  modalDropdownText: {
    fontSize: 15,
    color: '#0B2D3E',
    fontWeight: '600',
  },
  modalFormDropdownMenu: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#6A7D8C',
    borderRadius: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 5000,
  },
  modalFormDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingLeft: 40,
  },
  modalFormDropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalDropdownCheckIcon: {
    position: 'absolute',
    left: 14,
  },
  colorPresetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  modalTagColorCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  modalTagColorCircleOuter: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedBottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F4F7',
  },
  modalSaveBtn: {
    flex: 1.5,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  pickerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  pickerDoneBtn: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0BA0B2',
  },
  bottomFixModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    width: '100%',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    width: '100%',
    maxWidth: 340,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  alertIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 12,
    textAlign: 'center',
  },
  alertDescription: {
    fontSize: 15,
    color: '#6A7D8C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  alertCancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCancelBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  alertDeleteBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  alertDeleteBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

