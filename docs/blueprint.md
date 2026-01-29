# **App Name**: HoneyNotes

## Core Features:

- Letter Creation: Create and customize digital letters with content and configurations (5 paper color options: shades of Cream, Pink, Crimson, and Honey; 3 stamps: Heart, Bee, and Wax Seal; font).
- Firestore Integration: Store letters in Firestore with content, config, timestamps, status ('sent'|'opened'), and AI feedback.
- AI Feedback (The Bee Guide): Get AI-powered feedback on letter content, providing sentiment analysis, structure check, and reaction prediction, with selectable personalities (Friendly/Rational). User must 'Ask the Bee' before sending a letter. This feature acts as a tool providing suggestions.
- Dashboard (Inbox): Display a list of received letters as 'Crimson Red' envelope icons, with 'trembling' animation for unread letters.
- Letter Editor: Provide a customizable text editor with options for paper color (5 shades), stamps (3 specific), and font selection.
- Letter Sending/Opening Status: Update letter status ('sent' or 'opened') in Firestore upon sending/opening, and mark letter in dashboard to 'steady' from 'trembling'.
- Reading View: Display the letter content in a stylized view with chosen typography and 'opening envelope' animation.
- Weekly Tasks & Polen Economy: Implement a 'Weekly Tasks' dashboard with 'Polen' currency. Completing tasks rewards 'Polen', used to unlock stamps/colors in the editor.
- Simplified Navigation: Implement large, finger-friendly buttons at the bottom or a clear side menu for switching between 'Inbox,' 'New Letter,' 'Tasks,' and 'Shop.'
- Authentication Bypass: Bypass login/signup screens for MVP. Use a direct entry or 'Enter as Couple' button.

## Style Guidelines:

- Primary color: Crimson Red (#DC143C) for actions and main elements.
- Accent color: Golden Honey (#FFD700) to highlight AI and valuable elements.
- Background color: Paper Cream (#FFFDF5) for a soft, inviting background.
- Secondary color: Makeup Pink (#FFC0CB) for soft decorations and accents.
- Headline font: 'Belleza' (sans-serif) for headlines and shorter text blocks; body text: 'Alegreya' (serif) for longer text blocks. Note: currently only Google Fonts are supported.
- Mobile-first layout with a centered container and max-width of 480px. Large buttons (min. 60px height) with rounded-3xl borders.
- Subtle 'trembling' animation for unread letters. Animated 'opening envelope' effect when viewing letters.
- Use Heart, Bee, and Wax Seal stamps.