'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLetterFeedback, type LetterFeedbackOutput } from '@/ai/flows/letter-content-feedback';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Heart, BrainCircuit } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

type FeedbackStyle = 'Friendly' | 'Rational';

export function AIFeedbackDialog({
  letterContent,
  onFeedbackReceived,
}: {
  letterContent: string;
  onFeedbackReceived: () => void;
}) {
  const { t, locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackStyle, setFeedbackStyle] = useState<FeedbackStyle>('Friendly');
  const [feedback, setFeedback] = useState<LetterFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetFeedback = async () => {
    if (!letterContent.trim()) {
      setError(t('aiFeedback.error.empty'));
      return;
    }
    setError(null);
    setIsLoading(true);
    setFeedback(null);
    try {
      const result = await getLetterFeedback({
        letterContent,
        feedbackStyle,
        language: locale,
      });
      setFeedback(result);
      onFeedbackReceived();
    } catch (e) {
      console.error(e);
      setError(t('aiFeedback.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="group relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[0_6px_0_#B8860B,0_10px_25px_rgba(0,0,0,0.2)] transition-all hover:translate-y-1 hover:shadow-[0_3px_0_#B8860B,0_5px_15px_rgba(0,0,0,0.15)] active:translate-y-2 active:shadow-[0_1px_0_#B8860B,0_2px_8px_rgba(0,0,0,0.1)] lg:size-20"
          aria-label={t('aiFeedback.trigger')}
        >
          <BeeIcon className="size-9 text-black transition-transform group-hover:scale-110 group-hover:rotate-12 lg:size-12" />
          {/* Notification Dot */}
          <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white lg:-right-2 lg:-top-2 lg:size-6">
            <Sparkles className="size-3 text-white lg:size-4" />
          </div>
        </button>
      </DialogTrigger>
      {/* Updated Dialog UI: Square-ish, Crayon Style */}
      <DialogContent className="max-w-[90vw] w-[400px] rounded-[3rem] border-4 border-black bg-white p-0 shadow-[8px_8px_0_#000000] sm:max-w-[420px]">
        
        {/* Decorative Header Background */}
        <div className="rounded-t-[2.7rem] bg-[#FFD700] p-6 text-center border-b-4 border-black">
             <DialogTitle className="flex items-center justify-center gap-3 font-display text-3xl font-bold text-black drop-shadow-sm">
                <BeeIcon className="size-8" />
                {t('aiFeedback.title')}
            </DialogTitle>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {error && (
            <Alert variant="destructive" className="border-2 border-black bg-red-100">
              <AlertTitle className="font-bold">{t('aiFeedback.ohNo')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {feedback ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-center font-handwriting text-xl font-bold">{t('aiFeedback.feedbackReady')}</h3>
              
              {/* Sticky Note 1 */}
              <div className="rotate-[-1deg] rounded-xl border-2 border-black bg-[#FFDFE6] p-4 shadow-sm transition-transform hover:rotate-0 hover:scale-105">
                <p className="mb-2 font-display text-base font-bold text-red-800">{t('aiFeedback.sentiment')}</p>
                <p className="font-sans text-base leading-relaxed text-gray-800">{feedback.sentimentAnalysis}</p>
              </div>

               {/* Sticky Note 2 */}
              <div className="rotate-[1deg] rounded-xl border-2 border-black bg-[#E0F7FA] p-4 shadow-sm transition-transform hover:rotate-0 hover:scale-105">
                <p className="mb-2 font-display text-base font-bold text-blue-800">{t('aiFeedback.structure')}</p>
                <p className="font-sans text-base leading-relaxed text-gray-800">{feedback.structureCheck}</p>
              </div>

               {/* Sticky Note 3 */}
              <div className="rotate-[-1deg] rounded-xl border-2 border-black bg-[#FFF9C4] p-4 shadow-sm transition-transform hover:rotate-0 hover:scale-105">
                <p className="mb-2 font-display text-base font-bold text-yellow-800">{t('aiFeedback.reaction')}</p>
                <p className="font-sans text-base leading-relaxed text-gray-800">{feedback.predictedReaction}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-center font-handwriting text-lg text-gray-600">
                {t('aiFeedback.prompt')}
              </p>
              
              <div className="relative">
                 <Select onValueChange={(v: FeedbackStyle) => setFeedbackStyle(v)} defaultValue={feedbackStyle}>
                    <SelectTrigger className="h-14 rounded-2xl border-2 border-black bg-white font-display text-lg ring-offset-0 focus:ring-0">
                      <SelectValue placeholder={t('aiFeedback.selectStyle')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-black">
                      <SelectItem value="Friendly" className="focus:bg-[#FFDFE6]">
                        <div className="flex items-center gap-2 font-handwriting text-lg">
                          <Heart className="size-4 fill-red-400 text-red-400" /> {t('aiFeedback.style.friendly')}
                        </div>
                      </SelectItem>
                      <SelectItem value="Rational" className="focus:bg-[#E0F7FA]">
                        <div className="flex items-center gap-2 font-handwriting text-lg">
                          <BrainCircuit className="size-4 text-blue-500" /> {t('aiFeedback.style.rational')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="p-6 pt-2">
          {feedback ? (
            <DialogClose asChild>
              <Button className="h-14 w-full rounded-2xl border-2 border-black bg-primary text-xl font-bold text-white shadow-[4px_4px_0_#000000] transition-all hover:translate-y-[2px] hover:shadow-none hover:bg-primary/90 active:translate-y-[2px] active:shadow-none">
                  {t('aiFeedback.close')}
              </Button>
            </DialogClose>
          ) : (
            <Button 
                onClick={handleGetFeedback} 
                disabled={isLoading} 
                className="h-14 w-full rounded-2xl border-2 border-black bg-[#4CAF50] text-xl font-bold text-white shadow-[4px_4px_0_#000000] transition-all hover:translate-y-[2px] hover:shadow-none hover:bg-[#43A047] active:translate-y-[2px] active:shadow-none disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0"
            >
              {isLoading && <Loader2 className="mr-2 size-5 animate-spin" />}
              {isLoading ? t('aiFeedback.thinking') : t('aiFeedback.getFeedback')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
