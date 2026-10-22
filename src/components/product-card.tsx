import Link from 'next/link';
import { bn, changePercent, unit, type Product } from '@/lib/catalog';
export function ChangeBadge({ product: p }: { product: Product }) {
  return (
    <span
      className={`change ${p.change.dir}`}
      aria-label={`দামের পরিবর্তন ${changePercent(p.change.pct)} শতাংশ`}
    >
      {p.change.dir === 'up' ? '▲' : p.change.dir === 'down' ? '▼' : '—'}{' '}
      {changePercent(p.change.pct)}%
    </span>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link
      href={`/product/${p.slug}`}
      className="product-card panel"
      aria-label={`${p.nameBn}, ${bn(p.today)} টাকা প্রতি ${unit(p.unit)}`}
    >
      <div className="product-top">
        <span className="product-emoji" aria-hidden="true">
          {p.image}
        </span>
        <div>
          <h3>{p.nameBn}</h3>
          <p>প্রতি {unit(p.unit)}</p>
        </div>
      </div>
      <div className="price-row">
        <div>
          <span className="price-label">আজকের দাম</span>
          <p className="price">
            <strong>{bn(p.today)}</strong> টাকা
          </p>
        </div>
        <ChangeBadge product={p} />
      </div>
    </Link>
  );
}
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
