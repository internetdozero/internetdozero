#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function readJson(relPath) {
  const fullPath = path.join(rootDir, relPath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function readFile(relPath) {
  const fullPath = path.join(rootDir, relPath);
  return fs.readFileSync(fullPath, 'utf8');
}

const pkg = readJson('package.json');
const currentVersion = pkg.version;

// 1. Validar formato SemVer basico (MAJOR.MINOR.PATCH)
const semverRegex = /^(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?$/;
const match = currentVersion.match(semverRegex);
if (!match) {
  console.error(`ERROR: [SemVer] Versao invalida no package.json: "${currentVersion}". Deve seguir X.Y.Z`);
  process.exit(1);
}

const [, curMajor, curMinor, curPatch] = match.map(Number);
const vString = `v${currentVersion}`;

// 2. Verificar sincronia nos arquivos do projeto
const syncChecks = [
  {
    file: 'changelog.md',
    check: (content) => {
      const topReleaseMatch = content.match(/##\s*\[(\d+\.\d+\.\d+)\]/);
      if (!topReleaseMatch) return 'Nenhum cabecalho "## [X.Y.Z]" encontrado no changelog.';
      if (topReleaseMatch[1] !== currentVersion) {
        return `Versao no topo do changelog e [${topReleaseMatch[1]}], mas package.json e [${currentVersion}].`;
      }
      return null;
    }
  },
  {
    file: 'README.md',
    check: (content) => {
      if (!content.includes(vString)) {
        return `Nao contem a mencao exata a versao "${vString}".`;
      }
      return null;
    }
  },
  {
    file: 'src/i18n/translations.js',
    check: (content) => {
      const occurrences = (content.match(new RegExp(`version:\\s*'${vString}'`, 'g')) || []).length;
      if (occurrences < 2) {
        return `Esperado encontrar "version: '${vString}'" pelo menos 2 vezes (pt e en), encontrado: ${occurrences}.`;
      }
      return null;
    }
  },
  {
    file: 'src/components/StatusRadar.jsx',
    check: (content) => {
      if (!content.includes(`[${vString}]`)) {
        return `Nao contem a tag "[${vString}]" no console interativo.`;
      }
      return null;
    }
  }
];

let syncErrors = 0;
for (const { file, check } of syncChecks) {
  try {
    const content = readFile(file);
    const err = check(content);
    if (err) {
      console.error(`ERROR: [SemVer Sync] Descompasso em ${file}: ${err}`);
      syncErrors++;
    }
  } catch (e) {
    console.error(`ERROR: [SemVer Sync] Erro ao ler ${file}: ${e.message}`);
    syncErrors++;
  }
}

if (syncErrors > 0) {
  console.error(`\nPara corrigir a sincronia, garanta que todos os arquivos usem a versao ${vString}.`);
  process.exit(1);
}

// 3. Checar regras de transicao via git (se houver alteracao de versao em relacao ao HEAD)
try {
  let prevVersion = null;
  try {
    const pkgFromGit = execSync('git show HEAD:package.json 2>/dev/null', { encoding: 'utf8' });
    const parsedGit = JSON.parse(pkgFromGit);
    prevVersion = parsedGit.version;
  } catch (_) {
    // Pode falhar se for primeiro commit ou repo sem HEAD
  }

  if (prevVersion && prevVersion !== currentVersion) {
    const prevMatch = prevVersion.match(semverRegex);
    if (prevMatch) {
      const [, pMajor, pMinor, pPatch] = prevMatch.map(Number);
      
      const isPatch = curMajor === pMajor && curMinor === pMinor && curPatch === pPatch + 1;
      const isMinor = curMajor === pMajor && curMinor === pMinor + 1 && curPatch === 0;
      const isMajor = curMajor === pMajor + 1 && curMinor === 0 && curPatch === 0;

      if (!isPatch && !isMinor && !isMajor) {
        console.error(`ERROR: [SemVer Increment] Transicao de versao invalida: v${prevVersion} -> v${currentVersion}`);
        console.error(`   Regras permitidas:`);
        console.error(`   - PATCH: v${pMajor}.${pMinor}.${pPatch + 1}`);
        console.error(`   - MINOR: v${pMajor}.${pMinor + 1}.0`);
        console.error(`   - MAJOR: v${pMajor + 1}.0.0`);
        process.exit(1);
      }

      const bumpType = isMajor ? 'MAJOR' : isMinor ? 'MINOR' : 'PATCH';
      console.log(`[SemVer] Incremento detectado: ${bumpType} (v${prevVersion} -> v${currentVersion})`);

      if (isMinor) {
        const changelog = readFile('changelog.md');
        if (!changelog.includes('### Adicionado') && !changelog.includes('### Added')) {
          console.warn(`WARN: [SemVer] Subida MINOR requer registro de novos recursos em "### Adicionado" no changelog.`);
        }
      }
    }
  }
} catch (e) {
  // Ignora se nao for ambiente git
}

console.log(`OK: Versao v${currentVersion} validada e perfeitamente sincronizada.`);
console.log(`[SemVer Diretrizes]:`);
console.log(` - Commits rotineiros NAO devem alterar a versao.`);
console.log(` - PATCH (x.y.Z+1): apenas ao fechar lote de correcoes/hotfixes.`);
console.log(` - MINOR (x.Y+1.0): apenas ao lancar novo modulo ou ferramenta completa.`);
console.log(` - MAJOR (X+1.0.0): apenas em mudancas com quebra de compatibilidade.`);
