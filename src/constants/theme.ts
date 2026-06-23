export const Colors = {
  primary: '#FF6B00',
  primaryDark: '#E65100',
  secondary: '#8B0000',
  accent: '#FFD700',
  background: '#FFF8F0',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF3E0',
  text: '#1A1A1A',
  textSecondary: '#5D4037',
  textLight: '#FFFFFF',
  border: '#FFCC80',
  success: '#2E7D32',
  premium: '#6A1B9A',
  mandirGlow: '#FFB74D',
  cardShadow: 'rgba(230, 81, 0, 0.15)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 34,
};

export const DEITIES = [
  { id: 'shiv', name: 'Shiv Ji', emoji: '🔱', color: '#5C6BC0' },
  { id: 'hanuman', name: 'Hanuman Ji', emoji: '🙏', color: '#FF6F00' },
  { id: 'ganesh', name: 'Ganesh Ji', emoji: '🐘', color: '#EF6C00' },
  { id: 'durga', name: 'Durga Maa', emoji: '🌺', color: '#C62828' },
  { id: 'lakshmi', name: 'Lakshmi Maa', emoji: '🪷', color: '#F9A825' },
  { id: 'krishna', name: 'Krishna Ji', emoji: '🪈', color: '#1565C0' },
  { id: 'ram', name: 'Ram Ji', emoji: '🏹', color: '#00838F' },
  { id: 'vishnu', name: 'Vishnu Ji', emoji: '💙', color: '#283593' },
  { id: 'saraswati', name: 'Saraswati Maa', emoji: '📿', color: '#FFFFFF' },
  { id: 'shani', name: 'Shani Dev', emoji: '⚫', color: '#37474F' },
] as const;

export type DeityId = (typeof DEITIES)[number]['id'];
