import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Evolucao } from '@/components/sections/Evolucao';
import { content } from '@/lib/content';

describe('Evolucao', () => {
  it('renders the gauge value and all four steps', () => {
    render(<Evolucao />);
    expect(screen.getByText(content.evolucao.gaugeValue)).toBeInTheDocument();
    for (const s of content.evolucao.steps) {
      expect(screen.getByText(s.t)).toBeInTheDocument();
    }
  });

  it('fecha a jornada com o passo de venda ajudado pelo Ted', () => {
    expect(content.evolucao.steps).toHaveLength(4);
    const ultimo = content.evolucao.steps.at(-1)!;
    expect(ultimo.k).toBe('Venda');
    expect(ultimo.s).toMatch(/Ted/);
    expect(content.evolucao.title).toBe('Dos fundamentos ao primeiro cliente');
  });
});
