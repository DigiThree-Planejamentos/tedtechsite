# Hero Split Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar o hero como split 50/50 (referência Behance/GENAI): esquerda com headline + perguntas do diagnóstico como citações + CTA; direita com vídeo do instrutor full-height com toda a copy sobreposta na base.

**Architecture:** `Hero.tsx` continua server component e ganha um filho client `HeroVideo.tsx` (painel de vídeo com estado de playback). Conteúdo centralizado em `lib/content.ts` (novo campo `instrutor.heroQuote`). A seção órfã `Identificacao` é deletada; o bloco de vídeo sai de `Instrutor.tsx`.

**Tech Stack:** Next.js App Router, React, Tailwind, GSAP (via primitives `Reveal`/`SplitReveal` existentes), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-13-hero-split-redesign-design.md`

## Global Constraints

- Copy em PT-BR; placeholders de instrutor permanecem TODO: `Nome do Instrutor`, `[X] anos`, `[certificação]`
- `instrutor.heroQuote` (valor exato): `“[X] anos de mercado, formado em [certificação]. Separei tudo que aprendi nesse tempo nesse curso, direto ao ponto, pra você aprender a consertar de verdade.”`
- Cor azul do tema: classe `text-blue` / `border-blue` (já configurada, `#1E9EDB`); não criar cores novas de tema
- Reusar primitives existentes: `Reveal`, `SplitReveal`, `MagneticButton`, `GlowIconButton`, `Button` — não criar primitives novos
- Fundo da seção hero inalterado (circuit field global permanece); NENHUM painel de gradiente envolvendo o hero
- Testes com Vitest: rodar com `npm test` (roda `vitest run`); suíte inteira deve terminar verde em cada task
- Commits frequentes, mensagens em inglês no padrão do repo (`feat:`, `test:`, `refactor:`, `chore:`)

---

### Task 1: Deletar a seção órfã Identificacao

A seção `Identificacao` não é renderizada por `app/page.tsx` (verificado). Suas perguntas passam a viver no hero. Remover componente e teste.

**Files:**
- Delete: `components/sections/Identificacao.tsx`
- Delete: `__tests__/sections/identificacao.test.tsx`

**Interfaces:**
- Consumes: nada
- Produces: árvore sem referências a `Identificacao` (pré-requisito para remover `dores.sub` na Task 3)

- [ ] **Step 1: Confirmar que nada importa Identificacao fora do próprio teste**

Run: `git grep -l "Identificacao" -- "*.tsx" "*.ts"`
Expected: apenas `components/sections/Identificacao.tsx` e `__tests__/sections/identificacao.test.tsx`

- [ ] **Step 2: Deletar os dois arquivos**

```bash
git rm components/sections/Identificacao.tsx __tests__/sections/identificacao.test.tsx
```

- [ ] **Step 3: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS — todos os arquivos de teste restantes verdes (nenhum importava Identificacao)

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove orphan Identificacao section (moved into hero)"
```

---

### Task 2: Novo Hero (TDD) — coluna esquerda com citações + coluna direita com vídeo

**Files:**
- Modify: `lib/content.ts` (~linha 162, objeto `instrutor`)
- Create: `components/sections/HeroVideo.tsx`
- Modify: `components/sections/Hero.tsx` (arquivo inteiro reescrito)
- Test: `__tests__/sections/hero.test.tsx` (arquivo inteiro reescrito)

**Interfaces:**
- Consumes: `content.dores.{label,title,thoughts[{q,s}],turn}`, `content.hero.cta`, `content.checkoutUrl`, `content.instrutor.{label,name,heroQuote,videoPoster,videoSrc}`; primitives `Reveal({stagger,className,children})`, `SplitReveal({as,type,trigger,className,children})`, `MagneticButton({children})`, `GlowIconButton(props de <button>)`, `Button({href,variant,children})`
- Produces: `content.instrutor.heroQuote: string`; componente `HeroVideo()` (sem props, client component com `data-video` no root); `Hero()` novo layout

- [ ] **Step 1: Reescrever o teste do hero (falhando)**

Substituir o conteúdo inteiro de `__tests__/sections/hero.test.tsx` por:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

describe('Hero', () => {
  it('renders the headline, diagnostic questions as quotes and the turn phrase', () => {
    render(<Hero />);
    expect(screen.getByText(content.dores.title)).toBeInTheDocument();
    for (const thought of content.dores.thoughts) {
      expect(screen.getByText(`“${thought.q}”`)).toBeInTheDocument();
      expect(screen.getByText(thought.s)).toBeInTheDocument();
    }
    expect(screen.getByText(content.dores.turn)).toBeInTheDocument();
  });

  it('renders the full-height instructor video panel with overlay copy', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('[data-video]')).not.toBeNull();
    expect(screen.getByText(content.instrutor.label)).toBeInTheDocument();
    expect(screen.getByText(content.instrutor.name)).toBeInTheDocument();
    expect(screen.getByText(content.instrutor.heroQuote)).toBeInTheDocument();
  });

  it('does not render the old stats band or subtitle', () => {
    render(<Hero />);
    expect(screen.queryByText('módulos')).toBeNull();
    expect(screen.queryByText('100%')).toBeNull();
    expect(screen.queryByText('medo de começar sem base')).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar o teste para ver falhar**

Run: `npx vitest run __tests__/sections/hero.test.tsx`
Expected: FAIL — `heroQuote` não existe em `content.instrutor` (erro de propriedade/`getByText` falha) e as citações `“…”` não existem no Hero atual

- [ ] **Step 3: Adicionar `heroQuote` ao content.ts**

Em `lib/content.ts`, dentro do objeto `instrutor`, logo após a linha `bio: ...`:

```ts
    heroQuote:
      '“[X] anos de mercado, formado em [certificação]. Separei tudo que aprendi nesse tempo nesse curso, direto ao ponto, pra você aprender a consertar de verdade.”', // TODO: dados reais
```

- [ ] **Step 4: Criar `components/sections/HeroVideo.tsx`**

```tsx
'use client';

import { useRef, useState } from 'react';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { GlowIconButton } from '@/components/ui/GlowIconButton';
import { content } from '@/lib/content';

/**
 * Painel de vídeo full-height do hero: vídeo do instrutor com overlay escuro
 * e a copy de credibilidade na base. Enquanto `videoSrc` está vazio, mostra
 * gradiente placeholder com o play decorativo (mesmo comportamento que a
 * antiga seção Instrutor tinha).
 */
export function HeroVideo() {
  const i = content.instrutor;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = i.videoSrc !== '';

  const handlePlay = () => {
    if (!hasVideo) return;
    void videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div
      data-video
      className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-blue/20 bg-[linear-gradient(145deg,#1a2438,#0b1220)] md:aspect-auto md:h-full"
    >
      {hasVideo && (
        <video
          ref={videoRef}
          src={i.videoSrc}
          poster={i.videoPoster}
          controls={playing}
          playsInline
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {!playing && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(rgba(5,9,20,.18),rgba(5,9,20,.3)_55%,rgba(5,9,20,.88))]"
          />

          <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
            <MagneticButton>
              <GlowIconButton
                type="button"
                aria-label="Assistir apresentação do instrutor"
                onClick={handlePlay}
                className="grid h-16 w-16 place-items-center rounded-full border border-blue/50 bg-[rgba(5,9,20,.35)] text-2xl text-blue"
              >
                ▶
              </GlowIconButton>
            </MagneticButton>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 text-left sm:p-7">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue">
              {i.label}
            </div>
            <div className="mt-1 text-xl font-extrabold text-white md:text-2xl">
              {i.name}
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#dbe3ec]">
              {i.heroQuote}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Reescrever `components/sections/Hero.tsx`**

Substituir o arquivo inteiro por:

```tsx
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { HeroVideo } from '@/components/sections/HeroVideo';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;
  const d = content.dores;

  return (
    <section
      id="hero"
      className="site-section site-section--compact relative overflow-hidden"
    >
      <div className="relative mx-auto grid min-h-[calc(100svh-12rem)] w-full max-w-content items-stretch gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center text-left">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue/15 bg-white/80 px-3 py-2 text-[11px] font-semibold text-blue-deep shadow-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-blue text-white">*</span>
            {d.label}
          </div>

          <h1 className="mt-6 max-w-3xl font-extrabold leading-[1.08] tracking-tight text-[#050914]">
            <SplitReveal
              as="span"
              type="lines"
              trigger="ready"
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {d.title}
            </SplitReveal>
          </h1>

          <Reveal stagger={0.1} className="mt-8 grid max-w-xl gap-4">
            {d.thoughts.map((t) => (
              <div key={t.q} className="border-l-2 border-blue pl-4">
                <p className="text-sm italic leading-snug text-[#3b4654] sm:text-[15px]">
                  “{t.q}”
                </p>
                <small className="mt-1 block text-xs not-italic text-[#667284]">{t.s}</small>
              </div>
            ))}
          </Reveal>

          <p className="mt-8 max-w-xl text-sm font-semibold text-[#050914] sm:text-base">
            {d.turn}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-6 [&_a]:text-sm">
            <MagneticButton>
              <Button href={content.checkoutUrl} variant="primary">
                {h.cta}
              </Button>
            </MagneticButton>
          </div>
        </div>

        <HeroVideo />
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Rodar o teste do hero**

Run: `npx vitest run __tests__/sections/hero.test.tsx`
Expected: PASS — 3 testes verdes

- [ ] **Step 7: Rodar a suíte inteira (page.test.tsx também renderiza o Hero)**

Run: `npm test`
Expected: PASS — todos os arquivos verdes

- [ ] **Step 8: Commit**

```bash
git add lib/content.ts components/sections/HeroVideo.tsx components/sections/Hero.tsx __tests__/sections/hero.test.tsx
git commit -m "feat: split hero with diagnostic quotes and full-height instructor video"
```

---

### Task 3: Remover `dores.sub` do content

Depois das Tasks 1–2 nada mais consome `dores.sub`.

**Files:**
- Modify: `lib/content.ts` (~linha 33, objeto `dores`)

**Interfaces:**
- Consumes: nada
- Produces: `content.dores` sem o campo `sub`

- [ ] **Step 1: Confirmar que não há consumidores**

Run: `git grep -n "dores.sub\|d\.sub" -- "*.tsx" "*.ts"`
Expected: nenhum resultado (exit code 1)

- [ ] **Step 2: Remover a linha do content.ts**

Em `lib/content.ts`, remover a linha:

```ts
    sub: 'Se passou pela sua cabeça, você está no lugar certo — é exatamente o que esse curso resolve, do zero.',
```

- [ ] **Step 3: Rodar a suíte**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts
git commit -m "chore: drop unused dores.sub copy"
```

---

### Task 4: Tirar o vídeo da seção Instrutor (TDD)

**Files:**
- Modify: `components/sections/Instrutor.tsx` (arquivo inteiro reescrito)
- Test: `__tests__/sections/instrutor.test.tsx` (arquivo inteiro reescrito)

**Interfaces:**
- Consumes: `content.instrutor.{label,name,role,bio,stats}`; primitives `SectionLabel`, `SplitReveal`, `Reveal`, `CountUp`
- Produces: `Instrutor()` sem bloco `[data-video]` (o vídeo agora vive apenas no `HeroVideo` do hero)

- [ ] **Step 1: Reescrever o teste do instrutor (falhando)**

Substituir o conteúdo inteiro de `__tests__/sections/instrutor.test.tsx` por:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Instrutor } from '@/components/sections/Instrutor';
import { content } from '@/lib/content';

describe('Instrutor', () => {
  it('renders the instructor name and all stats without a video block', () => {
    const { container } = render(<Instrutor />);
    expect(container.querySelector('#instrutor')).not.toBeNull();
    expect(screen.getByText(content.instrutor.name)).toBeInTheDocument();
    expect(screen.getByText(content.instrutor.bio)).toBeInTheDocument();
    for (const s of content.instrutor.stats) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
    }
    expect(container.querySelector('[data-video]')).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar o teste para ver falhar**

Run: `npx vitest run __tests__/sections/instrutor.test.tsx`
Expected: FAIL — `[data-video]` ainda existe na seção

- [ ] **Step 3: Reescrever `components/sections/Instrutor.tsx`**

Substituir o arquivo inteiro por (remove o bloco de vídeo e os imports que ficam sem uso — `GlowIconButton`, `MagneticButton`):

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import { content } from '@/lib/content';

export function Instrutor() {
  const i = content.instrutor;
  return (
    <section
      id="instrutor"
      className="site-section section-divider relative overflow-hidden scroll-mt-24"
      style={{
        background:
          'radial-gradient(700px 400px at 50% 0%, rgba(30,158,219,.1), transparent 60%)',
      }}
    >
      <div className="mx-auto w-full max-w-content text-center">
        <SectionLabel>{i.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {i.name}
        </SplitReveal>
        <p className="mt-2 text-xs text-blue md:text-sm">{i.role}</p>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#526071] md:text-[15px]">{i.bio}</p>

        <Reveal
          stagger={0.12}
          className="mx-auto mt-9 grid max-w-lg grid-cols-3 gap-3"
        >
          {i.stats.map((s) => (
            <div key={s.label} className="site-panel rounded-[1.15rem] px-4 py-4">
              <div className="text-xl font-extrabold text-grad md:text-2xl">
                <CountUp value={s.value} />
              </div>
              <div className="mt-1 text-[11px] text-[#526071] md:text-xs">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rodar o teste**

Run: `npx vitest run __tests__/sections/instrutor.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sections/Instrutor.tsx __tests__/sections/instrutor.test.tsx
git commit -m "refactor: move instructor video out of Instrutor section (lives in hero)"
```

---

### Task 5: Verificação final (suíte + build + lint)

**Files:**
- Nenhum arquivo novo — apenas verificação

**Interfaces:**
- Consumes: tudo das tasks anteriores
- Produces: branch pronto para PR

- [ ] **Step 1: Suíte completa**

Run: `npm test`
Expected: PASS — 11 arquivos de teste (identificacao.test.tsx não existe mais), 0 falhas

- [ ] **Step 2: Build de produção (typecheck incluso)**

Run: `npm run build`
Expected: build verde, sem erros de tipo (o campo `sub` removido não é referenciado em lugar nenhum)

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros novos (warnings pré-existentes são aceitáveis)

- [ ] **Step 4: Verificação visual rápida (opcional se houver navegador)**

Run: `npm run dev` e abrir `http://localhost:3000`
Expected: hero split — esquerda: pill + headline + 4 citações com barra azul + frase de virada + CTA; direita: painel escuro full-height com play a ~42% e copy (QUEM ENSINA / Nome do Instrutor / frase) na base; no mobile o painel empilha abaixo do conteúdo com aspecto 16/10

- [ ] **Step 5: Commit final (se houver ajustes)**

```bash
git status --short
# se limpo, nada a commitar — branch pronto
```
