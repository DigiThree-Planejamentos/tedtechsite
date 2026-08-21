'use client';

import { useState } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { CountUp } from '@/components/motion/CountUp';
import { content } from '@/lib/content';

/**
 * A oferta e as duvidas na mesma secao, em dois cards pareados.
 *
 * A ligacao entre eles e o indice: a linha i da esquerda ("o que voce
 * leva") e a duvida i da direita sao o mesmo assunto visto de dois lados.
 * Um estado so — `ativo` — comanda os dois cards, e por isso e impossivel
 * o site ficar com a oferta acesa numa linha e a duvida aberta em outra.
 *
 * Clicar de qualquer um dos lados move o par: e a mesma acao, entrando por
 * portas diferentes.
 */
export function Oferta() {
  const o = content.offer;
  const [ativo, setAtivo] = useState<number | null>(0);

  function alternarPar(indice: number) {
    setAtivo((atual) => (atual === indice ? null : indice));
  }

  return (
    <section
      id="oferta"
      // Faixa BRANCA, nao escura: na troca de fundos a oferta e a virada
      // trocaram de pele. O branco puro (nao o #f7fbff das claras) e herdado
      // dos cartoes que viviam aqui — e a mesma superficie de antes, so que
      // agora ocupando a faixa inteira em vez de duas caixas.
      //
      // O recorte VOLTOU: quem vem depois e o rodape escuro, entao a
      // superficie muda de novo e ha emenda pra marcar. Por isso o
      // `site-band--no-notch` saiu daqui. Buraco de verdade na tinta,
      // mostrando os circuitos, como toda faixa clara.
      className="site-section site-band site-band--white site-band--full"
    >
      <div className="mx-auto w-full max-w-content">
        <div className="text-center">
          <SectionLabel>{o.label}</SectionLabel>
          <SplitReveal
            as="h2"
            className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl"
          >
            {o.title}
          </SplitReveal>
        </div>

        {/* No celular vira coluna unica: oferta em cima, duvidas embaixo. */}
        <div className="mx-auto mt-8 grid max-w-[1140px] gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-[92px]">
          {/* ---- Card da esquerda: o que voce leva ---- */}
          {/* Sem superficie propria: a faixa ja e branca, entao pintar um
              cartao branco em cima de branco so acrescentaria borda e sombra
              sem separar nada. Quem separa as duas colunas e o vao (gap), o
              mesmo recurso dos cards de Caminhos (.path-card zera borda,
              fundo e sombra pelo mesmo motivo).

              Some junto a virada de tokens que a .site-light-panel fazia: ela
              existia pra devolver tons ESCUROS de texto dentro da faixa
              escura. Numa faixa branca os tokens da propria faixa ja sao
              esses, entao o texto continua identico ao de antes. */}
          <div
            className="flex flex-col rounded-[1.5rem] px-5 py-3 text-left md:px-6 md:py-4"
          >
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-[color:var(--band-fg-faint)] md:text-sm">
              {o.includesTitle}
            </h3>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-xs text-[color:var(--band-fg-faint)] line-through md:text-sm">
                {o.priceFrom}
              </span>
              <span className="text-3xl font-extrabold text-grad md:text-4xl">
                <CountUp value={o.priceNow} />
              </span>
              <span className="text-xs text-[color:var(--band-fg-muted)] md:text-sm">
                {o.installments}
              </span>
            </div>

            <ul className="mt-4 grid">
              {o.pairs.map((par, i) => (
                <li
                  key={par.leva}
                  data-par-leva
                  data-ativo={i === ativo ? 'true' : 'false'}
                  className="par"
                >
                  <button
                    type="button"
                    onClick={() => alternarPar(i)}
                    aria-expanded={i === ativo}
                    aria-controls={`resposta-${i}`}
                    /* py-1, era py-1.5: sao oito itens, entao cada 2px por
                       item vira 32px de secao — e e altura que a base precisa
                       ceder pro recorte. Cortar par nao era opcao: cada linha
                       daqui e o outro lado de uma duvida do card vizinho. */
                    className="flex w-full items-start gap-3 rounded-lg py-1 pl-3 pr-2 text-left text-sm transition-colors md:text-[15px]"
                  >
                    <span className="mt-[2px] shrink-0 text-blue" aria-hidden>
                      ✓
                    </span>
                    <span>{par.leva}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4">
              <MagneticButton>
                <Button href={content.checkoutUrl} variant="primary">
                  {o.cta}
                </Button>
              </MagneticButton>
              <p className="mt-3 text-[11px] text-[color:var(--band-fg-faint)] md:text-xs">
                {o.payments}
              </p>
            </div>
          </div>

          {/* ---- Card da direita: as mesmas linhas, como duvida ---- */}
          <div className="flex flex-col rounded-[1.5rem] px-5 py-3 text-left md:px-6 md:py-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-[color:var(--band-fg-faint)] md:text-sm">
              {o.doubtsTitle}
            </h3>

            <ul className="mt-3 grid">
              {o.pairs.map((par, i) => (
                <li
                  key={par.duvida}
                  data-par-duvida
                  data-ativo={i === ativo ? 'true' : 'false'}
                  className="par"
                >
                  <button
                    type="button"
                    onClick={() => alternarPar(i)}
                    aria-expanded={i === ativo}
                    aria-controls={`resposta-${i}`}
                    className="flex w-full items-start justify-between gap-3 rounded-lg py-2 pl-3 pr-2 text-left transition-colors"
                  >
                    {/* Mesmo tom das falas de "Ja pensou alguma dessas?":
                        entre aspas e em italico, como quem pensa alto. */}
                    <span className="text-sm italic leading-snug text-[color:var(--band-fg-body)] md:text-[15px]">
                      “{par.duvida}”
                    </span>
                    <span className="par-chevron mt-[3px] shrink-0 text-blue" aria-hidden>
                      ▾
                    </span>
                  </button>

                  <div id={`resposta-${i}`} className="par-resposta">
                    <div>
                      <p className="pb-3 pl-3 pr-2 text-xs leading-relaxed text-[color:var(--band-fg-muted)] md:text-[13px]">
                        {par.resposta}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4">
              <p className="text-[11px] text-[color:var(--band-fg-faint)] md:text-xs">
                {o.askHint}
              </p>
              <div className="mt-2">
                <MagneticButton>
                  <Button href={content.whatsappUrl} variant="whatsapp">
                    {o.askCta}
                  </Button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
