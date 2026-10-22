import {requireSession} from '@/lib/session';
import {Profile} from '@/components/profile';
export const metadata={title:'তথ্য আপডেট'};
export default async function Page(){const session=await requireSession('/profile/update');return <Profile user={session.user} updateOnly/>;}
