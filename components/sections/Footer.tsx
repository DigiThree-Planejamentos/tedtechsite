import { Logo } from '@/components/ui/Logo';
import { Reveal } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { BackToTop } from '@/components/motion/BackToTop';
import { content } from '@/lib/content';

export function Footer() {
  const f = content.footer;
  return (
    <footer className="bg-white px-5 py-12 text-[#07111f]">
      <Reveal
        variant="simple"
        className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <BackToTop className="block cursor-pointer rounded-md transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue">
            <Logo />
          </BackToTop>
          <p className="mt-2 max-w-xs text-sm text-muted md:text-[15px]">{f.tagline}</p>
        </div>
        <div className="text-sm text-muted md:text-[15px]">
          <div className="font-mono">{f.cnpj}</div>
          <div className="mt-1 font-mono">{f.email}</div>
          <a
            href={f.phone.href}
            className="mt-1 block font-mono transition-colors hover:text-[#07111f]"
          >
            Tel. {f.phone.label}
          </a>
          <div className="mt-1 flex flex-col gap-1">
            {f.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                className="transition-colors hover:text-[#07111f]"
              >
                {l.label}
              </a>
            ))}
            {f.socials.map((s) => (
              <MagneticButton key={s.label} className="block">
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="transition-colors hover:text-[#07111f]"
                >
                  {s.label}
                </a>
              </MagneticButton>
            ))}
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
