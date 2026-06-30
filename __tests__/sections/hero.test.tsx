import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

describe('Hero', () => {
  it('renders the highlighted headline and search prompt without topic chips', () => {
    render(<Hero />);
    expect(screen.getByText(content.hero.headlineHighlight)).toBeInTheDocument();
    expect(screen.getByText(content.hero.searchPlaceholder)).toBeInTheDocument();
    expect(screen.queryByText('Montagem')).not.toBeInTheDocument();
  });
});
