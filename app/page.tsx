import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Identificacao } from '@/components/sections/Identificacao';
import { Modulos } from '@/components/sections/Modulos';
import { Evolucao } from '@/components/sections/Evolucao';
import { Instrutor } from '@/components/sections/Instrutor';
import { TiraDuvidas } from '@/components/sections/TiraDuvidas';
import { Oferta } from '@/components/sections/Oferta';
import { CtaFinal } from '@/components/sections/CtaFinal';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Identificacao />
        <Modulos />
        <Evolucao />
        <Instrutor />
        <TiraDuvidas />
        <Oferta />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
