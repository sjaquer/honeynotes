'use client';

import { useState } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { doc, setDoc, getDoc, query, collection, where, getDocs, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { generatePartnerCode, formatPartnerCode, cleanPartnerCode, isValidPartnerCode } from '@/lib/partner-code';

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  partnerCode?: string;
  partnerId?: string;
  partnerName?: string;
  partnerUnlinkedAt?: Date; // Timestamp when partner unlinked/regenerated code
  createdAt: Date;
  updatedAt: Date;
}

export function usePartnerLink() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a new partner code for current user (and unlink if needed)
  const generateMyCode = async (forceRegenerate: boolean = false): Promise<string | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);

    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Delete old code if exists
      if (userData?.partnerCode) {
        const oldCodeRef = doc(firestore, 'partnerCodes', userData.partnerCode);
        await deleteDoc(oldCodeRef);
      }

      // If regenerating, unlink partner and notify them
      if (forceRegenerate && userData?.partnerId) {
        const partnerRef = doc(firestore, 'users', userData.partnerId);
        await updateDoc(partnerRef, {
          partnerId: null,
          partnerName: null,
          partnerUnlinkedAt: serverTimestamp(), // Signal that partner unlinked
          updatedAt: serverTimestamp(),
        });

        // Also clear our own partner link
        await updateDoc(userRef, {
          partnerId: null,
          partnerName: null,
          updatedAt: serverTimestamp(),
        });
      }

      // Generate new code
      const code = generatePartnerCode();
      
      await setDoc(userRef, {
        partnerCode: code,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Store in partnerCodes collection for lookup
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

  // Delete current code (and unlink if linked)
  const deleteMyCode = async (): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    setError(null);

    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Delete from partnerCodes collection
      if (userData?.partnerCode) {
        const codeRef = doc(firestore, 'partnerCodes', userData.partnerCode);
        await deleteDoc(codeRef);
      }

      // If linked, notify partner
      if (userData?.partnerId) {
        const partnerRef = doc(firestore, 'users', userData.partnerId);
        await updateDoc(partnerRef, {
          partnerId: null,
          partnerName: null,
          partnerUnlinkedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      // Clear code and partner from our profile
      await updateDoc(userRef, {
        partnerCode: null,
        partnerId: null,
        partnerName: null,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (e) {
      console.error('Error deleting partner code:', e);
      setError('No se pudo eliminar el código');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the unlinked notification flag
  const clearUnlinkedNotification = async (): Promise<void> => {
    if (!user) return;
    try {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        partnerUnlinkedAt: null,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error clearing notification:', e);
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
          partnerUnlinkedAt: serverTimestamp(),
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
    deleteMyCode,
    linkWithPartner,
    unlinkPartner,
    clearUnlinkedNotification,
    formatPartnerCode,
    isLoading,
    error,
  };
}
