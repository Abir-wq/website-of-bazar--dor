'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="not-found container"><h1>কিছু একটা সমস্যা হয়েছে</h1><p>আবার চেষ্টা করুন অথবা হোম পেজে ফিরে যান।</p><div className="error-actions"><button onClick={reset} className="button">আবার চেষ্টা করুন</button><Link href="/">হোম পেজে ফিরে যান</Link></div></div>;}
