import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { HeroVideo } from '@/components/sections/HeroVideo';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;

  return (
    <section
      id="hero"
      className="site-section site-section--compact site-band site-band--light site-band--full relative overflow-hidden pt-24 sm:pt-28"
    >
      {/* O pt-24/28 era do <main>, que reservava espaco para o header
          fixo. Sem o cartao, a faixa do Hero passa a ser a unica
          responsavel por nao deixar o titulo embaixo do header.

          O min-h interno saiu: aquele calc foi dimensionado para o
          layout do cartao e agora competiria com a altura da faixa. */}
      <div className="relative mx-auto grid w-full max-w-content items-stretch gap-10 pt-10 md:grid-cols-[0.85fr_1.15fr] md:pt-14 lg:pt-16">
        {/* `justify-between`, nao `justify-center`: a folga vertical da coluna
            vai para as duas pontas em vez de ficar sobrando em cima e embaixo.
            O titulo sobe e o CTA desce pelo mesmo tanto, e os bullets, que
            ficam no meio, nao saem do lugar.

            No mobile a coluna nao tem folga nenhuma para distribuir, entao
            `justify-between` nao muda nada la — e por isso a elevacao continua
            sendo `transform`, que funciona mesmo sem espaco livre. */}
        <div className="flex -translate-y-4 flex-col justify-between text-left md:-translate-y-6 lg:-translate-y-10">
          <h1 className="max-w-3xl font-extrabold leading-[1.08] tracking-tight text-[color:var(--band-fg-strong)]">
            <SplitReveal as="span" type="lines" trigger="ready" className="block">
              {/* The space between the spans is load-bearing: it keeps the
                  accessible name "Chega de pagar técnico" in one piece. */}
              {/* leading-[1.25] is not styling: the text-* utilities ship
                  line-height 1, which makes the GSAP line mask clip the
                  descender of the "g". The font needs >= 1.19em to fit it.
                  The negative top margin cancels the extra half-leading so
                  the headline keeps sitting close under the eyebrow. */}
              <span className="-mt-[0.12em] block font-subtitle text-5xl/[1.25] italic text-blue sm:text-6xl/[1.25] md:text-7xl/[1.25] lg:text-8xl/[1.25]">
                {h.headline.lead}
              </span>{' '}
              {/* Same 1.25 leading as the lead line, and for the same reason:
                  "pagar" has a descender and the mask clips at the line box.

                  The sizes are measured, not chosen: each one lands this line's
                  right ink edge on the same x as the "a" of "Chega" above it.
                  Measured against the glyph ink, not the advance box, because
                  the italic overhangs its box and the eye reads the ink. They
                  are tied to these two exact strings and to Space Grotesk
                  italic above — changing either text or font means measuring
                  again. */}
              <span className="-mt-[0.12em] block whitespace-nowrap text-[19.09px]/[1.25] sm:text-[23.82px]/[1.25] md:text-[28.56px]/[1.25] lg:text-[38.04px]/[1.25]">
                {h.headline.rest}
              </span>
            </SplitReveal>
          </h1>

          <Reveal as="ul" stagger={0.1} className="mt-5 grid max-w-xl gap-2.5">
            {h.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 text-xs text-[color:var(--band-fg-strong)] sm:text-sm"
              >
                <span className="text-blue" aria-hidden>✓</span>
                <span>{bullet}</span>
              </li>
            ))}
          </Reveal>

          <div className="mt-6 flex flex-wrap items-center gap-4 [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-6 [&_a]:text-sm">
            <MagneticButton>
              <Button href={content.checkoutUrl} variant="primary">
                {h.cta}
              </Button>
            </MagneticButton>
          </div>
        </div>

        <HeroVideo />
      </div>
    </section>
  );
}
