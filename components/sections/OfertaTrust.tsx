import { content } from '@/lib/content';

export function OfertaTrust() {
  const t = content.offer.trust;
  const rows = [t.checkout, t.access, t.payments].filter((value) => value !== '');
  const hasGuarantee = t.guarantee.title !== '' && t.guarantee.desc !== '';

  return (
    <div className="mt-6 border-t border-blue/15 pt-5 text-left">
      {hasGuarantee && (
        <div className="flex items-start gap-2.5">
          <span className="text-blue" aria-hidden>🛡</span>
          <div>
            <div className="text-xs font-bold text-[color:var(--band-fg-strong)] md:text-sm">
              {t.guarantee.title}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-[color:var(--band-fg-faint)] md:text-xs">
              {t.guarantee.desc}
            </p>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <ul className={hasGuarantee ? 'mt-4 space-y-1.5' : 'space-y-1.5'}>
          {rows.map((row) => (
            <li
              key={row}
              data-trust-row
              className="flex items-center gap-2 text-[11px] text-[color:var(--band-fg-faint)] md:text-xs"
            >
              <span className="text-blue" aria-hidden>✓</span>
              <span>{row}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
