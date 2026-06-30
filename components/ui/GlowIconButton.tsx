'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { trackButtonGlow } from '@/components/ui/glow';

interface GlowIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GlowIconButton({
  children,
  className = '',
  onPointerMove,
  ...props
}: GlowIconButtonProps) {
  return (
    <button
      {...props}
      className={`glow-button ${className}`}
      onPointerMove={(event) => {
        trackButtonGlow(event);
        onPointerMove?.(event);
      }}
    >
      {children}
    </button>
  );
}
