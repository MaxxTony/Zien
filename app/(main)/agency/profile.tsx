import { PageHeader } from '@/components/ui';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AgencyProfile() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();

    return (
        <LinearGradient
            colors={colors.backgroundGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <PageHeader
                title="Agency Profile"
                subtitle="Manage your personal and company contact details"
                onBack={() => router.back()}
                rightIconColor={colors.accentTeal}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                {/* Identity & Status Card */}
                <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.avatarCircle}>
                        <View style={[styles.avatarBg, { backgroundColor: colors.surfaceSoft }]}>
                            <MaterialCommunityIcons name="account" size={56} color={colors.accentTeal} />
                        </View>
                        <View style={styles.verifiedBadge}>
                            <MaterialCommunityIcons name="shield-check" size={14} color="#fff" />
                        </View>
                    </View>
                    <Text style={[styles.profileName, { color: colors.textPrimary }]}>Skyline Agency Admin</Text>
                    <Text style={styles.profileRole}>MANAGING DIRECTOR</Text>

                    <View style={styles.statusSection}>
                        <Text style={styles.sectionLabel}>ACCOUNT STATUS</Text>
                        <View style={[styles.statusBox, { backgroundColor: colors.surfaceSoft, borderColor: colors.cardBorder }]}>
                            <View style={styles.statusRow}>
                                <Text style={[styles.statusLabelText, { color: colors.textSecondary }]}>Verification</Text>
                                <Text style={[styles.statusValue, { color: '#10B981' }]}>Verified</Text>
                            </View>
                            <View style={[styles.statusRow, { borderBottomWidth: 0 }]}>
                                <Text style={[styles.statusLabelText, { color: colors.textSecondary }]}>Member Since</Text>
                                <Text style={[styles.statusValue, { color: colors.textPrimary }]}>Dec 2023</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Form Sections */}
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                            placeholder="Skyline Agency Admin"
                            placeholderTextColor={colors.inputPlaceholder}
                            returnKeyType="next"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                            placeholder="admin@skyline-realty.com"
                            placeholderTextColor={colors.inputPlaceholder}
                            keyboardType="email-address"
                            returnKeyType="next"
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone Number</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                            placeholder="+1 (555) 123-4567"
                            placeholderTextColor={colors.inputPlaceholder}
                            keyboardType="phone-pad"
                            returnKeyType="next"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Agency Website</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                            placeholder="https://skyline-realty.com"
                            placeholderTextColor={colors.inputPlaceholder}
                            keyboardType="url"
                            returnKeyType="next"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={[styles.sectionLabel, { marginTop: 12 }]}>COMPANY INFORMATION</Text>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Office Address</Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12, backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                            multiline
                            placeholder="Suite 405, Innovation Tower, Tech Park, Berlin, Germany"
                            placeholderTextColor={colors.inputPlaceholder}
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Company Registration No.</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                            placeholder="DE-99120349"
                            placeholderTextColor={colors.inputPlaceholder}
                            returnKeyType="next"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Tax ID</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, color: colors.textPrimary }]}
                            placeholder="VAT-77283"
                            placeholderTextColor={colors.inputPlaceholder}
                            returnKeyType="done"
                        />
                    </View>
                </View>

                {/* Fixed Save Button at the Bottom of Scroll */}
                <Pressable style={[styles.saveBtn, { backgroundColor: colors.accentTeal }]}>
                    <Text style={styles.saveBtnText}>Save Profile</Text>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    </LinearGradient>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    card: {
        borderRadius: 28,
        padding: 24,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatarCircle: {
        width: 110,
        height: 110,
        marginBottom: 16,
        position: 'relative',
    },
    avatarBg: {
        width: 110,
        height: 110,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 26,
        height: 26,
        borderRadius: 9,
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    profileName: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
    },
    profileRole: {
        fontSize: 11,
        fontWeight: '900',
        color: '#F97316',
        textAlign: 'center',
        marginTop: 6,
        letterSpacing: 1.5,
    },
    statusSection: {
        width: '100%',
        marginTop: 24,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.2,
        marginBottom: 14,
    },
    statusBox: {
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,00,0,0.05)',
    },
    statusLabelText: {
        fontSize: 13,
        fontWeight: '600',
    },
    statusValue: {
        fontSize: 13,
        fontWeight: '800',
    },
    formContainer: {
        gap: 16,
    },
    inputGroup: {
        gap: 6,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '800',
        marginLeft: 4,
    },
    input: {
        borderRadius: 16,
        height: 52,
        paddingHorizontal: 16,
        fontSize: 14,
        fontWeight: '600',
        borderWidth: 1,
    },
    saveBtn: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        shadowColor: '#0BA0B2',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
    },
});
