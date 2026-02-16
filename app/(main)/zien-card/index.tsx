import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { DEFAULT_PROFILE_CARD, ProfileCard } from './_components/ProfileCard';
import { ZienCardScreenShell } from './_components/ZienCardScreenShell';

const PROFILES = [
  { id: 'new-work', name: 'New Work Profile', sub: 'work Profile' },
  { id: 'main-work', name: 'Main Work Profile', sub: 'work Profile' },
] as const;

export default function ZienCardDashboardScreen() {
  const router = useRouter();
  const [mainTab, setMainTab] = useState<'mycard' | 'enquiries'>('mycard');
  const [activeProfileId, setActiveProfileId] = useState<(typeof PROFILES)[number]['id']>('new-work');
  const enquiryCount = 0;

  const activeProfile = PROFILES.find((p) => p.id === activeProfileId) ?? PROFILES[0];
  const otherProfiles = PROFILES.filter((p) => p.id !== activeProfileId);

  const handleShare = async () => {
    await Share.share({
      message: `${DEFAULT_PROFILE_CARD.fullName} — Zien Card\nhttps://zien.ai`,
      url: 'https://zien.ai',
      title: 'Zien Card',
    });
  };

  return (
    <ZienCardScreenShell
      title="Digital Card Manager"
      subtitle="Manage and share your digital business cards.">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Active Card — white card, mobile-friendly */}
        <View style={styles.activeCardOuter}>
          <Text style={styles.activeCardLabel}>Active Card</Text>

          <View style={styles.activeProfileRow}>
            <View style={styles.activeProfileIconWrap}>
              <MaterialCommunityIcons name="briefcase-outline" size={22} color="#0B2D3E" />
            </View>
            <View style={styles.activeProfileTextWrap}>
              <Text style={styles.activeProfileTitle} numberOfLines={1}>{activeProfile.name}</Text>
              <Text style={styles.activeProfileSub}>{activeProfile.sub}</Text>
            </View>
          </View>

          <Text style={styles.switchToLabel}>SWITCH TO</Text>

          {otherProfiles.map((profile) => (
            <Pressable
              key={profile.id}
              style={styles.switchToItem}
              onPress={() => setActiveProfileId(profile.id)}
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${profile.name}`}>
              <View style={styles.switchToBullet} />
              <Text style={styles.switchToItemText}>{profile.name}</Text>
            </Pressable>
          ))}

          <Pressable
            style={styles.createProfileBtn}
            onPress={() => { }}
            accessibilityRole="button"
            accessibilityLabel="Create new profile">
            <MaterialCommunityIcons name="plus" size={20} color="#0B2D3E" />
            <Text style={styles.createProfileBtnText}>Create New Profile</Text>
          </Pressable>
        </View>

        {/* Main: Digital Cards + Tabs */}
        <View style={styles.mainSection}>
          <Text style={styles.mainTitle}>Digital Cards</Text>
          <View style={styles.tabsRow}>
            <Pressable
              style={[styles.tab, mainTab === 'mycard' && styles.tabActive]}
              onPress={() => setMainTab('mycard')}>
              <Text style={[styles.tabText, mainTab === 'mycard' && styles.tabTextActive]}>My Card</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, mainTab === 'enquiries' && styles.tabActive]}
              onPress={() => setMainTab('enquiries')}>
              <Text style={[styles.tabText, mainTab === 'enquiries' && styles.tabTextActive]}>Enquiries</Text>
              <View style={styles.enquiryBadge}>
                <Text style={styles.enquiryBadgeText}>{enquiryCount}</Text>
              </View>
            </Pressable>
          </View>

          {mainTab === 'mycard' && (
            <>
              <View style={styles.workCardTag}>
                <Text style={styles.workCardTagText}>WORK CARD</Text>
              </View>

              <View style={styles.profileCardWrap}>
                <ProfileCard card={DEFAULT_PROFILE_CARD} />
              </View>

              {/* Quick Actions — mobile-optimised */}
              <View style={styles.quickActionsCard}>
                <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                <Text style={styles.quickActionsSub}>Manage and share your card.</Text>

                <Pressable
                  style={({ pressed }) => [styles.shareProfileBtn, pressed && styles.shareProfileBtnPressed]}
                  onPress={handleShare}>
                  <MaterialCommunityIcons name="share-variant" size={22} color="#FFFFFF" />
                  <Text style={styles.shareProfileBtnText}>Share Profile</Text>
                </Pressable>

                <View style={styles.secondaryActionsRow}>
                  <Pressable
                    style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
                    onPress={() => router.push('/(main)/zien-card/basic-information')}>
                    <MaterialCommunityIcons name="file-document-outline" size={20} color="#0B2D3E" />
                    <Text style={styles.secondaryBtnText}>Preview</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
                    onPress={() => { }}>
                    <MaterialCommunityIcons name="link-variant" size={20} color="#0B2D3E" />
                    <Text style={styles.secondaryBtnText}>Copy Link</Text>
                  </Pressable>
                </View>

                <View style={styles.leadsBlock}>
                  <View style={styles.leadsIconWrap}>
                    <MaterialCommunityIcons name="account-group-outline" size={22} color="#0BA0B2" />
                  </View>
                  <View style={styles.leadsTextWrap}>
                    <Text style={styles.leadsLabel}>TOTAL LEADS</Text>
                    <Text style={styles.leadsMeta}>All time</Text>
                  </View>
                  <Text style={styles.leadsValue}>0</Text>
                </View>
              </View>

              {/* Go Mobile — web only (hidden on native app) */}
              {Platform.OS === 'web' && (
                <View style={styles.goMobileCard}>
                  <MaterialCommunityIcons name="cellphone" size={24} color="#0B2D3E" />
                  <View style={styles.goMobileTextWrap}>
                    <Text style={styles.goMobileTitle}>Go Mobile</Text>
                    <Text style={styles.goMobileSub}>Manage your digital cards on the go with the Zien App.</Text>
                  </View>
                  <Pressable style={styles.getAppBtn}>
                    <Text style={styles.getAppBtnText}>Get App →</Text>
                  </Pressable>
                </View>
              )}
            </>
          )}

          {mainTab === 'enquiries' && (
            <View style={styles.enquiriesSection}>
              <Text style={styles.enquiriesHeading}>Enquiries</Text>
              <Text style={styles.enquiriesSubheading}>Manage leads and contacts collected from your digital cards.</Text>
              <View style={styles.enquiriesEmptyCard}>
                <MaterialCommunityIcons name="account-group-outline" size={64} color="#9AA7B6" />
                <Text style={styles.enquiriesEmptyTitle}>No Data Yet</Text>
                <Text style={styles.enquiriesEmptyText}>
                  Share your card QR code to start collecting enquiries. When someone scans and shares their info, it will appear here.
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ZienCardScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 24,
  },
  activeCardOuter: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    padding: 18,
    minHeight: 44,
  },
  activeCardLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 14,
  },
  activeProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  activeProfileIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeProfileTextWrap: { flex: 1, minWidth: 0 },
  activeProfileTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  activeProfileSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 2,
  },
  switchToLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#7B8794',
    letterSpacing: 0.6,
    marginTop: 18,
    marginBottom: 10,
  },
  switchToItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    minHeight: 48,
  },
  switchToBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0B2D3E',
  },
  switchToItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
    flex: 1,
  },
  createProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D7DEE7',
    marginTop: 8,
    minHeight: 52,
  },
  createProfileBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  mainSection: {},
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    borderWidth: 1,
    borderColor: '#0BA0B2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B6B7A',
  },
  tabTextActive: {
    color: '#0B2D3E',
  },
  enquiryBadge: {
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  enquiryBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  workCardTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0B2D3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 14,
  },
  workCardTagText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileCardWrap: {
    marginBottom: 20,
  },
  quickActionsCard: {
    backgroundColor: '#F7FBFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3ECF4',
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  quickActionsSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 6,
    marginBottom: 18,
  },
  shareProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#0B2D3E',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 14,
    minHeight: 52,
  },
  shareProfileBtnPressed: {
    opacity: 0.88,
  },
  shareProfileBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    minHeight: 52,
  },
  secondaryBtnPressed: {
    backgroundColor: '#EEF3F8',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  leadsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 18,
    paddingTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  leadsIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 160, 178, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadsTextWrap: { flex: 1 },
  leadsLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#7B8794',
    letterSpacing: 0.5,
  },
  leadsValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  leadsMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 2,
  },
  goMobileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F7FBFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  goMobileTextWrap: { flex: 1 },
  goMobileTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
  },
  goMobileSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 4,
  },
  getAppBtn: {
    backgroundColor: '#0B2D3E',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  getAppBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  enquiriesSection: {
    paddingTop: 8,
  },
  enquiriesHeading: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 6,
  },
  enquiriesSubheading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B6B7A',
    marginBottom: 24,
    lineHeight: 20,
  },
  enquiriesEmptyCard: {
    backgroundColor: '#F7FBFF',
    borderRadius: 22,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D7DEE7',
    minHeight: 280,
  },
  enquiriesEmptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2D3E',
    marginTop: 20,
  },
  enquiriesEmptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  placeholderBox: {
    backgroundColor: '#F7FBFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
    minHeight: 200,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    marginTop: 12,
  },
  placeholderSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 6,
    textAlign: 'center',
  },
  bottomSpacer: { height: 8 },
});
