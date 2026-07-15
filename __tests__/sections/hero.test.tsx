import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

describe('Hero', () => {
  it('renders the headline, diagnostic questions as quotes and the turn phrase', () => {
    render(<Hero />);
    expect(screen.queryByText(content.dores.label)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: content.dores.title }),
    ).toBeInTheDocument();
    expect(screen.getByText('Já pensou')).toHaveClass('text-blue');
    expect(screen.getByText('alguma dessas?')).toHaveClass('text-[22px]');
    for (const thought of content.dores.thoughts) {
      expect(screen.getByText(`“${thought.q}”`)).toBeInTheDocument();
      expect(screen.getByText(thought.s)).toBeInTheDocument();
    }
    expect(screen.getByText(content.dores.turn)).toBeInTheDocument();
  });

  it('renders the full-height instructor video panel with overlay copy', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('[data-video]')).not.toBeNull();
    expect(screen.getByText(content.instrutor.label)).toBeInTheDocument();
    expect(screen.getByText(content.instrutor.name)).toBeInTheDocument();
    expect(screen.getByText(content.instrutor.heroQuote)).toBeInTheDocument();
  });

  it('does not render the old stats band or subtitle', () => {
    render(<Hero />);
    expect(screen.queryByText('módulos')).toBeNull();
    expect(screen.queryByText('100%')).toBeNull();
    expect(screen.queryByText('medo de começar sem base')).toBeNull();
  });
});
