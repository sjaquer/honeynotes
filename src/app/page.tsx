'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function Home() {
  const router = useRouter();
  const { setLocale } = useTranslation();

  const handleLanguageSelect = (lang: 'en' | 'es') => {
    setLocale(lang);
    router.push('/inbox');
  };

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
        <p className="mt-4 max-w-md font-body text-lg text-foreground/80">
          Un espacio privado y acogedor para que tú y tu persona favorita
          compartan notas dulces y creen recuerdos duraderos.
        </p>
      </div>
      <div className="mt-12">
        <h2 className="mb-4 font-headline text-2xl">
          Choose your language / Elige tu idioma
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-[60px] rounded-3xl bg-primary px-8 text-lg font-bold shadow-lg transition-transform hover:scale-105"
            onClick={() => handleLanguageSelect('en')}
          >
            English
          </Button>
          <Button
            size="lg"
            className="h-[60px] rounded-3xl bg-primary px-8 text-lg font-bold shadow-lg transition-transform hover:scale-105"
            onClick={() => handleLanguageSelect('es')}
          >
            Español
          </Button>
        </div>
      </div>
    </main>
  );
}
