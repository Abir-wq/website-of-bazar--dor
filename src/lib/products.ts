import 'server-only';
import { fallbackProducts, type Product } from './catalog';
import { cache } from 'react';
export type Catalog = { products: Product[]; isSnapshot: boolean };
function validProducts(data: unknown): data is Product[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (p) =>
        p &&
        typeof p.id === 'number' &&
        typeof p.slug === 'string' &&
        typeof p.nameBn === 'string' &&
        typeof p.today === 'number' &&
        Number.isFinite(p.today) &&
        typeof p.unit === 'string' &&
        typeof p.category === 'string' &&
        typeof p.image === 'string' &&
        p.change &&
        typeof p.change.pct === 'number' &&
        ['up', 'down', 'flat'].includes(p.change.dir) &&
        Array.isArray(p.markets) &&
        p.markets.length > 0 &&
        p.markets.every(
          (m: Record<string, unknown>) =>
            typeof m.min === 'number' &&
            typeof m.max === 'number' &&
            typeof m.market === 'string' &&
            typeof m.division === 'string',
        ),
    )
  );
}
export const getCatalog = cache(async (): Promise<Catalog> => {
  const bases = [
    process.env.BAZAR_API_URL,
    'https://openapi.programming-hero.com/api/bazardor',
    'https://api.api-store.workers.dev/api/bazardor',
    'https://api.abcz.workers.dev/api/bazardor',
  ].filter(Boolean) as string[];
  for (const base of bases) {
    try {
      const res = await fetch(`${base.replace(/\/$/, '')}/products`, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(3500),
      });
      if (!res.ok) continue;
      const data: unknown = await res.json();
      if (validProducts(data)) return { products: data, isSnapshot: false };
    } catch {
      /* Try the next documented upstream, then the bundled source snapshot. */
    }
  }
  return { products: fallbackProducts, isSnapshot: true };
});
