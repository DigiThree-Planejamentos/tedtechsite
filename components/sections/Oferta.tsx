import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import { content } from '@/lib/content';

export function Oferta() {
  const o = content.offer;
  return (
    <section
      id="oferta"
      className="site-section section-divider scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-content text-center">
        <SectionLabel>{o.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {o.title}
        </SplitReveal>

        <div className="site-panel mx-auto mt-10 grid max-w-3xl overflow-hidden rounded-[1.5rem] text-left md:grid-cols-2">
          <div className="p-8">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-[#667284] md:text-sm">
              {o.includesTitle}
            </h3>
            <Reveal as="ul" stagger={0.1} className="mt-5 space-y-3">
              {o.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm md:text-[15px]">
                  <span className="text-blue" aria-hidden>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </Reveal>
          </div>

          <div className="flex flex-col justify-center border-t border-blue/20 p-8 text-center md:border-l md:border-t-0">
            <div className="text-xs text-[#667284] line-through md:text-sm">{o.priceFrom}</div>
            <div className="mt-1 text-3xl font-extrabold text-grad md:text-4xl">
              <CountUp value={o.priceNow} />
            </div>
            <div className="mt-1 text-xs text-[#526071] md:text-sm">{o.installments}</div>
            <div className="mt-6 flex justify-center">
              <MagneticButton>
                <Button href={content.checkoutUrl} variant="primary">
                  {o.cta}
                </Button>
              </MagneticButton>
            </div>
            <div className="mt-4 text-[11px] text-[#667284] md:text-xs">{o.payments}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
