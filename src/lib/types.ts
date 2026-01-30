import { Timestamp } from "firebase/firestore";

export type PaperColor = 
  | 'cream' | 'pink' | 'crimson' | 'honey' | 'light-pink' | 'lavender' | 'mint' | 'peach' | 'sky' | 'rose'
  | 'sunset' | 'ocean' | 'aurora' | 'rose-gold' | 'champagne' | 'moonlight' | 'cherry-blossom';

export type Stamp = 
  | 'heart' | 'bee' | 'wax-seal' | 'rose-emoji' | 'star-emoji' | 'kiss-emoji' | 'sparkle-emoji' | 'sun-emoji' | 'moon-emoji'
  | 'butterfly-emoji' | 'flower-emoji' | 'rainbow-emoji' | 'fire-emoji' | 'cupid-emoji' | 'infinity-emoji' | 'ring-emoji'
  | 'crown-emoji' | 'diamond-emoji' | 'angel-emoji' | 'dove-emoji' | 'teddy-emoji' | 'lovebirds-emoji' | 'shooting-star-emoji';

export type AppFont = 
  | 'Indie_Flower' | 'Belleza' | 'Dancing_Script' | 'Pacifico' | 'Caveat' | 'Sacramento' | 'Great_Vibes' 
  | 'Shadows_Into_Light' | 'Amatic_SC' | 'Permanent_Marker' | 'Satisfy' | 'Kalam'
  | 'Patrick_Hand' | 'Architects_Daughter' | 'Cookie' | 'Courgette' | 'Lobster' | 'Allura' | 'Tangerine' | 'Alex_Brush' | 'Mr_Dafoe';

export type BorderStyle = 
  | 'simple' | 'airmail' | 'dashed' | 'floral'
  | 'hearts' | 'stars' | 'waves' | 'ribbon' | 'vintage' | 'ornate' | 'gold' | 'lace';

export type LetterStatus = 'draft' | 'sent' | 'opened';

// =====================
// ECONOMY SYSTEM TYPES
// =====================

// Shop item categories
export type ShopCategory = 'paperColor' | 'stamp' | 'borderStyle' | 'font' | 'special';

// Currency types
export type CurrencyType = 'polen' | 'jaleaReal';

// Shop item definition
export interface ShopItem {
  id: string;
  category: ShopCategory;
  itemId: string; // The actual item ID (e.g., 'lavender' for paperColor)
  name: string;
  description: string;
  price: number;
  currency: CurrencyType;
  icon?: string; // Emoji or icon name
  isDefault?: boolean; // Items that are free/unlocked by default
  isPremium?: boolean; // Premium-only items
}

// User's inventory (unlocked items)
export interface UserInventory {
  paperColors: PaperColor[];
  stamps: Stamp[];
  borderStyles: BorderStyle[];
  fonts: AppFont[];
  special: string[]; // Special items like themes, etc.
}

// Weekly task types
export type TaskType = 
  | 'send_letters' 
  | 'read_letters' 
  | 'use_stamps' 
  | 'write_long_letter' 
  | 'use_different_colors'
  | 'login_streak'
  | 'watch_ad';

// Task definition
export interface WeeklyTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  target: number; // Goal to complete (e.g., send 5 letters)
  reward: {
    amount: number;
    currency: CurrencyType;
  };
  icon: string; // Emoji
}

// User's task progress
export interface UserTaskProgress {
  taskId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

// User's weekly tasks state
export interface UserWeeklyTasks {
  weekStartDate: string; // ISO date string for the start of the week
  tasks: UserTaskProgress[];
  lastUpdated: Timestamp;
}

// Extended user profile with economy
export interface UserEconomy {
  polen: number;
  jaleaReal: number;
  inventory: UserInventory;
  adsWatchedToday: number;
  lastAdWatchDate?: string; // ISO date string
  loginStreak: number;
  lastLoginDate?: string;
  totalLettersSent: number;
  totalLettersRead: number;
}

// Ad reward config
export interface AdRewardConfig {
  rewardAmount: number;
  maxAdsPerDay: number;
  cooldownMinutes: number;
}

// Purchase package (for Jalea Real)
export interface PurchasePackage {
  id: string;
  name: string;
  jaleaReal: number;
  priceUSD: number;
  bonusPercent?: number;
  isBestValue?: boolean;
  isPopular?: boolean;
}

// Interface for Firestore documents
export interface Letter {
  id: string;
  senderId: string;
  recipientId: string;
  // Letter metadata
  title?: string; // Optional title for the letter
  content: string;
  config: {
    paperColor: PaperColor;
    stamp: Stamp;
    font: AppFont;
    borderStyle?: BorderStyle;
  };
  createdAt: Timestamp;
  status: LetterStatus;
  isRead: boolean;
  aiFeedback?: {
    sentimentAnalysis: string;
    structureCheck: string;
    predictedReaction: string;
  };
  // Display names (customizable by sender)
  senderName: string;
  recipientName: string;
}

// Interface for UI components (with serialized dates)
export interface LetterUI extends Omit<Letter, 'createdAt'> {
  createdAt: string; // ISO string for UI rendering
}

// =====================
// PROMO CODE SYSTEM
// =====================

export interface PromoCode {
  id: string; // The code itself (e.g., 'codedev2026')
  polen: number;
  jaleaReal: number;
  maxUses?: number; // Optional max uses (null = unlimited)
  usedCount: number;
  usedBy: string[]; // Array of user IDs who used this code
  expiresAt?: Timestamp; // Optional expiration date
  createdAt: Timestamp;
  isActive: boolean;
}
