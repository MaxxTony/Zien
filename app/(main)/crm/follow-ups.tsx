import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
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

interface AIRule {
  id: string;
  type: 'Email' | 'SMS' | 'Call Task';
  delay: string;
  trigger: string;
  active: boolean;
  icon: string;
  iconBg: string;
}

const INITIAL_AI_RULES: AIRule[] = [
  { id: '1', type: 'Email', delay: 'AFTER 1 DAYS', trigger: 'New Lead Created', active: true, icon: 'email-outline', iconBg: '#E6F4F1' },
  { id: '2', type: 'SMS', delay: 'AFTER 2 DAYS', trigger: 'Viewing Completed', active: false, icon: 'message-outline', iconBg: '#EAF5E5' },
  { id: '3', type: 'Call Task', delay: 'AFTER 4 HOURS', trigger: 'Document Uploaded', active: true, icon: 'phone-outline', iconBg: '#FDF3E3' },
];

function TaskCard({
  task,
  onReschedule,
  onDone
}: {
  task: typeof TASKS[number],
  onReschedule: () => void,
  onDone: () => void
}) {
  const isHigh = task.priority === 'High';
  const isMedium = task.priority === 'Medium';
  const isCompleted = task.status === 'completed';

  const priorityColor = isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#6A7D8C';
  const priorityBg = isHigh ? '#FEF2F2' : isMedium ? '#FFFBEB' : '#F3F6F8';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.cardIconWrap, task.isOverdue && styles.cardIconOverdue, isCompleted && styles.cardIconCompleted]}>
          <MaterialCommunityIcons
            name={isCompleted ? 'check-circle-outline' : task.icon as any}
            size={22}
            color={task.isOverdue ? '#EF4444' : isCompleted ? '#10B981' : '#0B2D3E'}
          />
        </View>

        <View style={styles.cardHeaderInfo}>
          <Text style={[styles.cardTitle, isCompleted && styles.cardTitleCompleted]}>{task.title}</Text>
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
        </View>

        <View style={[styles.priorityPill, { backgroundColor: priorityBg }]}>
          <Text style={[styles.priorityText, { color: priorityColor }]}>{task.priority}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="folder-outline" size={16} color="#0B2D3E" style={{ fontWeight: 'bold' }} />
          <Text style={styles.metaText}>{task.group}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={[styles.metaDate, task.isOverdue && { color: '#EF4444' }]}>{task.dueDate}</Text>
        </View>
      </View>

      {isCompleted ? (
        <View style={styles.completedRow}>
          <Text style={styles.completedText}>Completed</Text>
        </View>
      ) : (
        <View style={styles.actionsRow}>
          <Pressable style={styles.btnDone} onPress={onDone}>
            <Text style={styles.btnDoneText}>Done</Text>
          </Pressable>
          <Pressable style={styles.btnReschedule} onPress={onReschedule}>
            <Text style={styles.btnRescheduleText}>Reschedule</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function FollowUpsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('All');
  const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('High');
  const [isAiModalVisible, setAiModalVisible] = useState(false);
  const [aiRules, setAiRules] = useState(INITIAL_AI_RULES);
  const [tasksList, setTasksList] = useState(TASKS);
  const [rescheduleTask, setRescheduleTask] = useState<typeof TASKS[number] | null>(null);

  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [tagFilter, setTagFilter] = useState('All Tags');
  const [isGroupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setTagDropdownOpen] = useState(false);

  const [aiStatusFilter, setAiStatusFilter] = useState('All Statuses');
  const [isAiStatusDropdownOpen, setAiStatusDropdownOpen] = useState(false);
  const AI_STATUS_OPTIONS = ['All Statuses', 'Active', 'Inactive'];

  const GROUP_OPTIONS = ['All Groups', 'Sales', 'Viewing', 'Leads', 'Legal'];
  const TAG_OPTIONS = ['All Tags', '#Urgent', '#Report', '#Follow-up', '#New', '#Inventory', '#Archived'];

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

  const toggleRule = (id: string) => {
    setAiRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const addNewRule = () => {
    setAiRules(prev => [
      ...prev,
      { id: Math.random().toString(), type: 'Email', delay: 'AFTER 1 DAYS', trigger: 'New Trigger Event', active: true, icon: 'email-outline', iconBg: '#E6F4F1' }
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F4F7F9', '#FFFFFF', '#F4F7F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTopRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
          </Pressable>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Smart Follow-Ups</Text>
            <Text style={styles.subtitle}>
              Manage automated and manual interactions required.
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.aiBtn} onPress={() => setAiModalVisible(true)}>
            <MaterialCommunityIcons name="robot-outline" size={18} color="#FFFFFF" />
            <Text style={styles.aiBtnText}>AI Configuration</Text>
          </Pressable>
          <Pressable style={styles.addTaskBtn} onPress={() => setAddTaskModalVisible(true)}>
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.addTaskText}>Add Task</Text>
          </Pressable>
        </View>
      </View>

      <View>
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

      <View style={styles.searchWrap}>
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#8DA4B5" />
          <TextInput
            placeholder="Search by contact or subject..."
            placeholderTextColor="#8DA4B5"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.filtersWrap}>
        <Text style={styles.filterLabel}>Refine by:</Text>
        <View style={{ position: 'relative', zIndex: 10 }}>
          <Pressable style={styles.filterDropdown} onPress={() => { setGroupDropdownOpen(!isGroupDropdownOpen); setTagDropdownOpen(false); }}>
            <Text style={styles.filterDropdownText}>{groupFilter}</Text>
            <MaterialCommunityIcons name={isGroupDropdownOpen ? "chevron-up" : "chevron-down"} size={18} color="#0B2D3E" />
          </Pressable>
          {isGroupDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {GROUP_OPTIONS.map(opt => (
                <Pressable key={opt} style={styles.dropdownItem} onPress={() => { setGroupFilter(opt); setGroupDropdownOpen(false); }}>
                  <Text style={[styles.dropdownItemText, groupFilter === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  {groupFilter === opt && <MaterialCommunityIcons name="check" size={16} color="#0BA0B2" />}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={{ position: 'relative', zIndex: 9 }}>
          <Pressable style={styles.filterDropdown} onPress={() => { setTagDropdownOpen(!isTagDropdownOpen); setGroupDropdownOpen(false); }}>
            <Text style={styles.filterDropdownText}>{tagFilter}</Text>
            <MaterialCommunityIcons name={isTagDropdownOpen ? "chevron-up" : "chevron-down"} size={18} color="#0B2D3E" />
          </Pressable>
          {isTagDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {TAG_OPTIONS.map(opt => (
                <Pressable key={opt} style={styles.dropdownItem} onPress={() => { setTagFilter(opt); setTagDropdownOpen(false); }}>
                  <Text style={[styles.dropdownItemText, tagFilter === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  {tagFilter === opt && <MaterialCommunityIcons name="check" size={16} color="#0BA0B2" />}
                </Pressable>
              ))}
            </View>
          )}
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

      {/* Add Task Modal */}
      <Modal
        visible={isAddTaskModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddTaskModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setAddTaskModalVisible(false)}>
          <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Follow-Up</Text>
                <Text style={styles.modalSubtitle}>Schedule a manual follow-up task.</Text>
              </View>
              <Pressable style={styles.modalCloseIcon} onPress={() => setAddTaskModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={16} color="#0B2D3E" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Task Subject</Text>
                <TextInput style={styles.modalInput} placeholder="e.g. Call to discuss pricing" placeholderTextColor="#8DA4B5" />
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Contact Name</Text>
                <TextInput style={styles.modalInput} placeholder="Search contacts..." placeholderTextColor="#8DA4B5" />
              </View>

              <View style={styles.modalRow}>
                <View style={[styles.modalFieldGroup, { flex: 1.2 }]}>
                  <Text style={styles.modalLabel}>Due Date</Text>
                  <View style={styles.modalInputWithIcon}>
                    <Text style={styles.modalDateText}>dd/mm/yyyy</Text>
                    <MaterialCommunityIcons name="calendar-outline" size={18} color="#0B2D3E" />
                  </View>
                </View>
                <View style={[styles.modalFieldGroup, { flex: 1 }]}>
                  <Text style={styles.modalLabel}>Group</Text>
                  <TextInput style={styles.modalInput} defaultValue="Sales" placeholderTextColor="#8DA4B5" />
                </View>
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Priority</Text>
                <View style={styles.priorityRow}>
                  {['High', 'Medium', 'Low'].map((p) => (
                    <Pressable
                      key={p}
                      style={[styles.priorityPillBtn, selectedPriority === p && styles.priorityPillBtnActive]}
                      onPress={() => setSelectedPriority(p)}
                    >
                      <Text style={[styles.priorityPillText, selectedPriority === p && styles.priorityPillTextActive]}>{p}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>Tags</Text>
                <TextInput style={styles.modalInput} placeholder="Add tags (comma separated)" placeholderTextColor="#8DA4B5" />
              </View>

              <View style={styles.modalActions}>
                <Pressable style={styles.modalCancelBtn} onPress={() => setAddTaskModalVisible(false)}>
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalCreateBtn} onPress={() => setAddTaskModalVisible(false)}>
                  <Text style={styles.modalCreateBtnText}>Create Follow-Up</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Reschedule Task Modal */}
      <Modal
        visible={!!rescheduleTask}
        transparent
        animationType="fade"
        onRequestClose={() => setRescheduleTask(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setRescheduleTask(null)}>
          <Pressable style={styles.rescheduleModalContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Reschedule Task</Text>
              </View>
              <Pressable style={styles.modalCloseIcon} onPress={() => setRescheduleTask(null)}>
                <MaterialCommunityIcons name="close" size={16} color="#0B2D3E" />
              </Pressable>
            </View>

            <View style={styles.modalScroll}>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalLabel}>New Due Date</Text>
                <View style={styles.modalInputWithIcon}>
                  <Text style={styles.modalDateText}>dd/mm/yyyy</Text>
                  <MaterialCommunityIcons name="calendar-outline" size={18} color="#0B2D3E" />
                </View>
              </View>

              <View style={styles.modalActions}>
                <Pressable style={styles.modalCancelBtn} onPress={() => setRescheduleTask(null)}>
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalCreateBtn} onPress={() => setRescheduleTask(null)}>
                  <Text style={styles.modalCreateBtnText}>Save Changes</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* AI Configuration Modal */}
      <Modal
        visible={isAiModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAiModalVisible(false)}
        style={{ margin: 0 }}
      >
        <Pressable style={styles.aiModalOverlay} onPress={() => setAiModalVisible(false)}>
          <Pressable style={styles.aiModalContainer} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={['#0F3B56', '#09A7B3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiModalHeaderGradient}
            >
              <View style={styles.aiModalHeaderContent}>
                <View style={styles.aiModalIconWrapper}>
                  <MaterialCommunityIcons name="robot-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.aiModalTitleWrap}>
                  <Text style={styles.aiModalTitle}>AI Follow-up Rules</Text>
                  <Text style={styles.aiModalSubtitle}>Define automated triggers and responses.</Text>
                </View>
                <Pressable style={styles.aiModalCloseIcon} onPress={() => setAiModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            </LinearGradient>

            <View style={[styles.aiFiltersRow, { position: 'relative', zIndex: 10 }]}>
              <View style={styles.aiSearchInputWrap}>
                <TextInput style={styles.aiSearchInput} placeholder="Search rules..." placeholderTextColor="#8DA4B5" />
              </View>

              <View style={{ flex: 1, position: 'relative' }}>
                <Pressable
                  style={styles.aiStatusDropdown}
                  onPress={() => setAiStatusDropdownOpen(!isAiStatusDropdownOpen)}
                >
                  <Text style={styles.aiStatusDropdownText}>{aiStatusFilter}</Text>
                  <MaterialCommunityIcons name={isAiStatusDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#0B2D3E" />
                </Pressable>
                {isAiStatusDropdownOpen && (
                  <View style={styles.dropdownMenuRight}>
                    {AI_STATUS_OPTIONS.map(opt => (
                      <Pressable
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => { setAiStatusFilter(opt); setAiStatusDropdownOpen(false); }}
                      >
                        <Text style={[styles.dropdownItemText, aiStatusFilter === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                        {aiStatusFilter === opt && <MaterialCommunityIcons name="check" size={16} color="#0BA0B2" />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.aiModalScroll}>
              {aiRules
                .filter(rule => {
                  if (aiStatusFilter === 'Active') return rule.active === true;
                  if (aiStatusFilter === 'Inactive') return rule.active === false;
                  return true;
                })
                .map((rule) => (
                  <View style={styles.aiRuleCard} key={rule.id}>
                    <View style={[styles.aiRuleIconBg, { backgroundColor: rule.iconBg }]}>
                      <MaterialCommunityIcons name={rule.icon as any} size={22} color="#0B2D3E" />
                    </View>
                    <View style={styles.aiRuleInfo}>
                      <View style={styles.aiRuleTitleRow}>
                        <Text style={styles.aiRuleTypeLabel}>{rule.type}</Text>
                        <Text style={styles.aiRuleDelayLabel}>{rule.delay}</Text>
                      </View>
                      <Text style={styles.aiRuleTriggerText}>
                        Trigger: <Text style={styles.aiRuleTriggerBold}>{rule.trigger}</Text>
                      </Text>
                    </View>
                    <View style={styles.aiRuleActions}>
                      <Switch
                        value={rule.active}
                        onValueChange={() => toggleRule(rule.id)}
                        trackColor={{ false: '#E2E8F0', true: '#0B2D3E' }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#E2E8F0"
                        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                      />
                      <MaterialCommunityIcons name="tune" size={20} color="#0B2D3E" style={{ marginLeft: 6 }} />
                    </View>
                  </View>
                ))}

              <Pressable style={styles.aiAddNewRuleBtn} onPress={addNewRule}>
                <MaterialCommunityIcons name="plus" size={18} color="#6A7D8C" />
                <Text style={styles.aiAddNewRuleText}>Add New Rule</Text>
              </Pressable>

              <View style={styles.aiAssistantPrompt}>
                <MaterialCommunityIcons name="creation" size={20} color="#0B2D3E" />
                <View style={styles.aiAssistantTextContent}>
                  <Text style={styles.aiAssistantTitle}>Proactive AI Assistant</Text>
                  <Text style={styles.aiAssistantSubtitle}>
                    The AI also analyzes sentiment in replies to prioritize follow-ups automatically.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.aiModalFooter}>
              <View style={styles.aiModalActionsRow}>
                <Pressable style={styles.aiModalCancelBtn} onPress={() => setAiModalVisible(false)}>
                  <Text style={styles.aiModalCancelBtnText}>Close</Text>
                </Pressable>
                <Pressable style={styles.aiModalSaveBtn} onPress={() => setAiModalVisible(false)}>
                  <Text style={styles.aiModalSaveBtnText}>Save Configuration</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EAEFF3', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginRight: 12 },
  headerTitles: { flex: 1 },
  title: { fontSize: 24, fontWeight: '900', color: '#0B2D3E', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#6A7D8C', fontWeight: '500', marginTop: 2 },

  headerActions: { flexDirection: 'row', gap: 10 },
  aiBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0BA0B2', paddingVertical: 12, borderRadius: 12, gap: 6 },
  aiBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  addTaskBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B2D3E', paddingVertical: 12, borderRadius: 12, gap: 6 },
  addTaskText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  tabsScroll: { paddingHorizontal: 20, marginBottom: 12 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', marginRight: 8, borderWidth: 1, borderColor: '#EAEFF3' },
  tabItemActive: { backgroundColor: '#0B2D3E', borderColor: '#0B2D3E' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#6A7D8C' },
  tabTextActive: { color: '#FFFFFF' },

  searchWrap: { paddingHorizontal: 20, marginBottom: 12 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', height: 48, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: '#EAEFF3' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: '#0B2D3E' },

  filtersWrap: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', gap: 10, marginBottom: 16, zIndex: 10 },
  filterLabel: { fontSize: 13, fontWeight: '800', color: '#0B2D3E' },
  filterDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#EAEFF3', gap: 4 },
  filterDropdownText: { fontSize: 13, fontWeight: '700', color: '#0B2D3E' },
  dropdownMenu: { position: 'absolute', top: '100%', left: 0, minWidth: 140, backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 8, marginTop: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, borderWidth: 1, borderColor: '#EAEFF3' },
  dropdownMenuRight: { position: 'absolute', top: '100%', right: 0, minWidth: 140, backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 8, marginTop: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, borderWidth: 1, borderColor: '#EAEFF3' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  dropdownItemText: { fontSize: 13, fontWeight: '600', color: '#6A7D8C' },
  dropdownItemTextActive: { color: '#0BA0B2', fontWeight: '800' },

  scroll: { flex: 1 },
  listContainer: { paddingHorizontal: 20, gap: 16, paddingTop: 6 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#EAEFF3', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F6F8', alignItems: 'center', justifyContent: 'center' },
  cardIconOverdue: { backgroundColor: '#FEF2F2' },
  cardIconCompleted: { backgroundColor: '#ECFDF5' },
  cardHeaderInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0B2D3E', marginBottom: 2 },
  cardTitleCompleted: { color: '#8DA4B5', textDecorationLine: 'line-through' },
  cardContact: { fontSize: 13, color: '#6A7D8C' },
  cardContactName: { fontWeight: '700', color: '#0B2D3E' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tagPill: { backgroundColor: '#F3F6F8', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '700', color: '#6A7D8C' },

  priorityPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 10, fontWeight: '800' },

  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F0F4F7' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 14, fontWeight: '800', color: '#0B2D3E' },
  metaDate: { fontSize: 14, fontWeight: '800', color: '#0B2D3E' },

  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btnDone: { flex: 1, backgroundColor: '#0B2D3E', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnDoneText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  btnReschedule: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EAEFF3', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnRescheduleText: { color: '#0B2D3E', fontSize: 14, fontWeight: '700' },

  completedRow: { alignItems: 'flex-end', marginTop: 12 },
  completedText: { color: '#10B981', fontSize: 14, fontWeight: '800' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'center',
    padding: 20,
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
    color: '#0B2D3E',
    marginBottom: 8,
  },
  modalInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0B2D3E',
    backgroundColor: '#FFFFFF',
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalInputWithIcon: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  modalDateText: {
    fontSize: 14,
    color: '#0B2D3E',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityPillBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityPillBtnActive: {
    borderColor: '#0B2D3E',
    borderWidth: 1.5,
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  priorityPillTextActive: {
    color: '#0B2D3E',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EAEFF3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  modalCreateBtn: {
    flex: 1.3,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCreateBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  aiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'flex-end',
  },
  aiModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    height: '92%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  aiModalHeaderGradient: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  aiModalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiModalIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  aiModalTitleWrap: {
    flex: 1,
  },
  aiModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  aiModalSubtitle: {
    fontSize: 13,
    color: '#E0F2FE',
    fontWeight: '500',
    marginTop: 2,
  },
  aiModalCloseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiFiltersRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  aiSearchInputWrap: {
    flex: 1.5,
  },
  aiSearchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0B2D3E',
  },
  aiStatusDropdown: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  aiStatusDropdownText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  aiModalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  aiRuleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEFF3',
    borderRadius: 16,
    marginBottom: 12,
  },
  aiRuleIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  aiRuleInfo: {
    flex: 1,
  },
  aiRuleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  aiRuleTypeLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  aiRuleDelayLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8DA4B5',
  },
  aiRuleTriggerText: {
    fontSize: 13,
    color: '#6A7D8C',
  },
  aiRuleTriggerBold: {
    fontWeight: '700',
    color: '#0B2D3E',
  },
  aiRuleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAddNewRuleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 20,
    gap: 8,
  },
  aiAddNewRuleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6A7D8C',
  },
  aiAssistantPrompt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAFCFD',
    borderWidth: 1,
    borderColor: '#E4F4F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  aiAssistantTextContent: {
    flex: 1,
  },
  aiAssistantTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 4,
  },
  aiAssistantSubtitle: {
    fontSize: 13,
    color: '#6A7D8C',
    lineHeight: 18,
  },
  aiModalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#EAEFF3',
    backgroundColor: '#FFFFFF',
  },
  aiModalActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  aiModalCancelBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#EAEFF3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiModalCancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  aiModalSaveBtn: {
    flex: 1.5,
    height: 48,
    backgroundColor: '#0B2D3E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiModalSaveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
