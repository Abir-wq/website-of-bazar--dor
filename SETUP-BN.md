# আপডেটেড প্যাকেজ চালু করুন

১. ZIP-টি একটি নতুন ফোল্ডারে Extract করুন।
২. Extract করা ফোল্ডারের ভেতরের **bazar-dor** ফোল্ডারটি VS Code-এ Open Folder করুন। এই ফোল্ডারেই package.json ও package-lock.json আছে।
৩. Terminal-এ নিচের command **একটি করে** চালান; আগেরটি সফল হলে পরেরটি:

```powershell
npm ci
```

```powershell
npm run setup
```

```powershell
npm run dev
```

৪. http://localhost:3000 খুলুন। অন্য server 3000 port ব্যবহার করলে আগে সেখানে Ctrl+C দিয়ে বন্ধ করুন।
৫. পণ্যের কার্ডে “কার্টে যোগ করুন” চাপুন। Header-এর “কার্ট” খুলুন। “সরান” দিয়ে পণ্য সরান। Refresh করে সংরক্ষণ পরীক্ষা করুন।

## পুরোনো অ্যাকাউন্ট রাখতে চাইলে

পুরোনো app বন্ধ করে পুরোনো project-এর **.env.local** ফাইল এবং **data** ফোল্ডারটি নতুন **bazar-dor** ফোল্ডারে copy করুন। তারপর setup command আগে থেকে থাকা configuration অপরিবর্তিত রাখবে। পুরোনো project মুছবেন না যতক্ষণ না নতুনটি ঠিকমতো চলছে।

ZIP-এ node_modules দেওয়া হয়নি; নতুন ফোল্ডারে npm ci অবশ্যই চালাতে হবে। কোনো source file হাতে edit করতে হবে না।

Google/GitHub OAuth এখনও নিজের credentials দিয়ে চালু করতে হবে। বিস্তারিত README.md-এ আছে।
