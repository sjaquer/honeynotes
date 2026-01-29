import { BottomNav } from '@/components/BottomNav';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
