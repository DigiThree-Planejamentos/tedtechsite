'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { SectionNav } from '@/components/ui/SectionNav';
import { MagneticButton } from '@/components/motion/MagneticButton';
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
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 rounded-[1.5rem] border border-blue/25 bg-[#f7fbff] py-2.5 pl-5 pr-2.5 text-[#07111f] shadow-[0_20px_64px_rgba(30,158,219,0.48)] transition-all duration-300 ease-out sm:rounded-[2rem]">
        <Logo compact />
        {/* Um botao por secao, na ordem da pagina (site.nav). O header so
            existe enquanto o hero esta na tela — passou dele, ele sobe e some
            — entao esta barra e o indice que o visitante ve ao CHEGAR, nao
            uma nav de acompanhamento. E por isso que vale listar todas as
            secoes em vez de escolher duas.

            Saiu o max-w-xs: aquele teto era de quando havia dois links e, com
            cinco, cortaria os ultimos — e o overflow-hidden que vinha junto
            escondia justamente a prova de que estavam sendo cortados.

            As medidas apertam no md e folgam no lg porque no md esta linha
            divide ~380px com o logo e o botao de compra. */}
        <SectionNav
          label="Seções da página"
          interactive={!isHidden}
          className="hidden gap-0.5 text-[13px] text-[#3b4654] md:flex lg:gap-1 lg:text-sm"
          linkClassName="px-2.5 py-1.5 lg:px-3"
        />
        <MagneticButton>
          <Button href={content.checkoutUrl} variant="primary" tabIndex={isHidden ? -1 : undefined}>
            {content.hero.cta}
          </Button>
        </MagneticButton>
      </div>
    </header>
  );
}
