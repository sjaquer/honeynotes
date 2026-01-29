'use client';

import { useState } from 'react';
import type { PaperColor, Stamp, AppFont, Letter, BorderStyle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Heart, Type, Sticker, FileText, Send, Lock, Frame } from 'lucide-react';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon';
import { AIFeedbackDialog } from './AIFeedbackDialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

const paperColors: { name: PaperColor; class: string; labelKey: string }[] = [
  { name: 'cream', class: 'bg-[#FFFDF5]', labelKey: 'letterEditor.colors.cream' },
  { name: 'pink', class: 'bg-[#FFDFE6]', labelKey: 'letterEditor.colors.rose' },
  { name: 'crimson', class: 'bg-[#FADADD]', labelKey: 'letterEditor.colors.crimson' },
  { name: 'honey', class: 'bg-[#FFF8DD]', labelKey: 'letterEditor.colors.honey' },
  { name: 'light-pink', class: 'bg-pink-100', labelKey: 'letterEditor.colors.pastel' },
  { name: 'lavender', class: 'bg-[#E6E6FA]', labelKey: 'Lavanda' },
  { name: 'mint', class: 'bg-[#E0F8E0]', labelKey: 'Menta' },
  { name: 'peach', class: 'bg-[#FFE5B4]', labelKey: 'Durazno' },
  { name: 'sky', class: 'bg-[#E0F2FE]', labelKey: 'Cielo' },
  { name: 'rose', class: 'bg-[#FFE4E1]', labelKey: 'Rosa Claro' },
];

const stamps: { name: Stamp; icon: React.ReactNode; labelKey: string }[] = [
  { name: 'heart', icon: <Heart className="size-6 fill-current" />, labelKey: 'letterEditor.stamps.heart' },
  { name: 'bee', icon: <BeeIcon className="size-6" />, labelKey: 'letterEditor.stamps.bee' },
  { name: 'wax-seal', icon: <WaxSealIcon className="size-6" />, labelKey: 'letterEditor.stamps.seal' },
  { name: 'rose-emoji', icon: <span className="text-2xl">🌹</span>, labelKey: 'Rosa' },
  { name: 'star-emoji', icon: <span className="text-2xl">⭐</span>, labelKey: 'Estrella' },
  { name: 'kiss-emoji', icon: <span className="text-2xl">💋</span>, labelKey: 'Beso' },
  { name: 'sparkle-emoji', icon: <span className="text-2xl">✨</span>, labelKey: 'Brillo' },
  { name: 'sun-emoji', icon: <span className="text-2xl">☀️</span>, labelKey: 'Sol' },
  { name: 'moon-emoji', icon: <span className="text-2xl">🌙</span>, labelKey: 'Luna' },
];

const fonts: { name: AppFont; class: string; label: string }[] = [
  { name: 'Indie_Flower', class: 'font-handwriting', label: 'Indie Flower' },
  { name: 'Belleza', class: 'font-display', label: 'Belleza' },
  { name: 'Dancing_Script', class: 'font-dancing', label: 'Dancing Script' },
  { name: 'Pacifico', class: 'font-pacifico', label: 'Pacífico' },
  { name: 'Caveat', class: 'font-caveat', label: 'Caveat' },
  { name: 'Sacramento', class: 'font-sacramento', label: 'Sacramento' },
  { name: 'Great_Vibes', class: 'font-greatvibes', label: 'Great Vibes' },
  { name: 'Shadows_Into_Light', class: 'font-shadows', label: 'Shadows' },
  { name: 'Kalam', class: 'font-kalam', label: 'Kalam' },
  { name: 'Satisfy', class: 'font-satisfy', label: 'Satisfy' },
  { name: 'Amatic_SC', class: 'font-amatic text-[1.4em]', label: 'Amatic SC' },
  { name: 'Permanent_Marker', class: 'font-permanent', label: 'Permanent Marker' },
];

const borderStyles: { name: BorderStyle; label: string; preview: string }[] = [
  { name: 'simple', label: 'Simple', preview: 'border-simple' },
  { name: 'airmail', label: 'Correo Aéreo', preview: 'airmail-border' },
  { name: 'dashed', label: 'Punteado', preview: 'border-dashed-style' },
  { name: 'floral', label: 'Floral', preview: 'border-floral' },
];

export function LetterEditor() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const { firestore } = useFirebase();
  const { user } = useUser();

  const [content, setContent] = useState('');
  const [paperColor, setPaperColor] = useState<PaperColor>('cream');
  const [stamp, setStamp] = useState<Stamp>('heart');
  const [font, setFont] = useState<AppFont>('Indie_Flower');
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('simple');
  const [hasAskedBee, setHasAskedBee] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('paper');

  const handleSend = () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión para enviar una carta.' });
        return;
    }
    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: t('letterEditor.toast.emptyLetter'),
        description: t('letterEditor.toast.emptyLetterDesc'),
      });
      return;
    }

    setIsSending(true);
    
    // For MVP, user sends letter to themselves to populate inbox.
    const newLetter = {
        senderId: user.uid,
        recipientId: user.uid, // Self-addressed for MVP
        content,
        config: { paperColor, stamp, font, borderStyle },
        createdAt: serverTimestamp(),
        status: 'sent',
        isRead: false,
        // Mock names for UI consistency
        senderName: t('users.yourLove'),
        recipientName: t('users.you'),
    }

    // Save to root /letters collection (simpler, more scalable)
    const lettersColRef = collection(firestore, 'letters');
    
    addDocumentNonBlocking(lettersColRef, newLetter)
        .then(() => {
            toast({
                title: t('letterEditor.toast.sent'),
                description: t('letterEditor.toast.sentDesc'),
            });
            router.push('/inbox');
        })
        .catch((e) => {
             console.error("Error sending letter:", e)
             toast({ variant: 'destructive', title: 'Error', description: 'No se pudo enviar la carta.' });
        })
        .finally(() => {
            setIsSending(false);
        });
  };

  const currentUserDisplayName = t('users.you');

  return (
    <div className="flex h-full flex-col gap-3 p-3 pb-28 lg:flex-row lg:gap-8 lg:p-8 lg:pb-8">
      {/* LEFT: Canvas */}
      <div className="relative flex max-h-[45vh] min-h-[40vh] flex-1 flex-col rounded-2xl bg-[#F0F4F8] p-1 shadow-inner lg:max-h-none lg:min-h-[50vh] lg:rounded-3xl">
        {/* AI Bee - Floating Button over Canvas */}
        <div className="absolute right-3 top-3 z-30 lg:right-6 lg:top-6">
          <AIFeedbackDialog
            letterContent={content}
            onFeedbackReceived={() => setHasAskedBee(true)}
          />
        </div>

        {/* Border Container with selected style */}
        <div className={cn(
           "flex flex-1 flex-col rounded-[20px] transition-colors relative overflow-hidden",
           borderStyles.find(b => b.name === borderStyle)?.preview,
           paperColors.find(p => p.name === paperColor)?.class
        )}>
             {/* Inner Paper Area */}
            <div className={cn(
                "flex flex-1 flex-col p-8 lg:p-12 relative bg-white/50 backdrop-blur-[2px]",
                 paperColors.find(p => p.name === paperColor)?.class
            )}>
                {/* Date Header */}
                <div className="mb-6 font-display text-lg text-primary/80">
                    <span>{format(new Date(), 'dd MMM yyyy', { locale: es })}</span>
                </div>

                {/* Text Area */}
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t('letterEditor.placeholder')}
                    className={cn(
                    'paper-lines flex-1 resize-none border-0 bg-transparent px-2 py-0 text-xl lg:text-2xl leading-[36px] lg:leading-[42px] text-gray-800 placeholder:text-gray-400 !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0',
                    fonts.find(f => f.name === font)?.class || 'font-handwriting'
                    )}
                    spellCheck={false}
                    style={{ 
                        minHeight: '400px',
                        maxHeight: '70vh',
                        overflow: 'auto'
                    }}
                />

                {/* Footer Signoff */}
                <div className="mt-8 flex items-end justify-between border-t-2 border-dashed border-primary/20 pt-4 font-display">
                    <div className="text-sm text-gray-500">
                        From: <span className="text-primary font-bold decoration-wavy underline">{currentUserDisplayName}</span>
                    </div>
                    {/* Stamp Display */}
                    <div className="absolute bottom-6 right-6 rotate-[-10deg] opacity-90 drop-shadow-md lg:bottom-10 lg:right-10">
                         <div className={cn("text-primary/80", stamp === 'wax-seal' ? 'text-primary' : 'text-primary/60')}>
                            {stamps.find(s => s.name === stamp)?.icon}
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT: Customization Panel */}
      <div className="flex flex-col gap-3 lg:w-[320px]">
        {/* Tools Tabs */}
        <Tabs defaultValue="paper" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid h-14 w-full grid-cols-4 rounded-2xl bg-muted/50 p-1">
                <TabsTrigger value="paper" className="rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                    <FileText className="size-5" />
                </TabsTrigger>
                <TabsTrigger value="border" className="rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                    <Frame className="size-5" />
                </TabsTrigger>
                <TabsTrigger value="stamp" className="rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                    <Sticker className="size-5" />
                </TabsTrigger>
                <TabsTrigger value="font" className="rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                    <Type className="size-5" />
                </TabsTrigger>
            </TabsList>

            <div className="mt-3 max-h-[35vh] overflow-y-auto rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-3 lg:max-h-none">
                <TabsContent value="paper" className="mt-0 grid grid-cols-2 gap-2">
                    {paperColors.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => setPaperColor(color.name)}
                            className={cn(
                                'group relative flex h-20 w-full items-center justify-center rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98]',
                                color.class,
                                paperColor === color.name
                                    ? 'border-primary shadow-md'
                                    : 'border-transparent hover:border-primary/30'
                            )}
                        >
                            <span className="font-display text-xs font-bold text-gray-700/60">{t(color.labelKey)}</span>
                            {paperColor === color.name && (
                                <div className="absolute right-1.5 top-1.5 rounded-full bg-primary p-1 text-white">
                                    <Heart className="size-2.5 fill-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </TabsContent>

                <TabsContent value="border" className="mt-0 grid grid-cols-2 gap-2">
                    {borderStyles.map((border) => (
                        <button
                            key={border.name}
                            onClick={() => setBorderStyle(border.name)}
                            className={cn(
                                'group relative flex h-20 w-full items-center justify-center rounded-xl border-2 bg-white transition-all hover:scale-[1.02] active:scale-[0.98]',
                                border.preview,
                                borderStyle === border.name
                                    ? 'shadow-md'
                                    : 'hover:border-primary/30'
                            )}
                        >
                            <span className="font-display text-xs font-bold text-gray-700">{border.label}</span>
                            {borderStyle === border.name && (
                                <div className="absolute right-1.5 top-1.5 rounded-full bg-primary p-1 text-white">
                                    <Heart className="size-2.5 fill-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </TabsContent>

                <TabsContent value="stamp" className="mt-0 grid grid-cols-3 gap-2">
                    {stamps.map((s) => (
                        <button
                            key={s.name}
                            onClick={() => setStamp(s.name)}
                            className={cn(
                                'relative flex h-20 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 bg-white transition-all hover:scale-[1.02] active:scale-[0.98]',
                                stamp === s.name
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                            )}
                        >
                            <div className="text-primary">{s.icon}</div>
                            <span className="font-display text-[10px] text-gray-500">{t(s.labelKey)}</span>
                        </button>
                    ))}
                     {/* Lock Example */}
                    <button disabled className="relative flex h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 bg-gray-50 opacity-60">
                         <Lock className="size-6 text-gray-400" />
                         <span className="font-display text-xs text-gray-400">Premium</span>
                    </button>
                </TabsContent>

                <TabsContent value="font" className="mt-0">
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="grid grid-cols-1 gap-2 p-1">
                            {fonts.map((f) => (
                                <button
                                    key={f.name}
                                    onClick={() => setFont(f.name)}
                                    className={cn(
                                        'flex h-14 w-full items-center justify-between px-5 rounded-xl border-2 bg-white transition-all hover:scale-[1.02] active:scale-[0.98]',
                                        font === f.name
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                                    )}
                                >
                                    <span className={cn("text-lg", f.class)}>{f.label}</span>
                                    {font === f.name && <Heart className="size-4 fill-primary text-primary" />}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </div>
        </Tabs>

        {/* Send Button */}
        <Button
            onClick={handleSend}
            disabled={!hasAskedBee || isSending}
            className="group h-14 w-full overflow-hidden rounded-2xl border-b-4 border-r-4 border-red-900 bg-primary text-lg font-bold text-white shadow-xl transition-all hover:translate-y-1 hover:border-b-0 hover:border-r-0 hover:shadow-none disabled:opacity-50 lg:h-16 lg:rounded-[2rem] lg:text-xl"
        >
            <span className="flex items-center gap-2">
                {isSending ? (
                     t('letterEditor.sending')
                ) : (
                    <>
                    {t('letterEditor.send')} <Send className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 lg:size-6" />
                    </>
                )}
            </span>
        </Button>
      </div>
    </div>
  );
}
