import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/sections/Footer';
import { content } from '@/lib/content';

describe('Footer', () => {
  it('footer shows contact details and external links', () => {
    render(<Footer />);
    expect(screen.getByText(content.footer.cnpj)).toBeInTheDocument();
    expect(screen.getByText(content.footer.tagline)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: `Tel. ${content.footer.phone.label}` }),
    ).toHaveAttribute('href', content.footer.phone.href);
    expect(
      screen.getByRole('link', { name: 'Instagram @tedtechangra' }),
    ).toHaveAttribute('href', 'https://www.instagram.com/tedtechangra/');
    expect(screen.getByRole('link', { name: 'Kiwify' })).toHaveAttribute(
      'href',
      'https://kiwify.com.br/tedtech-exemplo',
    );
  });
});
