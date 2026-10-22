# দ্রুত শুরু

১. Node.js 22.16+ LTS ইনস্টল করুন।
২. ZIP extract করুন। `bazar-dor` ফোল্ডারে টার্মিনাল খুলুন।
৩. একের পর এক চালান:

```bash
npm ci
npm run setup
npm run dev
```

৪. http://localhost:3000 খুলুন।
৫. সাইন আপ করে নিজের অ্যাকাউন্ট তৈরি করুন, তারপর সাইন ইন করুন।

ইমেইল/পাসওয়ার্ড ব্যবহার করতে কোনো বাইরের database account লাগে না। স্থানীয় SQLite স্বয়ংক্রিয়ভাবে প্রস্তুত হয়। Google/GitHub login পরে `.env.local`-এ credentials দিয়ে সক্রিয় করতে পারবেন।

Windows-এ command prompt / PowerShell দুটোতেই ওপরের command চলে। Native SQLite package install করতে সমস্যা হলে বর্তমান Node.js LTS ব্যবহার করুন। সম্পূর্ণ নির্দেশনা `README.md`-এ আছে।
