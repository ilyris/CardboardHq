import { db } from "@/app/lib/db";
import Google from "next-auth/providers/google";
import { findUserByEmail } from "./helpers/api/findUserByEmail";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
        token.provider_id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure session.user has an id field
      if (session.user) {
        session.user.id = token.id as string; // Assigning the id
      }

      return session;
    },
    async signIn({ profile }) {
      try {
        if (profile) {
          if (profile.email) {
            // Check if the user already exists based on email
            let user = await findUserByEmail(profile.email);

            // If the user doesn't exist, create a new user
            if (!user) {
              user = {
                email: profile.email as string,
                name: profile.name ?? null,
              };

              await db.insertInto("users").values(user).execute();
            }
          }
        }

        return true;
      } catch (err) {
        console.log({ err });
        return false;
      }
    },
  },
  secret: process.env.JWT_SECRET,
});
