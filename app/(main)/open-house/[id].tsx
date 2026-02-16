import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const H_PADDING = 18;

const TABS = ['Overview', 'Visitors', 'Automation', 'Settings', 'Seller Report'] as const;
type TabKey = (typeof TABS)[number];

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800';

const TIMELINE_ITEMS = [
  { id: '1', label: 'New Lead: Jessica Miller', dotColor: '#EF4444', time: '1:20 PM' },
  { id: '2', label: 'Check-in: Robert Chen', dotColor: '#0D9488', time: '1:45 PM' },
  { id: '3', label: 'Check-in: David Wilson', dotColor: '#5B6B7A', time: '2:10 PM' },
  { id: '4', label: 'Email Follow-up Sent', dotColor: '#5B6B7A', time: 'Ongoing' },
];

type VisitorItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  signal: 'Hot' | 'Top 3' | 'Warm' | 'Cold';
  timeline: string;
  preApproved: boolean;
  sync: 'CRM' | 'QUEUED';
  leadScore: number;
};

const VISITORS_DATA: VisitorItem[] = [
  { id: 'v1', name: 'Jessica Miller', email: 'jessica@gmail.com', phone: '(555) 123-4567', signal: 'Hot', timeline: 'Immediate', preApproved: true, sync: 'CRM', leadScore: 94 },
  { id: 'v2', name: 'Robert Chen', email: 'robert.c@outlook.com', phone: '(555) 234-5678', signal: 'Top 3', timeline: '3-6 Months', preApproved: false, sync: 'QUEUED', leadScore: 82 },
  { id: 'v3', name: 'David Wilson', email: 'david.w@company.com', phone: '(555) 345-6789', signal: 'Warm', timeline: '6-12 Months', preApproved: true, sync: 'CRM', leadScore: 71 },
  { id: 'v4', name: 'Sarah Connor', email: 'sarah.c@terminator.com', phone: '(555) 456-7890', signal: 'Cold', timeline: 'Just Exploring', preApproved: false, sync: 'CRM', leadScore: 45 },
];

function getEventById(id: string) {
  return {
    id,
    address: '123 Business Way, Los Angeles',
    date: 'Jan 15',
    timeSlot: '1-4 PM',
    image: PLACEHOLDER_IMAGE,
    visitors: 12,
    hotLeads: 3,
    avgDwell: '8.2m',
  };
}

export default function OpenHouseDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('Overview');
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorItem | null>(null);
  const [anonymizeLeads, setAnonymizeLeads] = useState(true);
  const [hideVisitorNames, setHideVisitorNames] = useState(true);

  const event = useMemo(() => getEventById(id ?? 'oh-001'), [id]);

  const SENTIMENT_ITEMS = [
    { label: 'High Price Concern', pct: 15 },
    { label: 'Love the Kitchen Reno', pct: 65 },
    { label: 'Backyard is smaller than thought', pct: 20 },
  ];

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
        <Text style={styles.headerAddress} numberOfLines={1}>
          {event.address}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionBtnOutline}>
          <MaterialCommunityIcons name="open-in-new" size={16} color="#0B2D3E" />
          <Text style={styles.actionBtnOutlineText}>Open Public Check-In</Text>
        </Pressable>
        <Pressable style={styles.actionBtnSolid}>
          <Text style={styles.actionBtnSolidText}>Generate Sheet</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.bodyScroll}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'Overview' && (
          <>
            <View style={styles.card}>
              <View style={styles.eventSummaryRow}>
                <View style={styles.qrBlock}>
                  <MaterialCommunityIcons name="qrcode-scan" size={64} color="#0B2D3E" />
                  <Text style={styles.qrLabel}>QR CODE</Text>
                  <Text style={styles.qrSub}>Scan to Check In</Text>
                </View>
                <View style={styles.eventSummaryText}>
                  <Text style={styles.cardTitle}>Event Summary</Text>
                  <Text style={styles.eventSummaryDesc}>
                    Lead capture is synced directly to ZIEN Hub. Visitors receive an Instant
                    Follow-up Package upon check-in.
                  </Text>
                  <View style={styles.eventMetaRow}>
                    <View>
                      <Text style={styles.eventMetaValue}>{event.date}</Text>
                      <Text style={styles.eventMetaLabel}>SCHEDULED DATE</Text>
                    </View>
                    <View>
                      <Text style={styles.eventMetaValue}>{event.timeSlot}</Text>
                      <Text style={styles.eventMetaLabel}>TIME SLOT</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Live Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{event.visitors}</Text>
                  <Text style={styles.statLabel}>VISITORS</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxTeal]}>
                  <Text style={styles.statValue}>{event.hotLeads}</Text>
                  <Text style={styles.statLabel}>HOT LEADS</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxOrange]}>
                  <Text style={styles.statValue}>{event.avgDwell}</Text>
                  <Text style={styles.statLabel}>AVG DWELL</Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, styles.timelineCard]}>
              <Text style={styles.timelineCardTitle}>Real-Time Timeline</Text>
              {TIMELINE_ITEMS.map((item) => (
                <View key={item.id} style={styles.timelineRow}>
                  <View style={[styles.timelineDot, { backgroundColor: item.dotColor }]} />
                  <Text style={styles.timelineLabel}>{item.label}</Text>
                  <Text style={styles.timelineTime}>{item.time}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'Visitors' && (
          <>
            {VISITORS_DATA.map((visitor) => (
              <View key={visitor.id} style={styles.visitorCard}>
                <View style={styles.visitorCardHeader}>
                  <View style={styles.visitorCardNameBlock}>
                    <Text style={styles.visitorCardName}>{visitor.name}</Text>
                    <Text style={styles.visitorCardEmail}>{visitor.email}</Text>
                  </View>
                  <View style={[styles.signalPill, visitor.signal === 'Hot' && styles.signalPillHot, visitor.signal === 'Top 3' && styles.signalPillTop3]}>
                    {visitor.signal === 'Hot' && <MaterialCommunityIcons name="fire" size={14} color="#EF4444" style={styles.signalIcon} />}
                    {visitor.signal === 'Top 3' && <MaterialCommunityIcons name="star" size={14} color="#0B2D3E" style={styles.signalIcon} />}
                    <Text style={[styles.signalText, visitor.signal === 'Hot' && styles.signalTextHot]}>{visitor.signal}</Text>
                  </View>
                </View>
                <View style={styles.visitorCardRow}>
                  <Text style={styles.visitorCardLabel}>Timeline</Text>
                  <Text style={styles.visitorCardValue}>{visitor.timeline}</Text>
                </View>
                <View style={styles.visitorCardRow}>
                  <Text style={styles.visitorCardLabel}>Pre-Approved</Text>
                  <Text style={styles.visitorCardValue}>{visitor.preApproved ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.visitorCardRow}>
                  <Text style={styles.visitorCardLabel}>Sync</Text>
                  <View style={styles.syncRow}>
                    {visitor.sync === 'CRM' ? (
                      <MaterialCommunityIcons name="check-circle" size={16} color="#0D9488" />
                    ) : (
                      <MaterialCommunityIcons name="clock-outline" size={16} color="#EA580C" />
                    )}
                    <Text style={[styles.syncText, visitor.sync === 'QUEUED' && styles.syncTextQueued]}>{visitor.sync}</Text>
                  </View>
                </View>
                <Pressable style={styles.visitorDetailsBtn} onPress={() => setSelectedVisitor(visitor)}>
                  <Text style={styles.visitorDetailsBtnText}>Details</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}

        {activeTab === 'Automation' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Follow-Up Automation (Story 8.5)</Text>
              <View style={styles.emailPreviewWrap}>
                <Text style={styles.emailPreviewLabel}>EMAIL TEMPLATE PREVIEW</Text>
                <Text style={styles.emailPreviewSubject}>
                  Thank you for visiting 123 Business Way!
                </Text>
                <Text style={styles.emailPreviewBody}>
                  Hi [Visitor Name], it was great meeting you today. I've attached the property
                  dossier including the virtual tour and local market report we discussed...
                </Text>
                <View style={styles.emailPreviewAssets}>
                  <View style={styles.emailPreviewAssetIcon} />
                  <View style={styles.emailPreviewAssetIcon} />
                  <Text style={styles.emailPreviewAssetsText}>+3 dynamic assets attached</Text>
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Automation Rules</Text>
              {[
                'Send email instantly on check-in',
                "Apply 'Hot' tag if 'Offer' selected",
                'Sync to CRM within 2 minutes',
                'Notify agent mobile on check-in',
              ].map((rule, i) => (
                <View key={i} style={[styles.automationRuleRow, i === 0 && styles.automationRuleRowFirst]}>
                  <Text style={styles.automationRuleText}>{rule}</Text>
                  <View style={styles.automationRuleCheck}>
                    <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'Settings' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.placeholderText}>Event and notification settings.</Text>
          </View>
        )}

        {activeTab === 'Seller Report' && (
          <>
            <View style={styles.card}>
              <Text style={styles.sellerReportTitle}>SELLER PERFORMANCE REPORT</Text>
              <Text style={styles.sellerReportSubtitle}>
                {event.address.split(',')[0].toUpperCase()} • LIVE STATS
              </Text>
              <View style={styles.sellerMetricsRow}>
                <View style={styles.sellerMetric}>
                  <Text style={styles.sellerMetricValue}>12</Text>
                  <Text style={styles.sellerMetricLabel}>CURR. VISITORS</Text>
                </View>
                <View style={styles.sellerMetric}>
                  <Text style={[styles.sellerMetricValue, styles.sellerMetricValueTeal]}>25%</Text>
                  <Text style={styles.sellerMetricLabel}>HOT LEAD RATIO</Text>
                </View>
                <View style={styles.sellerMetric}>
                  <Text style={[styles.sellerMetricValue, styles.sellerMetricValueOrange]}>9.5</Text>
                  <Text style={styles.sellerMetricLabel}>AVG INTEREST</Text>
                </View>
              </View>
              <Text style={styles.sellerSentimentTitle}>Market Sentiment Breakdown (Story 8.9)</Text>
              {SENTIMENT_ITEMS.map((item, i) => (
                <View key={i} style={styles.sellerSentimentRow}>
                  <Text style={styles.sellerSentimentLabel} numberOfLines={1}>{item.label}</Text>
                  <View style={styles.sellerSentimentBarWrap}>
                    <View style={[styles.sellerSentimentBar, { width: `${item.pct}%` }]} />
                  </View>
                  <Text style={styles.sellerSentimentPct}>{item.pct}%</Text>
                </View>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Seller Visibility</Text>
              <Text style={styles.sellerVisibilityDesc}>
                Control what the seller sees in their dashboard.
              </Text>
              <Pressable style={[styles.sellerCheckRow, { borderTopWidth: 0 }]} onPress={() => setAnonymizeLeads((v) => !v)}>
                <Text style={styles.sellerCheckLabel}>Anonymize Leads</Text>
                <Pressable style={[styles.sellerCheckbox, !anonymizeLeads && styles.sellerCheckboxUnchecked]} onPress={() => setAnonymizeLeads((v) => !v)}>
                  {anonymizeLeads ? (
                    <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                  ) : null}
                </Pressable>
              </Pressable>
              <Pressable style={styles.sellerCheckRow} onPress={() => setHideVisitorNames((v) => !v)}>
                <Text style={styles.sellerCheckLabel}>Hide Visitor Names</Text>
                <Pressable style={[styles.sellerCheckbox, !hideVisitorNames && styles.sellerCheckboxUnchecked]} onPress={() => setHideVisitorNames((v) => !v)}>
                  {hideVisitorNames ? (
                    <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                  ) : null}
                </Pressable>
              </Pressable>
              <Pressable style={styles.sellerPushBtn}>
                <Text style={styles.sellerPushBtnText}>Push Live Report to Seller</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={selectedVisitor != null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedVisitor(null)}>
        <Pressable style={styles.visitorModalBackdrop} onPress={() => setSelectedVisitor(null)}>
          <Pressable style={styles.visitorModalCard} onPress={(e) => e.stopPropagation()}>
            <Pressable style={styles.visitorModalClose} onPress={() => setSelectedVisitor(null)} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={24} color="#5B6B7A" />
            </Pressable>
            {selectedVisitor && (
              <>
                <View style={styles.visitorModalHeader}>
                  <View style={styles.visitorModalAvatar}>
                    <Text style={styles.visitorModalAvatarText}>
                      {selectedVisitor.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.visitorModalHeaderText}>
                    <View style={styles.visitorModalNameRow}>
                      <Text style={styles.visitorModalName}>{selectedVisitor.name}</Text>
                      {selectedVisitor.signal === 'Hot' && (
                        <View style={styles.visitorModalHotBadge}>
                          <MaterialCommunityIcons name="fire" size={12} color="#FFFFFF" />
                          <Text style={styles.visitorModalHotBadgeText}>Hot LEAD</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.visitorModalContact}>
                      {selectedVisitor.email} • {selectedVisitor.phone}
                    </Text>
                  </View>
                </View>
                <Text style={styles.visitorModalSectionLabel}>VISITOR CONTEXT</Text>
                <View style={styles.visitorModalContextRow}>
                  <Text style={styles.visitorModalContextLabel}>Timeline</Text>
                  <Text style={styles.visitorModalContextValue}>{selectedVisitor.timeline}</Text>
                </View>
                <View style={styles.visitorModalContextRow}>
                  <Text style={styles.visitorModalContextLabel}>Pre-Approved</Text>
                  <Text style={styles.visitorModalContextValue}>{selectedVisitor.preApproved ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.visitorModalContextRow}>
                  <Text style={styles.visitorModalContextLabel}>Lead Score</Text>
                  <Text style={styles.visitorModalContextScore}>{selectedVisitor.leadScore}/100</Text>
                </View>
                <Text style={[styles.visitorModalSectionLabel, styles.visitorModalSectionLabelTop]}>SMART FOLLOW-UP</Text>
                <Pressable style={styles.visitorModalBtnPrimary}>
                  <Text style={styles.visitorModalBtnPrimaryText}>Send Investment Analysis</Text>
                  <MaterialCommunityIcons name="star" size={18} color="#FFFFFF" />
                </Pressable>
                <Pressable style={styles.visitorModalBtnSecondary}>
                  <Text style={styles.visitorModalBtnSecondaryText}>Schedule Private Showing</Text>
                </Pressable>
                <Pressable style={styles.visitorModalBtnSecondaryBlue}>
                  <Text style={styles.visitorModalBtnSecondaryBlueText}>Send Similar Listings</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  headerAddress: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 14,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0B2D3E',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  actionBtnSolid: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSolidText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabsScroll: {
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: H_PADDING,
    paddingVertical: 10,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.98)',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6B7A',
  },
  tabTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    padding: H_PADDING,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 12,
  },
  eventSummaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  qrBlock: {
    alignItems: 'center',
    paddingRight: 8,
  },
  qrLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  qrSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B6B7A',
    marginTop: 2,
  },
  eventSummaryText: {
    flex: 1,
    minWidth: 0,
  },
  eventSummaryDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B6B7A',
    lineHeight: 18,
    marginBottom: 14,
  },
  eventMetaRow: {
    flexDirection: 'row',
    gap: 20,
  },
  eventMetaValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  eventMetaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statBoxTeal: {
    backgroundColor: '#F0FDFA',
  },
  statBoxOrange: {
    backgroundColor: '#FFF7ED',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#5B6B7A',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  timelineCard: {
    backgroundColor: '#0B2D3E',
    padding: 16,
  },
  timelineCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    lineHeight: 20,
  },
  emailPreviewWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 4,
  },
  emailPreviewLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  emailPreviewSubject: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 8,
    lineHeight: 20,
  },
  emailPreviewBody: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5B6B7A',
    lineHeight: 19,
    marginBottom: 12,
  },
  emailPreviewAssets: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailPreviewAssetIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  emailPreviewAssetsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  automationRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  automationRuleRowFirst: {
    borderTopWidth: 0,
  },
  automationRuleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
    lineHeight: 18,
  },
  automationRuleCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerReportTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  sellerReportSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  sellerMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  sellerMetric: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  sellerMetricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  sellerMetricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  sellerMetricValueTeal: {
    color: '#0D9488',
  },
  sellerMetricValueOrange: {
    color: '#EA580C',
  },
  sellerSentimentTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 12,
  },
  sellerSentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  sellerSentimentLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#0B2D3E',
    minWidth: 0,
  },
  sellerSentimentBarWrap: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    minWidth: 60,
  },
  sellerSentimentBar: {
    height: '100%',
    backgroundColor: '#0B2D3E',
    borderRadius: 4,
  },
  sellerSentimentPct: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2D3E',
    width: 32,
    textAlign: 'right',
  },
  sellerVisibilityDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B6B7A',
    marginBottom: 14,
    lineHeight: 18,
  },
  sellerCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sellerCheckLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
    flex: 1,
  },
  sellerCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0D9488',
  },
  sellerCheckboxUnchecked: {
    backgroundColor: 'transparent',
    borderColor: '#D1D5DB',
  },
  sellerPushBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerPushBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  visitorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E4EAF2',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  visitorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 10,
  },
  visitorCardNameBlock: {
    flex: 1,
    minWidth: 0,
  },
  visitorCardName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    marginBottom: 2,
  },
  visitorCardEmail: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B6B7A',
  },
  signalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  signalPillHot: {
    backgroundColor: '#FEF2F2',
  },
  signalPillTop3: {
    backgroundColor: '#E0F2FE',
  },
  signalIcon: {
    marginRight: 4,
  },
  signalText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  signalTextHot: {
    color: '#EF4444',
  },
  visitorCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  visitorCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  visitorCardValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D9488',
  },
  syncTextQueued: {
    color: '#EA580C',
  },
  visitorDetailsBtn: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  visitorDetailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  visitorModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  visitorModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    paddingTop: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  visitorModalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitorModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 14,
  },
  visitorModalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitorModalAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  visitorModalHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  visitorModalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  visitorModalName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  visitorModalHotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  visitorModalHotBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  visitorModalContact: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5B6B7A',
    lineHeight: 18,
  },
  visitorModalSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  visitorModalSectionLabelTop: {
    marginTop: 18,
    marginBottom: 10,
  },
  visitorModalContextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  visitorModalContextLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6B7A',
  },
  visitorModalContextValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  visitorModalContextScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D9488',
  },
  visitorModalBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    marginBottom: 10,
  },
  visitorModalBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  visitorModalBtnSecondary: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 10,
  },
  visitorModalBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  visitorModalBtnSecondaryBlue: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0D9488',
    alignItems: 'center',
  },
  visitorModalBtnSecondaryBlueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D9488',
  },
});
