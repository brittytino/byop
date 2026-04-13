import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass rounded-2xl border border-border p-6 text-foreground shadow-glow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
