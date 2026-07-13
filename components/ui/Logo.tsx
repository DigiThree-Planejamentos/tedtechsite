import Image from 'next/image';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`block shrink-0 ${
        compact ? 'w-[92px] sm:w-[112px]' : 'w-[116px] sm:w-[142px]'
      }`}
    >
      <Image
        src="/tedtech-logo.png"
        alt="TedTech"
        width={1189}
        height={349}
        priority
        className="h-auto w-full"
      />
    </span>
  );
}
