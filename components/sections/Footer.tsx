import { Logo } from '@/components/ui/Logo';
import { Reveal } from '@/components/motion/Reveal';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { BackToTop } from '@/components/motion/BackToTop';
import { content } from '@/lib/content';

export function Footer() {
  const f = content.footer;
  return (
    /* Rodape escuro pela mesma via das faixas escuras da pagina: `site-band
       site-band--dark` deixa o fundo TRANSPARENTE e quem aparece e o canvas
       de circuitos atras de tudo. Pintar um escuro chapado aqui daria um
       retangulo morto no fim da pagina, destoando das outras faixas escuras.

       Vem junto o jogo de tokens (--band-fg*), que e o que deixa o texto
       inverter sozinho em vez de espalhar hex claro por dez lugares.

       Recorte na base ele NAO leva — regra `footer.site-band--dark::after`
       no globals.css. Ele e o fim da pagina; nao ha proxima superficie. */
    <footer className="site-band site-band--dark px-5 py-12">
      <Reveal
        variant="simple"
        /* `top bottom` em vez do default `top 85%`: o rodape e a ultima
           coisa do documento, entao o topo dele para de subir quando a
           rolagem acaba. Em tela de menos de ~773px de altura ele nunca
           cruzava os 85% e o conteudo ficava invisivel pra sempre — bug que
           existia antes do rodape virar escuro, so que numa faixa branca
           vazia em vez de escura. Entrar na tela basta. */
        start="top bottom"
        className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <BackToTop className="block cursor-pointer rounded-md transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue">
            <Logo />
          </BackToTop>
          <p className="mt-2 max-w-xs text-sm text-[color:var(--band-fg-muted)] md:text-[15px]">{f.tagline}</p>
        </div>
        <div className="flex flex-col gap-6 text-sm text-[color:var(--band-fg-muted)] sm:flex-row sm:gap-12 md:text-[15px]">
          <div>
            <div className="font-mono">{f.cnpj}</div>
            <div className="mt-1 font-mono">{f.email}</div>
            <a
              href={f.phone.href}
              className="mt-1 block font-mono transition-colors hover:text-[color:var(--band-fg-strong)]"
            >
              Tel. {f.phone.label}
            </a>
          </div>
          <div className="flex flex-col gap-1">
            {f.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                className="transition-colors hover:text-[color:var(--band-fg-strong)]"
              >
                {l.label}
              </a>
            ))}
            {f.socials.map((s) => (
              <MagneticButton key={s.label} className="block">
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="transition-colors hover:text-[color:var(--band-fg-strong)]"
                >
                  {s.label}
                </a>
              </MagneticButton>
            ))}
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
