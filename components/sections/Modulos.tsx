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
import { ModuleStepper } from '@/components/sections/ModuleStepper';
import { content } from '@/lib/content';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DESKTOP_QUERY = '(min-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const DESKTOP_LEAD_PROGRESS = 0.025;
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
      start: 'top top',
      end: () =>
        `+=${Math.max(1, getMaxX() + getLeadDistance() * 2)}`,
      scrub: 0.35,
      animation: timeline,
      invalidateOnRefresh: true,
      // This pin adds several viewport-heights of scroll space. Refresh it
      // before reveals below the carousel so their start positions include
      // the pin spacing even though this effect mounts after those reveals.
      refreshPriority: 1,
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

  function moveCarousel(nextDirection: -1 | 1) {
    const nextIndex = Math.max(
      0,
      Math.min(lastIndex, activeIndexRef.current + nextDirection * cardsPerView),
    );
    if (!updateActiveIndex(nextIndex)) return false;

    if (!scrollDesktopToCard(nextIndex)) scrollToCard(nextIndex);
    return true;
  }

  function resetCarousel() {
    if (!updateActiveIndex(0)) return false;

    if (!scrollDesktopToCard(0)) scrollToCard(0);
    return true;
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
            <ModuleStepper
              activeModuleNumber={activeModuleNumber}
              totalModules={totalModules}
              isFirst={activeIndex === 0}
              isLast={activeIndex === lastIndex}
              prefersReducedMotion={prefersReducedMotion}
              onPrevious={() => moveCarousel(-1)}
              onNext={() => moveCarousel(1)}
              onReset={resetCarousel}
            />
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
                  className={`module-card relative isolate flex snap-start flex-col overflow-hidden rounded-[1.5rem] ${
                    isActive ? 'module-card-active' : ''
                  }`}
                >
                  <Image
                    src={module.image}
                    alt={module.imageAlt}
                    fill
                    priority={moduleIndex === 0}
                    sizes="(min-width: 768px) 460px, min(92vw, 400px)"
                    className="module-card__image object-cover object-center"
                    onLoad={refreshModuleScrollTrigger}
                  />
                  <div className="module-card__shade absolute inset-0" aria-hidden />

                  <div className="module-card__body relative z-10 flex flex-1 flex-col px-5 pb-5 md:px-6 md:pb-6">
                    <div>
                      <h3
                        id={`module-${module.n}`}
                        className="text-lg font-bold leading-tight text-white md:text-xl"
                      >
                        {module.title}
                      </h3>
                    </div>

                    <p className="mt-2 text-[11px] leading-relaxed text-slate-200/85 md:text-xs">
                      {module.desc}
                    </p>

                    <div className="mt-4 font-mono text-[9px] font-bold uppercase tracking-[1.2px] text-[#7fd0f5] md:text-[10px]">
                      O que você aprende
                    </div>
                    <ul className="module-card__topics mt-2.5 grid gap-1.5">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li
                          key={lesson}
                          className="module-card__lesson flex items-start gap-2 py-1 text-[10px] leading-tight text-slate-100 md:text-[11px]"
                          style={
                            { '--lesson-index': lessonIndex } as CSSProperties
                          }
                        >
                          <span className="mt-[1px] text-[#7fd0f5]" aria-hidden>
                            ✓
                          </span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={content.checkoutUrl}
                      className="module-card__cta mt-auto flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#07111f] transition-[background,color,transform] duration-200 hover:bg-[#dff5ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] md:text-sm"
                    >
                      Quero aprender
                      <span aria-hidden>→</span>
                    </a>
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
