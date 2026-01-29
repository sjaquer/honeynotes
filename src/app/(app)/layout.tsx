import { BottomNav } from '@/components/BottomNav';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F0F4F8]">
      <main className="flex-1 pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}
