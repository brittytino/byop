import { sql } from "@/lib/db";
import { PortfolioRecord, ProjectRecord, UserRecord } from "@/types/db";

export async function getUserByUsername(username: string) {
  const users = (await sql`
    select * from users where lower(username) = ${username.toLowerCase()} limit 1
  `) as UserRecord[];
  return users[0] ?? null;
}

export async function getUserByGithubId(githubId: string) {
  const users = (await sql`
    select * from users where github_id = ${githubId} limit 1
  `) as UserRecord[];
  return users[0] ?? null;
}

export async function getPortfolioByUserId(userId: string) {
  const portfolios = (await sql`
    select * from portfolios where user_id = ${userId} limit 1
  `) as PortfolioRecord[];
  return portfolios[0] ?? null;
}

export async function getProjectsByUserId(userId: string) {
  return (await sql`
    select * from projects where user_id = ${userId} order by updated_at desc
  `) as ProjectRecord[];
}

export async function getPortfolioViews(userId: string) {
  const result = (await sql`
    select count(*)::int as total
    from portfolio_views
    where portfolio_user_id = ${userId}
  `) as Array<{ total: number }>;
  return result[0]?.total ?? 0;
}
