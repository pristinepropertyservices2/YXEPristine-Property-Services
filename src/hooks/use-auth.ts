'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const isUnauthenticated = status === 'unauthenticated';

  const user = session?.user || null;

  const redirectToSignIn = useCallback((callbackUrl?: string) => {
    const url = callbackUrl || (typeof window !== 'undefined' ? window.location.href : '/');
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(url)}`);
  }, [router]);

  const redirectToHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const signOut = useCallback(async () => {
    const { signOut: nextAuthSignOut } = await import('next-auth/react');
    await nextAuthSignOut({ callbackUrl: '/' });
  }, []);

  return {
    user,
    session,
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    redirectToSignIn,
    redirectToHome,
    signOut,
    update,
    isAdmin: user?.role === 'ADMIN',
  };
}
