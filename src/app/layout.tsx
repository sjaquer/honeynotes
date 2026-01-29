import type { Metadata } from 'next';
import { 
  Belleza, 
  Indie_Flower, 
  Inter,
  Dancing_Script,
  Pacifico,
  Caveat,
  Sacramento,
  Great_Vibes,
  Shadows_Into_Light,
  Amatic_SC,
  Permanent_Marker,
  Satisfy,
  Kalam
} from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/use-translation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const indieFlower = Indie_Flower({ weight: '400', subsets: ['latin'], variable: '--font-indie' });
const belleza = Belleza({ weight: '400', subsets: ['latin'], variable: '--font-belleza' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing' });
const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });
const sacramento = Sacramento({ weight: '400', subsets: ['latin'], variable: '--font-sacramento' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], variable: '--font-greatvibes' });
const shadowsIntoLight = Shadows_Into_Light({ weight: '400', subsets: ['latin'], variable: '--font-shadows' });
const amaticSC = Amatic_SC({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-amatic' });
const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-permanent' });
const satisfy = Satisfy({ weight: '400', subsets: ['latin'], variable: '--font-satisfy' });
const kalam = Kalam({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-kalam' });

export const metadata: Metadata = {
  title: 'HoneyNotes',
  description: 'A sweet way to connect.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${indieFlower.variable} ${belleza.variable} ${dancingScript.variable} ${pacifico.variable} ${caveat.variable} ${sacramento.variable} ${greatVibes.variable} ${shadowsIntoLight.variable} ${amaticSC.variable} ${permanentMarker.variable} ${satisfy.variable} ${kalam.variable} font-sans antialiased`}>
        <LanguageProvider>
          <div className="relative mx-auto flex min-h-screen w-full flex-col bg-background">
            {children}
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
