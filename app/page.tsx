import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Dores } from '@/components/sections/Dores';
import { Modulos } from '@/components/sections/Modulos';
import { Evolucao } from '@/components/sections/Evolucao';
import { Caminhos } from '@/components/sections/Caminhos';
import { Oferta } from '@/components/sections/Oferta';
import { Faq } from '@/components/sections/Faq';
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
        <Oferta />
        <Faq />
      </main>
      <FloatingCta />
      <Footer />
    </>
  );
}
