import { site } from '@/lib/site';

/**
 * Os atalhos de secao, na ordem da pagina (site.nav). Vive em dois lugares
 * que quase nunca sao a mesma coisa ao mesmo tempo: o header, que so existe
 * enquanto o hero esta na tela, e a barra flutuante, que aparece do meio da
 * pagina em diante. Juntos cobrem a rolagem inteira.
 *
 * Existe como componente porque sao DOIS hospedeiros lendo a mesma lista. Em
 * copia dupla, mexer no rotulo de um item ou no estado de foco num lugar e
 * esquecer o outro nao quebra nada — so faz as duas navegacoes divergirem em
 * silencio.
 *
 * O que muda entre os hospedeiros e so medida, entao vai por className. O que
 * NAO muda — ordem, rotulos, hrefs, comportamento de foco — mora aqui.
 */
export function SectionNav({
  label,
  interactive,
  className = '',
  linkClassName = '',
}: {
  /**
   * Nome do landmark. Precisa ser DIFERENTE em cada hospedeiro: existe uma
   * janela curta em que os dois estao na tela (a barra aparece aos 70% da
   * primeira tela, e ate la o hero ainda intersecta e segura o header), e
   * dois landmarks de navegacao com o mesmo nome deixam quem usa leitor de
   * tela sem saber a qual esta indo.
   */
  label: string;
  /**
   * Acompanha a visibilidade do hospedeiro. Quando ele esta escondido —
   * fora da tela, opacidade zero, aria-hidden — estes links continuam no
   * DOM e continuariam tabulaveis; `false` os tira da ordem de tabulacao.
   */
  interactive: boolean;
  className?: string;
  linkClassName?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={`min-w-0 items-center whitespace-nowrap ${className}`}
    >
      {site.nav.map((item) => (
        <a
          key={item.href}
          href={item.href}
          tabIndex={interactive ? undefined : -1}
          /* Pilula so no hover e no foco: em repouso sao texto. Nos dois
             hospedeiros ha um botao de compra a centimetros dali, e ele deve
             ser o unico que parece botao o tempo todo. O estado de foco
             repete o do hover pra quem navega por teclado ver onde esta. */
          className={`rounded-full transition-colors duration-200 hover:bg-blue/10 hover:text-blue focus-visible:bg-blue/10 focus-visible:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/50 ${linkClassName}`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
