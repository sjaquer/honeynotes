'use client';

import { useState, useEffect } from 'react';
import { Settings, Link2, Unlink, Copy, Check, LogOut, User, Heart, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirebase, useUser, useAuth, useDoc, useMemoFirebase } from '@/firebase';
import { initiateSignOut } from '@/firebase/non-blocking-login';
import { usePartnerLink, type UserProfile } from '@/hooks/use-partner-link';
import { useTranslation } from '@/hooks/use-translation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const auth = useAuth();
  const { user } = useUser();
  
  const { generateMyCode, linkWithPartner, unlinkPartner, formatPartnerCode, isLoading, error } = usePartnerLink();
  
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [myCode, setMyCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Get user profile from Firestore
  const userRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile } = useDoc<UserProfile>(userRef);

  // Create/update user profile on first load
  useEffect(() => {
    if (user && !profile) {
      const userDocRef = doc(firestore, 'users', user.uid);
      setDoc(userDocRef, {
        id: user.uid,
        displayName: user.displayName || 'Usuario',
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  }, [user, profile, firestore]);

  useEffect(() => {
    if (profile?.partnerCode) {
      setMyCode(profile.partnerCode);
    }
  }, [profile]);

  const handleGenerateCode = async () => {
    const code = await generateMyCode();
    if (code) {
      setMyCode(code);
      toast({ title: '¡Código generado!', description: 'Compártelo con tu pareja' });
    }
  };

  const handleCopyCode = () => {
    if (myCode) {
      navigator.clipboard.writeText(formatPartnerCode(myCode));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkPartner = async () => {
    const success = await linkWithPartner(partnerCodeInput);
    if (success) {
      setPartnerCodeInput('');
      toast({ title: '¡Vinculado!', description: 'Ya puedes enviar cartas a tu pareja' });
    }
  };

  const handleUnlink = async () => {
    const success = await unlinkPartner();
    if (success) {
      toast({ title: 'Desvinculado', description: 'Ya no están conectados' });
    }
  };

  const handleSignOut = () => {
    initiateSignOut(auth);
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast({ title: 'Notificaciones activadas', description: 'Te avisaremos cuando lleguen cartas' });
      } else {
        toast({ variant: 'destructive', title: 'Permisos denegados', description: 'Activa las notificaciones en tu navegador' });
      }
    } else {
      setNotificationsEnabled(false);
      toast({ title: 'Notificaciones desactivadas' });
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-[#F0F4F8]/95 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary lg:text-4xl">{t('settingsPage.title')}</h1>
          <div className="rounded-full bg-white p-2 shadow-sm">
            <Settings className="size-6 text-primary" />
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-4 lg:p-8">
        {/* Profile Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="size-16 rounded-full" />
              ) : (
                <User className="size-8 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user?.displayName || t('settingsPage.profile.anonymous')}
              </h2>
              <p className="text-sm text-gray-500">{user?.email || t('settingsPage.profile.anonymous')}</p>
            </div>
          </div>
        </div>

        {/* Partner Linking Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="size-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-800">{t('settingsPage.partner.title')}</h3>
          </div>

          {/* Always show your code section */}
          <div className="space-y-4">
            {/* Your code - always visible */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{t('settingsPage.partner.yourCode')}:</p>
              {myCode ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-xl bg-primary/5 p-3 text-center font-mono text-2xl font-bold tracking-widest text-primary">
                    {formatPartnerCode(myCode)}
                  </div>
                  <Button size="icon" variant="outline" onClick={handleCopyCode} title={t('settingsPage.partner.copyCode')}>
                    {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              ) : (
                <Button onClick={handleGenerateCode} disabled={isLoading} className="w-full">
                  {t('settingsPage.partner.generateCode')}
                </Button>
              )}
            </div>

            {profile?.partnerId ? (
              // Already linked - show status and unlink button
              <>
                <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
                  <Link2 className="size-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{t('settingsPage.partner.linkedWith')} {profile.partnerName}!</p>
                    <p className="text-sm text-green-600">{t('settingsPage.partner.description')}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleUnlink}
                  disabled={isLoading}
                >
                  <Unlink className="mr-2 size-4" />
                  {t('settingsPage.partner.unlink')}
                </Button>
              </>
            ) : (
              // Not linked - show input for partner's code
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm text-gray-600">{t('settingsPage.partner.enterCode')}</p>
                <div className="flex gap-2">
                  <Input
                    placeholder={t('settingsPage.partner.codePlaceholder')}
                    value={partnerCodeInput}
                    onChange={(e) => setPartnerCodeInput(e.target.value.toUpperCase())}
                    className="font-mono text-center text-lg tracking-widest"
                    maxLength={7}
                  />
                  <Button onClick={handleLinkPartner} disabled={isLoading || !partnerCodeInput}>
                    <Link2 className="mr-2 size-4" />
                    {t('settingsPage.partner.link')}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">{t('settingsPage.notifications.title')}</h3>
            </div>
            <Button
              variant={notificationsEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={handleToggleNotifications}
            >
              {notificationsEnabled ? (
                <>
                  <Bell className="mr-2 size-4" />
                  {t('settingsPage.notifications.title')}
                </>
              ) : (
                <>
                  <BellOff className="mr-2 size-4" />
                  {t('settingsPage.notifications.enable')}
                </>
              )}
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {t('settingsPage.notifications.description')}
          </p>
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 size-4" />
          {t('settingsPage.profile.signOut')}
        </Button>
      </div>
    </div>
  );
}
