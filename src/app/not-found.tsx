import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="not-found container">
      <span className="error-code">৪০৪</span>
      <h1>দুঃখিত, কিছু পাওয়া যায়নি</h1>
      <p>এই পৃষ্ঠা, পণ্য বা বিভাগটি নেই অথবা এখানে কোনো পণ্য পাওয়া যায়নি।</p>
      <Link href="/" className="button">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
