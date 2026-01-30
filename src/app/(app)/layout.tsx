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
    <div className="flex min-h-screen flex-col bg-[#F0F4F8]">
      <main className="flex-1 pb-28">{children}</main>
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
