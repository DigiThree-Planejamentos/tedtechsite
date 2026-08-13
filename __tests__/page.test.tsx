import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { content } from '@/lib/content';

describe('Home page', () => {
  it('renders the new hero, modules anchor and offer price together', () => {
    const { container } = render(<Home />);
    expect(
      screen.getByRole('heading', { name: content.dores.title }),
    ).toBeInTheDocument();
    expect(container.querySelector('#modulos')).not.toBeNull();
    expect(container.querySelector('#caminhos')).not.toBeNull();
    expect(container.querySelector('#instrutor')).toBeNull();
    expect(container.querySelector('#tira-duvidas')).not.toBeNull();
    expect(container.querySelector('#identificacao')).toBeNull();
    expect(screen.getAllByText(content.offer.priceNow)).toHaveLength(2);
    expect(screen.getByText(content.floatingCta.urgency)).toBeInTheDocument();
    expect(container.querySelector('[data-floating-cta] a')).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
  });
});
