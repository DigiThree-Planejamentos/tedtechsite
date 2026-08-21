import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Fechamento } from '@/components/sections/Fechamento';
import { content } from '@/lib/content';

describe('Fechamento', () => {
  it('renders the closing copy on the full-height pure white band, without an id', () => {
    const { container } = render(<Fechamento />);
    const section = container.querySelector('section')!;
    expect(section.className).toContain('site-band--white');
    expect(section.className).toContain('site-band--full');
    expect(section.id).toBe('');
    expect(
      screen.getByRole('heading', { level: 2, name: content.fechamento.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(content.fechamento.sub)).toBeInTheDocument();
    // As formas de pagamento sairam daqui: sem preco ao lado elas ficavam
    // orfas. Vivem na oferta, logo abaixo do valor, onde respondem "como eu
    // pago isso?".
    expect(screen.queryByText(content.offer.payments)).toBeNull();
  });

  it('links the CTA to checkout', () => {
    render(<Fechamento />);
    expect(
      screen.getByRole('link', { name: content.fechamento.cta }),
    ).toHaveAttribute('href', content.checkoutUrl);
  });

  // O diferencial do produto tem bloco proprio porque e o argumento de
  // venda. Se alguem o reduzir de volta a uma frase solta no paragrafo, o
  // destaque se perde sem nada quebrar — daí este teste.
  it('gives the selling help its own highlighted block, right before the CTA', () => {
    const { container } = render(<Fechamento />);
    expect(screen.getByText(content.fechamento.destaqueLabel)).toBeInTheDocument();

    const destaque = screen.getByText(content.fechamento.destaque);
    expect(destaque).toBeInTheDocument();

    // Nao pode ter virado parte do subtitulo de novo.
    expect(content.fechamento.sub).not.toContain('Ted');

    // O bloco precede o botao no DOM: e o ultimo argumento antes da decisao.
    const cta = screen.getByRole('link', { name: content.fechamento.cta });
    expect(
      destaque.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container).toBeTruthy();
  });

  // As quatro frases sao transcricao do video institucional do hero, nao
  // copy inventada aqui. Se alguem reescrever uma delas "pra ficar melhor",
  // a pagina passa a contradizer o audio que o visitante acabou de ouvir —
  // e nada quebra. Por isso elas tem teste proprio, preso ao bloco do Ted.
  it('spells out what the student learns to do, inside the Ted block', () => {
    render(<Fechamento />);
    const itens = content.fechamento.destaqueItens;
    expect(itens).toHaveLength(4);

    const lead = screen.getByText(content.fechamento.destaque);
    const lista = lead.parentElement!.querySelector('ul')!;
    expect(lista).toBeTruthy();

    for (const item of itens) {
      const li = screen.getByText(item);
      expect(lista.contains(li)).toBe(true);
      // Verbo no infinitivo: nomeia o que se aprende A FAZER. Uma promessa
      // ("voce vai ter clientes") teria outra forma — ver comentario do CDC
      // no content. Este teste guarda o enquadramento, nao o estilo.
      expect(item).toMatch(/^[A-ZÀ-Ú][a-zà-ú]+(ar|er|ir|guir) /);
    }
  });

  it('lists every service price with its range', () => {
    render(<Fechamento />);
    expect(content.fechamento.precos.length).toBeGreaterThanOrEqual(3);
    for (const p of content.fechamento.precos) {
      expect(screen.getByText(p.servico)).toBeInTheDocument();
      expect(screen.getByText(p.valor)).toBeInTheDocument();
    }
  });

  // Este teste guarda um enquadramento juridico, nao um detalhe de layout.
  // Os numeros da secao sao PRECO DE SERVICO praticado no mercado — fato
  // verificavel. Uma media mensal seria promessa sobre o resultado futuro
  // do comprador, e publicidade vincula pelo CDC. A nota e o que mantem os
  // valores nesse terreno; se ela sumir, o enquadramento vai junto.
  it('keeps the market-price framing: a disclaimer, and no monthly income claim', () => {
    render(<Fechamento />);
    expect(screen.getByText(content.fechamento.precosNota)).toBeInTheDocument();

    const texto = document.body.textContent ?? '';
    expect(texto).not.toMatch(/por m[êe]s/i);
    expect(texto).not.toMatch(/mensa(l|is)/i);
    // Toda faixa e escrita como intervalo, nunca como valor cravado.
    for (const p of content.fechamento.precos) {
      expect(p.valor).toMatch(/^R\$ [\d.]+ a R\$ [\d.]+$/);
    }
  });
});
