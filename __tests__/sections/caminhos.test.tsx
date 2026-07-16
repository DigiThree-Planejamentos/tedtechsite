import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Caminhos } from '@/components/sections/Caminhos';
import { content } from '@/lib/content';

describe('Caminhos', () => {
  it('renders the section copy, three paths and every benefit', () => {
    const { container } = render(<Caminhos />);

    expect(container.querySelector('#caminhos')).not.toBeNull();
    expect(screen.getByText(content.caminhos.label)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: content.caminhos.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(content.caminhos.subtitle)).toBeInTheDocument();
    expect(container.querySelectorAll('article')).toHaveLength(3);

    for (const card of content.caminhos.cards) {
      expect(
        screen.getByRole('heading', { level: 3, name: card.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(card.desc)).toBeInTheDocument();
      for (const bullet of card.bullets) {
        expect(screen.getByText(bullet)).toBeInTheDocument();
      }
    }
  });

  it('uses the responsive card grid and links the CTA to checkout', () => {
    const { container } = render(<Caminhos />);
    const grid = container.querySelector('.md\\:grid-cols-3');

    expect(grid).not.toBeNull();
    expect(grid).toHaveClass('grid');
    expect(screen.getByRole('link', { name: content.caminhos.cta })).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
  });
});
