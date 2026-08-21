import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { content } from '@/lib/content';
import { site } from '@/lib/site';

describe('Home page', () => {
  it('renders the product hero, module anchor and offer price together', () => {
    const { container } = render(<Home />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: `${content.hero.headline.lead} ${content.hero.headline.rest}`,
      }),
    ).toBeInTheDocument();
    expect(container.querySelector('#modulos')).not.toBeNull();
    expect(container.querySelector('#caminhos')).not.toBeNull();
    expect(container.querySelector('#instrutor')).toBeNull();
    expect(container.querySelector('#tira-duvidas')).toBeNull();
    expect(container.querySelector('#dores')).not.toBeNull();
    // O FAQ virou o card direito da oferta e nao e mais uma secao propria.
    expect(container.querySelector('#faq')).toBeNull();
    expect(screen.getAllByText(content.offer.priceNow).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(content.floatingCta.urgency)).toBeInTheDocument();
    expect(container.querySelector('[data-floating-cta] a')).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
  });

  it('orders the sections for conversion: hero, dores, modulos, oferta', () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id);
    for (const id of ['hero', 'dores', 'modulos', 'evolucao', 'caminhos', 'oferta']) {
      expect(ids).toContain(id);
    }
    expect(ids.indexOf('hero')).toBeLessThan(ids.indexOf('dores'));
    expect(ids.indexOf('dores')).toBeLessThan(ids.indexOf('modulos'));
    expect(ids.indexOf('modulos')).toBeLessThan(ids.indexOf('caminhos'));
    // A oferta fecha a pagina: as duvidas, que antes vinham depois dela,
    // agora sao o card ao lado.
    expect(ids.indexOf('modulos')).toBeLessThan(ids.indexOf('evolucao'));
    expect(ids.indexOf('evolucao')).toBeLessThan(ids.indexOf('caminhos'));
    expect(ids.indexOf('caminhos')).toBeLessThan(ids.indexOf('oferta'));
    expect(ids.at(-1)).toBe('oferta');
  });

  // Os botoes do header sao um contrato com os ids das secoes, e e um
  // contrato que quebra CALADO: renomeie uma secao e o botao continua
  // clicavel, bonito, e simplesmente nao vai a lugar nenhum. Nenhum teste de
  // componente pega isso, porque o header nao conhece a pagina — so aqui,
  // onde os dois lados sao renderizados juntos.
  it('points every header button at a section that exists on the page', () => {
    const { container } = render(<Home />);
    expect(site.nav.length).toBeGreaterThan(0);

    for (const item of site.nav) {
      expect(item.href).toMatch(/^#[a-z-]+$/);
      expect(container.querySelector(item.href)).not.toBeNull();
    }

    // E o caminho de volta: toda secao com id aparece na navegacao, menos o
    // hero, que e o topo da pagina e nao um destino. Sem esta metade, uma
    // secao nova entra na pagina e fica fora do indice sem ninguem notar.
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id);
    const navegaveis = ids.filter((id) => id !== 'hero');
    expect(navegaveis.sort()).toEqual(site.nav.map((i) => i.href.slice(1)).sort());
  });
});
