import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
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
const CARD_GAP = 14;

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

type TemplateItem = {
  id: string;
  name: string;
  category: string;
  image: string;
};

const TEMPLATES: TemplateItem[] = [
  {
    id: 'platinum-elite',
    name: 'Platinum Elite',
    category: 'LUXURY',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
  },
  {
    id: 'urban-minimal',
    name: 'Urban Minimal',
    category: 'MODERN',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
  },
  {
    id: 'safe-haven',
    name: 'Safe Haven',
    category: 'FAMILY',
    image: 'https://images.unsplash.com/photo-1616594032644-6d0e2f1c2b9a?w=600',
  },
  {
    id: 'coastal-breeze',
    name: 'Coastal Breeze',
    category: 'COASTAL',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
  },
  {
    id: 'executive-noir',
    name: 'Executive Noir',
    category: 'PREMIUM',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
  },
  {
    id: 'timeless-estate',
    name: 'Timeless Estate',
    category: 'CLASSIC',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600',
  },
];

export default function OpenHouseCreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
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
  const [sendReport, setSendReport] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  return (
    <LinearGradient
      colors={['#CAD8E4', '#D7E9F2', '#F3E1D7']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#0B2D3E" />
        </Pressable>
      </View>

      <View style={styles.stepsWrapper}>
        <ProgressSteps
          activeStep={activeStep}
          topOffset={0}
          marginBottom={16}
          progressBarColor="#E5E7EB"
          completedProgressBarColor="#0D9488"
          activeStepIconColor="#0D9488"
          activeStepIconBorderColor="#0D9488"
          completedStepIconColor="#0D9488"
          disabledStepIconColor="#E5E7EB"
          labelColor="#9CA3AF"
          activeLabelColor="#0D9488"
          completedLabelColor="#0D9488"
          activeStepNumColor="#FFFFFF"
          completedStepNumColor="#FFFFFF"
          disabledStepNumColor="#5B6B7A"
          completedCheckColor="#FFFFFF"
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
              sendReport={sendReport}
              setSendReport={setSendReport}
              onBack={() => setActiveStep(0)}
              onContinue={() => setActiveStep(2)}
            />
          </ProgressStep>
          <ProgressStep label="TEMPLATE" removeBtnRow>
            <Step3SelectTemplate
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
              onBack={() => setActiveStep(1)}
              onContinue={() => setActiveStep(3)}
            />
          </ProgressStep>
          <ProgressStep label="CUSTOMIZATION" removeBtnRow>
            <Step4Customization
              selectedPropertyId={selectedPropertyId}
              agentName={agentName}
              onBack={() => setActiveStep(2)}
              onFinalize={() => setActiveStep(4)}
            />
          </ProgressStep>
          <ProgressStep label="READY" removeBtnRow>
            <Step5SheetReady
              onGoToDashboard={() => router.back()}
              onCreateAnother={() => setActiveStep(0)}
            />
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
        <Pressable style={styles.addPropertyCard} onPress={() => router.push('/(main)/properties/create')}>
          <View style={styles.addPropertyIconWrap}>
            <MaterialCommunityIcons name="plus" size={32} color="#9CA3AF" />
          </View>
          <Text style={styles.addPropertyText}>Add New Property</Text>
        </Pressable>
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
                    <MaterialCommunityIcons name="check-circle" size={32} color="#0D9488" />
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
  sendReport: boolean;
  setSendReport: (v: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
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
              <MaterialCommunityIcons name="calendar-outline" size={20} color="#0D9488" />
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
                <MaterialCommunityIcons name="clock-outline" size={20} color="#0D9488" />
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
                <MaterialCommunityIcons name="clock-outline" size={20} color="#0D9488" />
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionDivider} />
          <Text style={styles.sectionLabel}>CONTACT</Text>
          <View style={styles.fieldSingle}>
            <Text style={styles.fieldLabel}>AGENT NAME</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={agentName}
                onChangeText={setAgentName}
                placeholder="Agent name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
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
              <MaterialCommunityIcons name="arrow-left" size={16} color="#0B2D3E" />
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

function Step3SelectTemplate({
  selectedTemplateId,
  onSelectTemplate,
  onBack,
  onContinue,
}: {
  selectedTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <View style={styles.stepContent}>
      <View style={styles.titleBlock}>
        <Text style={styles.screenTitle}>Select Design Template</Text>
        <Text style={styles.screenSubtitle}>
          Choose a style that matches the property vibe.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.templateGrid} showsVerticalScrollIndicator={false}>
        {TEMPLATES.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          return (
            <Pressable
              key={template.id}
              style={[styles.templateCardPro, isSelected && styles.templateCardProSelected]}
              onPress={() => onSelectTemplate(template.id)}>
              <Image
                source={{ uri: template.image }}
                style={styles.templateCardImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.templateOverlay}
              >
                <Text style={styles.templateCategoryPro}>{template.category}</Text>
                <Text style={styles.templateNamePro}>{template.name}</Text>
              </LinearGradient>

              {isSelected && (
                <View style={styles.templateSelectedOverlay}>
                  <MaterialCommunityIcons name="check-circle" size={24} color="#0D9488" />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.buttonRow}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={16} color="#0B2D3E" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable
          style={[styles.continueButton, !selectedTemplateId && styles.continueButtonDisabled]}
          onPress={onContinue}
          disabled={!selectedTemplateId}>
          <Text style={styles.continueButtonText}>Continue to Customization</Text>
        </Pressable>
      </View>
    </View>
  );
}

const BRAND_COLORS = ['#0B2D3E', '#0D9488', '#EA580C'] as const;
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
  const [accentIndex, setAccentIndex] = useState(0);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [descStyle, setDescStyle] = useState<DescStyleKey>('luxury');
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
                    <MaterialCommunityIcons name="qrcode" size={24} color="#0B2D3E" />
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
              <MaterialCommunityIcons name="plus" size={16} color="#475569" />
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
            <MaterialCommunityIcons name="arrow-left" size={16} color="#0B2D3E" />
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
  return (
    <View style={styles.stepContent}>
      <ScrollView style={styles.readyScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.readyScrollContent}>
        <View style={styles.readyIconWrap}>
          <MaterialCommunityIcons name="rocket-launch" size={56} color="#EA580C" />
        </View>
        <Text style={styles.readyTitle}>Sheet Is Ready!</Text>
        <Text style={styles.readySubtitle}>
          Your open house marketing engine is fully tuned and multi-channel ready.
        </Text>

        <View style={styles.readyActionsGrid}>
          <Pressable style={styles.readyActionCard}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#0B2D3E" />
            <Text style={styles.readyActionCardLabel}>Download PDF</Text>
          </Pressable>
          <Pressable style={styles.readyActionCard}>
            <MaterialCommunityIcons name="link-variant" size={24} color="#0B2D3E" />
            <Text style={styles.readyActionCardLabel}>Digital Share Link</Text>
          </Pressable>
          <Pressable style={styles.readyActionCard}>
            <MaterialCommunityIcons name="share-variant" size={24} color="#0B2D3E" />
            <Text style={styles.readyActionCardLabel}>Social Media Pack</Text>
          </Pressable>
          <View style={[styles.readyActionCard, styles.readyActionCardDisabled]}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#9CA3AF" />
            <Text style={styles.readyActionCardLabelMuted}>Print & Ship</Text>
            <Text style={styles.readyComingSoon}>COMING SOON</Text>
          </View>
        </View>

        <View style={styles.readyButtonColumn}>
          <Pressable style={styles.readyPrimaryButton} onPress={onGoToDashboard}>
            <Text style={styles.readyPrimaryButtonText}>Go to Campaigns Dashboard</Text>
          </Pressable>
          <Pressable style={styles.readySecondaryButton} onPress={onCreateAnother}>
            <Text style={styles.readySecondaryButtonText}>Create Another</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(227, 236, 244, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    color: '#5B6B7A',
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
    color: '#5B6B7A',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    backgroundColor: '#F1F5F9',
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
    color: '#FFFFFF',
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
    color: '#0B2D3E',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  customizationSubtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 18,
  },
  previewCard: {
    marginBottom: 22,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAF2',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    color: '#0D9488',
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
    color: '#0B2D3E',
    letterSpacing: 0.3,
  },
  previewTag: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  previewPropertyImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
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
    color: '#5B6B7A',
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
    color: '#0B2D3E',
  },
  previewDescSnippet: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5B6B7A',
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
    backgroundColor: '#E2E8F0',
  },
  previewAgentInfo: {
    flex: 1,
  },
  previewAgentName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  previewAgentMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 1,
  },
  previewQRBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
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
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  styleTagActive: {
    backgroundColor: '#0B2D3E',
    borderColor: '#0B2D3E',
  },
  styleTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B7A',
  },
  styleTagTextActive: {
    color: '#FFFFFF',
  },
  descriptionInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#0B2D3E',
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
    color: '#FFFFFF',
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
    color: '#0B2D3E',
  },
  leadCaptureSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  finalizeButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  readyScroll: {
    flex: 1,
  },
  readyScrollContent: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  readyIconWrap: {
    marginTop: 16,
    marginBottom: 16,
  },
  readyTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 10,
  },
  readySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5B6B7A',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  readyActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    marginBottom: 28,
  },
  readyActionCard: {
    width: '48%',
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4EAF2',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  readyActionCardDisabled: {
    opacity: 0.9,
    backgroundColor: '#F8FAFC',
  },
  readyActionCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
    marginTop: 12,
  },
  readyActionCardLabelMuted: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 12,
  },
  readyComingSoon: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.3,
    marginTop: 6,
  },
  readyButtonColumn: {
    width: '100%',
    gap: 12,
  },
  readyPrimaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  readyPrimaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  readySecondaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readySecondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },

  formCardWrap: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E4EAF2',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
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
    color: '#5B6B7A',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2D3E',
    padding: 0,
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
    color: '#5B6B7A',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAF2',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    color: '#0B2D3E',
  },
  continueButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B2D3E',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    color: '#FFFFFF',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 62, 0.4)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    color: '#0B2D3E',
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
    color: '#FFFFFF',
  },

  // Revised Property Step Styles
  titleBlock: {
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#5B6B7A',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#0B2D3E',
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
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  propertyCardImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
    color: '#0D9488',
  },
  statusTextReview: {
    color: '#EA580C',
  },
  propertyAddress: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2D3E',
    lineHeight: 22,
  },

  // Add Property Card
  addPropertyCard: {
    height: 300,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  addPropertyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPropertyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },

  // Restored Step 2 Styles
  detailsTitleBlock: {
    paddingTop: 0,
    paddingBottom: 14,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2D3E',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  detailsSubtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '500',
    lineHeight: 20,
  },
  inputText: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: '700',
    color: '#0B2D3E',
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
    backgroundColor: '#0F172A',
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
    color: '#FFFFFF',
  },
  templateSelectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
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
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  paperSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    aspectRatio: 0.7, // Slightly taller
    borderRadius: 8,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    borderBottomColor: '#0B2D3E',
    paddingBottom: 12,
  },
  paperBrand: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B2D3E',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  paperTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  paperImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
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
    color: '#0B2D3E',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  paperSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 20,
  },
  paperStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 12,
  },
  paperStatItem: {
    alignItems: 'flex-start',
  },
  paperStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2D3E',
  },
  paperStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  paperDividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  paperDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: '#334155',
    textAlign: 'justify',
  },
  paperFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#0B2D3E',
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
    color: '#0B2D3E',
  },
  paperAgentRole: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  paperQRCode: {
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Custom Card
  customCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    color: '#0B2D3E',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
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
        shadowColor: '#000',
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
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  selectedColorText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 24,
    fontWeight: '600',
  },
  brandActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  brandActionBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  brandActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stylePillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stylePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  stylePillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  stylePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  stylePillTextActive: {
    color: '#FFFFFF',
  },
  aiInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    fontSize: 14,
    color: '#334155',
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
        shadowColor: '#0D9488',
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
    color: '#FFFFFF',
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBackText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2D3E',
  },
  actionFinalizeBtn: {
    flex: 1,
    backgroundColor: '#0B2D3E',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0B2D3E',
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
    color: '#FFFFFF',
  },
});

