# 🌐 Internet do Zero

```text
  ___      _                        _      _         ____                 
 |_ _|_ _ | |_ ___ _ _ _ _  ___  __| |_ __| |___    |_  /__ _ _ ___      
  | || ' \|  _/ -_) '_| ' \/ -_)/ _` / _` / _ \      / // -_) '_/ _ \     
 |___|_||_|\__\___|_| |_||_\___|\__,_\__,_\___/     /___\___|_| \___/     
                                                         [ v1.0.0 ]       
```

> **Um canto aberto na rede para textos, curiosidades, variedades e projetos autorais. Sem caixinhas e sem rótulos.**

---

## ⚡ Visão Geral

O **Internet do Zero** é um portal autoral e independente. Um espaço para reunir ideias livres, artigos de tecnologia, curiosidades da web, passatempos, ferramentas e criações sem pauta engessada ou compromissos corporativos.

---

## 🛠️ Stack Tecnológica

* **Core:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (estética terminal, modo escuro/claro nativo)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Qualidade:** Arquitetura modular, performance ultrarrápida e zero ruído

---

## 📁 Estrutura do Projeto

```text
internetdozero/
├── src/
│   ├── assets/           # Mídias e imagens
│   ├── components/       # Componentes globais do Hub (Header, Hero, Terminal, Footer)
│   ├── modules/          # Módulos independentes do portal
│   │   └── blog/         # Módulo de Blog, artigos e ensaios
│   ├── data/             # Estruturas de dados e definições de módulos
│   ├── hooks/            # Hooks utilitários (tema, atalhos)
│   ├── App.jsx           # Casca principal do portal
│   ├── index.css         # Estilos globais e tokens
│   └── main.jsx          # Bootstrap do React
├── index.html            # Ponto de entrada HTML
├── vite.config.js        # Configurações do Vite e Tailwind
└── package.json          # Dependências e scripts
```

---

## 🚀 Como Rodar Localmente

### 1. Clonar e instalar dependências
```bash
git clone https://github.com/internetdozero/internetdozero.git
cd internetdozero
npm install
```

### 2. Rodar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse em: `http://localhost:5173`

### 3. Build de produção
```bash
npm run build
npm run preview
```

---

<div align="center">
  <sub>Construído com café, curiosidade e liberdade na rede.</sub>
</div>
