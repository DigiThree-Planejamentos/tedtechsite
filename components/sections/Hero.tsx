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
      className="site-section site-section--compact relative overflow-hidden"
    >
      <div className="relative mx-auto grid min-h-[calc(100svh-24rem)] w-full max-w-content items-stretch gap-10 pt-10 md:grid-cols-[0.85fr_1.15fr] md:pt-14 lg:pt-16">
        <div className="flex flex-col justify-center text-left">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-blue sm:text-xs">
            {h.eyebrow}
          </p>

          <h1 className="mt-3 max-w-3xl font-extrabold leading-[1.08] tracking-tight text-[#050914]">
            <SplitReveal as="span" type="lines" trigger="ready" className="block">
              {/* The space between the spans is load-bearing: it keeps the
                  accessible name "Chega de pagar técnico" in one piece. */}
              {/* leading-[1.25] is not styling: the text-* utilities ship
                  line-height 1, which makes the GSAP line mask clip the
                  descender of the "g". The font needs >= 1.19em to fit it.
                  The negative top margin cancels the extra half-leading so
                  the headline keeps sitting close under the eyebrow. */}
              <span className="-mt-[0.12em] block text-5xl/[1.25] text-blue sm:text-6xl/[1.25] md:text-7xl/[1.25] lg:text-8xl/[1.25]">
                {h.headline.lead}
              </span>{' '}
              {/* Same 1.25 leading as the lead line, and for the same reason:
                  "pagar" has a descender and the mask clips at the line box. */}
              <span className="-mt-[0.12em] block text-3xl/[1.25] sm:text-4xl/[1.25] md:text-5xl/[1.25] lg:text-6xl/[1.25]">
                {h.headline.rest}
              </span>
            </SplitReveal>
          </h1>

          <p className="mt-4 max-w-xl text-sm text-[#3b4654] sm:text-base">{h.sub}</p>

          <Reveal as="ul" stagger={0.1} className="mt-5 grid max-w-xl gap-2.5">
            {h.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 text-xs text-[#050914] sm:text-sm"
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
