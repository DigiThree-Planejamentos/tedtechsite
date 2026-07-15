import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { HeroVideo } from '@/components/sections/HeroVideo';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;
  const d = content.dores;

  return (
    <section
      id="hero"
      className="site-section site-section--compact relative overflow-hidden"
    >
      <div className="relative mx-auto grid min-h-[calc(100svh-24rem)] w-full max-w-content items-stretch gap-10 pt-10 md:grid-cols-[0.85fr_1.15fr] md:pt-14 lg:pt-16">
        <div className="flex flex-col justify-center text-left">
          <h1 className="max-w-3xl font-extrabold leading-[1.08] tracking-tight text-[#050914]">
            <SplitReveal
              as="span"
              type="lines"
            trigger="ready"
            className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          >
              <span className="text-blue">Já pensou</span>{' '}
              <span className="inline-block text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px]">
                alguma dessas?
              </span>
            </SplitReveal>
          </h1>

          <Reveal stagger={0.1} className="mt-5 grid max-w-xl gap-2.5">
            {d.thoughts.map((t) => (
              <div key={t.q} className="border-l-2 border-blue pl-4">
                <p className="text-xs italic leading-snug text-[#3b4654] sm:text-sm">
                  “{t.q}”
                </p>
                <small className="mt-1 block text-[11px] not-italic text-[#667284]">{t.s}</small>
              </div>
            ))}
          </Reveal>

          <p className="mt-5 max-w-xl text-xs font-semibold text-[#050914] sm:text-sm">
            {d.turn}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-6 [&_a]:text-sm">
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
