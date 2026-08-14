import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '@/app/page';

// O ritmo da pagina, na ordem do DOM. Cresce nas tarefas 2 e 3 ate
// cobrir as sete secoes. `id` vazio = a secao Evolucao, que nao tem id.
// `full: false` marca excecao declarada, nao esquecimento.
// Claro e escuro se alternam do inicio ao fim. As faixas escuras sao
// transparentes: quem preenche o vao e o fundo do site com o canvas de
// circuitos. Isso faz das claras as unicas superficies solidas — e por
// isso a aba pertence a elas.
//
// `aba: true` marca toda faixa clara que vem depois de uma escura, que
// e onde a superficie solida reaparece e se anuncia.
export const RITMO = [
  { id: 'hero', tom: 'light', full: true, aba: false },
  { id: 'dores', tom: 'dark', full: true, aba: false },
  // Modulos e pinada pelo ScrollTrigger e ja ocupa a tela. Altura minima
  // injetaria uma tela vazia antes do pin. Excecao declarada.
  { id: 'modulos', tom: 'light', full: false, aba: true },
  { id: '', tom: 'dark', full: true, aba: false },
  { id: 'caminhos', tom: 'light', full: true, aba: true },
  { id: 'oferta', tom: 'dark', full: true, aba: false },
  { id: 'faq', tom: 'light', full: true, aba: true },
];

describe('Faixas da pagina', () => {
  it('da a cada secao o tom e a altura que o ritmo manda', () => {
    const { container } = render(<Home />);
    const secoes = Array.from(container.querySelectorAll('main section'));

    RITMO.forEach((esperado, i) => {
      const secao = secoes[i];
      expect(secao, `secao ${i} (${esperado.id || 'sem id'}) nao existe`).toBeTruthy();
      expect(secao.id).toBe(esperado.id);
      expect(secao.className).toContain('site-band');
      expect(secao.className).toContain(`site-band--${esperado.tom}`);
      if (esperado.full) {
        expect(secao.className).toContain('site-band--full');
      } else {
        expect(secao.className).not.toContain('site-band--full');
      }
    });
  });

  it('alterna os tons, sem duas faixas iguais coladas', () => {
    const { container } = render(<Home />);
    const tons = Array.from(container.querySelectorAll('main section')).map((s) =>
      s.className.includes('site-band--dark') ? 'dark' : 'light',
    );
    // O ritmo so e ritmo se nenhuma vizinha repetir o tom.
    for (let i = 1; i < tons.length; i += 1) {
      expect(tons[i], `secoes ${i - 1} e ${i} tem o mesmo tom`).not.toBe(tons[i - 1]);
    }
  });

  it('poe a aba em toda faixa clara que volta depois de uma escura', () => {
    const { container } = render(<Home />);
    const secoes = Array.from(container.querySelectorAll('main section'));

    RITMO.forEach((esperado, i) => {
      const temAba = !!secoes[i].querySelector('.section-tab');
      expect(temAba, `secao ${esperado.id || 'evolucao'}: aba ${temAba ? 'sobrando' : 'faltando'}`).toBe(
        esperado.aba,
      );
    });
    // Nenhuma faixa escura carrega aba: ela e transparente, e uma aba
    // transparente nao desenha forma nenhuma.
    expect(container.querySelectorAll('.section-tab')).toHaveLength(
      RITMO.filter((r) => r.aba).length,
    );
  });

  it('nao deixa a aba ser cortada por overflow na secao que a hospeda', () => {
    const { container } = render(<Home />);
    for (const aba of Array.from(container.querySelectorAll('.section-tab'))) {
      const secao = aba.closest('section');
      // A aba fica pendurada acima da secao (bottom-full); um
      // overflow-hidden na secao a cortaria inteira.
      expect(secao?.className, `${secao?.id} corta a aba`).not.toContain('overflow-hidden');
    }
  });

  it('nao tem mais o cartao branco envolvendo a pagina', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('.site-card')).toBeNull();
  });

  it('nao deixa nenhuma secao fora do ritmo', () => {
    const { container } = render(<Home />);
    const secoes = container.querySelectorAll('main section');
    expect(secoes).toHaveLength(RITMO.length);
  });
});
