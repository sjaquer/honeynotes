// Script para crear códigos promocionales
// Ejecutar con: node scripts/create-promo-codes.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const promoCodes = [
  {
    id: 'codedev2026',
    polen: 99999,
    jaleaReal: 99999,
    maxUses: null,
    usedCount: 0,
    usedBy: [],
    isActive: true,
  },
  {
    id: 'infamous',
    polen: 0,
    jaleaReal: 100,
    maxUses: null,
    usedCount: 0,
    usedBy: [],
    isActive: true,
  },
  {
    id: 'freegift',
    polen: 400,
    jaleaReal: 0,
    maxUses: null,
    usedCount: 0,
    usedBy: [],
    isActive: true,
  },
];

async function createPromoCodes() {
  for (const code of promoCodes) {
    const docRef = doc(db, 'promoCodes', code.id);
    await setDoc(docRef, {
      ...code,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Created promo code: ${code.id}`);
  }
  console.log('\n🎉 All promo codes created successfully!');
  process.exit(0);
}

createPromoCodes().catch((error) => {
  console.error('Error creating promo codes:', error);
  process.exit(1);
});
