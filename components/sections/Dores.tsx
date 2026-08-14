import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { content } from '@/lib/content';

export function Dores() {
  const d = content.dores;

  return (
    <section id="dores" className="site-section site-band site-band--dark site-band--full scroll-mt-24">
      {/* Coluna flex com um gap so, no lugar da pilha de mt-*: a secao ocupa
          uma tela inteira e o conteudo media 280px dela, deixando quase 500px
          de vazio dividido igualmente em cima e embaixo. O gap gasta parte
          desse vazio ENTRE os blocos, que e onde ele faz o texto respirar.

          Ficando num valor so, mudar o quanto a secao respira e mexer em um
          numero, nao em quatro margens espalhadas. */}
      <div className="mx-auto flex w-full max-w-content flex-col gap-16 text-center md:gap-28">
        {/* O rotulo e o titulo andam juntos: o rotulo e sobrancelha do
            titulo, entao o espaco entre os dois nao entra na distribuicao. */}
        <div>
          <SectionLabel>{d.label}</SectionLabel>
          <SplitReveal as="h2" className="mt-4 text-2xl font-extrabold tracking-tight md:text-4xl">
            {d.title}
          </SplitReveal>
        </div>

        <Reveal
          stagger={0.1}
          className="mx-auto grid w-full max-w-3xl gap-8 text-left md:grid-cols-2 md:gap-12"
        >
          {d.thoughts.map((t) => (
            <div key={t.q} className="border-l-2 border-blue pl-5">
              <p className="text-sm italic leading-relaxed text-[color:var(--band-fg-body)] md:text-[15px]">“{t.q}”</p>
              <small className="mt-2 block text-xs not-italic leading-relaxed text-[color:var(--band-fg-faint)]">{t.s}</small>
            </div>
          ))}
        </Reveal>

        <p className="text-sm font-semibold text-[color:var(--band-fg-strong)] md:text-base">{d.turn}</p>
      </div>
    </section>
  );
}
