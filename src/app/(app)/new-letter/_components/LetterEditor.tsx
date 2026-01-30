'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PaperColor, Stamp, AppFont, Letter, BorderStyle } from '@/lib/types';
import { ANIMATED_BORDERS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Heart, Type, Sticker, FileText, Send, Lock, Frame, Edit3, Crown } from 'lucide-react';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon';
import { AIFeedbackDialog } from './AIFeedbackDialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFirebase, useUser, useMemoFirebase, useDoc } from '@/firebase';
import { collection, serverTimestamp, doc, addDoc } from 'firebase/firestore';
import type { UserProfile } from '@/hooks/use-partner-link';
import { useEconomy } from '@/hooks/use-economy';
import { SHOP_ITEMS } from '@/lib/shop-data';
import Link from 'next/link';

// Key for localStorage draft
const DRAFT_STORAGE_KEY = 'honeynotes_letter_draft';

interface LetterDraft {
  content: string;
  letterTitle: string;
  senderName: string;
  recipientName: string;
  paperColor: PaperColor;
  stamp: Stamp;
  font: AppFont;
  borderStyle: BorderStyle;
  savedAt: number;
}

const paperColors: { name: PaperColor; class: string; labelKey: string }[] = [
  // Free colors
  { name: 'cream', class: 'bg-[#FFFDF5]', labelKey: 'Crema' },
  { name: 'pink', class: 'bg-[#FFDFE6]', labelKey: 'Rosa' },
  { name: 'honey', class: 'bg-[#FFF8DD]', labelKey: 'Miel' },
  // Polen colors
  { name: 'lavender', class: 'bg-[#E6E6FA]', labelKey: 'Lavanda' },
  { name: 'mint', class: 'bg-[#E0F8E0]', labelKey: 'Menta' },
  { name: 'light-pink', class: 'bg-pink-100', labelKey: 'Rosa Pastel' },
  { name: 'crimson', class: 'bg-[#FADADD]', labelKey: 'Carmesí' },
  { name: 'peach', class: 'bg-[#FFE5B4]', labelKey: 'Durazno' },
  { name: 'sky', class: 'bg-[#E0F2FE]', labelKey: 'Cielo' },
  { name: 'rose', class: 'bg-[#FFE4E1]', labelKey: 'Rosa Claro' },
  // Premium colors
  { name: 'sunset', class: 'bg-gradient-to-br from-orange-100 to-pink-100', labelKey: 'Atardecer' },
  { name: 'ocean', class: 'bg-gradient-to-br from-blue-100 to-teal-100', labelKey: 'Océano' },
  { name: 'aurora', class: 'bg-gradient-to-br from-purple-100 to-green-100', labelKey: 'Aurora' },
  { name: 'rose-gold', class: 'bg-gradient-to-br from-rose-100 to-amber-50', labelKey: 'Oro Rosa' },
  { name: 'champagne', class: 'bg-[#F7E7CE]', labelKey: 'Champagne' },
  { name: 'moonlight', class: 'bg-gradient-to-br from-slate-100 to-indigo-100', labelKey: 'Luz de Luna' },
  { name: 'cherry-blossom', class: 'bg-gradient-to-br from-pink-100 to-rose-50', labelKey: 'Flor de Cerezo' },
];

const stamps: { name: Stamp; icon: React.ReactNode; labelKey: string }[] = [
  // Free stamps
  { name: 'heart', icon: <Heart className="size-6 fill-current" />, labelKey: 'Corazón' },
  { name: 'bee', icon: <span className="text-2xl">🐝</span>, labelKey: 'Abejita' },
  { name: 'wax-seal', icon: <WaxSealIcon className="size-6" />, labelKey: 'Sello' },
  // Polen stamps
  { name: 'rose-emoji', icon: <span className="text-2xl">🌹</span>, labelKey: 'Rosa' },
  { name: 'star-emoji', icon: <span className="text-2xl">⭐</span>, labelKey: 'Estrella' },
  { name: 'butterfly-emoji', icon: <span className="text-2xl">🦋</span>, labelKey: 'Mariposa' },
  { name: 'flower-emoji', icon: <span className="text-2xl">🌺</span>, labelKey: 'Flor' },
  { name: 'rainbow-emoji', icon: <span className="text-2xl">🌈</span>, labelKey: 'Arcoíris' },
  { name: 'kiss-emoji', icon: <span className="text-2xl">💋</span>, labelKey: 'Beso' },
  { name: 'sparkle-emoji', icon: <span className="text-2xl">✨</span>, labelKey: 'Brillo' },
  { name: 'sun-emoji', icon: <span className="text-2xl">☀️</span>, labelKey: 'Sol' },
  { name: 'fire-emoji', icon: <span className="text-2xl">🔥</span>, labelKey: 'Fuego' },
  { name: 'cupid-emoji', icon: <span className="text-2xl">💘</span>, labelKey: 'Cupido' },
  { name: 'infinity-emoji', icon: <span className="text-2xl">♾️</span>, labelKey: 'Infinito' },
  { name: 'ring-emoji', icon: <span className="text-2xl">💍</span>, labelKey: 'Anillo' },
  // Premium stamps
  { name: 'moon-emoji', icon: <span className="text-2xl">🌙</span>, labelKey: 'Luna' },
  { name: 'crown-emoji', icon: <span className="text-2xl">👑</span>, labelKey: 'Corona' },
  { name: 'diamond-emoji', icon: <span className="text-2xl">💎</span>, labelKey: 'Diamante' },
  { name: 'angel-emoji', icon: <span className="text-2xl">👼</span>, labelKey: 'Ángel' },
  { name: 'dove-emoji', icon: <span className="text-2xl">🕊️</span>, labelKey: 'Paloma' },
  { name: 'teddy-emoji', icon: <span className="text-2xl">🧸</span>, labelKey: 'Osito' },
  { name: 'lovebirds-emoji', icon: <span className="text-2xl">🐦</span>, labelKey: 'Tortolitos' },
  { name: 'shooting-star-emoji', icon: <span className="text-2xl">🌠</span>, labelKey: 'Fugaz' },
];

const fonts: { name: AppFont; class: string; label: string }[] = [
  // Free fonts
  { name: 'Indie_Flower', class: 'font-handwriting', label: 'Indie Flower' },
  { name: 'Belleza', class: 'font-display', label: 'Belleza' },
  // Polen fonts - Tier 1
  { name: 'Caveat', class: 'font-caveat', label: 'Caveat' },
  { name: 'Amatic_SC', class: 'font-amatic text-[1.4em]', label: 'Amatic SC' },
  { name: 'Shadows_Into_Light', class: 'font-shadows', label: 'Shadows' },
  { name: 'Patrick_Hand', class: 'font-patrick', label: 'Patrick Hand' },
  { name: 'Architects_Daughter', class: 'font-architects', label: 'Architects' },
  // Polen fonts - Tier 2
  { name: 'Dancing_Script', class: 'font-dancing', label: 'Dancing Script' },
  { name: 'Pacifico', class: 'font-pacifico', label: 'Pacífico' },
  { name: 'Permanent_Marker', class: 'font-permanent', label: 'Permanent' },
  { name: 'Sacramento', class: 'font-sacramento', label: 'Sacramento' },
  { name: 'Satisfy', class: 'font-satisfy', label: 'Satisfy' },
  { name: 'Cookie', class: 'font-cookie', label: 'Cookie' },
  { name: 'Courgette', class: 'font-courgette', label: 'Courgette' },
  { name: 'Lobster', class: 'font-lobster', label: 'Lobster' },
  // Premium fonts
  { name: 'Great_Vibes', class: 'font-greatvibes', label: 'Great Vibes' },
  { name: 'Kalam', class: 'font-kalam', label: 'Kalam' },
  { name: 'Allura', class: 'font-allura', label: 'Allura' },
  { name: 'Tangerine', class: 'font-tangerine text-[1.3em]', label: 'Tangerine' },
  { name: 'Alex_Brush', class: 'font-alexbrush', label: 'Alex Brush' },
  { name: 'Mr_Dafoe', class: 'font-mrdafoe', label: 'Mr Dafoe' },
];

const borderStyles: { name: BorderStyle; label: string; preview: string }[] = [
  // Free border
  { name: 'simple', label: 'Simple', preview: 'border-simple' },
  // Polen borders
  { name: 'dashed', label: 'Punteado', preview: 'border-dashed-style' },
  { name: 'airmail', label: 'Correo Aéreo', preview: 'airmail-border' },
  { name: 'hearts', label: 'Corazones', preview: 'border-hearts' },
  { name: 'stars', label: 'Estrellas', preview: 'border-stars' },
  { name: 'waves', label: 'Ondas', preview: 'border-waves' },
  { name: 'ribbon', label: 'Listón', preview: 'border-ribbon' },
  // Premium borders
  { name: 'floral', label: 'Floral', preview: 'border-floral' },
  { name: 'vintage', label: 'Vintage', preview: 'border-vintage' },
  { name: 'ornate', label: 'Ornamentado', preview: 'border-ornate' },
  { name: 'gold', label: 'Dorado', preview: 'border-gold' },
  { name: 'lace', label: 'Encaje', preview: 'border-lace' },
];

export function LetterEditor() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { trackLetterSent, economy, ownsItem } = useEconomy();

  // Helper functions to check ownership
  const ownsPaperColor = (colorId: PaperColor) => {
    const item = SHOP_ITEMS.find(i => i.category === 'paperColor' && i.itemId === colorId);
    return item ? ownsItem(item) : false;
  };
  
  const ownsStamp = (stampId: Stamp) => {
    const item = SHOP_ITEMS.find(i => i.category === 'stamp' && i.itemId === stampId);
    return item ? ownsItem(item) : false;
  };
  
  const ownsFont = (fontId: AppFont) => {
    const item = SHOP_ITEMS.find(i => i.category === 'font' && i.itemId === fontId);
    return item ? ownsItem(item) : false;
  };
  
  const ownsBorder = (borderId: BorderStyle) => {
    const item = SHOP_ITEMS.find(i => i.category === 'borderStyle' && i.itemId === borderId);
    return item ? ownsItem(item) : false;
  };

  const isPremiumItem = (category: string, itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.category === category && i.itemId === itemId);
    return item?.isPremium || false;
  };

  // Get user profile to check if they have a partner
  const userRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userProfile } = useDoc<UserProfile>(userRef);

  const [content, setContent] = useState('');
  const [letterTitle, setLetterTitle] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [paperColor, setPaperColor] = useState<PaperColor>('cream');
  const [stamp, setStamp] = useState<Stamp>('heart');
  const [font, setFont] = useState<AppFont>('Indie_Flower');
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('simple');
  const [hasAskedBee, setHasAskedBee] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('paper');
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Check if border is animated (premium)
  const isAnimatedBorder = ANIMATED_BORDERS.includes(borderStyle);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (draftLoaded) return;
    
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const draft: LetterDraft = JSON.parse(savedDraft);
        // Only load if draft is less than 7 days old
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - draft.savedAt < sevenDaysMs) {
          setContent(draft.content || '');
          setLetterTitle(draft.letterTitle || '');
          if (draft.senderName) setSenderName(draft.senderName);
          if (draft.recipientName) setRecipientName(draft.recipientName);
          setPaperColor(draft.paperColor || 'cream');
          setStamp(draft.stamp || 'heart');
          setFont(draft.font || 'Indie_Flower');
          setBorderStyle(draft.borderStyle || 'simple');
        }
      }
    } catch (e) {
      console.error('Error loading draft:', e);
    }
    setDraftLoaded(true);
  }, [draftLoaded]);

  // Save draft to localStorage whenever content changes
  const saveDraft = useCallback(() => {
    // Only save if there's actual content
    if (!content.trim() && !letterTitle.trim()) {
      return;
    }
    
    const draft: LetterDraft = {
      content,
      letterTitle,
      senderName,
      recipientName,
      paperColor,
      stamp,
      font,
      borderStyle,
      savedAt: Date.now(),
    };
    
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.error('Error saving draft:', e);
    }
  }, [content, letterTitle, senderName, recipientName, paperColor, stamp, font, borderStyle]);

  // Auto-save draft with debounce
  useEffect(() => {
    if (!draftLoaded) return;
    
    const timeoutId = setTimeout(() => {
      saveDraft();
    }, 500); // Save 500ms after last change
    
    return () => clearTimeout(timeoutId);
  }, [saveDraft, draftLoaded]);

  // Clear draft after successful send
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing draft:', e);
    }
  }, []);

  // Check if user has a linked partner
  const hasPartner = Boolean(userProfile?.partnerId);
  
  // Set default names when user profile loads
  useEffect(() => {
    if (user && !senderName) {
      setSenderName(user.displayName || userProfile?.displayName || t('users.you'));
    }
    if (userProfile && !recipientName) {
      setRecipientName(userProfile.partnerName || t('users.yourLove'));
    }
  }, [user, userProfile, senderName, recipientName, t]);

  const handleSend = async () => {
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
    
    // If user has partner, send to partner. Otherwise self-addressed for testing.
    const recipientId = userProfile?.partnerId || user.uid;

    const newLetter = {
        senderId: user.uid,
        recipientId: recipientId,
        title: letterTitle.trim() || null,
        content: content.trim(),
        config: { 
          paperColor: paperColor || 'cream', 
          stamp: stamp || 'heart', 
          font: font || 'Indie_Flower', 
          borderStyle: borderStyle || 'simple' 
        },
        createdAt: serverTimestamp(),
        status: 'sent',
        isRead: false,
        senderName: senderName || 'Tú',
        recipientName: recipientName || 'Tu Amor',
    };

    // Save to root /letters collection
    const lettersColRef = collection(firestore, 'letters');
    
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 15000)
      );
      
      await Promise.race([
        addDoc(lettersColRef, newLetter),
        timeoutPromise
      ]);
      
      // Clear draft after successful send
      clearDraft();
      
      // Track letter sent in background (don't wait)
      trackLetterSent({ paperColor, stamp });
      
      toast({
        title: t('letterEditor.toast.sent'),
        description: t('letterEditor.toast.sentDesc'),
      });
      
      router.push('/inbox');
    } catch (e: any) {
      console.error("Error sending letter:", e);
      
      let errorMessage = 'No se pudo enviar la carta.';
      if (e?.message === 'Timeout') {
        errorMessage = 'La conexión tardó demasiado. Verifica tu internet.';
      } else if (e?.code === 'permission-denied') {
        errorMessage = 'No tienes permisos para enviar cartas.';
      }
      
      toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    } finally {
      setIsSending(false);
    }
  };

  const currentUserDisplayName = t('users.you');

  return (
    <div className="flex h-full flex-col gap-2 p-3 pb-28 lg:flex-row lg:gap-8 lg:p-8 lg:pb-8">
      {/* LEFT: Canvas */}
      <div className="relative flex h-[40vh] shrink-0 flex-col rounded-2xl bg-[#F0F4F8] p-1 shadow-inner lg:h-auto lg:flex-1 lg:rounded-3xl">
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
           paperColors.find(p => p.name === paperColor)?.class,
           isAnimatedBorder && "animated"
        )}>
             {/* Inner Paper Area */}
            <div className={cn(
                "flex flex-1 flex-col p-6 lg:p-10 relative bg-white/50 backdrop-blur-[2px]",
                 paperColors.find(p => p.name === paperColor)?.class
            )}>
                {/* Letter Header: Title & To */}
                <div className="mb-4 space-y-2">
                    {/* Title (optional) */}
                    <Input
                        value={letterTitle}
                        onChange={(e) => setLetterTitle(e.target.value)}
                        placeholder={t('letterEditor.titlePlaceholder')}
                        className={cn(
                            'border-0 bg-transparent px-0 text-2xl lg:text-3xl font-bold text-primary placeholder:text-primary/40 !ring-0 !ring-offset-0 focus:!ring-0',
                            fonts.find(f => f.name === font)?.class || 'font-handwriting'
                        )}
                    />
                    {/* To: Recipient Name */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t('letterEditor.to')}:</span>
                        <Input
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder={t('users.yourLove')}
                            className="h-7 w-auto min-w-[100px] max-w-[200px] border-0 border-b border-dashed border-primary/30 bg-transparent px-1 py-0 text-sm font-semibold text-primary placeholder:text-primary/40 !ring-0 focus:border-primary"
                        />
                    </div>
                    {/* Date */}
                    <div className="font-display text-xs text-gray-400">
                        {format(new Date(), 'dd MMM yyyy', { locale: es })}
                    </div>
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
                        minHeight: '150px',
                        overflow: 'auto'
                    }}
                />

                {/* Footer Signoff */}
                <div className="mt-6 flex items-end justify-between border-t-2 border-dashed border-primary/20 pt-4 font-display">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t('letterEditor.from')}:</span>
                        <Input
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder={t('users.you')}
                            className="h-7 w-auto min-w-[80px] max-w-[180px] border-0 border-b border-dashed border-primary/30 bg-transparent px-1 py-0 text-sm font-bold text-primary decoration-wavy placeholder:text-primary/40 !ring-0 focus:border-primary"
                        />
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
      <div className="flex flex-1 flex-col gap-2 overflow-hidden lg:w-[320px] lg:flex-none">
        {/* Tools Tabs */}
        <Tabs defaultValue="paper" className="flex flex-1 flex-col overflow-hidden w-full" onValueChange={setActiveTab}>
            <TabsList className="grid h-14 w-full shrink-0 grid-cols-4 rounded-2xl bg-muted/50 p-1">
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

            <div className="mt-2 flex-1 overflow-y-auto rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-3">
                <TabsContent value="paper" className="mt-0 grid grid-cols-2 gap-2">
                    {paperColors.map((color) => {
                        const owned = ownsPaperColor(color.name);
                        const isPremium = isPremiumItem('paperColor', color.name);
                        
                        return (
                            <button
                                key={color.name}
                                onClick={() => owned ? setPaperColor(color.name) : null}
                                disabled={!owned}
                                className={cn(
                                    'group relative flex h-20 w-full items-center justify-center rounded-xl border-2 transition-all',
                                    color.class,
                                    owned && 'hover:scale-[1.02] active:scale-[0.98]',
                                    !owned && 'opacity-50 cursor-not-allowed grayscale',
                                    paperColor === color.name && owned
                                        ? 'border-primary shadow-md'
                                        : owned ? 'border-transparent hover:border-primary/30' : 'border-gray-200'
                                )}
                            >
                                <span className="font-display text-xs font-bold text-gray-700/60">{t(color.labelKey)}</span>
                                {paperColor === color.name && owned && (
                                    <div className="absolute right-1.5 top-1.5 rounded-full bg-primary p-1 text-white">
                                        <Heart className="size-2.5 fill-white" />
                                    </div>
                                )}
                                {!owned && (
                                    <div className="absolute right-1.5 top-1.5 rounded-full bg-gray-400 p-1 text-white">
                                        {isPremium ? <Crown className="size-2.5" /> : <Lock className="size-2.5" />}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                    <Link 
                        href="/shop" 
                        className="flex h-20 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition-all hover:border-primary hover:bg-primary/10"
                    >
                        <span className="text-lg">🛒</span>
                        <span className="font-display text-xs font-bold text-primary">Ver Tienda</span>
                    </Link>
                </TabsContent>

                <TabsContent value="border" className="mt-0 grid grid-cols-2 gap-2">
                    {borderStyles.map((border) => {
                        const owned = ownsBorder(border.name);
                        const isPremium = isPremiumItem('borderStyle', border.name);
                        
                        return (
                            <button
                                key={border.name}
                                onClick={() => owned ? setBorderStyle(border.name) : null}
                                disabled={!owned}
                                className={cn(
                                    'group relative flex h-20 w-full items-center justify-center rounded-xl border-2 bg-white transition-all',
                                    border.preview,
                                    owned && 'hover:scale-[1.02] active:scale-[0.98]',
                                    !owned && 'opacity-50 cursor-not-allowed grayscale',
                                    borderStyle === border.name && owned
                                        ? 'shadow-md'
                                        : owned ? 'hover:border-primary/30' : ''
                                )}
                            >
                                <span className="font-display text-xs font-bold text-gray-700">{border.label}</span>
                                {borderStyle === border.name && owned && (
                                    <div className="absolute right-1.5 top-1.5 rounded-full bg-primary p-1 text-white">
                                        <Heart className="size-2.5 fill-white" />
                                    </div>
                                )}
                                {!owned && (
                                    <div className="absolute right-1.5 top-1.5 rounded-full bg-gray-400 p-1 text-white">
                                        {isPremium ? <Crown className="size-2.5" /> : <Lock className="size-2.5" />}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                    <Link 
                        href="/shop" 
                        className="flex h-20 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition-all hover:border-primary hover:bg-primary/10"
                    >
                        <span className="text-lg">🛒</span>
                        <span className="font-display text-xs font-bold text-primary">Ver Tienda</span>
                    </Link>
                </TabsContent>

                <TabsContent value="stamp" className="mt-0 grid grid-cols-3 gap-2">
                    {stamps.map((s) => {
                        const owned = ownsStamp(s.name);
                        const isPremium = isPremiumItem('stamp', s.name);
                        
                        return (
                            <button
                                key={s.name}
                                onClick={() => owned ? setStamp(s.name) : null}
                                disabled={!owned}
                                className={cn(
                                    'relative flex h-20 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 bg-white transition-all',
                                    owned && 'hover:scale-[1.02] active:scale-[0.98]',
                                    !owned && 'opacity-50 cursor-not-allowed grayscale',
                                    stamp === s.name && owned
                                        ? 'border-primary bg-primary/5 shadow-md'
                                        : owned ? 'border-gray-100 hover:border-primary/30 hover:bg-gray-50' : 'border-gray-200'
                                )}
                            >
                                <div className={cn("text-primary", !owned && "opacity-50")}>{s.icon}</div>
                                <span className="font-display text-[10px] text-gray-500">{t(s.labelKey)}</span>
                                {!owned && (
                                    <div className="absolute right-1 top-1 rounded-full bg-gray-400 p-0.5 text-white">
                                        {isPremium ? <Crown className="size-2.5" /> : <Lock className="size-2.5" />}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                    <Link 
                        href="/shop" 
                        className="flex h-20 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition-all hover:border-primary hover:bg-primary/10"
                    >
                        <span className="text-lg">🛒</span>
                        <span className="font-display text-[10px] font-bold text-primary">Tienda</span>
                    </Link>
                </TabsContent>

                <TabsContent value="font" className="mt-0">
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="grid grid-cols-1 gap-2 p-1">
                            {fonts.map((f) => {
                                const owned = ownsFont(f.name);
                                const isPremium = isPremiumItem('font', f.name);
                                
                                return (
                                    <button
                                        key={f.name}
                                        onClick={() => owned ? setFont(f.name) : null}
                                        disabled={!owned}
                                        className={cn(
                                            'flex h-14 w-full items-center justify-between px-5 rounded-xl border-2 bg-white transition-all',
                                            owned && 'hover:scale-[1.02] active:scale-[0.98]',
                                            !owned && 'opacity-50 cursor-not-allowed',
                                            font === f.name && owned
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : owned ? 'border-gray-100 hover:border-primary/30 hover:bg-gray-50' : 'border-gray-200'
                                        )}
                                    >
                                        <span className={cn("text-lg", f.class, !owned && "opacity-50")}>{f.label}</span>
                                        {font === f.name && owned && <Heart className="size-4 fill-primary text-primary" />}
                                        {!owned && (
                                            <div className="flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                                                {isPremium ? <Crown className="size-3" /> : <Lock className="size-3" />}
                                                <span>{isPremium ? 'Premium' : 'Bloqueado'}</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                            <Link 
                                href="/shop" 
                                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition-all hover:border-primary hover:bg-primary/10"
                            >
                                <span className="text-lg">🛒</span>
                                <span className="font-display text-sm font-bold text-primary">Ver más en la Tienda</span>
                            </Link>
                        </div>
                    </ScrollArea>
                </TabsContent>
            </div>
        </Tabs>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={isSending}
          className="group h-14 w-full shrink-0 overflow-hidden rounded-2xl border-b-4 border-r-4 border-red-900 bg-primary text-lg font-bold text-white shadow-xl transition-all hover:translate-y-1 hover:border-b-0 hover:border-r-0 hover:shadow-none disabled:opacity-50 lg:h-16 lg:rounded-[2rem] lg:text-xl"
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
