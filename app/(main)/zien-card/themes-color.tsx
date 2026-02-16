import { useFonts, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Lato_700Bold } from '@expo-google-fonts/lato';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Roboto_700Bold } from '@expo-google-fonts/roboto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DEFAULT_PROFILE_CARD, ProfileCard } from './_components/ProfileCard';
import { ZienCardScreenShell } from './_components/ZienCardScreenShell';

type SelectedFontLabel = 'Inter' | 'Roboto' | 'Playfair' | 'Lato';

/** Har font ka actual loaded family name - card par yahi apply hota hai */
const FONT_LABEL_TO_FAMILY: Record<SelectedFontLabel, string> = {
  Inter: 'Inter_800ExtraBold',
  Roboto: 'Roboto_700Bold',
  Playfair: 'PlayfairDisplay_700Bold',
  Lato: 'Lato_700Bold',
};

type TemplateId = 'classic' | 'modern' | 'luxury' | 'minimal' | 'bold';

const TEMPLATES: {
  id: TemplateId;
  label: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { id: 'classic', label: 'Classic', description: 'Clean & Pro', icon: 'domain' },
  { id: 'modern', label: 'Modern', description: 'Sleek Visuals', icon: 'format-list-checks' },
  { id: 'luxury', label: 'Luxury', description: 'Premium Feel', icon: 'diamond-stone' },
  { id: 'minimal', label: 'Minimal', description: 'Less is More', icon: 'circle-outline' },
  { id: 'bold', label: 'Bold', description: 'High Impact', icon: 'lightning-bolt' },
];

const ACCENT_COLORS = [
  '#0B2341',
  '#0B6B9E',
  '#0D9488',
  '#059669',
  '#65A30D',
  '#EAB308',
  '#EA580C',
  '#DC2626',
  '#DB2777',
  '#7C3AED',
  '#4C1D95',
  '#475569',
  '#0F172A',
] as const;

const FONT_OPTIONS: {
  label: SelectedFontLabel;
  tag: string;
  fontFamily: string;
}[] = [
  { label: 'Inter', tag: 'Sans-Serif', fontFamily: 'Inter_800ExtraBold' },
  { label: 'Roboto', tag: 'Geometric', fontFamily: 'Roboto_700Bold' },
  { label: 'Playfair', tag: 'Serif', fontFamily: 'PlayfairDisplay_700Bold' },
  { label: 'Lato', tag: 'Humanist', fontFamily: 'Lato_700Bold' },
];

export default function ZienCardThemesColorScreen() {
  const router = useRouter();
  const [template, setTemplate] = useState<TemplateId>('modern');
  const [accentColor, setAccentColor] = useState<string>(ACCENT_COLORS[0]);
  const [selectedFontLabel, setSelectedFontLabel] = useState<SelectedFontLabel>('Inter');

  const [fontsLoaded] = useFonts({
    Inter_800ExtraBold,
    Roboto_700Bold,
    PlayfairDisplay_700Bold,
    Lato_700Bold,
  });

  const onSave = () => {
    Alert.alert('Saved', 'Your theme and color preferences have been saved.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const selectedFontFamily = fontsLoaded ? FONT_LABEL_TO_FAMILY[selectedFontLabel] : undefined;
  const headingFontFamily = selectedFontFamily;
  const bodyFontFamily = selectedFontFamily;

  return (
    <ZienCardScreenShell
      title="Themes & Colors"
      subtitle="Define the visual style of your card"
      headerRight={
        <Pressable
          style={styles.headerSaveBtn}
          onPress={onSave}
          accessibilityRole="button"
          accessibilityLabel="Save changes">
          <MaterialCommunityIcons name="content-save" size={22} color="#0B2D3E" />
        </Pressable>
      }>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Card preview */}
        <View style={styles.previewWrap}>
          <View style={styles.cardWrap}>
            <ProfileCard
              card={DEFAULT_PROFILE_CARD}
              accentColor={accentColor}
              template={template === 'classic' ? 'classic' : template === 'luxury' ? 'luxury' : template === 'minimal' ? 'minimal' : template === 'bold' ? 'bold' : 'modern'}
              headingFontFamily={headingFontFamily}
              bodyFontFamily={bodyFontFamily}
            />
          </View>
        </View>

        {/* Select Template */}
        <Text style={styles.sectionTitle}>Select Template</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templateRow}
          style={styles.templateScroll}>
          {TEMPLATES.map((t) => (
            <Pressable
              key={t.id}
              style={[
                styles.templateChip,
                template === t.id && [
                  styles.templateChipActive,
                  { borderColor: accentColor },
                ],
              ]}
              onPress={() => setTemplate(t.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: template === t.id }}>
              <View style={styles.templateIconWrap}>
                <MaterialCommunityIcons
                  name={t.icon}
                  size={22}
                  color={template === t.id ? accentColor : '#5B6B7A'}
                />
              </View>
              <Text
                style={[
                  styles.templateLabel,
                  template === t.id && { color: accentColor },
                ]}
                numberOfLines={1}>
                {t.label}
              </Text>
              <Text style={styles.templateDesc} numberOfLines={1}>
                {t.description}
              </Text>
              {template === t.id && (
                <View style={[styles.templateCheck, { backgroundColor: accentColor }]}>
                  <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>

        {/* Accent Color */}
        <Text style={styles.sectionTitle}>Accent Color</Text>
        <View style={styles.colorRow}>
          {ACCENT_COLORS.map((hex) => (
            <Pressable
              key={hex}
              style={[
                styles.colorSwatch,
                { backgroundColor: hex },
                accentColor === hex && [
                  styles.colorSwatchSelected,
                  { borderColor: accentColor },
                ],
              ]}
              onPress={() => setAccentColor(hex)}
              accessibilityRole="button"
              accessibilityState={{ selected: accentColor === hex }}
              accessibilityLabel={`Color ${hex}`}>
              {accentColor === hex && (
                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
              )}
            </Pressable>
          ))}
          <Pressable
            style={styles.colorSwatchCustom}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Add custom color">
            <MaterialCommunityIcons name="plus" size={22} color="#5B6B7A" />
          </Pressable>
        </View>
        <View style={styles.hexRow}>
          <Text style={styles.hexLabel}>Hex</Text>
          <Text style={styles.hexValue}>{accentColor.toUpperCase()}</Text>
        </View>

        {/* Typography - har font alag row, sirf ek selected */}
        <Text style={styles.sectionTitle}>Typography</Text>
        {FONT_OPTIONS.map((opt) => {
          const isSelected = selectedFontLabel === opt.label;
          return (
            <Pressable
              key={opt.label}
              style={[
                styles.fontRowSingle,
                isSelected && [
                  styles.fontRowActive,
                  { borderColor: accentColor },
                ],
              ]}
              onPress={() => setSelectedFontLabel(opt.label as SelectedFontLabel)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}>
              <View style={styles.fontColSingle}>
                <Text
                  style={[
                    styles.fontLabelSingle,
                    isSelected && { color: accentColor },
                    fontsLoaded && { fontFamily: opt.fontFamily },
                  ]}>
                  {opt.label}
                </Text>
                <Text style={styles.fontTag}>{opt.tag}</Text>
              </View>
              {isSelected && (
                <View style={[styles.fontCheck, { backgroundColor: accentColor }]}>
                  <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          );
        })}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ZienCardScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24 },
  headerSaveBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F7FBFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECF4',
  },
  previewWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  cardWrap: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 14,
  },
  templateScroll: { marginHorizontal: -18, marginBottom: 24 },
  templateRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  templateChip: {
    width: 100,
    backgroundColor: '#F7FBFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E3ECF4',
    padding: 14,
    alignItems: 'center',
  },
  templateChipActive: {
    backgroundColor: '#EEF3F8',
  },
  templateIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EEF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  templateLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  templateDesc: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 2,
  },
  templateCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {},
  colorSwatchCustom: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8EEF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E3ECF4',
  },
  hexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  hexLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
  },
  hexValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    fontFamily: 'monospace',
  },
  fontRowSingle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FBFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E3ECF4',
    padding: 16,
    marginBottom: 10,
  },
  fontRowActive: {
    backgroundColor: '#EEF3F8',
  },
  fontColSingle: {
    flex: 1,
  },
  fontLabelSingle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  fontTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B6B7A',
    marginTop: 2,
  },
  fontCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacer: { height: 32 },
});
