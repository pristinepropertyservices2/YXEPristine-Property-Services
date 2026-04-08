'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function VerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified. You can now sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Welcome to YXE Pristine Property Services! Start booking professional cleaning services today.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full bg-purple-700 hover:bg-purple-800">
              Continue to Sign In
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
