import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TiraDuvidas } from '@/components/sections/TiraDuvidas';
import { content } from '@/lib/content';

describe('TiraDuvidas', () => {
  it('renders the chat bubbles and a WhatsApp CTA to the configured link', () => {
    const { container } = render(<TiraDuvidas />);
    expect(container.querySelector('#tira-duvidas')).not.toBeNull();
    expect(screen.getByText(content.tiraDuvidas.bubbles[0].text)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: content.tiraDuvidas.cta });
    expect(cta).toHaveAttribute('href', content.whatsappUrl);
    expect(cta).toHaveClass('glow-button--whatsapp', 'border-blue/25', 'text-white');
  });
});
