'use client';
    
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  getDoc,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

export interface UseDocOptions {
  realtime?: boolean;
  enabled?: boolean;
}

function isSameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Handles nullable references.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} docRef -
 * The Firestore DocumentReference. Waits if null/undefined.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
  options?: UseDocOptions,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;
  const realtime = options?.realtime ?? true;
  const enabled = options?.enabled ?? true;
  const docIdentity = memoizedDocRef
    ? `${memoizedDocRef.firestore.app.name}:${memoizedDocRef.path}`
    : null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    const targetDocRef = memoizedDocRef;

    if (!enabled || !targetDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const applySnapshot = (snapshot: DocumentSnapshot<DocumentData>) => {
      const nextData = snapshot.exists()
        ? ({ ...(snapshot.data() as T), id: snapshot.id } as StateDataType)
        : null;

      setData((previous) => (isSameValue(previous, nextData) ? previous : nextData));
      setError(null);
      setIsLoading(false);
    };

    const handlePermissionError = () => {
      const contextualError = new FirestorePermissionError({
        operation: 'get',
        path: targetDocRef.path,
      });

      setError(contextualError);
      setData(null);
      setIsLoading(false);
      errorEmitter.emit('permission-error', contextualError);
    };

    if (!realtime) {
      getDoc(targetDocRef)
        .then(applySnapshot)
        .catch(() => {
          handlePermissionError();
        });

      return;
    }

    const unsubscribe = onSnapshot(
      targetDocRef,
      applySnapshot,
      (_error: FirestoreError) => {
        handlePermissionError();
      },
    );

    return () => unsubscribe();
  }, [docIdentity, enabled, realtime]);

  return { data, isLoading, error };
}