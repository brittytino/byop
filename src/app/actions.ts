"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getGitHubRepos } from "@/lib/github";
import {
  getPortfolioByUserId,
  getProjectsByUserId,
  getUserByGithubId,
  getUserByUsername
} from "@/lib/repositories";
import { profileSchema, projectSchema } from "@/lib/validation";
import { z } from "zod";

type ActionResult = {
  ok: boolean;
  message: string;
};

const repoIdSchema = z.number().int().positive();

async function requireAuthedUser() {
  const session = await auth();

  if (!session?.user?.githubId || !session.user.username) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByGithubId(session.user.githubId);
  if (!user) {
    throw new Error("User not found");
  }

  return { session, user };
}

function revalidatePortfolio(username: string) {
  revalidatePath(`/${username}`);
  revalidateTag(`portfolio:${username.toLowerCase()}`);
}

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  const { user } = await requireAuthedUser();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: String(formData.get("email") || "").trim(),
    bio: formData.get("bio") || "",
    location: formData.get("location") || "",
    skills: String(formData.get("skills") || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    links: {
      github: String(formData.get("github") || "").trim(),
      linkedin: String(formData.get("linkedin") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      resume: String(formData.get("resume") || "").trim()
    }
  });

  if (!parsed.success) {
    return { ok: false, message: "Invalid profile data" };
  }

  const links = Object.fromEntries(
    Object.entries(parsed.data.links).filter(([, value]) => value)
  );

  await sql`
    update users
    set name = ${parsed.data.name},
      email = ${parsed.data.email || null},
        bio = ${parsed.data.bio || null},
        location = ${parsed.data.location || null},
        skills = ${JSON.stringify(parsed.data.skills)}::jsonb,
        links = ${JSON.stringify(links)}::jsonb
    where id = ${user.id}
  `;

  revalidatePath("/dashboard/profile");
  revalidatePortfolio(user.username);

  return { ok: true, message: "Profile updated" };
}

export async function upsertProjectAction(formData: FormData): Promise<ActionResult> {
  const { user } = await requireAuthedUser();

  const parsed = projectSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    description: formData.get("description") || "",
    github_url: String(formData.get("github_url") || ""),
    live_url: String(formData.get("live_url") || ""),
    tech_stack: String(formData.get("tech_stack") || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  });

  if (!parsed.success) {
    return { ok: false, message: "Invalid project data" };
  }

  const data = parsed.data;

  if (data.id) {
    await sql`
      update projects
      set title = ${data.title},
          description = ${data.description || null},
          github_url = ${data.github_url || null},
          live_url = ${data.live_url || null},
          tech_stack = ${JSON.stringify(data.tech_stack)}::jsonb,
          updated_at = now()
      where id = ${data.id} and user_id = ${user.id}
    `;
  } else {
    await sql`
      insert into projects (user_id, title, description, github_url, live_url, tech_stack)
      values (
        ${user.id},
        ${data.title},
        ${data.description || null},
        ${data.github_url || null},
        ${data.live_url || null},
        ${JSON.stringify(data.tech_stack)}::jsonb
      )
    `;
  }

  revalidatePath("/dashboard/projects");
  revalidatePortfolio(user.username);

  return { ok: true, message: "Project saved" };
}

export async function deleteProjectAction(projectId: string): Promise<ActionResult> {
  const { user } = await requireAuthedUser();

  await sql`
    delete from projects where id = ${projectId} and user_id = ${user.id}
  `;

  revalidatePath("/dashboard/projects");
  revalidatePortfolio(user.username);

  return { ok: true, message: "Project deleted" };
}

export async function importGitHubRepoAction(repoId: number): Promise<ActionResult> {
  const { session, user } = await requireAuthedUser();

  if (!session.accessToken) {
    return { ok: false, message: "Missing GitHub token" };
  }

  const parsedRepoId = repoIdSchema.safeParse(repoId);
  if (!parsedRepoId.success) {
    return { ok: false, message: "Invalid repository id" };
  }

  let repos: Awaited<ReturnType<typeof getGitHubRepos>>;
  try {
    repos = await getGitHubRepos(session.accessToken);
  } catch (error) {
    console.error("[projects] GitHub fetch failed during import", error);
    return { ok: false, message: "Failed to fetch repositories from GitHub" };
  }

  const repo = repos.find((entry) => entry.id === parsedRepoId.data);
  if (!repo) {
    return { ok: false, message: "Repository not found" };
  }

  const duplicate = await sql<{ id: string }>`
    select id
    from projects
    where user_id = ${user.id} and github_url = ${repo.html_url}
    limit 1
  `;

  if (duplicate.length > 0) {
    return { ok: true, message: "Repository already imported" };
  }

  const techStack = [repo.language].filter((value): value is string => Boolean(value));

  await sql`
    insert into projects (user_id, title, description, github_url, live_url, tech_stack)
    values (
      ${user.id},
      ${repo.name},
      ${repo.description},
      ${repo.html_url},
      ${repo.homepage || null},
      ${JSON.stringify(techStack)}::jsonb
    )
    on conflict do nothing
  `;

  revalidatePath("/dashboard/projects");
  revalidatePortfolio(user.username);

  return { ok: true, message: `${repo.name} imported successfully` };
}

export async function publishPortfolioAction(): Promise<ActionResult> {
  const { user } = await requireAuthedUser();

  const projects = await getProjectsByUserId(user.id);
  const skills = (user.skills as string[]) ?? [];
  const links = (user.links as Record<string, string>) ?? {};
  const requirements: string[] = [];

  if (!user.bio || user.bio.trim().length < 40) {
    requirements.push("Add a bio with at least 40 characters");
  }

  if (!user.email) {
    requirements.push("Add a public email to receive contact messages");
  }

  if (skills.length < 3) {
    requirements.push("Add at least 3 skills");
  }

  if (projects.length < 1) {
    requirements.push("Add at least 1 project");
  }

  if (!links.github && !links.linkedin && !links.website) {
    requirements.push("Add at least one public profile link (GitHub, LinkedIn, or Website)");
  }

  if (requirements.length > 0) {
    return {
      ok: false,
      message: `Complete required fields before publish: ${requirements.join("; ")}`
    };
  }

  await sql`
    update portfolios
    set is_published = true,
        updated_at = now()
    where user_id = ${user.id}
  `;

  revalidatePath("/dashboard/deploy");
  revalidatePortfolio(user.username);

  return { ok: true, message: "Portfolio published successfully 🚀" };
}

export async function unpublishPortfolioAction(): Promise<ActionResult> {
  const { user } = await requireAuthedUser();

  await sql`
    update portfolios
    set is_published = false,
        updated_at = now()
    where user_id = ${user.id}
  `;

  revalidatePath("/dashboard/deploy");
  revalidatePortfolio(user.username);

  return { ok: true, message: "Portfolio moved back to draft" };
}

export async function setThemeAction(theme: string): Promise<ActionResult> {
  const { user } = await requireAuthedUser();

  await sql`
    update portfolios
    set theme = ${theme},
        updated_at = now()
    where user_id = ${user.id}
  `;

  revalidatePath("/dashboard/themes");
  revalidatePortfolio(user.username);

  return { ok: true, message: "Theme updated" };
}

export async function getDashboardData() {
  const { user } = await requireAuthedUser();
  const portfolio = await getPortfolioByUserId(user.id);
  const projects = await getProjectsByUserId(user.id);

  return { user, portfolio, projects };
}

export async function getPublicPortfolioData(username: string) {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  const portfolio = await getPortfolioByUserId(user.id);
  if (!portfolio || !portfolio.is_published) {
    return null;
  }

  const projects = await getProjectsByUserId(user.id);
  return { user, portfolio, projects };
}
