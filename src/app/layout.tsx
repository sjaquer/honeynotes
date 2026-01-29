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
import { FirebaseClientProvider } from '@/firebase';

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
  title: {
    default: 'HoneyNotes - Cartas Digitales para Parejas',
    template: '%s | HoneyNotes',
  },
  description: 'Un refugio digital para parejas. Escribe cartas personalizadas con asistencia de IA, comparte emociones profundas y fortalece tu relación con comunicación asertiva y empática.',
  keywords: ['cartas digitales', 'parejas', 'comunicación', 'amor', 'relaciones', 'escritura', 'IA', 'notas románticas', 'honeynotes'],
  authors: [{ name: 'HoneyNotes Team' }],
  creator: 'HoneyNotes',
  publisher: 'HoneyNotes',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    url: 'https://honeynotes.app',
    siteName: 'HoneyNotes',
    title: 'HoneyNotes - Cartas Digitales para Parejas',
    description: 'Escribe cartas personalizadas con asistencia de IA. Un espacio privado y acogedor para compartir notas dulces y crear recuerdos duraderos.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HoneyNotes - Cartas Digitales para Parejas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoneyNotes - Cartas Digitales para Parejas',
    description: 'Un refugio digital para parejas. Escribe cartas personalizadas con asistencia de IA.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HoneyNotes',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#DC143C" />
      </head>
      <body className={`${inter.variable} ${indieFlower.variable} ${belleza.variable} ${dancingScript.variable} ${pacifico.variable} ${caveat.variable} ${sacramento.variable} ${greatVibes.variable} ${shadowsIntoLight.variable} ${amaticSC.variable} ${permanentMarker.variable} ${satisfy.variable} ${kalam.variable} font-sans antialiased`}>
        <FirebaseClientProvider>
          <LanguageProvider>
            <div className="relative mx-auto flex min-h-screen w-full flex-col bg-background">
              {children}
            </div>
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
