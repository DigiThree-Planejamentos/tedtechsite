import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

export function CtaFinal() {
  const c = content.ctaFinal;
  return (
    <section
      className="px-5 py-24 text-center"
      style={{
        background:
          'radial-gradient(600px 300px at 50% 50%, rgba(30,158,219,.14), transparent 65%)',
      }}
    >
      <div className="mx-auto max-w-content">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">{c.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] text-muted">{c.sub}</p>
        <div className="mt-8 flex justify-center">
          <Button href={content.checkoutUrl} variant="primary">{c.cta}</Button>
        </div>
      </div>
    </section>
  );
}
