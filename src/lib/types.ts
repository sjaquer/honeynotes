import { Timestamp } from "firebase/firestore";

export type PaperColor = 'cream' | 'pink' | 'crimson' | 'honey' | 'light-pink' | 'lavender' | 'mint' | 'peach' | 'sky' | 'rose';
export type Stamp = 'heart' | 'bee' | 'wax-seal' | 'rose-emoji' | 'star-emoji' | 'kiss-emoji' | 'sparkle-emoji' | 'sun-emoji' | 'moon-emoji';
export type AppFont = 'Indie_Flower' | 'Belleza' | 'Dancing_Script' | 'Pacifico' | 'Caveat' | 'Sacramento' | 'Great_Vibes' | 'Shadows_Into_Light' | 'Amatic_SC' | 'Permanent_Marker' | 'Satisfy' | 'Kalam';
export type BorderStyle = 'simple' | 'airmail' | 'dashed' | 'floral';
export type LetterStatus = 'draft' | 'sent' | 'opened';

export interface Letter {
  id: string;
  senderId: string;
  recipientId: string;
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
   // Kept for UI compatibility during transition
  senderName: string;
  recipientName: string;
}
