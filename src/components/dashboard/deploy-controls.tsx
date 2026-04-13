"use client";

import { Copy, Loader2, Rocket, XCircle } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

import {
  publishPortfolioAction,
  unpublishPortfolioAction
} from "@/app/actions";
import { Button } from "@/components/ui/button";

type DeployControlsProps = {
  username: string;
  isPublished: boolean;
  updatedAt?: string | null;
};

type ToastState = {
  tone: "success" | "error";
  message: string;
};

export function DeployControls({
  username,
  isPublished,
  updatedAt
}: DeployControlsProps) {
  const [published, setPublished] = useState(isPublished);
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<"publish" | "unpublish" | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pending, startTransition] = useTransition();

  const liveUrl = useMemo(
    () => `https://portfolio.tinobritty.me/${username}`,
    [username]
  );

  const formattedUpdatedAt = useMemo(() => {
    if (!updatedAt) {
      return "Not available";
    }

    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleString();
  }, [updatedAt]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setToast({ tone: "success", message: "Live URL copied" });
    } catch {
      setToast({ tone: "error", message: "Could not copy link" });
    }
  }

  function onPublishConfirmed() {
    setActiveAction("publish");
    startTransition(async () => {
      const result = await publishPortfolioAction();
      if (result.ok) {
        setPublished(true);
        setConfirmPublishOpen(false);
        setToast({ tone: "success", message: result.message });
      } else {
        setToast({ tone: "error", message: result.message });
      }
      setActiveAction(null);
    });
  }

  function onUnpublish() {
    setActiveAction("unpublish");
    startTransition(async () => {
      const result = await unpublishPortfolioAction();
      if (result.ok) {
        setPublished(false);
        setToast({ tone: "success", message: "Portfolio unpublished" });
      } else {
        setToast({ tone: "error", message: result.message });
      }
      setActiveAction(null);
    });
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            toast.tone === "success"
              ? "border-green-500/40 bg-green-500/10 text-foreground"
              : "border-red-500/40 bg-red-500/10 text-foreground"
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-surface/80 p-4">
        <p className="text-sm text-muted">Public URL</p>
        <p className="mt-1 break-all font-medium">{liveUrl}</p>
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" size="sm" onClick={copyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/80 p-4">
        <p className="text-sm text-muted">Status</p>
        <div
          className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-transform duration-200 ${
            published
              ? "scale-105 bg-green-500/15 text-green-300"
              : "scale-100 bg-zinc-500/15 text-zinc-300"
          }`}
        >
          {published ? "Published" : "Draft"}
        </div>
        <p className="mt-2 text-xs text-muted">Last updated: {formattedUpdatedAt}</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface/80 p-4">
        <p className="text-sm text-muted">Publish Requirements</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted">
          <li>Bio with at least 40 characters</li>
          <li>Public email in profile</li>
          <li>At least 3 skills</li>
          <li>At least 1 project</li>
          <li>At least one public profile link (GitHub, LinkedIn, or Website)</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setConfirmPublishOpen(true)}
          disabled={pending || published}
        >
          {pending && activeAction === "publish" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="mr-2 h-4 w-4" />
          )}
          Publish Portfolio
        </Button>

        <Button
          variant="secondary"
          onClick={onUnpublish}
          disabled={pending || !published}
        >
          {pending && activeAction === "unpublish" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          Unpublish Portfolio
        </Button>
      </div>

      {confirmPublishOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-in fade-in duration-200">
          <div className="glass w-full max-w-md rounded-2xl border border-border p-6 shadow-glow animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold">Publish portfolio?</h3>
            <p className="mt-2 text-sm text-muted">
              Your portfolio will become publicly accessible at {liveUrl}.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setConfirmPublishOpen(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button onClick={onPublishConfirmed} disabled={pending}>
                {pending && activeAction === "publish" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Confirm Publish
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
