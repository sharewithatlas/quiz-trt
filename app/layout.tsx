import type { Metadata } from 'next';
import './globals.css';
import { TrackingScripts } from '@/components/TrackingScripts';
import { BRAND } from '@/content/brand';

export const metadata: Metadata = {
  title: BRAND.title,
  description: BRAND.description
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
