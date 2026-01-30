/**
 * Letter Validation Utilities
 * 
 * This file provides validation functions and constants for letter data
 * to ensure consistency between the app and Firestore.
 */

import type { PaperColor, Stamp, AppFont, BorderStyle, Letter } from './types';
import { serverTimestamp, type FieldValue } from 'firebase/firestore';

// =====================
// VALID VALUES (must match types.ts)
// =====================

export const VALID_PAPER_COLORS: PaperColor[] = [
  // Free
  'cream', 'pink', 'honey',
  // Polen
  'lavender', 'mint', 'light-pink', 'crimson', 'peach', 'sky', 'rose',
  // Premium
  'sunset', 'ocean', 'aurora', 'rose-gold', 'champagne', 'moonlight', 'cherry-blossom'
];

export const VALID_STAMPS: Stamp[] = [
  // Free
  'heart', 'bee', 'wax-seal',
  // Polen
  'rose-emoji', 'star-emoji', 'butterfly-emoji', 'flower-emoji', 'rainbow-emoji',
  'kiss-emoji', 'sparkle-emoji', 'sun-emoji', 'fire-emoji', 'cupid-emoji', 'infinity-emoji', 'ring-emoji',
  // Premium
  'moon-emoji', 'crown-emoji', 'diamond-emoji', 'angel-emoji', 'dove-emoji', 'teddy-emoji', 'lovebirds-emoji', 'shooting-star-emoji'
];

export const VALID_FONTS: AppFont[] = [
  // Free
  'Indie_Flower', 'Belleza',
  // Polen
  'Caveat', 'Amatic_SC', 'Shadows_Into_Light', 'Patrick_Hand', 'Architects_Daughter',
  'Dancing_Script', 'Pacifico', 'Permanent_Marker', 'Sacramento', 'Satisfy', 'Cookie', 'Courgette', 'Lobster',
  // Premium
  'Great_Vibes', 'Kalam', 'Allura', 'Tangerine', 'Alex_Brush', 'Mr_Dafoe'
];

export const VALID_BORDERS: BorderStyle[] = [
  // Free
  'simple',
  // Polen
  'dashed', 'airmail', 'hearts', 'stars', 'waves', 'ribbon',
  // Premium
  'floral', 'vintage', 'ornate', 'gold', 'lace'
];

// =====================
// DEFAULT VALUES
// =====================

export const DEFAULT_LETTER_CONFIG = {
  paperColor: 'cream' as PaperColor,
  stamp: 'heart' as Stamp,
  font: 'Indie_Flower' as AppFont,
  borderStyle: 'simple' as BorderStyle,
};

// =====================
// VALIDATION FUNCTIONS
// =====================

export function isValidPaperColor(color: string): color is PaperColor {
  return VALID_PAPER_COLORS.includes(color as PaperColor);
}

export function isValidStamp(stamp: string): stamp is Stamp {
  return VALID_STAMPS.includes(stamp as Stamp);
}

export function isValidFont(font: string): font is AppFont {
  return VALID_FONTS.includes(font as AppFont);
}

export function isValidBorderStyle(border: string): border is BorderStyle {
  return VALID_BORDERS.includes(border as BorderStyle);
}

/**
 * Validates letter config and returns sanitized version
 * Falls back to defaults for invalid values
 */
export function sanitizeLetterConfig(config: Partial<Letter['config']>): Letter['config'] {
  return {
    paperColor: config.paperColor && isValidPaperColor(config.paperColor) 
      ? config.paperColor 
      : DEFAULT_LETTER_CONFIG.paperColor,
    stamp: config.stamp && isValidStamp(config.stamp) 
      ? config.stamp 
      : DEFAULT_LETTER_CONFIG.stamp,
    font: config.font && isValidFont(config.font) 
      ? config.font 
      : DEFAULT_LETTER_CONFIG.font,
    borderStyle: config.borderStyle && isValidBorderStyle(config.borderStyle) 
      ? config.borderStyle 
      : DEFAULT_LETTER_CONFIG.borderStyle,
  };
}

/**
 * Validates full letter data for Firestore
 * Returns null if critical fields are missing
 */
export function validateLetterData(data: Partial<Letter>): boolean {
  if (!data.senderId || typeof data.senderId !== 'string') return false;
  if (!data.recipientId || typeof data.recipientId !== 'string') return false;
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) return false;
  if (!data.config) return false;
  
  // Validate config values
  const { paperColor, stamp, font, borderStyle } = data.config;
  if (!isValidPaperColor(paperColor)) return false;
  if (!isValidStamp(stamp)) return false;
  if (!isValidFont(font)) return false;
  if (!isValidBorderStyle(borderStyle)) return false;
  
  return true;
}

/**
 * Creates a properly structured letter object for Firestore
 */
export function createLetterDocument(
  senderId: string,
  recipientId: string,
  content: string,
  config: Partial<Letter['config']>,
  options?: {
    title?: string;
    senderName?: string;
    recipientName?: string;
  }
): Omit<Letter, 'id' | 'createdAt'> & { createdAt: FieldValue } {
  const sanitizedConfig = sanitizeLetterConfig(config);
  
  return {
    senderId,
    recipientId,
    title: options?.title?.trim() || null,
    content: content.trim(),
    config: sanitizedConfig,
    createdAt: serverTimestamp(),
    status: 'sent',
    isRead: false,
    senderName: options?.senderName || 'Tú',
    recipientName: options?.recipientName || 'Tu Amor',
  };
}
