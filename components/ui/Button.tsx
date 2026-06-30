'use client';

import type { ReactNode } from 'react';
import { trackButtonGlow } from '@/components/ui/glow';

type Variant = 'primary' | 'whatsapp';

const base =
  'glow-button inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-6 font-sans text-[15px] font-semibold';

export function Button({
  href,
  variant = 'primary',
  children,
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
}) {
  const style =
    variant === 'whatsapp'
      ? 'glow-button--whatsapp border border-wa/50 text-wa'
      : 'border border-blue/50 text-text shadow-lg shadow-blue/10';
  return (
    <a
      href={href}
      className={`${base} ${style}`}
      onPointerMove={trackButtonGlow}
    >
      {children}
    </a>
  );
}
