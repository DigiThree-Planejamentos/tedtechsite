import { SectionLabel } from '@/components/ui/SectionLabel';
import { content } from '@/lib/content';

export function Identificacao() {
  const d = content.dores;
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-content">
        <SectionLabel>{d.label}</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{d.title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{d.sub}</p>

        <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2">
          {d.thoughts.map((t) => (
            <div key={t.q} className="relative pl-5">
              <span className="absolute -left-1 -top-3 text-4xl leading-none text-blue/60" aria-hidden>
                “
              </span>
              <p className="text-[15px] italic leading-snug text-[#dbe3ec]">{t.q}</p>
              <small className="mt-2 block text-xs not-italic text-muted">{t.s}</small>
            </div>
          ))}
        </div>

        <p className="mt-9 font-semibold text-[#cfe7f5]">{d.turn}</p>
      </div>
    </section>
  );
}
