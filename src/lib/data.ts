import type { Letter } from './types';
import { Timestamp } from 'firebase/firestore';

// For this MVP, we'll assume a hardcoded couple: "You" and "Your Love"
export const currentUser = 'You';
export const otherUser = 'Your Love';

// This data is now for placeholder/fallback purposes and not actively used by the main letter views.
export const mockLetters = (t: (key: string) => string): Letter[] => [
  {
    id: '1',
    senderId: 'mock_user_2',
    recipientId: 'mock_user_1',
    senderName: otherUser,
    recipientName: currentUser,
    content: t('mockLetter1.content'),
    config: {
      paperColor: 'cream',
      stamp: 'heart',
      font: 'Indie_Flower',
      borderStyle: 'simple',
    },
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    status: 'sent',
    isRead: false,
  },
  {
    id: '2',
    senderId: 'mock_user_2',
    recipientId: 'mock_user_1',
    senderName: otherUser,
    recipientName: currentUser,
    content: t('mockLetter2.content'),
    config: {
      paperColor: 'honey',
      stamp: 'bee',
      font: 'Belleza',
      borderStyle: 'simple',
    },
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    status: 'sent',
    isRead: false,
  },
  {
    id: '3',
    senderId: 'mock_user_1',
    recipientId: 'mock_user_2',
    senderName: currentUser,
    recipientName: otherUser,
    content: t('mockLetter3.content'),
    config: {
      paperColor: 'pink',
      stamp: 'wax-seal',
      font: 'Dancing_Script',
      borderStyle: 'hearts',
    },
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    status: 'opened',
    isRead: true,
  },
    {
    id: '4',
    senderId: 'mock_user_2',
    recipientId: 'mock_user_1',
    senderName: otherUser,
    recipientName: currentUser,
    content: t('mockLetter4.content'),
    config: {
      paperColor: 'crimson',
      stamp: 'heart',
      font: 'Belleza',
      borderStyle: 'floral',
    },
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    status: 'opened',
    isRead: true,
  },
];
