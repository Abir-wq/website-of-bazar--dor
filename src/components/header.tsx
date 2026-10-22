'use client';
import Link from 'next/link';
import { CartLink } from '@/components/cart';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { bn, categories, changePercent, unit, type Product } from '@/lib/catalog';
function Today() {
  const [date, setDate] = useState('');
  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat('bn-BD', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Dhaka',
      }).format(new Date()),
    );
  }, []);
  return <span suppressHydrationWarning>{date || 'আজকের বাজারের দাম'}</span>;
}
export function Header({ products }: { products: Product[] }) {
  const pathname = usePathname(),
    router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    function close(e: PointerEvent) {
      if (menu.current && !menu.current.contains(e.target as Node)) setOpen(false);
    }
    function key(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', key);
    };
  }, []);
  async function logout() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error('সাইন আউট করা যায়নি।');
        return;
      }
      setOpen(false);
      toast.success('সাইন আউট হয়েছে।');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  }
  return (
    <header className="site-header">
      <div className="header-main container">
        <Link href="/" className="brand" aria-label="বাজার দর হোম">
          <img src="/images/logo-icon.png" width="40" height="40" alt="" />
          <div>
            <span className="brand-title">বাজার দর</span>
            <p className="brand-date">
              <Today />
            </p>
          </div>
        </Link>
        <div className="auth-nav">
          <CartLink />
          {isPending ? (
            <span className="auth-placeholder skeleton" />
          ) : session ? (
            <div className="user-menu" ref={menu}>
              <button
                className="user-trigger"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls="account-menu"
              >
                <Avatar name={session.user.name} image={session.user.image} />
                <span>{session.user.name.split(' ')[0]}</span>
                <span className="tiny-arrow">▾</span>
              </button>
              {open && (
                <div className="menu-panel panel" id="account-menu">
                  <strong>{session.user.name}</strong>
                  <p className="muted">{session.user.email}</p>
                  <Link href="/profile">👤 আমার প্রোফাইল</Link>
                  <button className="logout-link" onClick={logout} disabled={busy}>
                    ↩ {busy ? 'সাইন আউট হচ্ছে…' : 'সাইন আউট'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className="signin-link">
                সাইন ইন
              </Link>
              <Link href="/signup" className="button small-button">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="category-nav-wrap">
        <nav className="container category-nav" aria-label="পণ্যের বিভাগ">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={pathname === `/category/${c.slug}` ? 'active' : ''}
              aria-current={pathname === `/category/${c.slug}` ? 'page' : undefined}
            >
              <span aria-hidden="true">{c.icon}</span> {c.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="ticker" aria-label="বাজারের দামের সংক্ষিপ্তসার">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <div className="ticker-group" key={copy} aria-hidden={copy === 1}>
              {products.slice(0, 10).map((p) => (
                <span className="ticker-item" key={p.id}>
                  <span>
                    {p.image} {p.nameBn} {bn(p.today)} টাকা/{unit(p.unit)}
                  </span>
                  <b className={p.change.dir}>
                    {p.change.dir === 'up' ? '▲' : p.change.dir === 'down' ? '▼' : '—'}{' '}
                    {changePercent(p.change.pct)}%
                  </b>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
export function Avatar({
  name,
  image,
  large = false,
}: {
  name: string;
  image?: string | null;
  large?: boolean;
}) {
  return (
    <span className={`avatar ${large ? 'large' : ''}`}>
      {image ? (
        <img
          src={image}
          alt={`${name}-এর প্রোফাইল ছবি`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span aria-hidden="true">{name.trim().slice(0, 1).toUpperCase()}</span>
      )}
    </span>
  );
}
export { Today };
