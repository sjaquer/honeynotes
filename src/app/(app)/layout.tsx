'use client';

import { BottomNav } from '@/components/BottomNav';
import { PartnerOnboarding, usePartnerOnboarding } from '@/components/PartnerOnboarding';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { showOnboarding, completeOnboarding, skipOnboarding } = usePartnerOnboarding();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="paper-app-bg paper-noise relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-16 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 size-72 rounded-full bg-amber-200/40 blur-3xl" />

      <main className="relative z-10 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))]">{children}</main>
      <BottomNav />
      
      {/* Partner Connection Onboarding */}
      <PartnerOnboarding 
        isOpen={showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
        onClose={() => skipOnboarding()}
      />
    </div>
  );
}
