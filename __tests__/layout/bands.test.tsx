import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '@/app/page';

// O ritmo da pagina, na ordem do DOM. Cresce nas tarefas 2 e 3 ate
// cobrir as sete secoes. `id` vazio = a secao nao tem id — hoje so o
// Fechamento e assim. A Evolucao ganhou id quando o header passou a ter
// um botao por secao: o botao precisa de uma ancora pra onde ir.
// Hoje as sete sao de tela cheia. O campo `full` continua existindo para
// que uma futura excecao seja declarada aqui, e nao passe por esquecimento.
// As faixas escuras sao transparentes: quem preenche o vao e o fundo do site
// com o canvas de circuitos. A propria troca de tom e a separacao entre uma
// secao e a seguinte — sem fio, sem aba, sem nenhum enfeite na emenda.
//
// Claro e escuro se alternavam do inicio ao fim ate a inversao pedida pelo
// cliente (fechamento pra antes da oferta). Trocar de lugar uma faixa clara e
// uma escura numa sequencia alternada SEMPRE cria uma vizinhanca repetida —
// nao ha arranjo de cores que salve, e por isso a alternancia deixou de ser
// invariante. O que ficou no lugar dela esta em `FAMILIA` e nos testes de
// emenda abaixo.
export const RITMO = [
  { id: 'hero', tom: 'light', full: true },
  { id: 'dores', tom: 'dark', full: true },
  // Modulos era a excecao enquanto o carrossel era pinado por
  // ScrollTrigger. O acordeao poe os seis cards numa tela so, o pin saiu,
  // e a secao virou uma faixa normal como as outras.
  { id: 'modulos', tom: 'light', full: true },
  { id: 'evolucao', tom: 'dark', full: true },
  { id: 'caminhos', tom: 'light', full: true },
  // Fechamento (a virada): faixa branca PURA, #ffffff contra o #f7fbff das
  // claras. Sem id porque page.test exige oferta como ultima section[id].
  // Subiu pra ca na inversao: a virada e o ultimo argumento, a oferta e a
  // ultima palavra.
  { id: '', tom: 'white', full: true },
  // O FAQ deixou de ser secao: virou o card direito da oferta. E a oferta
  // fecha a pagina, com o rodape escuro emendando nela sem nenhuma linha.
  { id: 'oferta', tom: 'dark', full: true },
];

// A familia da superficie, que e o que o recorte consegue mostrar. Clara e
// branca sao folhas solidas quase iguais (#f7fbff contra #ffffff); escura e
// janela pro canvas de circuitos. Um recorte so aparece quando a familia
// muda de um lado pro outro da emenda.
const FAMILIA = (el: Element) =>
  el.className.includes('site-band--dark') ? 'escura' : 'clara';

// Todas as faixas da pagina na ordem do DOM, o rodape incluido: ele nao e
// <section> nem vive dentro do <main>, mas e faixa como as outras e e a
// vizinha de baixo da ultima secao. Deixa-lo de fora esconderia justamente a
// emenda oferta -> rodape.
const faixas = (container: HTMLElement) => [
  ...Array.from(container.querySelectorAll('main section')),
  ...Array.from(container.querySelectorAll('footer.site-band')),
];

describe('Faixas da pagina', () => {
  // O RECORTE MORA NA EMENDA, e a emenda so existe onde a superficie muda.
  // Este e o teste central do desenho: uma faixa leva recorte quando a
  // proxima e de outra familia, e NAO leva quando e da mesma.
  //
  // Sem ele a coisa quebra calada e feia. Antes da inversao havia uma unica
  // excecao, o rodape, escrita como regra de elemento no CSS; hoje sao tres,
  // e duas nasceram de uma mudanca de ORDEM, nao de estilo. Reordene as
  // secoes de novo e o recorte passa a mentir sobre o que vem depois — a
  // oferta pintando uma aba clara no meio do campo escuro do rodape, por
  // exemplo — sem que nenhum teste de componente perceba.
  it('so poe recorte na emenda onde a superficie realmente muda', () => {
    const { container } = render(<Home />);
    const todas = faixas(container);
    expect(todas.length).toBe(RITMO.length + 1); // as secoes mais o rodape

    for (const [i, faixa] of todas.entries()) {
      const proxima = todas[i + 1];
      // Sem proxima = fim da pagina (o rodape). Nao ha o que mostrar.
      const mesmaSuperficie = !proxima || FAMILIA(proxima) === FAMILIA(faixa);
      const nome = faixa.id || faixa.tagName.toLowerCase();

      expect(
        faixa.className.includes('site-band--no-notch'),
        mesmaSuperficie
          ? `${nome} tem a mesma superficie da proxima e nao pode ter recorte`
          : `${nome} muda de superficie na base e precisa do recorte`,
      ).toBe(mesmaSuperficie);
    }
  });

  // O recorte da base de uma faixa ESCURA e uma aba pintada com a cor da
  // proxima. O default do CSS e #f7fbff, o tom das claras, e serve pra quase
  // todas. Nao serve pra escura que tenha a BRANCA embaixo: ali a aba precisa
  // ser #ffffff, senao encosta no branco puro e le como mancha azulada
  // (mesmo motivo documentado em .site-band--white).
  //
  // Hoje esse caso NAO existe — a inversao pos o fechamento acima da oferta,
  // e por isso o `[--notch-fill:#ffffff]` saiu de la. O teste continua porque
  // o caso volta ao primeiro reordenamento que puser uma escura em cima da
  // branca, e ele ancora a regra na VIZINHANCA, nao no nome da secao: exige
  // o fill quando a vizinhanca pede, e proibe quando nao pede.
  it('paints a pure-white notch fill on any dark band that hands off to the white one', () => {
    const { container } = render(<Home />);
    const todas = faixas(container);

    for (const [i, faixa] of todas.entries()) {
      const proxima = todas[i + 1];
      const precisa =
        faixa.className.includes('site-band--dark') &&
        !faixa.className.includes('site-band--no-notch') &&
        !!proxima &&
        proxima.className.includes('site-band--white');
      const nome = faixa.id || faixa.tagName.toLowerCase();

      if (precisa) {
        expect(faixa.className, `${nome} entrega pra branca e precisa do fill`).toContain(
          '[--notch-fill:#ffffff]',
        );
      } else {
        expect(faixa.className, `${nome} nao precisa de fill`).not.toContain('--notch-fill');
      }
    }
  });

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

  // A alternancia claro/escuro era invariante ate a inversao, e a inversao
  // nao podia mante-la: trocar uma faixa clara por uma escura numa sequencia
  // que alterna cria vizinhanca repetida, sempre.
  //
  // O que sobrou de guardavel e o TAMANHO do estrago. Duas emendas planas sao
  // o preco da inversao; uma terceira seria descuido de alguem, e e o que
  // este teste pega. Listadas por nome pra que qualquer reordenamento futuro
  // caia aqui e obrigue a decidir de novo, em vez de ir somando trecho chapado
  // sem ninguem notar.
  const PLANAS = [
    ['caminhos', 'fechamento'], // #f7fbff -> #ffffff, o degrau da virada
    ['oferta', 'rodape'], // as duas transparentes, o mesmo campo de circuitos
  ];

  it('nao deixa a inversao espalhar trecho chapado alem das duas emendas que ela custou', () => {
    const { container } = render(<Home />);
    const todas = faixas(container);
    // Fechamento nao tem id (page.test exige oferta como ultima section[id])
    // e o rodape nao e section — os dois entram por nome fixo.
    const nome = (el: Element, i: number) =>
      el.id || (i === todas.length - 1 ? 'rodape' : 'fechamento');

    const planas = todas
      .map((faixa, i) => ({ faixa, i }))
      .filter(({ faixa, i }) => todas[i + 1] && FAMILIA(todas[i + 1]) === FAMILIA(faixa))
      .map(({ faixa, i }) => [nome(faixa, i), nome(todas[i + 1], i + 1)]);

    expect(planas).toEqual(PLANAS);
  });

  it('deixa a emenda entre as secoes limpa, so a troca de tom', () => {
    const { container } = render(<Home />);
    // A aba de canto concavo foi tirada por decisao do cliente. Este
    // teste existe para que ela nao volte por acidente junto com algum
    // outro enfeite de emenda — o fio do .section-divider inclusive.
    expect(container.querySelectorAll('.section-tab')).toHaveLength(0);
    expect(container.querySelectorAll('.section-divider')).toHaveLength(0);
  });

  it('nao tem mais o cartao branco envolvendo a pagina', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('.site-card')).toBeNull();
  });

  it('nao deixa nenhuma secao fora do ritmo', () => {
    const { container } = render(<Home />);
    const secoes = container.querySelectorAll('main section');
    expect(secoes).toHaveLength(RITMO.length);
  });
});
