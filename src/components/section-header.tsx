import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  count?: number;
  /** ปุ่มด้านขวา */
  action?: ReactNode;
};

function SectionHeader({
  title,
  count,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      className={cn("flex items-center justify-between px-1 pt-2", className)}
      {...props}
    >
      <h3 className="text-sm font-semibold text-slate-700">
        {title}
        {count !== undefined && (
          <span className="font-normal text-slate-400"> ({count})</span>
        )}
      </h3>
      {action}
    </div>
  );
}

export { SectionHeader };
