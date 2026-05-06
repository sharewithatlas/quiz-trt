import Link from 'next/link';
import Image from 'next/image';
import type { BrandConfig } from '@/lib/funnels/shared/types';

export function Header({ brand }: { brand: BrandConfig }) {
  const wordmark = brand.wordmark || 'BRAND';
  return (
    <header className="border-b border-ink/10 bg-cream py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4">
        <Link href="/" aria-label={wordmark}>
          {brand.logoSrc ? (
            <Image src={brand.logoSrc} alt={brand.logoAlt || wordmark} width={140} height={28} priority />
          ) : (
            <span className="text-xl font-bold tracking-widest text-ink">{wordmark}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
