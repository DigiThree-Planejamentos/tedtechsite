# TedTech Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, statically-exported Next.js landing page that sells TedTech's recorded (EAD) PC maintenance/assembly course, faithful to the approved dark+blue design and borderless-card style.

**Architecture:** Next.js App Router with `output: 'export'` (no backend). One route `/` composed of ten isolated section components. All copy, prices, links and instructor data live in a single typed content module (`lib/content.ts`) so placeholders can be filled later without touching JSX. Tailwind handles layout/spacing; a small `globals.css` holds the design tokens, background glows and the CSS-only conic-gradient gauge. Light smoke tests (Vitest + React Testing Library) assert each section renders its key copy and that CTAs point at the configured URLs.

**Tech Stack:** Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, Vitest + @testing-library/react + jsdom, `next/font` (Inter).

## Global Constraints

- **Language:** all UI copy in Brazilian Portuguese (pt-BR). `<html lang="pt-BR">`.
- **Static only:** `next.config.mjs` MUST set `output: 'export'`; no server actions, no API routes, no runtime data fetching. `images.unoptimized = true`.
- **Palette (CSS variables, exact hex):** `--bg #06080D`; `--bg-soft #0B0F17`; `--blue #1E9EDB`; `--blue-2 #0F6FB8`; `--blue-deep #0F2A51`; `--text #EEF2F7`; `--muted #8A97A8`; `--wa #25D366`. Brand accent is always the blue gradient `#1E9EDB → #0F6FB8` (vertical) or `#1E9EDB → #7FD0F5` (text highlight). The WhatsApp green `#25D366` is used ONLY on the WhatsApp button.
- **Style rule (global):** cards are borderless and background-less by default. When delimitation is required (chat window, offer card) use a single light clean border `1px solid rgba(255,255,255,.10)` over a transparent/near-null fill. Section labels are plain colored text — never pills.
- **Course = 6 modules**, recorded/EAD. Dual audience: personal use + opening a business. Beginner-from-zero tone, no jargon.
- **Primary CTA** → external checkout URL (`content.checkoutUrl`). **Secondary CTA** → WhatsApp `wa.me` link (`content.whatsappUrl`). Both come from `lib/content.ts`; never hardcode in components.
- **Fonts** via `next/font` (Inter). No external blocking font requests.
- **Accessibility:** AA contrast, visible focus rings on interactive elements, touch targets ≥ 44px, all images/video have `alt`/labels.

---

## File Structure

```
package.json                      # deps + scripts
next.config.mjs                   # output: 'export', images.unoptimized
tsconfig.json                     # TS config (Next default + path alias @/*)
tailwind.config.ts                # content globs, token colors
postcss.config.mjs                # tailwind + autoprefixer
vitest.config.ts                  # jsdom env, react plugin, alias
vitest.setup.ts                   # @testing-library/jest-dom
app/layout.tsx                    # <html lang>, Inter font, metadata + OG, globals import
app/page.tsx                      # composes the 10 sections in order
app/globals.css                   # tokens, base, background glows, gauge, utilities
lib/site.ts                       # site-wide constants (name, nav, urls source)
lib/content.ts                    # ALL copy + placeholders (typed)
components/ui/Button.tsx          # primary (blue) / whatsapp (green) link-button
components/ui/SectionLabel.tsx    # plain-text colored label
components/ui/Logo.tsx            # "Ted" + gradient "TECH" wordmark
components/sections/Header.tsx    # S1 fixed transparent header
components/sections/Hero.tsx      # S2 centered hero ★
components/sections/Identificacao.tsx  # S3 "Você se identifica?" quotes
components/sections/Modulos.tsx   # S4 6 modules clean grid ★
components/sections/Evolucao.tsx  # S5 gauge + 3-step journey ★
components/sections/Instrutor.tsx # S6 instructor, video at bottom
components/sections/TiraDuvidas.tsx    # S7 chat → WhatsApp ★
components/sections/Oferta.tsx    # S8 two-column offer → checkout
components/sections/CtaFinal.tsx  # S9 final CTA band
components/sections/Footer.tsx    # S9 footer
__tests__/content.test.ts         # content invariants
__tests__/sections/*.test.tsx     # one smoke test per section
```

Design source of truth: the approved standalone mockups in
`.superpowers/brainstorm/1825-1782483299/content/` — each section task names the exact file to port from. Spec: `docs/superpowers/specs/2026-06-26-tedtech-landing-design.md`.

---

## Task 1: Project scaffold + tooling + test harness

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `.gitignore`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (minimal placeholders, fleshed out later)

**Interfaces:**
- Produces: a buildable Next.js app with `npm run build` (static export to `out/`), `npm run dev`, `npm test` (Vitest). Path alias `@/*` → repo root.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "tedtech-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "6.4.6",
    "@testing-library/react": "16.0.0",
    "@types/node": "20.14.9",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@vitejs/plugin-react": "4.3.1",
    "autoprefixer": "10.4.19",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5",
    "jsdom": "24.1.0",
    "postcss": "8.4.39",
    "tailwindcss": "3.4.6",
    "typescript": "5.5.3",
    "vitest": "1.6.0"
  }
}
```

- [ ] **Step 2: Create config files**

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`postcss.config.mjs`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#06080D',
        'bg-soft': '#0B0F17',
        blue: '#1E9EDB',
        'blue-2': '#0F6FB8',
        'blue-deep': '#0F2A51',
        text: '#EEF2F7',
        muted: '#8A97A8',
        wa: '#25D366',
      },
      maxWidth: { content: '920px' },
    },
  },
  plugins: [],
};
export default config;
```

`.gitignore`:
```
node_modules/
.next/
out/
*.log
.DS_Store
```

- [ ] **Step 3: Create test harness config**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: { alias: { '@': resolve(__dirname, '.') } },
});
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Create minimal app shell**

`app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`app/layout.tsx`:
```tsx
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Home() {
  return <main>TedTech</main>;
}
```

- [ ] **Step 5: Install and verify build + test run**

Run:
```bash
npm install
npm run build
npm test
```
Expected: `npm install` completes; `npm run build` finishes with "Exporting (static)" and creates `out/`; `npm test` reports "No test files found" (exit 0 — acceptable at this stage). If `npm test` exits non-zero on no-tests, proceed; Task 2 adds the first test.

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js static-export app with Vitest harness"
```
(If `git` is unavailable / not a repo by policy, skip git steps in every task and just save files.)

---

## Task 2: Content module (`lib/content.ts`) + site config

**Files:**
- Create: `lib/site.ts`
- Create: `lib/content.ts`
- Test: `__tests__/content.test.ts`

**Interfaces:**
- Produces:
  - `lib/site.ts` → `export const site = { name: 'TedTech', nav: { modulos: '#modulos', instrutor: '#instrutor', tiraDuvidas: '#tira-duvidas' } }`
  - `lib/content.ts` → `export interface Module { n: string; icon: string; title: string; desc: string }` and `export const content` with fields consumed by every section: `checkoutUrl: string`, `whatsappUrl: string`, `modules: Module[]` (length 6), `instructor`, `offer`, plus copy blocks. All real placeholder strings — no empty values.

- [ ] **Step 1: Write the failing test**

`__tests__/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { content } from '@/lib/content';

describe('content', () => {
  it('has exactly 6 modules with all fields filled', () => {
    expect(content.modules).toHaveLength(6);
    for (const m of content.modules) {
      expect(m.n).toMatch(/^0[1-6]$/);
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.desc.length).toBeGreaterThan(0);
    }
  });

  it('exposes checkout and whatsapp links', () => {
    expect(content.checkoutUrl).toMatch(/^https?:\/\//);
    expect(content.whatsappUrl).toMatch(/^https:\/\/wa\.me\//);
  });

  it('offer has price and access fields', () => {
    expect(content.offer.priceNow).toBeTruthy();
    expect(content.offer.includes.length).toBeGreaterThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/content.test.ts`
Expected: FAIL — cannot resolve `@/lib/content`.

- [ ] **Step 3: Write `lib/site.ts` and `lib/content.ts`**

`lib/site.ts`:
```ts
export const site = {
  name: 'TedTech',
  nav: {
    modulos: '#modulos',
    instrutor: '#instrutor',
    tiraDuvidas: '#tira-duvidas',
  },
} as const;
```

`lib/content.ts`:
```ts
export interface Module {
  n: string;
  icon: string;
  title: string;
  desc: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const content = {
  // ---- Links (PLACEHOLDERS — replace before launch) ----
  checkoutUrl: 'https://checkout.exemplo.com/tedtech', // TODO: link real do checkout
  whatsappUrl: 'https://wa.me/5500000000000', // TODO: número real

  hero: {
    ghost: 'MONTAGEM',
    headlineA: 'Aprenda a formatar, consertar e montar',
    headlineHighlight: 'PCs do zero',
    sub: 'Um curso prático para quem quer cuidar do próprio computador e, se quiser, transformar isso em renda — sem precisar saber nada antes.',
    chips: ['Formatação', 'Manutenção', 'Montagem', 'Sistemas'],
    searchPlaceholder: 'O que você quer aprender primeiro?',
    cta: 'Quero me inscrever',
  },

  dores: {
    label: 'Você se identifica?',
    title: 'Já pensou alguma dessas?',
    sub: 'Se passou pela sua cabeça, você está no lugar certo — é exatamente o que esse curso resolve, do zero.',
    thoughts: [
      { q: 'Será que é vírus ou hora de formatar?', s: '— e o PC só fica mais lento' },
      { q: 'Tenho medo de abrir e quebrar algo.', s: '— aí nunca aprende de verdade' },
      { q: 'De novo pagando técnico por isso?', s: '— por um problema bem simples' },
      { q: 'Será que dá pra ganhar dinheiro com isso?', s: '— dá, e mais fácil do que parece' },
    ],
    turn: 'A boa notícia: tudo isso se aprende — começando do zero.',
  },

  modulos: {
    label: 'O que você vai aprender',
    title: '6 módulos, do básico ao prático',
  },

  modules: [
    { n: '01', icon: '🧠', title: 'Fundamentos do PC', desc: 'Peças, ferramentas e segurança para mexer sem medo.' },
    { n: '02', icon: '🧩', title: 'Montagem', desc: 'Monte um PC do zero: compatibilidade, cabos e primeiro boot.' },
    { n: '03', icon: '💽', title: 'Formatação', desc: 'Backup, formatar do jeito certo, drivers e otimização.' },
    { n: '04', icon: '⊞', title: 'Instalação de Sistemas', desc: 'Windows e Linux, dual boot, drivers e programas essenciais.' },
    { n: '05', icon: '🛠️', title: 'Manutenção', desc: 'Preventiva e corretiva: limpeza, pasta térmica, troca de peças.' },
    { n: '06', icon: '💼', title: 'Diagnóstico & 1ºs clientes', desc: 'Achar defeitos por sintoma e, se quiser, precificar e atender.' },
  ] as Module[],

  evolucao: {
    label: 'Sua evolução',
    title: 'Do zero ao avançado',
    gaugeValue: '100%',
    gaugeCaption: 'prático — você faz junto',
    steps: [
      { k: 'Começo', t: 'Do zero', s: 'Iniciante' },
      { k: 'Meio', t: 'Faz sozinho', s: 'Confiante' },
      { k: 'Fim', t: 'Pronto pra cobrar', s: 'Renda extra / negócio próprio' },
    ],
  },

  instrutor: {
    label: 'Quem ensina',
    name: 'Nome do Instrutor', // TODO
    role: 'Técnico em manutenção · X anos de experiência', // TODO
    bio: 'Apaixonado por computadores, já formou centenas de alunos do absoluto zero. Aqui ele ensina exatamente o passo a passo que usa no dia a dia.', // TODO
    stats: [
      { value: 'X anos', label: 'de experiência' },
      { value: '+X', label: 'PCs montados' },
      { value: '+X', label: 'alunos/clientes' },
    ] as Stat[],
    videoPoster: '/instrutor-poster.jpg', // TODO
    videoSrc: '', // TODO: embed/mp4
  },

  tiraDuvidas: {
    label: 'Tira-dúvidas',
    title: 'Converse com a gente antes de decidir',
    chatTitle: 'TedTech · Atendimento',
    chatStatus: 'online',
    bubbles: [
      { from: 'them', text: 'Oi! Posso te ajudar a escolher? 👋' },
      { from: 'me', text: 'Sou iniciante total, consigo acompanhar?' },
      { from: 'them', text: 'Com certeza — o curso começa do absoluto zero, no seu ritmo.' },
    ],
    inputPlaceholder: 'Digite sua dúvida…',
    cta: 'Continuar no WhatsApp',
  },

  offer: {
    label: 'A oferta',
    title: 'Comece hoje, do zero',
    includesTitle: 'Tudo que você leva',
    includes: [
      '6 módulos completos',
      'Aulas em vídeo no seu ritmo',
      'Acesso vitalício', // TODO: vitalício / 12 meses
      'Certificado de conclusão', // TODO: sim / não
      'Tira-dúvidas no WhatsApp',
      'Atualizações futuras',
    ],
    priceFrom: 'De R$ 497', // TODO
    priceNow: 'R$ 297', // TODO
    installments: 'ou 12x de R$ 29,70', // TODO
    cta: 'Inscrever →',
    payments: 'Pix · Cartão · Boleto',
  },

  ctaFinal: {
    title: 'Pronto pra começar do zero?',
    sub: 'Entre agora e dê o primeiro passo para dominar o seu computador.',
    cta: 'Quero me inscrever',
  },

  footer: {
    tagline: 'Curso de manutenção e montagem de PC, do zero.',
    cnpj: 'CNPJ 00.000.000/0000-00', // TODO
    email: 'contato@tedtech.com.br', // TODO
    links: [
      { label: 'Termos', href: '#' },
      { label: 'Privacidade', href: '#' },
    ],
    socials: [
      { label: 'Instagram', href: '#' },
      { label: 'YouTube', href: '#' },
    ],
  },
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/content.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/site.ts lib/content.ts __tests__/content.test.ts
git commit -m "feat: typed content module with 6 modules and placeholders"
```

---

## Task 3: Design tokens, background glows + gauge CSS (`globals.css`)

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx` (wire Inter font)

**Interfaces:**
- Produces: CSS custom properties on `:root`, base `body` styles (dark bg + radial glows), utility classes `.text-grad` (blue text gradient), `.btn-grad` (blue button gradient), `.clean-border` (1px rgba border), `.ghost-word` (giant faint background word), and `.gauge` (conic-gradient donut). These are referenced by component class names in later tasks.

- [ ] **Step 1: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #06080d;
  --bg-soft: #0b0f17;
  --blue: #1e9edb;
  --blue-2: #0f6fb8;
  --blue-deep: #0f2a51;
  --text: #eef2f7;
  --muted: #8a97a8;
  --wa: #25d366;
}

@layer base {
  body {
    color: var(--text);
    background:
      radial-gradient(740px 420px at 15% 0%, rgba(30, 158, 219, 0.12), transparent 60%),
      radial-gradient(700px 460px at 100% 40%, rgba(15, 42, 81, 0.2), transparent 60%),
      var(--bg);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: rgba(30, 158, 219, 0.3); }
  :focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
}

@layer components {
  .text-grad {
    background: linear-gradient(90deg, var(--blue), #7fd0f5);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .btn-grad {
    background: linear-gradient(180deg, var(--blue), var(--blue-2));
    color: #fff;
  }
  .clean-border {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.015);
  }
  .ghost-word {
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #fff;
    opacity: 0.03;
    line-height: 0.9;
    user-select: none;
    pointer-events: none;
  }
  /* CSS-only conic gauge; --val is 0..100 */
  .gauge {
    --val: 100;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background:
      conic-gradient(var(--blue) calc(var(--val) * 1%), rgba(255, 255, 255, 0.06) 0);
  }
  .gauge::before {
    content: '';
    position: absolute;
    width: 152px;
    height: 152px;
    border-radius: 50%;
    background: var(--bg);
  }
  .gauge > * { position: relative; }
}
```

- [ ] **Step 2: Wire Inter font in `app/layout.tsx`**

```tsx
import './globals.css';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build still succeeds**

Run: `npm run build`
Expected: PASS — static export to `out/`, no CSS errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: design tokens, background glows, gauge and Inter font"
```

---

## Task 4: UI primitives — Button, SectionLabel, Logo

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/SectionLabel.tsx`, `components/ui/Logo.tsx`
- Test: `__tests__/ui.test.tsx`

**Interfaces:**
- Produces:
  - `Button({ href, variant, children })` where `variant: 'primary' | 'whatsapp'`; renders an `<a>` with `href`, gradient (primary) or green (whatsapp) classes, min touch height.
  - `SectionLabel({ children })` → plain colored uppercase text (no pill).
  - `Logo()` → `Ted` + gradient `TECH`.

- [ ] **Step 1: Write the failing test**

`__tests__/ui.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Logo } from '@/components/ui/Logo';

describe('ui primitives', () => {
  it('primary button links to href with gradient class', () => {
    render(<Button href="https://x.test" variant="primary">Quero</Button>);
    const a = screen.getByRole('link', { name: 'Quero' });
    expect(a).toHaveAttribute('href', 'https://x.test');
    expect(a.className).toContain('btn-grad');
  });

  it('whatsapp button uses green styling', () => {
    render(<Button href="https://wa.me/1" variant="whatsapp">Zap</Button>);
    expect(screen.getByRole('link', { name: 'Zap' }).className).toContain('bg-wa');
  });

  it('section label has no pill background', () => {
    render(<SectionLabel>Você se identifica?</SectionLabel>);
    const el = screen.getByText('Você se identifica?');
    expect(el.className).not.toContain('rounded-full');
  });

  it('logo renders the brand', () => {
    render(<Logo />);
    expect(screen.getByText('TECH')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/ui.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the primitives**

`components/ui/Button.tsx`:
```tsx
import type { ReactNode } from 'react';

type Variant = 'primary' | 'whatsapp';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-6 min-h-[44px] font-bold text-[15px] transition hover:-translate-y-0.5';

export function Button({
  href,
  variant = 'primary',
  children,
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
}) {
  const style =
    variant === 'whatsapp' ? 'bg-wa text-black' : 'btn-grad shadow-lg shadow-blue/20';
  return (
    <a href={href} className={`${base} ${style}`}>
      {children}
    </a>
  );
}
```

`components/ui/SectionLabel.tsx`:
```tsx
import type { ReactNode } from 'react';

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-[11px] font-bold uppercase tracking-[1.6px] text-blue">
      {children}
    </span>
  );
}
```

`components/ui/Logo.tsx`:
```tsx
export function Logo() {
  return (
    <span className="text-[18px] font-extrabold">
      Ted<b className="text-grad font-extrabold">TECH</b>
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/ui.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui __tests__/ui.test.tsx
git commit -m "feat: Button, SectionLabel and Logo primitives"
```

---

## Task 5: S1 Header (fixed, transparent)

**Files:**
- Create: `components/sections/Header.tsx`
- Test: `__tests__/sections/header.test.tsx`

Port from: `17-modulos6-header-footer.html` (header portion).

**Interfaces:**
- Consumes: `Logo`, `Button` (Task 4), `site.nav` (Task 2), `content.checkoutUrl`.
- Produces: `<Header/>` — fixed top bar, transparent, with nav anchors and primary CTA.

- [ ] **Step 1: Write the failing test**

`__tests__/sections/header.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/sections/Header';
import { content } from '@/lib/content';

describe('Header', () => {
  it('renders nav and a CTA to checkout', () => {
    render(<Header />);
    expect(screen.getByText('Módulos')).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: content.hero.cta });
    expect(cta).toHaveAttribute('href', content.checkoutUrl);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/header.test.tsx`
Expected: FAIL — `@/components/sections/Header` not found.

- [ ] **Step 3: Implement `components/sections/Header.tsx`**

```tsx
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/site';
import { content } from '@/lib/content';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <a href={site.nav.modulos} className="hover:text-text">Módulos</a>
          <a href={site.nav.instrutor} className="hover:text-text">Quem ensina</a>
          <a href={site.nav.tiraDuvidas} className="hover:text-text">Tira-dúvidas</a>
        </nav>
        <Button href={content.checkoutUrl} variant="primary">
          {content.hero.cta}
        </Button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/header.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Header.tsx __tests__/sections/header.test.tsx
git commit -m "feat: S1 fixed transparent header"
```

---

## Task 6: S2 Hero (centered ★)

**Files:**
- Create: `components/sections/Hero.tsx`
- Test: `__tests__/sections/hero.test.tsx`

Port from: `03-hero.html` (Option A, centered).

**Interfaces:**
- Consumes: `Button`, `content.hero`.
- Produces: `<Hero/>` — centered headline with gradient highlight, subtitle, decorative search field + chips, primary CTA, ghost word behind.

- [ ] **Step 1: Write the failing test**

`__tests__/sections/hero.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { content } from '@/lib/content';

describe('Hero', () => {
  it('renders the highlighted headline and all chips', () => {
    render(<Hero />);
    expect(screen.getByText(content.hero.headlineHighlight)).toBeInTheDocument();
    for (const chip of content.hero.chips) {
      expect(screen.getByText(chip)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/hero.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `components/sections/Hero.tsx`**

```tsx
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

export function Hero() {
  const h = content.hero;
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-36 text-center">
      <span className="ghost-word pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 text-[22vw] md:text-[16vw]">
        {h.ghost}
      </span>
      <div className="relative mx-auto max-w-content">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
          {h.headlineA} <span className="text-grad">{h.headlineHighlight}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted">{h.sub}</p>

        <div className="clean-border mx-auto mt-9 flex max-w-lg items-center gap-2 rounded-2xl px-4 py-3">
          <span className="text-muted">🔎</span>
          <span className="flex-1 text-left text-sm text-muted">{h.searchPlaceholder}</span>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {h.chips.map((c) => (
            <span key={c} className="clean-border rounded-full px-3 py-1 text-xs text-text">
              {c}
            </span>
          ))}
        </div>

        <div className="mt-9 flex justify-center">
          <Button href={content.checkoutUrl} variant="primary">{h.cta}</Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/hero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx __tests__/sections/hero.test.tsx
git commit -m "feat: S2 centered hero"
```

---

## Task 7: S3 Identificação (quotes, borderless)

**Files:**
- Create: `components/sections/Identificacao.tsx`
- Test: `__tests__/sections/identificacao.test.tsx`

Port from: `21-dores-B.html` (Option B, plain label, no card bg/border).

**Interfaces:**
- Consumes: `SectionLabel`, `content.dores`.
- Produces: `<Identificacao/>` — plain label, headline, 2×2 quote grid (no cards), closing turn line.

- [ ] **Step 1: Write the failing test**

`__tests__/sections/identificacao.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Identificacao } from '@/components/sections/Identificacao';
import { content } from '@/lib/content';

describe('Identificacao', () => {
  it('renders label, all four thoughts and the turn line', () => {
    render(<Identificacao />);
    expect(screen.getByText(content.dores.label)).toBeInTheDocument();
    for (const t of content.dores.thoughts) {
      expect(screen.getByText(t.q)).toBeInTheDocument();
    }
    expect(screen.getByText(content.dores.turn)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/identificacao.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `components/sections/Identificacao.tsx`**

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { content } from '@/lib/content';

export function Identificacao() {
  const d = content.dores;
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-content">
        <SectionLabel>{d.label}</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{d.title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{d.sub}</p>

        <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2">
          {d.thoughts.map((t) => (
            <div key={t.q} className="relative pl-5">
              <span className="absolute -left-1 -top-3 text-4xl leading-none text-blue/60">“</span>
              <p className="text-[15px] italic leading-snug text-[#dbe3ec]">{t.q}</p>
              <small className="mt-2 block text-xs not-italic text-muted">{t.s}</small>
            </div>
          ))}
        </div>

        <p className="mt-9 font-semibold text-[#cfe7f5]">
          {content.dores.turn}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/identificacao.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Identificacao.tsx __tests__/sections/identificacao.test.tsx
git commit -m "feat: S3 identificacao quotes block"
```

---

## Task 8: S4 Módulos (6, clean grid ★)

**Files:**
- Create: `components/sections/Modulos.tsx`
- Test: `__tests__/sections/modulos.test.tsx`

Port from: `18-modulos6-opcoes.html` (Option A, clean grid, no card).

**Interfaces:**
- Consumes: `SectionLabel`, `content.modulos`, `content.modules`.
- Produces: `<Modulos/>` with `id="modulos"` anchor; 3×2 borderless grid.

- [ ] **Step 1: Write the failing test**

`__tests__/sections/modulos.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Modulos } from '@/components/sections/Modulos';
import { content } from '@/lib/content';

describe('Modulos', () => {
  it('has the modulos anchor and renders all 6 module titles', () => {
    const { container } = render(<Modulos />);
    expect(container.querySelector('#modulos')).not.toBeNull();
    for (const m of content.modules) {
      expect(screen.getByText(m.title)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/modulos.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `components/sections/Modulos.tsx`**

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { content } from '@/lib/content';

export function Modulos() {
  return (
    <section id="modulos" className="px-5 py-20">
      <div className="mx-auto max-w-content">
        <SectionLabel>{content.modulos.label}</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
          {content.modulos.title}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {content.modules.map((m) => (
            <div key={m.n}>
              <div className="mb-2 text-[11px] font-extrabold tracking-wide text-[#3f4d60]">
                MÓDULO {m.n}
              </div>
              <div
                className="mb-3 grid h-12 w-12 place-items-center rounded-xl text-xl"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(30,158,219,.2), rgba(15,111,184,.08))',
                }}
                aria-hidden
              >
                {m.icon}
              </div>
              <h3 className="text-base font-semibold">{m.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/modulos.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Modulos.tsx __tests__/sections/modulos.test.tsx
git commit -m "feat: S4 six-module clean grid"
```

---

## Task 9: S5 Evolução (gauge + 3 steps ★)

**Files:**
- Create: `components/sections/Evolucao.tsx`
- Test: `__tests__/sections/evolucao.test.tsx`

Port from: `06-evolucao-v2.html` (no card bg/border).

**Interfaces:**
- Consumes: `SectionLabel`, `content.evolucao`, the `.gauge` CSS (Task 3).
- Produces: `<Evolucao/>` — borderless panel, gauge left, 3-step journey right.

- [ ] **Step 1: Write the failing test**

`__tests__/sections/evolucao.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Evolucao } from '@/components/sections/Evolucao';
import { content } from '@/lib/content';

describe('Evolucao', () => {
  it('renders the gauge value and all three steps', () => {
    render(<Evolucao />);
    expect(screen.getByText(content.evolucao.gaugeValue)).toBeInTheDocument();
    for (const s of content.evolucao.steps) {
      expect(screen.getByText(s.t)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/evolucao.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `components/sections/Evolucao.tsx`**

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { content } from '@/lib/content';

export function Evolucao() {
  const e = content.evolucao;
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-2">
        <div className="flex justify-center">
          <div className="gauge relative" style={{ ['--val' as string]: 100 }}>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-grad">{e.gaugeValue}</div>
              <div className="mt-1 text-xs text-muted">{e.gaugeCaption}</div>
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>{e.label}</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{e.title}</h2>
          <ol className="mt-7 space-y-6">
            {e.steps.map((s, i) => (
              <li key={s.k} className="relative pl-8">
                <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full btn-grad text-xs font-bold">
                  {i + 1}
                </span>
                {i < e.steps.length - 1 && (
                  <span className="absolute left-[11px] top-6 h-full w-px bg-white/10" aria-hidden />
                )}
                <div className="text-xs uppercase tracking-wide text-muted">{s.k}</div>
                <div className="text-base font-semibold">{s.t}</div>
                <div className="text-sm text-blue">{s.s}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/evolucao.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Evolucao.tsx __tests__/sections/evolucao.test.tsx
git commit -m "feat: S5 gauge + 3-step journey"
```

---

## Task 10: S6 Instrutor (centered, video at bottom)

**Files:**
- Create: `components/sections/Instrutor.tsx`
- Test: `__tests__/sections/instrutor.test.tsx`

Port from: `10-instrutor-video.html` (centered/cinematic merge, stats borderless, video at bottom).

**Interfaces:**
- Consumes: `SectionLabel`, `content.instrutor`.
- Produces: `<Instrutor/>` with `id="instrutor"`; centered label→name→role→bio→3 stats (vertical dividers, no bg/border)→16:9 video player placeholder at the bottom.

- [ ] **Step 1: Write the failing test**

`__tests__/sections/instrutor.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Instrutor } from '@/components/sections/Instrutor';
import { content } from '@/lib/content';

describe('Instrutor', () => {
  it('renders the instructor name, all stats and a video region at the bottom', () => {
    const { container } = render(<Instrutor />);
    expect(container.querySelector('#instrutor')).not.toBeNull();
    expect(screen.getByText(content.instrutor.name)).toBeInTheDocument();
    for (const s of content.instrutor.stats) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
    }
    expect(container.querySelector('[data-video]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/instrutor.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `components/sections/Instrutor.tsx`**

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { content } from '@/lib/content';

export function Instrutor() {
  const i = content.instrutor;
  return (
    <section
      id="instrutor"
      className="relative overflow-hidden px-5 py-24"
      style={{
        background:
          'radial-gradient(700px 400px at 50% 0%, rgba(30,158,219,.1), transparent 60%)',
      }}
    >
      <div className="mx-auto max-w-content text-center">
        <SectionLabel>{i.label}</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{i.name}</h2>
        <p className="mt-2 text-sm text-blue">{i.role}</p>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted">{i.bio}</p>

        <div className="mx-auto mt-9 flex max-w-lg justify-center divide-x divide-white/10">
          {i.stats.map((s) => (
            <div key={s.label} className="px-6">
              <div className="text-2xl font-extrabold text-grad">{s.value}</div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        <div
          data-video
          className="clean-border mx-auto mt-12 grid aspect-video max-w-2xl place-items-center rounded-2xl"
        >
          <button
            type="button"
            aria-label="Assistir apresentação do instrutor"
            className="grid h-16 w-16 place-items-center rounded-full btn-grad text-2xl"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
```

(When the real embed is available, replace the placeholder `div[data-video]` inner with an `<iframe>`/`<video poster={i.videoPoster} src={i.videoSrc}>`.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/instrutor.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Instrutor.tsx __tests__/sections/instrutor.test.tsx
git commit -m "feat: S6 instructor section with video at bottom"
```

---

## Task 11: S7 Tira-dúvidas (chat → WhatsApp ★)

**Files:**
- Create: `components/sections/TiraDuvidas.tsx`
- Test: `__tests__/sections/tira-duvidas.test.tsx`

Port from: `14-tira-duvidas-B2.html` (Option B, light clean border, WhatsApp green CTA).

**Interfaces:**
- Consumes: `SectionLabel`, `Button` (whatsapp variant), `content.tiraDuvidas`, `content.whatsappUrl`.
- Produces: `<TiraDuvidas/>` with `id="tira-duvidas"`; chat window with clean border, example bubbles, WhatsApp CTA.

- [ ] **Step 1: Write the failing test**

`__tests__/sections/tira-duvidas.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TiraDuvidas } from '@/components/sections/TiraDuvidas';
import { content } from '@/lib/content';

describe('TiraDuvidas', () => {
  it('renders the chat bubbles and a WhatsApp CTA to the configured link', () => {
    const { container } = render(<TiraDuvidas />);
    expect(container.querySelector('#tira-duvidas')).not.toBeNull();
    expect(screen.getByText(content.tiraDuvidas.bubbles[0].text)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: content.tiraDuvidas.cta });
    expect(cta).toHaveAttribute('href', content.whatsappUrl);
    expect(cta.className).toContain('bg-wa');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/tira-duvidas.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `components/sections/TiraDuvidas.tsx`**

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

export function TiraDuvidas() {
  const t = content.tiraDuvidas;
  return (
    <section id="tira-duvidas" className="px-5 py-20">
      <div className="mx-auto max-w-content text-center">
        <SectionLabel>{t.label}</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.title}</h2>

        <div className="clean-border mx-auto mt-9 max-w-md overflow-hidden rounded-2xl text-left">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-wa" aria-hidden />
            <span className="text-sm font-semibold">{t.chatTitle}</span>
            <span className="ml-auto text-xs text-muted">{t.chatStatus}</span>
          </div>
          <div className="space-y-3 px-4 py-5">
            {t.bubbles.map((b, idx) => (
              <div
                key={idx}
                className={b.from === 'me' ? 'flex justify-end' : 'flex justify-start'}
              >
                <span
                  className={
                    b.from === 'me'
                      ? 'btn-grad max-w-[80%] rounded-2xl px-3 py-2 text-sm'
                      : 'max-w-[80%] rounded-2xl bg-white/5 px-3 py-2 text-sm text-text'
                  }
                >
                  {b.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-sm text-muted">
            {t.inputPlaceholder}
          </div>
        </div>

        <div className="mt-7 flex justify-center">
          <Button href={content.whatsappUrl} variant="whatsapp">{t.cta}</Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/tira-duvidas.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/TiraDuvidas.tsx __tests__/sections/tira-duvidas.test.tsx
git commit -m "feat: S7 tira-duvidas chat with WhatsApp CTA"
```

---

## Task 12: S8 Oferta (two-column → checkout)

**Files:**
- Create: `components/sections/Oferta.tsx`
- Test: `__tests__/sections/oferta.test.tsx`

Port from: `16-oferta-opcoes.html` (Option A, two columns, light clean border).

**Interfaces:**
- Consumes: `SectionLabel`, `Button` (primary), `content.offer`, `content.checkoutUrl`.
- Produces: `<Oferta/>` with `id="oferta"`; left = includes list; right (divider) = price + CTA + payments.

- [ ] **Step 1: Write the failing test**

`__tests__/sections/oferta.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Oferta } from '@/components/sections/Oferta';
import { content } from '@/lib/content';

describe('Oferta', () => {
  it('renders price, all includes and a CTA to checkout', () => {
    render(<Oferta />);
    expect(screen.getByText(content.offer.priceNow)).toBeInTheDocument();
    for (const item of content.offer.includes) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    const cta = screen.getByRole('link', { name: content.offer.cta });
    expect(cta).toHaveAttribute('href', content.checkoutUrl);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/oferta.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `components/sections/Oferta.tsx`**

```tsx
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

export function Oferta() {
  const o = content.offer;
  return (
    <section id="oferta" className="px-5 py-20">
      <div className="mx-auto max-w-content text-center">
        <SectionLabel>{o.label}</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{o.title}</h2>

        <div className="clean-border mx-auto mt-10 grid max-w-3xl overflow-hidden rounded-3xl text-left md:grid-cols-2">
          <div className="p-8">
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted">
              {o.includesTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {o.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px]">
                  <span className="text-blue" aria-hidden>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center border-t border-white/10 p-8 text-center md:border-l md:border-t-0">
            <div className="text-sm text-muted line-through">{o.priceFrom}</div>
            <div className="mt-1 text-4xl font-extrabold text-grad">{o.priceNow}</div>
            <div className="mt-1 text-sm text-muted">{o.installments}</div>
            <div className="mt-6 flex justify-center">
              <Button href={content.checkoutUrl} variant="primary">{o.cta}</Button>
            </div>
            <div className="mt-4 text-xs text-muted">{o.payments}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/oferta.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Oferta.tsx __tests__/sections/oferta.test.tsx
git commit -m "feat: S8 two-column offer with checkout CTA"
```

---

## Task 13: S9 CTA final + Footer

**Files:**
- Create: `components/sections/CtaFinal.tsx`, `components/sections/Footer.tsx`
- Test: `__tests__/sections/cta-footer.test.tsx`

Port from: `17-modulos6-header-footer.html` (footer portion) + final CTA band.

**Interfaces:**
- Consumes: `Logo`, `Button`, `content.ctaFinal`, `content.footer`, `content.checkoutUrl`.
- Produces: `<CtaFinal/>` (glow band, no box, checkout CTA) and `<Footer/>` (transparent: logo, cnpj/email/links, socials).

- [ ] **Step 1: Write the failing test**

`__tests__/sections/cta-footer.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CtaFinal } from '@/components/sections/CtaFinal';
import { Footer } from '@/components/sections/Footer';
import { content } from '@/lib/content';

describe('CtaFinal + Footer', () => {
  it('CTA final links to checkout', () => {
    render(<CtaFinal />);
    expect(screen.getByText(content.ctaFinal.title)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: content.ctaFinal.cta }),
    ).toHaveAttribute('href', content.checkoutUrl);
  });

  it('footer shows cnpj and tagline', () => {
    render(<Footer />);
    expect(screen.getByText(content.footer.cnpj)).toBeInTheDocument();
    expect(screen.getByText(content.footer.tagline)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/sections/cta-footer.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement both components**

`components/sections/CtaFinal.tsx`:
```tsx
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

export function CtaFinal() {
  const c = content.ctaFinal;
  return (
    <section
      className="px-5 py-24 text-center"
      style={{
        background:
          'radial-gradient(600px 300px at 50% 50%, rgba(30,158,219,.14), transparent 65%)',
      }}
    >
      <div className="mx-auto max-w-content">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">{c.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] text-muted">{c.sub}</p>
        <div className="mt-8 flex justify-center">
          <Button href={content.checkoutUrl} variant="primary">{c.cta}</Button>
        </div>
      </div>
    </section>
  );
}
```

`components/sections/Footer.tsx`:
```tsx
import { Logo } from '@/components/ui/Logo';
import { content } from '@/lib/content';

export function Footer() {
  const f = content.footer;
  return (
    <footer className="border-t border-white/5 px-5 py-12">
      <div className="mx-auto flex max-w-content flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-xs text-muted">{f.tagline}</p>
        </div>
        <div className="text-xs text-muted">
          <div>{f.cnpj}</div>
          <div className="mt-1">{f.email}</div>
          <div className="mt-3 flex gap-4">
            {f.links.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-text">{l.label}</a>
            ))}
            {f.socials.map((s) => (
              <a key={s.label} href={s.href} className="hover:text-text">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/sections/cta-footer.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/CtaFinal.tsx components/sections/Footer.tsx __tests__/sections/cta-footer.test.tsx
git commit -m "feat: S9 final CTA band and footer"
```

---

## Task 14: Page composition + metadata/OG + full build

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx` (metadata + OG)
- Test: `__tests__/page.test.tsx`

**Interfaces:**
- Consumes: all ten section components.
- Produces: the assembled `/` page in the spec's order and SEO metadata.

- [ ] **Step 1: Write the failing test**

`__tests__/page.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { content } from '@/lib/content';

describe('Home page', () => {
  it('renders hero headline, modules anchor and offer price together', () => {
    const { container } = render(<Home />);
    expect(screen.getByText(content.hero.headlineHighlight)).toBeInTheDocument();
    expect(container.querySelector('#modulos')).not.toBeNull();
    expect(container.querySelector('#tira-duvidas')).not.toBeNull();
    expect(screen.getByText(content.offer.priceNow)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/page.test.tsx`
Expected: FAIL — `app/page.tsx` still renders the placeholder.

- [ ] **Step 3: Compose `app/page.tsx`**

```tsx
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Identificacao } from '@/components/sections/Identificacao';
import { Modulos } from '@/components/sections/Modulos';
import { Evolucao } from '@/components/sections/Evolucao';
import { Instrutor } from '@/components/sections/Instrutor';
import { TiraDuvidas } from '@/components/sections/TiraDuvidas';
import { Oferta } from '@/components/sections/Oferta';
import { CtaFinal } from '@/components/sections/CtaFinal';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Identificacao />
        <Modulos />
        <Evolucao />
        <Instrutor />
        <TiraDuvidas />
        <Oferta />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Add metadata + OG to `app/layout.tsx`**

Add above the component (keep the existing font wiring):
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TedTech — Curso de Manutenção e Montagem de PC do Zero',
  description:
    'Aprenda a formatar, consertar e montar computadores do zero. Curso prático para uso próprio e para abrir seu negócio.',
  openGraph: {
    title: 'TedTech — Curso de Manutenção e Montagem de PC',
    description:
      'Do zero ao avançado: formatação, manutenção, montagem e sistemas operacionais.',
    type: 'website',
    locale: 'pt_BR',
    images: ['/og.jpg'], // TODO: criar imagem OG
  },
};
```

- [ ] **Step 5: Run page test + full build + full test suite**

Run:
```bash
npx vitest run __tests__/page.test.tsx
npm test
npm run build
```
Expected: page test PASS; full suite PASS (all section tests + content + ui); `npm run build` completes static export to `out/` with no type errors.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/layout.tsx __tests__/page.test.tsx
git commit -m "feat: compose landing page and add SEO/OG metadata"
```

---

## Task 15: Responsive + accessibility pass + production export verification

**Files:**
- Modify: any section needing responsive/a11y fixes found during review (no new files expected).

**Interfaces:**
- Produces: a verified, exported `out/` ready to host; documented manual checks.

- [ ] **Step 1: Build and serve the static export**

Run:
```bash
npm run build
npx serve out
```
Expected: site served (default `http://localhost:3000`). Open it.

- [ ] **Step 2: Manual responsive check (record results in the commit message)**

Verify at 360px, 768px and 1280px widths:
- Header nav hides on mobile (CTA stays visible); no horizontal scroll.
- Hero ghost word does not overflow viewport; headline wraps cleanly.
- Módulos grid: 1 col (mobile) → 2 → 3 (desktop).
- Evolução: gauge stacks above steps on mobile.
- Oferta: two columns stack to one on mobile, divider becomes top border.
Fix any breakage in the offending section's Tailwind classes, then re-run `npm run build`.

- [ ] **Step 3: Accessibility spot-check**

- Keyboard-tab through the page: every CTA/nav link shows the blue focus ring (`:focus-visible` from Task 3).
- Confirm the instructor play button has `aria-label` and the offer check marks are `aria-hidden`.
- Confirm color contrast of `--muted #8A97A8` on `--bg #06080D` for body-secondary text (passes AA for ≥14px). If any small muted text fails, bump to `#A6B2C2`.

- [ ] **Step 4: Final full verification**

Run:
```bash
npm test
npm run build
```
Expected: all tests PASS; clean static export. Confirm `out/index.html` exists and contains the headline text.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: responsive + a11y pass; verified static export"
```

---

## Self-Review (completed by plan author)

**1. Spec coverage** — every spec section maps to a task:
- S1 Header → Task 5 · S2 Hero → Task 6 · S3 Identificação → Task 7 · S4 Módulos (6) → Task 8 · S5 Evolução gauge → Task 9 · S6 Instrutor (video bottom) → Task 10 · S7 Tira-dúvidas → Task 11 · S8 Oferta → Task 12 · S9 CTA+Footer → Task 13.
- Stack/static export → Task 1 · Palette/tokens/gauge/glows → Task 3 · Borderless-card + clean-border + plain labels → enforced in Global Constraints and each component (`.clean-border` only where the spec allows). · Content placeholders → Task 2 · SEO/OG → Task 14 · Responsive/a11y → Task 15.
- Out-of-scope sections (credibility bar, "pra quem é", bonus, testimonials, guarantee, FAQ) are intentionally absent.

**2. Placeholder scan** — the only `TODO` markers are inside `lib/content.ts` data values (real strings with a clear "replace before launch" note), which is the spec's explicit "build with placeholders, fill later" requirement — not plan-step placeholders. No step says "implement later" / "add error handling" / "write tests for the above"; every code step ships complete code.

**3. Type consistency** — `Module`, `Stat` interfaces defined in Task 2 are consumed unchanged in Tasks 8/10. `Button` props (`href`, `variant: 'primary'|'whatsapp'`) defined in Task 4 are used identically everywhere. `content.*` field names referenced by tests and components match the Task 2 definitions exactly. Anchor ids (`#modulos`, `#instrutor`, `#tira-duvidas`, `#oferta`) match `site.nav` and section `id`s.

---

## Notes
- The folder is **not a git repository**. Either run the `git init` in Task 1 Step 6 (recommended; add `.superpowers/` to `.gitignore` too) or skip all `git` steps and rely on saved files + the per-task verification gates.
- Approved mockups (visual source of truth) live in `.superpowers/brainstorm/1825-1782483299/content/`; each section task names the exact file to port.
