// dashboard-app/components/layout/Sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  Upload, 
  Settings, 
  BarChart3,
  Building2,
  Shield,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Data Models', href: '/dashboard/data-models', icon: Database, adminOnly: true },
  { name: 'Uploads', href: '/dashboard/uploads', icon: Upload, adminOnly: true },
  { name: 'Users', href: '/dashboard/users', icon: Users, adminOnly: true },
  { name: 'Organization', href: '/dashboard/organization', icon: Building2, adminOnly: true },
  { name: 'Roles & Permissions', href: '/dashboard/roles', icon: Shield, adminOnly: true },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  isAdmin: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-accent-200 transition-transform">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-accent-200 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <span className="text-xl font-bold text-accent-900">BI Dashboard</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-accent-600 hover:bg-accent-50 hover:text-accent-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl"></div>
      </div>
    </aside>
  );
}