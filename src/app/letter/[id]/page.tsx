'use client';

import { LetterOpener } from './_components/LetterOpener';
import { notFound } from 'next/navigation';
import { use, useEffect } from 'react';
import type { Letter, LetterUI } from '@/lib/types';
import { useFirebase, useUser, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { firestore } = useFirebase();
  const { user } = useUser();

  const letterRef = useMemoFirebase(() => {
    if (!id) return null;
    // Read from root /letters collection (no user dependency needed)
    return doc(firestore, 'letters', id);
  }, [firestore, id]);

  const { data: letter, isLoading } = useDoc<Letter>(letterRef);

  useEffect(() => {
    if (letter && !letter.isRead && letterRef) {
      updateDocumentNonBlocking(letterRef, { isRead: true });
    }
  }, [letter, letterRef]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!letter) {
    return notFound();
  }

  // Convert Firestore Timestamp to ISO string for UI component
  const letterWithDate: LetterUI = {
    ...letter,
    createdAt: letter.createdAt.toDate().toISOString(),
  };

  return <LetterOpener letter={letterWithDate} />;
}
