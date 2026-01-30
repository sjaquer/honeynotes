'use client';

import { useState, useEffect } from 'react';
import { Settings, Link2, Unlink, Copy, Check, LogOut, User, Heart, Bell, BellOff, RefreshCw, Trash2, Edit2, Save, X, AlertTriangle, Gift, Ticket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirebase, useUser, useAuth, useDoc, useMemoFirebase } from '@/firebase';
import { initiateSignOut } from '@/firebase/non-blocking-login';
import { usePartnerLink, type UserProfile } from '@/hooks/use-partner-link';
import { useTranslation } from '@/hooks/use-translation';
import { doc, setDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePromoCodes } from '@/hooks/use-promo-codes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const auth = useAuth();
  const { user } = useUser();
  
  const { generateMyCode, deleteMyCode, linkWithPartner, unlinkPartner, clearUnlinkedNotification, formatPartnerCode, isLoading, error } = usePartnerLink();
  const { redeemCode, isRedeeming } = usePromoCodes();
  
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [myCode, setMyCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  
  // Edit profile states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Dialog states
  const [showDeleteCodeDialog, setShowDeleteCodeDialog] = useState(false);
  const [showRegenerateCodeDialog, setShowRegenerateCodeDialog] = useState(false);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const [showPartnerUnlinkedAlert, setShowPartnerUnlinkedAlert] = useState(false);

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
    } else {
      setMyCode(null);
    }
  }, [profile]);

  // Listen for partner unlink notification in real-time
  useEffect(() => {
    if (!user) return;
    
    const userRef = doc(firestore, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.partnerUnlinkedAt && !data?.partnerId) {
        setShowPartnerUnlinkedAlert(true);
      }
    });

    return () => unsubscribe();
  }, [user, firestore]);

  const handleGenerateCode = async () => {
    const code = await generateMyCode();
    if (code) {
      setMyCode(code);
      toast({ title: t('settingsPage.partner.codeGenerated'), description: t('settingsPage.partner.shareWithPartner') });
    }
  };

  const handleRegenerateCode = async () => {
    setShowRegenerateCodeDialog(false);
    const code = await generateMyCode(true); // forceRegenerate = true
    if (code) {
      setMyCode(code);
      toast({ title: t('settingsPage.partner.codeRegenerated'), description: t('settingsPage.partner.newCodeReady') });
    }
  };

  const handleDeleteCode = async () => {
    setShowDeleteCodeDialog(false);
    const success = await deleteMyCode();
    if (success) {
      setMyCode(null);
      toast({ title: t('settingsPage.partner.codeDeleted'), description: t('settingsPage.partner.canGenerateNew') });
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
      toast({ title: t('settingsPage.partner.linked'), description: t('settingsPage.partner.canSendLetters') });
    }
  };

  const handleUnlink = async () => {
    setShowUnlinkDialog(false);
    const success = await unlinkPartner();
    if (success) {
      toast({ title: t('settingsPage.partner.unlinked'), description: t('settingsPage.partner.noLongerConnected') });
    }
  };

  const handleDismissUnlinkedAlert = async () => {
    await clearUnlinkedNotification();
    setShowPartnerUnlinkedAlert(false);
  };

  const handleSignOut = () => {
    initiateSignOut(auth);
  };

  // Profile editing functions
  const handleStartEditName = () => {
    setEditedName(profile?.displayName || user?.displayName || '');
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleSaveName = async () => {
    if (!user || !editedName.trim()) return;
    setIsSavingProfile(true);
    
    try {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: editedName.trim(),
        updatedAt: serverTimestamp(),
      });
      
      toast({ title: t('settingsPage.profile.nameSaved') });
      setIsEditingName(false);
    } catch (e) {
      console.error('Error saving name:', e);
      toast({ variant: 'destructive', title: t('settingsPage.profile.errorSaving') });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast({ title: t('settingsPage.notifications.enabled'), description: t('settingsPage.notifications.willNotify') });
      } else {
        toast({ variant: 'destructive', title: t('settingsPage.notifications.denied'), description: t('settingsPage.notifications.enableInBrowser') });
      }
    } else {
      setNotificationsEnabled(false);
      toast({ title: t('settingsPage.notifications.disabled') });
    }
  };

  const handleRedeemPromoCode = async () => {
    const result = await redeemCode(promoCodeInput);
    
    if (result.success) {
      toast({ 
        title: '🎉 ¡Código canjeado!', 
        description: `Has recibido ${result.rewards?.polen ? `${result.rewards.polen} 🌼 Polen` : ''}${result.rewards?.polen && result.rewards?.jaleaReal ? ' y ' : ''}${result.rewards?.jaleaReal ? `${result.rewards.jaleaReal} 👑 Jalea Real` : ''}` 
      });
      setPromoCodeInput('');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      {/* Partner Unlinked Alert Dialog */}
      <AlertDialog open={showPartnerUnlinkedAlert} onOpenChange={setShowPartnerUnlinkedAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              {t('settingsPage.partner.partnerUnlinkedTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('settingsPage.partner.partnerUnlinkedMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDismissUnlinkedAlert}>
              {t('common.understood')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Code Dialog */}
      <AlertDialog open={showDeleteCodeDialog} onOpenChange={setShowDeleteCodeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settingsPage.partner.deleteCodeTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {profile?.partnerId 
                ? t('settingsPage.partner.deleteCodeWarningLinked')
                : t('settingsPage.partner.deleteCodeWarning')
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCode} className="bg-red-600 hover:bg-red-700">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Regenerate Code Dialog */}
      <AlertDialog open={showRegenerateCodeDialog} onOpenChange={setShowRegenerateCodeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settingsPage.partner.regenerateCodeTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {profile?.partnerId 
                ? t('settingsPage.partner.regenerateCodeWarningLinked')
                : t('settingsPage.partner.regenerateCodeWarning')
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerateCode}>
              {t('settingsPage.partner.regenerate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unlink Partner Dialog */}
      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settingsPage.partner.unlinkTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settingsPage.partner.unlinkWarning', { partnerName: profile?.partnerName || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlink} className="bg-red-600 hover:bg-red-700">
              {t('settingsPage.partner.unlink')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-9 text-lg font-semibold"
                    placeholder={t('settingsPage.profile.enterName')}
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={handleSaveName} disabled={isSavingProfile || !editedName.trim()}>
                    <Save className="size-4 text-green-600" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCancelEditName}>
                    <X className="size-4 text-gray-500" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {profile?.displayName || user?.displayName || t('settingsPage.profile.anonymous')}
                  </h2>
                  <Button size="icon" variant="ghost" onClick={handleStartEditName} className="size-8">
                    <Edit2 className="size-4 text-gray-400 hover:text-primary" />
                  </Button>
                </div>
              )}
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-xl bg-primary/5 p-3 text-center font-mono text-2xl font-bold tracking-widest text-primary">
                      {formatPartnerCode(myCode)}
                    </div>
                    <Button size="icon" variant="outline" onClick={handleCopyCode} title={t('settingsPage.partner.copyCode')}>
                      {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                    </Button>
                  </div>
                  {/* Code actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowRegenerateCodeDialog(true)}
                      disabled={isLoading}
                    >
                      <RefreshCw className="mr-2 size-3" />
                      {t('settingsPage.partner.regenerateCode')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setShowDeleteCodeDialog(true)}
                      disabled={isLoading}
                    >
                      <Trash2 className="mr-2 size-3" />
                      {t('settingsPage.partner.deleteCode')}
                    </Button>
                  </div>
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
                  onClick={() => setShowUnlinkDialog(true)}
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

        {/* Promo Codes Card */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-xl bg-purple-100 p-2">
              <Ticket className="size-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Códigos Promocionales</h3>
              <p className="text-sm text-gray-500">Canjea códigos para obtener recompensas</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa tu código..."
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value)}
              className="flex-1 bg-white"
              disabled={isRedeeming}
            />
            <Button 
              onClick={handleRedeemPromoCode} 
              disabled={isRedeeming || !promoCodeInput.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isRedeeming ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Gift className="mr-2 size-4" />
                  Canjear
                </>
              )}
            </Button>
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
