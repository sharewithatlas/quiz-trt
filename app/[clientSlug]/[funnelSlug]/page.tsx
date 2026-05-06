import { notFound } from 'next/navigation';
import { getFunnel } from '@/lib/funnels/registry';
import { LandingView } from '@/components/funnel/LandingView';

type Params = Promise<{ clientSlug: string; funnelSlug: string }>;

export default async function FunnelLandingPage({ params }: { params: Params }) {
  const { clientSlug, funnelSlug } = await params;
  const funnel = getFunnel(clientSlug, funnelSlug);
  if (!funnel) notFound();

  if (funnel.flow.length === 0) {
    return (
      <section className="container-prose py-16 text-center">
        <h1 className="font-serif text-3xl text-ink">{funnel.displayName}</h1>
        <p className="mt-3 text-ink-700">Coming soon.</p>
      </section>
    );
  }

  return <LandingView />;
}
