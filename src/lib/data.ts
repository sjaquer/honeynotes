import type { Letter } from './types';

// For this MVP, we'll assume a hardcoded couple: "You" and "Your Love"
export const currentUser = 'You';
export const otherUser = 'Your Love';

export const mockLetters = (t: (key: string) => string): Letter[] => [
  {
    id: '1',
    senderName: otherUser,
    recipientName: currentUser,
    content: t('mockLetter1.content'),
    config: {
      paperColor: 'cream',
      stamp: 'heart',
      font: 'Alegreya',
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
    isRead: false,
  },
  {
    id: '2',
    senderName: otherUser,
    recipientName: currentUser,
    content: t('mockLetter2.content'),
    config: {
      paperColor: 'honey',
      stamp: 'bee',
      font: 'Belleza',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
    isRead: false,
  },
  {
    id: '3',
    senderName: currentUser,
    recipientName: otherUser,
    content: t('mockLetter3.content'),
    config: {
      paperColor: 'pink',
      stamp: 'wax-seal',
      font: 'Alegreya',
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'opened',
    isRead: true,
  },
    {
    id: '4',
    senderName: otherUser,
    recipientName: currentUser,
    content: t('mockLetter4.content'),
    config: {
      paperColor: 'crimson',
      stamp: 'heart',
      font: 'Belleza',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'opened',
    isRead: true,
  },
];
