# Faixas de tela cheia, ritmo claro/escuro e a aba de virada — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar o cartão branco que envolve o site inteiro, fazer cada seção ocupar no mínimo uma tela, e marcar a virada de claro para escuro com a aba de canto côncavo.

**Architecture:** Cada `<section>` passa a declarar seu próprio tom através de classes que compõem com a `.site-section` existente (`site-band site-band--light|--dark [site-band--full]`). O tom define variáveis CSS de cor de texto, que substituem a cor que antes era herdada do `.site-card`. A ordem das tarefas nunca deixa a página num estado ilegível: as faixas são acrescentadas **antes** de o cartão ser removido, então nunca existe um momento com texto escuro sobre o fundo escuro do `body`.

**Tech Stack:** Next.js 14.2.5 (App Router, `output: 'export'`), Tailwind 3.4, GSAP 3.15 + ScrollTrigger, Lenis, Vitest 1.6 + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-08-14-faixas-tela-cheia-design.md`

**Ponto de retorno:** branch `backup/antes-das-faixas` (commit `e26f877`), já no GitHub. Para desfazer tudo: `git reset --hard backup/antes-das-faixas`.

## Estado de execução (2026-08-14)

Tarefas 1 a 5 **executadas**, com uma revisão de rumo depois da T4. Commits, em ordem:

| Commit | Conteúdo |
|---|---|
| `1e95749` | T1 — tokens de faixa e o hero |
| `c3ce7d7` | T2 — dores, módulos e evolução |
| `933d0c0` | T3 — caminhos, oferta e faq |
| `66ebbb6` | T4 — remoção do cartão |
| `ba23751` | **Revisão** + T5 — ritmo alternado, escuras transparentes, três abas |

**A revisão, em duas frases.** O cliente trocou a quebra única por alternância e pediu que as
faixas escuras mostrassem o fundo do site com os circuitos. Isso corrigiu um erro que este
plano não tinha previsto: o `<CircuitEdges />` já estava montado em `AppProviders` como canvas
`fixed inset-0 -z-10`, e dar fundo opaco a toda seção o enterrava — o efeito não sumiu do
código, sumiu da tela.

As tarefas abaixo ficam como foram escritas, com os tons da versão original. A spec tem a
versão corrente na seção "Revisão de 2026-08-14"; onde as duas divergirem, **a spec manda**.

Da T6, já foram feitos e conferidos: alturas nos dois tamanhos, sobrevivência do pin de
Módulos, geometria das três abas e ausência de rolagem lateral. A elevação do Hero foi medida
em 6px de diferença para o painel de vídeo — dentro da janela aceitável, então **não** foi
ajustada. Falta rodar o build de produção.

## Global Constraints

- **Os valores claros dos tokens são idênticos aos hexadecimais de hoje.** `--band-fg: #07111f`, `--band-fg-strong: #050914`, `--band-fg-body: #3b4654`, `--band-fg-muted: #526071`, `--band-fg-faint: #667284`. A metade clara do site não pode mudar um pixel.
- **Sintaxe de cor por variável no Tailwind:** sempre `text-[color:var(--token)]`, com a dica de tipo `color:`. Sem ela, `text-[var(--token)]` não é reconhecido como cor.
- **`.site-band` compõe com `.site-section`, não a substitui.** `.site-section` continua dona do espaçamento e do `scroll-margin`.
- **Módulos nunca recebe `.site-band--full`.** É pinada por ScrollTrigger e já ocupa a tela; altura mínima injetaria uma tela vazia antes do pin.
- **Nada de `overflow: hidden` em `#caminhos`** — cortaria a aba, que fica pendurada acima da seção.
- **Não tocar** em `Header.tsx`, `FloatingCta.tsx`, `HeroVideo.tsx`, `Instrutor.tsx` nem nos cards de `Modulos.tsx`: são superfícies próprias e não seguem o tom da faixa.
- **Rodar `npm test` deve continuar dando 62 testes verdes** (mais os novos). Se um teste antigo quebrar, a mudança passou do combinado — pare e investigue.
- **Commits em português, sem acentos**, seguindo o padrão do repositório (`feat:`, `fix:`, `style:`, `test:`, `docs:`).
- **Nunca rodar `npm run build` com o `next dev` no ar.** O build de produção sobrescreve o `.next` do dev e quebra o preview. Sequência segura: parar o dev → `npm run build` → `rm -rf .next` → reiniciar o dev.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade | Tarefa |
|---|---|---|
| `app/globals.css` | Sistema de faixas: tons, tokens, altura, textura, aba | 1, 4, 5 |
| `components/sections/Hero.tsx` | Faixa clara de tela cheia; abre espaço para o header fixo | 1 |
| `__tests__/layout/bands.test.tsx` | Trava o ritmo, a unicidade da aba e a ausência do cartão | 1, 2, 3, 4, 5 |
| `components/sections/Dores.tsx` | Faixa clara de tela cheia | 2 |
| `components/sections/Modulos.tsx` | Faixa clara **sem** tela cheia (exceção do pin) | 2 |
| `components/sections/Evolucao.tsx` | Faixa clara de tela cheia | 2 |
| `components/sections/Caminhos.tsx` | Faixa escura de tela cheia; hospeda a aba | 3, 5 |
| `components/sections/Oferta.tsx` | Faixa escura de tela cheia; painel escuro | 3 |
| `components/sections/OfertaTrust.tsx` | Tokens de cor | 3 |
| `components/sections/Faq.tsx` | Faixa escura de tela cheia | 3 |
| `app/page.tsx` | `<main>` sem cartão | 4 |
| `components/layout/MainCard.tsx` | **removido** | 4 |
| `components/layout/SectionTab.tsx` | **novo** — a aba de virada | 5 |

---

### Task 1: Sistema de faixas no CSS e o Hero como primeira faixa

**Files:**
- Modify: `app/globals.css` (bloco `@layer components`, após a regra `.site-card > *` na linha 171)
- Modify: `components/sections/Hero.tsx:12-16,21,53`
- Test: `__tests__/layout/bands.test.tsx` (criar, junto com o diretório `__tests__/layout/`)

**Interfaces:**
- Consumes: nada (primeira tarefa).
- Produces: as classes CSS `.site-band`, `.site-band--light`, `.site-band--dark`, `.site-band--full`, e os tokens `--band-bg`, `--band-fg`, `--band-fg-strong`, `--band-fg-body`, `--band-fg-muted`, `--band-fg-faint`, `--band-rule`. Produz também a constante `RITMO` em `bands.test.tsx`, que as tarefas 2 e 3 estendem.

- [ ] **Step 1: Escrever o teste que falha**

Criar `__tests__/layout/bands.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '@/app/page';

// O ritmo da pagina, na ordem do DOM. Cresce nas tarefas 2 e 3 ate
// cobrir as sete secoes. `id` vazio = a secao Evolucao, que nao tem id.
// `full: false` marca excecao declarada, nao esquecimento.
export const RITMO = [
  { id: 'hero', tom: 'light', full: true },
];

describe('Faixas da pagina', () => {
  it('da a cada secao o tom e a altura que o ritmo manda', () => {
    const { container } = render(<Home />);
    const secoes = Array.from(container.querySelectorAll('main section'));

    RITMO.forEach((esperado, i) => {
      const secao = secoes[i];
      expect(secao, `secao ${i} (${esperado.id || 'sem id'}) nao existe`).toBeTruthy();
      expect(secao.id).toBe(esperado.id);
      expect(secao.className).toContain('site-band');
      expect(secao.className).toContain(`site-band--${esperado.tom}`);
      if (esperado.full) {
        expect(secao.className).toContain('site-band--full');
      } else {
        expect(secao.className).not.toContain('site-band--full');
      }
    });
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run __tests__/layout/bands.test.tsx`
Expected: FAIL — `expect(secao.className).toContain('site-band')`, porque o Hero ainda não tem a classe.

- [ ] **Step 3: Acrescentar o sistema de faixas ao CSS**

Em `app/globals.css`, dentro de `@layer components`, logo depois da regra `.site-card > *` (que termina na linha 171), inserir:

```css
  /* ---- Faixas de secao ----------------------------------------------
     Cada secao pinta o proprio fundo e define a cor do texto que seus
     filhos herdam. Antes isso vinha do .site-card, que envolvia a
     pagina inteira; sem essa fonte de verdade o site perde a cor. */
  .site-band {
    position: relative;
    background: var(--band-bg);
    color: var(--band-fg);
  }
  /* O conteudo fica acima da textura decorativa (::before, z-index 0).
     A aba fica de fora da regra: ela e `absolute` para se pendurar
     acima da secao, e um `relative` generico a arrancaria da ancora. */
  .site-band > *:not(.section-tab) {
    position: relative;
    z-index: 1;
  }
  .site-band--light {
    --band-bg: #f7fbff;
    --band-fg: #07111f;
    --band-fg-strong: #050914;
    --band-fg-body: #3b4654;
    --band-fg-muted: #526071;
    --band-fg-faint: #667284;
    --band-rule: rgba(15, 42, 81, 0.1);
  }
  .site-band--dark {
    --band-bg: #07111f;
    --band-fg: #eef2f7;
    --band-fg-strong: #ffffff;
    --band-fg-body: #c3ccd8;
    --band-fg-muted: #9fb0c2;
    --band-fg-faint: #8a97a8;
    --band-rule: rgba(255, 255, 255, 0.1);
  }
  /* Grade quadriculada herdada do cartao que sai na tarefa 4. E textura
     de marca, nao decoracao do cartao. Uma regra so de remover. */
  .site-band--light::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(30, 158, 219, 0.85) 1px, transparent 1px),
      linear-gradient(90deg, rgba(30, 158, 219, 0.85) 1px, transparent 1px);
    background-size: 34px 34px;
    opacity: 0.08;
  }
  /* Brilho azul da marca nas faixas escuras, dimensionado para faixa de
     ponta a ponta (o do cartao era para uma caixa de 1280px). */
  .site-band--dark::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(760px 420px at 12% 0%, rgba(30, 158, 219, 0.16), transparent 62%),
      radial-gradient(680px 460px at 100% 100%, rgba(15, 42, 81, 0.28), transparent 66%);
  }
  /* min-height, nunca height: uma tela e o piso. No mobile Caminhos
     (1,60 tela), Oferta (1,14) e Modulos (1,07) crescem em vez de
     cortar conteudo ou criar rolagem dentro de rolagem. */
  .site-band--full {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100svh;
  }
```

Ainda em `app/globals.css`, trocar a regra `.section-divider` (linha 180) para que o fio siga o tom da faixa em vez de sumir sobre fundo escuro:

```css
  .section-divider {
    border-top: 1px solid var(--band-rule, rgba(15, 42, 81, 0.1));
  }
```

- [ ] **Step 4: Migrar o Hero**

Em `components/sections/Hero.tsx`, trocar a abertura da seção (linhas 12-16):

```tsx
    <section
      id="hero"
      className="site-section site-section--compact site-band site-band--light site-band--full relative overflow-hidden pt-24 sm:pt-28"
    >
      {/* O pt-24/28 era do <main>, que reservava espaco para o header
          fixo. Com o cartao fora, a faixa do Hero passa a ser a unica
          responsavel por nao deixar o titulo embaixo do header. */}
      <div className="relative mx-auto grid w-full max-w-content items-stretch gap-10 pt-10 md:grid-cols-[0.85fr_1.15fr] md:pt-14 lg:pt-16">
```

O `min-h-[calc(100svh-24rem)]` sai do `<div>` interno: aquele numero foi calculado para o layout do cartao e agora competiria com a altura da faixa.

Na linha 21, trocar a cor fixa do `h1`:

```tsx
          <h1 className="max-w-3xl font-extrabold leading-[1.08] tracking-tight text-[color:var(--band-fg-strong)]">
```

Na linha 53, trocar a cor fixa dos bullets:

```tsx
                className="flex items-start gap-3 text-xs text-[color:var(--band-fg-strong)] sm:text-sm"
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `npx vitest run __tests__/layout/bands.test.tsx`
Expected: PASS

- [ ] **Step 6: Rodar a suíte inteira**

Run: `npm test`
Expected: todos os testes existentes continuam verdes. `hero.test.tsx` afirma sobre `text-blue`, tamanhos e entrelinha do título — nada sobre as cores que mudaram.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css components/sections/Hero.tsx __tests__/layout/bands.test.tsx
git commit -m "feat: sistema de faixas de secao e hero como primeira faixa"
```

---

### Task 2: As outras três faixas claras

**Files:**
- Modify: `components/sections/Dores.tsx:10,23,24,29`
- Modify: `components/sections/Modulos.tsx:376-380`
- Modify: `components/sections/Evolucao.tsx:11,19,38`
- Test: `__tests__/layout/bands.test.tsx` (estender a constante `RITMO`)

**Interfaces:**
- Consumes: as classes e tokens da Task 1 (`site-band`, `site-band--light`, `site-band--full`, `--band-fg-body`, `--band-fg-muted`, `--band-fg-faint`, `--band-fg-strong`).
- Produces: `RITMO` com quatro entradas, incluindo a exceção declarada de Módulos (`full: false`).

- [ ] **Step 1: Estender o teste**

Em `__tests__/layout/bands.test.tsx`, substituir a constante `RITMO` por:

```tsx
export const RITMO = [
  { id: 'hero', tom: 'light', full: true },
  { id: 'dores', tom: 'light', full: true },
  // Modulos e pinada pelo ScrollTrigger e ja ocupa a tela. Altura minima
  // injetaria uma tela vazia antes do pin. Excecao declarada.
  { id: 'modulos', tom: 'light', full: false },
  { id: '', tom: 'light', full: true },
];
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run __tests__/layout/bands.test.tsx`
Expected: FAIL na seção `dores` — `expect(secao.className).toContain('site-band')`.

- [ ] **Step 3: Migrar Dores**

Em `components/sections/Dores.tsx`, linha 10:

```tsx
    <section id="dores" className="site-section site-band site-band--light site-band--full section-divider scroll-mt-24">
```

Linha 23:

```tsx
              <p className="text-sm italic leading-snug text-[color:var(--band-fg-body)]">“{t.q}”</p>
```

Linha 24:

```tsx
              <small className="mt-1 block text-xs not-italic text-[color:var(--band-fg-faint)]">{t.s}</small>
```

Linha 29:

```tsx
        <p className="mt-8 text-sm font-semibold text-[color:var(--band-fg-strong)] md:text-base">{d.turn}</p>
```

- [ ] **Step 4: Migrar Módulos, sem altura**

Em `components/sections/Modulos.tsx`, linhas 376-380:

```tsx
    <section
      ref={sectionRef}
      id="modulos"
      className="site-section site-band site-band--light section-divider scroll-mt-24"
    >
```

Sem `site-band--full`: a seção é pinada e já ocupa a tela. Nada mais neste arquivo muda — os cards de módulo são superfície própria e continuam escuros sobre a faixa clara, que é justamente o que os destaca.

- [ ] **Step 5: Migrar Evolução**

Em `components/sections/Evolucao.tsx`, linha 11:

```tsx
    <section className="site-section site-band site-band--light site-band--full section-divider">
```

Linha 19:

```tsx
              <div className="mt-1 text-[11px] text-[color:var(--band-fg-muted)] md:text-xs">{e.gaugeCaption}</div>
```

Linha 38:

```tsx
                <div className="font-mono text-[11px] uppercase tracking-wide text-[color:var(--band-fg-faint)] md:text-xs">{s.k}</div>
```

- [ ] **Step 6: Rodar os testes**

Run: `npx vitest run __tests__/layout/bands.test.tsx` — Expected: PASS
Run: `npm test` — Expected: tudo verde.

- [ ] **Step 7: Commit**

```bash
git add components/sections/Dores.tsx components/sections/Modulos.tsx components/sections/Evolucao.tsx __tests__/layout/bands.test.tsx
git commit -m "feat: dores, modulos e evolucao viram faixas claras"
```

---

### Task 3: As três faixas escuras

**Files:**
- Modify: `components/sections/Caminhos.tsx:80-83,92,115`
- Modify: `components/sections/Oferta.tsx:13-16,23,25,39,43`
- Modify: `components/sections/OfertaTrust.tsx:14,17,30`
- Modify: `components/sections/Faq.tsx:14,24,28,33`
- Test: `__tests__/layout/bands.test.tsx`

**Interfaces:**
- Consumes: `site-band--dark` e os tokens da Task 1.
- Produces: `RITMO` completo, com sete entradas — a partir daqui o teste cobre a página inteira.

- [ ] **Step 1: Completar o teste**

Em `__tests__/layout/bands.test.tsx`, substituir `RITMO` pela versão final e acrescentar um segundo `it` que impede que alguém acrescente uma seção sem declarar seu tom:

```tsx
export const RITMO = [
  { id: 'hero', tom: 'light', full: true },
  { id: 'dores', tom: 'light', full: true },
  { id: 'modulos', tom: 'light', full: false },
  { id: '', tom: 'light', full: true },
  { id: 'caminhos', tom: 'dark', full: true },
  { id: 'oferta', tom: 'dark', full: true },
  { id: 'faq', tom: 'dark', full: true },
];
```

E, dentro do mesmo `describe`:

```tsx
  it('nao deixa nenhuma secao fora do ritmo', () => {
    const { container } = render(<Home />);
    const secoes = container.querySelectorAll('main section');
    expect(secoes).toHaveLength(RITMO.length);
  });
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run __tests__/layout/bands.test.tsx`
Expected: FAIL na seção `caminhos` — `expect(secao.className).toContain('site-band--dark')`.

- [ ] **Step 3: Migrar Caminhos**

Em `components/sections/Caminhos.tsx`, linhas 80-83. O `section-divider` sai: em faixa escura a virada é a aba (Task 5), e um fio a mais só sujaria.

```tsx
    <section
      id="caminhos"
      className="site-section site-band site-band--dark site-band--full scroll-mt-24"
    >
```

Linha 92:

```tsx
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--band-fg-muted)] md:text-[15px]">
```

Linha 115:

```tsx
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--band-fg-muted)]">
```

O `site-panel path-card` dos cards fica como está: `.path-card` já zera fundo, borda e sombra, então os cards são transparentes e funcionam sobre escuro sem mudança.

- [ ] **Step 4: Migrar Oferta**

Em `components/sections/Oferta.tsx`, linhas 13-16:

```tsx
    <section
      id="oferta"
      className="site-section site-band site-band--dark site-band--full scroll-mt-24"
    >
```

Linha 23 — o painel claro vira o escuro, que já existe no `globals.css`:

```tsx
        <div className="site-dark-panel mx-auto mt-10 grid max-w-3xl overflow-hidden rounded-[1.5rem] text-left md:grid-cols-2">
```

Linha 25:

```tsx
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-[color:var(--band-fg-faint)] md:text-sm">
```

Linha 39:

```tsx
            <div className="text-xs text-[color:var(--band-fg-faint)] line-through md:text-sm">{o.priceFrom}</div>
```

Linha 43:

```tsx
            <div className="mt-1 text-xs text-[color:var(--band-fg-muted)] md:text-sm">{o.installments}</div>
```

- [ ] **Step 5: Migrar OfertaTrust**

Em `components/sections/OfertaTrust.tsx`, linha 14:

```tsx
            <div className="text-xs font-bold text-[color:var(--band-fg-strong)] md:text-sm">
```

Linha 17:

```tsx
            <p className="mt-1 text-[11px] leading-relaxed text-[color:var(--band-fg-faint)] md:text-xs">
```

Linha 30:

```tsx
              className="flex items-center gap-2 text-[11px] text-[color:var(--band-fg-faint)] md:text-xs"
```

- [ ] **Step 6: Migrar FAQ**

Em `components/sections/Faq.tsx`, linha 14:

```tsx
    <section id="faq" className="site-section site-band site-band--dark site-band--full scroll-mt-24">
```

Linha 24:

```tsx
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-[color:var(--band-fg-strong)] [&::-webkit-details-marker]:hidden md:text-base">
```

Linha 28:

```tsx
              <p className="pb-4 text-sm leading-relaxed text-[color:var(--band-fg-body)]">{item.a}</p>
```

Linha 33:

```tsx
        <p className="mt-8 text-xs text-[color:var(--band-fg-faint)] md:text-sm">{f.ctaHint}</p>
```

- [ ] **Step 7: Rodar os testes**

Run: `npx vitest run __tests__/layout/bands.test.tsx` — Expected: PASS, os dois testes.
Run: `npm test` — Expected: tudo verde. `oferta.test.tsx` e `faq.test.tsx` afirmam sobre texto e links, não sobre cor.

- [ ] **Step 8: Commit**

```bash
git add components/sections/Caminhos.tsx components/sections/Oferta.tsx components/sections/OfertaTrust.tsx components/sections/Faq.tsx __tests__/layout/bands.test.tsx
git commit -m "feat: caminhos, oferta e faq viram faixas escuras"
```

---

### Task 4: Tirar o cartão

**Files:**
- Modify: `app/page.tsx:11,17,25`
- Delete: `components/layout/MainCard.tsx`
- Modify: `app/globals.css` (remover `.site-card`, `.site-card::before`, `.site-card::after`, `.site-card > *`, e a regra de `border-radius` dentro do `@media (min-width: 640px)`)
- Test: `__tests__/layout/bands.test.tsx`

**Interfaces:**
- Consumes: todas as sete faixas das tarefas 1-3 já pintando o próprio fundo. **Esta é a razão da ordem:** com as faixas já no lugar, remover o cartão nunca produz um estado com texto escuro sobre o fundo escuro do `body`.
- Produces: página de ponta a ponta, sem nenhum `.site-card` no documento.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `__tests__/layout/bands.test.tsx`, dentro do `describe`:

```tsx
  it('nao tem mais o cartao branco envolvendo a pagina', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('.site-card')).toBeNull();
  });
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run __tests__/layout/bands.test.tsx -t "cartao branco"`
Expected: FAIL — `expected <div class="site-card ..."> to be null`.

- [ ] **Step 3: Trazer o `<main>` para a página**

Substituir `app/page.tsx` inteiro por:

```tsx
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Dores } from '@/components/sections/Dores';
import { Modulos } from '@/components/sections/Modulos';
import { Evolucao } from '@/components/sections/Evolucao';
import { Caminhos } from '@/components/sections/Caminhos';
import { Oferta } from '@/components/sections/Oferta';
import { Faq } from '@/components/sections/Faq';
import { FloatingCta } from '@/components/sections/FloatingCta';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Header />
      {/* Sem cartao e sem calha: cada secao pinta o proprio fundo de
          ponta a ponta e traz o proprio espacamento pela .site-section. */}
      <main className="relative z-10">
        <Hero />
        <Dores />
        <Modulos />
        <Evolucao />
        <Caminhos />
        <Oferta />
        <Faq />
      </main>
      <FloatingCta />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Apagar o componente do cartão**

```bash
git rm components/layout/MainCard.tsx
```

- [ ] **Step 5: Limpar o CSS do cartão**

Em `app/globals.css`, remover os blocos `.site-card` (linhas 133-144), `.site-card::before` (145-156), `.site-card::after` (157-167) e `.site-card > *` (168-171). Dentro do `@media (min-width: 640px)` que começa na linha 205, remover só o bloco:

```css
    .site-card {
      border-radius: 2rem;
    }
```

Mantendo o `.site-section { padding-inline: 2rem; }` que fica no mesmo media query.

- [ ] **Step 6: Rodar os testes**

Run: `npx vitest run __tests__/layout/bands.test.tsx` — Expected: PASS
Run: `npm test` — Expected: tudo verde. `page.test.tsx` consulta `main section` e âncoras por id, que continuam existindo.

- [ ] **Step 7: Confirmar que nada mais importa o MainCard**

Run: `grep -rn "MainCard" app components __tests__`
Expected: nenhuma linha. Se aparecer alguma, corrija antes de commitar.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx app/globals.css __tests__/layout/bands.test.tsx
git commit -m "feat: remove o cartao branco, as secoes vao de ponta a ponta"
```

---

### Task 5: A aba de virada

**Files:**
- Create: `components/layout/SectionTab.tsx`
- Modify: `app/globals.css` (acrescentar `.section-tab__gutter` e `.section-tab__shoulder` ao `@layer components`)
- Modify: `components/sections/Caminhos.tsx` (importar e renderizar `<SectionTab />` como primeiro filho da seção)
- Test: `__tests__/layout/bands.test.tsx`

**Interfaces:**
- Consumes: `var(--band-bg)` da faixa que hospeda a aba — a aba não sabe que é escura, ela herda o fundo de quem a hospeda. Consome também a exclusão `.site-band > *:not(.section-tab)` da Task 1, que impede que a aba receba `position: relative`.
- Produces: `export function SectionTab(): JSX.Element` — sem props, e a classe `.section-tab` no elemento raiz, que é o que o teste procura.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `__tests__/layout/bands.test.tsx`, dentro do `describe`:

```tsx
  it('poe exatamente uma aba, e dentro de caminhos', () => {
    const { container } = render(<Home />);
    const abas = container.querySelectorAll('.section-tab');
    expect(abas).toHaveLength(1);
    expect(abas[0].closest('section')?.id).toBe('caminhos');
  });

  it('nao deixa caminhos cortar a aba com overflow', () => {
    const { container } = render(<Home />);
    // A aba fica pendurada acima da secao (bottom-full). Um
    // overflow-hidden na secao a cortaria inteira.
    const caminhos = container.querySelector('#caminhos');
    expect(caminhos?.className).not.toContain('overflow-hidden');
  });
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run __tests__/layout/bands.test.tsx -t "aba"`
Expected: FAIL — `expected length 0 to be 1`.

- [ ] **Step 3: Criar o componente**

Criar `components/layout/SectionTab.tsx`:

```tsx
/**
 * A aba que marca a virada de uma faixa clara para uma escura.
 *
 * O efeito nao vem do corpo da aba, e sim dos dois "ombros" ao lado
 * dele: cada quadradinho de 28px leva uma mascara radial que escava um
 * quarto de circulo no proprio canto superior. O resultado e um canto
 * concavo que emenda com o canto convexo do corpo, e a aba deixa de
 * parecer colada por cima para parecer que brota da faixa.
 *
 * A cor vem de var(--band-bg): a aba nao sabe que e escura, ela herda o
 * fundo da faixa que a hospeda. Mudar a quebra de secao leva a aba
 * junto, com a cor certa, sem editar este arquivo.
 *
 * Medidas conferidas na referencia (Zarpei): 56px de altura, ombros de
 * 28x28, raio de 28px, corpo de min(58%, 520px). Nao muda entre desktop
 * e mobile — nenhum breakpoint e necessario.
 */
export function SectionTab() {
  return (
    <div
      aria-hidden="true"
      className="section-tab pointer-events-none absolute inset-x-0 bottom-full"
    >
      <div className="section-tab__gutter mx-auto w-full max-w-content">
        <div className="flex h-14 items-stretch">
          <span className="section-tab__shoulder section-tab__shoulder--l" />
          <span className="h-full w-[min(58%,520px)] shrink-0 rounded-t-[28px] bg-[var(--band-bg)]" />
          <span className="section-tab__shoulder section-tab__shoulder--r" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Acrescentar o CSS da aba**

Em `app/globals.css`, no fim do `@layer components`, inserir:

```css
  /* ---- Aba de virada entre faixas ------------------------------------ */
  /* A calha repete a da .site-section para que a borda esquerda do corpo
     da aba caia na mesma coluna do conteudo da secao. */
  .section-tab__gutter {
    padding-inline: 1.25rem;
  }
  .section-tab__shoulder {
    align-self: flex-end;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    background: var(--band-bg);
    -webkit-mask-image: radial-gradient(28px at var(--tab-corner) 0, transparent 27px, #000 28px);
    mask-image: radial-gradient(28px at var(--tab-corner) 0, transparent 27px, #000 28px);
  }
  /* A margem negativa puxa o ombro para dentro da calha, para que o
     corpo da aba comece exatamente na coluna de conteudo. */
  .section-tab__shoulder--l {
    --tab-corner: 0;
    margin-left: -28px;
  }
  .section-tab__shoulder--r {
    --tab-corner: 100%;
  }
  @media (min-width: 640px) {
    .section-tab__gutter {
      padding-inline: 2rem;
    }
  }
  @media (min-width: 1024px) {
    .section-tab__gutter {
      padding-inline: 4rem;
    }
  }
```

- [ ] **Step 5: Pendurar a aba em Caminhos**

Em `components/sections/Caminhos.tsx`, acrescentar o import junto dos outros:

```tsx
import { SectionTab } from '@/components/layout/SectionTab';
```

E renderizar a aba como primeiro filho da seção, antes do `<div className="mx-auto ...">`:

```tsx
    <section
      id="caminhos"
      className="site-section site-band site-band--dark site-band--full scroll-mt-24"
    >
      <SectionTab />
      <div className="mx-auto w-full max-w-content text-center">
```

- [ ] **Step 6: Rodar os testes**

Run: `npx vitest run __tests__/layout/bands.test.tsx` — Expected: PASS, os cinco testes.
Run: `npm test` — Expected: tudo verde.

- [ ] **Step 7: Commit**

```bash
git add components/layout/SectionTab.tsx app/globals.css components/sections/Caminhos.tsx __tests__/layout/bands.test.tsx
git commit -m "feat: aba de virada marca a passagem para as faixas escuras"
```

---

### Task 6: Conferir no navegador e ajustar

Os testes garantem estrutura, não geometria. jsdom não aplica folha de estilo, então nada até aqui provou que a altura funcionou, que o pin de Módulos sobreviveu ou que a aba não está cortada. Esta tarefa mede.

**Files:**
- Modify: `components/sections/Hero.tsx` (só se a medição mostrar deslocamento duplo)
- Modify: `components/sections/Modulos.tsx` (só se a medição mostrar que o pin aceita altura mínima)

**Interfaces:**
- Consumes: a página inteira, já montada pelas tarefas 1-5.
- Produces: nada de novo — confirma ou corrige o que existe.

- [ ] **Step 1: Subir o preview**

```bash
npm run dev -- -p 3010
```

Se o servidor já estiver no ar de uma sessão anterior, pare antes de buildar. Se o `next dev` reclamar de `EINVAL: readlink` no `.next` (atrito do OneDrive), rode `rm -rf .next` e suba de novo.

- [ ] **Step 2: Medir as alturas nos dois tamanhos**

Com Playwright em `http://localhost:3010`, a 1440×900 e depois a 390×844:

```js
() => {
  const vh = window.innerHeight;
  return Array.from(document.querySelectorAll('main section')).map((s) => {
    const r = s.getBoundingClientRect();
    return { id: s.id || '(evolucao)', h: Math.round(r.height), telas: +(r.height / vh).toFixed(2) };
  });
}
```

Esperado a 1440×900, comparando com a linha de base da spec (hero 612, dores 415, modulos 3547, evolucao 501, caminhos 723, oferta 612, faq 459):

- `hero`, `dores`, `evolucao`, `caminhos`, `oferta`, `faq` — todos **≥ 900px** (`telas ≥ 1.0`). Antes estavam entre 0,46 e 0,80.
- `modulos` — perto de **3547px**. Se tiver crescido cerca de 900px, o pin ganhou uma tela vazia: confira que a seção realmente não recebeu `site-band--full`.

Esperado a 390×844: `caminhos` continua acima de uma tela (era 1,60) e nada foi cortado.

- [ ] **Step 3: Conferir que o pin de Módulos não se mexeu**

```js
() => {
  const st = window.ScrollTrigger || (window.gsap && window.gsap.core && window.ScrollTrigger);
  const gatilhos = (st ? st.getAll() : []).filter((t) => t.pin);
  return gatilhos.map((t) => ({ start: Math.round(t.start), end: Math.round(t.end) }));
}
```

Se `ScrollTrigger` não estiver exposto no `window`, meça pelo efeito: role até `#modulos` ficar no topo e confirme que os cards andam na horizontal enquanto a seção fica travada, e que a seção destrava depois do último card. O pin funcionando é o critério; os números exatos mudam porque as seções acima ficaram mais altas.

- [ ] **Step 4: Conferir que a aba não está cortada**

```js
() => {
  const aba = document.querySelector('.section-tab');
  const secao = document.querySelector('#caminhos');
  const a = aba.getBoundingClientRect();
  const s = secao.getBoundingClientRect();
  return {
    alturaDaAba: Math.round(a.height),          // esperado: 56
    folgaAteASecao: Math.round(s.top - a.bottom), // esperado: 0
    abaAcimaDaSecao: a.bottom <= s.top + 1,       // esperado: true
    larguraDoCorpo: Math.round(aba.querySelector('span:nth-child(2)').getBoundingClientRect().width),
  };
}
```

Esperado nos dois tamanhos: `alturaDaAba` 56, `abaAcimaDaSecao` true. A 1440 o corpo bate em 520 (o teto do `min(58%, 520px)`); a 390, perto de 203 (58% da calha).

- [ ] **Step 5: Conferir o contraste real nas faixas escuras**

```js
() => {
  const alvos = ['#caminhos p', '#oferta .site-dark-panel div', '#faq summary', '#faq p'];
  return alvos.map((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, achou: false };
    const cs = getComputedStyle(el);
    return { sel, cor: cs.color, fundo: getComputedStyle(el.closest('section')).backgroundColor };
  });
}
```

Esperado: nenhuma cor de texto escura (`rgb(5, 9, 20)`, `rgb(59, 70, 84)`, `rgb(82, 96, 113)`, `rgb(102, 114, 132)`) sobre fundo escuro. Se aparecer alguma, é uma cor fixa que escapou da tabela da spec — corrija trocando pelo token equivalente.

- [ ] **Step 6: Decidir sobre a elevação do Hero**

A faixa agora centraliza o conteúdo verticalmente, e o Hero ainda carrega `-translate-y-4 md:-translate-y-6 lg:-translate-y-10` de um ajuste anterior, feito quando o bloco não era centralizado. Meça a 1440×900:

```js
() => {
  const h1 = document.querySelector('#hero h1').getBoundingClientRect();
  const video = document.querySelector('#hero [data-video]').getBoundingClientRect();
  return { topoDoTitulo: Math.round(h1.top), topoDoVideo: Math.round(video.top), diferenca: Math.round(h1.top - video.top) };
}
```

Se `diferenca` estiver entre −10 e +15, está bom — deixe como está. Se o título subiu demais (`diferenca` menor que −20), remova a elevação, trocando a linha 20 de `Hero.tsx` por:

```tsx
        <div className="flex flex-col justify-center text-left">
```

- [ ] **Step 7: Rodar build e suíte**

Pare o `next dev` antes de buildar.

```bash
npm test
npm run build
```

Expected: testes verdes e build sem erro. Depois do build, `rm -rf .next` e suba o dev de novo se quiser continuar com o preview.

- [ ] **Step 8: Commit, se houve ajuste**

```bash
git add -A
git commit -m "style: ajusta o hero depois da faixa assumir a altura"
```

Se a medição não pediu ajuste nenhum, não há o que commitar — registre no relatório que a conferência passou limpa.

---

## Autorrevisão do plano

**Cobertura da spec.** Cada item tem tarefa: tokens e classes (T1); as quatro faixas claras (T1, T2); as três escuras e as 11 cores fixas (T3); remoção do cartão e migração do `padding` do header (T1 passo 4, T4); a aba (T5); os quatro testes pedidos — ritmo, aba única, ausência do cartão, exceção de Módulos (T1-T5); a verificação por medição, o pin, o contraste e a elevação do Hero (T6). A preservação da grade quadriculada e o descarte dos brilhos radiais estão no T1 passo 3 e no T4 passo 5. A exclusão `:not(.section-tab)` está no T1 passo 3 e é consumida no T5.

**Sem placeholders.** Todo passo de código traz o código. Os dois passos condicionais do T6 (elevação do Hero, altura de Módulos) trazem o critério numérico da decisão e o código exato de cada saída, em vez de mandar "ajuste se precisar".

**Consistência de nomes.** `site-band`, `site-band--light`, `site-band--dark`, `site-band--full`, `section-tab`, `section-tab__gutter`, `section-tab__shoulder`, `section-tab__shoulder--l/--r` são usados com a mesma grafia da definição (T1 e T5) em todas as tarefas. Os tokens `--band-bg`, `--band-fg`, `--band-fg-strong`, `--band-fg-body`, `--band-fg-muted`, `--band-fg-faint`, `--band-rule` são definidos no T1 e consumidos com o mesmo nome nos T2, T3 e T5. A constante `RITMO` nasce no T1 e cresce no T2 e T3, sempre com as chaves `id`, `tom`, `full`.
