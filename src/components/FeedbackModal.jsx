import React, { useEffect, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

const EVENT_NAME = 'idz:feedback';

export function emitFeedback(type, message) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type, message } }));
}

export function FeedbackModal() {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleFeedback = (event) => setFeedback(event.detail);
    window.addEventListener(EVENT_NAME, handleFeedback);
    return () => window.removeEventListener(EVENT_NAME, handleFeedback);
  }, []);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(null), 4500);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  if (!feedback) return null;
  const success = feedback.type === 'success';
  const Icon = success ? CheckCircle2 : XCircle;

  return (
    <div className="fixed inset-x-0 bottom-5 z-[100] flex justify-center px-4 pointer-events-none" role={success ? 'status' : 'alert'} aria-live="polite">
      <div className={`pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border px-4 py-3.5 bg-zinc-950/95 shadow-2xl backdrop-blur-md ${success ? 'border-emerald-500/60' : 'border-red-500/60'}`}>
        <Icon className={`h-5 w-5 shrink-0 ${success ? 'text-emerald-400' : 'text-red-400'}`} aria-hidden="true" />
        <p className="min-w-0 flex-1 text-sm text-white leading-snug">{feedback.message}</p>
        <button type="button" onClick={() => setFeedback(null)} className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400" aria-label="Fechar feedback">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
