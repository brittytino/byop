import { Trash2 } from "lucide-react";

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
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="h-11 w-11 rounded-full p-0 hover:bg-red-500/10 hover:text-red-400"
        title="Delete project"
        aria-label="Delete project"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}
