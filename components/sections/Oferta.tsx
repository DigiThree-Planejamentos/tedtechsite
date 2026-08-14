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
  const [ativo, setAtivo] = useState(0);

  return (
    <section
      id="oferta"
      className="site-section site-band site-band--dark site-band--full scroll-mt-24"
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
        <div className="mt-9 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* ---- Card da esquerda: o que voce leva ----
              data-offer-anchor: e este card que a barra fixa do rodape
              observa. Enquanto ele estiver na tela, o preco e o botao ja
              estao a vista e a barra sai de cena. */}
          <div
            data-offer-anchor
            className="site-dark-panel flex flex-col rounded-[1.5rem] p-6 text-left md:p-8"
          >
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-[color:var(--band-fg-faint)] md:text-sm">
              {o.includesTitle}
            </h3>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
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

            <ul className="mt-6 grid gap-1">
              {o.pairs.map((par, i) => (
                <li
                  key={par.leva}
                  data-par-leva
                  data-ativo={i === ativo ? 'true' : 'false'}
                  className="par"
                >
                  <button
                    type="button"
                    onClick={() => setAtivo(i)}
                    aria-expanded={i === ativo}
                    aria-controls={`resposta-${i}`}
                    className="flex w-full items-start gap-3 rounded-lg py-2 pl-3 pr-2 text-left text-sm transition-colors md:text-[15px]"
                  >
                    <span className="mt-[2px] shrink-0 text-blue" aria-hidden>
                      ✓
                    </span>
                    <span>{par.leva}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
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
          <div className="site-dark-panel flex flex-col rounded-[1.5rem] p-6 text-left md:p-8">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-[color:var(--band-fg-faint)] md:text-sm">
              {o.doubtsTitle}
            </h3>

            <ul className="mt-4 grid gap-1">
              {o.pairs.map((par, i) => (
                <li
                  key={par.duvida}
                  data-par-duvida
                  data-ativo={i === ativo ? 'true' : 'false'}
                  className="par"
                >
                  <button
                    type="button"
                    onClick={() => setAtivo(i)}
                    aria-expanded={i === ativo}
                    aria-controls={`resposta-${i}`}
                    className="flex w-full items-start justify-between gap-3 rounded-lg py-2.5 pl-3 pr-2 text-left transition-colors"
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

            <div className="mt-auto pt-6">
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
