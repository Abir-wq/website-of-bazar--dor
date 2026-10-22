import { CartContents } from '@/components/cart';
export const metadata = { title: 'আমার কার্ট' };
export default function CartPage() {
  return (
    <div className="container cart-page">
      <h1>আমার কার্ট</h1>
      <CartContents />
    </div>
  );
}
