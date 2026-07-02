'use client';

import type { ReactNode } from 'react';
import { trackButtonGlow } from '@/components/ui/glow';

type Variant = 'primary' | 'whatsapp';

const base =
  'glow-button inline-flex min-h-[36px] items-center justify-center gap-2 rounded-lg px-4 py-1.5 font-sans text-[11px] font-semibold';

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
      : 'bg-blue text-white shadow-lg shadow-blue/25';
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
