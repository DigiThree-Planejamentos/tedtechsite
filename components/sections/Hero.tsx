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

          <h1 className="mt-3 max-w-3xl leading-[1.08] tracking-tight text-[#050914]">
            <SplitReveal as="span" type="lines" trigger="ready" className="block">
              {/* The space between the spans is load-bearing: it keeps the
                  accessible name "Chega de pagar técnico" in one piece. */}
              <span className="block font-serif text-6xl font-normal italic leading-[1.1] tracking-normal sm:text-7xl md:text-8xl lg:text-[7rem]">
                {h.headline.lead}
              </span>{' '}
              <span className="block font-sans text-3xl font-extrabold sm:text-4xl md:text-5xl lg:text-6xl">
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
