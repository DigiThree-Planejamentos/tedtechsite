import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

const fullHeadline = `${content.hero.headline.lead} ${content.hero.headline.rest}`;

describe('Hero', () => {
  it('names the product in the h1 and supports it with eyebrow, sub and bullets', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: fullHeadline }),
    ).toBeInTheDocument();
    expect(screen.getByText(content.hero.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(content.hero.sub)).toBeInTheDocument();
    for (const bullet of content.hero.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }
  });

  it('sets the lead word in serif italic above a sans bold remainder', () => {
    render(<Hero />);
    const lead = screen.getByText(content.hero.headline.lead);
    const rest = screen.getByText(content.hero.headline.rest);
    expect(lead).not.toBe(rest);
    expect(lead.className).toMatch(/\bfont-serif\b/);
    expect(lead.className).toMatch(/\bitalic\b/);
    expect(rest.className).toMatch(/\bfont-sans\b/);
    expect(rest.className).toMatch(/\bfont-extrabold\b/);
  });

  it('links the CTA to checkout and keeps the instructor video panel', () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole('link', { name: content.hero.cta })).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
    expect(container.querySelector('[data-video]')).not.toBeNull();
    expect(screen.getByText(content.instrutor.name)).toBeInTheDocument();
  });

  it('no longer renders any of the pain copy', () => {
    render(<Hero />);
    expect(screen.queryByText(content.dores.title)).toBeNull();
    expect(screen.queryByText(content.dores.turn)).toBeNull();
    for (const thought of content.dores.thoughts) {
      expect(screen.queryByText(`“${thought.q}”`)).toBeNull();
    }
  });
});
