import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prismaAuthAdapter } from '@/lib/prisma-auth-adapter';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

function isSmtpConfigured() {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASSWORD || '';
  return (
    user.length > 0 &&
    pass.length > 0 &&
    !user.includes('your-email') &&
    !pass.includes('your-app-password')
  );
}

export const authOptions: NextAuthOptions = {
  adapter: prismaAuthAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        if (isSmtpConfigured() && !user.emailVerified) {
          throw new Error('Please verify your email address before signing in');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      // Same email signed up with password first → allow Google to attach to that user
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.emailVerified = (user as { emailVerified?: Date | null }).emailVerified;
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      if (token.email && !token.role) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true, emailVerified: true, name: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.emailVerified = dbUser.emailVerified;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
    async signIn({ user, account }) {
      // User + Account rows for OAuth are created by PrismaAdapter. Do not duplicate-create here
      // (that caused races and confusing state). We only normalize verification when needed.
      if (account?.provider === 'google' && user.email) {
        const emailKey = user.email.trim().toLowerCase();
        const existingUser = await db.user.findUnique({
          where: { email: emailKey },
        });

        if (existingUser && !existingUser.emailVerified) {
          await db.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() },
          });
        }
      }
      return true;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      console.log(`User signed in: ${user.email} (New: ${isNewUser})`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
