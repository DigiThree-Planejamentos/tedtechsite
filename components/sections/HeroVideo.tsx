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
  const topNotchHeight = clamp(height * 0.12, 40, 56);
  const topRadius = Math.min(28, topNotchHeight / 2);
  const cornerRadius = topRadius;

  const mobile = width < 480;
  const bottomNotchWidth = clamp(width * 0.27, mobile ? 88 : 124, mobile ? 116 : 188);
  const bottomNotchHeight = clamp(height * 0.12, mobile ? 40 : 44, mobile ? 48 : 60);
  const bottomRadius = Math.min(28, bottomNotchHeight / 2);
  const bottomNotchLeft = (width - bottomNotchWidth) / 2 + width * 0.1;
  const bottomNotchRight = bottomNotchLeft + bottomNotchWidth;
  const bottomNotchTop = height - bottomNotchHeight;
  const sideDepth = clamp(width * 0.08, mobile ? 32 : 40, mobile ? 48 : 60);
  const sideRadius = sideDepth * (32 / 92);
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
    `L ${n(width - topRadius)} ${n(topNotchHeight)}`,
    `A ${n(topRadius)} ${n(topRadius)} 0 0 1 ${n(width)} ${n(topNotchHeight + topRadius)}`,
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
