import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Instrutor } from '@/components/sections/Instrutor';
import { content } from '@/lib/content';

describe('Instrutor', () => {
  it('renders the instructor name and all stats without a video block', () => {
    const { container } = render(<Instrutor />);
    expect(container.querySelector('#instrutor')).not.toBeNull();
    expect(screen.getByText(content.instrutor.name)).toBeInTheDocument();
    expect(screen.getByText(content.instrutor.bio)).toBeInTheDocument();
    for (const s of content.instrutor.stats) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
    }
    expect(container.querySelector('[data-video]')).toBeNull();
  });
});
