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
      <div className="relative mx-auto grid min-h-[calc(100svh-24rem)] w-full max-w-content items-stretch gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center text-left">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue/15 bg-white/80 px-3 py-2 text-[11px] font-semibold text-blue-deep shadow-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-blue text-white">*</span>
            {d.label}
          </div>

          <h1 className="mt-4 max-w-3xl font-extrabold leading-[1.08] tracking-tight text-[#050914]">
            <SplitReveal
              as="span"
              type="lines"
              trigger="ready"
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {d.title}
            </SplitReveal>
          </h1>

          <Reveal stagger={0.1} className="mt-5 grid max-w-xl gap-2.5">
            {d.thoughts.map((t) => (
              <div key={t.q} className="border-l-2 border-blue pl-4">
                <p className="text-sm italic leading-snug text-[#3b4654] sm:text-[15px]">
                  “{t.q}”
                </p>
                <small className="mt-1 block text-xs not-italic text-[#667284]">{t.s}</small>
              </div>
            ))}
          </Reveal>

          <p className="mt-5 max-w-xl text-sm font-semibold text-[#050914] sm:text-base">
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
