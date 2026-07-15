'use client';

type StepperAction = () => boolean;

interface ModuleStepperProps {
  activeModuleNumber: string;
  totalModules: string;
  isFirst: boolean;
  isLast: boolean;
  prefersReducedMotion: boolean;
  onPrevious: StepperAction;
  onNext: StepperAction;
  onReset: StepperAction;
}

const REVEAL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

function motionIsReduced(preference: boolean) {
  return (
    preference ||
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  );
}

function playArrowReveal(button: HTMLButtonElement, direction: -1 | 1) {
  if (typeof button.animate !== 'function') return;

  button.getAnimations?.().forEach((animation) => animation.cancel());
  button.animate(
    [
      { transform: 'translate3d(0, 0, 0) scale(1)' },
      {
        transform: `translate3d(${direction * 2}px, 0, 0) scale(0.9)`,
        offset: 0.22,
      },
      { transform: 'translate3d(0, 0, 0) scale(1.05)', offset: 0.68 },
      { transform: 'translate3d(0, 0, 0) scale(1)' },
    ],
    { duration: 480, easing: REVEAL_EASING },
  );

  const arrow = button.querySelector<HTMLElement>(
    '.module-stepper-arrow__reveal',
  );
  if (!arrow || typeof arrow.animate !== 'function') return;

  arrow.getAnimations?.().forEach((animation) => animation.cancel());
  arrow.animate(
    [
      { opacity: 0, transform: `translate3d(${-direction * 8}px, 0, 0)` },
      { opacity: 1, transform: 'translate3d(0, 0, 0)', offset: 0.28 },
      {
        opacity: 1,
        transform: `translate3d(${direction * 7}px, 0, 0)`,
        offset: 0.58,
      },
      {
        opacity: 0,
        transform: `translate3d(${direction * 11}px, 0, 0)`,
        offset: 0.72,
      },
      {
        opacity: 0,
        transform: `translate3d(${-direction * 6}px, 0, 0)`,
        offset: 0.73,
      },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    ],
    { duration: 480, easing: REVEAL_EASING },
  );
}

function playReset(button: HTMLButtonElement) {
  if (typeof button.animate !== 'function') return;
  button.getAnimations?.().forEach((animation) => animation.cancel());
  button.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(0.9)', offset: 0.28 },
      { transform: 'scale(1.06)', offset: 0.66 },
      { transform: 'scale(1)' },
    ],
    { duration: 400, easing: REVEAL_EASING },
  );
}

export function ModuleStepper({
  activeModuleNumber,
  totalModules,
  isFirst,
  isLast,
  prefersReducedMotion,
  onPrevious,
  onNext,
  onReset,
}: ModuleStepperProps) {
  function runDirectionalAction(
    button: HTMLButtonElement,
    direction: -1 | 1,
    action: StepperAction,
  ) {
    if (!action() || motionIsReduced(prefersReducedMotion)) return;
    playArrowReveal(button, direction);
  }

  function runReset(button: HTMLButtonElement) {
    if (!onReset() || motionIsReduced(prefersReducedMotion)) return;
    playReset(button);
  }

  return (
    <div
      className="module-stepper shrink-0"
      role="group"
      aria-label="Controles dos módulos"
      data-active-module={activeModuleNumber}
    >
      <button
        type="button"
        onClick={(event) =>
          runDirectionalAction(event.currentTarget, -1, onPrevious)
        }
        disabled={isFirst}
        data-stepper-direction="prev"
        className="module-stepper-button module-stepper-button--prev grid place-items-center disabled:cursor-not-allowed"
        aria-label="Ver módulos anteriores"
      >
        <span className="module-stepper-button__ink" aria-hidden />
        <span className="module-stepper-arrow" aria-hidden>
          <span className="module-stepper-arrow__base">‹</span>
          <span className="module-stepper-arrow__reveal">‹</span>
        </span>
      </button>

      <button
        type="button"
        onClick={(event) => runReset(event.currentTarget)}
        className="module-stepper-status grid place-items-center font-mono text-xs font-extrabold tracking-[0.14em]"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Módulo ${activeModuleNumber} de ${totalModules}. Voltar ao primeiro módulo`}
      >
        <span
          key={activeModuleNumber}
          className="module-stepper-status__value tabular-nums"
        >
          {activeModuleNumber}
        </span>
      </button>

      <button
        type="button"
        onClick={(event) =>
          runDirectionalAction(event.currentTarget, 1, onNext)
        }
        disabled={isLast}
        data-stepper-direction="next"
        className="module-stepper-button module-stepper-button--next grid place-items-center disabled:cursor-not-allowed"
        aria-label="Ver próximos módulos"
      >
        <span className="module-stepper-button__ink" aria-hidden />
        <span className="module-stepper-arrow" aria-hidden>
          <span className="module-stepper-arrow__base">›</span>
          <span className="module-stepper-arrow__reveal">›</span>
        </span>
      </button>
    </div>
  );
}
