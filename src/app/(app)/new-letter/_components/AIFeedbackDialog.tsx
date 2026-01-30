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
import { Loader2, Sparkles, Heart, BrainCircuit, Feather, Wand2, BookOpen, CheckCircle2, AlertCircle, Lightbulb, Star, Smile, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

type FeedbackStyle = 'Friendly' | 'Rational' | 'Poetic' | 'Playful' | 'Wise';

const personalityConfig: Record<FeedbackStyle, { icon: React.ReactNode; color: string; bgColor: string; emoji: string }> = {
  Friendly: { icon: <Heart className="size-5 fill-pink-400 text-pink-400" />, color: 'text-pink-600', bgColor: 'bg-pink-50 border-pink-200', emoji: '💕' },
  Rational: { icon: <BrainCircuit className="size-5 text-blue-500" />, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', emoji: '🧠' },
  Poetic: { icon: <Feather className="size-5 text-purple-500" />, color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', emoji: '🎭' },
  Playful: { icon: <Wand2 className="size-5 text-orange-500" />, color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200', emoji: '🎪' },
  Wise: { icon: <BookOpen className="size-5 text-emerald-600" />, color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', emoji: '🦉' },
};

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
  const [includeGrammar, setIncludeGrammar] = useState(true);
  const [includeFormatting, setIncludeFormatting] = useState(false);

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
        includeGrammarFix: includeGrammar,
        includeFormatting: includeFormatting,
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🌟';
    if (score >= 8) return '✨';
    if (score >= 7) return '💫';
    if (score >= 6) return '👍';
    if (score >= 5) return '💪';
    return '📝';
  };

  const config = personalityConfig[feedbackStyle];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setFeedback(null); setError(null); } }}>
      <DialogTrigger asChild>
        <button 
          className="group relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[0_6px_0_#B8860B,0_10px_25px_rgba(0,0,0,0.2)] transition-all hover:translate-y-1 hover:shadow-[0_3px_0_#B8860B,0_5px_15px_rgba(0,0,0,0.15)] active:translate-y-2 active:shadow-[0_1px_0_#B8860B,0_2px_8px_rgba(0,0,0,0.1)] lg:size-20"
          aria-label={t('aiFeedback.trigger')}
        >
          <BeeIcon size="2xl" className="transition-transform group-hover:scale-110 group-hover:rotate-12" />
          {/* Notification Dot */}
          <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white lg:-right-2 lg:-top-2 lg:size-6">
            <Sparkles className="size-3 text-white lg:size-4" />
          </div>
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-[95vw] w-[480px] rounded-3xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-0 shadow-2xl sm:max-w-[500px]">
        {/* Decorative Header */}
        <div className="relative rounded-t-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 p-5 text-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="rounded-full bg-white p-2 shadow-lg">
              <BeeIcon size="xl" />
            </div>
          </div>
          <DialogTitle className="mt-4 flex items-center justify-center gap-2 font-display text-2xl font-bold text-amber-900">
            {t('aiFeedback.title')}
          </DialogTitle>
          <p className="mt-1 text-sm text-amber-700">Tu asistente para cartas perfectas</p>
        </div>

        <ScrollArea className="max-h-[65vh]">
          <div className="px-5 py-4">
            {error && (
              <Alert variant="destructive" className="mb-4 border-2 border-red-200 bg-red-50">
                <AlertCircle className="size-4" />
                <AlertTitle className="font-bold">{t('aiFeedback.ohNo')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {feedback ? (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                {/* Score Badge */}
                {feedback.overallScore && (
                  <div className="flex items-center justify-center">
                    <div className={cn('flex items-center gap-2 rounded-full px-4 py-2 font-bold', getScoreColor(feedback.overallScore))}>
                      <span className="text-2xl">{getScoreEmoji(feedback.overallScore)}</span>
                      <span className="text-xl">{feedback.overallScore}/10</span>
                    </div>
                  </div>
                )}

                {/* Main Feedback Cards */}
                <div className="grid gap-3">
                  {/* Sentiment */}
                  <div className={cn('rounded-xl border-2 p-4 transition-all hover:shadow-md', config.bgColor)}>
                    <div className="mb-2 flex items-center gap-2">
                      <Smile className={cn('size-5', config.color)} />
                      <span className={cn('font-semibold', config.color)}>{t('aiFeedback.sentiment')}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">{feedback.sentimentAnalysis}</p>
                  </div>

                  {/* Structure */}
                  <div className={cn('rounded-xl border-2 p-4 transition-all hover:shadow-md', config.bgColor)}>
                    <div className="mb-2 flex items-center gap-2">
                      <MessageCircle className={cn('size-5', config.color)} />
                      <span className={cn('font-semibold', config.color)}>{t('aiFeedback.structure')}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">{feedback.structureCheck}</p>
                  </div>

                  {/* Reaction */}
                  <div className={cn('rounded-xl border-2 p-4 transition-all hover:shadow-md', config.bgColor)}>
                    <div className="mb-2 flex items-center gap-2">
                      <Heart className={cn('size-5', config.color)} />
                      <span className={cn('font-semibold', config.color)}>{t('aiFeedback.reaction')}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">{feedback.predictedReaction}</p>
                  </div>

                  {/* Grammar Corrections */}
                  {feedback.grammarCorrections && (
                    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-green-600" />
                        <span className="font-semibold text-green-700">Gramática y Ortografía</span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-700">{feedback.grammarCorrections}</p>
                    </div>
                  )}

                  {/* Formatting */}
                  {feedback.formattingSuggestions && (
                    <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Feather className="size-5 text-indigo-600" />
                        <span className="font-semibold text-indigo-700">Sugerencias de Formato</span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-700">{feedback.formattingSuggestions}</p>
                    </div>
                  )}
                </div>

                {/* Quick Tips */}
                {feedback.quickTips && feedback.quickTips.length > 0 && (
                  <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Lightbulb className="size-5 text-amber-600" />
                      <span className="font-semibold text-amber-700">Tips Rápidos</span>
                    </div>
                    <ul className="space-y-2">
                      {feedback.quickTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <Star className="mt-0.5 size-4 shrink-0 text-amber-500" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-center text-gray-600">
                  {t('aiFeedback.prompt')}
                </p>
                
                {/* Personality Selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Personalidad de la Abeja Maya</Label>
                  <Select onValueChange={(v: FeedbackStyle) => setFeedbackStyle(v)} defaultValue={feedbackStyle}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-amber-200 bg-white font-medium transition-colors focus:border-amber-400 focus:ring-0">
                      <SelectValue placeholder={t('aiFeedback.selectStyle')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-amber-200">
                      <SelectItem value="Friendly" className="focus:bg-pink-50">
                        <div className="flex items-center gap-3">
                          {personalityConfig.Friendly.icon}
                          <div>
                            <span className="font-medium">{t('aiFeedback.style.friendly')}</span>
                            <p className="text-xs text-gray-500">Dulce y alentadora 💕</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Rational" className="focus:bg-blue-50">
                        <div className="flex items-center gap-3">
                          {personalityConfig.Rational.icon}
                          <div>
                            <span className="font-medium">{t('aiFeedback.style.rational')}</span>
                            <p className="text-xs text-gray-500">Analítica y objetiva 🧠</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Poetic" className="focus:bg-purple-50">
                        <div className="flex items-center gap-3">
                          {personalityConfig.Poetic.icon}
                          <div>
                            <span className="font-medium">Poética</span>
                            <p className="text-xs text-gray-500">Romántica y lírica 🎭</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Playful" className="focus:bg-orange-50">
                        <div className="flex items-center gap-3">
                          {personalityConfig.Playful.icon}
                          <div>
                            <span className="font-medium">Juguetona</span>
                            <p className="text-xs text-gray-500">Divertida e ingeniosa 🎪</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Wise" className="focus:bg-emerald-50">
                        <div className="flex items-center gap-3">
                          {personalityConfig.Wise.icon}
                          <div>
                            <span className="font-medium">Sabia</span>
                            <p className="text-xs text-gray-500">Consejos profundos 🦉</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Options */}
                <div className="space-y-3 rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
                  <h4 className="text-sm font-semibold text-gray-700">Opciones adicionales</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-500" />
                      <Label htmlFor="grammar" className="text-sm text-gray-600">Corregir gramática</Label>
                    </div>
                    <Switch 
                      id="grammar" 
                      checked={includeGrammar} 
                      onCheckedChange={setIncludeGrammar}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Feather className="size-4 text-indigo-500" />
                      <Label htmlFor="formatting" className="text-sm text-gray-600">Sugerir formato</Label>
                    </div>
                    <Switch 
                      id="formatting" 
                      checked={includeFormatting} 
                      onCheckedChange={setIncludeFormatting}
                      className="data-[state=checked]:bg-indigo-500"
                    />
                  </div>
                </div>

                {/* Optional Notice */}
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                  <Sparkles className="size-4 shrink-0" />
                  <span>Esta función es <strong>opcional</strong>. Puedes enviar tu carta sin usarla.</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="border-t border-amber-100 bg-amber-50/50 p-4">
          {feedback ? (
            <div className="flex w-full gap-2">
              <Button 
                variant="outline" 
                onClick={() => { setFeedback(null); setError(null); }}
                className="flex-1 rounded-xl border-2"
              >
                Analizar de nuevo
              </Button>
              <DialogClose asChild>
                <Button className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 font-semibold text-white hover:from-amber-600 hover:to-yellow-600">
                  {t('aiFeedback.close')}
                </Button>
              </DialogClose>
            </div>
          ) : (
            <Button 
              onClick={handleGetFeedback} 
              disabled={isLoading || !letterContent.trim()} 
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-6 text-lg font-semibold text-white transition-all hover:from-amber-600 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-300"
            >
              {isLoading && <Loader2 className="mr-2 size-5 animate-spin" />}
              {isLoading ? t('aiFeedback.thinking') : (
                <>
                  <Sparkles className="mr-2 size-5" />
                  {t('aiFeedback.getFeedback')}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
