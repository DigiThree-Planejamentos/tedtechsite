'use client';

import { useRef, useState } from 'react';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { GlowIconButton } from '@/components/ui/GlowIconButton';
import { content } from '@/lib/content';

/**
 * Painel de vídeo full-height do hero: vídeo do instrutor com overlay escuro
 * e a copy de credibilidade na base. Enquanto `videoSrc` está vazio, mostra
 * gradiente placeholder com o play decorativo (mesmo comportamento que a
 * antiga seção Instrutor tinha).
 */
export function HeroVideo() {
  const i = content.instrutor;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = i.videoSrc !== '';

  const handlePlay = () => {
    if (!hasVideo) return;
    void videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div
      data-video
      className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-blue/20 bg-[linear-gradient(145deg,#1a2438,#0b1220)] md:aspect-auto md:h-full"
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
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#dbe3ec]">
              {i.heroQuote}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
