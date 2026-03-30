'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Send, Loader2, Copy, CheckCheck, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { LetterUI } from '@/lib/types';

export interface QuickReplyOption {
  id: string;
  tone: string;
  text: string;
}

interface LetterAIAssistantProps {
  letter: LetterUI;
  onReplySelect: (text: string) => void;
}

/**
 * AI Assistant - Panel para sugerencias de respuesta
 * Usa h-full para integrarse en layouts flex
 * No usa position:fixed - se integra en el contenedor padre
 */
export function LetterAIAssistant({ letter, onReplySelect }: LetterAIAssistantProps) {
  const [replies, setReplies] = useState<QuickReplyOption[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    generateReplies();
  }, [letter.id]);

  const generateReplies = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/quick-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterContent: letter.content,
          senderName: letter.senderName,
        }),
      });

      if (!response.ok) throw new Error('No se pudo generar');
      const data = await response.json();
      setReplies(data.replies || []);
    } catch (err) {
      // Fallback: 3 opciones por defecto
      setReplies([
        {
          id: '1',
          tone: 'Romántico',
          text: `Querido/a ${letter.senderName}, tu mensaje me tocó profundamente. Gracias por expresar tus sentimientos de forma tan hermosa...`,
        },
        {
          id: '2',
          tone: 'Juguetón',
          text: `¡Vaya! Mira quién está en modo romántico hoy. Me encanta, déjame responder con la misma intensidad.`,
        },
        {
          id: '3',
          tone: 'Íntimo',
          text: `Leyendo esto me haces sentir tan especial. Quiero que sepas que yo siento exactamente lo mismo por ti.`,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReply = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseReply = (text: string) => {
    onReplySelect(text);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-pink-50/30 to-white rounded-2xl border border-pink-100/50 overflow-hidden shadow-lg lg:shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-pink-500 to-rose-500 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="size-4 sm:size-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-xs sm:text-sm leading-tight">Asistente IA</h3>
            <p className="text-xs text-white/80 truncate">Respuestas personalizadas</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Loader2 className="size-7 sm:size-8 animate-spin text-primary" />
            <p className="text-xs text-gray-500 text-center">Generando respuestas...</p>
          </div>
        ) : replies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs sm:text-sm text-gray-500">No hay sugerencias</p>
          </div>
        ) : (
          replies.map((reply, idx) => (
            <div
              key={reply.id}
              className="group/reply animate-in fade-in slide-in-from-bottom-2 border border-gray-200 rounded-xl p-3 hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/5 hover:to-pink-50/30 transition-all duration-300 hover:shadow-md"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-block text-xs font-bold text-primary/70 uppercase tracking-wide bg-primary/10 px-2 py-1 rounded-md flex-shrink-0">
                  {reply.tone}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover/reply:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleCopyReply(reply.id, reply.text)}
                    className="p-1.5 hover:bg-gray-300/40 rounded-lg transition-colors"
                    title="Copiar"
                  >
                    {copiedId === reply.id ? (
                      <CheckCheck className="size-3.5 text-green-600" />
                    ) : (
                      <Copy className="size-3.5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleUseReply(reply.text)}
                    className="p-1.5 hover:bg-primary/20 rounded-lg transition-colors"
                    title="Usar"
                  >
                    <Send className="size-3.5 text-primary" />
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-700 line-clamp-4">
                {reply.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3 bg-gray-50/50 flex-shrink-0">
        <Button
          onClick={generateReplies}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="w-full text-xs h-8 sm:h-9"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-3 animate-spin mr-2" />
              <span className="hidden sm:inline">Generando...</span>
            </>
          ) : (
            <>
              <RotateCw className="size-3 mr-2" />
              <span className="hidden sm:inline">Regenerar</span>
              <span className="sm:hidden">Nuevo</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
