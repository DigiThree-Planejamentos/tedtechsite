import { Logo } from '@/components/ui/Logo';
import { Reveal } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { BackToTop } from '@/components/motion/BackToTop';
import { content } from '@/lib/content';

export function Footer() {
  const f = content.footer;
  return (
    <footer className="border-t border-white/5 px-5 py-12">
      <Reveal className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-[11px] text-muted md:text-xs">{f.tagline}</p>
        </div>
        <div className="text-[11px] text-muted md:text-xs">
          <div className="font-mono">{f.cnpj}</div>
          <div className="mt-1 font-mono">{f.email}</div>
          <a
            href={f.phone.href}
            className="mt-1 block font-mono transition-colors hover:text-text"
          >
            Tel. {f.phone.label}
          </a>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {f.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                className="transition-colors hover:text-text"
              >
                {l.label}
              </a>
            ))}
            {f.socials.map((s) => (
              <MagneticButton key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="transition-colors hover:text-text"
                >
                  {s.label}
                </a>
              </MagneticButton>
            ))}
            <BackToTop className="ml-2 rounded-full border border-white/10 px-3 py-1 text-blue transition hover:text-text">
              ↑ topo
            </BackToTop>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
