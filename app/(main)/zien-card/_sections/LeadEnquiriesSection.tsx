import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const STAT_CARDS = [
  { key: 'total', label: 'Total Leads', value: '5', icon: 'account-outline' as const, iconBg: '#E0F2FE' },
  { key: 'month', label: 'This Month', value: '3', icon: 'calendar-outline' as const, iconBg: '#DCFCE7' },
  { key: 'rate', label: 'Response Rate', value: '80%', icon: 'email-open-outline' as const, iconBg: '#FFEDD5' },
];

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: 'New' | 'Pending' | 'Contacted';
  source: string;
}

const DUMMY_LEADS: Lead[] = [];

interface LeadEnquiriesSectionProps {
  onSectionChange?: (section: string) => void;
}

export function LeadEnquiriesSection({ onSectionChange }: LeadEnquiriesSectionProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const [search, setSearch] = useState('');

  const onExportCsv = () => {
    // TODO: export leads as CSV
  };

  const filteredLeads = DUMMY_LEADS.filter(lead =>
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New': return '#3B82F6';
      case 'Pending': return '#F59E0B';
      case 'Contacted': return '#10B981';
      default: return '#64748B';
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* Summary cards */}
      <View style={styles.statsRow}>
        {STAT_CARDS.map((stat) => (
          <View key={stat.key} style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: stat.iconBg }]}>
              <MaterialCommunityIcons
                name={stat.icon}
                size={18}
                color="#0B2D3E"
              />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Search + Filters */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9AA7B6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor="#9AA7B6"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Pressable
          style={styles.filtersBtn}
          onPress={() => { }}>
          <MaterialCommunityIcons name="filter-outline" size={20} color="#5B6B7A" />
        </Pressable>
      </View>

      {/* Leads List */}
      <Text style={styles.listHeader}>Recent Leads</Text>

      {filteredLeads.length > 0 ? (
        filteredLeads.map((lead) => (
          <View key={lead.id} style={styles.leadCard}>
            <View style={styles.leadHeader}>
              <View style={styles.leadInfo}>
                <View style={[styles.avatar, { backgroundColor: getStatusColor(lead.status) + '20' }]}>
                  <Text style={[styles.avatarText, { color: getStatusColor(lead.status) }]}>
                    {lead.name[0]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.leadName}>{lead.name}</Text>
                  <Text style={styles.leadDate}>{lead.date} • {lead.source}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) + '15' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(lead.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>{lead.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.leadBody}>
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="email-outline" size={16} color="#9AA7B6" />
                <Text style={styles.contactText} numberOfLines={1}>{lead.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="phone-outline" size={16} color="#9AA7B6" />
                <Text style={styles.contactText}>{lead.phone}</Text>
              </View>
            </View>

            <View style={styles.leadActions}>
              <Pressable style={[styles.actionBtn, { backgroundColor: '#10B981' }]}>
                <MaterialCommunityIcons name="phone" size={18} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Call</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, { backgroundColor: colors.accentTeal }]}>
                <MaterialCommunityIcons name="email" size={18} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Email</Text>
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="magnify" size={56} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No matching leads</Text>
          <Text style={styles.emptySub}>Try adjusting your search terms.</Text>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24 },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0BA0B2',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 15,
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
    alignItems: 'center',
    minWidth: 0,
    elevation: 2,
    shadowColor: colors.cardShadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    minHeight: 52,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: 12,
    paddingRight: 8,
  },
  filtersBtn: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    elevation: 1,
  },
  listHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  leadCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: colors.cardShadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
  },
  leadName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  leadDate: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: 16,
    opacity: 0.5,
  },
  leadBody: {
    gap: 10,
    marginBottom: 18,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  leadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
