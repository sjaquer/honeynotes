'use client';

import { LetterOpener } from './_components/LetterOpener';
import { notFound } from 'next/navigation';
import { use, useEffect } from 'react';
import type { Letter } from '@/lib/types';
import { useFirebase, useUser, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { firestore } = useFirebase();
  const { user } = useUser();

  const letterRef = useMemoFirebase(() => {
    if (!user || !id) return null;
    return doc(firestore, 'users', user.uid, 'letters', id);
  }, [firestore, user, id]);

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

  // The letter object from firestore needs its timestamp converted
  const letterWithDate = {
    ...letter,
    createdAt: letter.createdAt.toDate().toISOString(),
  };

  return <LetterOpener letter={letterWithDate} />;
}
