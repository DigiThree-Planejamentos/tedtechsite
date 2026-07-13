'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { site } from '@/lib/site';
import { content } from '@/lib/content';

export function Header() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHidden(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      aria-hidden={isHidden}
      className={`fixed inset-x-0 top-4 z-50 px-4 transition-[opacity,transform] duration-500 ease-out sm:top-5 sm:px-6 ${
        isHidden
          ? 'pointer-events-none -translate-y-28 opacity-0'
          : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 rounded-[1.5rem] border border-blue/25 bg-[#f7fbff] py-2.5 pl-5 pr-2.5 text-[#07111f] shadow-[0_8px_30px_rgba(15,42,81,0.18)] transition-all duration-300 ease-out sm:rounded-[2rem]">
        <Logo compact />
        <nav className="hidden max-w-xs items-center gap-7 overflow-hidden whitespace-nowrap text-sm text-[#3b4654] transition-all duration-300 ease-out md:flex">
          <a href={site.nav.modulos} tabIndex={isHidden ? -1 : undefined} className="hover:text-blue">Módulos</a>
          <a href={site.nav.instrutor} tabIndex={isHidden ? -1 : undefined} className="hover:text-blue">Quem ensina</a>
          <a href={site.nav.tiraDuvidas} tabIndex={isHidden ? -1 : undefined} className="hover:text-blue">Tira-dúvidas</a>
        </nav>
        <MagneticButton>
          <Button href={content.checkoutUrl} variant="primary" tabIndex={isHidden ? -1 : undefined}>
            {content.hero.cta}
          </Button>
        </MagneticButton>
      </div>
    </header>
  );
}
