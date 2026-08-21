import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';

/**
 * A virada: faixa branca pura (site-band--white) de tela cheia, no mesmo
 * ritmo das outras seis.
 *
 * NAO e mais a ultima secao. Por pedido do cliente ela subiu pra ANTES da
 * oferta — a virada e o ultimo argumento e a oferta e a ultima palavra, com
 * o preco a um passo de quem acabou de ler. O nome do arquivo ficou.
 *
 * O branco puro sobreviveu a mudanca com outra funcao: nasceu pra emendar
 * com o rodape branco, e hoje serve pra NAO se confundir com o #f7fbff de
 * Caminhos, que passou a ficar logo acima. Ver a regra .site-band--white.
 *
 * Sem id de proposito: page.test exige `oferta` como ultima section[id] — e
 * a inversao a deixou ainda mais literalmente a ultima.
 */
export function Fechamento() {
  const f = content.fechamento;
  return (
    <section className="site-section site-band site-band--white site-band--full text-center">
      {/* A faixa e de tela cheia e centraliza o conteudo, entao com pouco
          texto tudo se empilha no meio e a sobra vai inteira para as pontas.

          Aqui vale o mesmo raciocinio do Hero, nao o gap fixo do Dores:
          flex-1 faz a coluna ocupar a altura toda e justify-between reparte a
          folga ENTRE os tres blocos — cabecalho, prova e acao. A diferenca
          importa porque o vazio muda de tamanho conforme a tela: um gap fixo
          calibrado numa altura estoura em telas baixas (com gap-24 esta secao
          media 1,14 tela) e volta a concentrar nas altas. O gap-10 e so o
          piso, pros blocos nao se colarem quando nao ha folga pra repartir.
          Piso baixo de proposito: ele so entra em acao em telas curtas, onde
          apertar um pouco e melhor do que empurrar a secao pra alem de uma
          tela. Onde sobra altura, quem manda e o justify-between. */}
      <div className="mx-auto flex w-full max-w-content flex-1 flex-col justify-between gap-6">
        {/* Rotulo e titulo andam juntos: o rotulo e sobrancelha do titulo. */}
        <div>
          <SectionLabel>{f.label}</SectionLabel>
          <SplitReveal
            as="h2"
            className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl"
          >
            {f.title}
          </SplitReveal>
          <Reveal variant="simple">
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--band-fg-body)] md:text-base">
              {f.sub}
            </p>
          </Reveal>
        </div>

        {/* Os dois lados da mesma virada, pareados: a esquerda quanto o
            mercado paga, a direita como voce chega nesses clientes. Um sem o
            outro fica pela metade — preco sem caminho e so tabela, e ajuda
            sem preco nao mostra o que esta em jogo.

            Sem borda, fundo ou sombra, como os cards de Caminhos (.path-card
            zera as tres): numa faixa branca a coluna se sustenta pelo rotulo
            e pelo espaco, e caixa em cima de caixa so empilha moldura.

            Sem a superficie tingida, quem carrega o destaque do card direito
            passa a ser o rotulo em azul e o corpo em negrito maior. */}
        <Reveal
          variant="simple"
          stagger={0.12}
          // Vao largo de proposito: sem borda nem fundo, e o espaco que
          // separa uma coluna da outra. Com o gap curto de antes as duas
          // liam como um bloco so. No empilhado o vao vertical tambem cresce,
          // que e onde a leitura corre risco de emendar.
          className="mx-auto grid w-full max-w-5xl gap-x-6 gap-y-12 text-left lg:grid-cols-2 lg:gap-x-20"
        >
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-[color:var(--band-fg-faint)] md:text-sm">
              {f.precosTitulo}
            </h3>

            {/* Servico a esquerda, faixa a direita: da pra varrer a coluna
                dos valores sem ler os rotulos. E uma tabela de precos de
                mercado, nao projecao de ganhos — ver comentario no content. */}
            <ul className="mt-4">
              {f.precos.map((p) => (
                <li
                  key={p.servico}
                  className="flex items-baseline justify-between gap-4 border-b border-[color:var(--band-rule)] py-3 last:border-b-0"
                >
                  <span className="text-xs text-[color:var(--band-fg-body)] md:text-sm">
                    {p.servico}
                  </span>
                  <span className="shrink-0 text-sm font-bold text-[color:var(--band-fg-strong)] md:text-base">
                    {p.valor}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[11px] leading-relaxed text-[color:var(--band-fg-faint)]">
              {f.precosNota}
            </p>
          </div>

          {/* text-blue-2, nao text-blue: sobre fundo claro o azul de destaque
              mede ~3:1 e reprova no WCAG AA; o blue-2 passa em ~5:1. Mesma
              troca ja feita nos subtitulos da Evolucao. */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-blue-2 md:text-sm">
              {f.destaqueLabel}
            </h3>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-[color:var(--band-fg-strong)] md:text-base">
              {f.destaque}
            </p>

            {/* As quatro frases sao as mesmas que o instrutor fala no video
                do hero. Quem assistiu reencontra aqui o que ouviu; quem nao
                assistiu recebe o conteudo do video em texto.

                Elas tambem sao o peso que faltava deste lado: com so o
                rotulo e uma frase, a coluna terminava bem antes da tabela
                vizinha e o vao embaixo denunciava o desequilibrio. */}
            <ul className="mt-4 space-y-3">
              {f.destaqueItens.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-[color:var(--band-fg-body)] md:text-[15px]"
                >
                  {/* text-blue-2, nao o text-blue de Caminhos: aquele vive
                      numa faixa levemente azulada, esta e branca pura. */}
                  <span className="text-blue-2" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal variant="simple">
          <div className="flex justify-center [&_a]:min-h-[48px] [&_a]:rounded-[1.15rem] [&_a]:px-7 [&_a]:text-sm">
            <MagneticButton>
              <Button href={content.checkoutUrl} variant="primary">
                {f.cta}
              </Button>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
