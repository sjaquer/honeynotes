import { Mail } from 'lucide-react';
import { mockLetters, currentUser } from '@/lib/data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function InboxPage() {
  const receivedLetters = mockLetters.filter(
    (letter) => letter.recipientName === currentUser
  );

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="font-headline text-3xl font-bold text-primary">Inbox</h1>
        <p className="text-foreground/70">
          You have {receivedLetters.filter((l) => !l.isRead).length} unread
          note(s).
        </p>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {receivedLetters.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-foreground/60">
            <p>Your inbox is empty.
            <br />
            Waiting for a sweet note from your love...
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {receivedLetters.map((letter) => (
              <li key={letter.id}>
                <Link
                  href={`/letter/${letter.id}`}
                  className={cn(
                    'block rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md',
                    !letter.isRead && 'border-primary/50 bg-primary/5'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'mt-1 flex-shrink-0',
                        !letter.isRead && 'tremble'
                      )}
                    >
                      <Mail className="size-8 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-baseline justify-between">
                        <p className="font-headline text-xl font-semibold text-foreground">
                          {letter.senderName}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {formatDistanceToNow(new Date(letter.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <p className="truncate pt-1 text-sm text-foreground/70">
                        {letter.content}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
