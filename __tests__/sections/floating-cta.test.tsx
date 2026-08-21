import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { FloatingCta } from '@/components/sections/FloatingCta';
import { Header } from '@/components/sections/Header';
import { content } from '@/lib/content';
import { site } from '@/lib/site';

// Pelo href, nunca por `querySelector('a')`: desde que os atalhos de secao
// entraram na barra, o PRIMEIRO link do DOM e um atalho, nao o checkout. E
// tambem nao da pra usar getByRole aqui — metade destes testes olha a barra
// escondida, e aria-hidden a tira da arvore de acessibilidade.
const checkoutLink = (container: HTMLElement) =>
  container.querySelector<HTMLAnchorElement>(`a[href="${content.checkoutUrl}"]`);

const navLinks = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLAnchorElement>('nav a'));

// O jsdom nao tem IntersectionObserver, e o gatilho da barra agora depende
// dele: quem manda e o hero saindo da tela, nao mais a posicao do scroll.
// Este falso guarda os callbacks pra que o teste possa dizer "o hero saiu".
type IoCallback = (entries: IntersectionObserverEntry[]) => void;
let callbacks: IoCallback[] = [];
let options: IntersectionObserverInit[] = [];
let hero: HTMLElement;

function installIntersectionObserver() {
  callbacks = [];
  options = [];
  class FakeIntersectionObserver {
    constructor(cb: IoCallback, init?: IntersectionObserverInit) {
      callbacks.push(cb);
      options.push(init ?? {});
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: FakeIntersectionObserver,
  });
}

/** Dispara em TODOS os observers de uma vez: header e barra leem o mesmo. */
function setHeroOnScreen(isIntersecting: boolean) {
  act(() => {
    for (const cb of callbacks) {
      cb([{ isIntersecting } as IntersectionObserverEntry]);
    }
  });
}

const barra = (container: HTMLElement) =>
  container.querySelector('[data-floating-cta]')!;

describe('FloatingCta', () => {
  beforeEach(() => {
    installIntersectionObserver();
    hero = document.createElement('section');
    hero.id = 'hero';
    document.body.appendChild(hero);
  });

  afterEach(() => {
    hero.remove();
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

    // Landmarks com nomes diferentes: durante os 500ms da troca os dois
    // estao no DOM, e dois <nav> com o mesmo nome deixam quem usa leitor de
    // tela sem saber a qual esta indo.
    expect(nav.getAttribute('aria-label')).toBe('Atalhos para as seções');
    expect(nav.getAttribute('aria-label')).not.toBe('Seções da página');
  });

  it('stays hidden while the hero is on screen, and out of the tab order', () => {
    const { container } = render(<FloatingCta />);
    const root = barra(container);

    expect(root).toHaveAttribute('data-visible', 'false');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(checkoutLink(container)).toHaveAttribute('tabindex', '-1');

    // Os atalhos saem junto. Eles continuam no DOM com a barra invisivel, e
    // sem isto quem navega por teclado tabularia por cinco links que nao
    // estao na tela — o mesmo motivo do link de checkout ali em cima.
    for (const a of navLinks(container)) {
      expect(a).toHaveAttribute('tabindex', '-1');
    }
  });

  // O pedido do cliente, na letra: "assim que acabar o hero o header vira
  // essa barra visivel". Aparece quando o hero passa e FICA — nao ha mais a
  // regra de sumir quando o card de preco entra na tela.
  it('appears when the hero passes and stays for the rest of the page', () => {
    const { container } = render(<FloatingCta />);
    const root = barra(container);

    setHeroOnScreen(false);
    expect(root).toHaveAttribute('data-visible', 'true');
    expect(root).toHaveAttribute('aria-hidden', 'false');
    expect(checkoutLink(container)).not.toHaveAttribute('tabindex');
    for (const a of navLinks(container)) {
      expect(a).not.toHaveAttribute('tabindex');
    }

    // Voltar ao topo devolve o header, entao a barra tem que sair de novo.
    setHeroOnScreen(true);
    expect(root).toHaveAttribute('data-visible', 'false');
  });

  // ESTE e o teste do pedido. O header nao "some e depois algo aparece": ele
  // VIRA a barra. Os dois disputam a mesma vaga no topo, entao um quadro com
  // os dois visiveis empilha duas barras, e um quadro com nenhum deixa o topo
  // vazio. Nenhum dos dois defeitos aparece testando os componentes sozinhos:
  // so rolando a pagina de verdade.
  it('hands the top slot over: never both visible, never neither', () => {
    const { container } = render(
      <>
        <Header />
        <FloatingCta />
      </>,
    );
    const cabecalho = container.querySelector('header')!;
    const root = barra(container);

    const estado = () => ({
      header: cabecalho.getAttribute('aria-hidden') !== 'true',
      barra: root.getAttribute('data-visible') === 'true',
    });

    // Com o hero na tela: header sim, barra nao.
    expect(estado()).toEqual({ header: true, barra: false });

    // Hero passou: a troca acontece no MESMO evento, nao em dois momentos.
    setHeroOnScreen(false);
    expect(estado()).toEqual({ header: false, barra: true });

    setHeroOnScreen(true);
    expect(estado()).toEqual({ header: true, barra: false });

    // E a garantia estrutural por tras disso: os dois pediram o mesmo
    // recorte ao IntersectionObserver. Se alguem der um gatilho proprio a um
    // deles, os valores divergem e este assert cai antes do bug chegar na
    // tela.
    expect(callbacks).toHaveLength(2);
    expect(options[0]).toEqual(options[1]);
    expect(options[0].rootMargin).toBe('-80px 0px 0px 0px');
  });

  // A barra ocupa a vaga do header, nao uma vaga propria: mesmo `top`, mesmo
  // recuo lateral, e entra de -translate-y-28, que e exatamente pra onde o
  // header sai. Na metade da animacao os dois estao na mesma posicao com
  // opacidade complementar — e o que faz a troca ler como um objeto so.
  it('sits in the header slot and enters from where the header leaves', () => {
    const { container } = render(<FloatingCta />);
    const root = barra(container);

    expect(root.className).toContain('top-4');
    expect(root.className).toContain('sm:top-5');
    expect(root.className).not.toContain('bottom-');
    expect(root.className).toContain('-translate-y-28');

    setHeroOnScreen(false);
    expect(root.className).toContain('translate-y-0');
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
      expect(barra(container)).toHaveClass('translate-y-0', 'transition-none');
    });
  });
});
