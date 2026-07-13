import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

describe('Hero', () => {
  it('renders the identification headline and thought cards', () => {
    render(<Hero />);
    expect(screen.getByText(content.dores.title)).toBeInTheDocument();
    for (const thought of content.dores.thoughts) {
      expect(screen.getByText(thought.q)).toBeInTheDocument();
    }
  });
});
