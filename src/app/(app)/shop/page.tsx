'use client';

import { useState } from 'react';
import { Store, Lock, Sparkles, Palette, Type, Crown, Check, ShoppingCart, Loader2, PlayCircle, Gift } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { cn } from '@/lib/utils';
import { useEconomy } from '@/hooks/use-economy';
import { SHOP_ITEMS, PURCHASE_PACKAGES, AD_REWARD_CONFIG, getShopItemsByCategory } from '@/lib/shop-data';
import type { ShopItem, ShopCategory, PurchasePackage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Category icons and labels
const CATEGORIES: { id: ShopCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'paperColor', label: 'Papeles', icon: <Palette className="size-4" /> },
  { id: 'stamp', label: 'Sellos', icon: '🔖' },
  { id: 'borderStyle', label: 'Bordes', icon: '🖼️' },
  { id: 'font', label: 'Fuentes', icon: <Type className="size-4" /> },
];

export default function ShopPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { 
    economy, 
    isLoading, 
    purchaseItem, 
    watchAdForReward, 
    canAfford, 
    ownsItem,
    getRemainingAds,
  } = useEconomy();

  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('paperColor');
  const [itemToPurchase, setItemToPurchase] = useState<ShopItem | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [showPurchasePackages, setShowPurchasePackages] = useState(false);

  const handlePurchase = async () => {
    if (!itemToPurchase) return;
    setIsPurchasing(true);
    
    const success = await purchaseItem(itemToPurchase);
    
    if (success) {
      toast({
        title: '¡Compra exitosa! 🎉',
        description: `Has desbloqueado "${itemToPurchase.name}"`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error en la compra',
        description: 'No se pudo completar la compra',
      });
    }
    
    setItemToPurchase(null);
    setIsPurchasing(false);
  };

  const handleWatchAd = async () => {
    setIsWatchingAd(true);
    
    // Simulate ad watching (in production, integrate real ad SDK)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = await watchAdForReward();
    
    if (result.success) {
      toast({
        title: '¡Recompensa obtenida! 🐝',
        description: `Has ganado ${result.reward} Polen`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'No hay más anuncios',
        description: 'Vuelve mañana para ver más',
      });
    }
    
    setIsWatchingAd(false);
  };

  const handleBuyJaleaReal = (pkg: PurchasePackage) => {
    // In production, integrate Stripe or other payment provider
    toast({
      title: 'Próximamente',
      description: 'Las compras estarán disponibles pronto',
    });
  };

  const remainingAds = getRemainingAds();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      {/* Header with Currency Display */}
      <header className="sticky top-0 z-10 bg-[#F0F4F8]/95 p-4 backdrop-blur-sm lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary lg:text-3xl">🏪 {t('shopPage.title')}</h1>
            <p className="text-sm text-gray-500">Personaliza tus cartas</p>
          </div>
          
          {/* Currency Display */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 shadow-sm">
              <span className="text-sm font-bold text-amber-700">{economy?.polen ?? 0}</span>
              <span className="text-base">🌼</span>
              <span className="text-xs text-amber-600">Polen</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5 shadow-sm">
              <span className="text-sm font-bold text-purple-700">{economy?.jaleaReal ?? 0}</span>
              <span className="text-base">👑</span>
              <span className="text-xs text-purple-600">Jalea</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-32 lg:p-6">
        {/* Watch Ad for Polen */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <PlayCircle className="size-6" />
              </div>
              <div>
                <h3 className="font-bold">¡Gana Polen Gratis!</h3>
                <p className="text-sm opacity-90">
                  Mira un anuncio y gana {AD_REWARD_CONFIG.rewardAmount} 🌼
                </p>
              </div>
            </div>
            <Button
              onClick={handleWatchAd}
              disabled={isWatchingAd || remainingAds <= 0}
              className="bg-white text-amber-600 hover:bg-amber-50"
            >
              {isWatchingAd ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>Ver ({remainingAds}/{AD_REWARD_CONFIG.maxAdsPerDay})</>
              )}
            </Button>
          </div>
        </div>

        {/* Buy Jalea Real */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <Crown className="size-6" />
              </div>
              <div>
                <h3 className="font-bold">Jalea Real 👑</h3>
                <p className="text-sm opacity-90">Desbloquea items premium exclusivos</p>
              </div>
            </div>
            <Button
              onClick={() => setShowPurchasePackages(true)}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <ShoppingCart className="mr-2 size-4" />
              Comprar
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ShopCategory)}>
          <TabsList className="grid w-full grid-cols-4 bg-white">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm">
                <span className="mr-1">{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {getShopItemsByCategory(cat.id).map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    isOwned={ownsItem(item)}
                    canAfford={canAfford(item)}
                    onPurchase={() => setItemToPurchase(item)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Purchase Confirmation Dialog */}
      <AlertDialog open={!!itemToPurchase} onOpenChange={(open) => !open && setItemToPurchase(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{itemToPurchase?.icon}</span>
              ¿Comprar "{itemToPurchase?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {itemToPurchase?.description}
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-100 p-3">
                <span className="font-bold">{itemToPurchase?.price}</span>
                <span>{itemToPurchase?.currency === 'polen' ? '🌼 Polen' : '👑 Jalea Real'}</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPurchasing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePurchase}
              disabled={isPurchasing || !itemToPurchase || !canAfford(itemToPurchase)}
              className="bg-primary"
            >
              {isPurchasing ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Comprar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Purchase Packages Dialog */}
      <AlertDialog open={showPurchasePackages} onOpenChange={setShowPurchasePackages}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Crown className="size-6 text-purple-500" />
              Comprar Jalea Real
            </AlertDialogTitle>
            <AlertDialogDescription>
              Elige un paquete para desbloquear items premium exclusivos
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-3 py-4">
            {PURCHASE_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleBuyJaleaReal(pkg)}
                className={cn(
                  "relative flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all hover:border-purple-400 hover:bg-purple-50",
                  pkg.isBestValue && "border-purple-500 bg-purple-50",
                  pkg.isPopular && "border-pink-400 bg-pink-50"
                )}
              >
                {pkg.isBestValue && (
                  <span className="absolute -top-2 right-2 rounded-full bg-purple-500 px-2 py-0.5 text-xs font-bold text-white">
                    MEJOR VALOR
                  </span>
                )}
                {pkg.isPopular && !pkg.isBestValue && (
                  <span className="absolute -top-2 right-2 rounded-full bg-pink-500 px-2 py-0.5 text-xs font-bold text-white">
                    POPULAR
                  </span>
                )}
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{pkg.name}</span>
                    {pkg.bonusPercent && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-700">
                        +{pkg.bonusPercent}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-purple-600">
                    <span className="text-lg font-bold">{pkg.jaleaReal}</span>
                    <span className="text-sm">👑</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-800">${pkg.priceUSD}</span>
                  <span className="text-sm text-gray-500"> USD</span>
                </div>
              </button>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Shop Item Card Component
function ShopItemCard({ 
  item, 
  isOwned, 
  canAfford, 
  onPurchase 
}: { 
  item: ShopItem; 
  isOwned: boolean; 
  canAfford: boolean;
  onPurchase: () => void;
}) {
  return (
    <div 
      className={cn(
        "relative rounded-xl border-2 bg-white p-3 shadow-sm transition-all",
        isOwned && "border-green-400 bg-green-50",
        item.isPremium && !isOwned && "border-purple-300",
        !isOwned && !item.isPremium && "border-gray-200 hover:border-primary/50"
      )}
    >
      {/* Owned badge */}
      {isOwned && (
        <div className="absolute -right-1 -top-1 rounded-full bg-green-500 p-1">
          <Check className="size-3 text-white" />
        </div>
      )}

      {/* Premium badge */}
      {item.isPremium && !isOwned && (
        <div className="absolute -right-1 -top-1 rounded-full bg-purple-500 p-1">
          <Crown className="size-3 text-white" />
        </div>
      )}

      {/* Item display */}
      <div className="mb-2 flex justify-center text-3xl">
        {item.icon}
      </div>

      <h4 className="text-center text-sm font-semibold text-gray-800 line-clamp-1">
        {item.name}
      </h4>

      {/* Price or owned status */}
      {isOwned ? (
        <div className="mt-2 text-center text-xs font-medium text-green-600">
          ✓ Desbloqueado
        </div>
      ) : item.isDefault ? (
        <div className="mt-2 text-center text-xs font-medium text-gray-500">
          Gratis
        </div>
      ) : (
        <Button
          size="sm"
          variant={canAfford ? "default" : "outline"}
          className={cn(
            "mt-2 w-full text-xs",
            !canAfford && "opacity-60"
          )}
          onClick={onPurchase}
          disabled={!canAfford}
        >
          {item.price} {item.currency === 'polen' ? '🌼' : '👑'}
        </Button>
      )}
    </div>
  );
}
