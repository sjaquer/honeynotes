'use client';

import { useState, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface QuickReplyComposerProps {
  recipientName: string;
  recipientId: string;
  letterId: string;
  initialDraft?: string;
  onSuccess?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Editor de respuesta rápida
 * Modal en mobile, drawer lateral en desktop siempre visible
 * Se abre/cierra con estado controlado desde padre
 */
export function QuickReplyComposer({
  recipientName,
  recipientId,
  letterId,
  initialDraft = '',
  onSuccess,
  isOpen,
  onOpenChange,
}: QuickReplyComposerProps) {
  const [content, setContent] = useState(initialDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();

  // Update content when draft changes
  useEffect(() => {
    setContent(initialDraft);
  }, [initialDraft]);

  const handleSendReply = async () => {
    if (!content.trim() || !firestore || !user) {
      toast({
        title: 'Error',
        description: 'Por favor escribe tu mensaje',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'letters'), {
        senderId: user.uid,
        senderName: user.displayName || 'Tú',
        recipientId: recipientId,
        recipientName: recipientName,
        content: content.trim(),
        config: {
          font: 'Indie_Flower',
          paperColor: 'cream',
          borderStyle: 'simple',
          stamp: 'heart',
        },
        createdAt: serverTimestamp(),
        status: 'sent',
        isRead: false,
      });

      toast({
        title: '¡Enviada!',
        description: 'Tu respuesta fue enviada',
      });

      setContent('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No pudimos enviar tu respuesta',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:inset-auto lg:fixed lg:bottom-0 lg:right-0 lg:w-96 lg:top-0 lg:z-40 bg-black/50 lg:bg-transparent flex items-end lg:items-stretch">
      {/* Modal */}
      <div className="w-full bg-white rounded-t-3xl lg:rounded-l-2xl lg:rounded-tr-none p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto lg:max-h-full lg:h-full lg:rounded-l-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">Responder a {recipientName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Tu respuesta</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
            title="Cerrar"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 min-w-0 space-y-3 flex flex-col">
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">
              Tu mensaje
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Escribe tu respuesta...`}
              className="flex-1 text-sm leading-relaxed resize-none focus:ring-2 focus:ring-primary min-h-[150px] lg:min-h-full"
              autoFocus
            />
          </div>

          {/* Character count */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{content.length} caracteres</span>
            {content.length > 500 && (
              <span className="text-amber-600 font-medium">Mensaje largo</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSendReply}
            disabled={!content.trim() || isSubmitting}
            className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                <span className="hidden sm:inline">Enviando...</span>
              </>
            ) : (
              <>
                <Send className="size-3.5 mr-1.5" />
                <span className="hidden sm:inline">Enviar</span>
                <span className="sm:hidden">OK</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
