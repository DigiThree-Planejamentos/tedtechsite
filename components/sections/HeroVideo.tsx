'use client';

import { useEffect, useRef, useState } from 'react';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { GlowIconButton } from '@/components/ui/GlowIconButton';
import { content } from '@/lib/content';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Mesmo desenho usado no hero da Zarpei: a moldura inteira e recortada por
 * um unico path SVG. Os flags 1/0 dos arcos alternam a curvatura e formam a
 * continuidade em S sem depender de elipses ou elementos sobrepostos.
 */
function buildHeroClipPath(width: number, height: number) {
  const topNotchWidth = clamp(width * 0.26, 72, 180);
  // A vertical deste recorte tem TRES partes somadas:
  //
  //     raio de cima  +  PAREDE RETA  +  raio de baixo
  //
  // Ate aqui a parede era ZERO, porque o raio era metade da profundidade —
  // com essa proporcao os dois arcos se encontram direto e o resultado e o
  // S continuo, o mesmo desenho do recorte esquerdo.
  //
  // O cliente pediu comprimento NO TRECHO RETO, nao mais profundidade. Com
  // a parede acima de zero o recorte passa a ter uma queda vertical de
  // verdade antes de virar, em vez de curvar desde o primeiro pixel. Isso
  // desfaz o S NESTE canto de proposito; o esquerdo segue S puro.
  //
  // Registro pra ninguem "consertar" isso de volta: duas tentativas antes
  // desta mexeram na medida errada — a profundidade total, 55.8 -> 67.4 ->
  // 81.8 — e nenhuma era o que ele queria.
  //
  // ATENCAO: topRadius e cornerRadius tem hoje a MESMA expressao, e isso e
  // coincidencia de valor, nao de significado. Um e a curva do recorte, o
  // outro e o canto da moldura. Nao unifique: foi justamente por estarem
  // amarrados que aumentar o recorte arredondava o painel junto.
  const topRadius = clamp(height * 0.06, 20, 28);
  const topNotchWall = clamp(height * 0.086, 14, 48);
  const topNotchHeight = topRadius * 2 + topNotchWall;
  // Os cantos da moldura deixam de ser herdados do recorte. A expressao da
  // os MESMOS valores de antes em qualquer altura — `min(28, clamp(h*0.12,
  // 40, 56)/2)` reduz a `clamp(h*0.06, 20, 28)` — entao a moldura fica pixel
  // a pixel como estava e so o recorte cresce.
  const cornerRadius = clamp(height * 0.06, 20, 28);

  const mobile = width < 480;
  // Teto menor no mobile: la o recorte encosta na faixa do nome do instrutor,
  // que fica na base do painel. Com 146 sobrava so ~13px entre o texto e a
  // borda do recorte — e o nome ainda e placeholder, entao um nome real mais
  // longo colidiria. Com 132 a folga volta pra ~20px.
  const bottomNotchWidth = clamp(width * 0.34, mobile ? 108 : 158, mobile ? 132 : 252);
  const bottomNotchHeight = clamp(height * 0.12, mobile ? 40 : 44, mobile ? 48 : 60);
  const bottomRadius = Math.min(28, bottomNotchHeight / 2);
  const bottomNotchLeft = (width - bottomNotchWidth) / 2 + width * 0.1;
  const bottomNotchRight = bottomNotchLeft + bottomNotchWidth;
  const bottomNotchTop = height - bottomNotchHeight;
  const sideDepth = clamp(width * 0.11, mobile ? 38 : 52, mobile ? 62 : 84);
  // Metade da profundidade, mesma regra do topRadius (topNotchHeight / 2) do
  // recorte da direita: raio = metade do degrau e os dois arcos se encontram
  // sem reta no meio, formando o S continuo. Com a proporcao antiga (32/92)
  // sobrava uma reta de ~18px entre os arcos — virava prateleira, nao S — e
  // ainda esmagava o arredondamento do topo (sideTopInnerY caia pra 9px).
  const sideRadius = sideDepth / 2;
  const sideHeight = clamp(
    height * (mobile ? 0.46 : 0.56),
    mobile ? 104 : 144,
    mobile ? 140 : 216,
  );
  const previousSideTop = height * 0.01;
  const sideTopOpeningX = sideDepth + sideRadius;
  const sideVerticalOffset = -32;
  const sideBottom = Math.min(
    height - cornerRadius,
    previousSideTop + sideHeight - 16 + sideVerticalOffset,
  );

  const topNotchX = width - topNotchWidth;
  // Onde a parede reta termina e o arco de baixo comeca. Como a
  // profundidade e `topRadius * 2 + topNotchWall`, isto da exatamente
  // `topRadius + topNotchWall` — ou seja, o comprimento da parede e a
  // distancia entre este ponto e o fim do primeiro arco. Com a parede em
  // zero os dois coincidem e o desenho volta a ser o S continuo.
  const topNotchInnerY = Math.max(topNotchHeight - topRadius, topRadius);
  const sidePlateauY = sideBottom - sideRadius;
  const sideInnerY = sideBottom - sideRadius * 2;
  const sideTopInnerY = Math.max(8, sideRadius * 2 + sideVerticalOffset);

  const n = (value: number) => value.toFixed(1);

  const commands = [
    `M ${n(sideTopOpeningX)} 0`,
    `L ${n(topNotchX - topRadius)} 0`,
    `A ${n(topRadius)} ${n(topRadius)} 0 0 1 ${n(topNotchX)} ${n(topRadius)}`,
    `L ${n(topNotchX)} ${n(topNotchInnerY)}`,
    `A ${n(topRadius)} ${n(topRadius)} 0 0 0 ${n(topNotchX + topRadius)} ${n(topNotchHeight)}`,
    // cornerRadius, nao topRadius: este e o canto externo do painel, irmao
    // dos dois de baixo, e nao uma curva do recorte. Enquanto os dois valores
    // eram iguais dava no mesmo; agora que o recorte e mais fundo, herdar
    // topRadius deixaria so este canto ~20% mais redondo que os outros tres.
    `L ${n(width - cornerRadius)} ${n(topNotchHeight)}`,
    `A ${n(cornerRadius)} ${n(cornerRadius)} 0 0 1 ${n(width)} ${n(topNotchHeight + cornerRadius)}`,
    `L ${n(width)} ${n(height - cornerRadius)}`,
    `A ${n(cornerRadius)} ${n(cornerRadius)} 0 0 1 ${n(width - cornerRadius)} ${n(height)}`,
    `L ${n(bottomNotchRight + bottomRadius)} ${n(height)}`,
    `A ${n(bottomRadius)} ${n(bottomRadius)} 0 0 1 ${n(bottomNotchRight)} ${n(height - bottomRadius)}`,
    `L ${n(bottomNotchRight)} ${n(bottomNotchTop + bottomRadius)}`,
    `A ${n(bottomRadius)} ${n(bottomRadius)} 0 0 0 ${n(bottomNotchRight - bottomRadius)} ${n(bottomNotchTop)}`,
    `L ${n(bottomNotchLeft + bottomRadius)} ${n(bottomNotchTop)}`,
    `A ${n(bottomRadius)} ${n(bottomRadius)} 0 0 0 ${n(bottomNotchLeft)} ${n(bottomNotchTop + bottomRadius)}`,
    `L ${n(bottomNotchLeft)} ${n(height - bottomRadius)}`,
    `A ${n(bottomRadius)} ${n(bottomRadius)} 0 0 1 ${n(bottomNotchLeft - bottomRadius)} ${n(height)}`,
    `L ${n(cornerRadius)} ${n(height)}`,
    `A ${n(cornerRadius)} ${n(cornerRadius)} 0 0 1 0 ${n(height - cornerRadius)}`,
    `L 0 ${n(sideBottom)}`,
    `A ${n(sideRadius)} ${n(sideRadius)} 0 0 1 ${n(sideRadius)} ${n(sidePlateauY)}`,
    `L ${n(sideDepth - sideRadius)} ${n(sidePlateauY)}`,
    `A ${n(sideRadius)} ${n(sideRadius)} 0 0 0 ${n(sideDepth)} ${n(sideInnerY)}`,
    `L ${n(sideDepth)} ${n(sideTopInnerY)}`,
    `Q ${n(sideDepth)} 0 ${n(sideTopOpeningX)} 0`,
    'Z',
  ];

  return `path('${commands.join(' ')}')`;
}

/**
 * Painel de vídeo do hero, em proporção fixa 16:10 em todos os breakpoints
 * (mesmo vídeo gravado uma única vez, sem recorte diferente por tamanho de
 * tela). Overlay escuro com a copy de credibilidade na base. Enquanto
 * `videoSrc` está vazio, mostra gradiente placeholder com o play decorativo.
 */
export function HeroVideo() {
  const i = content.instrutor;
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [clipPath, setClipPath] = useState<string | null>(null);
  const hasVideo = i.videoSrc !== '';

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateClipPath = () => {
      if (!frame.clientWidth || !frame.clientHeight) return;
      setClipPath(buildHeroClipPath(frame.clientWidth, frame.clientHeight));
    };

    updateClipPath();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateClipPath);
      return () => window.removeEventListener('resize', updateClipPath);
    }

    const observer = new ResizeObserver(updateClipPath);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    if (!hasVideo) return;
    void videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div
      ref={frameRef}
      data-video
      className="hero-video-frame relative aspect-[16/10] min-w-0 w-full self-center overflow-hidden bg-[linear-gradient(145deg,#1a2438,#0b1220)] md:-translate-y-6 lg:-translate-y-10"
      style={{
        clipPath: clipPath ?? undefined,
        WebkitClipPath: clipPath ?? undefined,
        borderRadius: clipPath ? 0 : undefined,
      }}
    >
      {hasVideo && (
        <video
          ref={videoRef}
          src={i.videoSrc}
          poster={i.videoPoster}
          controls={playing}
          playsInline
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {!playing && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(rgba(5,9,20,.18),rgba(5,9,20,.3)_55%,rgba(5,9,20,.88))]"
          />

          <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
            <MagneticButton>
              <GlowIconButton
                type="button"
                aria-label="Assistir apresentação do instrutor"
                onClick={handlePlay}
                className="grid h-16 w-16 place-items-center rounded-full border border-blue/50 bg-[rgba(5,9,20,.35)] text-2xl text-blue"
              >
                ▶
              </GlowIconButton>
            </MagneticButton>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-6">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue">
              {i.label}
            </div>
            <div className="mt-1 text-lg font-extrabold text-white md:text-xl">
              {i.name}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
