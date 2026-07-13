# Spec: Novo Hero Split (referência GENAI/Behance)

**Data:** 2026-07-13
**Referência visual:** https://www.behance.net/gallery/251598631/Website-Hero-Section (screenshot em `docs/behance-hero-ref.png`)
**Decisões tomadas via brainstorming visual** (mockups aprovados pelo cliente).

## Objetivo

Redesenhar o hero da landing page TedTech como um split 50/50 no modelo da referência:
esquerda com a pergunta-headline e as dores do diagnóstico; direita com o vídeo do
instrutor em altura total, com toda a copy de credibilidade sobreposta ao vídeo.

## Decisões aprovadas

1. **Esquerda — perguntas como lista de citações** (opção A do mockup `left-questions`)
2. **Direita — vídeo full-height, copy toda na base sobre overlay escuro leve** (opção A do mockup `right-video-v2`)
3. **Moldura — fundo aberto atual do site com circuit field** (opção B do mockup `hero-frame`); nenhum painel de gradiente novo
4. **Frase de virada fica, stats e mini-cards saem**
5. **Copy do instrutor com placeholders TODO** (nome, anos, certificação a definir)
6. Seções duplicadas: `Identificacao` (já órfã) é deletada; vídeo sai da seção `Instrutor`

## 1. `components/sections/Hero.tsx`

Grid 2 colunas `md:grid-cols-[1.05fr_0.95fr]`, `min-h-[calc(100svh-12rem)]` mantido.
Fundo da seção inalterado (circuit field global continua atrás).

### Coluna esquerda

- Pill de label `dores.label` ("Você se identifica?") — mantido como está
- H1 `dores.title` ("Já pensou alguma dessas?") com `SplitReveal` — mantido como está
- **Substitui o subtítulo:** lista vertical das 4 perguntas de `dores.thoughts`, cada item:
  - barra azul à esquerda (`border-l` na cor blue do tema)
  - pergunta `q` em itálico entre aspas, cor de texto do corpo
  - aside `s` ("— e o PC só fica mais lento") em texto menor/muted logo abaixo
  - animação: `Reveal` com stagger
- Frase de virada `dores.turn` ("A boa notícia: tudo isso se aprende…") em destaque
  semibold fechando a lista
- CTA `hero.cta` ("Quero me inscrever") em `MagneticButton`, estilo atual
- **Removidos:** subtítulo `dores.sub`, faixa de stats (6 módulos / 100% / PC),
  mini-card "0 medo" e card da frase de virada da coluna direita (a frase migra
  para a esquerda)

### Coluna direita

- Painel de vídeo com `height: 100%` da coluna (stretch no grid), cantos `rounded-[1.5rem]`,
  borda azul sutil (mesma linguagem dos dark-panels atuais)
- `<video>` com `poster={instrutor.videoPoster}` e `src={instrutor.videoSrc}`;
  enquanto `videoSrc === ''`, renderiza fundo gradiente escuro placeholder
  (`linear-gradient(145deg, #1a2438, #0b1220)`) sem elemento de vídeo
- Overlay em gradiente por cima: leve no topo (~18% de escurecimento) → escuro na
  base (~88%) para legibilidade da copy
- Botão play (`GlowIconButton` dentro de `MagneticButton`, reaproveitados) centralizado
  horizontalmente, posicionado um pouco acima do meio (~42% do topo)
  - Com `videoSrc` real: clique inicia playback inline e esconde overlay + copy
  - Com `videoSrc` vazio: botão presente, sem ação (comportamento atual da seção Instrutor)
- **Copy na base (empilhada):**
  - label `instrutor.label` ("Quem ensina") — uppercase, tracking largo, azul
  - `instrutor.name` — bold, branco
  - `instrutor.heroQuote` — frase entre aspas, texto claro `#dbe3ec`, leading solto

### Mobile (abaixo de `md`)

Colunas empilham: conteúdo da esquerda primeiro, vídeo abaixo com `aspect-[16/10]`
em vez de altura total.

## 2. `lib/content.ts`

- **Adicionar** `instrutor.heroQuote`:
  `'"[X] anos de mercado, formado em [certificação]. Separei tudo que aprendi nesse tempo nesse curso, direto ao ponto, pra você aprender a consertar de verdade." // TODO: dados reais'`
- **Remover** `dores.sub` (nenhum consumidor após o redesign)
- Demais campos (`dores.thoughts`, `dores.turn`, `instrutor.videoPoster`, `instrutor.videoSrc`)
  permanecem

## 3. `components/sections/Instrutor.tsx`

- Remover o bloco do vídeo (o `Reveal` final com `data-video`, play button)
- Mantém: label, nome, role, bio, grid de 3 stats com `CountUp`

## 4. Limpeza

- Deletar `components/sections/Identificacao.tsx` (órfão — `app/page.tsx` não o renderiza)
- Deletar `__tests__/sections/identificacao.test.tsx`

## 5. Testes

- `__tests__/sections/hero.test.tsx`: atualizar —
  - renderiza as 4 perguntas de `dores.thoughts` e a frase `dores.turn`
  - renderiza label "Quem ensina", nome do instrutor e `heroQuote`
  - não renderiza mais os stats antigos ("6", "módulos", "100%")
- `__tests__/sections/instrutor.test.tsx`: atualizar — sem bloco de vídeo,
  stats/bio continuam

## Fora de escopo

- Header/nav (inalterado)
- Painel de gradiente estilo referência (rejeitado na decisão 3)
- Preenchimento dos TODOs de copy (nome, anos, certificação, vídeo real)
- Qualquer outra seção da página

## Critério de sucesso

- Hero visualmente equivalente ao mockup `hero-frame` opção B em desktop e empilhado no mobile
- `npm test` verde após atualização dos testes
- Nenhuma referência quebrada a `Identificacao` ou `dores.sub`
