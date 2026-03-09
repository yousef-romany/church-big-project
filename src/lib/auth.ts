import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { authRateLimit } from './rate-limit';
import { logAuditEvent } from './audit-log';
import { createOrUpdateDeviceToken } from './session-manager';
import { accountLockout } from './account-lockout';
import type { Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const ipAddress = (req as any).headers.get('x-forwarded-for');
        const userAgent = (req as any).headers.get('user-agent');

        // Check if account is locked first
        const isLocked = await accountLockout.isAccountLocked(email);
        if (isLocked) {
          const remainingTime = await accountLockout.getRemainingLockoutTime(email);
          await logAuditEvent({
            email,
            action: 'LOGIN_BLOCKED',
            resource: 'AUTH',
            ipAddress,
            userAgent,
            success: false,
            errorMessage: 'Account locked'
          });
          
          throw new Error(`الحساب مقفل. يرجى المحاولة بعد ${remainingTime} دقيقة`);
        }

        // Apply rate limiting based on email
        const rateLimitResult = authRateLimit.check(req as any, email);
        if (!rateLimitResult.success) {
          // Log rate limit exceeded
          await logAuditEvent({
            email,
            action: 'RATE_LIMIT_EXCEEDED',
            resource: 'AUTH',
            ipAddress,
            userAgent,
            success: false,
            errorMessage: 'Too many login attempts'
          });
          
          throw new Error('تم تجاوز عدد المحاولات المسموح به. يرجى المحاولة مرة أخرى بعد 15 دقيقة.');
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          // Record failed attempt
          await accountLockout.recordFailedAttempt(email);
          
          // Log failed login attempt
          await logAuditEvent({
            email,
            action: 'LOGIN_FAILED',
            resource: 'AUTH',
            ipAddress,
            userAgent,
            success: false,
            errorMessage: 'User not found or no password'
          });
          return null;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          await logAuditEvent({
            userId: user.id,
            email: user.email,
            action: 'LOGIN_FAILED',
            resource: 'AUTH',
            ipAddress,
            userAgent,
            success: false,
            errorMessage: 'Email not verified'
          });
          
          console.log('Login failed: Email not verified.');
          throw new Error('Email not verified');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          // Record failed attempt and check if account should be locked
          const lockResult = await accountLockout.recordFailedAttempt(email);
          
          // Log failed login due to incorrect password
          await logAuditEvent({
            userId: user.id,
            email: user.email,
            action: 'LOGIN_FAILED',
            resource: 'AUTH',
            ipAddress,
            userAgent,
            success: false,
            errorMessage: 'Invalid password',
            details: { 
              attempts: lockResult.remainingAttempts,
              locked: lockResult.locked,
              lockoutTime: lockResult.lockoutTime
            }
          });

          if (lockResult.locked) {
            throw new Error(`تم تجاوز عدد المحاولات. الحساب مقفل لمدة ${lockResult.lockoutTime} دقيقة`);
          }
          
          return null;
        }

        // Reset failed attempts on successful login
        await accountLockout.resetFailedAttempts(email);

        // Log successful login
        await logAuditEvent({
          userId: user.id,
          email: user.email,
          action: 'LOGIN_SUCCESS',
          resource: 'AUTH',
          ipAddress,
          userAgent,
          success: true,
          details: { role: user.role, has2FA: user.twoFactorEnabled }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'USER' as UserRole;
      }
      
      // Handle device tracking
      if (trigger === 'update' && session?.deviceToken) {
        token.deviceToken = session.deviceToken;
      }
      
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        if (token.deviceToken) {
          session.user.deviceToken = token.deviceToken as string;
        }
      }
      return session;
    },
      async signIn({ user, account, profile }) {
      if (account?.provider === 'facebook') {
        // For Facebook OAuth, ensure user exists and has a role assigned
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        
        if (!existingUser) {
          // Create new user with default role for Facebook signups
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              emailVerified: new Date(), // Facebook verifies emails
              role: 'USER',
            },
          });
          
          // Log Facebook registration
          await logAuditEvent({
            userId: newUser.id,
            email: newUser.email,
            action: 'FACEBOOK_LOGIN_SUCCESS',
            resource: 'AUTH',
            details: { isNewUser: true, provider: 'facebook' },
            success: true
          });
        } else {
          // Log Facebook login for existing user
          await logAuditEvent({
            userId: existingUser.id,
            email: existingUser.email,
            action: 'FACEBOOK_LOGIN_SUCCESS',
            resource: 'AUTH',
            details: { isNewUser: false, provider: 'facebook' },
            success: true
          });
        }
        
        return true;
      }
      
      // For credentials provider, device token is handled in the authorize function
      return true;
    },
    async redirect({ url, baseUrl }) {
      // If the url is relative, convert to absolute URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Allow relative URLs to same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // Default to base URL
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});
