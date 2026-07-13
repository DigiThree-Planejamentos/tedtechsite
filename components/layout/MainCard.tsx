import type { ReactNode } from 'react';

export function MainCard({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-10 px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28">
      <div className="site-card mx-auto max-w-[1280px]">{children}</div>
    </main>
  );
}
