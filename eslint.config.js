import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist/**', 'node_modules/**', '.wrangler/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$', argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-empty': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn'
    },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } }, globals: { window: 'readonly', document: 'readonly', navigator: 'readonly', localStorage: 'readonly', sessionStorage: 'readonly', IntersectionObserver: 'readonly', BroadcastChannel: 'readonly', crypto: 'readonly', btoa: 'readonly', atob: 'readonly', URLSearchParams: 'readonly', fetch: 'readonly', Event: 'readonly', CustomEvent: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', console: 'readonly' } }
  },
  { files: ['functions/**/*.js'], languageOptions: { globals: { crypto: 'readonly', btoa: 'readonly', atob: 'readonly', TextEncoder: 'readonly', TextDecoder: 'readonly', Response: 'readonly', URL: 'readonly', console: 'readonly' } }, rules: { 'no-empty': 'off', 'no-unused-vars': ['error', { caughtErrors: 'none', argsIgnorePattern: '^_' }] } },
  { files: ['scripts/**/*.mjs', 'public/**/*.js'], languageOptions: { globals: { process: 'readonly', console: 'readonly', window: 'readonly', document: 'readonly', localStorage: 'readonly' } }, rules: { 'no-empty': 'off', 'no-unused-vars': ['error', { caughtErrors: 'none', argsIgnorePattern: '^_' }] } }
];
