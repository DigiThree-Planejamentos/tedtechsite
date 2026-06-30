import { SectionLabel } from '@/components/ui/SectionLabel';
import { content } from '@/lib/content';

export function Evolucao() {
  const e = content.evolucao;
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-2">
        <div className="flex justify-center">
          <div className="gauge relative" style={{ ['--val' as string]: 100 }}>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-grad">{e.gaugeValue}</div>
              <div className="mt-1 text-xs text-muted">{e.gaugeCaption}</div>
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>{e.label}</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{e.title}</h2>
          <ol className="mt-7 space-y-6">
            {e.steps.map((s, i) => (
              <li key={s.k} className="relative pl-8">
                <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full btn-grad text-xs font-bold">
                  {i + 1}
                </span>
                {i < e.steps.length - 1 && (
                  <span className="absolute left-[11px] top-6 h-full w-px bg-white/10" aria-hidden />
                )}
                <div className="font-mono text-xs uppercase tracking-wide text-muted">{s.k}</div>
                <div className="text-base font-semibold">{s.t}</div>
                <div className="text-sm text-blue">{s.s}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
