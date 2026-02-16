import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
  },
  {
    id: 'urban-minimal',
    name: 'Urban Minimal',
    category: 'MODERN',
    image: 'https://images.unsplash.com/photo-1616594032644-6d0e2f1c2b9a?w=600',
  },
  {
    id: 'safe-haven',
    name: 'Safe Haven',
    category: 'FAMILY',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
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
      <Pressable style={styles.addPropertyCard}>
        <MaterialCommunityIcons name="plus" size={40} color="#9CA3AF" />
        <Text style={styles.addPropertyText}>Add New Property</Text>
      </Pressable>
      <View style={styles.propertyList}>
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
              </View>
              <View style={styles.propertyCardBody}>
                <View
                  style={[
                    styles.statusBadge,
                    property.status === 'NEEDS REVIEW' && styles.statusBadgeReview,
                  ]}>
                  <Text
                    style={[
                      styles.statusBadgeText,
                      property.status === 'NEEDS REVIEW' && styles.statusBadgeTextReview,
                    ]}>
                    {property.status}
                  </Text>
                </View>
                <Text style={styles.propertyAddress} numberOfLines={2}>
                  {property.address}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
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
        <LinearGradient
          colors={['#0D9488', '#0B8B7E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.formCardBorder}
        />
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
      <View style={styles.templateTitleRow}>
        <View style={styles.templateTitleBlock}>
          <Text style={styles.screenTitle}>Select Design Template</Text>
          <Text style={styles.templateSubtitle}>
            Choose a style that matches the property vibe.
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.templateScrollContent}
        style={styles.templateScroll}>
        {TEMPLATES.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          return (
            <Pressable
              key={template.id}
              style={[styles.templateCard, isSelected && styles.templateCardSelected]}
              onPress={() => onSelectTemplate(template.id)}>
              <View style={styles.templateCardImageWrap}>
                <Image
                  source={{ uri: template.image }}
                  style={styles.templateCardImage}
                  contentFit="cover"
                />
                <Text style={styles.templateWatermark} numberOfLines={1}>
                  {template.name}
                </Text>
              </View>
              <LinearGradient
                colors={['#7DD3C7', '#0B2D3E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.templateCardFooter}>
                <Text style={styles.templateCategory}>{template.category}</Text>
                <Text style={styles.templateName}>{template.name}</Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.templateButtonRow}>
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

  return (
    <View style={styles.stepContent}>
      <ScrollView style={styles.customizationScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.customizationTitle}>Customize & Preview</Text>
        <Text style={styles.customizationSubtitle}>
          Branding, description, and lead capture for your open house.
        </Text>

        <View style={styles.previewCard}>
          <Text style={styles.previewCardLabel}>LIVE PREVIEW</Text>
          <View style={styles.previewCardInner}>
            <View style={styles.previewHeaderRow}>
              <Text style={styles.previewBrand}>ZIEN ESTATES</Text>
              <Text style={styles.previewTag}>EXCLUSIVE LISTING</Text>
            </View>
            <Image
              source={{ uri: property?.image ?? PLACEHOLDER_3 }}
              style={styles.previewPropertyImage}
              contentFit="cover"
            />
            <Text style={[styles.previewAddress, { color: BRAND_COLORS[accentIndex] }]}>{addressLine1}</Text>
            <Text style={styles.previewCity}>{addressLine2}</Text>
            <View style={styles.previewStatsRow}>
              <Text style={styles.previewStat}>5 BEDS</Text>
              <Text style={styles.previewStat}>4.5 BATHS</Text>
              <Text style={styles.previewStat}>4,200 SQFT</Text>
            </View>
            <Text style={styles.previewDescSnippet} numberOfLines={3}>
              {description}
            </Text>
            <View style={styles.previewAgentRow}>
              <View style={styles.previewAgentAvatar} />
              <View style={styles.previewAgentInfo}>
                <Text style={styles.previewAgentName}>{agentName}</Text>
                <Text style={styles.previewAgentMeta}>Premier Agent · DRE# 094021</Text>
              </View>
              {enableVisitorReg ? <View style={styles.previewQRBox}><MaterialCommunityIcons name="qrcode" size={28} color="#0B2D3E" /></View> : null}
            </View>
          </View>
        </View>

        <Text style={styles.customSectionLabel}>DESIGN & BRANDING</Text>
        <View style={styles.brandingRow}>
          {BRAND_COLORS.map((color, i) => (
            <Pressable
              key={color}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                i === accentIndex && styles.colorSwatchSelected,
              ]}
              onPress={() => setAccentIndex(i)}
            />
          ))}
          <Pressable style={styles.addColorBtn}>
            <MaterialCommunityIcons name="plus" size={20} color="#5B6B7A" />
          </Pressable>
        </View>
        <View style={styles.customButtonRow}>
          <Pressable style={styles.outlineButton}>
            <MaterialCommunityIcons name="file-upload-outline" size={18} color="#0B2D3E" />
            <Text style={styles.outlineButtonText}>Upload Logo</Text>
          </Pressable>
          <Pressable style={styles.outlineButton}>
            <MaterialCommunityIcons name="format-font" size={18} color="#0B2D3E" />
            <Text style={styles.outlineButtonText}>Font Pairings</Text>
          </Pressable>
        </View>

        <Text style={styles.customSectionLabel}>AI PROPERTY DESCRIPTION</Text>
        <View style={styles.styleTagsRow}>
          {(DESC_STYLES as readonly string[]).map((label) => {
            const key = label.toLowerCase() as DescStyleKey;
            const active = descStyle === key;
            return (
              <Pressable
                key={key}
                style={[styles.styleTag, active && styles.styleTagActive]}
                onPress={() => setDescStyle(key)}>
                <Text style={[styles.styleTagText, active && styles.styleTagTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          placeholder="Property description..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={5}
        />
        <Pressable style={styles.regenerateButton}>
          <MaterialCommunityIcons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.regenerateButtonText}>Regenerate Description</Text>
        </Pressable>

        <Text style={styles.customSectionLabel}>LEAD CAPTURE (QR)</Text>
        <View style={styles.leadCaptureRow}>
          <View style={styles.leadCaptureLabelBlock}>
            <Text style={styles.leadCaptureLabel}>Enable Visitor Registration</Text>
            <Text style={styles.leadCaptureSub}>Automatic sync to Salesforce CRM</Text>
          </View>
          <Switch
            value={enableVisitorReg}
            onValueChange={setEnableVisitorReg}
            trackColor={{ false: '#E4EAF2', true: '#0D9488' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.templateButtonRow}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <MaterialCommunityIcons name="arrow-left" size={16} color="#0B2D3E" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Pressable style={styles.finalizeButton} onPress={onFinalize}>
            <Text style={styles.continueButtonText}>Finalize & Publish</Text>
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
    paddingHorizontal: H_PADDING,
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
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: '#0B2D3E',
    borderWidth: 3,
  },
  addColorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
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
  titleBlock: {
    paddingTop: 0,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B2D3E',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#5B6B7A',
    fontWeight: '600',
    lineHeight: 20,
  },
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
  addPropertyCard: {
    width: '100%',
    minHeight: 120,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginBottom: CARD_GAP,
  },
  addPropertyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 12,
  },
  propertyList: {
    gap: CARD_GAP,
  },
  propertyCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
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
  propertyCardSelected: {
    borderColor: '#0D9488',
  },
  propertyCardImageWrap: {
    width: '100%',
    height: 160,
  },
  propertyCardImage: {
    width: '100%',
    height: '100%',
  },
  propertyCardBody: {
    padding: 14,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.3,
  },
  statusBadgeReview: {},
  statusBadgeTextReview: {
    color: '#EA580C',
  },
  propertyAddress: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B2D3E',
    lineHeight: 20,
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
});
