// Engine de conversão universal client-side para imagens, dados/texto e áudio

export const CONVERSION_MATRIX = {
  // Imagens
  png: { category: 'image', targets: ['webp', 'jpg', 'bmp', 'ico'] },
  jpg: { category: 'image', targets: ['webp', 'png', 'bmp', 'ico'] },
  jpeg: { category: 'image', targets: ['webp', 'png', 'bmp', 'ico'] },
  webp: { category: 'image', targets: ['png', 'jpg', 'bmp', 'ico'] },
  avif: { category: 'image', targets: ['png', 'webp', 'jpg'] },
  bmp: { category: 'image', targets: ['png', 'webp', 'jpg'] },
  svg: { category: 'image', targets: ['png', 'webp', 'jpg'] },
  ico: { category: 'image', targets: ['png', 'webp', 'jpg'] },

  // Dados & Textos
  json: { category: 'data', targets: ['csv', 'yaml', 'xml', 'txt'] },
  csv: { category: 'data', targets: ['json', 'tsv', 'txt'] },
  tsv: { category: 'data', targets: ['json', 'csv', 'txt'] },
  xml: { category: 'data', targets: ['json', 'txt'] },
  yaml: { category: 'data', targets: ['json', 'txt'] },
  yml: { category: 'data', targets: ['json', 'txt'] },
  md: { category: 'data', targets: ['html', 'txt'] },
  html: { category: 'data', targets: ['md', 'txt'] },
  txt: { category: 'data', targets: ['base64', 'json'] },
  base64: { category: 'data', targets: ['txt'] },

  // Áudio
  mp3: { category: 'audio', targets: ['wav'] },
  ogg: { category: 'audio', targets: ['wav'] },
  m4a: { category: 'audio', targets: ['wav'] },
  flac: { category: 'audio', targets: ['wav'] },
  aac: { category: 'audio', targets: ['wav'] },
  wav: { category: 'audio', targets: ['wav'] }
};

export function getFileExtension(filename = '') {
  return filename.split('.').pop().toLowerCase();
}

export function getConversionOptions(filename = '') {
  const ext = getFileExtension(filename);
  const info = CONVERSION_MATRIX[ext];
  if (!info) return null;
  return {
    sourceExt: ext,
    category: info.category,
    targets: info.targets
  };
}

async function convertImage(file, targetExt, quality = 0.92) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (targetExt === 'jpg' || targetExt === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = targetExt === 'jpg' || targetExt === 'jpeg'
        ? 'image/jpeg'
        : targetExt === 'webp'
        ? 'image/webp'
        : 'image/png';

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Falha ao exportar imagem convertida.'));
      }, mimeType, quality);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Formato de imagem inválido ou não suportado pelo navegador.'));
    };
    img.src = url;
  });
}

function convertJsonToCsv(jsonStr) {
  const data = JSON.parse(jsonStr);
  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return '';
  const headers = Object.keys(items[0]);
  const rows = items.map(obj =>
    headers.map(header => {
      let val = obj[header] === undefined || obj[header] === null ? '' : String(obj[header]);
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

function convertCsvToJson(csvStr, delimiter = ',') {
  const lines = csvStr.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return '[]';
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  const list = lines.slice(1).map(line => {
    const cols = line.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cols[i] ?? ''; });
    return obj;
  });
  return JSON.stringify(list, null, 2);
}

function convertJsonToYaml(obj, indent = 0) {
  const pad = ' '.repeat(indent);
  if (typeof obj !== 'object' || obj === null) return `${obj}\n`;
  let out = '';
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        out += `${pad}- \n${convertJsonToYaml(item, indent + 2)}`;
      } else {
        out += `${pad}- ${item}\n`;
      }
    });
  } else {
    Object.entries(obj).forEach(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        out += `${pad}${k}:\n${convertJsonToYaml(v, indent + 2)}`;
      } else {
        out += `${pad}${k}: ${v}\n`;
      }
    });
  }
  return out;
}

function convertJsonToXml(obj, root = 'root') {
  let xml = `<${root}>\n`;
  function build(node, indent = 2) {
    const pad = ' '.repeat(indent);
    if (typeof node !== 'object' || node === null) return `${node}`;
    let res = '';
    if (Array.isArray(node)) {
      node.forEach(item => { res += `${pad}<item>${build(item, indent + 2)}</item>\n`; });
    } else {
      Object.entries(node).forEach(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
          res += `${pad}<${k}>\n${build(v, indent + 2)}${pad}</${k}>\n`;
        } else {
          res += `${pad}<${k}>${v}</${k}>\n`;
        }
      });
    }
    return res;
  }
  xml += build(obj);
  xml += `</${root}>`;
  return xml;
}

async function convertAudioToWav(file) {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // Encode WAV PCM 16-bit
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numChannels * 2 + 44;
  const outBuffer = new ArrayBuffer(length);
  const view = new DataView(outBuffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioBuffer.length * numChannels * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, audioBuffer.length * numChannels * 2, true);

  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

export async function executeConversion(file, targetExt, category) {
  if (category === 'image') {
    return await convertImage(file, targetExt);
  }

  if (category === 'audio') {
    return await convertAudioToWav(file);
  }

  if (category === 'data') {
    const text = await file.text();
    const sourceExt = getFileExtension(file.name);

    if (sourceExt === 'json' && targetExt === 'csv') return new Blob([convertJsonToCsv(text)], { type: 'text/csv' });
    if (sourceExt === 'json' && targetExt === 'yaml') return new Blob([convertJsonToYaml(JSON.parse(text))], { type: 'text/yaml' });
    if (sourceExt === 'json' && targetExt === 'xml') return new Blob([convertJsonToXml(JSON.parse(text))], { type: 'application/xml' });
    if (sourceExt === 'csv' && targetExt === 'json') return new Blob([convertCsvToJson(text, ',')], { type: 'application/json' });
    if (sourceExt === 'tsv' && targetExt === 'json') return new Blob([convertCsvToJson(text, '\t')], { type: 'application/json' });
    if (sourceExt === 'md' && targetExt === 'html') {
      const html = text.replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/\n$/gim, '<br />');
      return new Blob([`<!DOCTYPE html><html><body>${html}</body></html>`], { type: 'text/html' });
    }
    if (sourceExt === 'txt' && targetExt === 'base64') return new Blob([btoa(unescape(encodeURIComponent(text)))], { type: 'text/plain' });
    if (sourceExt === 'base64' && targetExt === 'txt') return new Blob([decodeURIComponent(escape(atob(text)))], { type: 'text/plain' });

    // Fallback texto puro
    return new Blob([text], { type: 'text/plain' });
  }

  throw new Error(`Conversão de .${getFileExtension(file.name)} para .${targetExt} não suportada.`);
}
