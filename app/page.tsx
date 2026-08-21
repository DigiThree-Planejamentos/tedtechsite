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

            Isso troca uma faixa clara com uma escura numa sequencia que
            alternava do inicio ao fim, e alternancia nao sobrevive a essa
            troca: duas emendas passam a ligar superficies da mesma familia
            (caminhos->fechamento, os dois claros; oferta->rodape, os dois
            escuros). Onde a superficie nao muda nao ha emenda pra marcar, e
            as duas ficam sem recorte — ver `.site-band--no-notch` no
            globals.css, que generaliza a antiga excecao do rodape. */}
        <Fechamento />
        <Oferta />
      </main>
      <FloatingCta />
      <Footer />
    </>
  );
}
