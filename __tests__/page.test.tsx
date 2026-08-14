import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { content } from '@/lib/content';

describe('Home page', () => {
  it('renders the product hero, module anchor and offer price together', () => {
    const { container } = render(<Home />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: `${content.hero.headline.lead} ${content.hero.headline.rest}`,
      }),
    ).toBeInTheDocument();
    expect(container.querySelector('#modulos')).not.toBeNull();
    expect(container.querySelector('#caminhos')).not.toBeNull();
    expect(container.querySelector('#instrutor')).toBeNull();
    expect(container.querySelector('#tira-duvidas')).toBeNull();
    expect(container.querySelector('#dores')).not.toBeNull();
    expect(container.querySelector('#faq')).not.toBeNull();
    expect(screen.getAllByText(content.offer.priceNow)).toHaveLength(2);
    expect(screen.getByText(content.floatingCta.urgency)).toBeInTheDocument();
    expect(container.querySelector('[data-floating-cta] a')).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
  });

  it('orders the sections for conversion: hero, dores, modulos, oferta, faq', () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id);
    for (const id of ['hero', 'dores', 'modulos', 'oferta', 'faq']) {
      expect(ids).toContain(id);
    }
    expect(ids.indexOf('hero')).toBeLessThan(ids.indexOf('dores'));
    expect(ids.indexOf('dores')).toBeLessThan(ids.indexOf('modulos'));
    expect(ids.indexOf('modulos')).toBeLessThan(ids.indexOf('oferta'));
    expect(ids.indexOf('oferta')).toBeLessThan(ids.indexOf('faq'));
  });
});
