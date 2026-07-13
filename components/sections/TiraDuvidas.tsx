import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { content } from '@/lib/content';

export function TiraDuvidas() {
  const t = content.tiraDuvidas;
  return (
    <section
      id="tira-duvidas"
      className="site-section section-divider scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-content text-center">
        <SectionLabel>{t.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {t.title}
        </SplitReveal>

        <div className="site-dark-panel mx-auto mt-9 max-w-md overflow-hidden rounded-[1.5rem] text-left">
          <div className="flex items-center gap-2 border-b border-blue/20 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-wa" aria-hidden />
            <span className="text-xs font-semibold md:text-sm">{t.chatTitle}</span>
            <span className="ml-auto text-[11px] text-[#9fb7d5] md:text-xs">{t.chatStatus}</span>
          </div>
          <Reveal stagger={0.18} className="space-y-3 px-4 py-5">
            {t.bubbles.map((b, idx) => (
              <div
                key={idx}
                className={b.from === 'me' ? 'flex justify-end' : 'flex justify-start'}
              >
                <span
                  className={
                    b.from === 'me'
                      ? 'btn-grad max-w-[80%] rounded-[1rem] border border-blue/20 px-3 py-2 text-xs md:text-sm'
                      : 'max-w-[80%] rounded-[1rem] border border-blue/15 bg-white/[0.07] px-3 py-2 text-xs text-text md:text-sm'
                  }
                >
                  {b.text}
                </span>
              </div>
            ))}
          </Reveal>
          <div className="flex items-center gap-2 border-t border-blue/20 px-4 py-3 text-xs text-[#9fb7d5] md:text-sm">
            {t.inputPlaceholder}
          </div>
        </div>

        <div className="mt-7 flex justify-center">
          <MagneticButton>
            <Button href={content.whatsappUrl} variant="whatsapp">
              {t.cta}
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
