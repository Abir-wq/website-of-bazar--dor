'use client';
import {useMemo,useState} from 'react';
import {bn,sortProducts,type Product} from '@/lib/catalog';
import {ProductGrid} from './product-card';
export function CategoryProducts({products}:{products:Product[]}){const [order,setOrder]=useState('default');const sorted=useMemo(()=>sortProducts(products,order),[products,order]);return <><div className="sort-bar panel"><label htmlFor="sort">সাজান</label><select id="sort" value={order} onChange={e=>setOrder(e.target.value)}><option value="default">ডিফল্ট</option><option value="asc">দাম: কম থেকে বেশি</option><option value="desc">দাম: বেশি থেকে কম</option></select></div><p className="results-count" aria-live="polite">মোট {bn(products.length)}টি পণ্য দেখানো হচ্ছে</p><ProductGrid products={sorted}/></>;}
