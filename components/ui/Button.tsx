'use client';

import type { ReactNode } from 'react';
import { trackButtonGlow } from '@/components/ui/glow';

type Variant = 'primary' | 'whatsapp';

const base =
  'glow-button inline-flex min-h-[40px] items-center justify-center gap-2 rounded-[1.15rem] border border-blue/25 px-4 py-1.5 font-sans text-[11px] font-semibold shadow-[0_8px_24px_rgba(15,42,81,0.14)] transition-[background,border-color,box-shadow,color,transform] duration-200 ease-out';

export function Button({
  href,
  variant = 'primary',
  tabIndex,
  children,
}: {
  href: string;
  variant?: Variant;
  tabIndex?: number;
  children: ReactNode;
}) {
  const style =
    variant === 'whatsapp'
      ? 'glow-button--whatsapp bg-wa text-white hover:border-wa/50 hover:bg-[#20ba5a]'
      : 'bg-blue text-white shadow-[0_10px_28px_rgba(30,158,219,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] hover:border-blue/40 hover:bg-[#178fca]';
  return (
    <a
      href={href}
      tabIndex={tabIndex}
      className={`${base} ${style}`}
      onPointerMove={trackButtonGlow}
    >
      {children}
    </a>
  );
}
