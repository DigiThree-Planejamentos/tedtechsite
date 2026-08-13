import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { content } from '@/lib/content';

export function Dores() {
  const d = content.dores;

  return (
    <section id="dores" className="site-section section-divider scroll-mt-24">
      <div className="mx-auto w-full max-w-content text-center">
        <SectionLabel>{d.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {d.title}
        </SplitReveal>

        <Reveal
          stagger={0.1}
          className="mx-auto mt-9 grid max-w-3xl gap-5 text-left md:grid-cols-2"
        >
          {d.thoughts.map((t) => (
            <div key={t.q} className="border-l-2 border-blue pl-4">
              <p className="text-sm italic leading-snug text-[#3b4654]">“{t.q}”</p>
              <small className="mt-1 block text-xs not-italic text-[#667284]">{t.s}</small>
            </div>
          ))}
        </Reveal>

        <p className="mt-8 text-sm font-semibold text-[#050914] md:text-base">{d.turn}</p>
      </div>
    </section>
  );
}
