# Landing Page TedTech — Curso de Manutenção & Montagem de PC
### Spec de Design · 2026-06-26

---

## 1. Visão geral

Landing page de **página única** para venda de um **curso EAD gravado** da marca **TedTech**, ensinando
manutenção, formatação, montagem de computadores e instalação de sistemas operacionais.

- **Objetivo principal (CTA):** compra direta via **checkout externo** (Hotmart/Kiwify/Eduzz — link a definir).
- **Ação secundária:** tirar dúvida no **WhatsApp** antes de comprar.
- **Público-alvo:** **iniciante do zero**, com objetivo duplo:
  1. **Uso próprio** — cuidar/consertar o próprio PC e parar de gastar com técnico.
  2. **Abrir um negócio** — montar uma assistência técnica / ter renda extra.
- **Tom de voz:** acolhedor e sem jargão ("você não precisa saber nada antes"), com uma camada de
  **oportunidade/renda** ("e, se quiser, transforme isso em renda").
- **Referência visual:** estrutura/linguagem do shot **Borea AI** (Dribbble), adaptada de forma **híbrida** —
  estrutura de página de vendas + 4 blocos-assinatura reaproveitados do Borea (marcados com ★ abaixo).

---

## 2. Stack & entrega

- **Framework:** Next.js (recomendado **static export** / output estático para hospedagem simples).
- **Hospedagem alvo:** Vercel ou qualquer host estático (Hostinger, Netlify, etc.).
- **Estilização (recomendação p/ fase de plano):** Tailwind CSS para layout + CSS custom para os
  gradientes/glows e o gauge (conic-gradient). Decisão final fica para o plano de implementação.
- **Estrutura sugerida:** 1 página (`/`) composta por componentes de seção isolados
  (`<Header/>`, `<Hero/>`, `<Identificacao/>`, `<Modulos/>`, `<Evolucao/>`, `<Instrutor/>`,
  `<TiraDuvidas/>`, `<Oferta/>`, `<CtaFinal/>`, `<Footer/>`).
- **Sem backend:** CTA aponta para URL externa de checkout; WhatsApp via link `wa.me`.

---

## 3. Identidade visual

### 3.1 Paleta (extraída do logo `padrao de cores.jpg` / `tedtech_logo.svg`)

| Token | Uso | Hex |
|---|---|---|
| `--bg` | Fundo principal (dark) | `#06080D` (logo usa preto puro `#000000`) |
| `--bg-soft` | Superfícies sutis | `#0B0F17` / `#0E131D` |
| `--blue` | Acento claro (topo do degradê) | `#1E9EDB` |
| `--blue-2` | Acento médio | `#1183B8` / `#0F6FB8` |
| `--blue-deep` | Acento profundo | `#0F2A51` |
| `--text` | Texto | `#EEF2F7` / `#FFFFFF` |
| `--muted` | Texto secundário | `#8A97A8` |
| `--wa` | WhatsApp (somente nesse botão) | `#25D366` |

- **Acento da marca:** azul vibrante em **degradê** (céu → profundo), substituindo o coral do Borea.
- **Glows de fundo:** brilhos radiais sutis em azul e azul-escuro atrás das seções (profundidade).

### 3.2 Tipografia
- **Títulos:** sans-serif geométrica, bold, com leve `letter-spacing` negativo. Palavras de destaque
  recebem **degradê azul** (`--blue` → `#7FD0F5`) via `background-clip:text`.
- **Corpo:** sans neutra e legível (ex.: Inter / system-ui). Tamanhos confortáveis, alto contraste no dark.
- **Recurso de hero:** palavra-fantasma gigante ao fundo (`opacity ~0.03`).

### 3.3 Preferências de estilo (decididas durante o brainstorm — aplicar globalmente)
- **Cards, por padrão, SEM borda e SEM fundo** ("boxeado") — usar espaçamento, ícone e tipografia para
  organizar. Quando houver fundo, é sutil; preferência é o transparente.
- Quando um elemento **precisa** de delimitação (ex.: chat do Tira-dúvidas, card de Oferta), usar uma
  **borda leve e clean** (`1px` em `rgba(255,255,255,.10)`) com fundo transparente/quase nulo.
- **Rótulos de seção** (ex.: "Você se identifica?") como **texto puro** (sem pílula de fundo) quando pedido.
- Hover de itens: leve `translateY`/glow azul, sem adicionar bordas pesadas.

---

## 4. Estrutura da página (9 seções, ordem final)

> ★ = bloco-assinatura reaproveitado do Borea AI.

### S1 · Header fixo
- Transparente (sem caixa). Logo **TedTECH** + nav (**Módulos · Quem ensina · Tira-dúvidas**) +
  botão azul **"Quero me inscrever"** (degradê azul) → checkout.
- Fixo no topo, com leve fundo/blur ao rolar (opcional).

### S2 · Hero ★ — variação "Centrado" (fiel ao Borea)
- Conteúdo centralizado. Palavra-fantasma "MONTAGEM" ao fundo.
- **Headline:** *"Aprenda a formatar, consertar e montar PCs do zero"* ("montar PCs" em degradê azul).
- **Subtítulo:** fala dos 2 públicos (uso próprio / renda) + "sem precisar saber nada antes".
- **Barra de busca reaproveitada** do Borea: campo "O que você quer aprender primeiro?" (decorativo) +
  **chips**: Formatação · Manutenção · Montagem · Sistemas.
- CTA azul "Quero me inscrever".

### S3 · Você se identifica? (dores) — Opção B "Pensamentos (aspas)"
- Rótulo "Você se identifica?" como **texto azul puro** (sem fundo/borda).
- **H:** *"Já pensou alguma dessas?"*
- 4 pensamentos entre aspas (grid 2×2), cada um com complemento:
  - "Será que é vírus ou hora de formatar?"
  - "Tenho medo de abrir e quebrar algo."
  - "De novo pagando técnico por isso?"
  - "Será que dá pra ganhar dinheiro com isso?"
- Frase de virada: *"A boa notícia: tudo isso se aprende — começando do zero."*

### S4 · Módulos ★ — 6 módulos, Opção A "Grid limpo" (sem card)
- Rótulo "O que você vai aprender" + H *"6 módulos, do básico ao prático"*.
- Grid 3×2, **sem fundo/borda** nos itens. Cada item: rótulo "MÓDULO 0X" + ícone + título + descrição.

| # | Módulo | Conteúdo |
|---|---|---|
| 01 | **Fundamentos do PC** | Peças, ferramentas e segurança para mexer sem medo |
| 02 | **Montagem** | Montar um PC do zero: compatibilidade, cabos, primeiro boot |
| 03 | **Formatação** | Backup, formatar do jeito certo, drivers e otimização |
| 04 | **Instalação de Sistemas** | Windows e Linux, dual boot, drivers e programas essenciais |
| 05 | **Manutenção** | Preventiva e corretiva: limpeza, pasta térmica, troca de peças |
| 06 | **Diagnóstico & 1ºs clientes** | Achar defeitos por sintoma e, se quiser, precificar e atender |

### S5 · Do zero ao avançado ★ — gauge/donut do Borea
- Painel **sem fundo e sem borda**.
- **Donut/gauge** (conic-gradient azul) à esquerda mostrando **"100% prático — você faz junto"**.
- À direita, **jornada em 3 etapas** com trilha conectando os pontos:
  1. **Começo: do zero** → *Iniciante*
  2. **Meio: faz sozinho** → *Confiante*
  3. **Fim: pronto pra cobrar** → *Renda extra / negócio próprio*

### S6 · Quem ensina (instrutor) — merge "Centrado + Cinematográfico", com vídeo embaixo
- Faixa cinematográfica (degradê escuro + glow azul + figura grande sutil ao fundo), conteúdo **centrado**.
- Ordem: label "Quem ensina" → **Nome** → função/anos → **bio** → **3 stats SEM fundo/borda** (divisórias verticais).
- **Vídeo de apresentação na PARTE DE BAIXO** — player largo 16:9 com botão de play (placeholder p/ embed real).
- Stats: anos de experiência · PCs montados · alunos/clientes.

### S7 · Tira-dúvidas ★ — chat "Ask AI" → WhatsApp (Opção B, borda leve clean)
- Centralizado. Label "Tira-dúvidas" + H *"Converse com a gente antes de decidir"*.
- **Janela de chat** com **borda fina clean** (`1px`) e **fundo transparente**: cabeçalho
  "TedTech · Atendimento · online", bolhas de exemplo (pergunta em azul à direita / resposta à esquerda),
  e linha "Digite sua dúvida…".
- Botão **verde WhatsApp** "Continuar no WhatsApp" → link `wa.me` (número a definir).

### S8 · Oferta & Preço — Opção A "Duas colunas" (card com borda leve clean) → checkout
- Card com **borda leve clean** e fundo quase transparente.
- **Coluna esquerda — "Tudo que você leva":** 6 módulos completos · aulas em vídeo no seu ritmo ·
  acesso `[vitalício/12 meses]` · certificado `[sim/não]` · tira-dúvidas no WhatsApp · atualizações futuras.
- **Coluna direita (separada por divisória):** preço **de/por** + **parcelamento**, **CTA azul** "Inscrever →"
  (→ checkout), e formas de pagamento (Pix · Cartão · Boleto).

### S9 · CTA final + Footer
- **CTA final** (faixa com glow azul, sem caixa): *"Pronto pra começar do zero?"* + botão checkout.
- **Footer** transparente: logo TedTECH · contato/CNPJ/Termos/Privacidade · ícones de redes.

---

## 5. Responsividade & acessibilidade
- **Mobile-first.** Grids colapsam para 1 coluna; módulos viram 1 coluna; hero centralizado reduz a
  palavra-fantasma. Header vira menu compacto.
- Contraste AA garantido (texto claro sobre dark; azul usado em elementos com peso suficiente).
- Imagens/vídeo com `alt`/legendas; foco visível nos elementos interativos; CTA com área de toque ≥ 44px.

## 6. SEO & performance
- `<title>`/meta description voltados a "curso de manutenção e montagem de PC do zero".
- Open Graph com imagem de preview (a criar). Fontes via `next/font`. Imagens otimizadas.
- Meta de performance: LCP rápido (hero leve), sem libs pesadas; gauge via CSS (sem JS).

---

## 7. Dados pendentes (placeholders a preencher)
> A landing pode ser construída inteira com placeholders e os dados entram depois.

- **Oferta:** preço (de/por), nº de parcelas, **link do checkout**, tempo de **acesso**, **certificado** (sim/não).
- **Instrutor:** nome, anos de experiência, 3 números (stats), **foto** e **vídeo** de apresentação.
- **Contato:** número de **WhatsApp** (`wa.me`), e-mail, **CNPJ**, links de redes sociais.
- **Marca/infra:** domínio final, imagem de Open Graph, fonte tipográfica oficial (se houver).

## 8. Fora de escopo (removido pelo cliente — pode voltar depois)
- Barra de credibilidade, seção "Pra quem é" (2 perfis), Bônus, Depoimentos, Garantia, FAQ.
  *(Obs.: Garantia e Depoimentos costumam ajudar conversão; reativáveis sem retrabalho.)*

---

## 9. Artefatos de referência
- Mockups aprovados (HTML standalone) em:
  `.superpowers/brainstorm/1825-1782483299/content/`
  — telas-chave: Hero `03-hero.html` (A), Dores `21-dores-B.html`, Módulos `18-modulos6-opcoes.html` (A) /
  `17-modulos6-header-footer.html`, Evolução `06-evolucao-v2.html`, Instrutor `10-instrutor-video.html`,
  Tira-dúvidas `14-tira-duvidas-B2.html`, Oferta `16-oferta-opcoes.html` (A), Header/CTA/Footer `17-...html`.
- Logo: `tedtech_logo.svg` · Paleta: `padrao de cores.jpg`.

> Nota: a pasta do projeto **não é um repositório git** — este spec não foi commitado (não há git).
> Recomenda-se `git init` quando for versionar, e adicionar `.superpowers/` ao `.gitignore`.
