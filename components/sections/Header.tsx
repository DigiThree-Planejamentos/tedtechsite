import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { AutoHideHeader } from '@/components/motion/AutoHideHeader';
import { site } from '@/lib/site';
import { content } from '@/lib/content';

export function Header() {
  return (
    <AutoHideHeader className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 [will-change:transform]">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
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
    </AutoHideHeader>
  );
}
