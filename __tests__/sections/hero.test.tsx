import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

const fullHeadline = `${content.hero.headline.lead} ${content.hero.headline.rest}`;

describe('Hero', () => {
  it('names the product in the h1 and supports it with bullets', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: fullHeadline }),
    ).toBeInTheDocument();
    expect(screen.queryByText(content.hero.eyebrow)).toBeNull();
    expect(screen.queryByText(content.hero.sub)).toBeNull();
    for (const bullet of content.hero.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }
  });

  it('sets the lead word larger and keeps the remainder on one smaller line', () => {
    render(<Hero />);
    const lead = screen.getByText(content.hero.headline.lead);
    const rest = screen.getByText(content.hero.headline.rest);
    expect(lead).not.toBe(rest);
    expect(lead.className).toMatch(/\btext-blue\b/);
    expect(lead.className).toMatch(/text-5xl\/\[1\.25\]/);
    expect(lead.className).toMatch(/\bitalic\b/);
    expect(rest.className).toMatch(/text-\[19\.09px\]\/\[1\.25\]/);
    expect(rest.className).toMatch(/\bwhitespace-nowrap\b/);
    // Every size step of BOTH lines must carry the 1.25 leading. The text-*
    // utilities ship line-height 1, and a bare `leading-` class loses to the
    // responsive ones, so the GSAP line mask clips the descenders of "Chega"
    // and "pagar".
    for (const size of ['text-5xl', 'sm:text-6xl', 'md:text-7xl', 'lg:text-8xl']) {
      expect(lead.className).toContain(`${size}/[1.25]`);
    }
    // Measured so this line's right ink edge lands on the same x as "Chega".
    for (const size of [
      'text-[19.09px]',
      'sm:text-[23.82px]',
      'md:text-[28.56px]',
      'lg:text-[38.04px]',
    ]) {
      expect(rest.className).toContain(`${size}/[1.25]`);
    }
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
