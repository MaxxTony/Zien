import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock image for simulation if picker doesn't work or for default demo
const MOCK_ENHANCED_IMAGE = 'https://images.unsplash.com/photo-1600596542815-6ad4c727dddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80';

type FlowStep = 'upload' | 'processing' | 'preview' | 'success';

export default function ImageEnhancerScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [step, setStep] = useState<FlowStep>('upload');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                // In a real app, we would upload here.
                // For this demo, we simulate the 'upload' and then go to processing.
                setImageUri(result.assets[0].uri);
                setStep('processing');
            }
        } catch (error) {
            // Fallback for environments where ImagePicker might fail (simulators/web sometimes)
            // creating a mock experience
            console.log('Image Picker Error or Cancelled:', error);
            // Simulate successful pick for demo purposes if it fails
            setImageUri(MOCK_ENHANCED_IMAGE);
            setStep('processing');
        }
    };

    // Simulate Processing Delay
    useEffect(() => {
        if (step === 'processing') {
            const timer = setTimeout(() => {
                setStep('preview');
            }, 3000); // 3 seconds processing
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleTryAnother = () => {
        setImageUri(null);
        setStep('upload');
    };

    const handleSave = () => {
        setStep('success');
    };

    const handleDone = () => {
        router.back();
    };

    const renderHeader = (title: string, subtitle?: string) => (
        <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => step === 'upload' ? router.back() : handleTryAnother()}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
            </Pressable>
            <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    );

    // --- STEP 1: UPLOAD ---
    const renderUpload = () => (
        <View style={styles.contentContainer}>
            {renderHeader('AI Image Enhancer', 'Upload property photos for AI-driven upscaling and virtual staging.')}

            <Pressable style={styles.uploadZone} onPress={pickImage}>
                <View style={styles.uploadIconCircle}>
                    <MaterialCommunityIcons name="tray-arrow-up" size={32} color="#0B2D3E" />
                </View>
                <Text style={styles.uploadTitle}>Drop image here or click to browse</Text>
                <Text style={styles.uploadSubtitle}>
                    Supports JPG, PNG (Max 10MB). Best for low-res property shots.
                </Text>
            </Pressable>
        </View>
    );

    // --- STEP 2: PROCESSING ---
    const renderProcessing = () => (
        <View style={styles.centerContainer}>
            <View style={styles.loaderCircle}>
                <MaterialCommunityIcons name="auto-fix" size={40} color="#0B2D3E" />
            </View>
            <View style={{ marginBottom: 20 }}>
                <ActivityIndicator size="small" color="#0B2D3E" />
            </View>

            <Text style={styles.loadingTitle}>Enhancing & Upscaling...</Text>
            <Text style={styles.loadingSubtitle}>
                AI is removing noise, sharpening details, and optimizing dynamic range.
            </Text>
        </View>
    );

    // --- STEP 3: PREVIEW ---
    const renderPreview = () => (
        <View style={styles.contentContainer}>
            {/* Custom Header for Preview with Actions */}
            <View style={styles.previewHeaderContainer}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Pressable style={styles.backButton} onPress={handleTryAnother}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#0B2D3E" />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Enhanced Preview</Text>
                        <Text style={styles.headerSubtitle}>Your image has been upscaled to 4K resolution with improved clarity.</Text>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <Pressable
                        style={styles.regenerateBtn}
                        onPress={handleTryAnother}
                    >
                        <MaterialCommunityIcons name="refresh" size={16} color="#0B2D3E" />
                        <Text style={styles.regenerateText}>Try Another</Text>
                    </Pressable>
                    <Pressable style={styles.headerSaveBtn} onPress={handleSave}>
                        <MaterialCommunityIcons name="content-save-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.headerSaveBtnText}>Save Enhanced Photo</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.previewCard}>
                <Image
                    source={{ uri: imageUri || MOCK_ENHANCED_IMAGE }}
                    style={styles.previewImage}
                    resizeMode="cover"
                />
                <View style={styles.badge}>
                    <MaterialCommunityIcons name="auto-fix" size={16} color="#0B2D3E" />
                    <Text style={styles.badgeText}>AI ENHANCED (4K)</Text>
                </View>
            </View>
            {/* Note: In a real app we might show 'Before' vs 'After' toggle. 
                 The screenshot just shows the enhanced image. 
             */}
        </View>
    );

    // --- STEP 4: SUCCESS ---
    const renderSuccess = () => (
        <View style={styles.centerContainer}>
            <View style={[styles.successCircle, { backgroundColor: '#0B2D3E' }]}>
                <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Image Exported!</Text>
            <Text style={styles.successSubtitle}>
                Your optimized property photo has been saved to the asset library.
            </Text>
            <Pressable style={styles.returnButton} onPress={handleDone}>
                <Text style={styles.returnButtonText}>Back to Hub</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F0F6FA', '#E0ECF4', '#F4F0EE']}
                style={[styles.background, { paddingTop: insets.top }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {step === 'upload' && renderUpload()}
                {step === 'processing' && renderProcessing()}
                {step === 'preview' && renderPreview()}
                {step === 'success' && renderSuccess()}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    header: {
        marginBottom: 24,
        marginTop: 10,
        flexDirection: 'row',
        gap: 10
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    headerText: {
        flex: 1,
        gap: 4,
        paddingRight: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0B2D3E',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        flexWrap: 'wrap',
    },
    // Upload Step
    uploadZone: {
        flex: 1,
        maxHeight: 400,
        backgroundColor: '#EBEFF3', // Slightly darker than white for the zone
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#CBD5E1', // Dashed look simulated with color/width, RN doesn't do dashed borders easily on Views without extra libs or SVG, but simple solid is fine or we try 'dashed' style:
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 20,
    },
    uploadIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 2,
    },
    uploadTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0B2D3E',
        marginBottom: 12,
        textAlign: 'center',
    },
    uploadSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    // Processing Step
    loaderCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#FFFFFF', // Outer ring
        // borderTopColor: '#0B2D3E', // Animation would rotate this
        // Using static icon for now + separate ActivityIndicator
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 12,
        textAlign: 'center',
    },
    loadingSubtitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    // Preview Step
    previewHeaderContainer: {
        marginBottom: 24,
        marginTop: 10,
        gap: 16,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    headerSaveBtn: {
        backgroundColor: '#0B2D3E',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerSaveBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
    },
    regenerateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    regenerateText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0B2D3E',
    },
    previewCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 24,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#0B2D3E',
    },
    // Success Step
    successCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0B2D3E',
        marginBottom: 12,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    returnButton: {
        backgroundColor: '#0B2D3E',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        minWidth: 200,
        alignItems: 'center',
    },
    returnButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
