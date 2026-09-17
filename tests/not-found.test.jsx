import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NotFound } from '../src/components/NotFound.jsx';

describe('NotFound', () => {
  it('offers routes back to the hub and blog', () => {
    render(<NotFound onGoHome={vi.fn()} onGoBlog={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Nada por aqui.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar ao Hub' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir o Blog' })).toBeInTheDocument();
  });
});
