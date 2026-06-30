import { Logo } from '@/components/ui/Logo';
import { content } from '@/lib/content';

export function Footer() {
  const f = content.footer;
  return (
    <footer className="border-t border-white/5 px-5 py-12">
      <div className="mx-auto flex max-w-content flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-xs text-muted">{f.tagline}</p>
        </div>
        <div className="text-xs text-muted">
          <div className="font-mono">{f.cnpj}</div>
          <div className="mt-1 font-mono">{f.email}</div>
          <div className="mt-3 flex gap-4">
            {f.links.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-text">{l.label}</a>
            ))}
            {f.socials.map((s) => (
              <a key={s.label} href={s.href} className="hover:text-text">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
