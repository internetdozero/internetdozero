import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModuleCard } from '../src/components/ModuleCard.jsx';

describe('ModuleCard', () => {
  it('is keyboard accessible', () => {
    const module = { id: 'blog', title_pt: 'Blog', subtitle_pt: 'Textos', category_pt: 'Conteúdo', description_pt: 'Descrição', status: 'online', statusLabel_pt: 'Disponível', tags_pt: [], icon: 'Sparkles' };
    render(<ModuleCard module={module} onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Abrir Blog' })).toBeInTheDocument();
  });
});
