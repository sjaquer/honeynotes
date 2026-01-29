'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/inbox');
    }
  }, [user, isUserLoading, router]);

  const handleAnonymousSignIn = () => {
    initiateAnonymousSignIn(auth);
  };
  
  if (isUserLoading || user) {
    return (
       <div className="flex h-screen flex-col items-center justify-center bg-secondary/30 text-center">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="mt-4 font-handwriting text-xl text-foreground/80">
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-secondary/30 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <Heart className="size-20 text-primary" fill="currentColor" />
        <h1 className="font-display text-6xl font-bold text-primary">
          HoneyNotes
        </h1>
        <p className="max-w-md font-body text-lg text-foreground/80">
          {t('landing.description')}
        </p>
      </div>
      <div className="mt-12">
        <Button
          size="lg"
          className="h-[60px] rounded-3xl bg-primary px-8 text-lg font-bold shadow-lg transition-transform hover:scale-105"
          onClick={handleAnonymousSignIn}
          disabled={isUserLoading}
        >
          {isUserLoading ? (
            <Loader2 className="mr-2 size-5 animate-spin" />
          ) : (
            t('landing.cta')
          )}
        </Button>
      </div>
    </main>
  );
}
