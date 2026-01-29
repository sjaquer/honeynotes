import { LetterEditor } from './_components/LetterEditor';

export default function NewLetterPage() {
  return (
    <div className="flex flex-1 flex-col">
       <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="font-headline text-3xl font-bold text-primary">New Letter</h1>
        <p className="text-foreground/70">
          Write a sweet note for your love.
        </p>
      </header>
      <LetterEditor />
    </div>
  );
}
