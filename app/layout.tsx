import type { Metadata } from 'next';
import './globals.css';
import { TrackingScripts } from '@/components/TrackingScripts';

export const metadata: Metadata = {
  title: 'Quiz Funnels',
  description: 'Multi-client quiz funnel system.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <TrackingScripts />
        {children}
      </body>
    </html>
  );
}
