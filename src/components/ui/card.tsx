import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass rounded-2xl border border-white/5 bg-surface/50 text-foreground shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:shadow-[0_15px_50px_rgba(0,0,0,0.8)] p-6",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
