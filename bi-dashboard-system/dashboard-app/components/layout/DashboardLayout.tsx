// dashboard-app/components/layout/DashboardLayout.tsx

'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { isAdmin } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    roles: string[];
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const userIsAdmin = isAdmin(user.roles);

  return (
    <div className="min-h-screen bg-accent-50">
      <Sidebar isAdmin={userIsAdmin} />
      <div className="pl-64">
        <Header user={user} />
        <main className="pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}