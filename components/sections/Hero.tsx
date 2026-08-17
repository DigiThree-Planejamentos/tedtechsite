import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
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
      <div className="relative mx-auto grid w-full max-w-[1280px] items-stretch gap-10 pt-10 md:grid-cols-[0.78fr_1.22fr] md:pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:pt-16">
        {/* `justify-between`, nao `justify-center`: a folga vertical da coluna
            vai para as duas pontas em vez de ficar sobrando em cima e embaixo.
            O titulo sobe e o CTA desce pelo mesmo tanto, e os bullets, que
            ficam no meio, nao saem do lugar.

            No mobile a coluna nao tem folga nenhuma para distribuir, entao
            `justify-between` nao muda nada la — e por isso a elevacao continua
            sendo `transform`, que funciona mesmo sem espaco livre. */}
        <div className="flex -translate-y-4 flex-col justify-between text-left md:-translate-y-6 lg:-translate-y-10">
          <div>
          <h1 className="max-w-3xl translate-y-4 font-extrabold leading-[1.08] tracking-tight text-[color:var(--band-fg-strong)] md:translate-y-5 lg:translate-y-6">
            <SplitReveal as="span" type="lines" trigger="ready" className="block">
              {/* The space between the spans is load-bearing: it keeps the
                  accessible name "Chega de pagar técnico" in one piece. */}
              {/* leading-[1.25] is not styling: the text-* utilities ship
                  line-height 1, which makes the GSAP line mask clip the
                  descender of the "g". The font needs >= 1.19em to fit it.
                  The negative top margin cancels the extra half-leading so
                  the headline keeps sitting close under the eyebrow. */}
                <span className="-mt-[0.12em] block font-hero text-6xl/[1.25] sm:text-7xl/[1.25] md:text-8xl/[1.25] lg:text-9xl/[1.25] text-[4.25rem]/[1.25] font-bold italic tracking-[-0.045em] text-blue sm:text-[5rem]/[1.25] md:text-[7rem]/[1.25] lg:text-[9rem]/[1.25]">
                {h.headline.lead}
              </span>{' '}
              {/* Same 1.25 leading as the lead line, and for the same reason:
                  "pagar" has a descender and the mask clips at the line box.

                  The sizes are measured, not chosen: each one lands this line's
                  This supporting line stays deliberately smaller than the
                  display word above it at every breakpoint. */}
                <span className="-mt-[0.12em] block translate-y-0 whitespace-nowrap text-[20px]/[1.25] sm:-translate-y-2 sm:text-[24px]/[1.25] md:text-[31px]/[1.25] lg:text-[42px]/[1.25] text-[22px]/[1.25] font-semibold tracking-[0em] [word-spacing:0.22em] md:translate-x-4 lg:translate-x-4 sm:text-[28px]/[1.25] md:text-[36px]/[1.25] lg:text-[48px]/[1.25]">
                {h.headline.rest}
              </span>
            </SplitReveal>
          </h1>

          <p className="mt-5 max-w-xl translate-x-2 translate-y-6 text-sm leading-relaxed text-[color:var(--band-fg-strong)] sm:text-base md:translate-x-4 lg:translate-x-4">
            <span className="block">Pare de gastar com técnico e comece a ganhar</span>
            <span className="block">como um. Aprenda manutenção do zero, resolva</span>
            <span className="block">seus próprios problemas e use essa habilidade</span>
            <span className="block">para ganhar uma renda extra ou até como profissão.</span>
          </p>
          </div>

          <div className="mt-6 flex translate-x-2 translate-y-2 flex-wrap items-center gap-4 sm:translate-y-0 md:translate-x-4 lg:translate-x-4 [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-6 [&_a]:text-sm">
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
