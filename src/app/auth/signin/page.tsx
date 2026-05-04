'use client';

import { Suspense, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { getAuthErrorMessage } from '@/lib/auth-error-messages';
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const stripWww = (h: string) => h.replace(/^www\./, '');

/**
 * Normalizes `callbackUrl` for sign-in. Handles localhost, apex vs www, and
 * full URLs that should become same-site paths.
 */
function normalizeCallbackUrlParam(raw: string | null): string {
  if (!raw || raw === '/') return '/';
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw;
  if (typeof window === 'undefined') return '/';
  try {
    const u = new URL(
      raw,
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
    );
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
      return `${u.pathname}${u.search}${u.hash}` || '/';
    }
    if (u.origin === window.location.origin) {
      return `${u.pathname}${u.search}${u.hash}` || '/';
    }
    if (stripWww(u.hostname) === stripWww(window.location.hostname)) {
      return `${u.pathname}${u.search}${u.hash}` || '/';
    }
  } catch {
    return '/';
  }
  return '/';
}

/** Default page when the user did not open sign-in with `?callbackUrl=...` */
function getDefaultPostSignInPath(): string {
  return '/dashboard';
}

function SignInContent() {
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackUrl') || '/';
  const [callbackUrl, setCallbackUrl] = useState(() => rawCallbackUrl);
  const error = searchParams.get('error');

  useEffect(() => {
    setCallbackUrl(normalizeCallbackUrlParam(rawCallbackUrl));
  }, [rawCallbackUrl]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [publicHost, setPublicHost] = useState("yxepristinepropertyservices.ca");

  useEffect(() => {
    setPublicHost(window.location.host);
  }, []);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") setIsSignup(true);
    else if (mode === "login") setIsSignup(false);
  }, [searchParams]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!error) return;

    toast({
      title: 'Sign-in error',
      description: getAuthErrorMessage(error),
      variant: 'destructive',
    });
  }, [error]);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast({
          title: 'Sign In Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        });
        // Full-page navigation so the new session cookie is always applied (App Router
        // client `router.push` can run before the session is readable).
        let dest = callbackUrl;
        if (!dest || dest === '/') {
          dest = getDefaultPostSignInPath();
        }
        window.location.assign(dest);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      toast({
        title: 'Account Created!',
        description: 'Please check your email to verify your account.',
      });
      
      setIsSignup(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google') => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <p className="mb-4 max-w-md rounded-lg border border-purple-200/80 bg-white/90 px-4 py-3 text-center text-xs leading-relaxed text-gray-700 shadow-sm">
        <span className="font-semibold text-purple-900">YXE Pristine Property Services</span>
        {" — official account page. "}
        You are on{" "}
        <span className="font-mono text-[11px] text-purple-800">{publicHost}</span>
        . We do not ask for your Google password here; Google opens in a secure sign-in window when you
        choose Google.
      </p>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <img 
              src="/images/logo.png" 
              alt="YXE Pristine" 
              className="h-12 mx-auto"
            />
          </Link>
          <CardTitle>{isSignup ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {isSignup 
              ? 'Sign up to book cleaning services and manage your appointments'
              : 'Sign in to your account to continue'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              aria-label="Sign in with Google — you will be redirected to Google to authenticate"
            >
              <svg className="w-5 h-5 mr-2 shrink-0" viewBox="0 0 24 24" aria-hidden>
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
            
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={isSignup ? handleSignUp : handleCredentialsSignIn} className="mt-6 space-y-4">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(306) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              {isSignup && (
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              )}
            </div>

            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {!isSignup && (
              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-purple-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : isSignup ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            variant="link"
            onClick={() => setIsSignup(!isSignup)}
            className="text-purple-700"
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Button>
          <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-muted-foreground">
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy policy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of service
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-50 to-white" />}>
      <SignInContent />
    </Suspense>
  );
}
