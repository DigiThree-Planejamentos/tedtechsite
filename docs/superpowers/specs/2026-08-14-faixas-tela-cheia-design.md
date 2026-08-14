# Spec: Faixas de tela cheia, ritmo claro/escuro e a aba de virada

**Data:** 2026-08-14
**Origem:** pedido do cliente ("remover o card branco de cima do fundo do site", "cada seção
ocupa o tamanho de uma tela inteira", "uma quebra entre o site com umas seções com fundo
branco e umas com fundo escuro"), refinado por brainstorming. A quebra foi especificada por
referência ao site Zarpei (https://zarpei-mono-landing-1.vercel.app/), na emenda entre as
seções "Pra cada rotina, uma Zarpei" e "A conta que importa".
**Decisão do cliente:** a virada de claro para escuro acontece **antes de Caminhos** —
quatro telas claras, três escuras.

## Revisão de 2026-08-14, depois da primeira montagem

Com as quatro primeiras tarefas no ar e o ritmo visível no navegador, o cliente reviu duas
decisões. O texto abaixo registra o que mudou e por quê; o restante do documento foi corrigido
para refletir a versão nova, e as partes superadas ficam marcadas como tal.

1. **De uma quebra para alternância.** Em vez de um único ponto de virada, claro e escuro se
   alternam do começo ao fim: `hero` claro, `dores` escura, `modulos` clara, `evolucao`
   escura, `caminhos` clara, `oferta` escura, `faq` clara.
2. **As faixas escuras são transparentes, não `#07111f`.** Pedido literal: *"nas escuras deixa
   o fundo escuro do site com os circuitos"*.

O segundo item corrigiu um erro meu que a primeira versão não tinha visto. O site já monta
`<CircuitEdges />` em `components/providers/AppProviders.tsx:23` — um `<canvas>` de campo de
circuitos posicionado `fixed inset-0 -z-10`, atrás de todo o conteúdo, desde sempre. Ao dar
fundo **opaco** a todas as seções, a primeira versão enterrou esse canvas: o efeito não sumiu
do código, sumiu da tela. Faixa escura transparente é o que devolve o fundo do site e os
circuitos ao lugar.

**Consequência de projeto, e a parte interessante:** com as escuras virando janelas, a faixa
**clara** passa a ser a única superfície sólida da página. Isso reposiciona a aba. Ela deixa
de ser "o escuro subindo para dentro do claro" e passa a ser "a folha clara reaparecendo e se
anunciando" — uma saliência da superfície sólida avançando para dentro do vão escuro de cima.
Como a cor da aba sai de `var(--band-bg)`, o componente não precisou saber de nada disso: ela
trocou de cor sozinha ao mudar de faixa. A aba passa a aparecer **três vezes**, em toda faixa
clara precedida de uma escura — `modulos`, `caminhos` e `faq`.

## Problema

O site inteiro mora dentro de um único elemento: `<div class="site-card">`, renderizado por
`components/layout/MainCard.tsx`, envolvendo as sete seções. Ele tem fundo `#f7fbff`, borda
azul, cantos de 2rem e sombra funda. O efeito é o de uma folha branca flutuando sobre o fundo
escuro do `body` — a página inteira é um cartão só.

Três consequências:

1. **Não existe ritmo.** Como o fundo é um só, nenhuma seção pode ser escura sem parecer um
   remendo colado dentro do cartão. A página tem um único andamento visual do começo ao fim.
2. **As seções não respiram.** Medido em 1440×900, seis das sete seções ocupam entre **46% e
   80%** de uma tela. Elas não estão grandes demais — estão pequenas demais, espremidas por
   um `padding` fixo em vez de ocuparem o espaço que têm.
3. **A cor do texto está presa ao cartão.** `.site-card` define `color: #07111f`, e quase todo
   título e item de lista herda daí sem declarar cor própria. Tirar o cartão sem substituir
   essa fonte de verdade apaga a cor de texto do site inteiro.

## Medições de referência (antes da mudança)

Tiradas no navegador via Playwright, em `http://localhost:3010`. Servem de linha de base para
conferir a mudança depois.

**1440×900** (`vh` = 900), altura total do documento 7246px, cartão 6871px:

| Seção | Altura | Telas |
|---|---|---|
| hero | 612px | 0,68 |
| dores | 415px | 0,46 |
| **modulos** | **3547px** | **3,94** |
| evolucao (sem id) | 501px | 0,56 |
| caminhos | 723px | 0,80 |
| oferta | 612px | 0,68 |
| faq | 459px | 0,51 |

**390×844** (`vh` = 844) — altura do conteúdo, já sem o padding da seção:

| Seção | Conteúdo | Telas | Cabe em uma tela? |
|---|---|---|---|
| hero | 506px | 0,69 | sim |
| dores | 413px | 0,60 | sim |
| modulos | 805px | 1,07 | **não** |
| evolucao | 583px | 0,80 | sim |
| caminhos | 1257px | 1,60 | **não** |
| oferta | 865px | 1,14 | **não** |
| faq | 331px | 0,51 | sim (fechado) |

Duas leituras importam:

- **Módulos é a exceção, e é por projeto.** Os 3547px não são altura visível: a seção é
  *pinada* por `ScrollTrigger` (`components/sections/Modulos.tsx`, `pin: pinRef`,
  `pinSpacing: true`, `end: +=getMaxX() + getLeadDistance()*2`). Ela fica travada na tela
  enquanto o carrossel anda na horizontal. **Visualmente ela já é uma tela cheia**; os 3547px
  são espaço de rolagem consumido pelo pin.
- **O FAQ mede 331px com o acordeão fechado.** Ao abrir itens ele cresce. Qualquer solução
  que trate uma tela como teto quebra aqui.

## A referência da aba (medida no Zarpei)

O elemento que o cliente chamou de "quadradinho" chama-se `aba-ombro` no código do Zarpei.
Estrutura, extraída do DOM publicado:

```html
<section id="economia" class="bg-[#08080a] text-white relative ... min-h-[100svh]">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-full">
    <div class="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12 xl:px-14">
      <div class="flex h-14 items-stretch">
        <div class="aba-ombro aba-ombro-l -ml-7 h-7 w-7 shrink-0 self-end bg-[#08080a]"></div>
        <div class="h-full w-[min(58%,520px)] shrink-0 rounded-t-[28px] bg-[#08080a]"></div>
        <div class="aba-ombro aba-ombro-r h-7 w-7 shrink-0 self-end bg-[#08080a]"></div>
      </div>
    </div>
  </div>
  ...
</section>
```

O truque está na máscara dos ombros (valores computados, lidos do navegador):

```css
.aba-ombro-l { mask-image: radial-gradient(28px at 0    0, transparent 27px, #000 28px); }
.aba-ombro-r { mask-image: radial-gradient(28px at 100% 0, transparent 27px, #000 28px); }
```

A máscara **escava** um quarto de círculo no canto superior do quadradinho, produzindo um
canto **côncavo**. Colado ao lado do corpo da aba (que tem canto convexo de 28px), o conjunto
lê como uma forma contínua: a aba parece brotar da faixa escura, e não estar colada por cima.
É isso que faz a página *virar* em vez de apenas mudar de cor.

Dois fatos medidos que simplificam a implementação:

- **A aba não muda entre desktop e mobile.** 56px de altura, ombros de 28×28 e raio de 28px
  em qualquer largura (conferido a 1440 e a 390). Só o corpo é fluido: `min(58%, 520px)`.
  Nenhum breakpoint é necessário.
- **O `-ml-7` (−28px) do ombro esquerdo** puxa o quadradinho para dentro da calha lateral, de
  modo que a borda esquerda do *corpo* da aba caia exatamente na coluna de conteúdo. A aba
  precisa herdar as mesmas medidas de calha da seção que a hospeda.

O Zarpei aplica a aba na virada **claro → escuro**, com a aba pendurada acima da seção
escura. Isso fixa o sentido da nossa quebra: parte clara em cima, parte escura embaixo,
desembocando no rodapé, que já é escuro.

## Escopo

**Dentro:**

1. Remoção do cartão branco; cada seção passa a pintar o próprio fundo, de ponta a ponta.
2. Sistema de tons por faixa (`site-band--light` / `site-band--dark`) com tokens de cor de texto.
3. Altura mínima de uma tela por seção, com o conteúdo centrado.
4. A aba de virada, uma só, na fronteira Evolução → Caminhos.
5. Testes travando o ritmo e a unicidade da aba.

**Fora, por decisão explícita:**

- **Scroll-snap.** "Uma tela por seção" costuma vir com trava de rolagem. Aqui não: o site
  roda Lenis (rolagem suavizada, `app/globals.css` linhas 5–18) e Módulos usa `ScrollTrigger`
  com pin. Somar snap a esses dois produz rolagem engasgada. Reavaliável em pedido separado.
- **Header e FloatingCta.** São superfícies próprias (pílula clara flutuante) e continuam
  claras sobre faixas claras e escuras. Não seguem o tom da faixa.
- **Cards de módulo e HeroVideo.** São superfícies escuras próprias, dentro de faixa clara.
  Não seguem o tom da faixa — é justamente o contraste que os destaca.
- **Rodapé.** Já é escuro e continua como está.
- **Conteúdo placeholder.** `checkoutUrl`, `whatsappUrl`, dados do instrutor, CNPJ e telefone
  seguem falsos. Todo CTA desta página continua apontando para um domínio inexistente.

## Decisões aprovadas

### 1. Tokens de faixa, não cor na unha

Três caminhos foram considerados:

- **(A) Tokens de faixa** — a seção declara o tom, o tom define variáveis de cor, o texto
  herda. **Escolhido.**
- **(B) Cor fixa nas três seções escuras** — menos arquivos agora, mas deixa o site meio
  tokenizado e meio fixo. Mover a quebra depois vira caça a hexadecimal espalhado, e a ordem
  das seções já mudou quatro vezes nesta semana.
- **(C) Componente `<SectionBand>` embrulhando cada seção** — mais elegante no papel, mas o
  `<section>` de Módulos carrega `ref` para o pin do GSAP e os testes consultam `section[id]`
  pela ordem do DOM. Exigiria encaminhar refs e reescrever a seção mais delicada do site.
  Risco alto por ganho estético.

(A) também é o que a base já faz: `.site-panel` e `.site-dark-panel` já moram no `globals.css`.

**Tokens:**

```css
.site-band {
  position: relative;
  background: var(--band-bg);
  color: var(--band-fg);
}

/* As claras sao folhas solidas; as escuras sao janelas. */
.site-band--light {
  --band-bg: #f7fbff;
  --band-solid: #f7fbff;
  --band-fg: #07111f;   /* base herdada — era a cor do .site-card */
  --band-fg-strong: #050914;
  --band-fg-body: #3b4654;
  --band-fg-muted: #526071;
  --band-fg-faint: #667284;
  --band-rule: rgba(15, 42, 81, 0.1);
}

.site-band--dark {
  /* Transparente, nao #07111f: e o que deixa aparecer o fundo do site e
     o canvas de circuitos (fixed inset-0 -z-10). Ver a Revisao no topo. */
  --band-bg: transparent;
  /* Cor chapada para o que nao pode ser transparente. */
  --band-solid: #06080d;
  --band-fg: #eef2f7;
  --band-fg-strong: #ffffff;
  --band-fg-body: #c3ccd8;
  --band-fg-muted: #9fb0c2;
  --band-fg-faint: #8a97a8;
  --band-rule: rgba(255, 255, 255, 0.1);
}
```

**Por que `--band-solid` existe.** Nem tudo pode ser transparente. O furo do medidor cônico da
Evolução (`.gauge::before`) pintava `#f7fbff` fixo para vazar o anel; numa faixa escura isso
vira um disco branco, e deixá-lo transparente faria o próprio gradiente cônico aparecer no
meio do furo. O token dá a cada tom a sua cor chapada. É o único consumidor hoje, mas qualquer
elemento que precise "furar" a faixa vai precisar do mesmo.

**Os valores claros são idênticos aos de hoje.** A metade clara do site não muda um pixel por
construção, não por sorte — é a propriedade que torna a tokenização das quatro seções claras
uma mudança mecânica e verificável, e não um risco.

`--band-rule` alimenta `.section-divider`, que hoje tem a cor fixa `rgba(15, 42, 81, 0.1)`:
o fio passa a escurecer ou clarear junto com a faixa, em vez de sumir sobre fundo escuro.

**Como as classes se combinam.** `.site-band` **não substitui** `.site-section` — elas
compõem. `.site-section` continua dona do espaçamento e do `scroll-margin`; `.site-band` passa
a ser dona de fundo e cor. Uma seção clara de tela cheia fica assim:

```html
<section id="dores" class="site-section site-band site-band--light site-band--full section-divider">
```

Contraste conferido para os valores escuros sobre `#07111f`: `--band-fg-muted` (#9fb0c2)
= 8,5:1; `--band-fg-faint` (#8a97a8) = 6,4:1. Ambos passam WCAG AA para texto normal.

**As 11 ocorrências de cor fixa nas seções que viram escuras:**

| Arquivo | Linha | Hoje | Vira |
|---|---|---|---|
| `Caminhos.tsx` | 92 | `text-[#526071]` | `--band-fg-muted` |
| `Caminhos.tsx` | 115 | `text-[#526071]` | `--band-fg-muted` |
| `Oferta.tsx` | 25 | `text-[#667284]` | `--band-fg-faint` |
| `Oferta.tsx` | 39 | `text-[#667284]` | `--band-fg-faint` |
| `Oferta.tsx` | 43 | `text-[#526071]` | `--band-fg-muted` |
| `OfertaTrust.tsx` | 14 | `text-[#050914]` | `--band-fg-strong` |
| `OfertaTrust.tsx` | 17 | `text-[#667284]` | `--band-fg-faint` |
| `OfertaTrust.tsx` | 30 | `text-[#667284]` | `--band-fg-faint` |
| `Faq.tsx` | 24 | `text-[#050914]` | `--band-fg-strong` |
| `Faq.tsx` | 28 | `text-[#3b4654]` | `--band-fg-body` |
| `Faq.tsx` | 33 | `text-[#667284]` | `--band-fg-faint` |

As seções claras (`Hero`, `Dores`, `Evolucao`) recebem a mesma tokenização, sem mudança
visual, para que a regra "a cor do texto segue a faixa" valha para **todas** as seções. Uma
regra que vale para três de sete não é uma regra — é uma exceção esperando para morder na
próxima vez que a quebra mudar de lugar.

`Modulos.tsx`, `Header.tsx`, `FloatingCta.tsx`, `HeroVideo.tsx` e `Instrutor.tsx` ficam fora:
suas cores fixas pertencem a superfícies próprias, não à faixa. (`Instrutor.tsx` não é
renderizado pela página hoje — `app/page.tsx` não o importa.)

### 2. O cartão sai, as faixas entram

`components/layout/MainCard.tsx` existe apenas para renderizar `.site-card`. O arquivo é
**removido** e o `<main>` passa direto para `app/page.tsx`.

O que se perde e o que se preserva do cartão:

- **`.site-card::before` (grade quadriculada, 34px, opacidade 0,08)** — **preservada** nas
  faixas claras. É textura de marca, não decoração do cartão; apagá-la junto seria uma perda
  silenciosa que ninguém pediu. Vira `.site-band--light::before`, e é uma regra só de remover
  se o cliente preferir liso.

  **Cuidado de empilhamento:** o cartão mantinha o conteúdo acima da grade com
  `.site-card > * { position: relative; z-index: 1 }`. Essa regra tem de viajar junto. Sem ela
  a grade cobre o conteúdo — é exatamente o tipo de detalhe que some numa remoção de arquivo e
  só aparece no navegador.

  Mas ela **não pode valer para a aba**: a aba é filha direta da seção e precisa ser
  `position: absolute` para se pendurar em `bottom-full`. Um `position: relative` herdado de
  uma regra genérica a arrancaria da âncora. Daí a exclusão explícita:

  ```css
  .site-band > *:not(.section-tab) { position: relative; z-index: 1; }
  ```

  Depender da ordem das camadas do Tailwind (`utilities` vence `components`, então `.absolute`
  ganharia de qualquer jeito) resolveria por acidente. A exclusão resolve por intenção.
- **`.site-card::after` (três brilhos radiais)** — **descartada**. Estavam dimensionadas para
  uma caixa de 1280px; esticadas em faixas de ponta a ponta viram manchas. As faixas escuras
  passam a carregar o brilho azul da marca.
- **Borda, raio de canto e sombra** — descartados. São a definição do cartão.

O `padding-top` que limpava o header fixo (`pt-24 sm:pt-28` no `<main>`) migra para a faixa
do Hero, que passa a ser a única responsável por não deixar o título embaixo do header.

### 3. Uma tela é o piso, nunca o teto

```css
.site-band--full {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100svh;
}
```

`min-height`, não `height`. No desktop tudo já cabe, então o efeito é exatamente "uma tela por
seção". No mobile, Caminhos (1,60), Oferta (1,14) e Módulos (1,07) simplesmente crescem —
sem corte de conteúdo e sem rolagem dentro de rolagem, que trava o dedo do usuário e esconde
conteúdo pago. O mesmo padrão que o Zarpei usa (`min-h-[100svh]` em `#economia` e `#orcamento`).

**Módulos não recebe `--full`.** Já ocupa a tela por estar pinada; somar `min-height` deve
injetar uma tela vazia antes do pin começar. Recebe faixa e cor, não altura. **A verificar por
medição**, não no olho: se a medição mostrar que o pin convive bem com `min-height`, a
exceção cai e a regra fica uniforme.

**O Hero perde o `min-h-[calc(100svh-24rem)]` interno** (`Hero.tsx` linha 16). Aquele número
foi calculado para o layout do cartão; com a faixa dona da altura, ele passa a competir com
ela. A elevação do bloco (`-translate-y-4 md:-translate-y-6 lg:-translate-y-10`, linha 20) é
**preservada na primeira passada e re-medida depois** — com a faixa centralizando o conteúdo,
ela pode virar deslocamento duplo.

### 4. A aba, três vezes

Componente novo `components/layout/SectionTab.tsx`, renderizado como primeiro filho de
**`Modulos`, `Caminhos` e `Faq`** — as três faixas claras que voltam depois de uma escura.

A aba pertence à faixa **clara**, e não à escura. Com as escuras transparentes, a clara é a
única superfície sólida da página: a aba é uma saliência dessa superfície, subindo para dentro
do vão escuro de cima. É a mesma lógica do Zarpei — a aba pertence a quem é sólido —, só que
aqui a cor sólida é a clara.

*(A versão anterior deste documento previa uma aba só, escura, em `Caminhos`. Ver a Revisão no
topo.)*

```tsx
export function SectionTab() {
  return (
    <div aria-hidden="true" className="section-tab pointer-events-none absolute inset-x-0 bottom-full">
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

```css
.section-tab__shoulder {
  align-self: flex-end;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: var(--band-bg);
  -webkit-mask-image: radial-gradient(28px at var(--tab-corner) 0, transparent 27px, #000 28px);
  mask-image: radial-gradient(28px at var(--tab-corner) 0, transparent 27px, #000 28px);
}
.section-tab__shoulder--l { --tab-corner: 0;    margin-left: -28px; }
.section-tab__shoulder--r { --tab-corner: 100%; }
```

Notas de projeto:

- **A cor vem de `var(--band-bg)`.** A aba não sabe de que cor é — ela herda o fundo da faixa
  que a hospeda. Isso foi testado na prática: quando o ritmo mudou de uma quebra para
  alternância e a aba trocou de dona (da faixa escura para a clara), o componente **não
  precisou de uma linha de mudança** — trocou de cor sozinho.
- **`.section-tab__gutter` repete a calha de `.site-section`** (1,25rem / 2rem / 4rem por
  breakpoint) para que a borda esquerda do corpo da aba caia na mesma coluna do conteúdo da
  seção. É a mesma razão do `-ml-7` do Zarpei.
- **`aria-hidden` e `pointer-events-none`**: é decoração pura, invisível para leitor de tela e
  inerte ao mouse.
- **Ordem de pintura**: a aba está dentro de Caminhos, que vem depois de Evolução no DOM —
  então pinta por cima sem precisar de `z-index`. `.site-section` já tem `position: relative`,
  que é o que ancora o `bottom-full`.
- **Caminhos não pode ganhar `overflow: hidden`**, senão corta a aba. (Hoje não tem; o teste
  registra isso.)

### 5. Ritmo final

| Seção | Tom | Tela cheia | Aba |
|---|---|---|---|
| hero | claro (sólido) | sim | — (nada acima) |
| dores | **escuro (transparente)** | sim | — |
| modulos | claro (sólido) | não (pinada) | **sim** |
| evolucao | **escuro (transparente)** | sim | — |
| caminhos | claro (sólido) | sim | **sim** |
| oferta | **escuro (transparente)** | sim | — |
| faq | claro (sólido) | sim | **sim** |
| footer | escuro (já era) | — | — |

Regra que gera a tabela, e que vale mesmo se a ordem das seções mudar: **os tons alternam, e
toda faixa clara precedida de uma escura carrega a aba.** O `hero` é a exceção óbvia — não há
nada acima dele além do header.

`.section-divider` **sai de todas as seções**. Com os tons alternando, a própria troca de cor
já separa uma seção da outra; um fio de 1px em cima disso seria ruído. A classe continua no
`globals.css`, agora lendo `var(--band-rule)`, caso volte a ser útil.

## Testes

Arquivo novo `__tests__/layout/bands.test.tsx`, cobrindo o que dá para quebrar sem perceber:

1. **O ritmo, em ordem.** As sete seções, na ordem do DOM, carregam os tons
   `[claro, escuro, claro, escuro, claro, escuro, claro]`. É o teste que falha se alguém mover
   uma seção sem mover a cor.
2. **A alternância, como regra e não como lista.** Nenhuma seção vizinha repete o tom. Esse
   teste pega o que a tabela fixa não pega: se alguém acrescentar uma seção no meio, a tabela
   é atualizada mecanicamente, mas a regra de alternância é violada e o teste grita.
3. **A aba aparece exatamente onde deve.** Uma em cada faixa clara precedida de escura
   (`modulos`, `caminhos`, `faq`), nenhuma nas escuras — uma aba transparente não desenharia
   forma nenhuma — e o total bate com a contagem esperada.
4. **Nenhuma seção que hospeda aba tem `overflow-hidden`**, que a cortaria inteira.
3. **O cartão não voltou.** Nenhum `.site-card` no documento, e `MainCard` não é mais
   importado.
4. **Módulos é a exceção declarada.** `#modulos` não tem a classe de tela cheia — para que a
   exceção seja uma decisão registrada, e não um esquecimento que alguém "conserta" depois.

Os testes existentes de `page.test.tsx` (ordem das seções, âncoras, preço em dois lugares) e
os 11 arquivos de `__tests__/sections/` seguem valendo sem alteração; nenhum deles afirma
sobre cor de fundo ou altura. Se algum quebrar, é sinal de que a mudança foi além do combinado.

Verificação por medição no navegador, além dos testes — a mesma disciplina que pegou o
descendente cortado do "g" e o `line-height: 1` do Tailwind nas rodadas anteriores:

- Altura de cada seção em 1440×900 e 390×844, comparada à tabela de linha de base acima.
- O pin de Módulos ainda começa e termina onde começava (`start`/`end` do `ScrollTrigger`).
- A aba não está cortada: topo da aba 56px acima do topo de `#caminhos`, nos dois tamanhos.
- Contraste de texto real nas três faixas escuras.

## Arquivos

| Arquivo | Mudança |
|---|---|
| `app/globals.css` | remove `.site-card*`; adiciona `.site-band*`, tokens, `.section-tab*`; ajusta `.site-section` |
| `app/page.tsx` | `<main>` inline; sai o `MainCard` |
| `components/layout/MainCard.tsx` | **removido** |
| `components/layout/SectionTab.tsx` | **novo** |
| `components/sections/Hero.tsx` | faixa clara + tela cheia; sai o `min-h` interno; tokens |
| `components/sections/Dores.tsx` | faixa clara + tela cheia; tokens |
| `components/sections/Modulos.tsx` | faixa clara, **sem** tela cheia |
| `components/sections/Evolucao.tsx` | faixa clara + tela cheia; tokens |
| `components/sections/Caminhos.tsx` | faixa **escura** + tela cheia + `<SectionTab />`; tokens |
| `components/sections/Oferta.tsx` | faixa escura + tela cheia; `.site-panel` → `.site-dark-panel`; tokens |
| `components/sections/OfertaTrust.tsx` | tokens |
| `components/sections/Faq.tsx` | faixa escura + tela cheia; tokens |
| `__tests__/layout/bands.test.tsx` | **novo** |

Treze arquivos.

## Riscos

| Risco | Tratamento |
|---|---|
| `min-height` na faixa de Módulos injeta uma tela vazia antes do pin | Módulos fica sem `--full`; confirmar por medição, não por inspeção visual |
| Altura das faixas desloca o `start`/`end` do `ScrollTrigger` | O componente já chama `ScrollTrigger.refresh()`; medir as posições do pin antes e depois |
| Elevação do Hero vira deslocamento duplo com a faixa centralizando | Preservar na primeira passada, re-medir e ajustar |
| A aba cortada por `overflow` em Caminhos | Caminhos não tem `overflow: hidden`; teste registra a exigência |
| Faixa escura derruba contraste de algum texto | Tokens escuros já conferidos (8,5:1 e 6,4:1); medir o resultado real nas três seções |
| Perda silenciosa da textura de marca junto com o cartão | Grade quadriculada preservada nas faixas claras, como regra única e reversível |
