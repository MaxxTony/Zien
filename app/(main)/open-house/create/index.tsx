import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ProgressStep, ProgressSteps } from 'react-native-progress-steps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatDisplayDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDisplayTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const am = h < 12;
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
}

const H_PADDING = 18;
const PLACEHOLDER_1 = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600';
const PLACEHOLDER_2 = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600';
const PLACEHOLDER_3 = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600';

type PropertyItem = {
  id: string;
  address: string;
  image: string;
  status: 'DATA READY' | 'NEEDS REVIEW';
};

const PROPERTIES: PropertyItem[] = [
  { id: '1', address: '123 Business Way, Los Angeles, CA', image: PLACEHOLDER_1, status: 'DATA READY' },
  { id: '2', address: '88 Gold Coast, Malibu, CA', image: PLACEHOLDER_2, status: 'DATA READY' },
  { id: '3', address: '900 Ocean Blvd, Santa Monica, CA', image: PLACEHOLDER_3, status: 'NEEDS REVIEW' },
];


export default function OpenHouseCreateScreen() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isFinalized, setIsFinalized] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setHours(13, 0, 0, 0);
    return d;
  });
  const [startTimeDate, setStartTimeDate] = useState(() => {
    const d = new Date();
    d.setHours(13, 0, 0, 0);
    return d;
  });

  const [endTimeDate, setEndTimeDate] = useState(() => {
    const d = new Date();
    d.setHours(16, 0, 0, 0);
    return d;
  });

  const [agentName, setAgentName] = useState('John Smith');
  const [brokerageName, setBrokerageName] = useState('Zien Estates');
  const [licenseNumber, setLicenseNumber] = useState('DRE# 094021');
  const [agentPhone, setAgentPhone] = useState('(555) 094-0211');
  const [agentEmail, setAgentEmail] = useState('john@zienestates.com');
  const [sendReport, setSendReport] = useState(true);

  return (
    <LinearGradient
      colors={colors.backgroundGradient as any}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtnWrapper} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.accentTeal} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.stepsWrapper}>
        <ProgressSteps
          activeStep={activeStep}
          topOffset={0}
          marginBottom={16}
          progressBarColor={colors.cardBorder}
          completedProgressBarColor={colors.accentTeal}
          activeStepIconColor={colors.accentTeal}
          activeStepIconBorderColor={colors.accentTeal}
          completedStepIconColor={colors.accentTeal}
          disabledStepIconColor={colors.cardBorder}
          labelColor={colors.textMuted}
          activeLabelColor={colors.accentTeal}
          completedLabelColor={colors.accentTeal}
          activeStepNumColor={colors.cardBackground}
          completedStepNumColor={colors.cardBackground}
          disabledStepNumColor={colors.textSecondary}
          completedCheckColor={colors.cardBackground}
          labelFontSize={10}
          activeLabelFontSize={10}

        >
          <ProgressStep label="PROPERTY" removeBtnRow>
            <Step1SelectProperty
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={(id) => {
                setSelectedPropertyId(id);
                setActiveStep(1);
              }}
            />
          </ProgressStep>
          <ProgressStep label="DETAILS" removeBtnRow>
            <Step2Details
              eventDate={eventDate}
              setEventDate={setEventDate}
              startTimeDate={startTimeDate}
              setStartTimeDate={setStartTimeDate}
              endTimeDate={endTimeDate}
              setEndTimeDate={setEndTimeDate}
              agentName={agentName}
              setAgentName={setAgentName}
              brokerageName={brokerageName}
              setBrokerageName={setBrokerageName}
              licenseNumber={licenseNumber}
              setLicenseNumber={setLicenseNumber}
              agentPhone={agentPhone}
              setAgentPhone={setAgentPhone}
              agentEmail={agentEmail}
              setAgentEmail={setAgentEmail}
              sendReport={sendReport}
              setSendReport={setSendReport}
              onBack={() => setActiveStep(0)}
              onContinue={() => setActiveStep(2)}
            />
          </ProgressStep>
          <ProgressStep label="CUSTOMIZATION" removeBtnRow>
            {!isFinalized ? (
              <Step4Customization
                selectedPropertyId={selectedPropertyId}
                agentName={agentName}
                onBack={() => setActiveStep(1)}
                onFinalize={() => setIsFinalized(true)}
              />
            ) : (
              <Step5SheetReady
                onGoToDashboard={() => router.back()}
                onCreateAnother={() => {
                  setIsFinalized(false);
                  setActiveStep(0);
                }}
              />
            )}
          </ProgressStep>
        </ProgressSteps>
      </View>
    </LinearGradient>
  );
}

function Step1SelectProperty({
  selectedPropertyId,
  onSelectProperty,
}: {
  selectedPropertyId: string | null;
  onSelectProperty: (id: string) => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.stepContent}>
      <View style={styles.titleBlock}>
        <Text style={styles.screenTitle}>Select Property</Text>
        <Text style={styles.screenSubtitle}>
          Which property are we showing this weekend?
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.propertiesScrollContent}
        style={styles.propertiesScroll}
      >
        {PROPERTIES.map((property) => {
          const isSelected = selectedPropertyId === property.id;
          return (
            <Pressable
              key={property.id}
              style={[styles.propertyCard, isSelected && styles.propertyCardSelected]}
              onPress={() => onSelectProperty(property.id)}>
              <View style={styles.propertyCardImageWrap}>
                <Image
                  source={{ uri: property.image }}
                  style={styles.propertyCardImage}
                  contentFit="cover"
                />
                {isSelected && (
                  <View style={styles.selectedOverlay}>
                    <MaterialCommunityIcons name="check-circle" size={32} color={colors.accentTeal} />
                  </View>
                )}
              </View>
              <View style={styles.propertyCardBody}>
                <Text style={[
                  styles.statusText,
                  property.status === 'NEEDS REVIEW' ? styles.statusTextReview : styles.statusTextReady
                ]}>
                  {property.status}
                </Text>
                <Text style={styles.propertyAddress} numberOfLines={2}>
                  {property.address}
                </Text>
              </View>
            </Pressable>
          );
        })}
        <Pressable style={styles.addPropertyCard} onPress={() => router.push('/(main)/properties/create')}>
          <MaterialCommunityIcons name="plus" size={32} color={colors.accentTeal} />
          <Text style={styles.addPropertyText}>ADD NEW PROPERTY</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

type PickerType = 'date' | 'start' | 'end' | null;

function Step2Details({
  eventDate,
  setEventDate,
  startTimeDate,
  setStartTimeDate,
  endTimeDate,
  setEndTimeDate,
  agentName,
  setAgentName,
  brokerageName,
  setBrokerageName,
  licenseNumber,
  setLicenseNumber,
  agentPhone,
  setAgentPhone,
  agentEmail,
  setAgentEmail,
  sendReport,
  setSendReport,
  onBack,
  onContinue,
}: {
  eventDate: Date;
  setEventDate: (d: Date) => void;
  startTimeDate: Date;
  setStartTimeDate: (d: Date) => void;
  endTimeDate: Date;
  setEndTimeDate: (d: Date) => void;
  agentName: string;
  setAgentName: (v: string) => void;
  brokerageName: string;
  setBrokerageName: (v: string) => void;
  licenseNumber: string;
  setLicenseNumber: (v: string) => void;
  agentPhone: string;
  setAgentPhone: (v: string) => void;
  agentEmail: string;
  setAgentEmail: (v: string) => void;
  sendReport: boolean;
  setSendReport: (v: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  const [pickerOpen, setPickerOpen] = useState<PickerType>(null);
  const [tempValue, setTempValue] = useState<Date>(eventDate);

  const openPicker = (type: PickerType) => {
    if (type === 'date') setTempValue(eventDate);
    else if (type === 'start') setTempValue(startTimeDate);
    else if (type === 'end') setTempValue(endTimeDate);
    setPickerOpen(type);
  };

  const onPickerChange = (_event: { type: string }, selected?: Date) => {
    if (selected != null) setTempValue(selected);
    if (Platform.OS === 'android') {
      if (_event.type === 'set' && selected != null) {
        if (pickerOpen === 'date') setEventDate(selected);
        else if (pickerOpen === 'start') setStartTimeDate(selected);
        else if (pickerOpen === 'end') setEndTimeDate(selected);
      }
      setPickerOpen(null);
    }
  };

  const confirmPicker = () => {
    if (pickerOpen === 'date') setEventDate(tempValue);
    else if (pickerOpen === 'start') setStartTimeDate(tempValue);
    else if (pickerOpen === 'end') setEndTimeDate(tempValue);
    setPickerOpen(null);
  };

  const pickerTitle =
    pickerOpen === 'date'
      ? 'Select date'
      : pickerOpen === 'start'
        ? 'Start time'
        : pickerOpen === 'end'
          ? 'End time'
          : '';

  const isDatePicker = pickerOpen === 'date';

  return (
    <View style={styles.stepContent}>
      <View style={styles.detailsTitleBlock}>
        <Text style={styles.detailsTitle}>Open House Details</Text>
        <Text style={styles.detailsSubtitle}>
          Set the schedule and contact info.
        </Text>
      </View>
      <View style={styles.formCardWrap}>
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>SCHEDULE</Text>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>DATE</Text>
            <Pressable
              style={styles.inputWrap}
              onPress={() => openPicker('date')}
              android_ripple={{ color: 'rgba(13,148,136,0.08)' }}>
              <Text style={styles.inputText} numberOfLines={1}>
                {formatDisplayDate(eventDate)}
              </Text>
              <MaterialCommunityIcons name="calendar-outline" size={20} color={colors.accentTeal} />
            </Pressable>
          </View>
          <View style={styles.fieldRow}>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>START</Text>
              <Pressable
                style={styles.inputWrap}
                onPress={() => openPicker('start')}
                android_ripple={{ color: 'rgba(13,148,136,0.08)' }}>
                <Text style={styles.inputText} numberOfLines={1}>
                  {formatDisplayTime(startTimeDate)}
                </Text>
                <MaterialCommunityIcons name="clock-outline" size={20} color={colors.accentTeal} />
              </Pressable>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>END</Text>
              <Pressable
                style={styles.inputWrap}
                onPress={() => openPicker('end')}
                android_ripple={{ color: 'rgba(13,148,136,0.08)' }}>
                <Text style={styles.inputText} numberOfLines={1}>
                  {formatDisplayTime(endTimeDate)}
                </Text>
                <MaterialCommunityIcons name="clock-outline" size={20} color={colors.accentTeal} />
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionDivider} />
          <Text style={styles.sectionLabel}>CONTACT</Text>
          <View style={styles.fieldRow}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>AGENT NAME</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={agentName}
                  onChangeText={setAgentName}
                  placeholder="John Smith"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>BROKERAGE NAME</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={brokerageName}
                  onChangeText={setBrokerageName}
                  placeholder="Zien Estates"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>LICENSE NUMBER (DRE#)</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                  placeholder="DRE# 094021"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>AGENT PHONE</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={agentPhone}
                  onChangeText={setAgentPhone}
                  placeholder="(555) 094-0211"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          <View style={styles.fieldSingle}>
            <Text style={styles.fieldLabel}>AGENT EMAIL</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={agentEmail}
                onChangeText={setAgentEmail}
                placeholder="john@zienestates.com"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.uploadArea}>
            <View>
              <Text style={styles.uploadAreaTitle}>Profile Photo / Broker Logo</Text>
              <Text style={styles.uploadAreaSubtitle}>Shown on print materials and sign-in page</Text>
            </View>
            <Pressable style={styles.uploadBtn}>
              <MaterialCommunityIcons name="plus" size={14} color={colors.textPrimary} />
              <Text style={styles.uploadBtnText}>Upload</Text>
            </Pressable>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel} numberOfLines={2}>
              SEND PERFORMANCE REPORT TO SELLER
            </Text>
            <Switch
              value={sendReport}
              onValueChange={setSendReport}
              trackColor={{ false: '#E4EAF2', true: '#0D9488' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.buttonRow}>
            <Pressable style={styles.backButton} onPress={onBack}>
              <MaterialCommunityIcons name="arrow-left" size={16} color={colors.textPrimary} />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <Pressable style={styles.continueButton} onPress={onContinue}>
              <Text style={styles.continueButtonText}>Continue to Templates</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {Platform.OS === 'android' && pickerOpen != null && (
        <DateTimePicker
          value={tempValue}
          mode={isDatePicker ? 'date' : 'time'}
          display="default"
          onChange={onPickerChange}
          minimumDate={isDatePicker ? new Date() : undefined}
        />
      )}
      {Platform.OS === 'ios' && (
        <Modal
          visible={pickerOpen != null}
          transparent
          animationType="slide"
          onRequestClose={() => setPickerOpen(null)}>
          <Pressable style={styles.pickerBackdrop} onPress={() => setPickerOpen(null)}>
            <Pressable style={[styles.pickerSheet, { paddingBottom: insets.bottom + 16 }]} onPress={(e) => e.stopPropagation()}>
              <View style={styles.pickerHandle} />
              <Text style={styles.pickerSheetTitle}>{pickerTitle}</Text>
              {pickerOpen != null && (
                <DateTimePicker
                  value={tempValue}
                  mode={isDatePicker ? 'date' : 'time'}
                  display="spinner"
                  onChange={onPickerChange}
                  minimumDate={isDatePicker ? new Date() : undefined}
                  style={styles.pickerSpinner}
                  textColor="#0B2D3E"
                />
              )}
              <Pressable style={styles.pickerDoneButton} onPress={confirmPicker}>
                <Text style={styles.pickerDoneText}>Done</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}


const DESC_STYLES = ['Luxury', 'Friendly', 'Modern'] as const;
type DescStyleKey = 'luxury' | 'friendly' | 'modern';

const DEFAULT_DESCRIPTION =
  'Breathtaking Luxury estate featuring rare architectural details, bespoke imported finishes, and a seamless connection to private, manicured grounds. This residence offers an unparalleled lifestyle for those who demand excellence in every square inch.';

function Step4Customization({
  selectedPropertyId,
  agentName,
  onBack,
  onFinalize,
}: {
  selectedPropertyId: string | null;
  agentName: string;
  onBack: () => void;
  onFinalize: () => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const [accentIndex, setAccentIndex] = useState(0);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [descStyle, setDescStyle] = useState<DescStyleKey>('luxury');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [enableVisitorReg, setEnableVisitorReg] = useState(true);

  const property = selectedPropertyId ? PROPERTIES.find((p) => p.id === selectedPropertyId) : null;
  const addressLine1 = property ? property.address.split(',')[0] : '900 Ocean Blvd';
  const addressLine2 = property ? property.address.split(',').slice(1).join(',').trim() : 'Santa Monica, CA';

  // Extended Brand Colors from design
  const EXTENDED_BRAND_COLORS = ['#0B2D3E', '#0D9488', '#F97316', '#8B5CF6', '#10B981', '#DC2626', '#2563EB', '#0F172A'];

  return (
    <View style={styles.stepContent}>
      <ScrollView
        style={styles.customizationScroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleBlock}>
          <Text style={styles.screenTitle}>Customization</Text>
          <Text style={styles.screenSubtitle}>Finalize the look and content.</Text>
        </View>

        {/* Live Preview Card (Paper Look) */}
        <View style={styles.previewContainer}>
          <Text style={styles.sectionHeaderLabel}>LIVE PRINT PREVIEW (PDF)</Text>
          <View style={styles.paperSheet}>
            {/* Header */}
            <View style={styles.paperHeader}>
              <Text style={styles.paperBrand}>ZIEN ESTATES</Text>
              <Text style={styles.paperTag}>EXCLUSIVE LISTING</Text>
            </View>

            {/* Main Image */}
            <Image
              source={{ uri: property?.image ?? PLACEHOLDER_3 }}
              style={styles.paperImage}
              contentFit="cover"
            />

            {/* Content */}
            <View style={styles.paperBody}>
              <Text style={[styles.paperTitle, { color: EXTENDED_BRAND_COLORS[accentIndex] }]}>{addressLine1}</Text>
              <Text style={styles.paperSubtitle}>{addressLine2}</Text>

              <View style={styles.paperStatsRow}>
                <View style={styles.paperStatItem}><Text style={styles.paperStatValue}>5</Text><Text style={styles.paperStatLabel}>BEDS</Text></View>
                <View style={styles.paperDividerVertical} />
                <View style={styles.paperStatItem}><Text style={styles.paperStatValue}>4.5</Text><Text style={styles.paperStatLabel}>BATHS</Text></View>
                <View style={styles.paperDividerVertical} />
                <View style={styles.paperStatItem}><Text style={styles.paperStatValue}>4,200</Text><Text style={styles.paperStatLabel}>SQFT</Text></View>
              </View>

              <Text style={styles.paperDescription} numberOfLines={4} ellipsizeMode="tail">
                {description}
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.paperFooter}>
              <View style={styles.paperDividerHorizontal} />
              <View style={styles.paperAgentRow}>
                <View style={styles.paperAgentInfo}>
                  <View style={styles.paperAvatar} />
                  <View>
                    <Text style={styles.paperAgentName}>{agentName}</Text>
                    <Text style={styles.paperAgentRole}>Premier Agent | DRE# 094021</Text>
                  </View>
                </View>
                {enableVisitorReg && (
                  <View style={styles.paperQRCode}>
                    <MaterialCommunityIcons name="qrcode" size={24} color={colors.textPrimary} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Design & Branding Card */}
        <View style={styles.customCard}>
          <Text style={styles.customCardTitle}>Design & Branding</Text>
          <View style={styles.swatchRow}>
            {EXTENDED_BRAND_COLORS.map((color, i) => (
              <Pressable
                key={color}
                style={[styles.colorSwatch, { backgroundColor: color }, i === accentIndex && styles.colorSwatchActive]}
                onPress={() => setAccentIndex(i)}
              />
            ))}
            <Pressable style={styles.addColorBtn}>
              <MaterialCommunityIcons name="plus" size={16} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={styles.selectedColorText}>Selected accent color: <Text style={{ fontWeight: '700', color: EXTENDED_BRAND_COLORS[accentIndex] }}>{EXTENDED_BRAND_COLORS[accentIndex]}</Text></Text>

          <View style={styles.brandActionsRow}>
            <Pressable style={styles.brandActionBtn}>
              <Text style={styles.brandActionBtnText}>Upload Logo</Text>
            </Pressable>
            <Pressable style={styles.brandActionBtn}>
              <Text style={styles.brandActionBtnText}>Font Pairings</Text>
            </Pressable>
          </View>
        </View>

        {/* AI Description Card */}
        <View style={styles.customCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.customCardTitle}>AI Property Description</Text>
            <View style={styles.stylePillRow}>
              {DESC_STYLES.map((style) => (
                <Pressable
                  key={style}
                  style={[styles.stylePill, descStyle === style.toLowerCase() && styles.stylePillActive]}
                  onPress={() => setDescStyle(style.toLowerCase() as DescStyleKey)}
                >
                  <Text style={[styles.stylePillText, descStyle === style.toLowerCase() && styles.stylePillTextActive]}>{style}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <TextInput
            style={styles.aiInput}
            multiline
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <Pressable style={styles.regenerateBtnFull}>
            <Text style={styles.regenerateBtnText}>Regenerate Description</Text>
            <MaterialCommunityIcons name="magic-staff" size={16} color="#FFF" />
          </Pressable>
        </View>

        {/* Property Gallery Card */}
        <View style={styles.customCard}>
          <Text style={styles.customCardTitle}>Property Gallery</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryScrollContent}
          >
            {galleryImages.map((uri, idx) => (
              <View key={idx} style={styles.galleryImageWrap}>
                <Image source={{ uri }} style={styles.galleryImage} contentFit="cover" />
                <Pressable
                  style={styles.galleryRemoveBtn}
                  onPress={() => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))}
                >
                  <MaterialCommunityIcons name="close" size={12} color="#FFF" />
                </Pressable>
              </View>
            ))}
            <Pressable
              style={styles.galleryAddBox}
              onPress={() => setGalleryImages((prev) => [...prev, PLACEHOLDER_1])}
            >
              <MaterialCommunityIcons name="plus" size={24} color={colors.accentTeal} />
            </Pressable>
          </ScrollView>
          <Text style={styles.galleryHelperText}>
            Upload high-resolution photos for the digital gallery and print dossier.
          </Text>
        </View>

        {/* Lead Capture Card */}
        <View style={styles.customCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.customCardTitle}>Lead Capture (QR)</Text>
              <Text style={styles.cardSub}>Automatic sync to Salesforce CRM</Text>
            </View>
            <Switch
              value={enableVisitorReg}
              onValueChange={setEnableVisitorReg}
              trackColor={{ false: '#E2E8F0', true: '#0D9488' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <Text style={styles.settingsLabel}>Enable Visitor Registration</Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Pressable style={styles.actionBackBtn} onPress={onBack}>
            <MaterialCommunityIcons name="arrow-left" size={16} color={colors.textPrimary} />
            <Text style={styles.actionBackText}>Back</Text>
          </Pressable>
          <Pressable style={styles.actionFinalizeBtn} onPress={onFinalize}>
            <Text style={styles.actionFinalizeText}>Finalize & Publish</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

function Step5SheetReady({
  onGoToDashboard,
  onCreateAnother,
}: {
  onGoToDashboard: () => void;
  onCreateAnother: () => void;
}) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.stepContent}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.readyMobileScrollContent}
      >
        <View style={styles.readyMobileHeader}>
          <Text style={styles.readyMobileTitle}>Event Added Successfully!</Text>
          <Text style={styles.readyMobileSubtitle}>
            Your open house marketing engine is fully tuned and multi-channel ready.
          </Text>
        </View>

        <View style={styles.readyMobileGrid}>
          <Pressable style={styles.readyMobileCard}>
            <MaterialCommunityIcons name="file-document-outline" size={32} color={colors.textPrimary} />
            <Text style={styles.readyMobileCardLabel}>Download PDF</Text>
            <Text style={styles.readyMobileCardSubLabel}>PROPERTY DOSSIER</Text>
          </Pressable>
          <Pressable style={styles.readyMobileCard}>
            <MaterialCommunityIcons name="link-variant" size={32} color={colors.textPrimary} />
            <Text style={styles.readyMobileCardLabel}>Digital Share Link</Text>
            <Text style={styles.readyMobileCardSubLabel}>VISITOR PORTAL</Text>
          </Pressable>
          <Pressable style={styles.readyMobileCard}>
            <MaterialCommunityIcons name="bullhorn-outline" size={32} color={colors.textPrimary} />
            <Text style={styles.readyMobileCardLabel}>Add to campaigns</Text>
            <Text style={styles.readyMobileCardSubLabel}>ADD TO CAMPAIGNS</Text>
          </Pressable>
          <Pressable style={styles.readyMobileCard}>
            <MaterialCommunityIcons name="email-plus-outline" size={32} color={colors.textPrimary} />
            <Text style={styles.readyMobileCardLabel}>Email Automation</Text>
            <Text style={styles.readyMobileCardSubLabel}>CREATE AI AUTOMATION</Text>
          </Pressable>
        </View>

        <View style={styles.readyMobileActions}>
          <Pressable style={styles.readyMobilePrimaryBtn} onPress={onGoToDashboard}>
            <Text style={styles.readyMobilePrimaryBtnText}>Manage Live Open Houses</Text>
          </Pressable>
          <Pressable style={styles.readyMobileSecondaryBtn} onPress={onCreateAnother}>
            <Text style={styles.readyMobileSecondaryBtnText}>Create Another</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accentTeal,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceIcon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  stepsWrapper: {
    flex: 1,
  },
  stepContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  placeholderStep: {
    padding: 24,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  templateTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  templateTitleBlock: {
    flex: 1,
  },
  templateSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 6,
  },
  templateScroll: {
    flexGrow: 0,
    marginHorizontal: -H_PADDING,
  },
  templateScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: H_PADDING,
    gap: 14,
    paddingBottom: 8,
  },
  templateCard: {
    width: 160,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  templateCardSelected: {
    borderColor: '#0D9488',
    borderWidth: 3,
  },
  templateCardImageWrap: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceSoft,
    position: 'relative',
  },
  templateCardImage: {
    width: '100%',
    height: '100%',
  },
  templateWatermark: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(11, 45, 62, 0.15)',
    maxWidth: '80%',
  },
  templateCardFooter: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  templateCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  templateName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.cardBackground,
    letterSpacing: -0.2,
  },
  templateButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  customizationScroll: {
    flex: 1,
  },
  customizationTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  customizationSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 18,
  },
  previewCard: {
    marginBottom: 22,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  previewCardLabel: {
    position: 'absolute',
    top: 10,
    left: 12,
    fontSize: 9,
    fontWeight: '800',
    color: colors.accentTeal,
    letterSpacing: 0.5,
    zIndex: 1,
  },
  previewCardInner: {
    padding: 12,
    paddingTop: 28,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  previewTag: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  previewPropertyImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    marginBottom: 10,
  },
  previewAddress: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  previewCity: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  previewStatsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 10,
  },
  previewStat: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  previewDescSnippet: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  previewAgentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewAgentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBorder,
  },
  previewAgentInfo: {
    flex: 1,
  },
  previewAgentName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  previewAgentMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 1,
  },
  previewQRBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  customSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accentTeal,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  customButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBackground,
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  styleTagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  styleTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  styleTagActive: {
    backgroundColor: colors.accentTeal,
    borderColor: '#0B2D3E',
  },
  styleTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  styleTagTextActive: {
    color: colors.cardBackground,
  },
  descriptionInput: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    marginBottom: 22,
  },
  regenerateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.cardBackground,
  },
  leadCaptureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 4,
  },
  leadCaptureLabelBlock: {
    flex: 1,
    marginRight: 12,
  },
  leadCaptureLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  leadCaptureSub: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  finalizeButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  // Mobile Optimized Step 5 Styles
  readyMobileScrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  readyMobileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  readyMobileTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  readyMobileSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  readyMobileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 40,
  },
  readyMobileCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  readyMobileCardLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 12,
    textAlign: 'center',
  },
  readyMobileCardSubLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  readyMobileActions: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 12,
  },
  readyMobilePrimaryBtn: {
    backgroundColor: colors.accentTeal,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  readyMobilePrimaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.cardBackground,
  },
  readyMobileSecondaryBtn: {
    backgroundColor: colors.cardBackground,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  readyMobileSecondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  formCardWrap: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  formCardBorder: {
    height: 3,
    width: '100%',
  },
  formCard: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.cardBorder,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accentTeal,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E8EEF4',
    marginVertical: 18,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  field: {
    flex: 1,
  },
  fieldSingle: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: 0,
  },
  uploadArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginVertical: 16,
  },
  uploadAreaTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  uploadAreaSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 4,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  uploadBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  continueButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  continueButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.cardBackground,
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 16 },
    }),
  },
  pickerHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerSpinner: {
    marginVertical: 8,
  },
  pickerDoneButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  pickerDoneText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.cardBackground,
  },

  // Revised Property Step Styles
  titleBlock: {
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  propertiesScroll: {
    flexGrow: 0,
  },
  propertiesScrollContent: {
    gap: 16,
    paddingBottom: 20,
  },
  propertyCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    shadowColor: colors.cardShadowColor,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    height: 300,
  },
  propertyCardSelected: {
    borderWidth: 2,
    borderColor: '#0D9488',
    transform: [{ scale: 1.02 }],
  },
  propertyCardImageWrap: {
    height: 180,
    backgroundColor: colors.surfaceSoft,
    position: 'relative',
  },
  propertyCardImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyCardBody: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statusTextReady: {
    color: colors.accentTeal,
  },
  statusTextReview: {
    color: colors.danger,
  },
  propertyAddress: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // Add Property Card
  addPropertyCard: {
    height: 300,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0D9488',
    borderStyle: 'dashed',
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  addPropertyText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accentTeal,
    letterSpacing: 0.5,
  },

  // Restored Step 2 Styles
  detailsTitleBlock: {
    paddingTop: 0,
    paddingBottom: 14,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  detailsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  inputText: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Step 3 Pro Styles
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    paddingBottom: 20,
  },
  templateCardPro: {
    width: '48%',
    aspectRatio: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.accentTeal,
    position: 'relative',
  },
  templateCardProSelected: {
    borderWidth: 3,
    borderColor: '#0D9488',
    transform: [{ scale: 0.98 }]
  },
  templateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 32,
  },
  templateCategoryPro: {
    fontSize: 8,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  templateNamePro: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.cardBackground,
  },
  templateSelectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  // Step 4 Pro Styles
  // Step 4 Pro Styles
  previewContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  paperSheet: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    aspectRatio: 0.7, // Slightly taller
    borderRadius: 8,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.surfaceIcon,
    paddingBottom: 12,
  },
  paperBrand: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  paperTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accentTeal,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  paperImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.surfaceSoft,
    marginBottom: 20,
    borderRadius: 4,
  },
  paperBody: {
    flex: 1,
    overflow: 'hidden',
  },
  paperTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  paperSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 20,
  },
  paperStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingVertical: 12,
  },
  paperStatItem: {
    alignItems: 'flex-start',
  },
  paperStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  paperStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  paperDividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: colors.cardBorder,
  },
  paperDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'justify',
  },
  paperFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.surfaceIcon,
  },
  paperDividerHorizontal: {
    display: 'none', // Removed in favor of borderTop on footer
  },
  paperAgentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paperAgentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paperAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#94A3B8',
  },
  paperAgentName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  paperAgentRole: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  paperQRCode: {
    padding: 6,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

  // Custom Card
  customCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 4 },
    }),
  },
  customCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  cardSub: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 16,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginVertical: 20,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  colorSwatchActive: {
    borderColor: '#0B2D3E', // Will rely on inline style for inner ring effect, or just border
    transform: [{ scale: 1.1 }],
  },
  addColorBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  selectedColorText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 24,
    fontWeight: '600',
  },
  brandActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  brandActionBtn: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  brandActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  stylePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stylePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBackground,
  },
  stylePillActive: {
    backgroundColor: colors.accentTeal,
    borderColor: '#0F172A',
  },
  stylePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stylePillTextActive: {
    color: colors.cardBackground,
  },
  aiInput: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
    fontSize: 14,
    color: colors.textSecondary,
    height: 140,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  regenerateBtnFull: {
    backgroundColor: '#0D9488',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  regenerateBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.cardBackground,
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 40,
    marginBottom: 40,
  },
  actionBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  actionBackText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionFinalizeBtn: {
    flex: 1,
    backgroundColor: colors.accentTeal,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  actionFinalizeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.cardBackground,
  },
  galleryScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  galleryImageWrap: {
    width: 110,
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryRemoveBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.surfaceIcon,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryAddBox: {
    width: 110,
    height: 110,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0D9488',
    borderStyle: 'dashed',
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryHelperText: {
    marginTop: 8,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});

}
