// dashboard-app/lib/nextAuth.ts
// Small compatibility wrapper for NextAuth v5 server-side usage.
import NextAuth from 'next-auth';
import { authOptions } from './auth';

// Initialize NextAuth and export the `auth` function which returns the session
// Usage: const session = await auth();
const nextAuth = NextAuth(authOptions as any);

export const auth = nextAuth.auth;
export const handlers = nextAuth.handlers;

export default nextAuth;
