import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Identificacao } from '@/components/sections/Identificacao';
import { content } from '@/lib/content';

describe('Identificacao', () => {
  it('renders label, all four thoughts and the turn line', () => {
    render(<Identificacao />);
    expect(screen.getByText(content.dores.label)).toBeInTheDocument();
    for (const t of content.dores.thoughts) {
      expect(screen.getByText(t.q)).toBeInTheDocument();
    }
    expect(screen.getByText(content.dores.turn)).toBeInTheDocument();
  });
});
