import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorBoundary } from '../src/components/ErrorBoundary.jsx';

function Broken() { throw new Error('boom'); }

describe('ErrorBoundary', () => {
  it('renders recovery UI when a child throws', () => {
    render(<ErrorBoundary><Broken /></ErrorBoundary>);
    expect(screen.getByText('Esta parte não carregou')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recarregar' })).toBeInTheDocument();
  });
});
