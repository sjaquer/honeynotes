'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Link2, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePartnerLink, type UserProfile } from '@/hooks/use-partner-link';
import { useUser, useFirebase, useMemoFirebase, useDoc } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { useToast } from '@/hooks/use-toast';

interface PartnerOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const TOTAL_STEPS = 4;

export function PartnerOnboarding({ onComplete, onSkip, isOpen = true, onClose }: PartnerOnboardingProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { generateMyCode, linkWithPartner, formatPartnerCode, isLoading, error: partnerLinkError } = usePartnerLink();
  
  const [step, setStep] = useState(1);
  const [myCode, setMyCode] = useState<string | null>(null);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  const formatCodeInput = (raw: string): string => {
    const cleaned = raw.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6);
    return cleaned.length > 3 ? `${cleaned.slice(0, 3)}-${cleaned.slice(3)}` : cleaned;
  };

  const userRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc<UserProfile>(userRef);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (profile?.partnerId) {
      onComplete?.();
      onClose?.();
    }
  }, [profile, onComplete, onClose]);

  useEffect(() => {
    if (profile?.partnerCode) {
      setMyCode(profile.partnerCode);
    }
  }, [profile]);

  useEffect(() => {
    if (partnerLinkError) {
      setLinkError(partnerLinkError);
    }
  }, [partnerLinkError]);

  const handleClose = () => {
    onComplete?.();
    onClose?.();
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    const code = await generateMyCode();
    if (code) {
      setMyCode(code);
    }
    setIsGenerating(false);
  };

  const handleCopyCode = async () => {
    if (myCode) {
      await navigator.clipboard.writeText(formatPartnerCode(myCode));
      setCopied(true);
      toast({ title: '¡Código copiado!' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkPartner = async () => {
    setLinkError(null);
    const success = await linkWithPartner(formatCodeInput(partnerCodeInput));
    if (success) {
      toast({ 
        title: '🎉 ¡Conectados!', 
        description: 'Ya pueden enviarse cartas de amor' 
      });
      handleClose();
    } else {
      setLinkError('Código inválido o expirado');
    }
  };

  const handlePasteCode = async () => {
    setIsPasting(true);
    try {
      const text = await navigator.clipboard.readText();
      setPartnerCodeInput(formatCodeInput(text));
      setLinkError(null);
    } catch {
      setLinkError('No se pudo leer el portapapeles. Pega el codigo manualmente.');
    } finally {
      setIsPasting(false);
    }
  };

  const handleSkip = async () => {
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        onboardingSeen: true,
        updatedAt: serverTimestamp(),
      });
    }
    onSkip?.();
    handleClose();
  };

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div 
        className={cn(
          "relative w-full max-w-md bg-background rounded-[32px] shadow-crimson-deep overflow-hidden transition-all duration-300",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        <button 
          onClick={handleSkip}
          className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-muted transition-colors active:scale-95"
          aria-label="Omitir"
        >
          <X className="size-5 text-muted-foreground" />
        </button>

        <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="p-8 pt-12 min-h-[420px]">
          {step === 1 && <StepWelcome />}
          {step === 2 && <StepExplain />}
          {step === 3 && (
            <StepGenerateCode 
              myCode={myCode}
              copied={copied}
              isGenerating={isGenerating}
              onGenerate={handleGenerateCode}
              onCopy={handleCopyCode}
              formatCode={formatPartnerCode}
            />
          )}
          {step === 4 && (
            <StepLinkPartner
              partnerCodeInput={partnerCodeInput}
              setPartnerCodeInput={setPartnerCodeInput}
              linkError={linkError}
              isLoading={isLoading}
              isPasting={isPasting}
              onLink={handleLinkPartner}
              onPaste={handlePasteCode}
              formatCodeInput={formatCodeInput}
            />
          )}
        </div>

        <div className="flex items-center justify-between p-6 pt-0">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1}
            className={cn(step === 1 && 'invisible')}
          >
            <ChevronLeft className="size-4 mr-1" />
            Anterior
          </Button>

          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i + 1 === step ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>

          {step < TOTAL_STEPS ? (
            <Button onClick={nextStep}>
              Siguiente
              <ChevronRight className="size-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSkip} variant="outline">
              Terminar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepWelcome() {
  return (
    <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-center">
        <div className="relative">
          <BeeIcon size="2xl" />
          <div className="absolute -right-2 -top-2 animate-pulse">
            <Sparkles className="size-6 text-amber-400" />
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-display font-bold text-foreground">
          ¡Bienvenido a HoneyNotes! 🍯
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Tu nuevo espacio para enviar cartas de amor digitales a esa persona especial.
        </p>
      </div>

      <div className="flex justify-center gap-2 pt-4">
        <Heart className="size-5 text-primary fill-primary animate-pulse" />
        <Heart className="size-5 text-primary fill-primary animate-pulse [animation-delay:200ms]" />
        <Heart className="size-5 text-primary fill-primary animate-pulse [animation-delay:400ms]" />
      </div>
    </div>
  );
}

function StepExplain() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Link2 className="size-10 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-display font-bold">
          Conecta con tu Pareja
        </h2>
        <p className="text-muted-foreground">
          Para enviarse cartas, necesitan conectar sus cuentas.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-start gap-4 p-4 rounded-[20px] bg-muted/50 transition-all hover:bg-muted/70">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <p className="font-medium">Genera tu código único</p>
            <p className="text-sm text-muted-foreground">Es tu llave personal de conexión</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-[20px] bg-muted/50 transition-all hover:bg-muted/70">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <p className="font-medium">Comparte tu código</p>
            <p className="text-sm text-muted-foreground">Envíalo a tu pareja por WhatsApp, SMS, etc.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-[20px] bg-muted/50 transition-all hover:bg-muted/70">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <p className="font-medium">Ingresa el código de tu pareja</p>
            <p className="text-sm text-muted-foreground">¡Y listo! Ya están conectados 💕</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StepGenerateCodeProps {
  myCode: string | null;
  copied: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  formatCode: (code: string) => string;
}

function StepGenerateCode({ myCode, copied, isGenerating, onGenerate, onCopy, formatCode }: StepGenerateCodeProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-display font-bold">
          Tu Código de Conexión
        </h2>
        <p className="text-muted-foreground">
          Genera tu código único y compártelo con tu pareja.
        </p>
      </div>

      {!myCode ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="p-6 rounded-[24px] border-2 border-dashed border-primary/30 bg-muted/30">
            <p className="text-lg text-muted-foreground font-mono">XXX-XXX</p>
          </div>
          <Button 
            onClick={onGenerate}
            disabled={isGenerating}
            size="lg"
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="size-5" />
                Generar mi Código
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative animate-in zoom-in-95 duration-300">
            <div className="p-6 rounded-[24px] bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
              <p className="text-3xl font-bold font-mono tracking-widest text-primary">
                {formatCode(myCode)}
              </p>
            </div>
            <div className="absolute -right-2 -top-2 p-1.5 rounded-full bg-green-500 text-white animate-in zoom-in duration-300">
              <Check className="size-4" />
            </div>
          </div>
          
          <Button 
            onClick={onCopy}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="size-5 text-green-500" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="size-5" />
                Copiar Código
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center mt-2">
            📱 Envía este código a tu pareja por WhatsApp, SMS o cualquier otro medio.
          </p>
        </div>
      )}
    </div>
  );
}

interface StepLinkPartnerProps {
  partnerCodeInput: string;
  setPartnerCodeInput: (value: string) => void;
  linkError: string | null;
  isLoading: boolean;
  isPasting: boolean;
  onLink: () => void;
  onPaste: () => void;
  formatCodeInput: (raw: string) => string;
}

function StepLinkPartner({ partnerCodeInput, setPartnerCodeInput, linkError, isLoading, isPasting, onLink, onPaste, formatCodeInput }: StepLinkPartnerProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-display font-bold">
          Ingresa el Código de tu Pareja
        </h2>
        <p className="text-muted-foreground">
          Tu pareja debe generar su código y compartírtelo.
        </p>
      </div>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Input
            value={partnerCodeInput}
            onChange={(e) => setPartnerCodeInput(formatCodeInput(e.target.value))}
            placeholder="ABC-123"
            className="text-center text-2xl font-mono tracking-widest h-16"
            maxLength={7}
          />
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onPaste} disabled={isPasting}>
              {isPasting ? 'Pegando...' : 'Pegar codigo'}
            </Button>
          </div>
          {linkError && (
            <p className="text-sm text-destructive text-center animate-in fade-in slide-in-from-top-2 duration-200">
              {linkError}
            </p>
          )}
        </div>

        <Button 
          onClick={onLink}
          disabled={partnerCodeInput.length < 7 || isLoading}
          size="lg"
          className="w-full gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Conectando...
            </>
          ) : (
            <>
              <Link2 className="size-5" />
              Conectar con mi Pareja
            </>
          )}
        </Button>
      </div>

      <div className="p-4 rounded-[20px] bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800 text-center">
          💡 <strong>Tip:</strong> Si aún no tienen código, pueden omitir este paso. 
          Siempre pueden vincularse después desde <strong>Ajustes</strong>.
        </p>
      </div>
    </div>
  );
}

export function usePartnerOnboarding() {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading } = useDoc<UserProfile & { onboardingSeen?: boolean }>(userRef);

  useEffect(() => {
    if (!isLoading && profile && !profile.partnerId && !profile.onboardingSeen) {
      setShowOnboarding(true);
    }
  }, [profile, isLoading]);

  const completeOnboarding = async () => {
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        onboardingSeen: true,
        updatedAt: serverTimestamp(),
      });
    }
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
  };
}
