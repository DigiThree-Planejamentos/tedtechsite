'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { trackButtonGlow } from '@/components/ui/glow';
import { content } from '@/lib/content';

export function Modulos() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastIndex = Math.max(0, content.modules.length - cardsPerView);
  const activeModuleNumber = String(activeIndex + 1).padStart(2, '0');
  const totalModules = String(content.modules.length).padStart(2, '0');
  const stepperProgress = lastIndex === 0 ? 0.5 : activeIndex / lastIndex;
  const stepperStyle = {
    gridTemplateColumns: `${38 + stepperProgress * 26}px 60px ${
      38 + (1 - stepperProgress) * 26
    }px`,
  } as CSSProperties;

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreferences = () => {
      const nextCardsPerView = 1;
      setCardsPerView(nextCardsPerView);
      setPrefersReducedMotion(reducedMotionQuery.matches);
      setActiveIndex((current) =>
        Math.min(current, Math.max(0, content.modules.length - nextCardsPerView)),
      );
    };

    updatePreferences();
    desktopQuery.addEventListener('change', updatePreferences);
    reducedMotionQuery.addEventListener('change', updatePreferences);

    return () => {
      desktopQuery.removeEventListener('change', updatePreferences);
      reducedMotionQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    },
    [],
  );

  function scrollToCard(index: number) {
    const carousel = carouselRef.current;
    const card = cardRefs.current[index];
    if (!carousel || !card) return;

    carousel.scrollTo({
      left: card.offsetLeft - carousel.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }

  function playStepperButtonAnimation(button: HTMLButtonElement, direction: -1 | 1) {
    if (
      prefersReducedMotion ||
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      typeof button.animate !== 'function'
    ) {
      return;
    }

    const travel = direction * 4;
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';

    button.getAnimations().forEach((animation) => animation.cancel());
    button.animate(
      [
        { transform: 'translate3d(0, 0, 0) scale(1)' },
        {
          transform: `translate3d(${travel}px, 0, 0) scale(0.94)`,
          offset: 0.24,
        },
        {
          transform: `translate3d(${-travel * 0.4}px, 0, 0) scale(1.04)`,
          offset: 0.64,
        },
        { transform: 'translate3d(0, 0, 0) scale(1)' },
      ],
      { duration: 420, easing },
    );

    const icon = button.querySelector('.module-stepper-button__icon');
    if (icon && typeof icon.animate === 'function') {
      icon.animate(
        [
          { transform: 'translate3d(0, 0, 0)' },
          { transform: `translate3d(${travel * 1.7}px, 0, 0)`, offset: 0.35 },
          { transform: `translate3d(${-travel * 0.45}px, 0, 0)`, offset: 0.72 },
          { transform: 'translate3d(0, 0, 0)' },
        ],
        { duration: 420, easing },
      );
    }
  }

  function moveCarousel(direction: -1 | 1, trigger?: HTMLButtonElement) {
    const nextIndex = Math.max(
      0,
      Math.min(lastIndex, activeIndex + direction * cardsPerView),
    );
    if (nextIndex === activeIndex) return;

    setDirection(direction);
    setActiveIndex(nextIndex);
    scrollToCard(nextIndex);
    if (trigger) playStepperButtonAnimation(trigger, direction);
  }

  function resetCarousel(trigger?: HTMLButtonElement) {
    if (activeIndex === 0) return;

    setDirection(-1);
    setActiveIndex(0);
    scrollToCard(0);

    if (
      !prefersReducedMotion &&
      trigger &&
      typeof trigger.animate === 'function'
    ) {
      trigger.getAnimations().forEach((animation) => animation.cancel());
      trigger.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.92)', offset: 0.3 },
          { transform: 'scale(1.06)', offset: 0.66 },
          { transform: 'scale(1)' },
        ],
        {
          duration: 360,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
      );
    }
  }

  function syncActiveCard() {
    const carousel = carouselRef.current;
    if (!carousel) return;

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const cards = cardRefs.current;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        if (!card) return;
        const distance = Math.abs(
          card.offsetLeft - carousel.offsetLeft - carousel.scrollLeft,
        );
        if (distance >= closestDistance) return;
        closestDistance = distance;
        closestIndex = index;
      });

      const nextIndex = Math.min(closestIndex, lastIndex);
      if (nextIndex === activeIndex) return;
      setDirection(nextIndex > activeIndex ? 1 : -1);
      setActiveIndex(nextIndex);
    }, 160);
  }

  function replayModuleAnimation(event: ReactMouseEvent<HTMLElement>) {
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const card = event.currentTarget;
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const reveal = (
      element: Element | null,
      delay: number,
      duration = 450,
    ) => {
      if (!element || typeof element.animate !== 'function') return;
      element.getAnimations().forEach((animation) => animation.cancel());
      element.animate(
        [
          { opacity: 0.45, transform: 'translate3d(0, 8px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        { duration, delay, easing, fill: 'both' },
      );
    };

    reveal(card.querySelector('.module-card__intro'), 0);
    reveal(card.querySelector('.module-card__content'), 70);
    card.querySelectorAll('.module-card__lesson').forEach((lesson, index) => {
      reveal(lesson, 120 + index * 50);
    });

    const icon = card.querySelector('.module-card__icon');
    if (icon && typeof icon.animate === 'function') {
      icon.getAnimations().forEach((animation) => animation.cancel());
      icon.animate(
        [
          { boxShadow: '0 0 0 rgba(30, 158, 219, 0)' },
          { boxShadow: '0 0 28px rgba(30, 158, 219, 0.26)', offset: 0.5 },
          { boxShadow: '0 0 0 rgba(30, 158, 219, 0)' },
        ],
        { duration: 450, easing },
      );
    }
  }

  return (
    <section ref={sectionRef} id="modulos" className="scroll-mt-24 px-5 py-20">
      <div className="mx-auto max-w-content">
        <SectionLabel>{content.modulos.label}</SectionLabel>
        <div className="mt-3 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SplitReveal
            as="h2"
            className="max-w-2xl text-2xl font-extrabold tracking-tight md:text-4xl"
          >
            {content.modulos.title}
          </SplitReveal>
          <div
            className="glow-button module-stepper shrink-0"
            style={stepperStyle}
            role="group"
            aria-label="Controles dos módulos"
            onPointerMove={trackButtonGlow}
          >
            <button
              type="button"
              onClick={(event) => moveCarousel(-1, event.currentTarget)}
              disabled={activeIndex === 0}
              data-stepper-direction="prev"
              className="module-stepper-button module-stepper-button--prev grid place-items-center text-base disabled:cursor-not-allowed"
              aria-label="Ver módulos anteriores"
            >
              <span className="module-stepper-button__icon" aria-hidden>
                ←
              </span>
            </button>
            <button
              type="button"
              onClick={(event) => resetCarousel(event.currentTarget)}
              className="module-stepper-status grid place-items-center font-mono text-[11px] font-extrabold tracking-[0.14em]"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Módulo ${activeModuleNumber} de ${totalModules}. Voltar ao primeiro módulo`}
            >
              <span className="tabular-nums">
                {activeModuleNumber}
              </span>
            </button>
            <button
              type="button"
              onClick={(event) => moveCarousel(1, event.currentTarget)}
              disabled={activeIndex === lastIndex}
              data-stepper-direction="next"
              className="module-stepper-button module-stepper-button--next grid place-items-center text-base disabled:cursor-not-allowed"
              aria-label="Ver próximos módulos"
            >
              <span className="module-stepper-button__icon" aria-hidden>
                →
              </span>
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={syncActiveCard}
          className="no-scrollbar mt-12 grid snap-x snap-mandatory auto-cols-[100%] grid-flow-col gap-10 overflow-x-auto overscroll-x-contain pb-2 md:auto-cols-[min(760px,82%)]"
        >
          {content.modules.map((m, moduleIndex) => {
            const isActive =
              isInView &&
              moduleIndex >= activeIndex &&
              moduleIndex < activeIndex + cardsPerView;
            const motionStyle = {
              '--module-enter-x': `${direction * 16}px`,
            } as CSSProperties;

            return (
              <article
                key={m.n}
                ref={(element) => {
                  cardRefs.current[moduleIndex] = element;
                }}
                aria-labelledby={`module-${m.n}`}
                data-active={isActive ? 'true' : 'false'}
                style={motionStyle}
                onMouseEnter={replayModuleAnimation}
                className={`module-card flex min-h-[460px] snap-start flex-col rounded-2xl border border-blue/50 px-4 py-7 md:min-h-[500px] md:px-7 md:py-9 ${
                  isActive ? 'module-card-active' : ''
                }`}
              >
                <div className="module-card__body flex flex-1 flex-col">
                  <div className="module-card__intro flex-1">
                    <div className="mb-4 font-mono text-[11px] font-extrabold tracking-wide text-[#64748b]">
                      MÓDULO {m.n}
                    </div>
                    <div
                      className="module-card__icon mb-3 grid h-12 w-12 place-items-center rounded-xl text-xl"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(30,158,219,.2), rgba(15,111,184,.08))',
                      }}
                      aria-hidden
                    >
                      {m.icon}
                    </div>
                    <h3 id={`module-${m.n}`} className="text-lg font-semibold md:text-2xl">
                      {m.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-muted md:text-sm">{m.desc}</p>
                  </div>

                  <div className="module-card__content mt-10 pt-2">
                    <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-blue">
                      Conteúdo do módulo
                    </div>
                    <ul className="space-y-3">
                      {m.lessons.map((lesson, lessonIndex) => (
                        <li
                          key={lesson}
                          className="module-card__lesson flex gap-3 text-xs leading-relaxed text-muted md:text-sm"
                          style={{ '--lesson-index': lessonIndex } as CSSProperties}
                        >
                          <span className="text-blue" aria-hidden>✓</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
