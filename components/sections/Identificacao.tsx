import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { content } from '@/lib/content';

export function Identificacao() {
  const d = content.dores;
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-content">
        <SectionLabel>{d.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {d.title}
        </SplitReveal>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted md:text-sm">{d.sub}</p>

        <Reveal stagger={0.12} className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2">
          {d.thoughts.map((t) => (
            <div key={t.q} className="relative pl-5">
              <span className="absolute -left-1 -top-3 text-4xl leading-none text-blue/60" aria-hidden>
                “
              </span>
              <p className="text-sm italic leading-snug text-[#dbe3ec] md:text-[15px]">{t.q}</p>
              <small className="mt-2 block text-[11px] not-italic text-muted md:text-xs">{t.s}</small>
            </div>
          ))}
        </Reveal>

        <p className="mt-9 text-sm font-semibold text-[#cfe7f5] md:text-base">{d.turn}</p>
      </div>
    </section>
  );
}
