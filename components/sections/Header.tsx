import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/site';
import { content } from '@/lib/content';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <a href={site.nav.modulos} className="hover:text-text">Módulos</a>
          <a href={site.nav.instrutor} className="hover:text-text">Quem ensina</a>
          <a href={site.nav.tiraDuvidas} className="hover:text-text">Tira-dúvidas</a>
        </nav>
        <Button href={content.checkoutUrl} variant="primary">
          {content.hero.cta}
        </Button>
      </div>
    </header>
  );
}
