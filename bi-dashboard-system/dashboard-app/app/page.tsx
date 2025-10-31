// dashboard-app/app/page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/lib/nextAuth';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/auth/signin');
  }
}