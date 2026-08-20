# Ted Ajuda a Vender — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Comunicar a novidade do produto — no final do curso o Ted ajuda o aluno a vender seus serviços e começar a ganhar dinheiro — em quatro seções existentes, e criar uma seção de fechamento branca que emenda no rodapé como uma superfície só.

**Architecture:** Alterações de copy entram em `lib/content.ts` (fonte única de conteúdo) exceto o parágrafo do hero, que é hardcoded em `Hero.tsx`. A seção nova é um server component (`Fechamento.tsx`) numa nova variante de faixa `site-band--white` (#ffffff puro, igual ao rodapé — o `--light` é #f7fbff e criaria uma emenda visível). Ela entra no `main` depois da Oferta, **sem id** e **sem tela cheia**, ambos exigidos por testes existentes.

**Tech Stack:** Next.js 14 (App Router, export estático), Tailwind, GSAP (SplitReveal/Reveal já prontos), Vitest + Testing Library.

**Spec:** Decisões aprovadas pelo cliente na conversa de 2026-08-20, resumidas em "Decisões do cliente" abaixo (o plano é autocontido; não há doc de spec separado).

## Decisões do cliente (copy aprovada verbatim)

1. **Hero:** aplicar a ideia "no final o Ted te ajuda a conseguir seus primeiros clientes" ao parágrafo real do hero (o hardcoded em `Hero.tsx:55-61`, "Pare de gastar com técnico…" — NÃO o `hero.sub` do content, que não é renderizado).
2. **Sua evolução:** 4º passo "Venda" + título vira "Dos fundamentos ao primeiro cliente".
3. **Caminhos / Como renda extra:** bullet `'Primeiros clientes como freelancer'` → `'No final te ajudo a conseguir seus primeiros clientes'` (primeira pessoa é escolha do cliente — Ted falando).
4. **Oferta / O que você leva:** novo par com leva `'Ajuda de quem entende para começar a vender'`, inserido ANTES da garantia.
5. **Seção final:** fundo branco, ligada ao rodapé "como se o rodapé fosse uma continuidade dela".

## Global Constraints

- `content.test.ts:40-44`: a garantia DEVE ser o último par de `offer.pairs` — o par novo entra na penúltima posição.
- `content.test.ts:46-52`: strings proibidas em qualquer copy do content: `dual boot`, `precificar`, `acesso vitalício`, `certificado de conclusão` (checagem case-insensitive de substring). Usar "definir o preço", nunca "precificar".
- `page.test.tsx:42`: `ids.at(-1)` das `section[id]` deve ser `'oferta'` — a seção nova NÃO pode ter `id`.
- `bands.test.tsx`: `main section` deve bater com o array `RITMO` em contagem, ordem, tom e `full`; tons vizinhos nunca repetem (white conta como claro no classificador, que só testa `site-band--dark`); proibido `.section-divider` e `.section-tab`.
- Server components por padrão — a seção nova não leva `'use client'` (SplitReveal/Reveal/MagneticButton já são client por dentro).
- Commits terminam com `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Rodar `npm test` do diretório do projeto; suite completa leva ~10-60s.

---

### Task 1: Parágrafo do hero

**Files:**
- Modify: `components/sections/Hero.tsx:55-61` (o `<p>` com 4 `<span class="block">`)
- Test: `__tests__/sections/hero.test.tsx`

**Interfaces:**
- Consumes: nada de novo.
- Produces: nada consumido por outras tasks — copy visual apenas.

- [ ] **Step 1: Escrever o teste que falha**

Adicionar ao final do `describe('Hero', ...)` em `__tests__/sections/hero.test.tsx`:

```tsx
  it('promete a ajuda do Ted para conseguir os primeiros clientes', () => {
    render(<Hero />);
    expect(
      screen.getByText(/te ajuda a conseguir seus primeiros clientes/),
    ).toBeInTheDocument();
  });
```

(O parágrafo é quebrado à mão em spans `block`; a frase inteira precisa caber num único span para o matcher achar — o Step 3 garante isso.)

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run __tests__/sections/hero.test.tsx`
Expected: FAIL — "Unable to find an element with the text"

- [ ] **Step 3: Editar o parágrafo**

Em `components/sections/Hero.tsx`, substituir o bloco:

```tsx
          <p className="mt-5 max-w-xl translate-x-2 translate-y-6 text-sm leading-relaxed text-[color:var(--band-fg-strong)] sm:text-base md:translate-x-4 lg:translate-x-4">
            <span className="block">Pare de gastar com técnico e comece a ganhar</span>
            <span className="block">como um. Aprenda manutenção do zero, resolva</span>
            <span className="block">seus próprios problemas e use essa habilidade</span>
            <span className="block">para ganhar uma renda extra ou até como profissão.</span>
          </p>
```

por:

```tsx
          <p className="mt-5 max-w-xl translate-x-2 translate-y-6 text-sm leading-relaxed text-[color:var(--band-fg-strong)] sm:text-base md:translate-x-4 lg:translate-x-4">
            <span className="block">Pare de gastar com técnico e comece a ganhar</span>
            <span className="block">como um. Aprenda manutenção do zero, resolva</span>
            <span className="block">seus próprios problemas e use essa habilidade</span>
            <span className="block">como renda extra ou profissão — no final, o Ted</span>
            <span className="block">te ajuda a conseguir seus primeiros clientes.</span>
          </p>
```

(As quebras são manuais de propósito — manter os spans balanceados; a frase-teste vive inteira no 5º span.)

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run __tests__/sections/hero.test.tsx`
Expected: PASS (5 testes)

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx __tests__/sections/hero.test.tsx
git commit -m "feat(hero): fecha o paragrafo com a ajuda do Ted nos primeiros clientes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Quarto passo em Sua evolução

**Files:**
- Modify: `lib/content.ts` (bloco `evolucao`, ~linha 159)
- Test: `__tests__/sections/evolucao.test.tsx`

**Interfaces:**
- Consumes: `content.evolucao.steps` (array de `{ k, t, s }`).
- Produces: `content.evolucao.steps` com 4 itens; `content.evolucao.title = 'Dos fundamentos ao primeiro cliente'`. `Evolucao.tsx` NÃO muda — o conector entre passos é desenhado por índice (`i < steps.length - 1`) e se adapta sozinho.

- [ ] **Step 1: Escrever o teste que falha**

Adicionar ao `describe('Evolucao', ...)` em `__tests__/sections/evolucao.test.tsx`:

```tsx
  it('fecha a jornada com o passo de venda ajudado pelo Ted', () => {
    expect(content.evolucao.steps).toHaveLength(4);
    const ultimo = content.evolucao.steps.at(-1)!;
    expect(ultimo.k).toBe('Venda');
    expect(ultimo.s).toMatch(/Ted/);
    expect(content.evolucao.title).toBe('Dos fundamentos ao primeiro cliente');
  });
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run __tests__/sections/evolucao.test.tsx`
Expected: FAIL — "expected [...] to have a length of 4 but got 3"

- [ ] **Step 3: Editar o content**

Em `lib/content.ts`, substituir o bloco `evolucao` inteiro por:

```ts
  evolucao: {
    label: 'Sua evolução',
    title: 'Dos fundamentos ao primeiro cliente',
    gaugeValue: '6',
    gaugeCaption: 'módulos de aprendizado',
    steps: [
      { k: 'Fundamentos', t: 'Entenda o computador', s: 'História, hardware e software' },
      { k: 'Montagem', t: 'Monte e configure', s: 'Componentes, cabos, BIOS/UEFI e sistema' },
      { k: 'Manutenção', t: 'Diagnostique e cuide', s: 'Limpeza, segurança, backup e drivers' },
      // A novidade do produto: o curso nao termina no conserto. O anel
      // continua dizendo "6 modulos" — a ajuda do Ted e alem dos modulos,
      // nao um setimo.
      { k: 'Venda', t: 'Comece a ganhar', s: 'O Ted te ajuda a oferecer, cobrar e fechar os primeiros clientes' },
    ],
  },
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run __tests__/sections/evolucao.test.tsx`
Expected: PASS (2 testes)

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts __tests__/sections/evolucao.test.tsx
git commit -m "feat(evolucao): quarto passo Venda — a jornada termina no primeiro cliente

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Bullet do Ted em Como renda extra

**Files:**
- Modify: `lib/content.ts` (card `'Como renda extra'` dentro de `caminhos.cards`, ~linha 188)
- Test: `__tests__/content.test.ts`

**Interfaces:**
- Consumes: `content.caminhos.cards[].bullets`.
- Produces: bullet novo com texto exato `'No final te ajudo a conseguir seus primeiros clientes'` (primeira pessoa, ditado pelo cliente). `Caminhos.tsx` não muda; `caminhos.test.tsx` itera os bullets do content e se adapta sozinho.

- [ ] **Step 1: Escrever o teste que falha**

Adicionar ao `describe('content', ...)` em `__tests__/content.test.ts`:

```ts
  it('renda extra promete a ajuda do Ted nos primeiros clientes', () => {
    const rendaExtra = content.caminhos.cards.find((c) => c.title === 'Como renda extra')!;
    expect(rendaExtra.bullets).toContain('No final te ajudo a conseguir seus primeiros clientes');
    expect(rendaExtra.bullets).not.toContain('Primeiros clientes como freelancer');
  });
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run __tests__/content.test.ts`
Expected: FAIL no teste novo

- [ ] **Step 3: Trocar o bullet**

Em `lib/content.ts`, no card `'Como renda extra'`, trocar:

```ts
          'Primeiros clientes como freelancer',
```

por:

```ts
          // Primeira pessoa de proposito: e o Ted falando — decisao do cliente.
          'No final te ajudo a conseguir seus primeiros clientes',
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run __tests__/content.test.ts __tests__/sections/caminhos.test.tsx`
Expected: PASS (8 + 2 testes)

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts __tests__/content.test.ts
git commit -m "feat(caminhos): renda extra fecha com a ajuda do Ted, na voz dele

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Novo par na oferta (antes da garantia)

**Files:**
- Modify: `lib/content.ts` (array `offer.pairs`, inserir na penúltima posição)
- Test: `__tests__/content.test.ts`

**Interfaces:**
- Consumes: interface `OfferPair` (`{ leva, duvida, resposta }`) já existente.
- Produces: `offer.pairs` com 8 itens; o novo é o índice 6, a garantia continua sendo `.at(-1)`. `Oferta.tsx` e `oferta.test.tsx` iteram `pairs` e se adaptam sozinhos.

- [ ] **Step 1: Escrever o teste que falha**

Adicionar ao `describe('content', ...)` em `__tests__/content.test.ts`:

```ts
  it('oferece a ajuda do Ted para vender, sem tirar a garantia do fim', () => {
    const levas = content.offer.pairs.map((p) => p.leva);
    const indice = levas.indexOf('Ajuda de quem entende para começar a vender');
    expect(indice).toBeGreaterThanOrEqual(0);
    // Penultimo: o fechamento do card continua sendo a garantia.
    expect(indice).toBe(content.offer.pairs.length - 2);
  });
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run __tests__/content.test.ts`
Expected: FAIL — indexOf retorna -1

- [ ] **Step 3: Inserir o par**

Em `lib/content.ts`, dentro de `offer.pairs`, inserir ANTES do par da garantia (`leva: 'Garantia de 7 dias'`):

```ts
      {
        // A novidade do produto (2026-08-20): no final do curso o Ted ajuda
        // o aluno a vender. "definir o preço", nunca "precificar" — o
        // content.test proibe a palavra.
        leva: 'Ajuda de quem entende para começar a vender',
        duvida: 'Aprendi. E como eu consigo meus primeiros clientes?',
        resposta:
          'Essa é a última etapa do curso: o Ted te ajuda a oferecer seus serviços, definir o preço e fechar os primeiros clientes — pra transformar o que você aprendeu em renda.',
      },
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run __tests__/content.test.ts __tests__/sections/oferta.test.tsx`
Expected: PASS (9 + 11 testes; os testes de garantia-por-último e de campos completos cobrem a inserção)

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts __tests__/content.test.ts
git commit -m "feat(oferta): par 'ajuda de quem entende para comecar a vender'

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Seção Fechamento + faixa branca emendada no rodapé

**Files:**
- Modify: `app/globals.css` (nova variante `.site-band--white`, logo após `.site-band--dark`)
- Modify: `lib/content.ts` (novo bloco `fechamento` entre `offer` e `floatingCta`)
- Create: `components/sections/Fechamento.tsx`
- Modify: `app/page.tsx` (import + render depois de `<Oferta />`)
- Modify: `__tests__/layout/bands.test.tsx` (RITMO + comentário estale)
- Test: `__tests__/sections/fechamento.test.tsx` (novo)

**Interfaces:**
- Consumes: `content.checkoutUrl`, `content.offer.payments`, componentes `SectionLabel`, `SplitReveal`, `Reveal`, `MagneticButton`, `Button` (assinaturas idênticas às usadas em `Oferta.tsx`/`Hero.tsx`).
- Produces: componente `Fechamento()` sem props; `content.fechamento: { label, title, sub, cta }`; classe CSS `.site-band--white`.

- [ ] **Step 1: Atualizar o RITMO (teste que falha)**

Em `__tests__/layout/bands.test.tsx`, trocar o comentário estale das linhas 21-23 e acrescentar a entrada nova ao final do array:

```ts
  // O FAQ deixou de ser secao: virou o card direito da oferta.
  { id: 'oferta', tom: 'dark', full: true },
  // Fechamento: faixa branca PURA (#ffffff do rodape, nao o #f7fbff das
  // claras), sem id (page.test exige oferta como ultima section[id]) e sem
  // tela cheia — excecao declarada. O rodape branco emenda nela sem linha:
  // a pagina termina numa superficie so.
  { id: '', tom: 'white', full: false },
```

- [ ] **Step 2: Escrever o teste do componente (também falha)**

Criar `__tests__/sections/fechamento.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Fechamento } from '@/components/sections/Fechamento';
import { content } from '@/lib/content';

describe('Fechamento', () => {
  it('renders the closing copy on the pure white band, without an id', () => {
    const { container } = render(<Fechamento />);
    const section = container.querySelector('section')!;
    expect(section.className).toContain('site-band--white');
    expect(section.className).not.toContain('site-band--full');
    expect(section.id).toBe('');
    expect(
      screen.getByRole('heading', { level: 2, name: content.fechamento.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(content.fechamento.sub)).toBeInTheDocument();
    expect(screen.getByText(content.offer.payments)).toBeInTheDocument();
  });

  it('links the CTA to checkout', () => {
    render(<Fechamento />);
    expect(
      screen.getByRole('link', { name: content.fechamento.cta }),
    ).toHaveAttribute('href', content.checkoutUrl);
  });
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npx vitest run __tests__/layout/bands.test.tsx __tests__/sections/fechamento.test.tsx`
Expected: FAIL — bands: "secao 6 (sem id) nao existe"; fechamento: módulo não encontrado

- [ ] **Step 4: CSS da faixa branca**

Em `app/globals.css`, logo após o bloco `.site-band--dark { ... }`, adicionar:

```css
  /* Folha branca PURA para a secao de fechamento: o mesmo #ffffff do
     rodape, de proposito — os dois emendam sem linha visivel e o rodape
     le como continuacao da secao. O --light (#f7fbff) nao serve aqui:
     encostado no rodape branco, a diferenca aparece como mancha azulada. */
  .site-band--white {
    --band-bg: #ffffff;
    --band-solid: #ffffff;
    --band-fg: #07111f;
    --band-fg-strong: #050914;
    --band-fg-body: #3b4654;
    --band-fg-muted: #526071;
    --band-fg-faint: #667284;
    --band-rule: rgba(15, 42, 81, 0.1);
  }
```

- [ ] **Step 5: Content do fechamento**

Em `lib/content.ts`, entre o fim do bloco `offer` (depois de `] as OfferPair[],` e `},`) e o comentário do FAQ, adicionar:

```ts
  // Secao de fechamento: a ultima faixa, branca pura, que o rodape
  // continua. Repete a promessa nova do produto como ultimo argumento
  // antes do CTA final.
  fechamento: {
    label: 'Comece agora',
    title: 'Do primeiro parafuso ao primeiro cliente',
    sub: 'Seis módulos pra aprender do zero — e, no final, o Ted junto de você pra transformar o que aprendeu em renda.',
    cta: 'Quero aprender',
  },
```

- [ ] **Step 6: Criar o componente**

Criar `components/sections/Fechamento.tsx`:

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

/**
 * Fechamento da pagina: faixa branca pura (site-band--white), sem id e sem
 * tela cheia, as tres coisas de proposito — o rodape, que ja e branco,
 * emenda nela sem linha e a pagina termina numa superficie so. Sem id
 * tambem porque page.test exige `oferta` como ultima section[id].
 */
export function Fechamento() {
  const f = content.fechamento;
  return (
    <section className="site-section site-band site-band--white text-center">
      <div className="mx-auto w-full max-w-content">
        <SectionLabel>{f.label}</SectionLabel>
        <SplitReveal
          as="h2"
          className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl"
        >
          {f.title}
        </SplitReveal>
        <Reveal variant="simple" className="mx-auto mt-4 max-w-xl">
          <p className="text-sm leading-relaxed text-[color:var(--band-fg-body)] md:text-base">
            {f.sub}
          </p>
          <div className="mt-7 flex justify-center [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-7 [&_a]:text-sm">
            <MagneticButton>
              <Button href={content.checkoutUrl} variant="primary">
                {f.cta}
              </Button>
            </MagneticButton>
          </div>
          <p className="mt-3 text-[11px] text-[color:var(--band-fg-faint)] md:text-xs">
            {content.offer.payments}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Registrar na página**

Em `app/page.tsx`, adicionar o import (junto dos outros de sections):

```tsx
import { Fechamento } from '@/components/sections/Fechamento';
```

e dentro do `<main>`, depois de `<Oferta />`:

```tsx
        <Oferta />
        <Fechamento />
```

- [ ] **Step 8: Rodar e ver passar**

Run: `npx vitest run __tests__/layout/bands.test.tsx __tests__/sections/fechamento.test.tsx __tests__/page.test.tsx`
Expected: PASS (5 + 2 + 2). Atenção ao bands "alterna os tons": oferta é dark e o fechamento classifica como claro — alternância fecha. `page.test` continua passando porque a seção não tem id.

- [ ] **Step 9: Commit**

```bash
git add app/globals.css lib/content.ts components/sections/Fechamento.tsx app/page.tsx __tests__/layout/bands.test.tsx __tests__/sections/fechamento.test.tsx
git commit -m "feat: secao de fechamento branca que o rodape continua

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Verificação final

**Files:**
- Nenhum novo — suite completa + build + inspeção visual.

**Interfaces:**
- Consumes: tudo das tasks 1-5.
- Produces: confirmação de que a página inteira funciona; ajustes visuais finos só se a inspeção apontar (e aí voltam como diff mínimo com commit próprio).

- [ ] **Step 1: Suite completa**

Run: `npm test`
Expected: 16 arquivos, 79+ testes, todos passando (72 atuais + os novos das tasks 1-5).

- [ ] **Step 2: Build de produção**

Run: `npm run build`
Expected: export estático sem erro (é `output: 'export'` — build quebrado = deploy quebrado).

- [ ] **Step 3: Inspeção visual no navegador**

Com `npm run dev` rodando, abrir `http://localhost:3000` em 1440px e 390px e conferir:
- A emenda Fechamento → rodapé é invisível (mesma cor #ffffff, sem linha nem sombra atravessada).
- A barra flutuante (FloatingCta) sobre a faixa branca continua legível (ela tem borda e sombra próprias).
- O 4º passo da Evolução renderiza com o conector chegando nele e o stagger da animação.
- O card "Como renda extra" mostra o bullet novo.
- O card esquerdo da oferta mostra 8 linhas com "Ajuda de quem entende para começar a vender" na penúltima, e o acordeão da dúvida pareada abre.
- O parágrafo do hero quebra em 5 linhas equilibradas nos dois tamanhos.

- [ ] **Step 4: Checagem das palavras proibidas (cinto e suspensório)**

Run: `npx vitest run __tests__/content.test.ts`
Expected: PASS — em particular "does not advertise unsupported course deliverables" (nenhuma copy nova usa "precificar", "acesso vitalício" ou "certificado de conclusão").

---

## Self-review (feita na escrita do plano)

- **Cobertura:** as 5 decisões do cliente têm task própria (1=hero, 2=evolução, 3=caminhos, 4=oferta, 5=seção final). ✓
- **Placeholders:** nenhum — toda copy, todo código e todo comando estão literais. ✓
- **Consistência de tipos:** `OfferPair` já existe e o par novo bate; `content.fechamento` só é consumido por `Fechamento.tsx` e seu teste, com os mesmos nomes de campo (`label/title/sub/cta`); `site-band--white` aparece idêntico no CSS, no componente e no RITMO. ✓
- **Riscos conhecidos:** (a) `getByText` com regex no hero depende da frase caber num único span — o texto do Step 3 da Task 1 garante; (b) o classificador de alternância do bands.test trata white como claro por construção (`includes('site-band--dark')`); (c) FloatingCta sobre fundo branco já acontece hoje sobre o rodapé — nada muda.
