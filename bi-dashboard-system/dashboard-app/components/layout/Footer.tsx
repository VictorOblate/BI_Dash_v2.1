// dashboard-app/components/layout/Footer.tsx

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-accent-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-accent-600">
            © {currentYear} BI Dashboard System. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <Link href="/about" className="text-sm text-accent-600 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-accent-600 hover:text-primary-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-accent-600 hover:text-primary-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="text-sm text-accent-600 hover:text-primary-600 transition-colors">
              Support
            </Link>
          </div>

          {/* Version */}
          <div className="text-sm text-accent-500">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}