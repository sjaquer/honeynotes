import { Store } from 'lucide-react';

export default function ShopPage() {
  return (
    <div className="flex flex-1 flex-col">
       <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="font-headline text-3xl font-bold text-primary">Polen Shop</h1>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <Store className="size-24 text-foreground/20" />
        <h2 className="mt-6 font-headline text-2xl">Coming Soon!</h2>
        <p className="mt-2 max-w-sm text-foreground/70">
          Spend your "Polen" here to unlock new paper colors, stamps, and other fun goodies for your letters.
        </p>
      </div>
    </div>
  );
}
