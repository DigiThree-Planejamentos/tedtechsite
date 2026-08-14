import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Oferta } from '@/components/sections/Oferta';
import { content } from '@/lib/content';

describe('Oferta', () => {
  it('renders price, all includes and a CTA to checkout', () => {
    render(<Oferta />);
    expect(screen.getByText(content.offer.priceNow)).toBeInTheDocument();
    for (const item of content.offer.includes) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    const cta = screen.getByRole('link', { name: content.offer.cta });
    expect(cta).toHaveAttribute('href', content.checkoutUrl);
  });

  it('shows the guarantee next to the price', () => {
    render(<Oferta />);
    expect(screen.getByText(content.offer.trust.guarantee.title)).toBeInTheDocument();
    expect(screen.getByText(content.offer.trust.guarantee.desc)).toBeInTheDocument();
  });

  it('renders only the filled trust rows', () => {
    const { container } = render(<Oferta />);
    const t = content.offer.trust;
    const filled = [t.checkout, t.access, t.payments].filter((value) => value !== '');
    const rows = container.querySelectorAll('[data-trust-row]');
    expect(rows).toHaveLength(filled.length);
    for (const value of filled) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }
  });
});
