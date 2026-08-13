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
import { MainCard } from '@/components/layout/MainCard';

export default function Home() {
  return (
    <>
      <Header />
      <MainCard>
        <Hero />
        <Dores />
        <Modulos />
        <Evolucao />
        <Caminhos />
        <Oferta />
        <Faq />
      </MainCard>
      <FloatingCta />
      <Footer />
    </>
  );
}
