import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

export async function POST(
  _: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username?.toLowerCase();

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const userResult = (await sql`
    select u.id
    from users u
    inner join portfolios p on p.user_id = u.id
    where lower(u.username) = ${username}
      and p.is_published = true
    limit 1
  `) as Array<{ id: string }>;

  if (userResult.length === 0) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  await sql`
    insert into portfolio_views (portfolio_user_id)
    values (${userResult[0].id})
  `;

  return NextResponse.json({ ok: true });
}
