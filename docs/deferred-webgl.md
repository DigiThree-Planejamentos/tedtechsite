# Efeitos WebGL adiados (aguardando imagens reais)

Estes dois efeitos do modelo trionn foram **deixados prontos para implementar depois**,
quando existirem imagens/vídeo reais. Decisão tomada em conjunto: com placeholders
procedurais eles ficariam "vazios", e o carrossel atual de Módulos já é forte.

O que **já existe** e deve ser reutilizado como base:
- `lib/glContext.ts` — `canUseGL()` e `capDPR()` (guards de WebGL).
- `components/webgl/CircuitHeroCanvas.tsx` — padrão de canvas com o ciclo de vida certo (rAF pausado fora
  da tela via IntersectionObserver, DPR limitado, cleanup completo, degradação em `try/catch`). Para a
  galeria/distorção em OGL, seguir a doc do `ogl` (o `ogl` já está instalado); um exemplo OGL de partículas
  existiu em `ParticleHeroCanvas.tsx` e está no histórico do git.
- `components/motion/RevealImage.tsx` — já tem a prop `effect?: 'clip' | 'mask'`; falta o ramo `gl-distort`.

---

## 1. Galeria 3D curvada dos Módulos (OGL)

**Depende de:** uma imagem por módulo.

Passos:
1. Adicionar campo opcional `image: string` em `interface Module` (`lib/content.ts`) e preencher os 6.
2. Criar `components/webgl/ModuleGallery3D.tsx` (host `'use client'` + `dynamic(() => import('./ModuleGallery3DCanvas'), { ssr:false })`)
   e `ModuleGallery3DCanvas.tsx` (OGL): 6 planos com textura das imagens, dispostos numa curva,
   posição dirigida pelo scroll horizontal + distorção no hover + arrasto (GSAP Draggable/Inertia — já instalados no gsap).
3. Montar dentro de `components/sections/Modulos.tsx` como camada decorativa **desktop-only**
   (gate `useIsTouch`/`useReducedMotion`/`canUseGL`), **por cima/atrás** da lista `<article>` existente,
   sincronizada ao `activeIndex` do stepper. A lista DOM continua como base acessível e fallback.
4. Não remover o carrossel atual — ele é o fallback de touch/reduced-motion e a base de SEO.

## 2. Distorção WebGL na mídia do Instrutor (OGL)

**Depende de:** foto e/ou vídeo do instrutor.

Passos:
1. Preencher `content.instructor.videoPoster` (imagem) e `videoSrc` (embed/mp4) em `lib/content.ts`.
2. Implementar o ramo `effect === 'gl-distort'` em `RevealImage.tsx`: montar um plano OGL sobre o `<img>`
   com deslocamento/RGB-shift seguindo o ponteiro e o scroll (guards de `lib/glContext.ts`; ciclo de vida
   do canvas como em `CircuitHeroCanvas.tsx`).
3. Em `components/sections/Instrutor.tsx`, trocar o `[data-video]` placeholder por
   `<RevealImage src={i.videoPoster} alt="Instrutor TedTech" effect="gl-distort" />` (desktop-only; mantém `<img alt>` real para SEO/fallback).

## Também disponível se quiser depois
- **Som (hover/click SFX)** com Howler (já instalado), como toggle no header **desligado por padrão**.
- **Three.js** está instalado mas não usado (consolidamos em OGL). Pode ser removido: `npm uninstall three`.
