import { mockLetters } from '@/lib/data';
import { LetterOpener } from './_components/LetterOpener';
import { notFound } from 'next/navigation';

export default function LetterPage({ params }: { params: { id: string } }) {
  const letter = mockLetters.find((l) => l.id === params.id);

  if (!letter) {
    notFound();
  }

  // In a real app, this would be an API call to mark as read
  letter.isRead = true;

  return <LetterOpener letter={letter} />;
}
