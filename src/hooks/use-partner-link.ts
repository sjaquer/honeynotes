'use client';

import { useState } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
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

  const toUserFriendlyError = (fallback: string, e: unknown): string => {
    if (e && typeof e === 'object' && 'code' in e) {
      const code = String((e as { code: string }).code);
      if (code.includes('permission-denied')) return 'No tienes permisos para realizar esta accion';
      if (code.includes('unavailable')) return 'El servicio no esta disponible temporalmente';
    }
    return fallback;
  };

  // Generate a new partner code for current user (and unlink if needed)
  const generateMyCode = async (forceRegenerate: boolean = false): Promise<string | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);

    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Delete old code if it exists. deleteDoc is idempotent and does not require a read.
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
          partnerUnlinkedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Also clear our own partner link
        await updateDoc(userRef, {
          partnerId: null,
          partnerName: null,
          updatedAt: serverTimestamp(),
        });
      }

      // Generate a unique code (collisions are rare but possible).
      let code: string | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generatePartnerCode();
        const candidateRef = doc(firestore, 'partnerCodes', candidate);
        const candidateSnap = await getDoc(candidateRef);
        if (!candidateSnap.exists()) {
          code = candidate;
          break;
        }
      }

      if (!code) {
        setError('No pudimos generar un codigo unico. Intenta de nuevo.');
        return null;
      }
      
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
      setError(toUserFriendlyError('No se pudo generar el codigo', e));
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

      // Delete from partnerCodes collection. deleteDoc is idempotent and does not require a read.
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
      setError(toUserFriendlyError('No se pudo eliminar el codigo', e));
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
      const myRef = doc(firestore, 'users', user.uid);
      const mySnap = await getDoc(myRef);
      const myData = mySnap.data();

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
      if (!partnerSnap.exists()) {
        setError('La cuenta asociada al codigo no existe');
        return false;
      }

      const partnerData = partnerSnap.data();

      if (myData?.partnerId && myData.partnerId !== partnerId) {
        setError('Primero desvinculate de tu pareja actual para conectar otra cuenta');
        return false;
      }

      if (partnerData?.partnerId && partnerData.partnerId !== user.uid) {
        setError('Esa persona ya esta vinculada con otra cuenta');
        return false;
      }

      const batch = writeBatch(firestore);

      // Update current user's profile
      batch.set(myRef, {
        partnerId: partnerId,
        partnerName: partnerData?.displayName || 'Tu Amor',
        partnerUnlinkedAt: null,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Update partner's profile
      batch.set(partnerRef, {
        partnerId: user.uid,
        partnerName: user.displayName || 'Tu Amor',
        partnerUnlinkedAt: null,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await batch.commit();

      return true;
    } catch (e) {
      console.error('Error linking with partner:', e);
      setError(toUserFriendlyError('No se pudo vincular con tu pareja', e));
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
      setError(toUserFriendlyError('No se pudo desvincular', e));
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
