import { beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Modulos } from '@/components/sections/Modulos';
import { content } from '@/lib/content';

function installMatchMedia({ reducedMotion = false }: { reducedMotion?: boolean } = {}) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') && reducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('Modulos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installMatchMedia();
    Object.defineProperty(Element.prototype, 'animate', {
      configurable: true,
      value: vi.fn(() => ({ cancel: vi.fn() })),
    });
    Object.defineProperty(Element.prototype, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => []),
    });
  });

  it('has the modulos anchor and renders all 6 module titles', () => {
    const { container } = render(<Modulos />);
    expect(container.querySelector('#modulos')).not.toBeNull();
    for (const m of content.modules) {
      // O titulo aparece duas vezes: no h3 e no titulo vertical do card.
      expect(screen.getAllByText(m.title).length).toBeGreaterThan(0);
    }
  });

  it('shows title and description on every card, without the lesson list', () => {
    const { container } = render(<Modulos />);
    expect(container.querySelectorAll('article')).toHaveLength(6);
    expect(container.querySelector('details')).toBeNull();
    for (const module of content.modules) {
      expect(screen.getByText(module.desc)).toBeInTheDocument();
    }

    // Os topicos sairam do card por pedido do cliente: o card agora diz o
    // que o modulo E, nao o que ele lista. `lessons` continua no content
    // porque e a grade real do curso e content.test guarda ela — mas nenhum
    // card renderiza. Sem este assert, uma volta acidental (um `map` num
    // refactor, um merge) so apareceria no print, e cada card ganharia de
    // volta os ~140px de texto que a foto acabou de herdar.
    expect(container.querySelector('ul')).toBeNull();
    for (const lesson of content.modules.flatMap((m) => m.lessons)) {
      expect(screen.queryByText(lesson)).toBeNull();
    }
  });

  it('renders the corresponding image and alternative text for every module', () => {
    render(<Modulos />);

    for (const module of content.modules) {
      const image = screen.getByAltText(module.imageAlt);
      expect(decodeURIComponent(image.getAttribute('src') ?? '')).toContain(
        module.image,
      );
    }
  });

  it('keeps exactly one card open, starting on the first', () => {
    const { container } = render(<Modulos />);
    const cards = Array.from(container.querySelectorAll('article'));

    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(1);
    expect(cards[0]).toHaveAttribute('data-active', 'true');
  });

  it('opens the card under the pointer and closes the previous one', () => {
    const { container } = render(<Modulos />);
    const cards = Array.from(container.querySelectorAll('article'));

    fireEvent.mouseEnter(cards[3]);

    expect(cards[3]).toHaveAttribute('data-active', 'true');
    expect(cards[0]).toHaveAttribute('data-active', 'false');
    // A invariante que importa: nunca dois abertos ao mesmo tempo.
    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(1);
  });

  it('opens the card that receives focus, so the keyboard reaches it too', () => {
    const { container } = render(<Modulos />);
    const cards = Array.from(container.querySelectorAll('article'));

    // O foco borbulha do link do card ate o article.
    fireEvent.focus(cards[2].querySelector('a')!);

    expect(cards[2]).toHaveAttribute('data-active', 'true');
    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(1);
  });

  it('gives every card a vertical spine title for the collapsed state', () => {
    const { container } = render(<Modulos />);
    const spines = Array.from(container.querySelectorAll('.module-card__spine'));

    expect(spines).toHaveLength(6);
    spines.forEach((spine, i) => {
      expect(spine).toHaveTextContent(content.modules[i].title);
      // Decorativo: quem nomeia o card e o h3.
      expect(spine).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('provides controls to step through the modules', () => {
    render(<Modulos />);
    const previous = screen.getByRole('button', { name: 'Ver módulos anteriores' });
    const next = screen.getByRole('button', { name: 'Ver próximos módulos' });

    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();
    expect(previous).toHaveClass('module-stepper-button');
    expect(next).toHaveAttribute('data-stepper-direction', 'next');
    expect(previous).toHaveTextContent('‹');
    expect(next).toHaveTextContent('›');
    expect(screen.getByText('01')).toBeInTheDocument();

    fireEvent.click(next);
    expect(previous).toBeEnabled();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-active="true"]')).toHaveLength(1);
  });

  it('walks the stepper all the way to the last module and stops there', () => {
    const { container } = render(<Modulos />);
    const next = screen.getByRole('button', { name: 'Ver próximos módulos' });

    for (let i = 0; i < content.modules.length; i += 1) fireEvent.click(next);

    expect(screen.getByText('06')).toBeInTheDocument();
    expect(next).toBeDisabled();
    expect(Array.from(container.querySelectorAll('article')).at(-1)).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('does not animate when clicking a disabled stepper control', () => {
    render(<Modulos />);
    const previous = screen.getByRole('button', { name: 'Ver módulos anteriores' });

    fireEvent.click(previous);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(Element.prototype.animate).not.toHaveBeenCalled();
  });

  it('resets the module list when clicking the stepper value', () => {
    render(<Modulos />);
    const next = screen.getByRole('button', { name: 'Ver próximos módulos' });

    fireEvent.click(next);
    expect(screen.getByText('02')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Módulo 02 de 06. Voltar ao primeiro módulo',
      }),
    );
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('skips the stepper rebound when reduced motion is requested', () => {
    installMatchMedia({ reducedMotion: true });

    render(<Modulos />);
    const next = screen.getByRole('button', { name: 'Ver próximos módulos' });

    fireEvent.click(next);
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(Element.prototype.animate).not.toHaveBeenCalled();
  });

  it('renders module cards without decorative borders', () => {
    const { container } = render(<Modulos />);
    for (const card of container.querySelectorAll('article')) {
      expect(card).toHaveClass('rounded-[1.5rem]');
      expect(card).not.toHaveClass('border', 'border-blue/25');
      expect(card).not.toHaveClass('clean-border');
      expect(card.className).not.toMatch(/\bbg-/);
    }
  });

  it('keeps native horizontal scrolling below the accordion breakpoint', () => {
    const { container } = render(<Modulos />);
    const trilho = container.querySelector('[data-module-carousel]');

    expect(trilho?.className).toContain('max-lg:overflow-x-auto');
    expect(trilho?.className).toContain('max-lg:snap-x');
    for (const card of container.querySelectorAll('article')) {
      expect(card.className).toContain('max-lg:snap-center');
      expect(card.className).toContain('max-lg:shrink-0');
    }
  });

  it('supports arrow-key navigation from the accordion region', () => {
    render(<Modulos />);
    const trilho = screen.getByRole('region', { name: 'Módulos do curso' });

    fireEvent.keyDown(trilho, { key: 'ArrowRight' });
    expect(screen.getByText('02')).toBeInTheDocument();

    fireEvent.keyDown(trilho, { key: 'ArrowLeft' });
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('no longer pins the section, so it is a plain full-screen band', () => {
    const { container } = render(<Modulos />);
    const secao = container.querySelector('#modulos');

    // O pin consumia quatro telas de rolagem para arrastar o carrossel.
    // Com o acordeao os seis cards cabem numa tela so.
    expect(container.querySelector('.module-pin')).toBeNull();
    expect(secao?.className).toContain('site-band--full');
  });
});
