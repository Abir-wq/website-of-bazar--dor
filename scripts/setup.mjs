import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('data', { recursive: true });
if (!existsSync('.env.local')) {
  writeFileSync(
    '.env.local',
    `BETTER_AUTH_URL=http://localhost:3000\nBETTER_AUTH_SECRET=${randomBytes(48).toString('base64url')}\nDATABASE_PATH=./data/bazar-dor.db\nGOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\nGITHUB_CLIENT_ID=\nGITHUB_CLIENT_SECRET=\nBAZAR_API_URL=\n`,
    { mode: 0o600 },
  );
  console.log('প্রস্তুত: .env.local তৈরি হয়েছে।');
} else console.log('.env.local আগে থেকেই আছে; পরিবর্তন করা হয়নি।');
console.log(
  'এবার npm run dev চালিয়ে http://localhost:3000 খুলুন। ডেটাবেস প্রথম ব্যবহারে নিজে তৈরি হবে।',
);
