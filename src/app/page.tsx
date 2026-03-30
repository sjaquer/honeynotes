'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register';

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/inbox');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: t('auth.error'),
        description: t('auth.fillAllFields'),
      });
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        toast({
          variant: 'destructive',
          title: t('auth.error'),
          description: t('auth.passwordMismatch'),
        });
        return;
      }
      if (password.length < 6) {
        toast({
          variant: 'destructive',
          title: t('auth.error'),
          description: t('auth.passwordTooShort'),
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        await initiateEmailSignIn(auth, email, password);
      } else {
        await initiateEmailSignUp(auth, email, password, displayName);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let message = t('auth.genericError');
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = t('auth.invalidCredentials');
      } else if (error.code === 'auth/email-already-in-use') {
        message = t('auth.emailInUse');
      } else if (error.code === 'auth/invalid-email') {
        message = t('auth.invalidEmail');
      }
      
      toast({
        variant: 'destructive',
        title: t('auth.error'),
        description: message,
      });
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="paper-app-bg paper-noise flex h-screen flex-col items-center justify-center text-center">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="mt-4 font-body text-xl text-foreground/80">
          {t('auth.loading')}
        </p>
      </div>
    );
  }

  return (
    <main className="paper-app-bg paper-noise relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 size-96 rounded-full bg-amber-200/50 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="hidden rounded-[2rem] border border-white/70 bg-white/45 p-10 shadow-[0_25px_80px_-35px_rgba(120,40,60,0.5)] backdrop-blur-md lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            Tu rincon de cartas con estilo
          </div>
          <h1 className="font-display text-6xl leading-[1.05] text-primary">
            HoneyNotes
          </h1>
          <p className="mt-5 max-w-xl text-lg text-foreground/75">
            Una experiencia de cartas romanticas mas elegante, suave y personal. Escribe con calma, conecta con tu pareja y guarda recuerdos bonitos.
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 text-sm">
            <div className="glass-paper rounded-2xl p-4">
              <p className="font-semibold text-primary">Conexion sencilla</p>
              <p className="mt-1 text-foreground/70">Codigo en formato claro y vinculacion guiada paso a paso.</p>
            </div>
            <div className="glass-paper rounded-2xl p-4">
              <p className="font-semibold text-primary">Diseno con caracter</p>
              <p className="mt-1 text-foreground/70">Estetica papel kawai con una capa mas profesional.</p>
            </div>
          </div>
        </section>

        <section className="glass-paper mx-auto w-full max-w-md rounded-[2rem] p-6 sm:p-7">
          <div className="mb-6 flex flex-col items-center gap-3 text-center lg:hidden">
            <Heart className="size-12 text-primary" fill="currentColor" />
            <h1 className="font-display text-5xl font-bold text-primary">HoneyNotes</h1>
            <p className="max-w-sm text-sm text-foreground/70">{t('landing.description')}</p>
          </div>

          <div className="mb-6 flex rounded-2xl bg-white/70 p-1.5">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'flex-1 rounded-xl py-3 text-sm font-semibold transition-all',
                mode === 'login'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t('auth.login')}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={cn(
                'flex-1 rounded-xl py-3 text-sm font-semibold transition-all',
                mode === 'register'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t('auth.register')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                  {t('auth.displayName')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t('auth.displayNamePlaceholder')}
                    className="h-12 rounded-xl pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('auth.email')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  className="h-12 rounded-xl pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t('auth.password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="h-12 rounded-xl pl-10 pr-10"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  {t('auth.confirmPassword')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    className="h-12 rounded-xl pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-2xl bg-primary text-lg font-bold shadow-lg transition-transform hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : mode === 'login' ? (
                t('auth.loginButton')
              ) : (
                t('auth.registerButton')
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-primary hover:underline"
            >
              {mode === 'login' ? t('auth.registerNow') : t('auth.loginNow')}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
