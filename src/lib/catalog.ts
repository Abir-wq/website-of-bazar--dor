import snapshot from '@/data/products.json';
export type Product = (typeof snapshot)[number];
export const categories = [
  { slug: 'chal', name: 'চাল', icon: '🍚' },
  { slug: 'dal', name: 'ডাল', icon: '🫘' },
  { slug: 'tel', name: 'তেল', icon: '🛢️' },
  { slug: 'sobji', name: 'সবজি', icon: '🥬' },
  { slug: 'mach', name: 'মাছ', icon: '🐟' },
  { slug: 'mangsho', name: 'মাংস', icon: '🍗' },
  { slug: 'dim-dudh', name: 'ডিম-দুধ', icon: '🥛' },
  { slug: 'moshla', name: 'মসলা', icon: '🌶️' },
];
// Use the source API's category slugs; labels stay consistent with the design.
for (const c of categories) {
  const product = snapshot.find(
    (p) =>
      p.categoryNameBn === c.name || (c.name === 'ডিম-দুধ' && /ডিম|দুধ/.test(p.categoryNameBn)),
  );
  if (product) c.slug = product.category;
}
export function bn(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('bn-BD', { maximumFractionDigits }).format(value);
}
export function unit(value: string) {
  return (
    (
      {
        kg: 'কেজি',
        liter: 'লিটার',
        litre: 'লিটার',
        l: 'লিটার',
        dozen: 'ডজন',
        piece: 'পিস',
        pcs: 'পিস',
      } as Record<string, string>
    )[value] || value
  );
}
export function changePercent(value: number) {
  return bn(Math.abs(value), 1).includes('٫')
    ? bn(Math.abs(value), 1)
    : new Intl.NumberFormat('bn-BD', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
        Math.abs(value),
      );
}
export function sortProducts(products: Product[], order: string) {
  return [...products].sort((a, b) =>
    order === 'asc' ? a.today - b.today : order === 'desc' ? b.today - a.today : 0,
  );
}
export function movers(products: Product[], direction: 'up' | 'down') {
  return products
    .filter((p) => p.change.dir === direction)
    .sort((a, b) =>
      direction === 'up' ? b.change.pct - a.change.pct : a.change.pct - b.change.pct,
    )
    .slice(0, 6);
}
export function marketSummary(p: Product) {
  const min = Math.min(...p.markets.map((m) => m.min));
  const max = Math.max(...p.markets.map((m) => m.max));
  const average = p.markets.reduce((n, m) => n + (m.min + m.max) / 2, 0) / p.markets.length;
  return { min, max, average };
}
export const fallbackProducts = snapshot as Product[];
