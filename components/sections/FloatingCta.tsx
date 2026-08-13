'use client';

import { useEffect, useState } from 'react';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { Button } from '@/components/ui/Button';
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
      const offer = document.getElementById(OFFER_ID);
      const pastFirstFold =
        window.scrollY >= window.innerHeight * SHOW_AFTER_VIEWPORTS;
      const offerIsStillBelow =
        !offer || offer.getBoundingClientRect().top > window.innerHeight;

      setIsVisible(pastFirstFold && offerIsStillBelow);
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
      <div className='mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 rounded-[1.5rem] border border-blue/25 bg-[#f7fbff] px-3 py-3 text-[#07111f] shadow-[0_14px_42px_rgba(15,42,81,0.22),0_20px_60px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.92)] sm:rounded-[2rem] sm:px-5 md:grid md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-6'>
        <div className='flex min-w-0 items-center gap-2.5'>
          <span
            aria-hidden
            className='h-2.5 w-2.5 shrink-0 rounded-full bg-blue shadow-[0_0_14px_rgba(30,158,219,0.7)]'
          />
          <p className='max-w-[11rem] text-[11px] font-bold leading-tight sm:max-w-none sm:text-sm'>
            {cta.urgency}
          </p>
        </div>

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
