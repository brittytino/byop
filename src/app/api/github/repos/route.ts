import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getGitHubRepos } from "@/lib/github";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repos = await getGitHubRepos(session.accessToken);
    return NextResponse.json({ repos });
  } catch (error) {
    console.error("[github] Failed to fetch repositories", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 502 });
  }
}
