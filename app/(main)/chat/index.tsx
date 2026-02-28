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

type ChatHistoryItem = {
    id: string;
    title: string;
    time: string;
    snippet: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const CHAT_HISTORY: ChatHistoryItem[] = [
    {
        id: '1',
        title: 'Property valuation for 124 Ocean Drive',
        time: '2 hours ago',
        snippet: 'The valuation report is ready...',
        icon: 'robot-outline',
    },
    {
        id: '2',
        title: 'Lead engagement strategy',
        time: 'Yesterday',
        snippet: 'Based on recent activity, I suggest...',
        icon: 'robot-outline',
    },
    {
        id: '3',
        title: 'Social media campaign ideas',
        time: '2 days ago',
        snippet: 'Here are 5 content ideas for your...',
        icon: 'robot-outline',
    },
    {
        id: '4',
        title: 'Investment ROI analysis',
        time: '3 days ago',
        snippet: 'The projected return on investment for...',
        icon: 'robot-outline',
    },
    {
        id: '5',
        title: 'Marketing copy for Malibu Villa',
        time: '4 days ago',
        snippet: 'Experience the ultimate luxury in...',
        icon: 'robot-outline',
    },
    {
        id: '6',
        title: 'Follow-up email sequence',
        time: '5 days ago',
        snippet: 'Hi Sarah, it was great meeting you...',
        icon: 'robot-outline',
    },
    {
        id: '7',
        title: 'Market trends in Los Angeles',
        time: '1 week ago',
        snippet: 'The current market trends show a...',
        icon: 'robot-outline',
    },
    {
        id: '8',
        title: 'Client presentation deck notes',
        time: '1 week ago',
        snippet: 'Key points to highlight in the deck...',
        icon: 'robot-outline',
    },
    {
        id: '9',
        title: 'Property tax analysis',
        time: '2 weeks ago',
        snippet: 'The estimated property tax for 2026 is...',
        icon: 'robot-outline',
    },
    {
        id: '10',
        title: 'Neighborhood guide: Brentwood',
        time: '2 weeks ago',
        snippet: 'Brentwood is a prestigious area known for...',
        icon: 'robot-outline',
    },
    {
        id: '11',
        title: 'Closing documents checklist',
        time: '3 weeks ago',
        snippet: 'Prepare these documents before the...',
        icon: 'robot-outline',
    },
    {
        id: '12',
        title: 'Open house prep list',
        time: '1 month ago',
        snippet: 'Make sure these 10 items are ready...',
        icon: 'robot-outline',
    },
];

export default function ChatHistoryScreen() {
    const router = useRouter();

    const renderItem = ({ item }: { item: ChatHistoryItem }) => (
        <Pressable
            style={({ pressed }) => [styles.chatCard, pressed && styles.chatCardPressed]}
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
                    {item.time} <Text style={styles.dot}>•</Text> {item.snippet}
                </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#E2E8F0" />
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader
                title="Chat History"
                subtitle="Your previous AI interactions"
                onBack={() => router.back()}
            />

            <View style={styles.headerActionRow}>
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
                    <TextInput
                        placeholder="Search your chats..."
                        placeholderTextColor="#94A3B8"
                        style={styles.searchInput}
                    />
                </View>
                <Pressable
                    style={({ pressed }) => [styles.newChatBtn, pressed && { opacity: 0.8 }]}
                    onPress={() => router.push('/(main)/chat-modal')}
                >
                    <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                    <Text style={styles.newChatBtnText}>New</Text>
                </Pressable>
            </View>

            <FlatList
                data={CHAT_HISTORY}
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
    newChatBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#102A43',
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 44,
        gap: 6,
    },
    newChatBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        gap: 12,
    },
    chatCard: {
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
    chatCardPressed: {
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
