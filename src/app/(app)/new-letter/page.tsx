'use client';

import { LetterEditor } from './_components/LetterEditor';

export default function NewLetterPage() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col overflow-hidden">
      <LetterEditor />
    </div>
  );
}
