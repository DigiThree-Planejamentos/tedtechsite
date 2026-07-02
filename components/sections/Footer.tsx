import { Logo } from '@/components/ui/Logo';
import { Reveal } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { BackToTop } from '@/components/motion/BackToTop';
import { content } from '@/lib/content';

export function Footer() {
  const f = content.footer;
  return (
    <footer className="border-t border-white/5 px-5 py-12">
      <Reveal className="mx-auto flex max-w-content flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-[11px] text-muted md:text-xs">{f.tagline}</p>
        </div>
        <div className="text-[11px] text-muted md:text-xs">
          <div className="font-mono">{f.cnpj}</div>
          <div className="mt-1 font-mono">{f.email}</div>
          <div className="mt-3 flex items-center gap-4">
            {f.links.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-text">
                {l.label}
              </a>
            ))}
            {f.socials.map((s) => (
              <MagneticButton key={s.label}>
                <a href={s.href} className="hover:text-text">
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
