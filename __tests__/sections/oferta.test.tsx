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
});
