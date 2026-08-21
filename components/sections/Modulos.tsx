'use client';

import {
  useEffect,
  useRef,
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
 * ativo cresce de 1 para 2.8 em 700ms. O card colapsado mostra so o titulo
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
  // `null` = TODOS fechados, e nao "nenhum destaque ainda". O estado nasceu
  // do pedido de fechar tudo ao clicar fora: enquanto o indice era um numero
  // puro, a secao nao TINHA COMO nao ter um card aberto — o hover abre um e
  // ele fica aberto pra sempre, porque nao existe onMouseLeave aqui.
  // Comeca em 0 de proposito: quem chega na secao ve um card aberto
  // mostrando do que se trata, e so depois pode fechar tudo.
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const railRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const total = content.modules.length;
  const lastIndex = total - 1;
  const totalModules = String(total).padStart(2, '0');

  const isClosed = activeIndex === null;
  // Com tudo fechado o contador deixa de ser um numero. Mostrar "01" ali
  // seria mentira visivel: o card 01 esta fechado como os outros cinco.
  const statusValue = isClosed ? '--' : String(activeIndex + 1).padStart(2, '0');
  const statusLabel = isClosed
    ? 'Nenhum módulo aberto. Abrir o primeiro módulo'
    : `Módulo ${statusValue} de ${totalModules}. Voltar ao primeiro módulo`;

  // O stepper espera um retorno booleano: false quando nao houve movimento,
  // que e como ele sabe nao disparar a animacao de rebote.
  function goTo(nextIndex: number) {
    const clamped = Math.max(0, Math.min(lastIndex, nextIndex));
    if (clamped === activeIndex) return false;
    setActiveIndex(clamped);
    return true;
  }

  // De "tudo fechado", qualquer passo abre o 01: nao ha de onde contar, e o
  // primeiro modulo e o comeco natural da leitura. Isto NAO e preciosismo —
  // sem o teste explicito de null, `null + 1` da 1 em JavaScript e o stepper
  // pularia o modulo 01 direto pro 02.
  function step(delta: number) {
    return goTo(activeIndex === null ? 0 : activeIndex + delta);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  }

  // Clicar fora fecha todos.
  //
  // `pointerdown` e nao `click`: no iOS o click nao dispara em elemento sem
  // interacao — o body, uma faixa vazia da pagina — e e exatamente ali que o
  // visitante clica pra "sair" do acordeao. Com `click` este recurso
  // simplesmente nao existiria no iPhone.
  //
  // O stepper conta como DENTRO, mesmo vivendo fora do trilho no DOM: ele
  // comanda a lista, e fechar tudo no mesmo clique que pede o proximo modulo
  // faria o controle brigar consigo mesmo.
  useEffect(() => {
    function closeOnOutsidePointer(event: Event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (railRef.current?.contains(target)) return;
      if (target.closest('.module-stepper')) return;
      setActiveIndex(null);
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, []);

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
              statusValue={statusValue}
              statusLabel={statusLabel}
              // Com tudo fechado o "anterior" fica desligado e o "proximo"
              // ligado: nao ha nada antes do nada, e avancar abre o 01.
              isFirst={isClosed || activeIndex === 0}
              isLast={!isClosed && activeIndex === lastIndex}
              prefersReducedMotion={prefersReducedMotion}
              onPrevious={() => step(-1)}
              onNext={() => step(1)}
              onReset={() => goTo(0)}
            />
          </div>
        </div>

        <div
          ref={railRef}
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
                {/* Paleta invertida: o overlay virou branco, entao todo texto
                    daqui pra baixo e escuro. O azul do contador saiu do
                    #7fd0f5 (claro, feito pra fundo escuro, invisivel no
                    branco) pro #0f6fb8, o blue-2 da marca. */}
                <div className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#0f6fb8] md:text-[11px]">
                  {module.n} — {totalModules}
                </div>

                <h3
                  id={`module-${module.n}`}
                  className="mt-2 text-lg font-bold leading-tight text-[#07111f] md:text-xl"
                >
                  {module.title}
                </h3>

                <p className="mt-2 text-[11px] leading-relaxed text-[#3b4654] md:text-xs">
                  {module.desc}
                </p>

                {/* O botao inverte junto, senao some: branco sobre branco.
                    Escuro sobre o card claro tambem devolve o contraste que
                    ele tinha como unica peca clara sobre o card escuro. */}
                <a
                  href={content.checkoutUrl}
                  className="module-card__cta mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#07111f] px-5 py-3 text-xs font-bold text-white transition-[background,color,transform] duration-200 hover:bg-[#1b2c44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07111f] active:scale-[0.98] md:text-sm"
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
