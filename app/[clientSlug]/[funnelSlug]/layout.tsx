import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { getFunnel, listFunnelSlugs } from '@/lib/funnels/registry';
import { FunnelProvider } from '@/components/FunnelProvider';

export function generateStaticParams() {
  return listFunnelSlugs();
}

type Params = Promise<{ clientSlug: string; funnelSlug: string }>;

export default async function FunnelLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { clientSlug, funnelSlug } = await params;
  const funnel = getFunnel(clientSlug, funnelSlug);
  if (!funnel) notFound();

  return (
    <FunnelProvider funnel={funnel}>
      <Header brand={funnel.brand} />
      <main>{children}</main>
    </FunnelProvider>
  );
}
