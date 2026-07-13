'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { trackButtonGlow } from '@/components/ui/glow';
import { content } from '@/lib/content';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DESKTOP_QUERY = '(min-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const DESKTOP_LEAD_PROGRESS = 0.08;
const DESKTOP_TRACK_PROGRESS = 1 - DESKTOP_LEAD_PROGRESS * 2;

export function Modulos() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef(0);
  const desktopTriggerRef = useRef<ReturnType<typeof ScrollTrigger.create> | null>(
    null,
  );
  const desktopTweenRef = useRef<gsap.core.Animation | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastIndex = Math.max(0, content.modules.length - cardsPerView);
  const activeModuleNumber = String(activeIndex + 1).padStart(2, '0');
  const totalModules = String(content.modules.length).padStart(2, '0');
  const stepperProgress = lastIndex === 0 ? 0.5 : activeIndex / lastIndex;
  const stepperStyle = {
    gridTemplateColumns: `${28 + stepperProgress * 18}px 50px ${
      28 + (1 - stepperProgress) * 18
    }px`,
  } as CSSProperties;
  const desktopPinEnabled = isDesktop && !prefersReducedMotion;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const updatePreferences = () => {
      const nextCardsPerView = 1;
      setCardsPerView(nextCardsPerView);
      setIsDesktop(desktopQuery.matches);
      setPrefersReducedMotion(reducedMotionQuery.matches);
      setActiveIndex((current) => {
        const nextIndex = Math.min(
          current,
          Math.max(0, content.modules.length - nextCardsPerView),
        );
        activeIndexRef.current = nextIndex;
        return nextIndex;
      });
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
    const observedArea = pinRef.current ?? sectionRef.current;
    if (!observedArea || typeof IntersectionObserver === 'undefined') {
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

    observer.observe(observedArea);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!section || !pin || !carousel || !track) return;

    if (!desktopPinEnabled) {
      gsap.set(track, { clearProps: 'transform' });
      return;
    }

    const getMaxX = () => Math.max(0, track.scrollWidth - carousel.clientWidth);
    const getLeadDistance = () =>
      Math.round(Math.min(320, Math.max(180, window.innerHeight * 0.3)));
    const getHorizontalProgress = (scrollProgress: number) =>
      Math.max(
        0,
        Math.min(
          1,
          (scrollProgress - DESKTOP_LEAD_PROGRESS) /
            DESKTOP_TRACK_PROGRESS,
        ),
      );
    const getNearestCardIndex = (progress: number) => {
      const cards = cardRefs.current.filter(
        (card): card is HTMLElement => card !== null,
      );
      const hasMeasurements =
        carousel.clientWidth > 0 && cards.some((card) => card.offsetWidth > 0);

      if (!hasMeasurements) {
        return Math.max(0, Math.min(lastIndex, Math.round(progress * lastIndex)));
      }

      const viewportCenter = progress * getMaxX() + carousel.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance >= closestDistance) return;
        closestDistance = distance;
        closestIndex = index;
      });

      return Math.min(closestIndex, lastIndex);
    };
    const syncActiveIndex = (progress: number) => {
      const nextIndex = getNearestCardIndex(progress);
      const previousIndex = activeIndexRef.current;
      if (nextIndex === previousIndex) return;

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };

    const timeline = gsap
      .timeline({ paused: true })
      .to(track, {
        x: 0,
        duration: DESKTOP_LEAD_PROGRESS,
        ease: 'none',
      })
      .to(track, {
        x: () => -getMaxX(),
        duration: DESKTOP_TRACK_PROGRESS,
        ease: 'none',
        overwrite: 'auto',
      })
      .to(track, {
        x: () => -getMaxX(),
        duration: DESKTOP_LEAD_PROGRESS,
        ease: 'none',
      });
    const trigger = ScrollTrigger.create({
      trigger: section,
      pin,
      pinSpacing: true,
      start: 'top -8%',
      end: () =>
        `+=${Math.max(1, getMaxX() + getLeadDistance() * 2)}`,
      scrub: 0.6,
      animation: timeline,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) =>
        syncActiveIndex(getHorizontalProgress(self.progress)),
      onRefresh: (self) =>
        syncActiveIndex(getHorizontalProgress(self.progress)),
    });

    desktopTweenRef.current = timeline;
    desktopTriggerRef.current = trigger;

    let refreshFrame: number | null = null;
    let disposed = false;
    const scheduleRefresh = () => {
      if (disposed) return;
      if (refreshFrame !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(refreshFrame);
      }
      if (typeof requestAnimationFrame !== 'function') {
        ScrollTrigger.refresh();
        return;
      }
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = null;
        ScrollTrigger.refresh();
      });
    };

    window.addEventListener('load', scheduleRefresh);
    window.addEventListener('resize', scheduleRefresh);
    const images = Array.from(track.querySelectorAll('img'));
    images.forEach((image) => {
      if (image.complete) return;
      image.addEventListener('load', scheduleRefresh);
      image.addEventListener('error', scheduleRefresh);
    });
    document.fonts?.ready.then(scheduleRefresh).catch(() => {});
    scheduleRefresh();

    return () => {
      disposed = true;
      window.removeEventListener('load', scheduleRefresh);
      window.removeEventListener('resize', scheduleRefresh);
      images.forEach((image) => {
        image.removeEventListener('load', scheduleRefresh);
        image.removeEventListener('error', scheduleRefresh);
      });
      if (refreshFrame !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(refreshFrame);
      }
      trigger.kill();
      timeline.kill();
      desktopTriggerRef.current = null;
      desktopTweenRef.current = null;
      gsap.set(track, { clearProps: 'transform' });
    };
  }, [desktopPinEnabled, lastIndex]);

  useEffect(
    () => () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    },
    [],
  );

  function updateActiveIndex(nextIndex: number) {
    const clampedIndex = Math.max(0, Math.min(lastIndex, nextIndex));
    const previousIndex = activeIndexRef.current;
    if (clampedIndex === previousIndex) return false;

    activeIndexRef.current = clampedIndex;
    setActiveIndex(clampedIndex);
    return true;
  }

  function getCardScrollProgress(index: number) {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!carousel || !track || !card) {
      return lastIndex === 0 ? 0 : index / lastIndex;
    }

    const maxX = Math.max(0, track.scrollWidth - carousel.clientWidth);
    if (maxX === 0 || card.offsetWidth === 0) {
      return lastIndex === 0 ? 0 : index / lastIndex;
    }

    const centeredX =
      card.offsetLeft + card.offsetWidth / 2 - carousel.clientWidth / 2;
    return Math.max(0, Math.min(1, centeredX / maxX));
  }

  function scrollDesktopToCard(index: number) {
    const trigger = desktopTriggerRef.current;
    if (!desktopPinEnabled || !trigger) return false;

    const progress = getCardScrollProgress(index);
    const triggerProgress =
      index === 0
        ? 0
        : DESKTOP_LEAD_PROGRESS +
          progress * DESKTOP_TRACK_PROGRESS;
    const top =
      trigger.start + (trigger.end - trigger.start) * triggerProgress;
    window.scrollTo({ top, behavior: 'smooth' });
    return true;
  }

  function scrollToCard(index: number) {
    const carousel = carouselRef.current;
    const card = cardRefs.current[index];
    if (!carousel || !card) return;

    const centeredLeft =
      card.offsetLeft + card.offsetWidth / 2 - carousel.clientWidth / 2;
    const maxLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    carousel.scrollTo({
      left: Math.max(0, Math.min(maxLeft, centeredLeft)),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }

  function playStepperButtonAnimation(button: HTMLButtonElement, direction: -1 | 1) {
    if (
      prefersReducedMotion ||
      (typeof window.matchMedia === 'function' &&
        window.matchMedia(REDUCED_MOTION_QUERY).matches) ||
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

  function moveCarousel(nextDirection: -1 | 1, trigger?: HTMLButtonElement) {
    const nextIndex = Math.max(
      0,
      Math.min(lastIndex, activeIndexRef.current + nextDirection * cardsPerView),
    );
    if (!updateActiveIndex(nextIndex)) return;

    if (!scrollDesktopToCard(nextIndex)) scrollToCard(nextIndex);
    if (trigger) playStepperButtonAnimation(trigger, nextDirection);
  }

  function resetCarousel(trigger?: HTMLButtonElement) {
    if (!updateActiveIndex(0)) return;

    if (!scrollDesktopToCard(0)) scrollToCard(0);
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
    if (!carousel || desktopPinEnabled) return;

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const viewportCenter = carousel.scrollLeft + carousel.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance >= closestDistance) return;
        closestDistance = distance;
        closestIndex = index;
      });

      updateActiveIndex(Math.min(closestIndex, lastIndex));
    }, 160);
  }

  function handleCarouselKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveCarousel(event.key === 'ArrowRight' ? 1 : -1);
  }

  function refreshModuleScrollTrigger() {
    if (!desktopPinEnabled) return;
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }
    ScrollTrigger.refresh();
  }

  return (
    <section
      ref={sectionRef}
      id="modulos"
      className="site-section section-divider scroll-mt-24"
    >
      <div ref={pinRef} className="module-pin mx-auto w-full max-w-content">
        <div className="module-pin__header relative z-20">
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
                className="module-stepper-button module-stepper-button--prev grid place-items-center text-sm disabled:cursor-not-allowed"
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
                <span className="tabular-nums">{activeModuleNumber}</span>
              </button>
              <button
                type="button"
                onClick={(event) => moveCarousel(1, event.currentTarget)}
                disabled={activeIndex === lastIndex}
                data-stepper-direction="next"
                className="module-stepper-button module-stepper-button--next grid place-items-center text-sm disabled:cursor-not-allowed"
                aria-label="Ver próximos módulos"
              >
                <span className="module-stepper-button__icon" aria-hidden>
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={carouselRef}
          data-module-carousel
          data-desktop-pin={desktopPinEnabled ? 'true' : 'false'}
          onScroll={syncActiveCard}
          onKeyDown={handleCarouselKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Módulos do curso"
          className="module-carousel no-scrollbar mt-8 snap-x snap-mandatory pb-2"
        >
          <div ref={trackRef} className="module-track">
            {content.modules.map((module, moduleIndex) => {
              const isActive =
                isInView &&
                moduleIndex >= activeIndex &&
                moduleIndex < activeIndex + cardsPerView;
              return (
                <article
                  key={module.n}
                  ref={(element) => {
                    cardRefs.current[moduleIndex] = element;
                  }}
                  aria-labelledby={`module-${module.n}`}
                  data-active={isActive ? 'true' : 'false'}
                  className={`module-card relative isolate flex snap-start flex-col overflow-hidden rounded-[1.5rem] border border-blue/25 ${
                    isActive ? 'module-card-active' : ''
                  }`}
                >
                  <Image
                    src={module.image}
                    alt={module.imageAlt}
                    fill
                    priority={moduleIndex === 0}
                    sizes="(min-width: 768px) min(760px, 82vw), calc(100vw - 2.5rem)"
                    className="module-card__image object-cover object-center"
                    onLoad={refreshModuleScrollTrigger}
                  />
                  <div className="module-card__shade absolute inset-0" aria-hidden />
                  <div
                    className="module-card__text-shade absolute inset-0"
                    aria-hidden
                  />
                  <div className="module-card__body relative z-10 flex flex-1 flex-col px-4 py-7 md:px-7 md:py-9">
                    <div className="module-card__intro flex-1">
                      <div className="mb-4 font-mono text-[11px] font-extrabold tracking-wide text-white/70">
                        MÓDULO {module.n}
                      </div>
                      <div
                        className="module-card__icon mb-3 grid h-12 w-12 place-items-center rounded-xl text-xl"
                        aria-hidden
                      >
                        {module.icon}
                      </div>
                      <h3
                        id={`module-${module.n}`}
                        className="text-lg font-semibold text-white md:text-2xl"
                      >
                        {module.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-xs leading-relaxed text-slate-100/90 md:text-sm">
                        {module.desc}
                      </p>
                    </div>

                    <div className="module-card__content mt-8 pt-2 md:mt-10">
                      <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-[#7fd0f5]">
                        Conteúdo do módulo
                      </div>
                      <ul className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li
                            key={lesson}
                            className="module-card__lesson flex gap-3 text-xs leading-relaxed text-slate-100/90 md:text-sm"
                            style={
                              { '--lesson-index': lessonIndex } as CSSProperties
                            }
                          >
                            <span className="text-[#7fd0f5]" aria-hidden>
                              ✓
                            </span>
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
      </div>
    </section>
  );
}
