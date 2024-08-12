import { db } from "@/app/lib/db";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findUserByEmail } from "./api/findUserByEmail";

export const config: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
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
} satisfies NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
