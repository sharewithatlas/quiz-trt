import { redirect } from 'next/navigation';

// Default landing — redirect to the first/primary funnel.
// Adjust as more clients/funnels come online.
export default function Home() {
  redirect('/lifeforce/trt');
}
