import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Oferta } from '@/components/sections/Oferta';
import { content } from '@/lib/content';

const pares = content.offer.pairs;

function lados(container: HTMLElement) {
  return {
    leva: Array.from(container.querySelectorAll('[data-par-leva]')),
    duvida: Array.from(container.querySelectorAll('[data-par-duvida]')),
  };
}

function indiceAtivo(itens: Element[]) {
  return itens.findIndex((el) => el.getAttribute('data-ativo') === 'true');
}

describe('Oferta', () => {
  it('renders price, every offer line and a CTA to checkout', () => {
    render(<Oferta />);
    expect(screen.getByText(content.offer.priceNow)).toBeInTheDocument();
    expect(screen.getByText(content.offer.priceFrom)).toBeInTheDocument();
    expect(screen.getByText(content.offer.installments)).toBeInTheDocument();
    for (const par of pares) {
      expect(screen.getByText(par.leva)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: content.offer.cta })).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
  });

  it('writes every doubt in quotes and italics, like the pain section', () => {
    render(<Oferta />);
    for (const par of pares) {
      const fala = screen.getByText(`“${par.duvida}”`);
      expect(fala).toBeInTheDocument();
      expect(fala.className).toMatch(/\bitalic\b/);
    }
  });

  it('pairs the two cards line by line, in the same order', () => {
    const { container } = render(<Oferta />);
    const { leva, duvida } = lados(container);

    // A ordem E a ligacao entre os cards. Se um lado for reordenado sem o
    // outro, o clique passa a acender a linha errada — e este teste cai.
    expect(leva).toHaveLength(pares.length);
    expect(duvida).toHaveLength(pares.length);
    pares.forEach((par, i) => {
      expect(leva[i]).toHaveTextContent(par.leva);
      expect(duvida[i]).toHaveTextContent(par.duvida);
    });
  });

  it('opens the first pair by default, on both sides', () => {
    const { container } = render(<Oferta />);
    const { leva, duvida } = lados(container);

    expect(indiceAtivo(leva)).toBe(0);
    expect(indiceAtivo(duvida)).toBe(0);
  });

  it('lights both sides when an offer line is clicked', () => {
    const { container } = render(<Oferta />);
    const { leva, duvida } = lados(container);

    fireEvent.click(leva[4].querySelector('button')!);

    expect(indiceAtivo(leva)).toBe(4);
    expect(indiceAtivo(duvida)).toBe(4);
  });

  it('lights both sides when a doubt is clicked', () => {
    const { container } = render(<Oferta />);
    const { leva, duvida } = lados(container);

    fireEvent.click(duvida[2].querySelector('button')!);

    expect(indiceAtivo(duvida)).toBe(2);
    expect(indiceAtivo(leva)).toBe(2);
  });

  it('keeps a single pair active at a time', () => {
    const { container } = render(<Oferta />);
    const { leva, duvida } = lados(container);

    fireEvent.click(duvida[5].querySelector('button')!);

    expect(container.querySelectorAll('[data-par-leva][data-ativo="true"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-par-duvida][data-ativo="true"]')).toHaveLength(1);
    expect(indiceAtivo(leva)).toBe(indiceAtivo(duvida));
  });

  it('announces the open answer to assistive tech', () => {
    const { container } = render(<Oferta />);
    const { duvida } = lados(container);

    const aberto = duvida[0].querySelector('button')!;
    expect(aberto).toHaveAttribute('aria-expanded', 'true');
    expect(aberto).toHaveAttribute('aria-controls', 'resposta-0');
    expect(duvida[1].querySelector('button')).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(duvida[1].querySelector('button')!);
    expect(duvida[1].querySelector('button')).toHaveAttribute('aria-expanded', 'true');
    expect(aberto).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders every answer, so no accordion opens onto nothing', () => {
    render(<Oferta />);
    for (const par of pares) {
      expect(screen.getByText(par.resposta)).toBeInTheDocument();
    }
  });

  it('absorbed the FAQ: guarantee is the last pair and the WhatsApp escape stays', () => {
    render(<Oferta />);
    // O bloco de garantia proprio saiu; agora ela e a ultima linha do par.
    expect(screen.getByText(pares.at(-1)!.leva)).toBeInTheDocument();
    expect(screen.getByText(content.offer.payments)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: content.offer.askCta })).toHaveAttribute(
      'href',
      content.whatsappUrl,
    );
  });
});
