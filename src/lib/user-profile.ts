/**
 * User Profile Utilities
 * Helpers for ensuring user profile exists in Firestore
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  partnerCode?: string;
  partnerId?: string;
  partnerName?: string;
  partnerUnlinkedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ensures user profile exists in Firestore, creates if missing
 * @param firestore Firestore instance
 * @param user Current authenticated user
 * @returns User profile or null if user is not authenticated
 */
export async function ensureUserProfile(
  firestore: Firestore,
  user: User | null
): Promise<UserProfile | null> {
  if (!user) {
    console.warn('ensureUserProfile: No authenticated user');
    return null;
  }

  try {
    const userRef = doc(firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Profile exists, return it
      const data = userSnap.data() as Omit<UserProfile, 'id'>;
      return { id: userSnap.id, ...data };
    }

    // Profile doesn't exist, create it
    console.log('Creating user profile for:', user.uid);
    const newProfile = {
      displayName: user.displayName || 'Usuario',
      email: user.email || undefined,
      photoURL: user.photoURL || undefined,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, newProfile);

    // Fetch again to get server-generated timestamps
    const refreshedSnap = await getDoc(userRef);
    if (refreshedSnap.exists()) {
      const data = refreshedSnap.data() as Omit<UserProfile, 'id'>;
      return { id: refreshedSnap.id, ...data };
    }

    return null;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
}

/**
 * Gets user profile from Firestore
 * @param firestore Firestore instance
 * @param userId User ID to fetch profile for
 * @returns User profile or null if not found
 */
export async function getUserProfile(
  firestore: Firestore,
  userId: string
): Promise<UserProfile | null> {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data() as Omit<UserProfile, 'id'>;
    return { id: userSnap.id, ...data };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}
