import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type PageHeaderProps = {
    /** Main heading text */
    title: string;
    /** Secondary description below the title */
    subtitle?: string;
    /** Orange badge count shown next to the title (hidden when 0 or undefined) */
    badgeCount?: number;
    /** Called when the back arrow is pressed */
    onBack: () => void;
    /** Optional right-side action icon (MaterialCommunityIcons name) */
    rightIcon?: string;
    /** Callback for the right action icon */
    onRightPress?: () => void;
    /** Tint color for the right icon button background and icon (default: teal) */
    rightIconColor?: string;
};

export const PageHeader = memo(function PageHeader({
    title,
    subtitle,
    badgeCount,
    onBack,
    rightIcon,
    onRightPress,
    rightIconColor = Theme.accentTeal,
}: PageHeaderProps) {
    return (
        <View style={styles.wrap}>
            {/* ── Back button ── */}
            <Pressable
                style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
                onPress={onBack}
                hitSlop={12}
            >
                <MaterialCommunityIcons name="arrow-left" size={20} color={Theme.textPrimary} />
            </Pressable>

            {/* ── Title + subtitle ── */}
            <View style={styles.center}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>

                </View>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            {/* ── Optional right action button ── */}
            {rightIcon ? (
                <Pressable
                    style={({ pressed }) => [
                        styles.rightBtn,
                        { backgroundColor: `${rightIconColor}12`, borderColor: `${rightIconColor}25` },
                        pressed && { opacity: 0.7 },
                    ]}
                    onPress={onRightPress}
                    hitSlop={12}
                >
                    <MaterialCommunityIcons name={rightIcon as any} size={20} color={rightIconColor} />
                </Pressable>
            ) : (
                /* Spacer so title stays centred when there's no right icon */
                <View style={styles.rightPlaceholder} />
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 18,
        gap: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: 'rgba(255,255,255,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(225,232,242,0.9)',
        shadowColor: '#0A2F48',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    center: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: Theme.textPrimary,
        letterSpacing: -0.3,
        flexShrink: 1,
    },
    badge: {
        backgroundColor: '#EA580C',
        borderRadius: 999,
        minWidth: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#fff',
    },
    subtitle: {
        fontSize: 13,
        color: Theme.textSecondary,
        fontWeight: '500',
        marginTop: 3,
        lineHeight: 18,
    },
    rightBtn: {
        width: 40,
        height: 40,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    rightPlaceholder: {
        width: 40,
    },
});
