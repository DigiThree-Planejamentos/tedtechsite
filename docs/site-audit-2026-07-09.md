# Auditoria do site TedTech - 2026-07-09

## Estado atual

Aplicação Next.js 14 com App Router, TypeScript, Tailwind, Vitest, GSAP, Lenis e canvas decorativo. O projeto está configurado para export estático via `output: 'export'` em `next.config.mjs`.

Preview local usado na auditoria: `http://localhost:3010`.

## Correções aplicadas nesta auditoria

- Corrigido corte do descendente do `g` no título do hero:
  - `components/sections/Hero.tsx`: `h1` passou de `leading-[1.02]` para `leading-[1.08]`.
  - `app/globals.css`: adicionada folga em `.split-line` para linhas mascaradas pelo GSAP SplitText.
- Corrigido overflow horizontal em mobile/tablet:
  - Containers internos de seções `flex` receberam `w-full` junto de `max-w-content`.
  - Antes: full-page mobile saía com `1114px` de largura e tablet com `1220px`.
  - Depois: mobile voltou para `390px` e tablet para `768px`.

Arquivos ajustados:

- `app/globals.css`
- `components/sections/Hero.tsx`
- `components/sections/Modulos.tsx`
- `components/sections/Evolucao.tsx`
- `components/sections/Instrutor.tsx`
- `components/sections/TiraDuvidas.tsx`
- `components/sections/Oferta.tsx`
- `components/sections/CtaFinal.tsx`

## Verificações executadas

- `npm test`: passou, 13 arquivos e 37 testes.
- `npx tsc --noEmit`: passou.
- `npm run build`: passou, gerando export estático em `out/`.
- Playwright screenshots:
  - `tmp/audit-before-desktop.png`
  - `tmp/audit-before-mobile.png`
  - `tmp/audit-after-desktop.png`
  - `tmp/audit-after-mobile.png`
  - `tmp/audit-full-mobile-after-overflow.png`
  - `tmp/audit-full-tablet-after-overflow.png`
  - `tmp/audit-section-modulos-mobile.png`
  - `tmp/audit-section-oferta-mobile.png`

## Arquitetura observada

- `app/page.tsx` compõe a landing em seções: Header, Hero, Modulos, Evolucao, Instrutor, TiraDuvidas, Oferta, CtaFinal e Footer.
- `lib/content.ts` centraliza copy, links, preço, módulos, instrutor e footer. Este é o melhor ponto para trocar conteúdo sem mexer em JSX.
- `components/providers/AppProviders.tsx` concentra a camada client global:
  - preloader,
  - smooth scroll com Lenis,
  - canvas de circuitos,
  - cursor customizado,
  - contexto `ready` para disparar reveals acima da dobra.
- A camada de motion está espalhada em componentes reutilizáveis (`SplitReveal`, `Reveal`, `CountUp`, `GaugeRing`, `MagneticButton`, etc.).

## Pontos fortes

- Boa separação entre conteúdo (`lib/content.ts`) e seções.
- Testes de smoke cobrem todas as seções e invariantes de conteúdo.
- Build estático funcionando.
- Visual acima da dobra está consistente em desktop e mobile após correção.
- Canvas decorativo é carregado como componente client dinâmico e não quebra SSR.

## Riscos para grandes mudanças

- O hero atual não segue mais o spec original de venda direta do curso. Ele usa a seção de dores como primeira dobra (`Já pensou alguma dessas?`). Para conversão, vale decidir se isso é intencional ou se o hero deve voltar a comunicar o produto/oferta primeiro.
- Há muita lógica client global para uma landing: Lenis, GSAP, SplitText, preloader, canvas, cursor custom e CountUp. Isso dá sofisticação, mas aumenta risco de regressão visual e custo de manutenção.
- As animações de scroll deixam conteúdo invisível em screenshots full-page tirados do topo. Isso não é necessariamente bug para usuário, mas dificulta QA automatizado e pode mascarar problemas.
- `Modulos` virou carrossel de um card por vez. O spec original indicava grid limpo 3x2. Para venda, grid tende a expor melhor o conteúdo; carrossel exige interação.
- `Evolucao` não tem `id`, então não é endereçável por âncora. Não é crítico, mas limita navegação/QA.
- `npm run lint` ainda depende do assistente interativo do Next porque ESLint não está configurado explicitamente.

## Pendências de lançamento

- Substituir placeholders em `lib/content.ts`:
  - checkout real,
  - WhatsApp real,
  - nome/bio/stats do instrutor,
  - preço real,
  - CNPJ/e-mail,
  - links de Termos, Privacidade, Instagram e YouTube.
- Criar pasta `public/` e adicionar assets:
  - `public/og.jpg`,
  - `public/instrutor-poster.jpg`, se o placeholder de vídeo continuar usando poster.
- Revisar `metadataBase` em `app/layout.tsx` com domínio final.
- Configurar ESLint de forma não interativa.

## Recomendações para a próxima fase

1. Definir a estratégia do hero antes de refatorar estética:
   - opção A: hero de venda direta do curso;
   - opção B: hero de identificação/dor, como está;
   - opção C: híbrido, com dor + promessa + produto na mesma dobra.
2. Criar uma matriz de seções obrigatórias para conversão:
   - promessa,
   - dores,
   - módulos,
   - transformação,
   - instrutor/prova,
   - dúvidas,
   - oferta,
   - garantia/depoimentos/FAQ, se o cliente aprovar.
3. Antes de grandes mudanças visuais, simplificar decisões globais:
   - manter ou remover preloader;
   - manter ou remover cursor customizado;
   - manter canvas global ou trocar por asset/efeito mais leve;
   - manter carrossel de módulos ou voltar para grid.
4. Para cada grande mudança, preservar estes gates:
   - `npm test`,
   - `npx tsc --noEmit`,
   - `npm run build`,
   - Playwright em 390, 768 e 1440 px.
