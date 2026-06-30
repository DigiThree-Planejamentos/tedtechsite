import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

export function Oferta() {
  const o = content.offer;
  return (
    <section id="oferta" className="px-5 py-20">
      <div className="mx-auto max-w-content text-center">
        <SectionLabel>{o.label}</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{o.title}</h2>

        <div className="clean-border mx-auto mt-10 grid max-w-3xl overflow-hidden rounded-3xl text-left md:grid-cols-2">
          <div className="p-8">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-muted">
              {o.includesTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {o.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px]">
                  <span className="text-blue" aria-hidden>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center border-t border-white/10 p-8 text-center md:border-l md:border-t-0">
            <div className="text-sm text-muted line-through">{o.priceFrom}</div>
            <div className="mt-1 text-4xl font-extrabold text-grad">{o.priceNow}</div>
            <div className="mt-1 text-sm text-muted">{o.installments}</div>
            <div className="mt-6 flex justify-center">
              <Button href={content.checkoutUrl} variant="primary">{o.cta}</Button>
            </div>
            <div className="mt-4 text-xs text-muted">{o.payments}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
