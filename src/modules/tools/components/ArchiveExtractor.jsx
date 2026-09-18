import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Archive as ArchiveIcon, Download, File, FolderArchive, Loader2, RotateCcw, ShieldCheck, Upload, AlertCircle, FileText, FileCode, FileImage, FileAudio } from 'lucide-react';
import { Archive } from 'libarchive.js';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp'].includes(ext)) return FileImage;
  if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) return FileAudio;
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'rs', 'go', 'c', 'cpp'].includes(ext)) return FileCode;
  if (['txt', 'md', 'pdf', 'doc', 'docx'].includes(ext)) return FileText;
  return File;
}

function flattenExtractedFiles(obj, parentPath = '') {
  let list = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = parentPath ? `${parentPath}/${key}` : key;
    if (value instanceof window.File || value instanceof window.Blob) {
      list.push({
        path: currentPath,
        name: key,
        size: value.size,
        file: value
      });
    } else if (typeof value === 'object' && value !== null) {
      list = list.concat(flattenExtractedFiles(value, currentPath));
    }
  }
  return list;
}

export function ArchiveExtractor({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      Archive.init({ workerUrl: '/libarchive/worker-bundle.js' });
    } catch {
      // Já inicializado ou fallback
    }
  }, []);

  const handleProcessArchive = useCallback(async (file) => {
    if (!file) return;
    setError('');
    setSelectedFile(file);
    setIsLoading(true);
    setStatusMessage(isEn ? 'Reading archive header with WebAssembly...' : 'Carregando estrutura compactada via WebAssembly...');
    setExtractedFiles([]);

    try {
      const archive = await Archive.open(file);
      setStatusMessage(isEn ? 'Extracting files locally...' : 'Extraindo arquivos localmente...');
      const extractedObj = await archive.extractFiles();
      const flatList = flattenExtractedFiles(extractedObj);

      if (flatList.length === 0) {
        setError(isEn ? 'The archive is empty or format could not be decoded.' : 'O arquivo compactado está vazio ou o formato não pôde ser decodificado.');
      } else {
        setExtractedFiles(flatList);
      }
    } catch (err) {
      setError(isEn ? `Failed to extract: ${err.message || 'Invalid or password-protected archive'}` : `Erro na extração: ${err.message || 'Arquivo corrompido, protegido por senha ou formato não suportado.'}`);
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [isEn]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessArchive(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadSingle = (item) => {
    const url = URL.createObjectURL(item.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleDownloadAll = () => {
    extractedFiles.forEach((item, index) => {
      setTimeout(() => handleDownloadSingle(item), index * 200);
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedFiles([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
        <div className="flex items-center gap-3 text-xs font-mono text-stone-600 dark:text-stone-400 mb-6">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{isEn ? '100% Client-Side WebAssembly — No files leave your computer' : 'Processamento 100% local via WebAssembly — Nenhum arquivo é enviado para servidores'}</span>
        </div>

        {!selectedFile && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-10 text-center hover:border-stone-500 transition-colors"
          >
            <FolderArchive className="h-12 w-12 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" />
            <p className="font-mono text-base font-bold text-zinc-900 dark:text-white mb-1">
              {isEn ? 'Drag and drop your compressed file here' : 'Arraste seu arquivo compactado aqui'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-mono">
              .7z, .rar, .zip, .tar, .tar.gz, .tgz, .bz2
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => e.target.files && handleProcessArchive(e.target.files[0])}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-stone-500 text-zinc-950 hover:bg-stone-400 transition-all cursor-pointer shadow-xs"
            >
              <Upload className="h-4 w-4" />
              <span>{isEn ? 'Select file from computer' : 'Selecionar arquivo do computador'}</span>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-stone-500" />
            <p className="font-mono text-sm text-zinc-800 dark:text-zinc-200">{statusMessage}</p>
            <p className="text-xs text-zinc-500 font-mono">{isEn ? 'Large archives might take a few moments...' : 'Arquivos pesados podem levar alguns instantes para decodificar...'}</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-3 text-xs font-mono">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {selectedFile && !isLoading && extractedFiles.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="font-mono text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <ArchiveIcon className="h-4 w-4 text-stone-500" />
                  {selectedFile.name}
                </h3>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                  {isEn ? `${extractedFiles.length} file(s) extracted • Original size: ${formatBytes(selectedFile.size)}` : `${extractedFiles.length} arquivo(s) extraído(s) • Tamanho original: ${formatBytes(selectedFile.size)}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Open another' : 'Abrir outro'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-stone-500 text-zinc-950 hover:bg-stone-400 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Download All' : 'Baixar Todos'}</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 max-h-96 overflow-y-auto pr-1">
              {extractedFiles.map((item, idx) => {
                const ItemIcon = getFileIcon(item.name);
                return (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <ItemIcon className="h-4 w-4 text-zinc-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 truncate">
                          {item.path}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400">
                          {formatBytes(item.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(item)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-stone-500 hover:text-zinc-950 transition-colors cursor-pointer shrink-0"
                    >
                      <Download className="h-3 w-3" />
                      <span>{isEn ? 'Save' : 'Salvar'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
