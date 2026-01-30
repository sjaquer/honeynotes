'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import type { UserInventory, UserEconomy, ShopItem, CurrencyType } from '@/lib/types';
import { DEFAULT_INVENTORY, SHOP_ITEMS, AD_REWARD_CONFIG, getTodayDate, isItemOwned } from '@/lib/shop-data';

const DEFAULT_ECONOMY: UserEconomy = {
  polen: 100, // Starting bonus
  jaleaReal: 0,
  inventory: DEFAULT_INVENTORY,
  adsWatchedToday: 0,
  loginStreak: 0,
  totalLettersSent: 0,
  totalLettersRead: 0,
};

export function useEconomy() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [economy, setEconomy] = useState<UserEconomy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs to prevent duplicate operations
  const hasLoadedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  // Load economy data - only once per user
  useEffect(() => {
    // Reset if user changes
    if (user?.uid !== lastUserIdRef.current) {
      hasLoadedRef.current = false;
      lastUserIdRef.current = user?.uid || null;
    }
    
    if (!user) {
      setEconomy(null);
      setIsLoading(false);
      return;
    }

    // Prevent duplicate loads
    if (hasLoadedRef.current || isLoadingRef.current) {
      return;
    }

    const loadEconomy = async () => {
      isLoadingRef.current = true;
      setIsLoading(true);
      
      try {
        const economyRef = doc(firestore, 'userEconomy', user.uid);
        const economySnap = await getDoc(economyRef);

        if (economySnap.exists()) {
          const data = economySnap.data() as UserEconomy;
          const today = getTodayDate();
          
          // Only update login streak if it's a different day - do it in background
          if (data.lastLoginDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const newStreak = data.lastLoginDate === yesterdayStr 
              ? data.loginStreak + 1 
              : 1;
            
            // Set local state immediately
            const updatedData = { 
              ...data, 
              loginStreak: newStreak, 
              lastLoginDate: today,
              adsWatchedToday: data.lastAdWatchDate === today ? data.adsWatchedToday : 0,
            };
            setEconomy(updatedData);
            
            // Update in background (non-blocking)
            updateDoc(economyRef, {
              loginStreak: newStreak,
              lastLoginDate: today,
              adsWatchedToday: data.lastAdWatchDate === today ? data.adsWatchedToday : 0,
              lastAdWatchDate: today,
            }).catch(e => console.error('Error updating login streak:', e));
          } else {
            setEconomy(data);
          }
        } else {
          // Create initial economy for new user
          const initialEconomy: UserEconomy = {
            ...DEFAULT_ECONOMY,
            lastLoginDate: getTodayDate(),
            lastAdWatchDate: getTodayDate(),
            loginStreak: 1,
          };
          
          setEconomy(initialEconomy);
          
          // Create in background (non-blocking)
          setDoc(economyRef, {
            ...initialEconomy,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }).catch(e => console.error('Error creating economy:', e));
        }
        
        hasLoadedRef.current = true;
      } catch (e) {
        console.error('Error loading economy:', e);
        setError('Error al cargar los datos de economía');
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };

    loadEconomy();
  }, [user, firestore]);

  // Add currency
  const addCurrency = useCallback(async (amount: number, currency: CurrencyType): Promise<boolean> => {
    if (!user || !economy) return false;

    try {
      const economyRef = doc(firestore, 'userEconomy', user.uid);
      const field = currency === 'polen' ? 'polen' : 'jaleaReal';
      
      await updateDoc(economyRef, {
        [field]: increment(amount),
        updatedAt: serverTimestamp(),
      });

      setEconomy(prev => prev ? {
        ...prev,
        [field]: prev[field] + amount,
      } : null);

      return true;
    } catch (e) {
      console.error('Error adding currency:', e);
      return false;
    }
  }, [user, economy, firestore]);

  // Spend currency
  const spendCurrency = useCallback(async (amount: number, currency: CurrencyType): Promise<boolean> => {
    if (!user || !economy) return false;

    const field = currency === 'polen' ? 'polen' : 'jaleaReal';
    if (economy[field] < amount) {
      setError('No tienes suficiente ' + (currency === 'polen' ? 'Polen' : 'Jalea Real'));
      return false;
    }

    try {
      const economyRef = doc(firestore, 'userEconomy', user.uid);
      
      await updateDoc(economyRef, {
        [field]: increment(-amount),
        updatedAt: serverTimestamp(),
      });

      setEconomy(prev => prev ? {
        ...prev,
        [field]: prev[field] - amount,
      } : null);

      return true;
    } catch (e) {
      console.error('Error spending currency:', e);
      return false;
    }
  }, [user, economy, firestore]);

  // Purchase item
  const purchaseItem = useCallback(async (item: ShopItem): Promise<boolean> => {
    if (!user || !economy) return false;

    // Check if already owned
    if (isItemOwned(economy.inventory, item)) {
      setError('Ya tienes este item');
      return false;
    }

    // Check if can afford
    const currency = item.currency;
    const balance = currency === 'polen' ? economy.polen : economy.jaleaReal;
    
    if (balance < item.price) {
      setError(`No tienes suficiente ${currency === 'polen' ? 'Polen' : 'Jalea Real'}`);
      return false;
    }

    try {
      const economyRef = doc(firestore, 'userEconomy', user.uid);
      const field = currency === 'polen' ? 'polen' : 'jaleaReal';
      
      // Determine inventory field based on category
      let inventoryField: string;
      switch (item.category) {
        case 'paperColor':
          inventoryField = 'inventory.paperColors';
          break;
        case 'stamp':
          inventoryField = 'inventory.stamps';
          break;
        case 'borderStyle':
          inventoryField = 'inventory.borderStyles';
          break;
        case 'font':
          inventoryField = 'inventory.fonts';
          break;
        case 'special':
          inventoryField = 'inventory.special';
          break;
        default:
          return false;
      }

      await updateDoc(economyRef, {
        [field]: increment(-item.price),
        [inventoryField]: arrayUnion(item.itemId),
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setEconomy(prev => {
        if (!prev) return null;
        const newInventory = { ...prev.inventory };
        
        switch (item.category) {
          case 'paperColor':
            newInventory.paperColors = [...newInventory.paperColors, item.itemId as any];
            break;
          case 'stamp':
            newInventory.stamps = [...newInventory.stamps, item.itemId as any];
            break;
          case 'borderStyle':
            newInventory.borderStyles = [...newInventory.borderStyles, item.itemId as any];
            break;
          case 'font':
            newInventory.fonts = [...newInventory.fonts, item.itemId as any];
            break;
          case 'special':
            newInventory.special = [...newInventory.special, item.itemId];
            break;
        }

        return {
          ...prev,
          [field]: prev[field] - item.price,
          inventory: newInventory,
        };
      });

      return true;
    } catch (e) {
      console.error('Error purchasing item:', e);
      setError('Error al comprar el item');
      return false;
    }
  }, [user, economy, firestore]);

  // Watch ad for reward
  const watchAdForReward = useCallback(async (): Promise<{ success: boolean; reward?: number }> => {
    if (!user || !economy) return { success: false };

    const today = getTodayDate();
    const adsToday = economy.lastAdWatchDate === today ? economy.adsWatchedToday : 0;

    if (adsToday >= AD_REWARD_CONFIG.maxAdsPerDay) {
      setError('Has alcanzado el límite de anuncios por hoy');
      return { success: false };
    }

    try {
      const economyRef = doc(firestore, 'userEconomy', user.uid);
      
      await updateDoc(economyRef, {
        polen: increment(AD_REWARD_CONFIG.rewardAmount),
        adsWatchedToday: adsToday + 1,
        lastAdWatchDate: today,
        updatedAt: serverTimestamp(),
      });

      setEconomy(prev => prev ? {
        ...prev,
        polen: prev.polen + AD_REWARD_CONFIG.rewardAmount,
        adsWatchedToday: adsToday + 1,
        lastAdWatchDate: today,
      } : null);

      return { success: true, reward: AD_REWARD_CONFIG.rewardAmount };
    } catch (e) {
      console.error('Error watching ad:', e);
      return { success: false };
    }
  }, [user, economy, firestore]);

  // Track letter sent (for tasks) - runs in background, doesn't block
  const trackLetterSent = useCallback((letterConfig: { paperColor: string; stamp: string }) => {
    if (!user) return;

    // Run in background without awaiting
    const economyRef = doc(firestore, 'userEconomy', user.uid);
    updateDoc(economyRef, {
      totalLettersSent: increment(1),
      updatedAt: serverTimestamp(),
    }).then(() => {
      setEconomy(prev => prev ? {
        ...prev,
        totalLettersSent: prev.totalLettersSent + 1,
      } : null);
    }).catch(e => {
      console.error('Error tracking letter sent:', e);
    });
  }, [user, firestore]);

  // Track letter read (for tasks)
  const trackLetterRead = useCallback(async () => {
    if (!user) return;

    try {
      const economyRef = doc(firestore, 'userEconomy', user.uid);
      await updateDoc(economyRef, {
        totalLettersRead: increment(1),
        updatedAt: serverTimestamp(),
      });

      setEconomy(prev => prev ? {
        ...prev,
        totalLettersRead: prev.totalLettersRead + 1,
      } : null);
    } catch (e) {
      console.error('Error tracking letter read:', e);
    }
  }, [user, firestore]);

  // Check if user can afford item
  const canAfford = useCallback((item: ShopItem): boolean => {
    if (!economy) return false;
    const balance = item.currency === 'polen' ? economy.polen : economy.jaleaReal;
    return balance >= item.price;
  }, [economy]);

  // Check if item is owned
  const ownsItem = useCallback((item: ShopItem): boolean => {
    if (!economy) return false;
    return isItemOwned(economy.inventory, item);
  }, [economy]);

  // Get remaining ads today
  const getRemainingAds = useCallback((): number => {
    if (!economy) return 0;
    const today = getTodayDate();
    const adsToday = economy.lastAdWatchDate === today ? economy.adsWatchedToday : 0;
    return Math.max(0, AD_REWARD_CONFIG.maxAdsPerDay - adsToday);
  }, [economy]);

  return {
    economy,
    isLoading,
    error,
    addCurrency,
    spendCurrency,
    purchaseItem,
    watchAdForReward,
    trackLetterSent,
    trackLetterRead,
    canAfford,
    ownsItem,
    getRemainingAds,
    clearError: () => setError(null),
  };
}
