'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckinFlow } from '@/components/CheckinFlow';
import { CheckinContext } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Suspense } from 'react';

function CheckinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { todayEntry } = useAppStore();

  const mode = (searchParams.get('mode') ?? 'morning') as CheckinContext;
  const alreadyDone = mode === 'morning' ? todayEntry?.morning_done : todayEntry?.evening_done;

  if (alreadyDone) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <p className="text-5xl">✅</p>
        <h2 className="text-xl font-semibold">
          {mode === 'morning' ? 'Morgen' : 'Abend'}-Check-in bereits erledigt
        </h2>
        <p className="text-sm text-muted-foreground">Komm heute Abend wieder! 👋</p>
        <button
          onClick={() => router.push('/')}
          className="text-sm text-primary underline underline-offset-4"
        >
          Zurück zum Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-6 px-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {mode === 'morning' ? '🌅 Morgen-Check-in' : '🌙 Abend-Check-in'}
        </span>
      </div>
      <CheckinFlow context={mode} onComplete={() => router.push('/')} />
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense>
      <CheckinContent />
    </Suspense>
  );
}
