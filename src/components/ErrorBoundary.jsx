import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('UI error boundary:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-xs uppercase tracking-wider text-stone-500">Falha recuperável</p>
        <h1 className="text-2xl font-serif font-semibold text-stone-900 dark:text-stone-50">Esta parte não carregou</h1>
        <p className="text-sm text-stone-500">Recarregue a página para tentar novamente.</p>
        <button type="button" onClick={() => window.location.reload()} className="rounded-sm bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400">Recarregar</button>
      </main>
    );
  }
}
