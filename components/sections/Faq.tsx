import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { content } from '@/lib/content';

export function Faq() {
  const f = content.faq;
  const items = f.items.filter((item) => item.a !== '');

  if (items.length === 0) return null;

  return (
    <section id="faq" className="site-section site-band site-band--light site-band--full scroll-mt-24">
      <div className="mx-auto w-full max-w-content text-center">
        <SectionLabel>{f.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {f.title}
        </SplitReveal>

        <div className="mx-auto mt-9 max-w-2xl text-left">
          {items.map((item) => (
            <details key={item.q} className="faq-item border-b border-blue/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-[color:var(--band-fg-strong)] [&::-webkit-details-marker]:hidden md:text-base">
                <span>{item.q}</span>
                <span className="faq-chevron shrink-0 text-blue" aria-hidden>▾</span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-[color:var(--band-fg-body)]">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-xs text-[color:var(--band-fg-faint)] md:text-sm">{f.ctaHint}</p>
        <div className="mt-3 flex justify-center">
          <MagneticButton>
            <Button href={content.whatsappUrl} variant="whatsapp">
              {f.cta}
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
