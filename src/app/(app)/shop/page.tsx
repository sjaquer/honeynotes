'use client';

import { Store, Lock, Sparkles, Palette, Type, Crown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { cn } from '@/lib/utils';

const premiumItems = [
  { icon: Palette, label: 'Colores Premium', pollen: 500 },
  { icon: Type, label: 'Tipografías Exclusivas', pollen: 350 },
  { icon: Crown, label: 'Sellos Dorados', pollen: 250 },
  { icon: Sparkles, label: 'Efectos Especiales', pollen: 400 },
];

export default function ShopPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-[#F0F4F8]/95 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-bold text-primary drop-shadow-sm">{t('shopPage.title')}</h1>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="font-display text-sm font-bold text-gray-600">120</span>
            <BeeIcon className="size-5 text-accent" />
          </div>
        </div>
        <p className="font-handwriting text-xl text-gray-600">
          {t('shopPage.description')}
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Premium Banner */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 to-primary p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-4">
              <Crown className="size-10" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">HoneyNotes Premium</h2>
              <p className="font-handwriting text-lg opacity-90">Desbloquea todo el contenido exclusivo</p>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {premiumItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white/80 p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/5"></div>
              <div className="relative flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <item.icon className="size-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-gray-800">{item.label}</h3>
                  <div className="flex items-center gap-1 font-handwriting text-gray-500">
                    <span>{item.pollen}</span>
                    <BeeIcon className="size-4 text-accent" />
                  </div>
                </div>
                <Lock className="size-5 text-gray-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 rounded-2xl bg-white/50 p-6 text-center">
          <Sparkles className="mx-auto size-12 text-accent/50" />
          <p className="mt-4 font-handwriting text-xl text-gray-500">
            {t('shopPage.comingSoon')}
          </p>
        </div>
      </div>
    </div>
  );
}
