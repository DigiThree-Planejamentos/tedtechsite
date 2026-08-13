import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Faq } from '@/components/sections/Faq';
import { content } from '@/lib/content';

describe('Faq', () => {
  it('renders only the questions that have an answer', () => {
    render(<Faq />);
    const answered = content.faq.items.filter((item) => item.a !== '');
    const pending = content.faq.items.filter((item) => item.a === '');
    expect(answered.length).toBeGreaterThan(0);
    for (const item of answered) {
      expect(screen.getByText(item.q)).toBeInTheDocument();
      expect(screen.getByText(item.a)).toBeInTheDocument();
    }
    for (const item of pending) {
      expect(screen.queryByText(item.q)).toBeNull();
    }
  });

  it('wraps every question in a native disclosure', () => {
    const { container } = render(<Faq />);
    const answered = content.faq.items.filter((item) => item.a !== '');
    expect(container.querySelectorAll('details > summary')).toHaveLength(answered.length);
  });

  it('links the WhatsApp CTA', () => {
    render(<Faq />);
    expect(screen.getByRole('link', { name: content.faq.cta })).toHaveAttribute(
      'href',
      content.whatsappUrl,
    );
  });
});

describe('Faq with every answer pending', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/content');
    vi.resetModules();
  });

  it('renders nothing at all', async () => {
    vi.resetModules();
    // Preserva o módulo real e só esvazia as respostas — um mock parcial
    // quebraria qualquer componente que importe `content` no topo do arquivo.
    vi.doMock('@/lib/content', async () => {
      const actual = await vi.importActual<typeof import('@/lib/content')>('@/lib/content');
      return {
        ...actual,
        content: {
          ...actual.content,
          faq: {
            ...actual.content.faq,
            items: [{ q: 'Pergunta ainda sem resposta?', a: '' }],
          },
        },
      };
    });
    const { Faq: FaqPending } = await import('@/components/sections/Faq');
    const { container } = render(<FaqPending />);
    expect(container.firstChild).toBeNull();
  });
});
