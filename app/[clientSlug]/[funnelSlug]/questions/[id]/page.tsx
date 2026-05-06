import { notFound } from 'next/navigation';
import { QuestionCard } from '@/components/QuestionCard';
import { getFunnel, listFunnelSlugs } from '@/lib/funnels/registry';
import { basePath } from '@/lib/funnels/shared/branching';

type Params = Promise<{ clientSlug: string; funnelSlug: string; id: string }>;

export function generateStaticParams() {
  const out: { clientSlug: string; funnelSlug: string; id: string }[] = [];
  for (const slugs of listFunnelSlugs()) {
    const funnel = getFunnel(slugs.clientSlug, slugs.funnelSlug)!;
    for (const q of funnel.questions) {
      // skip the first question (rendered on landing) for V1
      if (funnel.flow[0]?.type === 'question' && funnel.flow[0]?.id === q.id) continue;
      out.push({ ...slugs, id: q.id });
    }
  }
  return out;
}

export default async function QuestionPage({ params }: { params: Params }) {
  const { clientSlug, funnelSlug, id } = await params;
  const funnel = getFunnel(clientSlug, funnelSlug);
  if (!funnel) notFound();

  const question = funnel.questions.find((q) => q.id === id);
  if (!question) notFound();

  // back nav: previous step in flow
  const idx = funnel.flow.findIndex((s) => s.type === 'question' && s.id === id);
  const prev = idx > 0 ? funnel.flow[idx - 1] : undefined;
  const backHref = prev
    ? prev.type === 'question'
      ? (idx === 1 ? basePath(funnel) : `${basePath(funnel)}/questions/${prev.id}`)
      : `${basePath(funnel)}/${prev.type}/${prev.id}`
    : basePath(funnel);

  return <QuestionCard question={question} backHref={backHref} />;
}
