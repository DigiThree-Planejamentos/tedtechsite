import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '@/app/page';

// O ritmo da pagina, na ordem do DOM. Cresce nas tarefas 2 e 3 ate
// cobrir as sete secoes. `id` vazio = a secao Evolucao, que nao tem id.
// `full: false` marca excecao declarada, nao esquecimento.
export const RITMO = [
  { id: 'hero', tom: 'light', full: true },
  { id: 'dores', tom: 'light', full: true },
  // Modulos e pinada pelo ScrollTrigger e ja ocupa a tela. Altura minima
  // injetaria uma tela vazia antes do pin. Excecao declarada.
  { id: 'modulos', tom: 'light', full: false },
  { id: '', tom: 'light', full: true },
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
});
