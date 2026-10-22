import type { Product } from './catalog';

export type CartItem = Pick<Product, 'id' | 'slug' | 'nameBn' | 'image' | 'unit' | 'today'>;
export const CART_STORAGE_KEY = 'bazar-dor-cart-v1';

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'number' &&
    Number.isSafeInteger(item.id) &&
    typeof item.slug === 'string' &&
    item.slug.length > 0 &&
    typeof item.nameBn === 'string' &&
    typeof item.image === 'string' &&
    typeof item.unit === 'string' &&
    typeof item.today === 'number' &&
    Number.isFinite(item.today) &&
    item.today >= 0
  );
}

export function toCartItem(product: CartItem): CartItem {
  return {
    id: product.id,
    slug: product.slug,
    nameBn: product.nameBn,
    image: product.image,
    unit: product.unit,
    today: product.today,
  };
}

export function readCart(saved: string | null): CartItem[] {
  if (!saved) return [];
  try {
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    const unique = new Map<number, CartItem>();
    for (const item of parsed) {
      if (isCartItem(item)) unique.set(item.id, toCartItem(item));
    }
    return [...unique.values()];
  } catch {
    return [];
  }
}

export function addCartItem(items: CartItem[], product: CartItem): CartItem[] {
  return items.some((item) => item.id === product.id) ? items : [...items, toCartItem(product)];
}
export function removeCartItem(items: CartItem[], id: number): CartItem[] {
  return items.filter((item) => item.id !== id);
}
export function cartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.today, 0);
}
