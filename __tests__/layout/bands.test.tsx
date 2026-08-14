import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '@/app/page';

// O ritmo da pagina, na ordem do DOM. Cresce nas tarefas 2 e 3 ate
// cobrir as sete secoes. `id` vazio = a secao Evolucao, que nao tem id.
// `full: false` marca excecao declarada, nao esquecimento.
// Claro e escuro se alternam do inicio ao fim. As faixas escuras sao
// transparentes: quem preenche o vao e o fundo do site com o canvas de
// circuitos. A propria troca de tom e a separacao entre uma secao e a
// seguinte — sem fio, sem aba, sem nenhum enfeite na emenda.
export const RITMO = [
  { id: 'hero', tom: 'light', full: true },
  { id: 'dores', tom: 'dark', full: true },
  // Modulos era a excecao enquanto o carrossel era pinado por
  // ScrollTrigger. O acordeao poe os seis cards numa tela so, o pin saiu,
  // e a secao virou uma faixa normal como as outras.
  { id: 'modulos', tom: 'light', full: true },
  { id: '', tom: 'dark', full: true },
  { id: 'caminhos', tom: 'light', full: true },
  { id: 'oferta', tom: 'dark', full: true },
  { id: 'faq', tom: 'light', full: true },
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

  it('deixa a emenda entre as secoes limpa, so a troca de tom', () => {
    const { container } = render(<Home />);
    // A aba de canto concavo foi tirada por decisao do cliente. Este
    // teste existe para que ela nao volte por acidente junto com algum
    // outro enfeite de emenda — o fio do .section-divider inclusive.
    expect(container.querySelectorAll('.section-tab')).toHaveLength(0);
    expect(container.querySelectorAll('.section-divider')).toHaveLength(0);
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
