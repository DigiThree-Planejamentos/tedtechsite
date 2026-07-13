import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;
  const d = content.dores;

  return (
    <section
      id="hero"
      className="site-section site-section--compact relative overflow-hidden"
    >
      <div className="relative mx-auto grid min-h-[calc(100svh-12rem)] w-full max-w-content items-center gap-10 md:grid-cols-[1.02fr_0.98fr]">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue/15 bg-white/80 px-3 py-2 text-[11px] font-semibold text-blue-deep shadow-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-blue text-white">*</span>
                {d.label}
              </div>

              <h1 className="mt-6 max-w-3xl font-extrabold leading-[1.08] tracking-tight text-[#050914]">
                <SplitReveal
                  as="span"
                  type="lines"
                  trigger="ready"
                  className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                >
                  {d.title}
                </SplitReveal>
              </h1>

              <SplitReveal
                as="p"
                type="lines"
                trigger="ready"
                className="mt-7 max-w-xl text-sm leading-relaxed text-[#3b4654] sm:text-base"
              >
                {d.sub}
              </SplitReveal>

              <div className="mt-8 flex flex-wrap items-center gap-4 [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-6 [&_a]:text-sm">
                <MagneticButton>
                  <Button href={content.checkoutUrl} variant="primary">
                    {h.cta}
                  </Button>
                </MagneticButton>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-blue-deep/10 pt-6">
                {[
                  ['6', 'módulos'],
                  ['100%', 'do zero'],
                  ['PC', 'na prática'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-extrabold text-[#050914]">{value}</div>
                    <div className="mt-1 text-[11px] text-[#667284]">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative grid gap-4">
              <Reveal className="hero-float">
                <div className="site-dark-panel rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-4">
                  <div className="relative overflow-hidden rounded-[1.15rem] border border-blue/20 bg-[linear-gradient(145deg,rgba(11,18,32,.92),rgba(17,24,39,.96))] p-5 sm:rounded-[1.5rem]">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue">
                          Diagnóstico
                        </div>
                        <div className="mt-1 text-xl font-extrabold text-white">
                          Antes de abrir o PC
                        </div>
                      </div>
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue text-lg font-extrabold text-white">
                        ?
                      </div>
                    </div>
                    <Reveal stagger={0.1} className="grid gap-3">
                      {d.thoughts.map((t) => (
                        <div key={t.q} className="rounded-[1.15rem] border border-blue/20 bg-white/[0.07] p-4">
                          <p className="text-sm font-semibold leading-snug text-white">{t.q}</p>
                          <small className="mt-2 block text-xs text-[#9fb7d5]">{t.s}</small>
                        </div>
                      ))}
                    </Reveal>
                  </div>
                </div>
              </Reveal>

              <div className="grid grid-cols-2 gap-4">
                <Reveal className="hero-float hero-float--delay">
                  <div className="site-panel flex h-full flex-col justify-center rounded-[1.15rem] px-4 py-3">
                    <div className="text-3xl font-extrabold text-blue">0</div>
                    <div className="text-[11px] font-semibold leading-tight text-[#526071]">
                      medo de começar sem base
                    </div>
                  </div>
                </Reveal>

                <Reveal className="hero-float hero-float--slow">
                  <div className="site-panel flex h-full items-center rounded-[1.15rem] p-5">
                    <p className="text-sm font-extrabold leading-snug text-[#050914]">{d.turn}</p>
                  </div>
                </Reveal>
              </div>
            </div>
      </div>
    </section>
  );
}
