import { updateProfileAction } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/auth";
import { getUserByGithubId } from "@/lib/repositories";

export default async function ProfilePage() {
  const session = await auth();
  const user = await getUserByGithubId(session?.user.githubId ?? "");

  if (!user) {
    return null;
  }

  const links = (user.links as Record<string, string>) ?? {};

  async function action(formData: FormData) {
    "use server";
    await updateProfileAction(formData);
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Profile</h2>
      <p className="mt-1 text-sm text-muted">Your public hero details and contact links.</p>

      <form action={action} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" defaultValue={user.bio ?? ""} />
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={user.location ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              name="skills"
              defaultValue={(user.skills ?? []).join(", ")}
              placeholder="TypeScript, Next.js, PostgreSQL"
            />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              name="github"
              defaultValue={links.github ?? `https://github.com/${user.username}`}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" name="linkedin" defaultValue={links.linkedin ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">Website URL</Label>
            <Input id="website" name="website" defaultValue={links.website ?? ""} />
          </div>
        </div>

        <button className="mt-2 h-11 rounded-2xl bg-primary font-medium text-primary-foreground shadow-glow transition hover:opacity-90">
          Save Profile
        </button>
      </form>
    </Card>
  );
}
