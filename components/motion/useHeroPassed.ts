'use client';

import { useEffect, useState } from 'react';

const HERO_ID = 'hero';

/**
 * O recorte de 80px e a altura da barra fixa. Sem ele a troca aconteceria so
 * quando o hero saisse da tela INTEIRA, e por 80px de rolagem a barra ficaria
 * cobrindo o fim do hero.
 */
const ROOT_MARGIN = '-80px 0px 0px 0px';

/**
 * `false` enquanto o hero esta na tela, `true` depois que ele passa.
 *
 * Existe como hook porque DOIS componentes precisam do mesmo instante, e
 * precisam dele exatamente igual: o header sai quando isto vira `true` e a
 * barra flutuante entra no mesmo momento, no mesmo lugar do topo. E a troca
 * que o cliente pediu — "assim que acabar o hero o header vira essa barra".
 *
 * Em copia dupla isso quebraria calado. Os dois moravam em pontas opostas da
 * tela e usavam gatilhos DIFERENTES: o header seguia o hero, a barra aparecia
 * aos 70% da primeira tela. Havia ate uma janela documentada em que os dois
 * ficavam visiveis ao mesmo tempo, inofensiva com um em cima e outro embaixo.
 * Com os dois no topo, qualquer divergencia entre os gatilhos vira buraco
 * (nada no topo) ou colisao (duas barras empilhadas) — e as duas so aparecem
 * rolando a pagina de verdade, nunca num teste de componente isolado.
 *
 * Fallback sem IntersectionObserver: `false` pra sempre. E o lado seguro — o
 * header fica, a barra nao entra, e a pagina continua navegavel.
 */
export function useHeroPassed(): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(HERO_ID);
    if (!hero || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setPassed(!entry.isIntersecting),
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return passed;
}
