import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Fechamento } from '@/components/sections/Fechamento';
import { content } from '@/lib/content';

describe('Fechamento', () => {
  it('renders the closing copy on the pure white band, without an id', () => {
    const { container } = render(<Fechamento />);
    const section = container.querySelector('section')!;
    expect(section.className).toContain('site-band--white');
    expect(section.className).not.toContain('site-band--full');
    expect(section.id).toBe('');
    expect(
      screen.getByRole('heading', { level: 2, name: content.fechamento.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(content.fechamento.sub)).toBeInTheDocument();
    expect(screen.getByText(content.offer.payments)).toBeInTheDocument();
  });

  it('links the CTA to checkout', () => {
    render(<Fechamento />);
    expect(
      screen.getByRole('link', { name: content.fechamento.cta }),
    ).toHaveAttribute('href', content.checkoutUrl);
  });
});
