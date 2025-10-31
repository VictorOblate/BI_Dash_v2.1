// dashboard-app/app/auth/error/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 geometric-bg">
      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-accent-900 mb-2">Authentication Error</h1>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-accent-200">
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-800 text-center">{errorMessage}</p>
          </div>

          <div className="space-y-4">
            <p className="text-center text-accent-600">
              Please try signing in again. If the problem persists, contact support.
            </p>

            <div className="flex flex-col space-y-3">
              <Link href="/auth/signin">
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-accent-500 mt-8">
          Need help? Contact support at support@example.com
        </p>
      </div>
    </div>
  );
}