import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { site } from '@/lib/site';
import { content } from '@/lib/content';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-lg border border-white/10 bg-bg/70 py-2.5 pl-5 pr-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <a href={site.nav.modulos} className="hover:text-text">Módulos</a>
          <a href={site.nav.instrutor} className="hover:text-text">Quem ensina</a>
          <a href={site.nav.tiraDuvidas} className="hover:text-text">Tira-dúvidas</a>
        </nav>
        <MagneticButton>
          <Button href={content.checkoutUrl} variant="primary">
            {content.hero.cta}
          </Button>
        </MagneticButton>
      </div>
    </header>
  );
}
