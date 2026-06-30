import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-36 text-center">
      <span className="ghost-word pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 text-[22vw] md:text-[16vw]">
        {h.ghost}
      </span>
      <div className="relative mx-auto max-w-content">
        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          {h.headlineA} <span className="text-grad">{h.headlineHighlight}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted">{h.sub}</p>

        <div className="mx-auto mt-9 flex max-w-lg items-center gap-2 rounded-2xl border border-white/10 px-4 py-3">
          <span className="text-muted" aria-hidden>🔎</span>
          <span className="flex-1 text-left text-sm text-muted">{h.searchPlaceholder}</span>
        </div>
        <div className="mt-9 flex justify-center">
          <Button href={content.checkoutUrl} variant="primary">{h.cta}</Button>
        </div>
      </div>
    </section>
  );
}
