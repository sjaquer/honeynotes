import type { Letter } from './types';

// For this MVP, we'll assume a hardcoded couple: "You" and "Your Love"
export const currentUser = 'You';
export const otherUser = 'Your Love';

export const mockLetters: Letter[] = [
  {
    id: '1',
    senderName: otherUser,
    recipientName: currentUser,
    content: `My Dearest,

Just a little note to say I'm thinking of you. Remember that time we tried to bake a cake and ended up covering the whole kitchen in flour? I was just thinking about it and couldn't stop smiling. Every moment with you is an adventure, even the messy ones.

Can't wait to see you tonight.

All my love,
Your Love`,
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
    content: `Hey You,

I saw the cutest little bee in the garden today and it made me think of my honey. That's you! 

Thank you for being the sweetest part of my life. I feel so lucky to have you.

Yours forever,
Your Love`,
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
    content: `To my one and only,

Thank you for the beautiful notes. They always make my day brighter. I'm writing this one to seal my love for you, today and always. You mean the world to me.

With all my heart,
Me`,
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
    content: `My Love,

This crimson note is for my burning love for you. I hope this note finds you well. I was just reminiscing about our first date. How nervous and excited we both were! It feels like just yesterday, and yet look at how far we've come.

I love you more each day.

Forever and always,
Your Love`,
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
