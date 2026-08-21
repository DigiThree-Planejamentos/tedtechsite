import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FloatingCta } from '@/components/sections/FloatingCta';
import { content } from '@/lib/content';
import { site } from '@/lib/site';

let offer: HTMLElement;
let offerTop: number;

// Pelo href, nunca por `querySelector('a')`: desde que os atalhos de secao
// entraram na barra, o PRIMEIRO link do DOM e um atalho, nao o checkout. E
// tambem nao da pra usar getByRole aqui — metade destes testes olha a barra
// escondida, e aria-hidden a tira da arvore de acessibilidade.
const checkoutLink = (container: HTMLElement) =>
  container.querySelector<HTMLAnchorElement>(`a[href="${content.checkoutUrl}"]`);

const navLinks = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLAnchorElement>('nav a'));

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
  });
}

function makeRect(top: number): DOMRect {
  return {
    x: 0,
    y: top,
    top,
    right: 1000,
    bottom: top + 600,
    left: 0,
    width: 1000,
    height: 600,
    toJSON: () => ({}),
  };
}

describe('FloatingCta', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: undefined,
    });
    setScrollY(0);
    offerTop = 2400;
    offer = document.createElement('section');
    offer.id = 'oferta';
    vi.spyOn(offer, 'getBoundingClientRect').mockImplementation(() =>
      makeRect(offerTop),
    );
    document.body.appendChild(offer);
  });

  afterEach(() => {
    offer.remove();
    vi.restoreAllMocks();
  });

  it('renders the urgency, the price on both layouts and the checkout link', () => {
    const { container } = render(<FloatingCta />);
    expect(screen.getByText(content.floatingCta.urgency)).toBeInTheDocument();
    // Duas ocorrencias de proposito: no celular a barra e "R$ 297 ·
    // Inscrever", e o preco ocupa o lugar do texto de urgencia.
    expect(screen.getAllByText(content.offer.priceNow)).toHaveLength(2);
    expect(screen.getByText(content.offer.installments)).toBeInTheDocument();
    expect(checkoutLink(container)).not.toBeNull();
  });

  // A barra e a UNICA navegacao do meio da pagina em diante: o header some
  // quando o hero sai da tela. Se os atalhos saírem daqui, quem desceu fica
  // sem como voltar a uma secao a nao ser rolando ate o topo.
  it('carries the same section shortcuts as the header, in page order', () => {
    const { container } = render(<FloatingCta />);
    const links = navLinks(container);

    expect(links.map((a) => a.textContent)).toEqual(site.nav.map((i) => i.label));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(
      site.nav.map((i) => i.href),
    );

    // O checkout fica FORA do <nav>. Dentro, um leitor de tela o anunciaria
    // como mais uma secao da pagina — e ele e o unico link que sai dela.
    const nav = container.querySelector('nav')!;
    expect(nav.contains(checkoutLink(container))).toBe(false);

    // Landmark com nome proprio: existe uma janela em que a barra e o header
    // estao os dois na tela, e dois <nav> com o mesmo nome deixam quem usa
    // leitor de tela sem saber a qual esta indo.
    expect(nav.getAttribute('aria-label')).toBe('Atalhos para as seções');
    expect(nav.getAttribute('aria-label')).not.toBe('Seções da página');
  });

  it('stays hidden before 70% of the first viewport and leaves the tab order', () => {
    setScrollY(699);
    const { container } = render(<FloatingCta />);
    const root = container.querySelector('[data-floating-cta]');
    const link = checkoutLink(container);

    expect(root).toHaveAttribute('data-visible', 'false');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');

    // Os atalhos saem junto. Eles continuam no DOM com a barra invisivel, e
    // sem isto quem navega por teclado tabularia por cinco links que nao
    // estao na tela — o mesmo motivo do link de checkout ali em cima.
    for (const a of navLinks(container)) {
      expect(a).toHaveAttribute('tabindex', '-1');
    }
  });

  it('follows whoever is not looking at the offer, before it and after it', () => {
    const { container } = render(<FloatingCta />);
    const root = container.querySelector('[data-floating-cta]');
    const link = checkoutLink(container);

    // Antes de chegar na oferta: a barra carrega o preco e o botao.
    setScrollY(700);
    fireEvent.scroll(window);
    expect(root).toHaveAttribute('data-visible', 'true');
    expect(root).toHaveAttribute('aria-hidden', 'false');
    expect(link).not.toHaveAttribute('tabindex');

    // Com a oferta na tela ela sai de cena: seria concorrer com os cards.
    offerTop = 1000;
    fireEvent.scroll(window);
    expect(root).toHaveAttribute('data-visible', 'false');

    // Depois de passar dos cards ela VOLTA. Antes nao voltava, e quem
    // rolava ate o rodape ficava sem preco e sem caminho pro checkout.
    offerTop = -700;
    setScrollY(3000);
    fireEvent.scroll(window);
    expect(root).toHaveAttribute('data-visible', 'true');

    offerTop = 1800;
    setScrollY(700);
    fireEvent.scroll(window);
    expect(root).toHaveAttribute('data-visible', 'true');
  });

  it('removes movement when reduced motion is requested', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );

    const { container } = render(<FloatingCta />);
    await waitFor(() => {
      expect(container.querySelector('[data-floating-cta]')).toHaveClass(
        'translate-y-0',
        'transition-none',
      );
    });
  });
});
