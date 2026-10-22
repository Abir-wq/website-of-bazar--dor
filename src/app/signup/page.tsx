import { Suspense } from 'react';
import { AuthForm } from '@/components/auth-form';
import { enabledProviders } from '@/lib/auth';
export const metadata = { title: 'সাইন আপ' };
export default function Signup() {
  return (
    <Suspense fallback={<p className="container loading-text">লোড হচ্ছে…</p>}>
      <AuthForm mode="signup" providers={enabledProviders} />
    </Suspense>
  );
}
