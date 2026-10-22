'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { bn, unit, type Product } from '@/lib/catalog';
import {
  CART_STORAGE_KEY,
  addCartItem,
  removeCartItem,
  readCart,
  cartTotal,
  type CartItem,
} from '@/lib/cart';

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setItems(readCart(localStorage.getItem(CART_STORAGE_KEY)));
    } catch {
      toast.error('সংরক্ষিত কার্ট পড়া যায়নি।');
    } finally {
      setReady(true);
    }
  }, []);

  // Do not overwrite saved items with the initial empty server-rendered state.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      toast.error('কার্ট সংরক্ষণ করা যায়নি। পৃষ্ঠা বন্ধ করলে পরিবর্তন হারাতে পারে।', {
        id: 'cart-storage-error',
      });
    }
  }, [items, ready]);

  useEffect(() => {
    function synchronize(event: StorageEvent) {
      if (event.key === CART_STORAGE_KEY || event.key === null) {
        setItems(readCart(event.newValue));
      }
    }
    window.addEventListener('storage', synchronize);
    return () => window.removeEventListener('storage', synchronize);
  }, []);

  function addItem(product: Product) {
    if (!ready) return;
    setItems((current) => addCartItem(current, product));
    toast.success('কার্টে যোগ হয়েছে।');
  }
  function removeItem(id: number) {
    if (!ready) return;
    setItems((current) => removeCartItem(current, id));
    toast.success('কার্ট থেকে সরানো হয়েছে।');
  }

  return (
    <CartContext.Provider value={{ items, ready, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}
function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('Cart components must be inside CartProvider.');
  return context;
}

export function CartLink() {
  const { items, ready } = useCart();
  return (
    <Link
      href="/cart"
      className="cart-link"
      aria-label={ready ? `কার্টে ${bn(items.length)}টি পণ্য` : 'আমার কার্ট'}
    >
      🛒 কার্ট <span className="cart-count">{ready ? bn(items.length) : '…'}</span>
    </Link>
  );
}

export function AddToCartButton({ product }: { product: Product }) {
  const { items, ready, addItem, removeItem } = useCart();
  const added = items.some((item) => item.id === product.id);
  return (
    <button
      type="button"
      className={`cart-toggle ${added ? 'cart-toggle-remove' : ''}`}
      disabled={!ready}
      onClick={() => (added ? removeItem(product.id) : addItem(product))}
      aria-label={added ? `${product.nameBn} কার্ট থেকে সরান` : `${product.nameBn} কার্টে যোগ করুন`}
    >
      {!ready ? 'অপেক্ষা করুন…' : added ? 'কার্ট থেকে সরান' : '🛒 কার্টে যোগ করুন'}
    </button>
  );
}

export function CartContents() {
  const { items, ready, removeItem } = useCart();
  if (!ready) return <p role="status">কার্ট লোড হচ্ছে…</p>;
  if (!items.length)
    return (
      <section className="panel cart-empty">
        <h2>আপনার কার্ট খালি</h2>
        <p>পণ্যের কার্ড থেকে কার্টে পণ্য যোগ করুন।</p>
        <Link href="/#সব-পণ্য" className="button">
          পণ্য দেখুন
        </Link>
      </section>
    );
  return (
    <>
      <p className="section-subtitle" aria-live="polite">
        কার্টে মোট {bn(items.length)}টি পণ্য
      </p>
      <div className="cart-items">
        {items.map((item) => (
          <article key={item.id} className="panel cart-item">
            <span className="product-emoji" aria-hidden="true">
              {item.image}
            </span>
            <div className="cart-item-description">
              <Link href={`/product/${item.slug}`}>
                <h2>{item.nameBn}</h2>
              </Link>
              <p>১ {unit(item.unit)}</p>
              <strong>{bn(item.today)} টাকা</strong>
            </div>
            <button
              type="button"
              className="outline-danger"
              onClick={() => removeItem(item.id)}
              aria-label={`${item.nameBn} কার্ট থেকে সরান`}
            >
              সরান
            </button>
          </article>
        ))}
      </div>
      <section className="panel cart-total">
        <h2>আনুমানিক মোট: {bn(cartTotal(items), 2)} টাকা</h2>
        <p>
          প্রতিটি পণ্যের এক তালিকাভুক্ত একক ধরে হিসাব করা হয়েছে। যোগ করার সময়ের মূল্য দেখানো
          হচ্ছে; বাজারভেদে দাম বদলাতে পারে।
        </p>
      </section>
    </>
  );
}
