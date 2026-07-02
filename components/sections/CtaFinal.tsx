import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Marquee } from '@/components/motion/Marquee';
import { content } from '@/lib/content';

const MARQUEE_ITEMS = [
  'Do zero',
  'No seu ritmo',
  'Passo a passo',
  '100% prático',
  'Suporte no WhatsApp',
  'Atualizações',
];

export function CtaFinal() {
  const c = content.ctaFinal;
  return (
    <section
      className="relative overflow-hidden px-5 py-24 text-center"
      style={{
        background:
          'radial-gradient(600px 300px at 50% 50%, rgba(30,158,219,.14), transparent 65%)',
      }}
    >
      <div className="mx-auto max-w-content">
        <SplitReveal as="h2" className="text-2xl font-extrabold tracking-tight md:text-5xl">
          {c.title}
        </SplitReveal>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted md:text-[15px]">{c.sub}</p>
        <div className="mt-8 flex justify-center">
          <MagneticButton>
            <Button href={content.checkoutUrl} variant="primary">
              {c.cta}
            </Button>
          </MagneticButton>
        </div>
      </div>

      <Marquee items={MARQUEE_ITEMS} className="mt-16 text-xl opacity-70 md:text-4xl" />
    </section>
  );
}
