/**
 * Central theme: colors and design tokens for the app.
 * Use these everywhere so styling is consistent and easy to change.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

/** Legacy light/dark scheme (tabs, icons). */
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/** Auth & shared screen palette – use dynamically across auth and other screens. */
export const Theme = {
  // Background & gradients
  backgroundGradient: ['#D8E9F6', '#F1F6FB', '#F5E6DB'] as const,
  /** Dark teal (left) → light teal (right) – matches reference. */
  brandGradient: ['#0b2341', '#00a7b5'] as const,

  // Surfaces
  cardBackground: '#FFFFFF',
  cardBackgroundSoft: '#F7FBFF',
  surfaceMuted: '#EEF3F8',
  surfaceLight: '#E3EAF2',
  cardShadowColor: '#000000',
  cardShadowOpacity: 0.08,
  cardShadowRadius: 16,
  cardShadowOffset: { width: 0, height: 10 },
  cardBorderRadius: 26,

  // Text
  textPrimary: '#0B2D3E',
  textSecondary: '#5B6B7A',
  textMuted: '#6A7B8C',
  textDivider: '#8A98A8',
  textOnDark: '#FFFFFF',

  // Links & accents
  link: '#00a7b5',
  accent: '#00a7b5',

  // Borders & dividers
  borderLight: '#E1E8F0',
  borderInput: '#D5E2F1',
  divider: '#D9E3EE',

  // Input
  inputBackground: '#EAF2FF',
  inputPlaceholder: '#9AA7B6',

  // Buttons
  outlineButtonBorder: '#D1DCE9',
  outlineButtonBackground: '#FFFFFF',
  outlineButtonText: '#2A3C4B',
  socialButtonBackground: '#FFFFFF',
  socialButtonBorder: '#E1E8F0',
  socialButtonText: '#2A3C4B',
  gradientButtonText: '#FFFFFF',

  // Icons (semantic)
  iconMuted: '#5B6B7A',
  iconPrimary: '#2A3C4B',

  // Main app / Dashboard
  /** Teal – primary accent, user badge, section links */
  accentTeal: '#0BA0B2',
  /** Blue – stat cards, charts */
  accentBlue: '#1B5E9A',
  /** Dark – stat cards, dark cards background */
  accentDark: '#0B2D3E',
  /** Green – stat cards */
  accentGreen: '#16A34A',
  /** Stat card accent rotation: [teal, blue, dark, green] */
  statAccents: ['#0BA0B2', '#1B5E9A', '#0B2D3E', '#16A34A'] as const,
  cardBorder: '#E4EAF2',
  cardBackgroundSemi: 'rgba(255, 255, 255, 0.92)',
  surfaceSoft: '#F7FAFE',
  surfaceIcon: '#F1F5FA',
  drawerBorder: '#D6DEE8',
  rowBorder: '#EEF2F7',
  badgeHotBg: '#FFE8E8',
  badgeHotBorder: '#FFD0D0',
  badgeNewBg: '#E8F8FF',
  badgeNewBorder: '#CDEEFF',
  badgeMutedBg: '#F1F5FA',
  badgeMutedBorder: '#E4EAF2',
  textHot: '#D24A4A',
  textOnAccent: '#FFFFFF',
  darkCardOverlay: 'rgba(255,255,255,0.08)',
  darkCardButtonBorder: 'rgba(255,255,255,0.14)',
  darkCardTextMuted: 'rgba(234, 242, 255, 0.75)',

  // Danger / destructive (profile, alerts)
  danger: '#DC2626',
  dangerBorder: '#FECACA',
  dangerBg: '#FEF2F2',

  // Spacing / layout (optional tokens)
  screenPadding: 20,
  cardPaddingH: 20,
  cardPaddingV: 28,
  inputBorderRadius: 12,
  buttonBorderRadius: 14,
} as const;

export type ThemeColors = typeof Theme;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
