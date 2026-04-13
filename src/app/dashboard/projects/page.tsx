import { Plus, Save } from "lucide-react";

import { RepoImporter } from "@/components/dashboard/repo-importer";
import { ProjectDeleteForm } from "@/components/dashboard/project-delete-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertProjectAction } from "@/app/actions";
import { auth } from "@/lib/auth";
import { getProjectsByUserId, getUserByGithubId } from "@/lib/repositories";

export default async function ProjectsPage() {
  const session = await auth();
  const user = await getUserByGithubId(session?.user.githubId ?? "");

  if (!user) {
    return null;
  }

  const projects = await getProjectsByUserId(user.id);
  const importedGithubUrls = projects
    .map((project) => project.github_url)
    .filter((value): value is string => Boolean(value));

  async function saveProjectAction(formData: FormData) {
    "use server";
    await upsertProjectAction(formData);
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold">Projects</h2>
        <p className="mt-1 text-sm text-muted">Create custom entries for your portfolio.</p>

        <form action={saveProjectAction} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Portfolio Platform" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="What it solves" />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" name="github_url" placeholder="https://github.com/..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="live_url">Live URL</Label>
              <Input id="live_url" name="live_url" placeholder="https://..." />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tech_stack">Tech stack (comma separated)</Label>
            <Input id="tech_stack" name="tech_stack" placeholder="Next.js, TypeScript, Neon" />
          </div>
          <Button className="h-11 w-fit" type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Save Project
          </Button>
        </form>
      </Card>

      <RepoImporter importedGithubUrls={importedGithubUrls} />

      <Card>
        <h3 className="text-lg font-semibold">Saved Projects</h3>
        <div className="mt-4 space-y-3">
          {projects.length === 0 ? (
            <p className="text-sm text-muted">No projects added yet.</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-border bg-surface/70 p-4"
              >
                <form action={saveProjectAction} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="github_url" value={project.github_url ?? ""} />
                  <input type="hidden" name="live_url" value={project.live_url ?? ""} />
                  <input
                    type="hidden"
                    name="tech_stack"
                    value={(project.tech_stack ?? []).join(",")}
                  />

                  <div className="grid gap-2">
                    <Label htmlFor={`title-${project.id}`}>Title</Label>
                    <Input
                      id={`title-${project.id}`}
                      name="title"
                      defaultValue={project.title}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`description-${project.id}`}>Description</Label>
                    <Input
                      id={`description-${project.id}`}
                      name="description"
                      defaultValue={project.description ?? ""}
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="h-11 w-11 rounded-full p-0"
                      title="Save project"
                      aria-label="Save project"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <ProjectDeleteForm projectId={project.id} />
                  </div>
                </form>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                  {project.github_url ? <span>GitHub: {project.github_url}</span> : null}
                  {project.live_url ? <span>Live: {project.live_url}</span> : null}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
