import React from 'react';
import { useSeo } from '../../hooks/useSeo';
import { toolsMetadata, toolAliases } from './data/toolsMeta';
import { ToolHeaderBar } from './components/ToolHeaderBar';
import { ToolFaqSection } from './components/ToolFaqSection';
import { ToolGuideCard } from './components/ToolGuideCard';
import { ToolsCatalog } from './components/ToolsCatalog';
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

const toolComponents = {
  'compressor-de-imagem': ImageCompressor,
  'gerador-de-senhas': PasswordGenerator,
  'masterizador-de-audio': AudioMasterizer,
  'remover-metadados': MetadataStripper,
  'cortador-de-audio': AudioTrimmer,
  'extrator-de-audio': VideoAudioExtractor,
  'contador-de-texto': TextCounter,
  'gerador-de-qr-code': QrCodeGenerator,
  'comparador-de-texto': DiffChecker,
  'formatador-json': JsonFormatter
};

export function ToolsView({ onNavigate, toolSlug, lang = 'pt' }) {
  const isEn = lang === 'en';
  const resolvedSlug = toolAliases[toolSlug] || toolSlug;
  const meta = toolsMetadata[resolvedSlug];
  const ToolComponent = resolvedSlug ? toolComponents[resolvedSlug] : null;

  const pageTitle = meta
    ? `${isEn ? meta.h1En : meta.h1Pt} — Internet do Zero`
    : (isEn ? 'Local Web Utilities & Tools — Internet do Zero' : 'Ferramentas Web Locais & Privadas — Internet do Zero');

  const pageDesc = meta
    ? (isEn ? meta.descEn : meta.descPt)
    : (isEn ? 'Free local utilities running in your browser: image compressor, audio extractor, QR code, and more.' : '10 utilitários rápidos que rodam no seu navegador sem enviar arquivos para servidores.');

  const pageUrl = typeof window !== 'undefined'
    ? (resolvedSlug ? `${window.location.origin}/tools/${resolvedSlug}` : `${window.location.origin}/tools`)
    : (resolvedSlug ? `https://internetdozero.com.br/tools/${resolvedSlug}` : 'https://internetdozero.com.br/tools');

  useSeo({
    title: pageTitle,
    description: pageDesc,
    url: pageUrl,
    image: 'https://internetdozero.com.br/og-image.png'
  });

  if (ToolComponent && meta) {
    const toolTitle = isEn ? meta.nameEn : meta.namePt;
    const toolH1 = isEn ? meta.h1En : meta.h1Pt;

    return (
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <ToolHeaderBar onBack={() => onNavigate('/tools')} title={toolTitle} toolSlug={resolvedSlug} lang={lang} />
        <h1 className="sr-only">{toolH1}</h1>
        <ToolComponent lang={lang} />
        <ToolFaqSection toolMeta={meta} lang={lang} />
        <ToolGuideCard onNavigate={onNavigate} currentSlug={resolvedSlug} lang={lang} />
      </main>
    );
  }

  return <ToolsCatalog onNavigate={onNavigate} lang={lang} />;
}
