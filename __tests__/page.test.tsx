import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { content } from '@/lib/content';

describe('Home page', () => {
  it('renders hero headline, modules anchor and offer price together', () => {
    const { container } = render(<Home />);
    expect(screen.getByText(content.hero.headlineHighlight)).toBeInTheDocument();
    expect(container.querySelector('#modulos')).not.toBeNull();
    expect(container.querySelector('#tira-duvidas')).not.toBeNull();
    expect(screen.getByText(content.offer.priceNow)).toBeInTheDocument();
  });
});
