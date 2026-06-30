import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Evolucao } from '@/components/sections/Evolucao';
import { content } from '@/lib/content';

describe('Evolucao', () => {
  it('renders the gauge value and all three steps', () => {
    render(<Evolucao />);
    expect(screen.getByText(content.evolucao.gaugeValue)).toBeInTheDocument();
    for (const s of content.evolucao.steps) {
      expect(screen.getByText(s.t)).toBeInTheDocument();
    }
  });
});
