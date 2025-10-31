// dashboard-app/components/layout/Header.tsx

'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn, getInitials } from '@/lib/utils';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    roles: string[];
  };
}

export function Header({ user }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 bg-white border-b border-accent-200">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search or breadcrumbs could go here */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-accent-900">Welcome back, {user.name.split(' ')[0]}!</h1>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-accent-600 hover:bg-accent-50 hover:text-accent-900 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-accent-600 hover:bg-accent-50 hover:text-accent-900 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-medium">
                {getInitials(user.name)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-accent-900">{user.name}</p>
                <p className="text-xs text-accent-500">{user.roles[0]}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-accent-200 py-1 z-50 animate-slide-down">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-accent-700 hover:bg-accent-50"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Link({ href, className, children, onClick }: any) {
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}