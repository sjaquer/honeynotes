'use client';

import { mockLetters } from '@/lib/data';
import { LetterOpener } from './_components/LetterOpener';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Letter } from '@/lib/types';
import { useTranslation } from '@/hooks/use-translation';

export default function LetterPage({ params }: { params: { id: string } }) {
  const { t, locale } = useTranslation();
  const [letter, setLetter] = useState<Letter | undefined>(undefined);

  useEffect(() => {
    const foundLetter = mockLetters(t).find((l) => l.id === params.id);
    if (foundLetter) {
      // In a real app, this would be an API call to mark as read
      foundLetter.isRead = true;
      setLetter(foundLetter);
    }
  }, [params.id, t]);

  if (!letter) {
    // Wait for the letter to be found or just show not found if it never is
    const isLetterFound = mockLetters(t).some(l => l.id === params.id);
    if (!isLetterFound) {
      notFound();
    }
    return null; // or a loading component
  }

  return <LetterOpener letter={letter} />;
}
