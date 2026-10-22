# 🛒 বাজার দর — Bazar Dor

প্রয়োজনীয় পণ্যের বাজারভিত্তিক দাম, দামের পরিবর্তন ও বাজার তুলনা দেখার একটি বাংলা ওয়েব অ্যাপ। সংযুক্ত Figma/Penpot ডিজাইন অনুসারে Next.js App Router দিয়ে তৈরি।

## প্রথমে চালু করুন

**Node.js 22.16 বা পরবর্তী LTS সংস্করণ** এবং npm লাগবে। ZIP extract করে `bazar-dor` ফোল্ডারে টার্মিনাল খুলুন:

```bash
npm ci
npm run setup
npm run dev
```

ব্রাউজারে **http://localhost:3000** খুলুন। `npm run setup` নিজে একটি নতুন সিক্রেট দিয়ে `.env.local` তৈরি করে। প্রথম ব্যবহারে `data/bazar-dor.db` SQLite ডেটাবেস এবং প্রয়োজনীয় টেবিল তৈরি হয়। কোনো অনলাইন ডেটাবেস অ্যাকাউন্ট দরকার নেই।

**সাইন আপ → সাইন ইন → পণ্যের বিস্তারিত / প্রোফাইল** এই ধাপে পরীক্ষা করুন। আগে থেকে কোনো ব্যবহারকারী, ডেমো লগইন বা বাস্তব ব্যক্তির অ্যাকাউন্ট যোগ করা নেই।

প্রথমবার পৃষ্ঠা কম্পাইল হতে একটু সময় লাগতে পারে। Google/GitHub ছাড়াই ইমেইল ও পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন ও লগইন কাজ করে।

## প্রযুক্তি

- Next.js 16 App Router ও React 19
- TypeScript
- Tailwind CSS 4 ও ডিজাইন-অনুসারী CSS কম্পোনেন্ট
- Better Auth: ইমেইল/পাসওয়ার্ড, Google ও GitHub provider configuration
- better-sqlite3: স্থানীয় SQLite ডেটাবেস
- react-hot-toast: বাংলা নোটিফিকেশন
- স্থানীয় Hind Siliguri ফন্ট; চালাতে Google Fonts সংযোগ লাগে না

## প্রধান ফিচার

1. বাংলা তারিখ, বিভাগভিত্তিক নেভিগেশন এবং চলমান মূল্য টিকার।
2. মূল্যবৃদ্ধি ও মূল্যহ্রাসের শীর্ষ ছয় পণ্য এবং সব পণ্যের responsive grid।
3. বিভাগভিত্তিক তালিকা এবং সংখ্যামান অনুযায়ী কম/বেশি দামের sorting।
4. সার্ভারে session যাচাই করা সুরক্ষিত product detail ও profile পৃষ্ঠা।
5. বাজারভিত্তিক সর্বনিম্ন, সর্বাধিক ও গড় মূল্য এবং তুলনামূলক টেবিল।
6. বাস্তব রেজিস্ট্রেশন, পাসওয়ার্ড hashing, লগইন, লগআউট ও validation।
7. প্রোফাইলে নাম পরিবর্তন এবং আলাদা `/profile/update` রুট।
8. Skeleton loading, বাংলা toast, 404, error recovery, keyboard focus ও reduced-motion সমর্থন।
9. মোবাইল, ট্যাবলেট ও ডেস্কটপ বিন্যাস।
10. লাইভ API ব্যর্থ হলে স্পষ্ট চিহ্নিত সংরক্ষিত ডেটা।

## রুট

| রুট | কাজ | লগইন |
| --- | --- | --- |
| `/` | হোম | লাগে না |
| `/category/chal` | চাল; অন্য বিভাগেও একই ধরনের রুট | লাগে না |
| `/product/miniket-chal` | উদাহরণ পণ্যের বিস্তারিত; আসল slug কার্ড থেকে খুলুন | লাগে |
| `/signin` | লগইন | লাগে না |
| `/signup` | রেজিস্ট্রেশন | লাগে না |
| `/profile` | অ্যাকাউন্ট ও ইনলাইন নাম আপডেট | লাগে |
| `/profile/update` | requirement অনুযায়ী পৃথক আপডেট পৃষ্ঠা | লাগে |
| `/api/auth/*` | Better Auth endpoints | endpoint অনুযায়ী |

সরাসরি URL খুললে বা refresh করলে App Router রুটগুলো কাজ করে। Invalid product/category-তে 404 দেখানো হয়। বৈধ product route-এ লগইন না থাকলে সাইন ইন পৃষ্ঠায় নেওয়া হয় এবং সাইন ইন শেষে সেই পণ্যেই ফিরিয়ে আনা হয়।

## ডিজাইন সম্পর্কে

`design/`-এ মূল assignment README, Figma, Penpot এবং সাতটি exported image আছে। ডিজাইন থেকে নেওয়া মাপ: 1440px desktop frame, 1120px content width, 3-column product grid, 16px gap, 416px auth card, 736px profile layout। মূল রং: `#f0f5f0`, `#fafcfa`, `#1d271f`, `#05893e`, `#d03739`, `#1a9951`। Hind Siliguri font ও সংযুক্ত hero/logo ব্যবহার করা হয়েছে।

ছবিতে দেখা Rezwan নাম/ইমেইল বাস্তব ব্যবহারকারীর তথ্যের বদলে বসানো হয়নি। লগইন করা ব্যক্তির নাম, ইমেইল ও OAuth ছবি দেখাবে; ইমেইল-অ্যাকাউন্টে নামের প্রথম অক্ষর দেখাবে। Profile ছবির ধূসর placeholder-টি UI উপাদান হিসেবে যোগ করা হয়নি। Screenshot-এর ৬ অক্টোবর তারিখের বদলে বাংলাদেশের বর্তমান তারিখ দেখায়।

Requirement অনুযায়ী profile edit-এর আলাদা route আছে; screenshot-এর inline form-ও রাখা হয়েছে। README-র একটি bullet-এর রঙের নির্দেশনা ছবির সঙ্গে বিপরীত; আপনার নির্দেশ অনুযায়ী দাম বাড়লে **লাল**, কমলে **সবুজ** রাখা হয়েছে। বাজারের summary API-র সব বাজার থেকে গণনা হয়; স্থির screenshot-এর সঙ্গে তা সবসময় সমান হবে না।

এই পরিবেশে ব্রাউজার-ভিত্তিক visual QA করা যায়নি; তাই সব viewport-এ pixel-perfect সমতা যাচাইয়ের দাবি করা হচ্ছে না।

## Google ও GitHub পরে যুক্ত করুন

`.env.local`-এ সংশ্লিষ্ট client ID ও secret দিন, তারপর server restart করুন। কোনো secret source control-এ দেবেন না।

```dotenv
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Local callback URL:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Google OAuth app-এ authorized origin হবে `http://localhost:3000`। GitHub OAuth app-এ homepage URL-ও সেটি দিন। Deployment হলে origin এবং callback-এর domain বদলান। Provider-এর ID ও secret দুটোই থাকলে সেই provider সক্রিয় হয়। ফাঁকা থাকলে বাটন চাপলে বাংলা বার্তা দেখায়; কোনো মিথ্যা social login হয় না।

Email verification ও forgot-password ইচ্ছাকৃতভাবে রাখা হয়নি, assignment অনুযায়ী। নিবন্ধন হলে স্বয়ংক্রিয় login হয় না; signin পৃষ্ঠায় পাঠানো হয়।

## API ও ডেটা

ক্রম অনুসারে তিনটি assignment API চেষ্টা করা হয়:

1. `https://openapi.programming-hero.com/api/bazardor`
2. `https://api.api-store.workers.dev/api/bazardor`
3. `https://api.abcz.workers.dev/api/bazardor`

`/products` থেকে সব পণ্য ও বাজারের তথ্য নিয়ে category filter ও slug lookup করা হয়। ফলাফল পাঁচ মিনিট cache হয়। প্রতিটি endpoint-এর timeout ৩.৫ সেকেন্ড। তিনটিই ব্যর্থ হলে `src/data/products.json` ব্যবহার হয় এবং পৃষ্ঠায় **সংরক্ষিত নমুনা মূল্য** লেখা থাকে। এটি ২২ অক্টোবর ২০২৬ তারিখে মূল API থেকে সংগ্রহ করা হয়েছে; বাস্তব সময়ের বাজারদর হিসেবে ধরে নেবেন না। টিকারে design-এর source snapshot ব্যবহৃত হয়।

নিজস্ব API চাইলে `.env.local`-এ `BAZAR_API_URL` দিন। JSON schema একই হতে হবে।

## যাচাই ও production build

```bash
npm test
npm run test:auth
npm run typecheck
npm run build
npm start
```

`npm run test:auth` একটি অস্থায়ী ডেটাবেসে Better Auth-এর HTTP handler দিয়ে signup, login, session, name update ও logout পরীক্ষা করে; ব্যবহারকারীর ডেটাবেস পরিবর্তন করে না।

আলাদা টার্মিনালে app চালু রেখে পূর্ণ route smoke test চালানো যায়:

```bash
npm run test:smoke
```

এটি localhost:3000-এ test account তৈরি করে এবং শেষে স্থানীয় database থেকে শুধু সেই test account সরায়। অন্য server/port হলে `TEST_BASE_URL` দিন। এই script নিজের local project-এর জন্য, deployed production database-এর জন্য নয়।

## Deployment পরে করার সময়

এটি **Node.js server project**, static HTML export নয়। SQLite-তে স্থায়ী disk লাগে। Persistent disk-সহ Node hosting-এ `DATABASE_PATH` দিন এবং production `BETTER_AUTH_URL` ও নতুন নিরাপদ secret সেট করুন। Build-এর আগেও environment প্রস্তুত থাকতে হবে।

**Vercel/Netlify-এর ephemeral serverless filesystem-এ এই local SQLite configuration অপরিবর্তিত অবস্থায় ব্যবহার করবেন না।** সেখানে durable PostgreSQL/MySQL database adapter ও সংশ্লিষ্ট schema/migration লাগবে। Cloudflare Workers-এর জন্যও এই native SQLite driver বদলাতে হবে। Deployment এই source delivery-তে করা হয়নি।

## ফোল্ডার বিন্যাস

```text
src/app/          পৃষ্ঠা, loading, error ও auth API route
src/components/  header, cards, auth form, profile, footer
src/lib/         catalog, API fetch, database ও auth
src/data/        API fallback snapshot
public/          স্থানীয় ছবি ও ফন্ট
scripts/         setup, dev launcher, smoke test
tests/          catalog ও auth integration tests
design/         assignment ও reference designs
```

`node_modules`, `.next`, ব্যক্তিগত `.env.local` এবং ব্যবহারকারীর database ZIP-এ নেই। এগুলো setup/install/run-এ তৈরি হবে। Dependency-এর সঠিক version-এর জন্য `package-lock.json` অন্তর্ভুক্ত আছে।

## Git ইতিহাস ও জমা

অন্তর্ভুক্ত `bazar-dor-history.bundle`-এ অন্তত আটটি অর্থপূর্ণ source commit আছে। চাইলে ZIP-এর source ব্যবহার করুন; অথবা bundle থেকে working repository তৈরি করুন:

```bash
git clone bazar-dor-history.bundle bazar-dor-repository
```

এরপর আপনার GitHub repository-তে remote যোগ করে push করতে পারবেন। GitHub repository বা live site এই ধাপে তৈরি হয়নি।

- Live Link: পরে যোগ করুন
- GitHub Repository Link: পরে যোগ করুন
