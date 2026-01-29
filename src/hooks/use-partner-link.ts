'use client';

import { useState } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { doc, setDoc, getDoc, query, collection, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { generatePartnerCode, formatPartnerCode, cleanPartnerCode, isValidPartnerCode } from '@/lib/partner-code';

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  partnerCode?: string;
  partnerId?: string;
  partnerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function usePartnerLink() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a new partner code for current user
  const generateMyCode = async (): Promise<string | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);

    try {
      const code = generatePartnerCode();
      const userRef = doc(firestore, 'users', user.uid);
      
      await setDoc(userRef, {
        partnerCode: code,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Also store in partnerCodes collection for lookup
      const codeRef = doc(firestore, 'partnerCodes', code);
      await setDoc(codeRef, {
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      return code;
    } catch (e) {
      console.error('Error generating partner code:', e);
      setError('No se pudo generar el código');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Link with partner using their code
  const linkWithPartner = async (partnerCode: string): Promise<boolean> => {
    if (!user) return false;
    
    const cleaned = cleanPartnerCode(partnerCode);
    if (!isValidPartnerCode(cleaned)) {
      setError('Código inválido');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find partner by code
      const codeRef = doc(firestore, 'partnerCodes', cleaned);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        setError('Código no encontrado');
        return false;
      }

      const partnerId = codeSnap.data().userId;

      if (partnerId === user.uid) {
        setError('No puedes vincularte contigo mismo');
        return false;
      }

      // Get partner's profile
      const partnerRef = doc(firestore, 'users', partnerId);
      const partnerSnap = await getDoc(partnerRef);
      const partnerData = partnerSnap.data();

      // Update current user's profile
      const myRef = doc(firestore, 'users', user.uid);
      await updateDoc(myRef, {
        partnerId: partnerId,
        partnerName: partnerData?.displayName || 'Tu Amor',
        updatedAt: serverTimestamp(),
      });

      // Update partner's profile
      await updateDoc(partnerRef, {
        partnerId: user.uid,
        partnerName: user.displayName || 'Tu Amor',
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (e) {
      console.error('Error linking with partner:', e);
      setError('No se pudo vincular con tu pareja');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Unlink from partner
  const unlinkPartner = async (): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    setError(null);

    try {
      const myRef = doc(firestore, 'users', user.uid);
      const mySnap = await getDoc(myRef);
      const myData = mySnap.data();

      if (myData?.partnerId) {
        // Remove partner link from both sides
        const partnerRef = doc(firestore, 'users', myData.partnerId);
        await updateDoc(partnerRef, {
          partnerId: null,
          partnerName: null,
          updatedAt: serverTimestamp(),
        });
      }

      await updateDoc(myRef, {
        partnerId: null,
        partnerName: null,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (e) {
      console.error('Error unlinking partner:', e);
      setError('No se pudo desvincular');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateMyCode,
    linkWithPartner,
    unlinkPartner,
    formatPartnerCode,
    isLoading,
    error,
  };
}
