'use client';

import { MagneticButton } from '@/components/motion/MagneticButton';
import { useHeroPassed } from '@/components/motion/useHeroPassed';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { Button } from '@/components/ui/Button';
import { SectionNav } from '@/components/ui/SectionNav';
import { content } from '@/lib/content';

/**
 * A barra em que o header SE TRANSFORMA quando o hero acaba. Nao e um
 * segundo elemento que aparece por conta propria: ela ocupa a mesma vaga no
 * topo (top-4 / sm:top-5), com a mesma largura, o mesmo raio, a mesma borda,
 * o mesmo fundo e a mesma sombra do header, e entra vindo de -translate-y-28,
 * que e exatamente pra onde o header sai. Na metade dos 500ms os dois estao
 * na mesma posicao com opacidade complementar — le como um objeto so trocando
 * de conteudo, nao como um sumindo e outro nascendo.
 *
 * O gatilho vem do useHeroPassed, o MESMO que esconde o header. Isso e o que
 * garante que nao exista quadro com dois no topo nem quadro com nenhum.
 *
 * O QUE SAIU DAQUI, e por que:
 *
 * - o limiar de 70% da primeira tela. Ele fazia a barra aparecer ANTES do
 *   header sair, o que era inofensivo com um em cima e outro embaixo e vira
 *   colisao com os dois no topo;
 * - a regra de sumir quando o card de preco estava na tela. Ela existia
 *   porque, na base da tela, a barra repetia o botao que ja estava visivel
 *   logo acima. No topo o cliente pediu que a barra FIQUE ("assim que acabar
 *   o hero o header vira essa barra visivel"), e o motivo pesa menos: um
 *   header que some ao chegar na ultima secao deixaria a pagina terminar sem
 *   nada no topo e sem navegacao. O preco aparecer na barra e no card e o
 *   preco a pagar, e e o barato dos dois.
 *
 * Com as duas regras foi junto o listener de scroll com requestAnimationFrame:
 * o IntersectionObserver do hook faz o mesmo trabalho sem rodar a cada quadro.
 */
export function FloatingCta() {
  // O mesmo instante que esconde o header, pelo mesmo hook — nao um gatilho
  // parecido. Ver useHeroPassed pra por que duas copias quebrariam calado.
  const isVisible = useHeroPassed();
  const reducedMotion = useReducedMotion();
  const cta = content.floatingCta;

  const motionClasses = reducedMotion
    ? 'translate-y-0 transition-none'
    : isVisible
      ? 'translate-y-0 transition-[opacity,transform] duration-500 ease-out'
      : '-translate-y-28 transition-[opacity,transform] duration-500 ease-out';

  return (
    <aside
      aria-hidden={!isVisible}
      aria-label='Inscrição no curso TedTech'
      data-floating-cta
      data-visible={isVisible ? 'true' : 'false'}
      className={`fixed inset-x-0 top-4 z-40 px-4 ${motionClasses} ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      } sm:top-5 sm:px-6`}
    >
      <div className='mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 rounded-[1.5rem] border border-blue/25 bg-[#f7fbff] px-3 py-3 text-[#07111f] shadow-[0_20px_64px_rgba(30,158,219,0.48)] sm:rounded-[2rem] sm:px-5 md:grid md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-6 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto]'>
        {/* No celular a barra e "R$ 297 · Inscrever": o preco ocupa o lugar
            do texto de urgencia, que so aparece de sm pra cima. */}
        <div className='flex min-w-0 items-center gap-2.5'>
          <span
            aria-hidden
            className='h-2.5 w-2.5 shrink-0 rounded-full bg-blue shadow-[0_0_14px_rgba(30,158,219,0.7)]'
          />
          <span className='text-base font-extrabold text-blue sm:hidden'>
            {content.offer.priceNow}
          </span>
          <p className='hidden text-[11px] font-bold leading-tight sm:block sm:text-sm'>
            {cta.urgency}
          </p>
        </div>

        {/* Os mesmos atalhos do header. Nao e redundancia: o header some
            quando o hero sai da tela, entao do meio da pagina em diante esta
            barra e a UNICA navegacao que existe. Antes, quem descia nao tinha
            como voltar pra uma secao sem rolar de volta ate o topo.

            So a partir de xl (1280px): abaixo disso a barra divide a largura
            com urgencia, preco e botao, e os atalhos nao entram sem espremer
            quem paga a conta.

            Escondido, nao consome celula do grid — `hidden` e display:none, e
            item nenhum ocupa coluna. E por isso que o grid de md segue com
            tres colunas certinhas e so o de xl tem quatro. */}
        <SectionNav
          label='Atalhos para as seções'
          interactive={isVisible}
          className='hidden gap-0.5 text-[13px] text-[#3b4654] xl:flex'
          linkClassName='px-2.5 py-1.5'
        />

        <div className='hidden items-baseline gap-2 md:flex'>
          <span className='text-lg font-extrabold text-blue'>
            {content.offer.priceNow}
          </span>
          <span className='text-xs text-[#526071]'>
            {content.offer.installments}
          </span>
        </div>

        <MagneticButton className='shrink-0'>
          <Button
            href={content.checkoutUrl}
            variant='primary'
            tabIndex={isVisible ? undefined : -1}
          >
            {cta.cta}
          </Button>
        </MagneticButton>
      </div>
    </aside>
  );
}
