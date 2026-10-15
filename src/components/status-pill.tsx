import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const dotVariants = cva("size-2 shrink-0 rounded-full", {
  variants: {
    tone: {
      success: "bg-white",
      error: "bg-red-300",
      pending: "animate-pulse bg-yellow-200",
    },
  },
  defaultVariants: { tone: "pending" },
});

function StatusPill({
  tone,
  className,
  children,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof dotVariants>) {
  return (
    <span
      data-slot="status-pill"
      className={cn(
        "flex max-w-[45%] items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] backdrop-blur",
        className
      )}
      {...props}
    >
      <span className={dotVariants({ tone })} />
      <span className="truncate">{children}</span>
    </span>
  );
}

export { StatusPill };
