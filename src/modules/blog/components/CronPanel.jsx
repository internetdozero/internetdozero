import React, { useEffect, useState } from 'react';
import { Bot, CheckCircle2, Clock, Play, XCircle } from 'lucide-react';
import { emitFeedback } from '../../../components/FeedbackModal';
import { buttonClass, Panel, PanelTitle } from './AdminPrimitives';

const csrf = () => sessionStorage.getItem('idz_admin_csrf') || '';

const statusBadge = {
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', label: 'sucesso' },
  error: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', label: 'erro' },
  skipped: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', label: 'pulado' },
  pending: { bg: 'bg-zinc-500/10', text: 'text-zinc-500', label: 'pendente' }
};

function StatusBadge({ status }) {
  const s = statusBadge[status] || statusBadge.pending;
  return <span className={`shrink-0 rounded-full px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>{s.label}</span>;
}

function formatDate(iso) {
  if (!iso) return '—';
  try { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)); } catch (_) { return iso; }
}

export function CronPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/cron-log', { credentials: 'same-origin' });
      if (!res.ok) return;
      const data = await res.json();
      setLogs(data.items || []);
    } catch (_) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const trigger = async () => {
    setTriggering(true);
    try {
      const res = await fetch('/api/admin/cron-trigger', { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRF-Token': csrf() } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao disparar');
      emitFeedback('success', 'Pipeline disparado com sucesso.');
      setTimeout(fetchLogs, 3000);
    } catch (err) { emitFeedback('error', err.message); } finally { setTriggering(false); }
  };

  const lastSuccess = logs.find((l) => l.status === 'success');
  const errorCount = logs.filter((l) => l.status === 'error').length;

  return <Panel className="p-5">
    <PanelTitle icon={Bot} eyebrow="Automação" title="IA Autopilot" action={<button type="button" onClick={trigger} disabled={triggering} className={`${buttonClass} inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-zinc-950 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60`}><Play className="h-3.5 w-3.5" />{triggering ? 'Gerando…' : 'Gerar agora'}</button>} />
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950">
        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Último sucesso</p>
        <p className="mt-1 text-sm font-bold tabular-nums">{lastSuccess ? formatDate(lastSuccess.ran_at) : '—'}</p>
      </div>
      <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950">
        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Erros recentes</p>
        <p className={`mt-1 text-sm font-bold tabular-nums ${errorCount > 0 ? 'text-red-500' : ''}`}>{errorCount}</p>
      </div>
    </div>
    {loading ? <p className="mt-5 text-center text-xs text-zinc-500">Carregando…</p> : logs.length === 0 ? <p className="mt-5 rounded-2xl bg-zinc-50 p-5 text-center text-xs text-zinc-500 dark:bg-zinc-950">Nenhuma execução registrada.</p> : <div className="mt-5 max-h-[280px] space-y-2 overflow-y-auto pr-1">
      {logs.map((log) => <div key={log.id} className="flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-950">
        {log.status === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : log.status === 'error' ? <XCircle className="h-4 w-4 shrink-0 text-red-500" /> : <Clock className="h-4 w-4 shrink-0 text-amber-500" />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{log.topic || 'Sem tema'}</p>
          <p className="mt-0.5 text-[11px] text-zinc-400">{formatDate(log.ran_at)} · {log.duration_ms ? `${(log.duration_ms / 1000).toFixed(1)}s` : '—'}{log.slug ? ` · ${log.slug}` : ''}</p>
          {log.error_message && <p className="mt-1 truncate text-[11px] text-red-400">{log.error_message}</p>}
        </div>
        <StatusBadge status={log.status} />
      </div>)}
    </div>}
  </Panel>;
}
