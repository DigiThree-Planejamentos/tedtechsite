'use client';

import {
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Image from 'next/image';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ModuleStepper } from '@/components/sections/ModuleStepper';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { content } from '@/lib/content';

/**
 * Acordeao horizontal de modulos, com layout e animacao portados do hero
 * do digithree.com.br: os seis cards dividem a largura por flex-grow, e o
 * ativo cresce de 1 para 3.6 em 700ms. O card colapsado mostra so o titulo
 * escrito na vertical; o ativo revela numero, titulo, descricao e CTA.
 *
 * Substituiu um carrossel horizontal pinado por ScrollTrigger. O pin
 * existia para arrastar a faixa de cards conforme a pagina rolava; com o
 * acordeao os seis cabem numa tela so, entao o pin — e as quatro telas de
 * rolagem que ele consumia — deixaram de ter proposito.
 *
 * Abaixo de lg nao ha acordeao: vira rolagem horizontal com encaixe e todo
 * card mostra o conteudo inteiro, que e o que o proprio DigiThree faz no
 * mobile. Sem hover num aparelho de toque, colapsar esconderia conteudo
 * sem dar como revelar.
 */
export function Modulos() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const total = content.modules.length;
  const lastIndex = total - 1;
  const activeModuleNumber = String(activeIndex + 1).padStart(2, '0');
  const totalModules = String(total).padStart(2, '0');

  // O stepper espera um retorno booleano: false quando nao houve movimento,
  // que e como ele sabe nao disparar a animacao de rebote.
  function goTo(nextIndex: number) {
    const clamped = Math.max(0, Math.min(lastIndex, nextIndex));
    if (clamped === activeIndex) return false;
    setActiveIndex(clamped);
    return true;
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    goTo(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }

  return (
    <section
      id="modulos"
      className="site-section site-band site-band--light site-band--full"
    >
      <div className="mx-auto w-full max-w-content">
        <div className="relative z-20">
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
              onPrevious={() => goTo(activeIndex - 1)}
              onNext={() => goTo(activeIndex + 1)}
              onReset={() => goTo(0)}
            />
          </div>
        </div>

        <div
          data-module-carousel
          role="region"
          aria-label="Módulos do curso"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="module-accordion no-scrollbar mt-6 max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:pb-2"
        >
          {content.modules.map((module, moduleIndex) => (
            <article
              key={module.n}
              aria-labelledby={`module-${module.n}`}
              data-active={moduleIndex === activeIndex ? 'true' : 'false'}
              // O hover comanda no desktop; o foco cobre o teclado, porque
              // o foco borbulha do link do card ate aqui.
              onMouseEnter={() => setActiveIndex(moduleIndex)}
              onFocus={() => setActiveIndex(moduleIndex)}
              className="module-card group relative isolate overflow-hidden rounded-[1.5rem] max-lg:w-[82vw] max-lg:shrink-0 max-lg:snap-center"
            >
              <Image
                src={module.image}
                alt={module.imageAlt}
                fill
                priority={moduleIndex === 0}
                sizes="(min-width: 1024px) 480px, 82vw"
                className="module-card__image object-cover object-center"
              />
              <div className="module-card__shade absolute inset-0" aria-hidden />

              {/* Titulo na vertical, o unico texto do card colapsado.
                  aria-hidden porque o h3 abaixo ja nomeia o card. */}
              <span className="module-card__spine" aria-hidden>
                {module.title}
              </span>

              <div className="module-card__body absolute inset-x-0 bottom-0 z-10 px-5 pb-5 md:px-6 md:pb-6">
                <div className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#7fd0f5] md:text-[11px]">
                  {module.n} — {totalModules}
                </div>

                <h3
                  id={`module-${module.n}`}
                  className="mt-2 text-lg font-bold leading-tight text-white md:text-xl"
                >
                  {module.title}
                </h3>

                <p className="mt-2 text-[11px] leading-relaxed text-slate-200/85 md:text-xs">
                  {module.desc}
                </p>

                <a
                  href={content.checkoutUrl}
                  className="module-card__cta mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#07111f] transition-[background,color,transform] duration-200 hover:bg-[#dff5ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] md:text-sm"
                >
                  Quero aprender
                  <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
