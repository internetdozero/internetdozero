# Internet do Zero

> Sovereign Digital Hub, Technical Essays & Interactive Systems Laboratory.  
> *Hub digital independente, ensaios técnicos e laboratório de sistemas interativos.*

[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

---

## 🌐 Language / Idioma
* [English (EN)](#-english)
* [Português (PT)](#-português)

---

# 🇺🇸 English

## 1. Technical Overview

**Internet do Zero** is an independent, single-page application (SPA) built on modern web standards with an aesthetic rooted in terminal minimalism and digital sovereignty. It serves as a central hub and interactive platform featuring technical articles, essays, and standalone tool modules.

### Key Architectural Highlights
* **Zero-Monolith Policy:** Hard file-size thresholds enforced via automated build gatekeeper (`< 250` lines for code, `< 500` lines for data/i18n).
* **Decoupled Hub & Module Architecture:** Standalone feature modules (`src/modules/*`) remain isolated from the global shell (`App.jsx`).
* **Clean Path-Based Slug Routing:** Human-readable bilingual slugs (`/blog/running-local-llms` and `/blog/como-rodar-llms-locais`) with URI decoding, fallback resolution, and runtime canonicalization.
* **Granular Code Splitting:** Heavy views (`BlogView`, `CommandPalette`, `ModuleModal`) are loaded on-demand via `React.lazy()` and `<Suspense>`.
* **Zero-API In-Memory State:** Post interactions, likes, and comment streams are persisted locally with in-memory `Set` caching for $O(1)$ lookups without synchronous render-time I/O.
* **Zero-Dependency Native i18n:** Lightweight custom translation engine with browser language auto-detection, local persistence, and URL overrides.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime / UI** | React 19 (`react`, `react-dom`) | Modern component model, Concurrent features |
| **Build Engine** | Vite 6 | ESM HMR, lightning-fast compilation, Rollup chunking |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Native CSS theme tokens, dark/light modes |
| **Icons** | Lucide React | Tree-shakeable vector iconography |
| **CI / Gatekeeper** | Bash (`build.sh`) | Strict architecture, line-count, and artifact verification |
| **Hosting** | Cloudflare Pages | Edge-deployed static assets, SPA redirect handling |

---

## 3. Directory Structure

```text
internetdozero/
├── public/
│   ├── _headers              # Security & CSP response headers (Cloudflare Pages)
│   └── _redirects            # SPA fallback rule (/* /index.html 200)
├── src/
│   ├── components/           # Global Hub Shell (Header, Hero, Footer, CommandPalette, Modals)
│   ├── data/                 # System pillar definitions and core module registry
│   ├── hooks/                # Decoupled React hooks (useRouter, useTheme, useLanguage)
│   ├── i18n/                 # Translation maps (translations.js)
│   ├── modules/              # 100% Isolated Feature Domains
│   │   └── blog/             # Editorial & Article Domain
│   │       ├── components/   # Article viewer, feeds, comments, TOC, ShareModal
│   │       ├── data/         # Initial bilingual articles and markdown content
│   │       ├── hooks/        # Domain hooks (useLikedPosts O(1) Set cache)
│   │       ├── services/     # Client-side data store, sanitization & slugifier
│   │       └── utils/        # Social sharing link generators (socialShare.jsx)
│   ├── App.jsx               # Top-level shell with code-split lazy routes
│   ├── index.css             # Tailwind 4 theme variables and global layout
│   └── main.jsx              # React 19 root bootstrap & strict mode
├── build.sh                  # Architecture compliance & build validation runner
├── package.json              # Minimal dependency manifest
└── vite.config.js            # Vite 6 + Tailwind 4 plugin configuration
```

---

## 4. Security & Hardening

* **Protocol Whitelisting:** Custom Markdown parser validates link `href` attributes against `/^(https?:|mailto:|tel:|\/)/i` to prevent `javascript:` XSS vectors.
* **Client Sanitization:** HTML stripping on user-submitted comment inputs before persistence.
* **HTTP Security Headers:** Configured in `public/_headers` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`).
* **Zero CVEs:** Audited runtime dependencies with zero third-party script injections.

---

## 5. Development & Build

### Cloudflare Pages + D1

The editorial backend runs in Pages Functions and Cloudflare D1. Copy
`wrangler.toml.example` to `wrangler.toml`, create the D1 database, replace its
ID, and apply the schema:

```bash
npx wrangler d1 create internetdozero
npx wrangler d1 migrations apply internetdozero --remote
```

In the Pages project, bind that database as `DB` and add the encrypted secrets
`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. The public API is available at
`/api/posts` and `/api/categories`; editorial writes require the HttpOnly
session cookie issued by `/api/auth/login`.

### Prerequisites
* Node.js `>= 18.0.0`
* npm `>= 9.0.0`

### Setup
```bash
# Clone repository
git clone https://github.com/internetdozero/internetdozero.git
cd internetdozero

# Install dependencies
npm install

# Start development server
npm run dev
```

### Verification & Production Build
```bash
# Execute rigid architectural gatekeeper and compilation
./build.sh
```

---

# 🇧🇷 Português

## 1. Visão Geral Técnica

O **Internet do Zero** é uma Single Page Application (SPA) autoral desenvolvida sob padrões modernos da web, com identidade visual minimalista voltada a terminais e princípios de soberania digital. Funciona como portal central e laboratório interativo para artigos técnicos, ensaios e módulos utilitários.

### Destaques de Arquitetura
* **Diretriz Anti-Monólito:** Verificação rígida via script de build (`< 250` linhas para arquivos de código, `< 500` linhas para dados/i18n).
* **Módulos Totalmente Desacoplados:** Módulos de funcionalidade (`src/modules/*`) são 100% isolados da casca principal (`App.jsx`).
* **Roteamento Limpo por Slugs Bilíngues:** URLs amigáveis (`/blog/como-rodar-llms-locais` e `/blog/running-local-llms`) com suporte a decodificação de URI, resolução de fallback e canonicalização em runtime.
* **Code Splitting Granular:** Componentes pesados (`BlogView`, `CommandPalette`, `ModuleModal`) são carregados sob demanda via `React.lazy()` e `<Suspense>`.
* **Estado Local Otimizado:** Persistência em `localStorage` combinada com indexação em memória via `Set` para buscas em $O(1)$, eliminando I/O síncrono durante ciclos de renderização.
* **Internacionalização Nativa Sem Dependências:** Motor leve de traduções com detecção de idioma do navegador, persistência e priorização de query string.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Finalidade |
|---|---|---|
| **Runtime / UI** | React 19 (`react`, `react-dom`) | Estrutura de componentes e hooks modernos |
| **Compilador** | Vite 6 | HMR instantâneo, ESM nativo e empacotamento Rollup |
| **Estilização** | Tailwind CSS v4 (`@tailwindcss/vite`) | Design tokens sem runtime CSS, temas Dark/Light |
| **Ícones** | Lucide React | Conjunto de ícones vetoriais com tree-shaking |
| **Fiscalização / Build** | Bash (`build.sh`) | Verificação de conformidade arquitetural e monólitos |
| **Infraestrutura** | Cloudflare Pages | Hospedagem estática edge com suporte a SPA |

---

## 3. Estrutura de Diretórios

```text
internetdozero/
├── public/
│   ├── _headers              # Cabeçalhos de segurança e CSP (Cloudflare Pages)
│   └── _redirects            # Regra de roteamento SPA (/* /index.html 200)
├── src/
│   ├── components/           # Casca global do Hub (Header, Hero, Footer, CommandPalette)
│   ├── data/                 # Definições de pilares do sistema e registro de módulos
│   ├── hooks/                # Hooks reutilizáveis (useRouter, useTheme, useLanguage)
│   ├── i18n/                 # Dicionários de tradução (translations.js)
│   ├── modules/              # Domínios de Funcionalidades Isoladas
│   │   └── blog/             # Módulo do Blog e Ensaios
│   │       ├── components/   # Visualizador, feed, comentários, sumário, ShareModal
│   │       ├── data/         # Artigos iniciais bilíngues e markdown
│   │       ├── hooks/        # Hooks de domínio (useLikedPosts com cache Set O(1))
│   │       ├── services/     # Camada de dados, sanitização e gerador de slugs
│   │       └── utils/        # Geradores de links sociais (socialShare.jsx)
│   ├── App.jsx               # Shell com rotas assíncronas (lazy loading)
│   ├── index.css             # Tokens do Tailwind 4 e layout global
│   └── main.jsx              # Ponto de entrada do React 19
├── build.sh                  # Validador de arquitetura e runner de build
├── package.json              # Manifesto de dependências enxuto
└── vite.config.js            # Configuração do Vite 6 e plugin Tailwind 4
```

---

## 4. Segurança & Performance

* **Whitelist de Protocolos:** Parser de links Markdown valida esquemas contra `/^(https?:|mailto:|tel:|\/)/i`, bloqueando injeções `javascript:`.
* **Sanitização na Entrada:** Remoção de tags HTML nos comentários antes do salvamento em `localStorage`.
* **Cabeçalhos Defensivos:** Configuração em `public/_headers` (`X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`).
* **Zero Vulnerabilidades:** Stack auditada com `npm audit` zerado.

---

## 5. Instalação e Execução

### Pré-requisitos
* Node.js `>= 18.0.0`
* npm `>= 9.0.0`

### Como rodar
```bash
# Clonar repositório
git clone https://github.com/internetdozero/internetdozero.git
cd internetdozero

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Validação de Build
```bash
# Executa fiscalização arquitetural e compilação
./build.sh
```

---

<div align="center">
  <sub>Internet do Zero — Criado com foco em soberania digital, código modular e zero desperdício de tokens.</sub>
</div>
