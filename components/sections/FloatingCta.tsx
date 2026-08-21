'use client';

import { useEffect, useState } from 'react';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { Button } from '@/components/ui/Button';
import { SectionNav } from '@/components/ui/SectionNav';
import { content } from '@/lib/content';

const SHOW_AFTER_VIEWPORTS = 0.7;
const OFFER_ID = 'oferta';

export function FloatingCta() {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const cta = content.floatingCta;

  useEffect(() => {
    let frame: number | null = null;

    const updateVisibility = () => {
      frame = null;
      // Segue o CARD DO PRECO, nao a secao inteira. No celular os dois cards
      // empilham e a secao passa de 1500px: rastreando a secao, a barra
      // ficaria escondida durante toda a leitura das duvidas, justamente
      // quando o botao de verdade ja saiu da tela.
      const anchor =
        document.querySelector('[data-offer-anchor]') ??
        document.getElementById(OFFER_ID);
      const pastFirstFold =
        window.scrollY >= window.innerHeight * SHOW_AFTER_VIEWPORTS;

      // Vale para os dois lados: quem ainda nao chegou no preco e quem ja
      // passou dele. Antes so aparecia antes, entao quem rolava ate o fim
      // ficava sem preco e sem caminho pro checkout.
      //
      // Depois da inversao (a oferta virou a ultima secao) o segundo lado so
      // acontece em tela estreita, onde a secao mede 1,7 tela e o card sai
      // por cima antes da pagina acabar. Em desktop nao ha mais "depois":
      // medido em 1536x695, no fim da rolagem o card ainda esta na tela
      // (topo -112, base 475) e a barra fica escondida — o botao de verdade
      // acompanha o leitor ate o fim, que era o problema que ela resolvia.
      // O segundo lado fica porque o mobile ainda depende dele.
      let anchorIsOffscreen = true;
      if (anchor) {
        const box = anchor.getBoundingClientRect();
        anchorIsOffscreen = box.top > window.innerHeight || box.bottom < 0;
      }

      setIsVisible(pastFirstFold && anchorIsOffscreen);
    };

    const scheduleUpdate = () => {
      if (frame !== null) return;
      if (typeof window.requestAnimationFrame !== 'function') {
        updateVisibility();
        return;
      }
      frame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== null && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const motionClasses = reducedMotion
    ? 'translate-y-0 transition-none'
    : isVisible
      ? 'translate-y-0 transition-[opacity,transform] duration-500 ease-out'
      : 'translate-y-5 transition-[opacity,transform] duration-500 ease-out';

  return (
    <aside
      aria-hidden={!isVisible}
      aria-label='Inscrição no curso TedTech'
      data-floating-cta
      data-visible={isVisible ? 'true' : 'false'}
      className={`fixed inset-x-0 z-40 px-4 ${motionClasses} ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      } sm:px-6`}
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className='mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 rounded-[1.5rem] border border-blue/25 bg-[#f7fbff] px-3 py-3 text-[#07111f] shadow-[0_14px_42px_rgba(15,42,81,0.22),0_20px_60px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.92)] sm:rounded-[2rem] sm:px-5 md:grid md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-6 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto]'>
        {/* No celular a barra e "R$ 297 · Inscrever": o preco ocupa o lugar
            do texto de urgencia, que so aparece de sm pra cima. */}
        <div className='flex min-w-0 items-center gap-2.5'>
          <span
            aria-hidden
            className='h-2.5 w-2.5 shrink-0 rounded-full bg-blue shadow-[0_0_14px_rgba(30,158,219,0.7)]'
          />
          <span className='text-base font-extrabold text-blue sm:hidden'>
            {content.offer.priceNow}
          </span>
          <p className='hidden text-[11px] font-bold leading-tight sm:block sm:text-sm'>
            {cta.urgency}
          </p>
        </div>

        {/* Os mesmos atalhos do header. Nao e redundancia: o header some
            quando o hero sai da tela, entao do meio da pagina em diante esta
            barra e a UNICA navegacao que existe. Antes, quem descia nao tinha
            como voltar pra uma secao sem rolar de volta ate o topo.

            So a partir de xl (1280px): abaixo disso a barra divide a largura
            com urgencia, preco e botao, e os atalhos nao entram sem espremer
            quem paga a conta.

            Escondido, nao consome celula do grid — `hidden` e display:none, e
            item nenhum ocupa coluna. E por isso que o grid de md segue com
            tres colunas certinhas e so o de xl tem quatro. */}
        <SectionNav
          label='Atalhos para as seções'
          interactive={isVisible}
          className='hidden gap-0.5 text-[13px] text-[#3b4654] xl:flex'
          linkClassName='px-2.5 py-1.5'
        />

        <div className='hidden items-baseline gap-2 md:flex'>
          <span className='text-lg font-extrabold text-blue'>
            {content.offer.priceNow}
          </span>
          <span className='text-xs text-[#526071]'>
            {content.offer.installments}
          </span>
        </div>

        <MagneticButton className='shrink-0'>
          <Button
            href={content.checkoutUrl}
            variant='primary'
            tabIndex={isVisible ? undefined : -1}
          >
            {cta.cta}
          </Button>
        </MagneticButton>
      </div>
    </aside>
  );
}
