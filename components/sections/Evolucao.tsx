import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import { GaugeRing } from '@/components/motion/GaugeRing';
import { content } from '@/lib/content';

export function Evolucao() {
  const e = content.evolucao;
  return (
    <section className="site-section section-divider">
      <div className="mx-auto grid w-full max-w-content items-center gap-12 md:grid-cols-2">
        <div className="flex justify-center">
          <GaugeRing>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-grad md:text-3xl">
                <CountUp value={e.gaugeValue} />
              </div>
              <div className="mt-1 text-[11px] text-[#526071] md:text-xs">{e.gaugeCaption}</div>
            </div>
          </GaugeRing>
        </div>

        <div>
          <SectionLabel>{e.label}</SectionLabel>
          <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
            {e.title}
          </SplitReveal>
          <Reveal as="ol" stagger={0.14} className="mt-7 space-y-6">
            {e.steps.map((s, i) => (
              <li key={s.k} className="relative pl-8">
                <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full btn-grad text-xs font-bold">
                  {i + 1}
                </span>
                {i < e.steps.length - 1 && (
                  <span className="absolute left-[11px] top-6 h-full w-px bg-blue-deep/15" aria-hidden />
                )}
                <div className="font-mono text-[11px] uppercase tracking-wide text-[#667284] md:text-xs">{s.k}</div>
                <div className="text-sm font-semibold md:text-base">{s.t}</div>
                <div className="text-xs text-blue md:text-sm">{s.s}</div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
