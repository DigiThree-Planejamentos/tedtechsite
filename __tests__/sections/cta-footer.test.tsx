import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CtaFinal } from '@/components/sections/CtaFinal';
import { Footer } from '@/components/sections/Footer';
import { content } from '@/lib/content';

describe('CtaFinal + Footer', () => {
  it('CTA final links to checkout', () => {
    render(<CtaFinal />);
    expect(screen.getByText(content.ctaFinal.title)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: content.ctaFinal.cta }),
    ).toHaveAttribute('href', content.checkoutUrl);
  });

  it('footer shows cnpj and tagline', () => {
    render(<Footer />);
    expect(screen.getByText(content.footer.cnpj)).toBeInTheDocument();
    expect(screen.getByText(content.footer.tagline)).toBeInTheDocument();
  });
});
