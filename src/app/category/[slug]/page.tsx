import {notFound} from 'next/navigation';
import {categories,bn} from '@/lib/catalog';
import {getCatalog} from '@/lib/products';
import {CategoryProducts} from '@/components/category-products';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:categories.find(c=>c.slug===slug)?.name||'বিভাগ পাওয়া যায়নি'};}
export default async function Category({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const category=categories.find(c=>c.slug===slug);if(!category)notFound();const {products,isSnapshot}=await getCatalog();const filtered=products.filter(p=>p.category===slug);if(!filtered.length)notFound();return <div className="container category-page"><section className="category-heading panel"><span aria-hidden="true">{category.icon}</span><div><h1>{category.name}</h1><p>{bn(filtered.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p></div></section>{isSnapshot&&<p className="data-notice">লাইভ ডেটা অনুপলব্ধ; সংরক্ষিত নমুনা মূল্য (২২ অক্টোবর ২০২৬) দেখানো হচ্ছে।</p>}<CategoryProducts products={filtered}/></div>;}
