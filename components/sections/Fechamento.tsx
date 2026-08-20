import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

/**
 * Fechamento da pagina: faixa branca pura (site-band--white) de tela cheia,
 * no mesmo ritmo das outras seis. O rodape, que ja e branco, emenda nela
 * sem linha e a pagina termina numa superficie so.
 *
 * Sem id de proposito: page.test exige `oferta` como ultima section[id].
 */
export function Fechamento() {
  const f = content.fechamento;
  return (
    <section className="site-section site-band site-band--white site-band--full text-center">
      <div className="mx-auto w-full max-w-content">
        <SectionLabel>{f.label}</SectionLabel>
        <SplitReveal
          as="h2"
          className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl"
        >
          {f.title}
        </SplitReveal>
        <Reveal variant="simple" className="mx-auto mt-4 max-w-xl">
          <p className="text-sm leading-relaxed text-[color:var(--band-fg-body)] md:text-base">
            {f.sub}
          </p>
          <div className="mt-7 flex justify-center [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-7 [&_a]:text-sm">
            <MagneticButton>
              <Button href={content.checkoutUrl} variant="primary">
                {f.cta}
              </Button>
            </MagneticButton>
          </div>
          <p className="mt-3 text-[11px] text-[color:var(--band-fg-faint)] md:text-xs">
            {content.offer.payments}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
