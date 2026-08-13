import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dores } from '@/components/sections/Dores';
import { content } from '@/lib/content';

describe('Dores', () => {
  it('renders the label that the hero never showed', () => {
    render(<Dores />);
    expect(screen.getByText(content.dores.label)).toBeInTheDocument();
  });

  it('renders the title, every thought and the turn phrase', () => {
    render(<Dores />);
    expect(
      screen.getByRole('heading', { name: content.dores.title }),
    ).toBeInTheDocument();
    for (const thought of content.dores.thoughts) {
      const leftQuote = String.fromCharCode(0x201c);
      const rightQuote = String.fromCharCode(0x201d);
      expect(screen.getByText(`${leftQuote}${thought.q}${rightQuote}`)).toBeInTheDocument();
      expect(screen.getByText(thought.s)).toBeInTheDocument();
    }
    expect(screen.getByText(content.dores.turn)).toBeInTheDocument();
  });

  it('exposes the #dores anchor', () => {
    const { container } = render(<Dores />);
    expect(container.querySelector('section#dores')).not.toBeNull();
  });
});
