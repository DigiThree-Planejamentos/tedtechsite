import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/sections/Header';
import { content } from '@/lib/content';

describe('Header', () => {
  it('renders nav and a CTA to checkout', () => {
    render(<Header />);
    expect(screen.getByText('Módulos')).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: content.hero.cta });
    expect(cta).toHaveAttribute('href', content.checkoutUrl);
  });
});
