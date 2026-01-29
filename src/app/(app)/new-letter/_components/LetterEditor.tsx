'use client';

import { useState } from 'react';
import type { PaperColor, Stamp, AppFont, Letter } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon';
import { AIFeedbackDialog } from './AIFeedbackDialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { currentUser, otherUser } from '@/lib/data';

const paperColors: { name: PaperColor; class: string; label: string }[] = [
  { name: 'cream', class: 'bg-[#FFFDF5]', label: 'Cream' },
  { name: 'pink', class: 'bg-[#FFDFE6]', label: 'Rose' },
  { name: 'crimson', class: 'bg-[#FADADD]', label: 'Crimson' },
  { name: 'honey', class: 'bg-[#FFF8DD]', label: 'Honey' },
  { name: 'light-pink', class: 'bg-pink-100', label: 'Pastel' },
];

const stamps: { name: Stamp; icon: React.ReactNode; label: string }[] = [
  { name: 'heart', icon: <Heart className="size-8" />, label: 'Heart' },
  { name: 'bee', icon: <BeeIcon className="size-8" />, label: 'Bee' },
  { name: 'wax-seal', icon: <WaxSealIcon className="size-8" />, label: 'Seal' },
];

export function LetterEditor() {
  const { toast } = useToast();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [paperColor, setPaperColor] = useState<PaperColor>('cream');
  const [stamp, setStamp] = useState<Stamp>('heart');
  const [font, setFont] = useState<AppFont>('Alegreya');
  const [hasAskedBee, setHasAskedBee] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Letter',
        description: 'You can\'t send an empty letter!',
      });
      return;
    }

    setIsSending(true);
    // In a real app, this would save to Firestore.
    // Here we'll just simulate it and show a toast.
    const newLetter: Partial<Letter> = {
        id: new Date().getTime().toString(),
        content,
        config: { paperColor, stamp, font },
        senderName: currentUser,
        recipientName: otherUser,
        createdAt: new Date().toISOString(),
        status: 'sent',
        isRead: false
    }

    console.log('Sending letter:', newLetter);

    setTimeout(() => {
        setIsSending(false);
        toast({
            title: 'Letter Sent!',
            description: 'Your sweet note is on its way.',
        });
        router.push('/inbox');
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <Card className={cn('min-h-[300px] shadow-lg transition-colors', paperColors.find(p => p.name === paperColor)?.class)}>
        <CardContent className="p-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your heart out..."
            className={cn(
              'min-h-[300px] resize-none border-0 bg-transparent p-2 text-lg !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0',
              font === 'Belleza' ? 'font-headline' : 'font-body'
            )}
          />
        </CardContent>
      </Card>
      <div className="mt-6 space-y-6">
        <div>
          <Label className="mb-2 block font-headline text-lg">Paper Color</Label>
          <div className="flex justify-around rounded-2xl bg-muted/50 p-2">
            {paperColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setPaperColor(color.name)}
                className={cn(
                  'size-10 rounded-full border-2 transition-all',
                  color.class,
                  paperColor === color.name
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'border-transparent'
                )}
                aria-label={`Set paper color to ${color.label}`}
              />
            ))}
          </div>
        </div>
        <div>
          <Label className="mb-2 block font-headline text-lg">Stamp</Label>
          <div className="flex justify-around rounded-2xl bg-muted/50 p-2">
            {stamps.map((s) => (
              <button
                key={s.name}
                onClick={() => setStamp(s.name)}
                className={cn(
                  'flex size-12 items-center justify-center rounded-full text-primary transition-all',
                  stamp === s.name
                    ? 'bg-primary/20 ring-2 ring-primary ring-offset-2'
                    : 'bg-transparent'
                )}
                aria-label={`Select ${s.label} stamp`}
              >
                {s.icon}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="font-select" className="mb-2 block font-headline text-lg">
            Font Style
          </Label>
          <Select onValueChange={(v: AppFont) => setFont(v)} defaultValue={font}>
            <SelectTrigger id="font-select" className="h-12 rounded-2xl">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alegreya" className="font-body">
                Alegreya (Serif)
              </SelectItem>
              <SelectItem value="Belleza" className="font-headline">
                Belleza (Sans-serif)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4 pt-4">
          <AIFeedbackDialog
            letterContent={content}
            onFeedbackReceived={() => setHasAskedBee(true)}
          />
          <Button
            onClick={handleSend}
            disabled={!hasAskedBee || isSending}
            className="h-[60px] w-full rounded-3xl text-lg font-bold"
          >
            {isSending ? 'Sending...' : 'Send Your Letter'}
          </Button>
          {!hasAskedBee && (
            <p className="text-center text-xs text-foreground/60">
              You must &quot;Ask the Bee Guide&quot; for feedback before sending.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
