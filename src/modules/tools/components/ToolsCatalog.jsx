import React from 'react';
import { ArrowLeft, ArrowRight, ArrowLeftRight, AudioLines, Braces, FileAudio, FileDiff, FileText, FolderArchive, Image, KeyRound, QrCode, Scissors, ShieldOff, Wrench } from 'lucide-react';
import { ToolGuideCard } from './ToolGuideCard';

const catalogItems = [
  { slugPt: 'compressor-de-imagem', slugEn: 'image-compressor', titlePt: 'Compressor de imagens', titleEn: 'Image compressor', descPt: 'Reduza o tamanho do arquivo localmente e baixe o resultado.', descEn: 'Reduce file size locally and download the result.', Icon: Image },
  { slugPt: 'descompactador-de-arquivos', slugEn: 'archive-extractor', titlePt: 'Descompactador (.7z, .rar, .zip)', titleEn: 'Archive extractor (.7z, .rar, .zip)', descPt: 'Extraia .7z, .rar, .zip e .tar localmente via WebAssembly.', descEn: 'Extract .7z, .rar, .zip and .tar locally via WebAssembly.', Icon: FolderArchive },
  { slugPt: 'conversor-de-arquivos', slugEn: 'file-converter', titlePt: 'Conversor de arquivos (X para Y)', titleEn: 'File converter (X to Y)', descPt: 'Converta arquivos entre extensões sem envio a servidores.', descEn: 'Convert files between extensions without server uploads.', Icon: ArrowLeftRight },
  { slugPt: 'gerador-de-senhas', slugEn: 'password-generator', titlePt: 'Gerador de senhas', titleEn: 'Password generator', descPt: 'Crie senhas fortes localmente em poucos segundos.', descEn: 'Create strong passwords locally in a few seconds.', Icon: KeyRound },
  { slugPt: 'masterizador-de-audio', slugEn: 'audio-master', titlePt: 'Masterizador de áudio', titleEn: 'Audio masterizer', descPt: 'Equilibre volume e dinâmica direto no navegador.', descEn: 'Balance volume and dynamics in your browser.', Icon: AudioLines },
  { slugPt: 'remover-metadados', slugEn: 'metadata-remover', titlePt: 'Removedor de metadados', titleEn: 'Metadata remover', descPt: 'Remova dados pessoais antes de compartilhar uma imagem.', descEn: 'Remove private data before sharing an image.', Icon: ShieldOff },
  { slugPt: 'cortador-de-audio', slugEn: 'audio-trimmer', titlePt: 'Cortador de áudio', titleEn: 'Audio trimmer', descPt: 'Fique só com o trecho que precisa de um áudio.', descEn: 'Keep only the part you need from an audio file.', Icon: Scissors },
  { slugPt: 'extrator-de-audio', slugEn: 'video-audio-extractor', titlePt: 'Extrator de áudio de vídeo', titleEn: 'Video audio extractor', descPt: 'Extraia o som de um vídeo e baixe em WAV.', descEn: 'Keep the sound from a video as a WAV file.', Icon: FileAudio },
  { slugPt: 'contador-de-texto', slugEn: 'text-counter', titlePt: 'Contador de texto', titleEn: 'Text counter', descPt: 'Conte palavras, caracteres e tempo de leitura em tempo real.', descEn: 'Count words, characters and reading time as you write.', Icon: FileText },
  { slugPt: 'gerador-de-qr-code', slugEn: 'qr-code-generator', titlePt: 'Gerador de QR Code', titleEn: 'Styled QR code', descPt: 'Crie um QR Code customizado e baixe em PNG ou SVG.', descEn: 'Create a custom QR code and download it as PNG or SVG.', Icon: QrCode },
  { slugPt: 'comparador-de-texto', slugEn: 'text-diff-checker', titlePt: 'Comparador de texto', titleEn: 'Text diff checker', descPt: 'Compare dois textos ou arquivos de código linha por linha.', descEn: 'Compare two texts or code files line by line.', Icon: FileDiff },
  { slugPt: 'formatador-json', slugEn: 'json-formatter', titlePt: 'Formatador de JSON', titleEn: 'JSON formatter', descPt: 'Formate, compacte e valide JSON localmente.', descEn: 'Format, minify and validate JSON locally.', Icon: Braces }
];

export function ToolsCatalog({ onNavigate, lang = 'pt' }) {
  const isEn = lang === 'en';

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
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalogItems.map((item) => {
          const path = `/tools/${isEn ? item.slugEn : item.slugPt}`;
          const Icon = item.Icon;
          return (
            <button key={item.slugPt} type="button" onClick={() => onNavigate(path)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900/60 cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><Icon className="h-5 w-5" /></span>
                <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
              </div>
              <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? item.titleEn : item.titlePt}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? item.descEn : item.descPt}</p>
              <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{path}</span>
            </button>
          );
        })}
      </div>
      <ToolGuideCard onNavigate={onNavigate} lang={lang} />
    </main>
  );
}
