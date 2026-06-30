import type { ReactNode } from 'react';

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-blue">
      {children}
    </span>
  );
}
