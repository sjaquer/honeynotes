'use client';

import { LetterOpener } from './_components/LetterOpener';
import { notFound } from 'next/navigation';
import { use, useEffect, useRef } from 'react';
import type { Letter, LetterUI } from '@/lib/types';
import { useFirebase, useUser, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useEconomy } from '@/hooks/use-economy';

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { trackLetterRead } = useEconomy();
  const hasTrackedRead = useRef(false);
  const hasMarkedRead = useRef(false);

  const letterRef = useMemoFirebase(() => {
    if (!id) return null;
    // Read from root /letters collection (no user dependency needed)
    return doc(firestore, 'letters', id);
  }, [firestore, id]);

  const { data: letter, isLoading, error } = useDoc<Letter>(letterRef);

  // Mark as read - only once
  useEffect(() => {
    if (
      letter &&
      !letter.isRead &&
      letterRef &&
      user &&
      letter.recipientId === user.uid &&
      !hasMarkedRead.current
    ) {
      hasMarkedRead.current = true;
      updateDocumentNonBlocking(letterRef, { isRead: true, status: 'opened' });

      if (!hasTrackedRead.current) {
        hasTrackedRead.current = true;
        trackLetterRead();
      }
    }
  }, [letter, letterRef, user]); // Removed trackLetterRead from deps to prevent loop

  // Show error if any
  if (error) {
    return (
      <div className="paper-app-bg paper-noise flex h-screen flex-col items-center justify-center p-4">
        <div className="glass-paper max-w-md rounded-xl border border-red-200 bg-red-50/80 p-6 text-center">
          <p className="font-semibold text-red-600 mb-2">Error al cargar la carta</p>
          <p className="text-sm text-red-500">{error.message}</p>
          <p className="text-xs text-gray-500 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (isLoading || isUserLoading) {
    return (
      <div className="paper-app-bg paper-noise flex h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="paper-app-bg paper-noise flex h-screen flex-col items-center justify-center p-4">
        <div className="glass-paper rounded-2xl p-8 text-center">
          <p className="text-xl font-semibold text-gray-600 mb-2">Carta no encontrada</p>
          <p className="text-sm text-gray-400">ID: {id}</p>
          <p className="text-xs text-gray-400 mt-4">Puede que no tengas permiso para verla</p>
        </div>
      </div>
    );
  }

  // Convert Firestore Timestamp to ISO string for UI component
  const letterWithDate: LetterUI = {
    ...letter,
    createdAt: letter.createdAt.toDate().toISOString(),
  };

  return <LetterOpener letter={letterWithDate} />;
}
