import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actionButtonVariants = cva("h-12 w-full rounded-xl text-base", {
  variants: {
    tone: {
      primary: "bg-line text-white hover:bg-line-dark",
      secondary: "text-slate-600",
    },
  },
  defaultVariants: { tone: "primary" },
});

/** ปุ่มเต็มความกว้างสำหรับ action หลักของหน้า */
function ActionButton({
  tone,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof actionButtonVariants>) {
  return (
    <Button
      data-slot="action-button"
      size="lg"
      variant={tone === "secondary" ? "ghost" : "default"}
      className={cn(actionButtonVariants({ tone }), className)}
      {...props}
    />
  );
}

export { ActionButton };
