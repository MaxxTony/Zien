import { PageHeader } from '@/components/ui/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Platform = 'IG' | 'FB' | 'LI';

interface ScheduledEvent {
  id: string;
  platform: Platform;
  label: string; // e.g. "Malibu Villa Listing"
  time: string; // e.g. "10:00 AM"
  location: string; // e.g. "Malibu, CA"
  status: 'SCHEDULED' | 'PUBLISHED';
  image: any; // require path
  color?: string; // pill color
}

// Sample events
// 15 = IG Malibu Villa
// 16 = FB Open House, LI Market Report
const EVENTS_BY_DATE: Record<string, ScheduledEvent[]> = {
  '2026-03-12': [
    {
      id: '1',
      platform: 'IG',
      label: 'Malibu Villa Listing',
      time: '10:00 AM',
      location: 'Malibu, CA',
      status: 'SCHEDULED',
      color: '#E6E9F0',
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    },
  ],
  '2026-03-15': [
    {
      id: '2',
      platform: 'FB',
      label: 'Weekend Open House',
      time: '2:00 PM',
      location: 'Beverly Hills',
      status: 'SCHEDULED',
      color: '#E6E9F0',
      image: null
    },
    {
      id: '3',
      platform: 'LI',
      label: 'Market Report Q1',
      time: '9:00 AM',
      location: 'LinkedIn Article',
      status: 'PUBLISHED',
      color: '#E6E9F0',
      image: null
    },
  ],
};

const PLATFORM_CONFIG: Record<Platform, { icon: string, label: string, color: string }> = {
  IG: { icon: 'instagram', label: 'Instagram', color: '#E1306C' },
  FB: { icon: 'facebook', label: 'Facebook', color: '#1877F2' },
  LI: { icon: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
};

export default function SchedulerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [nativeEvents, setNativeEvents] = useState<Record<string, ScheduledEvent[]>>({});

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          // Prepared for native event sync implementation
        }
      } catch (err) {
        console.warn('Native Calendar modules not ready. Ensure you have run a native rebuild after updating app.json.', err);
      }
    })();
  }, []);

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const handlePrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // We want Monday start (like firstDay: 1 in previous)
    // Adjust firstDayOfMonth to Monday start (0=Mon, 6=Sun)
    let startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = [];

    // Previous month filler days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: month - 1,
        year,
        isExtra: true,
        dateString: `${year}-${String(month).padStart(2, '0')}-${String(prevMonthDays - i).padStart(2, '0')}`
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isExtra: false,
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    // Next month filler
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: month + 1,
        year,
        isExtra: true,
        dateString: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    return days;
  }, [currentDate]);

  const renderDayCell = (dayObj: any) => {
    const events = EVENTS_BY_DATE[dayObj.dateString] || [];
    const isToday = dayObj.dateString === new Date().toISOString().split('T')[0];

    return (
      <View key={dayObj.dateString} style={styles.dayCell}>
        <Text style={[
          styles.dayText,
          dayObj.isExtra && styles.disabledText,
          isToday && styles.todayText
        ]}>
          {dayObj.day}
        </Text>

        <View style={styles.eventStack}>
          {events.slice(0, 2).map(ev => (
            <Pressable
              key={ev.id}
              style={[styles.miniPill, { backgroundColor: ev.color || '#F1F5F9' }]}
              onPress={() => setSelectedEvent(ev)}
            >
              <MaterialCommunityIcons
                name={PLATFORM_CONFIG[ev.platform].icon as any}
                size={10}
                color="#0B2341"
              />
              <Text style={styles.miniPillText} numberOfLines={1}>{ev.label}</Text>
            </Pressable>
          ))}
          {events.length > 2 && (
            <Text style={styles.moreCount}>+{events.length - 2}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#F0F4F8', '#F1F5F9', '#F8FAFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>

      <PageHeader
        title="Scheduler"
        subtitle="View and manage your publishing schedule across all platforms."
        onBack={() => router.back()}
        rightIcon="plus"
        onRightPress={() => router.push('/(main)/social-hub/create-post')}
      />

      <View style={styles.controlsSection}>
        <View style={styles.monthNav}>
          <Pressable onPress={handlePrevMonth} style={styles.navArrow} hitSlop={10}>
            <MaterialCommunityIcons name="chevron-left" size={20} color="#0B2341" />
          </Pressable>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Pressable onPress={handleNextMonth} style={styles.navArrow} hitSlop={10}>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#0B2341" />
          </Pressable>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        {/* Weekday Headers */}
        <View style={styles.weekHeader}>
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
            <Text key={day} style={styles.weekHeaderText}>{day}</Text>
          ))}
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.daysGrid}>
            {calendarDays.map(renderDayCell)}
          </View>
        </ScrollView>
      </View>

      {/* Event Detail Modal */}
      <Modal visible={!!selectedEvent} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Image / Header */}
            <View style={styles.modalImageContainer}>
              {/* Placeholder Logic for demo */}
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80' }} // Generic house
                style={styles.modalImage}
              />
              <Pressable style={styles.closeBtn} onPress={() => setSelectedEvent(null)}>
                <MaterialCommunityIcons name="close" size={20} color="#0B2D3E" />
              </Pressable>
              <View style={styles.modalPlatformBadge}>
                <MaterialCommunityIcons
                  name={selectedEvent ? PLATFORM_CONFIG[selectedEvent.platform].icon as any : 'instagram'}
                  size={14}
                  color="#FFFFFF"
                />
                <Text style={styles.modalPlatformText}>
                  {selectedEvent ? PLATFORM_CONFIG[selectedEvent.platform].label.toUpperCase() : ''}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.modalBody}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalEventTitle}>{selectedEvent?.label}</Text>
                <View style={styles.statusBadge}>
                  <MaterialCommunityIcons name="clock-outline" size={12} color="#0B2D3E" />
                  <Text style={styles.statusText}>{selectedEvent?.status}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="#94A3B8" />
                <Text style={styles.metaText}>{selectedEvent?.time}</Text>
                <View style={styles.metaDivider} />
                <MaterialCommunityIcons name="map-marker-outline" size={16} color="#94A3B8" />
                <Text style={styles.metaText}>{selectedEvent?.location}</Text>
              </View>

              <Text style={styles.modalDescription}>
                New luxury listing reveal! Check out the details of this stunning property in Malibu. #RealEstate #LuxuryLiving
              </Text>

              <View style={styles.modalActions}>
                <Pressable
                  style={styles.modalActionBtnOutline}
                  onPress={() => {
                    setSelectedEvent(null);
                    router.push('/(main)/social-hub/create-post'); // Simulate edit navigation
                  }}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={18} color="#0B2D3E" />
                  <Text style={styles.modalActionTextOutline}>Edit Post</Text>
                </Pressable>
                <Pressable
                  style={styles.modalActionBtnPrimary}
                  onPress={() => setSelectedEvent(null)}
                >
                  <Text style={styles.modalActionTextPrimary}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  headerTop: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  controlsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  navArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2341',
    minWidth: 120,
    textAlign: 'center',
  },

  // Calendar
  calendarContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 5,
    padding: 10,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  weekHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (Dimensions.get('window').width - 60) / 7, // 7 columns
    height: 85,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#F1F5F9',
    padding: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2341',
    marginBottom: 4,
  },
  todayText: {
    color: '#3B82F6',
    fontWeight: '900',
  },
  disabledText: {
    color: '#E2E8F0',
  },
  eventStack: {
    gap: 4,
    marginTop: 2,
  },
  miniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  miniPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0B2341',
    flex: 1,
  },
  moreCount: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '800',
    marginTop: 2,
    marginLeft: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 10,
  },
  modalImageContainer: {
    height: 180,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalPlatformBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalPlatformText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  modalBody: {
    padding: 24,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  modalEventTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#0B2D3E',
    lineHeight: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 6,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalActionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalActionTextOutline: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  modalActionBtnPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
  },
  modalActionTextPrimary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
