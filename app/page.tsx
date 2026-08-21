import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Dores } from '@/components/sections/Dores';
import { Modulos } from '@/components/sections/Modulos';
import { Evolucao } from '@/components/sections/Evolucao';
import { Caminhos } from '@/components/sections/Caminhos';
import { Fechamento } from '@/components/sections/Fechamento';
import { Oferta } from '@/components/sections/Oferta';
import { FloatingCta } from '@/components/sections/FloatingCta';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Header />
      {/* Sem cartao e sem calha: cada secao pinta o proprio fundo de
          ponta a ponta e traz o proprio espacamento pela .site-section. */}
      <main className="relative z-10">
        <Hero />
        <Dores />
        <Modulos />
        <Evolucao />
        <Caminhos />
        {/* Fechamento ANTES da oferta, por pedido do cliente: a virada e o
            ultimo argumento, e a oferta e a ultima coisa da pagina — quem
            termina de ler ja esta no preco, sem precisar rolar de volta.

            A inversao sozinha custou a alternancia claro/escuro: trocar de
            lugar uma faixa clara e uma escura numa sequencia alternada cria
            vizinhanca repetida, sempre. Por um tempo a pagina teve duas
            emendas planas (caminhos->fechamento e oferta->rodape) e as duas
            ficaram sem recorte.

            A troca de FUNDOS que veio depois desfez isso de graca: a virada
            virou escura e a oferta branca, entao a alternancia voltou e toda
            emenda voltou a mudar de superficie. Hoje so o rodape fica sem
            recorte, e por ser o fim da pagina — ver `.site-band--no-notch`
            no globals.css. */}
        <Fechamento />
        <Oferta />
      </main>
      <FloatingCta />
      <Footer />
    </>
  );
}
