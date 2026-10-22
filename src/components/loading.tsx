export function Loading() {
  return (
    <div className="container loading-page" role="status" aria-label="পণ্যের তথ্য লোড হচ্ছে">
      <div className="skeleton skeleton-title" />
      <div className="product-grid">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="panel loading-card">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        ))}
      </div>
      <span className="sr-only">পণ্যের তথ্য লোড হচ্ছে…</span>
    </div>
  );
}
