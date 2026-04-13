"use client";

import { useEffect } from "react";

type ViewTrackerProps = {
  username: string;
};

export function ViewTracker({ username }: ViewTrackerProps) {
  useEffect(() => {
    fetch(`/api/portfolio/${username}/view`, { method: "POST" }).catch(() => undefined);
  }, [username]);

  return null;
}
