import { deleteProjectAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

type ProjectDeleteFormProps = {
  projectId: string;
};

export function ProjectDeleteForm({ projectId }: ProjectDeleteFormProps) {
  async function action() {
    "use server";
    await deleteProjectAction(projectId);
  }

  return (
    <form action={action}>
      <Button type="submit" variant="ghost" size="sm">
        Delete
      </Button>
    </form>
  );
}
