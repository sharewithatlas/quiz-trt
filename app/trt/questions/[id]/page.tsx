import { notFound } from 'next/navigation';
import { QuestionCard } from '@/components/QuestionCard';
import { getQuestion, QUESTIONS } from '@/lib/quiz-data';

export function generateStaticParams() {
  return QUESTIONS.filter((q) => q.id >= 2).map((q) => ({ id: String(q.id) }));
}

type RouteParams = Promise<{ id: string }>;

export default async function QuestionPage({ params }: { params: RouteParams }) {
  const { id } = await params;
  const numId = Number(id);
  const question = getQuestion(numId);
  if (!question || numId < 2) notFound();

  const lastQuestionId = Math.max(...QUESTIONS.map((q) => q.id));
  const nextHref = numId === lastQuestionId ? '/trt/submit' : `/trt/questions/${numId + 1}`;
  const backHref = numId === 2 ? '/trt' : `/trt/questions/${numId - 1}`;

  return <QuestionCard question={question} nextHref={nextHref} backHref={backHref} />;
}
