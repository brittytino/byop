import { NextAuthOptions, getServerSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { sql } from "@/lib/db";

const githubClientId = process.env.GITHUB_ID;
const githubClientSecret = process.env.GITHUB_SECRET;

if (!githubClientId || !githubClientSecret) {
  console.warn(
    "[auth] GitHub OAuth credentials are missing. Configure GITHUB_ID and GITHUB_SECRET in Vercel project environment variables."
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: githubClientId ?? "missing-github-client-id",
      clientSecret: githubClientSecret ?? "missing-github-client-secret",
      authorization: {
        params: {
          scope: "read:user user:email repo"
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ profile, user }) {
      if (!profile) {
        return true;
      }

      const githubProfile = profile as {
        id?: string | number;
        login?: string;
        avatar_url?: string;
        bio?: string;
      };

      const githubId = String(githubProfile.id ?? "");
      const username = githubProfile.login ?? user.name ?? githubId;
      const avatarUrl =
        user.image ??
        githubProfile.avatar_url ??
        "https://avatars.githubusercontent.com/u/583231";

      try {
        await sql`
          insert into users (github_id, username, name, bio, avatar_url, email)
          values (${githubId}, ${username}, ${user.name ?? username}, ${
            githubProfile.bio ?? ""
          }, ${avatarUrl}, ${user.email})
          on conflict (github_id) do update set
            username = excluded.username,
            name = excluded.name,
            bio = excluded.bio,
            avatar_url = excluded.avatar_url,
            email = excluded.email
        `;

        await sql`
          insert into portfolios (user_id, theme, is_published)
          select id, 'midnight-inferno', false from users where github_id = ${githubId}
          on conflict (user_id) do nothing
        `;

        return true;
      } catch (error) {
        console.error("[auth] Failed to persist GitHub user to database.", {
          githubId,
          username,
          error
        });

        return "/auth/error?reason=database_setup";
      }
    },
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (profile) {
        const githubProfile = profile as { id?: string | number; login?: string };
        token.githubId = String(githubProfile.id ?? "");
        token.username = githubProfile.login;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = (token.username as string) ?? session.user.name ?? "";
        session.user.githubId = (token.githubId as string) ?? "";
      }
      session.accessToken = token.accessToken as string | undefined;
      return session;
    }
  },
  pages: {
    signIn: "/",
    error: "/auth/error"
  }
};

export function auth() {
  return getServerSession(authOptions);
}
