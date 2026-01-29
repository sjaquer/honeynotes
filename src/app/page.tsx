import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-secondary/30 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <Heart className="size-20 text-primary" fill="currentColor" />
        <h1 className="font-headline text-6xl font-bold text-primary">
          HoneyNotes
        </h1>
        <p className="max-w-md font-body text-lg text-foreground/80">
          A private, cozy space for you and your favorite person to share sweet
          notes and create lasting memories.
        </p>
      </div>
      <Link href="/inbox" className="mt-12">
        <Button
          size="lg"
          className="h-[60px] rounded-3xl bg-primary px-8 text-lg font-bold shadow-lg transition-transform hover:scale-105"
        >
          Enter as Couple
        </Button>
      </Link>
    </main>
  );
}
