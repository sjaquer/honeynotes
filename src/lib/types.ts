export type PaperColor = 'cream' | 'pink' | 'crimson' | 'honey' | 'light-pink';
export type Stamp = 'heart' | 'bee' | 'wax-seal';
export type AppFont = 'Alegreya' | 'Belleza';
export type LetterStatus = 'draft' | 'sent' | 'opened';

export interface Letter {
  id: string;
  senderName: string;
  recipientName: string;
  content: string;
  config: {
    paperColor: PaperColor;
    stamp: Stamp;
    font: AppFont;
  };
  createdAt: string;
  status: LetterStatus;
  isRead: boolean;
  aiFeedback?: {
    sentimentAnalysis: string;
    structureCheck: string;
    predictedReaction: string;
  };
}
