import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
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
  '2026-02-15': [
    {
      id: '1',
      platform: 'IG',
      label: 'Malibu Villa Listing',
      time: '10:00 AM',
      location: 'Malibu, CA',
      status: 'SCHEDULED',
      color: '#F4F4F5',
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", // Placeholder if available, else we handle missing image
    },
  ],
  '2026-02-16': [
    {
      id: '2',
      platform: 'FB',
      label: 'Open House Promo',
      time: '2:00 PM',
      location: 'Beverly Hills',
      status: 'SCHEDULED',
      color: '#DBEAFE',
      image: null
    },
    {
      id: '3',
      platform: 'LI',
      label: 'Market Report Q1',
      time: '9:00 AM',
      location: 'LinkedIn Article',
      status: 'PUBLISHED',
      color: '#E5E7EB',
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

  const [currentDate, setCurrentDate] = useState('2026-02-01'); // Initial month
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);

  // Month Navigation
  const handlePrevMonth = () => {
    // Basic date manipulation for demo month switch
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const monthLabel = useMemo(() => {
    return new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  // Calendar Theme
  const theme = useMemo(() => ({
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#64748B',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#2d4150',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#0BA0B2',
    selectedDotColor: '#ffffff',
    arrowColor: '#0B2D3E',
    monthTextColor: '#0B2D3E',
    indicatorColor: '#0BA0B2',
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontWeight: '600' as const,
    textMonthFontWeight: 'bold' as const,
    textDayHeaderFontWeight: '600' as const,
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 11
  }), []);

  // Custom Day Component
  const renderDay = ({ date, state }: { date?: DateData, state?: string }) => {
    if (!date) return <View />;

    const events = EVENTS_BY_DATE[date.dateString] || [];
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';

    return (
      <Pressable
        style={[styles.dayContainer, isToday && styles.todayContainer]}
        onPress={() => {
          // If day has events, open detail for FIRST event for demo, 
          // or just log. The request says "click on any event show like this [modal]"
          // Since the calendar cell is small, tapping it could open a day view list logic.
          // But usually we just tap the event PILL itself.
          // Let's make the whole day tappable if it has events? 
          // Better yet, render pills.
        }}
      >
        <Text style={[styles.dayText, isDisabled && styles.disabledText, isToday && styles.todayText]}>
          {date.day}
        </Text>

        <View style={styles.eventPillContainer}>
          {events.slice(0, 3).map((ev, i) => (
            <Pressable
              key={ev.id}
              style={[styles.miniPill, { backgroundColor: ev.color || '#F3F4F6' }]}
              onPress={() => setSelectedEvent(ev)}
            >
              <MaterialCommunityIcons
                name={PLATFORM_CONFIG[ev.platform].icon as any}
                size={10}
                color="#1E293B"
              />
              <Text style={styles.miniPillText} numberOfLines={1}>
                {ev.label}
              </Text>
            </Pressable>
          ))}
          {events.length > 3 && (
            <Text style={styles.moreEventsText}>+{events.length - 3} more</Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <View style={styles.headerTop}>
          <Text style={styles.screenTitle}>Social Calendar</Text>
          <Text style={styles.screenSubtitle}>
            View and manage your publishing schedule across all platforms.
          </Text>
        </View>
      </View>

      <View style={styles.controlsSection}>
        <View style={styles.monthNav}>
          <Pressable onPress={handlePrevMonth} hitSlop={10}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#0B2D3E" />
          </Pressable>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Pressable onPress={handleNextMonth} hitSlop={10}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0B2D3E" />
          </Pressable>
        </View>
        <Pressable
          style={styles.addPostBtn}
          onPress={() => router.push('/(main)/social-hub/create-post')}
        >
          <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.addPostText}>Add Post</Text>
        </Pressable>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          key={currentDate} // Force re-render on month change to ensure custom day rendering context is clean
          current={currentDate}
          hideArrows={true} // Custom nav
          renderHeader={() => null} // Custom header
          dayComponent={renderDay}
          theme={theme}
          firstDay={1} // Monday start
          hideExtraDays={false}
          style={styles.calendarStyle}
        />
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
    justifyContent: 'space-between',
    gap: 10,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
    minWidth: 100,
    textAlign: 'center',
  },
  addPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  addPostText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  // Calendar
  calendarContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    padding: 10,
    margin: 10
  },
  calendarStyle: {
    paddingLeft: 0,
    paddingRight: 0,
    height: '90%',
  },
  dayContainer: {
    width: '100%',
    height: 70, // Taller cells for scheduler feel
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    padding: 4,
  },
  todayContainer: {
    backgroundColor: '#F8FAFC',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    marginLeft: 4,
  },
  todayText: {
    color: '#0BA0B2',
    fontWeight: '800',
  },
  disabledText: {
    color: '#CBD5E1',
  },
  eventPillContainer: {
    gap: 4,
  },
  miniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  miniPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  moreEventsText: {
    fontSize: 10,
    color: '#64748B',
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
