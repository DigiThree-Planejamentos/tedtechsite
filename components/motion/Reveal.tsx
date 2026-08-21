'use client';

import { createElement, useRef, type ElementType, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';
import {
  ARRIVAL_BRIGHTNESS_FROM,
  ARRIVAL_SCALE_FROM,
  duration,
  REVEAL_START,
  REVEAL_TOGGLE,
} from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reveal on scroll-in. When `stagger` is set, the element's direct children
 * animate in sequence (grids/lists). Under reduced motion the content
 * renders visible with no animation.
 *
 * `variant="arrival"` (default) grows/sharpens/brightens content into place
 * like a near star in the circuit field, and reverses the same way when you
 * scroll back up. `variant="simple"` is the plain fade/blur/rise, played
 * once — for content that shouldn't echo the space-journey motion (footer).
 */
export function Reveal({
  as = 'div',
  y = 24,
  blur = 8,
  stagger,
  variant = 'arrival',
  start = REVEAL_START,
  className,
  children,
}: {
  as?: ElementType;
  y?: number;
  blur?: number;
  stagger?: number;
  variant?: 'arrival' | 'simple';
  /**
   * Ponto de partida do ScrollTrigger. O default (`top 85%`) supoe que o
   * elemento consiga SUBIR ate 85% da tela — verdade pra qualquer coisa no
   * meio da pagina, falso pro que fica na base dela.
   *
   * O rodape e o caso: sendo a ultima coisa do documento, o topo dele para
   * de subir quando a rolagem acaba. Em tela de menos de ~773px de altura
   * ele nunca cruza os 85%, o gatilho nunca dispara e o conteudo fica preso
   * em opacity 0 pra sempre. Medido: viewport 861 -> topo do bloco em 745
   * contra gatilho em 732, com a pagina ja no fim. Em 900 passa raspando
   * (760 contra 765), que e o motivo de isso ter sobrevivido tanto tempo.
   *
   * Quem vive na base da pagina deve passar algo que so dependa de ENTRAR
   * na tela, como `top bottom`.
   */
  start?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const targets: Element | Element[] =
        stagger != null ? Array.from(el.children) : el;
      const arrival = variant === 'arrival';

      gsap.set(targets, {
        autoAlpha: 0,
        y,
        scale: arrival ? ARRIVAL_SCALE_FROM : 1,
        filter: arrival
          ? `blur(${blur}px) brightness(${ARRIVAL_BRIGHTNESS_FROM})`
          : blur
            ? `blur(${blur}px)`
            : 'none',
      });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: arrival ? 'blur(0px) brightness(1)' : 'blur(0px)',
        duration: duration.base,
        ease: 'power3.out',
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start,
          end: 'bottom top',
          // Sem isso, um scroll rapido (tecla End, arrastar a barra, fling no
          // trackpad) pode pular a janela start->end inteira num so frame.
          // Para variant="simple" (footer) isso e fatal: once:true mata o
          // trigger e o elemento fica preso em opacity:0 pra sempre.
          fastScrollEnd: true,
          ...(arrival
            ? { toggleActions: REVEAL_TOGGLE }
            : { once: true, toggleActions: 'play none none none' }),
        },
      });
    },
    { dependencies: [reduced, variant, start], scope: ref },
  );

  return createElement(as, { ref, className }, children);
}
