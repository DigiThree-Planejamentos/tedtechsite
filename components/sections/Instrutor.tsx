import { SectionLabel } from '@/components/ui/SectionLabel';
import { GlowIconButton } from '@/components/ui/GlowIconButton';
import { content } from '@/lib/content';

export function Instrutor() {
  const i = content.instrutor;
  return (
    <section
      id="instrutor"
      className="relative overflow-hidden px-5 py-24"
      style={{
        background:
          'radial-gradient(700px 400px at 50% 0%, rgba(30,158,219,.1), transparent 60%)',
      }}
    >
      <div className="mx-auto max-w-content text-center">
        <SectionLabel>{i.label}</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{i.name}</h2>
        <p className="mt-2 text-sm text-blue">{i.role}</p>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted">{i.bio}</p>

        <div className="mx-auto mt-9 flex max-w-lg justify-center divide-x divide-white/10">
          {i.stats.map((s) => (
            <div key={s.label} className="px-6">
              <div className="text-2xl font-extrabold text-grad">{s.value}</div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        <div
          data-video
          className="clean-border mx-auto mt-12 grid aspect-video max-w-2xl place-items-center rounded-2xl"
        >
          <GlowIconButton
            type="button"
            aria-label="Assistir apresentação do instrutor"
            className="grid h-16 w-16 place-items-center rounded-full border border-blue/50 text-2xl text-blue"
          >
            ▶
          </GlowIconButton>
        </div>
      </div>
    </section>
  );
}
