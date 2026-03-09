import NextAuth, { DefaultSession } from 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      deviceToken?: string;
    } & DefaultSession['user'];
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    deviceToken?: string;
  }
}
