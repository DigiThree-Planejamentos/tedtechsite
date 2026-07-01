import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { CircuitHero } from '@/components/webgl/CircuitHero';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;
  return (
    <section className="relative overflow-hidden bg-bg px-5 pb-24 pt-36 text-center">
      <CircuitHero />
      <Parallax
        speed={0.35}
        className="pointer-events-none absolute inset-x-0 top-24 flex justify-center"
      >
        <span className="ghost-word text-[22vw] md:text-[16vw]">{h.ghost}</span>
      </Parallax>
      <div className="relative z-10 mx-auto max-w-content">
        <SplitReveal
          as="h1"
          type="lines"
          trigger="ready"
          className="mx-auto max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl"
        >
          {h.headlineA} <span className="text-white">{h.headlineHighlight}</span>
        </SplitReveal>
        <SplitReveal
          as="p"
          type="lines"
          trigger="ready"
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white"
        >
          {h.sub}
        </SplitReveal>

        <Reveal className="mx-auto mt-9 flex max-w-lg items-center gap-2 rounded-2xl border border-white/10 px-4 py-3">
          <span className="text-white" aria-hidden>🔎</span>
          <span className="flex-1 text-left text-sm text-white">{h.searchPlaceholder}</span>
        </Reveal>
        <div className="mt-9 flex justify-center">
          <MagneticButton>
            <Button href={content.checkoutUrl} variant="primary">
              {h.cta}
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
