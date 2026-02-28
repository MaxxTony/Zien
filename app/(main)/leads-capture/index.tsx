import { PageHeader } from '@/components/ui/PageHeader';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type LeadCaptureItem = {
    id: string;
    title: string;
    time: string;
    status: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const CAPTURE_HISTORY: LeadCaptureItem[] = [
    {
        id: '1',
        title: 'Main Website Contact Form',
        time: 'Active',
        status: '42 leads this week',
        icon: 'form-select',
    },
    {
        id: '2',
        title: 'Facebook Lead Gen Campaign',
        time: 'Active',
        status: '12 new inquiries',
        icon: 'facebook',
    },
    {
        id: '3',
        title: 'Open House QR Code',
        time: '2 days ago',
        status: '8 scans recorded',
        icon: 'qrcode-scan',
    },
    {
        id: '4',
        title: 'Zien Card Digital Tap',
        time: '3 days ago',
        status: '15 connections made',
        icon: 'card-account-phone-outline',
    },
];

export default function LeadsCaptureScreen() {
    const router = useRouter();

    const renderItem = ({ item }: { item: LeadCaptureItem }) => (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push({
                pathname: '/(main)/chat-modal',
                params: { initialMessage: item.title }
            })}
        >
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={item.icon} size={18} color="#5B6B7A" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>
                    {item.time} <Text style={styles.dot}>•</Text> {item.status}
                </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#E2E8F0" />
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader
                title="Leads Capture"
                subtitle="Manage your lead sources"
                onBack={() => router.back()}
            />

            <View style={styles.headerActionRow}>
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
                    <TextInput
                        placeholder="Search capture sources..."
                        placeholderTextColor="#94A3B8"
                        style={styles.searchInput}
                    />
                </View>
                <Pressable
                    style={({ pressed }) => [styles.newBtn, pressed && { opacity: 0.8 }]}
                    onPress={() => router.push({ pathname: '/(main)/chat-modal', params: { action: 'new_source' } })}
                >
                    <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                    <Text style={styles.newBtnText}>Create</Text>
                </Pressable>
            </View>

            <FlatList
                data={CAPTURE_HISTORY}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB',
    },
    headerActionRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#102A43',
        marginLeft: 8,
    },
    newBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#102A43',
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 44,
        gap: 6,
    },
    newBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    cardPressed: {
        backgroundColor: '#F8FAFC',
        borderColor: Theme.accentTeal,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#102A43',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#627D98',
        lineHeight: 16,
    },
    dot: {
        color: '#BCCCDC',
        marginHorizontal: 2,
    },
});
