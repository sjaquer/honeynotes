'use client';

import { useState } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import type { PromoCode } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

interface UsePromoCodesReturn {
  redeemCode: (code: string) => Promise<{ success: boolean; message: string; rewards?: { polen: number; jaleaReal: number } }>;
  isRedeeming: boolean;
}

export function usePromoCodes(): UsePromoCodesReturn {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [isRedeeming, setIsRedeeming] = useState(false);

  const redeemCode = async (code: string): Promise<{ success: boolean; message: string; rewards?: { polen: number; jaleaReal: number } }> => {
    if (!user) {
      return { success: false, message: 'Debes iniciar sesión para usar códigos promocionales.' };
    }

    const normalizedCode = code.trim().toLowerCase();
    
    if (!normalizedCode) {
      return { success: false, message: 'Por favor ingresa un código.' };
    }

    setIsRedeeming(true);

    try {
      // Get the promo code document
      const promoCodeRef = doc(firestore, 'promoCodes', normalizedCode);
      const promoCodeSnap = await getDoc(promoCodeRef);

      if (!promoCodeSnap.exists()) {
        return { success: false, message: 'Código no encontrado. Verifica que esté bien escrito.' };
      }

      const promoCode = promoCodeSnap.data() as PromoCode;

      // Check if code is active
      if (!promoCode.isActive) {
        return { success: false, message: 'Este código ya no está activo.' };
      }

      // Check expiration
      if (promoCode.expiresAt && promoCode.expiresAt.toDate() < new Date()) {
        return { success: false, message: 'Este código ha expirado.' };
      }

      // Check max uses
      if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
        return { success: false, message: 'Este código ya alcanzó su límite de usos.' };
      }

      // Check if user already used this code
      if (promoCode.usedBy.includes(user.uid)) {
        return { success: false, message: 'Ya has usado este código anteriormente.' };
      }

      // Apply rewards to user economy
      const userEconomyRef = doc(firestore, 'userEconomy', user.uid);
      const userEconomySnap = await getDoc(userEconomyRef);
      
      if (userEconomySnap.exists()) {
        await updateDoc(userEconomyRef, {
          polen: increment(promoCode.polen),
          jaleaReal: increment(promoCode.jaleaReal),
        });
      } else {
        // Create economy document if doesn't exist (shouldn't happen normally)
        const { setDoc } = await import('firebase/firestore');
        const { DEFAULT_INVENTORY } = await import('@/lib/shop-data');
        await setDoc(userEconomyRef, {
          polen: promoCode.polen,
          jaleaReal: promoCode.jaleaReal,
          inventory: DEFAULT_INVENTORY,
          adsWatchedToday: 0,
          loginStreak: 0,
          totalLettersSent: 0,
          totalLettersRead: 0,
        });
      }

      // Update promo code usage
      await updateDoc(promoCodeRef, {
        usedCount: increment(1),
        usedBy: arrayUnion(user.uid),
      });

      return { 
        success: true, 
        message: '¡Código canjeado exitosamente!',
        rewards: {
          polen: promoCode.polen,
          jaleaReal: promoCode.jaleaReal,
        }
      };

    } catch (error) {
      console.error('Error redeeming promo code:', error);
      return { success: false, message: 'Error al canjear el código. Intenta de nuevo.' };
    } finally {
      setIsRedeeming(false);
    }
  };

  return {
    redeemCode,
    isRedeeming,
  };
}
