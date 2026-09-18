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
  const [topic, setTopic] = useState('');
  const [allowFallback, setAllowFallback] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/cron-log', { credentials: 'same-origin' });
      if (!res.ok) return [];
      const data = await res.json();
      const items = data.items || [];
      setLogs(items);
      return items;
    } catch (_) { return []; } finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const trigger = async () => {
    const previousLogIds = new Set(logs.map((log) => log.id));
    const requestedTopic = topic.trim();
    setTriggering(true);
    try {
      const res = await fetch('/api/admin/cron-trigger', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf() }, body: JSON.stringify({ topic: requestedTopic, fallback: allowFallback }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao disparar');
      emitFeedback('success', 'Execução enfileirada. Aguardando o resultado…');
      setTopic('');
      const startedAt = Date.now();
      let result = null;
      while (Date.now() - startedAt < 120000) {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        const items = await fetchLogs();
        result = items.find((log) => !previousLogIds.has(log.id));
        if (result) break;
      }
      if (!result) {
        emitFeedback('error', 'A execução foi enfileirada, mas ainda não terminou. Atualize os registros em alguns instantes.');
      } else if (result.status === 'success') {
        emitFeedback('success', requestedTopic ? 'Artigo gerado e publicado.' : 'Pipeline concluído com sucesso.');
      } else if (result.status === 'skipped') {
        emitFeedback('error', `A pauta foi pulada: ${result.topic || 'já existe uma pauta semelhante'}.`);
      } else {
        emitFeedback('error', result.error_message || 'A geração falhou. Nenhum fallback foi usado.');
      }
    } catch (err) { emitFeedback('error', err.message); } finally { setTriggering(false); }
  };

  const lastSuccess = logs.find((l) => l.status === 'success');
  const errorCount = logs.filter((l) => l.status === 'error').length;

  return <Panel className="p-5">
    <PanelTitle icon={Bot} eyebrow="Automação" title="IA Autopilot" action={<button type="button" onClick={trigger} disabled={triggering} className={`${buttonClass} inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-zinc-950 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60`}><Play className="h-3.5 w-3.5" />{triggering ? 'Gerando…' : 'Gerar agora'}</button>} />
    <div className="mt-5">
      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Tema manual <span className="font-normal text-zinc-400">/ opcional</span>
        <input value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={180} placeholder="Ex.: como economizar na conta de luz" className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950" />
      </label>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">Preencha para gerar esse tema. Deixe vazio para a IA escolher uma pauta.</p>
      <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <input type="checkbox" checked={allowFallback} onChange={(event) => setAllowFallback(event.target.checked)} className="h-4 w-4 accent-emerald-500" />
        Permitir fallback para outros modelos se o Gemini local falhar
      </label>
    </div>
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
          <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{log.topic || 'Execução automática'}</p>
          <p className="mt-0.5 text-[11px] text-zinc-400">{formatDate(log.ran_at)} · {log.duration_ms ? `${(log.duration_ms / 1000).toFixed(1)}s` : '—'}{log.slug ? ` · ${log.slug}` : ''}</p>
          {log.error_message && <p className="mt-1 truncate text-[11px] text-red-400">{log.error_message}</p>}
        </div>
        <StatusBadge status={log.status} />
      </div>)}
    </div>}
  </Panel>;
}
