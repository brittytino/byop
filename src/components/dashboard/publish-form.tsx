import { setPublishStateAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

type PublishFormProps = {
  isPublished: boolean;
};

export function PublishForm({ isPublished }: PublishFormProps) {
  async function action(formData: FormData) {
    "use server";
    await setPublishStateAction(formData);
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="publish" value={isPublished ? "false" : "true"} />
      <Button>{isPublished ? "Unpublish Portfolio" : "Publish Portfolio"}</Button>
    </form>
  );
}
