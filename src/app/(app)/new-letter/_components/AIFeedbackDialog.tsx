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
  const { t } = useTranslation();
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
        <Button variant="outline" className="h-[60px] w-full rounded-3xl bg-accent/20 text-accent-foreground border-accent hover:bg-accent/30 text-lg font-bold">
          <Sparkles className="mr-2 size-5" /> {t('aiFeedback.button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[440px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <BeeIcon className="size-8 text-accent" />
            {t('aiFeedback.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t('aiFeedback.ohNo')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {feedback ? (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-headline text-lg">{t('aiFeedback.feedbackReady')}</h3>
              <div className="rounded-lg border bg-secondary/30 p-3">
                <p className="font-semibold">{t('aiFeedback.sentiment')}</p>
                <p className="text-sm text-foreground/80">{feedback.sentimentAnalysis}</p>
              </div>
              <div className="rounded-lg border bg-secondary/30 p-3">
                <p className="font-semibold">{t('aiFeedback.structure')}</p>
                <p className="text-sm text-foreground/80">{feedback.structureCheck}</p>
              </div>
              <div className="rounded-lg border bg-secondary/30 p-3">
                <p className="font-semibold">{t('aiFeedback.reaction')}</p>
                <p className="text-sm text-foreground/80">{feedback.predictedReaction}</p>
              </div>
            </div>
          ) : (
            <>
              <p>
                {t('aiFeedback.prompt')}
              </p>
              <Select onValueChange={(v: FeedbackStyle) => setFeedbackStyle(v)} defaultValue={feedbackStyle}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t('aiFeedback.selectStyle')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Friendly">
                    <div className="flex items-center gap-2">
                      <Heart className="size-4" /> {t('aiFeedback.style.friendly')}
                    </div>
                  </SelectItem>
                  <SelectItem value="Rational">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="size-4" /> {t('aiFeedback.style.rational')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <DialogFooter>
          {feedback ? (
            <DialogClose asChild>
              <Button className="h-12 w-full">{t('aiFeedback.close')}</Button>
            </DialogClose>
          ) : (
            <Button onClick={handleGetFeedback} disabled={isLoading} className="h-12 w-full">
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isLoading ? t('aiFeedback.thinking') : t('aiFeedback.getFeedback')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
