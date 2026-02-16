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
import { ZienCardScreenShell } from './_components/ZienCardScreenShell';

const STAT_CARDS = [
  { key: 'total', label: 'Total Leads', value: '0', icon: 'account-outline' as const, iconBg: '#E0F2FE' },
  { key: 'month', label: 'This Month', value: '0', icon: 'calendar-outline' as const, iconBg: '#DCFCE7' },
  { key: 'rate', label: 'Response Rate', value: '0%', icon: 'email-open-outline' as const, iconBg: '#FFEDD5' },
];

const TABLE_HEADERS = ['NAME', 'EMAIL', 'PHONE', 'DATE', 'ACTIONS'];

export default function ZienCardLeadEnquiriesScreen() {
  const [search, setSearch] = useState('');

  const onExportCsv = () => {
    // TODO: export leads as CSV
  };

  return (
    <ZienCardScreenShell
      title="Lead Enquiries"
      subtitle="Manage and track leads generated from your digital card."
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.exportBtn}
          onPress={onExportCsv}
          accessibilityRole="button"
          accessibilityLabel="Export CSV">
          <MaterialCommunityIcons name="download" size={18} color="#FFFFFF" />
          <Text style={styles.exportBtnText}>Export CSV</Text>
        </Pressable>
        {/* Summary cards */}
        <View style={styles.statsRow}>
          {STAT_CARDS.map((stat) => (
            <View key={stat.key} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: stat.iconBg }]}>
                <MaterialCommunityIcons
                  name={stat.icon}
                  size={22}
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
            onPress={() => { }}
            accessibilityRole="button"
            accessibilityLabel="Filters">
            <MaterialCommunityIcons name="filter-outline" size={20} color="#5B6B7A" />
            <Text style={styles.filtersBtnText}>Filters</Text>
          </Pressable>
        </View>

        {/* Table / Empty state */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            {TABLE_HEADERS.map((h) => (
              <Text key={h} style={styles.tableHeaderText} numberOfLines={1}>
                {h}
              </Text>
            ))}
          </View>
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-outline" size={56} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No leads found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search or share your card to get more leads.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ZienCardScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24 },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0B2D3E',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 14,
    alignItems: 'center',
    minWidth: 0,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B6B7A',
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
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0B2D3E',
    paddingVertical: 12,
    paddingRight: 8,
  },
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    paddingHorizontal: 14,
    minHeight: 48,
  },
  filtersBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B6B7A',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    overflow: 'hidden',
    minHeight: 280,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF4',
    gap: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: '#9AA7B6',
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6B7A',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacer: { height: 24 },
});
