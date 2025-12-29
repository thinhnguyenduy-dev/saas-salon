import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      access_token?: string;
      role?: string;
      id?: string;
    } & DefaultSession['user'];
  }

  interface User {
    access_token?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string;
    role?: string;
    id?: string;
  }
}
