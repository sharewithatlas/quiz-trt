'use client';

import { Placeholder } from './Placeholder';
import { useFunnel } from './FunnelProvider';

// Compliance footer rendered on every funnel page.
// Drop in the client-approved legal links / disclaimer / entity text via
// content/<client>/brand.ts -> BRAND.footer.
export function Footer() {
  const funnel = useFunnel();
  const f = funnel.brand.footer;

  // If brand.footer isn't declared at all, render nothing (lets specific
  // landings opt out by setting brand.footer = undefined explicitly).
  if (!f) return null;

  return (
    <footer className="mt-12 border-t border-ink/10 bg-cream py-8">
      <div className="mx-auto max-w-prose px-4 space-y-4 text-xs text-ink-700">
        {f.legalLinks ? (
          <p className="whitespace-pre-wrap">{f.legalLinks}</p>
        ) : (
          <Placeholder name="brand.footer.legalLinks" description="Legal nav links (Terms · Privacy · Shipping · Pharmacy …)" />
        )}

        {f.disclaimer ? (
          <p className="whitespace-pre-wrap">{f.disclaimer}</p>
        ) : (
          <Placeholder name="brand.footer.disclaimer" description="FDA / results-vary / medical disclaimer paragraph" height="60px" />
        )}

        {f.entity ? (
          <p className="whitespace-pre-wrap">{f.entity}</p>
        ) : (
          <Placeholder name="brand.footer.entity" description="Company name + address + entity / professional-corporation info" height="60px" />
        )}
      </div>
    </footer>
  );
}
