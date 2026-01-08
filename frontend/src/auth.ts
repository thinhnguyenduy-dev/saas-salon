import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export const config = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
        rememberMe: { label: "Remember Me", type: "text" }
      },
      authorize: async (credentials) => {
        try {
          // If we have a token, verify it
          if (credentials?.token) {
             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${credentials.token}` },
             })
             if (res.ok) {
                const user = await res.json()
                // Merge token into user object so it's persisted in session
                return { ...user, accessToken: credentials.token }
             }
             return null
          }

          console.log("Attempting login with:", credentials?.email);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          })
          
          console.log("Login response status:", res.status);
          const data = await res.json()
          console.log("Login response body:", data);
          
          const user = data.data || data; // Unwrap if wrapped in data property

          if (res.ok && user) {
            return user
          }
          console.error("Login failed:", user);
          return null
        } catch (error) {
          console.error("Login error:", error);
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user }
      }
      return token
    },
    async session({ session, token }) {
      session.user = token as any
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
