import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass rounded-2xl border border-border bg-surface/80 p-6 text-foreground shadow-[0_10px_28px_rgba(2,6,23,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(2,6,23,0.16)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_15px_50px_rgba(0,0,0,0.75)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
