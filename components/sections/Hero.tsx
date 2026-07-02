import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;
  return (
    <section id="hero" className="relative overflow-hidden px-5 pb-24 pt-36 text-center">
      <div className="relative z-10 mx-auto max-w-content">
        <h1 className="mx-auto max-w-2xl font-extrabold leading-[1.2] tracking-tight">
          <div className="flex justify-center -translate-x-6 md:-translate-x-12">
            <SplitReveal
              as="span"
              type="lines"
              trigger="ready"
              className="text-2xl text-white md:text-4xl"
            >
              {h.headlineWords[0]}
            </SplitReveal>
          </div>
          <div className="flex justify-center translate-x-10 md:translate-x-20">
            <SplitReveal
              as="span"
              type="lines"
              trigger="ready"
              className="text-2xl text-blue md:text-4xl"
            >
              {h.headlineWords[1]}
            </SplitReveal>
          </div>
          <div className="flex justify-center -translate-x-6 md:-translate-x-12">
            <SplitReveal
              as="span"
              type="lines"
              trigger="ready"
              className="text-2xl text-white md:text-4xl"
            >
              {h.headlineWords[2]}
            </SplitReveal>
          </div>
        </h1>
        <SplitReveal
          as="p"
          type="lines"
          trigger="ready"
          className="mx-auto mt-6 max-w-md text-[11px] leading-relaxed text-white"
        >
          {h.subLines[0]}
          <br />
          {h.subLines[1]}
        </SplitReveal>

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
