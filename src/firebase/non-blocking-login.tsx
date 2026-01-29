'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up with optional display name. Returns promise for error handling. */
export async function initiateEmailSignUp(
  authInstance: Auth, 
  email: string, 
  password: string,
  displayName?: string
): Promise<void> {
  const result = await createUserWithEmailAndPassword(authInstance, email, password);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
}

/** Initiate email/password sign-in. Returns promise for error handling. */
export async function initiateEmailSignIn(
  authInstance: Auth, 
  email: string, 
  password: string
): Promise<void> {
  await signInWithEmailAndPassword(authInstance, email, password);
}

/** Sign out the current user. */
export function initiateSignOut(authInstance: Auth): void {
  signOut(authInstance);
}
