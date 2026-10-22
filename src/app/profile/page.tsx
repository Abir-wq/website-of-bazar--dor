import {requireSession} from '@/lib/session';
import {Profile} from '@/components/profile';
export const metadata={title:'আমার প্রোফাইল'};
export default async function Page(){const session=await requireSession('/profile');return <Profile user={session.user}/>;}
