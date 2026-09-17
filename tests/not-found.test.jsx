import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NotFound } from '../src/components/NotFound.jsx';

describe('NotFound', () => {
  it('offers routes back to the hub and blog', () => {
    render(<NotFound onGoHome={vi.fn()} onGoBlog={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Essa página não existe.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar ao início' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ler os textos' })).toBeInTheDocument();
  });
});
