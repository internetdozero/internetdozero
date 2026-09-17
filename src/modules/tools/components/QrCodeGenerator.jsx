import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, ImagePlus, QrCode, RefreshCw, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';

const SIZE = 1024;
const MARGIN = 4;
const PREVIEW_TEXT = 'https://internetdozero.com.br';

function drawModules(ctx, qr, color, background, rounded) {
  const count = qr.modules.size;
  const unit = SIZE / (count + MARGIN * 2);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = color;
  for (let row = 0; row < count; row += 1) for (let column = 0; column < count; column += 1) {
    if (!qr.modules.get(row, column)) continue;
    const x = (column + MARGIN) * unit;
    const y = (row + MARGIN) * unit;
    if (!rounded) ctx.fillRect(x, y, unit + 0.5, unit + 0.5);
    else { const radius = unit * 0.28; ctx.beginPath(); ctx.roundRect(x, y, unit + 0.5, unit + 0.5, radius); ctx.fill(); }
  }
  return unit;
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function makeSvg(qr, color, background, rounded, logo) {
  if (!HEX_COLOR.test(color) || !HEX_COLOR.test(background)) return '';
  const safeLogo = logo && /^data:image\/[a-z+]+;base64,/.test(logo) ? logo : '';
  const count = qr.modules.size;
  const unit = SIZE / (count + MARGIN * 2);
  const modules = [];
  for (let row = 0; row < count; row += 1) for (let column = 0; column < count; column += 1) if (qr.modules.get(row, column)) {
    const x = (column + MARGIN) * unit;
    const y = (row + MARGIN) * unit;
    modules.push(`<rect x="${x}" y="${y}" width="${unit + 0.5}" height="${unit + 0.5}"${rounded ? ` rx="${unit * 0.28}"` : ''}/>`);
  }
  const logoMarkup = safeLogo ? `<rect x="${SIZE * 0.38}" y="${SIZE * 0.38}" width="${SIZE * 0.24}" height="${SIZE * 0.24}" rx="${SIZE * 0.025}" fill="${background}"/><image href="${safeLogo}" x="${SIZE * 0.4}" y="${SIZE * 0.4}" width="${SIZE * 0.2}" height="${SIZE * 0.2}" preserveAspectRatio="xMidYMid slice"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="QR Code"><rect width="100%" height="100%" fill="${background}"/><g fill="${color}">${modules.join('')}</g>${logoMarkup}</svg>`;
}

export function QrCodeGenerator({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const inputRef = useRef(null);
  const [text, setText] = useState(PREVIEW_TEXT);
  const [color, setColor] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [rounded, setRounded] = useState(true);
  const [logo, setLogo] = useState('');
  const [download, setDownload] = useState(null);
  const [error, setError] = useState('');
  const qr = useMemo(() => { try { return QRCode.create(text.trim() || PREVIEW_TEXT, { errorCorrectionLevel: 'H' }); } catch { return null; } }, [text]);
  const svg = useMemo(() => qr && makeSvg(qr, color, background, rounded, logo), [qr, color, background, rounded, logo]);

  useEffect(() => () => { if (download?.url) URL.revokeObjectURL(download.url); }, [download]);

  const selectLogo = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError(isEn ? 'Choose an image for the logo.' : 'Escolha uma imagem para a logo.');
    if (file.size > 2 * 1024 * 1024) return setError(isEn ? 'The logo limit is 2 MB.' : 'A logo deve ter até 2 MB.');
    const reader = new FileReader();
    reader.onload = () => { setLogo(reader.result); setError(''); };
    reader.readAsDataURL(file);
  };

  const exportQr = async (format) => {
    if (!qr) return;
    try {
      if (format === 'svg') setDownload({ url: URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })), name: 'qr-code.svg', label: 'SVG' });
      else {
        const canvas = document.createElement('canvas'); canvas.width = SIZE; canvas.height = SIZE;
        const ctx = canvas.getContext('2d'); drawModules(ctx, qr, color, background, rounded);
        if (logo) await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => { ctx.fillStyle = background; ctx.fillRect(SIZE * 0.38, SIZE * 0.38, SIZE * 0.24, SIZE * 0.24); ctx.drawImage(image, SIZE * 0.4, SIZE * 0.4, SIZE * 0.2, SIZE * 0.2); resolve(); }; image.onerror = reject; image.src = logo; });
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error(isEn ? 'Could not export the PNG.' : 'Não foi possível exportar o PNG.');
        setDownload({ url: URL.createObjectURL(blob), name: 'qr-code.png', label: 'PNG' });
      }
      setError('');
    } catch (exportError) { setError(exportError.message); }
  };

  const clearLogo = () => { setLogo(''); if (inputRef.current) inputRef.current.value = ''; };
  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="qr-code-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">geração local</p><h2 id="qr-code-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Styled QR code' : 'Gerador de QR Code'}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Create a custom QR code and download it as PNG or SVG.' : 'Crie um QR Code customizado e baixe em PNG ou SVG.'}</p></div><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} /></div></div>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_300px]">
        <div className="flex min-h-[24rem] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 p-6 dark:border-zinc-800 dark:bg-zinc-950/50"><div className="w-full max-w-[23rem] bg-white p-3 shadow-sm" dangerouslySetInnerHTML={{ __html: svg }} />{!text.trim() && <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">{isEn ? 'Example preview' : 'Prévia de exemplo'}</p>}</div>
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"><label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">{isEn ? 'Text or URL' : 'Texto ou URL'}<textarea value={text} onChange={(event) => setText(event.target.value)} rows="3" placeholder={isEn ? 'https://…' : 'https://…'} className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-800 outline-none focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{isEn ? 'QR color' : 'Cor do QR'}<input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="mt-2 h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900" /></label><label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{isEn ? 'Background' : 'Fundo'}<input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="mt-2 h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900" /></label></div><label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400"><input type="checkbox" checked={rounded} onChange={(event) => setRounded(event.target.checked)} className="h-4 w-4 accent-emerald-500" />{isEn ? 'Rounded modules' : 'Módulos arredondados'}</label><input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => selectLogo(event.target.files?.[0])} /><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-bold text-zinc-700 hover:border-emerald-500 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-700 dark:text-zinc-300"><ImagePlus className="h-4 w-4" />{logo ? (isEn ? 'Change logo' : 'Trocar logo') : (isEn ? 'Add center logo' : 'Adicionar logo central')}</button>{logo && <button type="button" onClick={clearLogo} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><RefreshCw className="h-3.5 w-3.5" />{isEn ? 'Remove logo' : 'Remover logo'}</button>}<div className="border-t border-zinc-200 pt-4 dark:border-zinc-800"><p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{isEn ? 'Download' : 'Baixar'}</p><div className="grid grid-cols-2 gap-2"><button type="button" disabled={!qr} onClick={() => exportQr('png')} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-bold text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"><Download className="h-4 w-4" />PNG</button><button type="button" disabled={!qr} onClick={() => exportQr('svg')} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 px-3 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40 dark:text-emerald-400"><QrCode className="h-4 w-4" />SVG</button></div>{download && <a href={download.url} download={download.name} className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 text-xs font-bold text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-300"><Download className="h-3.5 w-3.5" />{isEn ? `Download ${download.label}` : `Baixar ${download.label}`}</a>}</div>{error && <p role="alert" className="text-xs font-semibold text-red-500">{error}</p>}</div>
      </div>
    </section>
  );
}
