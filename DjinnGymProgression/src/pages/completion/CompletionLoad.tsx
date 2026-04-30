'use client';

import { Suspense } from 'react';
import CompletionContent from './CompletionContent';

export default function CompletionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <CompletionContent />
    </Suspense>
  );
}
