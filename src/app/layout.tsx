import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Providers } from '@/components/providers';
import { fallbackProducts } from '@/lib/catalog';
import { CartProvider } from '@/components/cart';
import './globals.css';
const hind = localFont({
  src: [
    { path: '../../public/fonts/hind-siliguri-400.ttf', weight: '400' },
    { path: '../../public/fonts/hind-siliguri-500.ttf', weight: '500' },
    { path: '../../public/fonts/hind-siliguri-600.ttf', weight: '600' },
    { path: '../../public/fonts/hind-siliguri-700.ttf', weight: '700' },
  ],
  variable: '--font-hind',
  display: 'swap',
});
export const metadata: Metadata = {
  title: { default: 'বাজার দর — আজকের বাজারের দাম', template: '%s | বাজার দর' },
  description: 'চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার বাজারভিত্তিক দাম এক নজরে।',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={hind.variable}>
      <body>
        <CartProvider>
          <a href="#main-content" className="skip-link">
            মূল বিষয়বস্তুতে যান
          </a>
          <Suspense>
            <Header products={fallbackProducts} />
          </Suspense>
          <main id="main-content">{children}</main>
          <Footer />
          <Providers />
        </CartProvider>
      </body>
    </html>
  );
}
