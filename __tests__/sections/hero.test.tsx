import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

describe('Hero', () => {
  it('renders the three staggered headline words', () => {
    render(<Hero />);
    for (const word of content.hero.headlineWords) {
      expect(screen.getByText(word)).toBeInTheDocument();
    }
  });
});
