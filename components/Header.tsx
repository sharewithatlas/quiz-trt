import Link from 'next/link';
import Image from 'next/image';
import { BRAND } from '@/content/brand';

export function Header() {
  return (
    <header className="border-b border-ink/10 bg-cream py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4">
        <Link href="/trt" aria-label={BRAND.wordmark || 'Home'}>
          {BRAND.logoSrc ? (
            <Image src={BRAND.logoSrc} alt={BRAND.logoAlt || BRAND.wordmark} width={140} height={28} priority />
          ) : (
            <span className="text-xl font-bold tracking-widest text-ink">{BRAND.wordmark}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
