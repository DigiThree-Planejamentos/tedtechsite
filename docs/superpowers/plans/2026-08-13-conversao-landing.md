# Reestruturação de Conversão — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer a landing abrir apresentando o produto, dar segurança no ponto do preço e trocar o chat simulado por um FAQ real.

**Architecture:** Três mudanças independentes sobre a mesma página. O hero passa a vender o curso e as dores viram seção própria logo abaixo; a oferta ganha um bloco de confiança sob o botão; o `TiraDuvidas` é deletado e substituído por um `Faq` em `<details>` nativo no fim da página. Todo texto vem de `lib/content.ts` — campo vazio não renderiza, então a página nunca exibe conteúdo provisório.

**Tech Stack:** Next.js 14 (App Router, server components), React 18, TypeScript 5.5, Tailwind 3.4, GSAP, Vitest 1.6 + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-08-13-conversao-landing-design.md`

## Global Constraints

- **Server components por padrão.** Só `HeroVideo` tem `'use client'`. Nenhuma seção nova pode virar client component.
- **`lib/content.ts` é `as const`.** Campos que podem ficar vazios (`offer.trust.checkout`, `offer.trust.access`, `faq.items[].a`) **precisam** de interface explícita anotada com `as`, senão o tipo literal `''` faz `!== ''` virar erro de compilação. O arquivo já usa esse padrão em `as Module[]` e `as Stat[]`.
- **Campo vazio não renderiza.** Nem string "TODO", nem item em branco, nem seção com título e nada dentro.
- **Não afrouxar** o teste `does not advertise unsupported course deliverables` em `__tests__/content.test.ts` — ele varre o `content` inteiro via `JSON.stringify` e é o que impede prometer "acesso vitalício" ou "certificado de conclusão" sem confirmação do cliente.
- **Fora de escopo, não tocar:** `CountUp` do preço, placeholders (`checkoutUrl`, `whatsappUrl`, instrutor, CNPJ), qualquer seção de depoimentos, `HeroVideo.tsx`.
- **Classes utilitárias existentes:** seções usam `site-section section-divider scroll-mt-24`, container `mx-auto w-full max-w-content`, painéis `site-panel` / `site-dark-panel`.
- Um teste por seção em `__tests__/sections/<nome>.test.tsx`, no padrão do projeto.

---

### Task 1: Conteúdo — novos campos e tipos

Adiciona `offer.trust` e `faq` sem remover nada. Ao fim desta task o projeto compila e todos os testes antigos continuam passando, porque nenhum consumidor mudou.

**Files:**
- Modify: `lib/content.ts`
- Modify: `components/sections/Oferta.tsx:50`
- Test: `__tests__/content.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `interface FaqItem { q: string; a: string }`, `interface OfferTrust { guarantee: { title: string; desc: string }; checkout: string; access: string; payments: string }`, `content.offer.trust: OfferTrust`, `content.faq: { label: string; title: string; items: FaqItem[]; cta: string; ctaHint: string }`.

- [ ] **Step 1: Escrever os testes que falham**

Adicionar ao fim do `describe('content', ...)` em `__tests__/content.test.ts`:

```ts
  it('every faq question is written, answers may be pending', () => {
    expect(content.faq.items.length).toBeGreaterThanOrEqual(7);
    for (const item of content.faq.items) {
      expect(item.q.length).toBeGreaterThan(0);
      expect(typeof item.a).toBe('string');
    }
  });

  it('offer trust always states guarantee and payment methods', () => {
    expect(content.offer.trust.guarantee.title.length).toBeGreaterThan(0);
    expect(content.offer.trust.guarantee.desc.length).toBeGreaterThan(0);
    expect(content.offer.trust.payments.length).toBeGreaterThan(0);
  });
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- content`
Expected: FAIL — `content.faq` e `content.offer.trust` não existem.

- [ ] **Step 3: Adicionar as interfaces**

No topo de `lib/content.ts`, junto de `Module` e `Stat`:

```ts
export interface FaqItem {
  q: string;
  a: string;
}

export interface OfferTrust {
  guarantee: { title: string; desc: string };
  checkout: string;
  access: string;
  payments: string;
}
```

- [ ] **Step 4: Adicionar `offer.trust`**

Dentro do objeto `offer`, **substituir** a linha `payments: 'Pix · Cartão · Boleto',` por:

```ts
    trust: {
      guarantee: {
        title: 'Garantia de 7 dias',
        desc: 'Se não for pra você, é só pedir o reembolso integral em até 7 dias — direito garantido pelo Código de Defesa do Consumidor.',
      },
      checkout: '', // TODO: confirmar plataforma → ex. 'Compra segura via Kiwify'
      access: '', // TODO: confirmar liberação e duração do acesso
      payments: 'Pix · Cartão · Boleto',
    } as OfferTrust,
```

- [ ] **Step 5: Adicionar o bloco `faq`**

Logo após o objeto `offer`, antes de `floatingCta`:

```ts
  faq: {
    label: 'Dúvidas frequentes',
    title: 'Antes de você decidir',
    items: [
      {
        q: 'O curso serve pra quem nunca mexeu com hardware?',
        a: 'Serve. O módulo 01 começa pelos fundamentos — o que é cada componente e como hardware e software se relacionam — antes de qualquer montagem. Não é preciso conhecimento prévio.',
      },
      { q: 'Preciso ter ferramentas ou um PC pra desmontar?', a: '' }, // TODO
      { q: 'Por quanto tempo eu tenho acesso ao curso?', a: '' }, // TODO
      { q: 'O curso tem certificado?', a: '' }, // TODO
      { q: 'Como funciona o acompanhamento?', a: '' }, // TODO
      { q: 'Consigo assistir pelo celular?', a: '' }, // TODO
      {
        q: 'Como funciona a garantia?',
        a: 'Você tem 7 dias a partir da compra pra pedir o reembolso integral, sem precisar justificar. É o direito de arrependimento previsto no art. 49 do Código de Defesa do Consumidor.',
      },
    ] as FaqItem[],
    cta: 'Falar no WhatsApp',
    ctaHint: 'Ficou outra dúvida?',
  },
```

- [ ] **Step 6: Corrigir o consumidor de `offer.payments`**

`components/sections/Oferta.tsx:50` referencia `{o.payments}`, que acabou de sair. Trocar essa linha por:

```tsx
            <div className="mt-4 text-[11px] text-[#667284] md:text-xs">{o.trust.payments}</div>
```

(É temporário — a Task 4 substitui a linha inteira pelo `<OfertaTrust />`.)

- [ ] **Step 7: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS em tudo. Se `oferta.test.tsx` falhar, o Step 6 não foi aplicado.

- [ ] **Step 8: Commit**

```bash
git add lib/content.ts __tests__/content.test.ts components/sections/Oferta.tsx
git commit -m "feat: adiciona conteudo de faq e bloco de confianca da oferta"
```

---

### Task 2: Seção Dores

Cria a seção nova sem ainda ligá-la na página. O hero segue como está.

**Files:**
- Create: `components/sections/Dores.tsx`
- Test: `__tests__/sections/dores.test.tsx`

**Interfaces:**
- Consumes: `content.dores` (`label`, `title`, `thoughts[].q`, `thoughts[].s`, `turn`) — já existe, sem alteração.
- Produces: `export function Dores(): JSX.Element`, seção com `id="dores"`.

- [ ] **Step 1: Escrever o teste que falha**

Criar `__tests__/sections/dores.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dores } from '@/components/sections/Dores';
import { content } from '@/lib/content';

describe('Dores', () => {
  it('renders the label that the hero never showed', () => {
    render(<Dores />);
    expect(screen.getByText(content.dores.label)).toBeInTheDocument();
  });

  it('renders the title, every thought and the turn phrase', () => {
    render(<Dores />);
    expect(
      screen.getByRole('heading', { name: content.dores.title }),
    ).toBeInTheDocument();
    for (const thought of content.dores.thoughts) {
      expect(screen.getByText(`“${thought.q}”`)).toBeInTheDocument();
      expect(screen.getByText(thought.s)).toBeInTheDocument();
    }
    expect(screen.getByText(content.dores.turn)).toBeInTheDocument();
  });

  it('exposes the #dores anchor', () => {
    const { container } = render(<Dores />);
    expect(container.querySelector('section#dores')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- dores`
Expected: FAIL — `Failed to resolve import "@/components/sections/Dores"`.

- [ ] **Step 3: Criar o componente**

Criar `components/sections/Dores.tsx`:

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { content } from '@/lib/content';

export function Dores() {
  const d = content.dores;

  return (
    <section id="dores" className="site-section section-divider scroll-mt-24">
      <div className="mx-auto w-full max-w-content text-center">
        <SectionLabel>{d.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {d.title}
        </SplitReveal>

        <Reveal
          stagger={0.1}
          className="mx-auto mt-9 grid max-w-3xl gap-5 text-left md:grid-cols-2"
        >
          {d.thoughts.map((t) => (
            <div key={t.q} className="border-l-2 border-blue pl-4">
              <p className="text-sm italic leading-snug text-[#3b4654]">“{t.q}”</p>
              <small className="mt-1 block text-xs not-italic text-[#667284]">{t.s}</small>
            </div>
          ))}
        </Reveal>

        <p className="mt-8 text-sm font-semibold text-[#050914] md:text-base">{d.turn}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- dores`
Expected: PASS, 3 testes.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Dores.tsx __tests__/sections/dores.test.tsx
git commit -m "feat: adiciona secao de dores"
```

---

### Task 3: Hero de produto

Reescreve o hero e liga a `Dores` na página logo abaixo. Fecha a mudança 1 do spec.

**Files:**
- Modify: `lib/content.ts` (bloco `hero`)
- Modify: `components/sections/Hero.tsx`
- Modify: `app/page.tsx`
- Test: `__tests__/sections/hero.test.tsx`

**Interfaces:**
- Consumes: `Dores` da Task 2.
- Produces: `content.hero` com `eyebrow`, `headline`, `sub`, `bullets: string[]`, `cta`. **`cta` continua existindo** — `Header.tsx:42` depende dele. `headlineWords` e `subLines` deixam de existir.

- [ ] **Step 1: Reescrever o teste do hero**

Substituir todo o conteúdo de `__tests__/sections/hero.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

describe('Hero', () => {
  it('names the product in the h1 and supports it with eyebrow, sub and bullets', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: content.hero.headline }),
    ).toBeInTheDocument();
    expect(screen.getByText(content.hero.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(content.hero.sub)).toBeInTheDocument();
    for (const bullet of content.hero.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }
  });

  it('links the CTA to checkout and keeps the instructor video panel', () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole('link', { name: content.hero.cta })).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
    expect(container.querySelector('[data-video]')).not.toBeNull();
    expect(screen.getByText(content.instrutor.name)).toBeInTheDocument();
  });

  it('no longer renders any of the pain copy', () => {
    render(<Hero />);
    expect(screen.queryByText(content.dores.title)).toBeNull();
    expect(screen.queryByText(content.dores.turn)).toBeNull();
    for (const thought of content.dores.thoughts) {
      expect(screen.queryByText(`“${thought.q}”`)).toBeNull();
    }
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- hero`
Expected: FAIL — `content.hero.eyebrow` é `undefined`.

- [ ] **Step 3: Reescrever o bloco `hero` do conteúdo**

Em `lib/content.ts`, substituir o objeto `hero` inteiro por:

```ts
  hero: {
    eyebrow: 'Curso de montagem e manutenção de computadores',
    headline: 'Monte, formate e conserte PCs começando do zero',
    sub: 'Sem pré-requisito e sem medo de abrir o gabinete.',
    bullets: [
      '6 módulos, dos componentes à manutenção',
      'Do zero — nenhum conhecimento prévio',
      'Pra cuidar do seu PC ou atender clientes',
    ],
    cta: 'Quero me inscrever',
  },
```

- [ ] **Step 4: Reescrever o componente**

Substituir todo o conteúdo de `components/sections/Hero.tsx`:

```tsx
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { HeroVideo } from '@/components/sections/HeroVideo';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;

  return (
    <section
      id="hero"
      className="site-section site-section--compact relative overflow-hidden"
    >
      <div className="relative mx-auto grid min-h-[calc(100svh-24rem)] w-full max-w-content items-stretch gap-10 pt-10 md:grid-cols-[0.85fr_1.15fr] md:pt-14 lg:pt-16">
        <div className="flex flex-col justify-center text-left">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-blue sm:text-xs">
            {h.eyebrow}
          </p>

          <h1 className="mt-3 max-w-3xl font-extrabold leading-[1.08] tracking-tight text-[#050914]">
            <SplitReveal
              as="span"
              type="lines"
              trigger="ready"
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {h.headline}
            </SplitReveal>
          </h1>

          <p className="mt-4 max-w-xl text-sm text-[#3b4654] sm:text-base">{h.sub}</p>

          <Reveal as="ul" stagger={0.1} className="mt-5 grid max-w-xl gap-2.5">
            {h.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 text-xs text-[#050914] sm:text-sm"
              >
                <span className="text-blue" aria-hidden>✓</span>
                <span>{bullet}</span>
              </li>
            ))}
          </Reveal>

          <div className="mt-6 flex flex-wrap items-center gap-4 [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-6 [&_a]:text-sm">
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

- [ ] **Step 5: Ligar a seção Dores na página**

Em `app/page.tsx`, adicionar o import:

```tsx
import { Dores } from '@/components/sections/Dores';
```

E a seção logo após `<Hero />`:

```tsx
        <Hero />
        <Dores />
        <Modulos />
```

- [ ] **Step 6: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS. `page.test.tsx` continua verde — ele procura `content.dores.title` como heading, que agora vem da `Dores`.

- [ ] **Step 7: Commit**

```bash
git add lib/content.ts components/sections/Hero.tsx app/page.tsx __tests__/sections/hero.test.tsx
git commit -m "feat: hero apresenta o produto e dores viram secao propria"
```

---

### Task 4: Bloco de confiança na oferta

Fecha a mudança 2 do spec.

**Files:**
- Create: `components/sections/OfertaTrust.tsx`
- Modify: `components/sections/Oferta.tsx`
- Test: `__tests__/sections/oferta.test.tsx`

**Interfaces:**
- Consumes: `content.offer.trust: OfferTrust` da Task 1.
- Produces: `export function OfertaTrust(): JSX.Element`. Cada linha preenchida carrega o atributo `data-trust-row`.

- [ ] **Step 1: Escrever os testes que falham**

Adicionar dentro do `describe('Oferta', ...)` em `__tests__/sections/oferta.test.tsx`:

```tsx
  it('shows the guarantee next to the price', () => {
    render(<Oferta />);
    expect(screen.getByText(content.offer.trust.guarantee.title)).toBeInTheDocument();
    expect(screen.getByText(content.offer.trust.guarantee.desc)).toBeInTheDocument();
  });

  it('renders only the filled trust rows', () => {
    const { container } = render(<Oferta />);
    const t = content.offer.trust;
    const filled = [t.checkout, t.access, t.payments].filter((value) => value !== '');
    const rows = container.querySelectorAll('[data-trust-row]');
    expect(rows).toHaveLength(filled.length);
    for (const value of filled) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }
  });
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- oferta`
Expected: FAIL — `data-trust-row` não existe, `rows` tem length 0 contra 1 esperado.

- [ ] **Step 3: Criar o componente**

Criar `components/sections/OfertaTrust.tsx`:

```tsx
import { content } from '@/lib/content';

export function OfertaTrust() {
  const t = content.offer.trust;
  const rows = [t.checkout, t.access, t.payments].filter((value) => value !== '');
  const hasGuarantee = t.guarantee.title !== '' && t.guarantee.desc !== '';

  return (
    <div className="mt-6 border-t border-blue/15 pt-5 text-left">
      {hasGuarantee && (
        <div className="flex items-start gap-2.5">
          <span className="text-blue" aria-hidden>🛡</span>
          <div>
            <div className="text-xs font-bold text-[#050914] md:text-sm">
              {t.guarantee.title}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-[#667284] md:text-xs">
              {t.guarantee.desc}
            </p>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <ul className={hasGuarantee ? 'mt-4 space-y-1.5' : 'space-y-1.5'}>
          {rows.map((row) => (
            <li
              key={row}
              data-trust-row
              className="flex items-center gap-2 text-[11px] text-[#667284] md:text-xs"
            >
              <span className="text-blue" aria-hidden>✓</span>
              <span>{row}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Usar o componente na oferta**

Em `components/sections/Oferta.tsx`, adicionar o import:

```tsx
import { OfertaTrust } from '@/components/sections/OfertaTrust';
```

E substituir a linha do `payments` (a que a Task 1 deixou como `{o.trust.payments}`) por:

```tsx
            <OfertaTrust />
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npm test -- oferta`
Expected: PASS, 3 testes.

- [ ] **Step 6: Commit**

```bash
git add components/sections/OfertaTrust.tsx components/sections/Oferta.tsx __tests__/sections/oferta.test.tsx
git commit -m "feat: adiciona bloco de garantia e seguranca na oferta"
```

---

### Task 5: FAQ substitui o chat simulado

Fecha a mudança 3 do spec. Deleta o `TiraDuvidas` por inteiro — componente, teste, conteúdo e âncora.

**Files:**
- Create: `components/sections/Faq.tsx`
- Create: `__tests__/sections/faq.test.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx`
- Modify: `lib/site.ts`
- Modify: `components/sections/Header.tsx:38`
- Modify: `lib/content.ts` (remover `tiraDuvidas`)
- Delete: `components/sections/TiraDuvidas.tsx`
- Delete: `__tests__/sections/tira-duvidas.test.tsx`

**Interfaces:**
- Consumes: `content.faq` da Task 1, `content.whatsappUrl`.
- Produces: `export function Faq(): JSX.Element | null` — retorna `null` quando nenhum item tem resposta. Seção com `id="faq"`. `site.nav.duvidas = '#faq'` substitui `site.nav.tiraDuvidas`.

- [ ] **Step 1: Escrever os testes que falham**

Criar `__tests__/sections/faq.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Faq } from '@/components/sections/Faq';
import { content } from '@/lib/content';

describe('Faq', () => {
  it('renders only the questions that have an answer', () => {
    render(<Faq />);
    const answered = content.faq.items.filter((item) => item.a !== '');
    const pending = content.faq.items.filter((item) => item.a === '');
    expect(answered.length).toBeGreaterThan(0);
    for (const item of answered) {
      expect(screen.getByText(item.q)).toBeInTheDocument();
      expect(screen.getByText(item.a)).toBeInTheDocument();
    }
    for (const item of pending) {
      expect(screen.queryByText(item.q)).toBeNull();
    }
  });

  it('wraps every question in a native disclosure', () => {
    const { container } = render(<Faq />);
    const answered = content.faq.items.filter((item) => item.a !== '');
    expect(container.querySelectorAll('details > summary')).toHaveLength(answered.length);
  });

  it('links the WhatsApp CTA', () => {
    render(<Faq />);
    expect(screen.getByRole('link', { name: content.faq.cta })).toHaveAttribute(
      'href',
      content.whatsappUrl,
    );
  });
});

describe('Faq with every answer pending', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/content');
    vi.resetModules();
  });

  it('renders nothing at all', async () => {
    vi.resetModules();
    // Preserva o módulo real e só esvazia as respostas — um mock parcial
    // quebraria qualquer componente que importe `content` no topo do arquivo.
    vi.doMock('@/lib/content', async () => {
      const actual = await vi.importActual<typeof import('@/lib/content')>('@/lib/content');
      return {
        ...actual,
        content: {
          ...actual.content,
          faq: {
            ...actual.content.faq,
            items: [{ q: 'Pergunta ainda sem resposta?', a: '' }],
          },
        },
      };
    });
    const { Faq: FaqPending } = await import('@/components/sections/Faq');
    const { container } = render(<FaqPending />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- faq`
Expected: FAIL — `Failed to resolve import "@/components/sections/Faq"`.

- [ ] **Step 3: Criar o componente**

Criar `components/sections/Faq.tsx`. A pergunta fica dentro do próprio `<span>` — sem isso o `getByText` do teste casaria com o `<summary>` inteiro, cujo texto inclui o chevron:

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { content } from '@/lib/content';

export function Faq() {
  const f = content.faq;
  const items = f.items.filter((item) => item.a !== '');

  if (items.length === 0) return null;

  return (
    <section id="faq" className="site-section section-divider scroll-mt-24">
      <div className="mx-auto w-full max-w-content text-center">
        <SectionLabel>{f.label}</SectionLabel>
        <SplitReveal as="h2" className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
          {f.title}
        </SplitReveal>

        <div className="mx-auto mt-9 max-w-2xl text-left">
          {items.map((item) => (
            <details key={item.q} className="faq-item border-b border-blue/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-[#050914] [&::-webkit-details-marker]:hidden md:text-base">
                <span>{item.q}</span>
                <span className="faq-chevron shrink-0 text-blue" aria-hidden>▾</span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-[#3b4654]">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-xs text-[#667284] md:text-sm">{f.ctaHint}</p>
        <div className="mt-3 flex justify-center">
          <MagneticButton>
            <Button href={content.whatsappUrl} variant="whatsapp">
              {f.cta}
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- faq`
Expected: PASS, 4 testes.

- [ ] **Step 5: Adicionar a animação do acordeão**

Acrescentar ao fim de `app/globals.css`. A rotação do chevron fica fora do media query — é indicador de estado, não enfeite, e precisa funcionar com movimento reduzido:

```css
/* FAQ — acordeão nativo. A animação é progressive enhancement:
   onde ::details-content não é suportado, abre instantaneamente. */
.faq-item[open] .faq-chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: no-preference) {
  .faq-item {
    interpolate-size: allow-keywords;
  }

  .faq-item .faq-chevron {
    transition: transform 0.3s ease;
  }

  .faq-item::details-content {
    height: 0;
    overflow: hidden;
    opacity: 0;
    transition: height 0.3s ease, opacity 0.3s ease;
  }

  .faq-item[open]::details-content {
    height: auto;
    opacity: 1;
  }
}
```

- [ ] **Step 6: Trocar a seção na página**

Em `app/page.tsx`: remover o import de `TiraDuvidas` e a tag `<TiraDuvidas />`, adicionar o import de `Faq` e a tag `<Faq />` **depois** de `<Oferta />`, ainda dentro do `MainCard`:

```tsx
import { Faq } from '@/components/sections/Faq';
```

```tsx
        <Caminhos />
        <Oferta />
        <Faq />
      </MainCard>
```

- [ ] **Step 7: Atualizar a âncora de navegação**

Em `lib/site.ts`, trocar a chave `tiraDuvidas` por `duvidas`:

```ts
export const site = {
  name: 'TedTech',
  nav: {
    modulos: '#modulos',
    duvidas: '#faq',
  },
} as const;
```

Em `components/sections/Header.tsx:38`, atualizar o link:

```tsx
          <a href={site.nav.duvidas} tabIndex={isHidden ? -1 : undefined} className="hover:text-blue">Dúvidas</a>
```

- [ ] **Step 8: Deletar o tira-dúvidas**

```bash
git rm components/sections/TiraDuvidas.tsx __tests__/sections/tira-duvidas.test.tsx
```

E remover o bloco `tiraDuvidas: { ... },` inteiro de `lib/content.ts`.

- [ ] **Step 9: Confirmar que não sobrou referência**

Buscar por `tiraDuvidas`, `TiraDuvidas` e `tira-duvidas` em `app/`, `lib/`, `components/` e `__tests__/`.

Expected: zero resultados nesses quatro diretórios. Os únicos resultados devem estar em `docs/` (specs e planos antigos), que ficam como registro histórico e **não devem ser editados**.

- [ ] **Step 10: Rodar a suíte inteira**

Run: `npm test`
Expected: FAIL apenas em `page.test.tsx`, que ainda espera `#tira-duvidas`. É o esperado — a Task 6 conserta. Todo o resto passa.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: faq em acordeao nativo substitui o chat simulado"
```

---

### Task 6: Ordem da página e verificação final

**Files:**
- Test: `__tests__/page.test.tsx`

**Interfaces:**
- Consumes: tudo das tasks 1–5.
- Produces: nada consumido por outra task. É o gate final.

- [ ] **Step 1: Atualizar o teste da página**

Substituir todo o conteúdo de `__tests__/page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { content } from '@/lib/content';

describe('Home page', () => {
  it('renders the product hero, module anchor and offer price together', () => {
    const { container } = render(<Home />);
    expect(
      screen.getByRole('heading', { level: 1, name: content.hero.headline }),
    ).toBeInTheDocument();
    expect(container.querySelector('#modulos')).not.toBeNull();
    expect(container.querySelector('#caminhos')).not.toBeNull();
    expect(container.querySelector('#instrutor')).toBeNull();
    expect(container.querySelector('#tira-duvidas')).toBeNull();
    expect(container.querySelector('#dores')).not.toBeNull();
    expect(container.querySelector('#faq')).not.toBeNull();
    expect(screen.getAllByText(content.offer.priceNow)).toHaveLength(2);
    expect(screen.getByText(content.floatingCta.urgency)).toBeInTheDocument();
    expect(container.querySelector('[data-floating-cta] a')).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
  });

  it('orders the sections for conversion: hero, dores, modulos, oferta, faq', () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id);
    for (const id of ['hero', 'dores', 'modulos', 'oferta', 'faq']) {
      expect(ids).toContain(id);
    }
    expect(ids.indexOf('hero')).toBeLessThan(ids.indexOf('dores'));
    expect(ids.indexOf('dores')).toBeLessThan(ids.indexOf('modulos'));
    expect(ids.indexOf('modulos')).toBeLessThan(ids.indexOf('oferta'));
    expect(ids.indexOf('oferta')).toBeLessThan(ids.indexOf('faq'));
  });
});
```

- [ ] **Step 2: Rodar e ver passar**

Run: `npm test -- page`
Expected: PASS, 2 testes.

- [ ] **Step 3: Suíte completa**

Run: `npm test`
Expected: PASS em tudo, sem `tira-duvidas.test.tsx` na lista.

- [ ] **Step 4: Build e lint**

Run: `npm run build`
Expected: build completa sem erro de tipo. Erro em `offer.trust` ou `faq.items` significa que as anotações `as OfferTrust` / `as FaqItem[]` da Task 1 não foram aplicadas.

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 5: Conferência visual**

Run: `npm run dev` e abrir `http://localhost:3000`.

Verificar:
1. Acima da dobra lê-se que é um curso de montagem e manutenção, com os 3 bullets e o botão.
2. A seção de dores aparece logo abaixo, com as 4 falas em 2 colunas no desktop.
3. Abaixo do preço aparecem a garantia de 7 dias e "Pix · Cartão · Boleto" — e **nenhuma linha vazia** (checkout e access ainda estão em branco).
4. O FAQ aparece depois da oferta com **2 perguntas** (as outras 5 estão sem resposta e não devem aparecer).
5. Abrir e fechar uma pergunta pelo teclado: Tab até o `<summary>`, Enter alterna, e o chevron gira.
6. Em viewport mobile (~390px), nada estoura a largura.
7. O link "Dúvidas" no header rola até o FAQ.

- [ ] **Step 6: Commit final**

```bash
git add __tests__/page.test.tsx
git commit -m "test: garante a ordem de conversao das secoes"
```

---

## Pendências para o cliente

Não bloqueiam a implementação. Quando as respostas chegarem, é só preencher `lib/content.ts` — nenhum componente precisa mudar, e cada campo preenchido faz uma linha nova aparecer sozinha.

| Campo | Pergunta ao cliente |
|---|---|
| `offer.trust.checkout` | Qual a plataforma do checkout? (o rodapé sugere Kiwify) |
| `offer.trust.access` | Como e quando o acesso é liberado, e por quanto tempo dura? |
| `faq.items[1].a` | O aluno precisa ter ferramentas ou um PC pra desmontar? |
| `faq.items[2].a` | Por quanto tempo o aluno tem acesso? |
| `faq.items[3].a` | Tem certificado? |
| `faq.items[4].a` | Como funciona o acompanhamento? |
| `faq.items[5].a` | O curso funciona bem no celular? |

Ao responder "acesso" e "certificado", lembrar que o teste `does not advertise unsupported course deliverables` barra as expressões "acesso vitalício" e "certificado de conclusão". Se forem verdade, o teste precisa ser atualizado junto — de propósito, com confirmação registrada.
