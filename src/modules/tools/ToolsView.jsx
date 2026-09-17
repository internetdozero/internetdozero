import React from 'react';
import { ArrowLeft, ArrowRight, AudioLines, Braces, FileAudio, FileDiff, FileText, Image, KeyRound, QrCode, Scissors, ShieldOff, Wrench } from 'lucide-react';
import { ImageCompressor } from './components/ImageCompressor';
import { PasswordGenerator } from './components/PasswordGenerator';
import { AudioMasterizer } from './components/AudioMasterizer';
import { MetadataStripper } from './components/MetadataStripper';
import { AudioTrimmer } from './components/AudioTrimmer';
import { VideoAudioExtractor } from './components/VideoAudioExtractor';
import { TextCounter } from './components/TextCounter';
import { QrCodeGenerator } from './components/QrCodeGenerator';
import { DiffChecker } from './components/DiffChecker';
import { JsonFormatter } from './components/JsonFormatter';
import { ToolGuideCard } from './components/ToolGuideCard';

export function ToolsView({ onNavigate, toolSlug, lang = 'pt' }) {
  const isEn = lang === 'en';
  const isCompressor = toolSlug === 'compressor-de-imagem';
  const isPasswordGenerator = toolSlug === 'gerador-de-senhas';
  const isAudioMasterizer = toolSlug === 'masterizador-de-audio';
  const isMetadataStripper = toolSlug === 'remover-metadados';
  const isAudioTrimmer = toolSlug === 'cortador-de-audio';
  const isVideoAudioExtractor = toolSlug === 'extrator-de-audio';
  const isTextCounter = toolSlug === 'contador-de-texto';
  const isQrCodeGenerator = toolSlug === 'gerador-de-qr-code';
  const isDiffChecker = toolSlug === 'comparador-de-texto';
  const isJsonFormatter = toolSlug === 'formatador-json';
  const compressorPath = isEn ? '/tools/image-compressor' : '/tools/compressor-de-imagem';
  const passwordGeneratorPath = isEn ? '/tools/password-generator' : '/tools/gerador-de-senhas';
  const audioMasterizerPath = isEn ? '/tools/audio-master' : '/tools/masterizador-de-audio';
  const metadataStripperPath = isEn ? '/tools/metadata-remover' : '/tools/remover-metadados';
  const audioTrimmerPath = isEn ? '/tools/audio-trimmer' : '/tools/cortador-de-audio';
  const videoAudioExtractorPath = isEn ? '/tools/video-audio-extractor' : '/tools/extrator-de-audio';
  const textCounterPath = isEn ? '/tools/text-counter' : '/tools/contador-de-texto';
  const qrCodeGeneratorPath = isEn ? '/tools/qr-code-generator' : '/tools/gerador-de-qr-code';
  const diffCheckerPath = isEn ? '/tools/text-diff-checker' : '/tools/comparador-de-texto';
  const jsonFormatterPath = isEn ? '/tools/json-formatter' : '/tools/formatador-json';

  if (isCompressor) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <ImageCompressor lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isPasswordGenerator) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <PasswordGenerator lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isAudioMasterizer) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <AudioMasterizer lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isMetadataStripper) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <MetadataStripper lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isAudioTrimmer) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <AudioTrimmer lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isVideoAudioExtractor) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <VideoAudioExtractor lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isTextCounter) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <TextCounter lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isQrCodeGenerator) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <QrCodeGenerator lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isDiffChecker) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500"><ArrowLeft className="h-3.5 w-3.5" />{isEn ? 'Back to tools' : 'Voltar às ferramentas'}</button>
        <DiffChecker lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  if (isJsonFormatter) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500"><ArrowLeft className="h-3.5 w-3.5" />{isEn ? 'Back to tools' : 'Voltar às ferramentas'}</button>
        <JsonFormatter lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={toolSlug} lang={lang} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <button type="button" onClick={() => onNavigate('/')} className="mb-8 inline-flex w-fit items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
        <ArrowLeft className="h-3.5 w-3.5" />
        {isEn ? 'Back to home' : 'Voltar ao início'}
      </button>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
        <Wrench className="h-6 w-6" />
      </div>
      <h1 className="mt-3 font-mono text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
        {isEn ? 'Tools for real life.' : 'Ferramentas para a vida real.'}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
        {isEn ? 'Simple utilities, processed in your browser. No accounts, no uploads, no noise.' : 'Utilitários simples, processados no seu navegador. Sem cadastro, sem upload, sem barulho.'}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <button type="button" onClick={() => onNavigate(compressorPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><Image className="h-5 w-5" /></span>
            <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
          </div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Image compressor' : 'Compressor de imagens'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Reduce file size locally and download the result.' : 'Reduza o tamanho do arquivo localmente e baixe o resultado.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{compressorPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(passwordGeneratorPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><KeyRound className="h-5 w-5" /></span>
            <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
          </div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Password generator' : 'Gerador de senhas'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Create strong passwords locally in a few seconds.' : 'Crie senhas fortes localmente em poucos segundos.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{passwordGeneratorPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(audioMasterizerPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><AudioLines className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" /></div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Audio masterizer' : 'Masterizador de áudio'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Balance volume and dynamics in your browser.' : 'Equilibre volume e dinâmica direto no navegador.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{audioMasterizerPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(metadataStripperPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><ShieldOff className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" /></div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Metadata remover' : 'Removedor de metadados'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Remove private data before sharing an image.' : 'Remova dados pessoais antes de compartilhar uma imagem.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{metadataStripperPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(audioTrimmerPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><Scissors className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" /></div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Audio trimmer' : 'Cortador de áudio'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Keep only the part you need from an audio file.' : 'Fique só com o trecho que precisa de um áudio.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{audioTrimmerPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(videoAudioExtractorPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><FileAudio className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" /></div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Video audio extractor' : 'Extrator de áudio de vídeo'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Keep the sound from a video as a WAV file.' : 'Extraia o som de um vídeo e baixe em WAV.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{videoAudioExtractorPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(textCounterPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><FileText className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" /></div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Text counter' : 'Contador de texto'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Count words, characters and reading time as you write.' : 'Conte palavras, caracteres e tempo de leitura em tempo real.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{textCounterPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(qrCodeGeneratorPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><QrCode className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" /></div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Styled QR code' : 'Gerador de QR Code'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Create a custom QR code and download it as PNG or SVG.' : 'Crie um QR Code customizado e baixe em PNG ou SVG.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{qrCodeGeneratorPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(diffCheckerPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><FileDiff className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" /></div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Text diff checker' : 'Comparador de texto'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Compare two texts or code files line by line.' : 'Compare dois textos ou arquivos de código linha por linha.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{diffCheckerPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(jsonFormatterPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><Braces className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" /></div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'JSON formatter' : 'Formatador de JSON'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Format, minify and validate JSON locally.' : 'Formate, compacte e valide JSON localmente.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{jsonFormatterPath}</span>
        </button>
      </div>
      <ToolGuideCard onNavigate={onNavigate} lang={lang} />
    </main>
  );
}
