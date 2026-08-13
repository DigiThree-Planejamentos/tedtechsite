# Spec: Reestruturação de conversão (hero de produto, confiança na oferta, FAQ)

**Data:** 2026-08-13
**Origem:** auditoria da página publicada (https://tedtechsite.vercel.app/) + pesquisa de
referências de páginas de venda de curso. Três mudanças propostas e aprovadas via brainstorming.
**Histórico:** o spec inicial (`2026-06-26-tedtech-landing-design.md`, seção 8) listou
"Depoimentos, Garantia, FAQ" como *fora de escopo — removido pelo cliente*, anotando que
"Garantia e Depoimentos costumam ajudar conversão; reativáveis sem retrabalho". Este spec
reativa Garantia e FAQ. Depoimentos seguem fora (ver Escopo).

## Problema

A página hoje abre pela dor. O `Hero.tsx` renderiza a seção de dores — `<h1>` é
"Já pensou alguma dessas?" — e em nenhum ponto acima da dobra o visitante lê que isso
é um curso de montagem e manutenção de computadores. Quem chega de tráfego frio
descobre que a TedTech conhece os problemas dele, não o que está à venda.

Somado a isso: nada perto do preço reduz a insegurança da compra, e a seção
"Tira-dúvidas" é uma conversa simulada com bolhas pré-escritas, campo de input inerte e
status "online" — que não responde dúvida nenhuma e sugere um atendimento ao vivo
que não existe.

## Escopo

**Dentro:** as três mudanças abaixo.

**Fora, por decisão explícita do cliente** (registrado aqui porque foi levantado e
recusado, não esquecido):

- Seção de prova social / depoimentos — a página segue sem nenhuma.
- Remoção da animação de count-up do preço no `Oferta.tsx`.
- Substituição dos placeholders (`checkoutUrl` aponta para `https://checkout.exemplo.com/tedtech`,
  `whatsappUrl` para `wa.me/5500000000000`, instrutor como "Nome do Instrutor" / "[X] anos",
  CNPJ e telefone zerados).

Consequência a registrar: enquanto o `checkoutUrl` não for real, **todo CTA desta página
leva a um domínio inexistente** — incluindo os que este spec adiciona.

## Decisões aprovadas

1. **Hero vira apresentação do produto**; as 4 falas de dor migram íntegras para uma
   seção própria imediatamente abaixo (`Dores.tsx`), sem reescrita de copy.
2. **Ordem final da página:** Hero → Dores → Módulos → Evolução → Caminhos → Oferta → FAQ → Footer.
   O FAQ vai **depois** da oferta: o bloco de confiança atende quem está olhando o preço,
   o FAQ atende quem passou por ele sem comprar.
3. **Um arquivo por seção**, seguindo o padrão do projeto (abordagem A frente à
   alternativa de concentrar mudanças nos arquivos existentes).
4. **Acordeão nativo `<details>/<summary>`**, sem estado React.
5. **Campo de conteúdo vazio não renderiza.** As respostas do FAQ e os itens do bloco de
   confiança dependem de confirmações que o cliente ainda não deu; a página omite o que
   está vazio em vez de exibir texto provisório.
6. **Duas respostas do FAQ já saem escritas** (as que não dependem do cliente); as outras
   cinco ficam vazias.
7. **Vídeo do hero permanece como está**, incluindo os placeholders do instrutor
   (fora de escopo).

## 1. `lib/content.ts`

### `hero` — reescrito

Os campos atuais (`headlineWords`, `subLines`) saem; o hero deixa de consumir `content.dores`.

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

Cobre os cinco pontos exigidos da mudança 1: o que é (eyebrow), pra quem (headline + sub),
quantos módulos e que resultados (bullets), CTA destacado.

### `dores` — inalterado

Nenhum campo muda. O `label` ("Você se identifica?"), que existe desde sempre e nunca foi
renderizado, passa a aparecer.

### `offer.trust` — novo

```ts
trust: {
  guarantee: {
    title: 'Garantia de 7 dias',
    desc: 'Se não for pra você, é só pedir o reembolso integral em até 7 dias — direito garantido pelo Código de Defesa do Consumidor.',
  },
  checkout: '', // TODO: confirmar plataforma → ex. 'Compra segura via Kiwify'
  access: '',   // TODO: confirmar liberação e duração do acesso
  payments: 'Pix · Cartão · Boleto', // migra de offer.payments
},
```

`offer.payments` é **removido** do nível de cima (passa a viver em `offer.trust.payments`).

### `faq` — novo

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
    { q: 'Por quanto tempo eu tenho acesso ao curso?',      a: '' }, // TODO
    { q: 'O curso tem certificado?',                        a: '' }, // TODO
    { q: 'Como funciona o acompanhamento?',                 a: '' }, // TODO
    { q: 'Consigo assistir pelo celular?',                  a: '' }, // TODO
    {
      q: 'Como funciona a garantia?',
      a: 'Você tem 7 dias a partir da compra pra pedir o reembolso integral, sem precisar justificar. É o direito de arrependimento previsto no art. 49 do Código de Defesa do Consumidor.',
    },
  ],
  cta: 'Falar no WhatsApp',
  ctaHint: 'Ficou outra dúvida?',
},
```

As duas respostas escritas se sustentam sem o cliente: a de iniciantes decorre do próprio
conteúdo do curso (o módulo 01 é "Fundamentos dos computadores"), e a de garantia decorre
do art. 49 do CDC. As outras cinco são fatos do negócio e ficam vazias.

Uma pergunta a mais que a lista original: **"Preciso ter ferramentas ou um PC pra
desmontar?"** — objeção recorrente em curso de hardware, coberta pela metade na
formulação anterior ("preciso ter ferramentas ou computador?").

### `tiraDuvidas` — removido

Nenhum consumidor após esta mudança.

## 2. `components/sections/Hero.tsx` — reescrito

Grade mantida: `md:grid-cols-[0.85fr_1.15fr]`, `HeroVideo` à direita **sem alteração**.

Coluna esquerda, de cima pra baixo:

- `eyebrow` — uppercase, tracking largo, azul (mesma linguagem do `SectionLabel`)
- `<h1>` com `headline`, usando o `SplitReveal type="lines" trigger="ready"` que já está lá
- `sub` — parágrafo de apoio
- `bullets` — lista com `Reveal stagger`, marcador `✓` no padrão do `Oferta.tsx`
- CTA em `MagneticButton` → `content.checkoutUrl`

Sai daqui: `content.dores.thoughts`, `content.dores.turn` e a headline "Já pensou alguma dessas?".

O `<h1>` passa a nomear o produto. Além do efeito sobre o visitante, hoje o único `<h1>`
da página não diz o que é vendido.

## 3. `components/sections/Dores.tsx` — novo

`id="dores"`, classes de seção no padrão (`site-section section-divider scroll-mt-24`).

- `SectionLabel` com `dores.label`
- `<h2>` com `SplitReveal`, `dores.title`
- as 4 falas de `dores.thoughts` com a marcação atual preservada (borda azul à esquerda,
  `q` em itálico entre aspas, `s` em texto menor abaixo), dentro de `Reveal stagger`
- `dores.turn` fechando

**Layout:** as falas viram grade de 2 colunas em `md+`. Numa seção de largura total,
a coluna única do hero ficaria esticada e rala.

## 4. `components/sections/OfertaTrust.tsx` — novo

Renderizado dentro de `Oferta.tsx`, na coluna do preço, **logo abaixo do botão**.
Absorve o `payments`, que hoje é renderizado solto ali.

Ordem: garantia (título + descrição) → `checkout` → `access` → `payments`.
Cada item com ícone e texto pequeno em cor apagada — o bloco tranquiliza quem já está
olhando o preço, não disputa atenção com ele.

**Itens com string vazia não são renderizados.** Se `guarantee`, `checkout` e `access`
estiverem todos vazios, sobra só `payments` — que nunca é vazio.

## 5. `components/sections/Faq.tsx` — novo

`id="faq"`, dentro do `MainCard`, última seção antes do `Footer`.

- `SectionLabel` + `<h2>` com `SplitReveal`, no padrão das outras seções
- lista de `<details>`, cada um com `<summary>` contendo a pergunta e um chevron
- botão de WhatsApp fechando a seção (`Button variant="whatsapp"` → `content.whatsappUrl`),
  precedido por `ctaHint`

### Por que `<details>` e não estado React

- `<summary>` já é um controle com estado anunciado a leitor de tela e operável por
  teclado, sem `aria-expanded`/`aria-controls` escritos à mão
- a seção continua sendo server component, como todas as outras do projeto
  (só `HeroVideo` tem `'use client'`)
- as perguntas ficam no HTML mesmo sem JS

### Animação

Progressive enhancement por CSS, sem JS. As regras vão em `app/globals.css`, junto das
demais classes utilitárias do projeto (`site-section`, `site-panel`, `site-dark-panel`):

```css
@media (prefers-reduced-motion: no-preference) {
  .faq-item { interpolate-size: allow-keywords; }
  .faq-item::details-content { /* transição de altura/opacidade */ }
}
```

Onde o navegador suporta, abre suave; onde não, abre instantaneamente. Nenhum dos dois
quebra a seção. **Não há "só um aberto por vez"** — exigiria JS e não traz ganho aqui.

### Filtragem

Itens com `a` vazio não são renderizados. **Se nenhum item tiver resposta, a seção
inteira não renderiza** — nem o título, nem o botão. Isso é o que impede a página de ir
ao ar com pergunta sem resposta.

## 6. `components/sections/Oferta.tsx` — editado

Substitui a linha solta de `o.payments` por `<OfertaTrust />`. Nada mais muda —
o `CountUp` do preço permanece (fora de escopo).

## 7. `app/page.tsx` — editado

```tsx
<MainCard>
  <Hero /> <Dores /> <Modulos /> <Evolucao /> <Caminhos /> <Oferta /> <Faq />
</MainCard>
```

`TiraDuvidas` sai dos imports.

## 8. `components/sections/Header.tsx` — editado

Link "Tira-dúvidas" (`#tira-duvidas`) vira "Dúvidas" (`#faq`).

## 9. `components/sections/TiraDuvidas.tsx` — deletado

## Testes

TDD: teste primeiro, componente depois, no padrão do projeto (Vitest + Testing Library).

| Arquivo | Ação |
|---|---|
| `__tests__/sections/tira-duvidas.test.tsx` | deletado |
| `__tests__/sections/hero.test.tsx` | reescrito |
| `__tests__/sections/dores.test.tsx` | novo |
| `__tests__/sections/faq.test.tsx` | novo |
| `__tests__/sections/oferta.test.tsx` | editado |
| `__tests__/page.test.tsx` | editado |
| `__tests__/content.test.ts` | editado |

**`hero.test.tsx`** — `<h1>` é `hero.headline`; eyebrow, sub e bullets renderizam; CTA
aponta pro `checkoutUrl`; `[data-video]` continua presente. Guarda no idioma que o projeto
já usa (`does not render the old stats band`): **o hero não renderiza nenhuma fala de
`dores.thoughts`** — é o que garante que a copy migrou em vez de duplicar.

**`dores.test.tsx`** — inverte a asserção que existe hoje no hero (`dores.label` **não**
renderizado): agora renderiza. Mais `<h2>`, as 4 falas com `q` e `s`, e `turn`.

**`faq.test.tsx`** — item com `a` preenchido renderiza dentro de um `<summary>`; item com
`a` vazio não aparece; **com todos os itens vazios, a seção não renderiza**; botão aponta
pro `whatsappUrl`.

**`oferta.test.tsx`** — bloco de confiança mostra campos preenchidos e omite vazios;
`payments` continua saindo, agora de dentro do `OfertaTrust`.

**`page.test.tsx`** — `#tira-duvidas` não existe mais; `#dores` e `#faq` existem;
**asserção explícita da ordem das seções no DOM** (a ordem é metade do que esta mudança
entrega). `getAllByText(content.offer.priceNow)).toHaveLength(2)` segue valendo — o bloco
de confiança não repete preço.

**`content.test.ts`** — a guarda `does not advertise unsupported course deliverables`
varre o `content` inteiro via `JSON.stringify` e portanto já cobre `faq` e `offer.trust`
de graça; ela **não pode ser afrouxada** — é justamente o que impede alguém de responder
"acesso vitalício" ou "certificado de conclusão" sem confirmação do cliente. Teste novo:
toda pergunta do FAQ tem `q` preenchido, com `a` vazio permitido por design.

## Verificação

`npm test`, `npm run build`, `npm run lint`, e passada visual em `localhost:3000`
(desktop e mobile), incluindo abrir e fechar o acordeão pelo teclado.

## Pendências para o cliente

Bloqueiam conteúdo, não a implementação:

1. Plataforma do checkout (`offer.trust.checkout`)
2. Liberação e duração do acesso (`offer.trust.access` e FAQ)
3. Certificado — existe? (FAQ)
4. Formato do acompanhamento (FAQ)
5. Equipamentos e ferramentas necessários (FAQ)
6. O curso funciona bem no celular? (FAQ)
