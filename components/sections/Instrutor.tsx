import { SectionLabel } from '@/components/ui/SectionLabel';
import { GlowIconButton } from '@/components/ui/GlowIconButton';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import { content } from '@/lib/content';

export function Instrutor() {
  const i = content.instrutor;
  return (
    <section
      id="instrutor"
      className="relative overflow-hidden px-5 py-24 scroll-mt-24"
      style={{
        background:
          'radial-gradient(700px 400px at 50% 0%, rgba(30,158,219,.1), transparent 60%)',
      }}
    >
      <div className="mx-auto max-w-content text-center">
        <SectionLabel>{i.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {i.name}
        </SplitReveal>
        <p className="mt-2 text-xs text-blue md:text-sm">{i.role}</p>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-[15px]">{i.bio}</p>

        <Reveal
          stagger={0.12}
          className="mx-auto mt-9 flex max-w-lg justify-center divide-x divide-white/10"
        >
          {i.stats.map((s) => (
            <div key={s.label} className="px-6">
              <div className="text-xl font-extrabold text-grad md:text-2xl">
                <CountUp value={s.value} />
              </div>
              <div className="mt-1 text-[11px] text-muted md:text-xs">{s.label}</div>
            </div>
          ))}
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-2xl">
          <div
            data-video
            className="clean-border grid aspect-video place-items-center rounded-2xl"
          >
            <MagneticButton>
              <GlowIconButton
                type="button"
                aria-label="Assistir apresentação do instrutor"
                className="grid h-16 w-16 place-items-center rounded-full border border-blue/50 text-2xl text-blue"
              >
                ▶
              </GlowIconButton>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
