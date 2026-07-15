import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Modulos } from '@/components/sections/Modulos';
import { Evolucao } from '@/components/sections/Evolucao';
import { TiraDuvidas } from '@/components/sections/TiraDuvidas';
import { Oferta } from '@/components/sections/Oferta';
import { Footer } from '@/components/sections/Footer';
import { MainCard } from '@/components/layout/MainCard';

export default function Home() {
  return (
    <>
      <Header />
      <MainCard>
        <Hero />
        <Modulos />
        <Evolucao />
        <TiraDuvidas />
        <Oferta />
      </MainCard>
      <Footer />
    </>
  );
}
