'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  getDocs,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

export interface UseCollectionOptions {
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

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *  
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
    options?: UseCollectionOptions,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;
  const realtime = options?.realtime ?? true;
  const enabled = options?.enabled ?? true;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!enabled || !memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const path: string =
      memoizedTargetRefOrQuery.type === 'collection'
        ? (memoizedTargetRefOrQuery as CollectionReference).path
        : (memoizedTargetRefOrQuery as unknown as InternalQuery)._query.path.canonicalString();

    const applySnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
      const results: ResultItemType[] = [];
      for (const doc of snapshot.docs) {
        results.push({ ...(doc.data() as T), id: doc.id });
      }
      setData((previous) => (isSameValue(previous, results) ? previous : results));
      setError(null);
      setIsLoading(false);
    };

    const handlePermissionError = () => {
      const contextualError = new FirestorePermissionError({
        operation: 'list',
        path,
      });

      setError(contextualError);
      setData(null);
      setIsLoading(false);
      errorEmitter.emit('permission-error', contextualError);
    };

    if (!realtime) {
      getDocs(memoizedTargetRefOrQuery)
        .then(applySnapshot)
        .catch(() => {
          handlePermissionError();
        });

      return;
    }

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      applySnapshot,
      (_error: FirestoreError) => {
        handlePermissionError();
      },
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery, enabled, realtime]);

  if (memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo && process.env.NODE_ENV !== 'production') {
    console.warn('useCollection received a non-memoized query/reference. Wrap with useMemoFirebase to avoid extra reads.');
  }

  return { data, isLoading, error };
}