import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Panel, PanelContent } from "@/components/panel";
import { cn } from "@/lib/utils";

const iconVariants = cva(
  "flex size-14 items-center justify-center rounded-full [&_svg]:size-7",
  {
    variants: {
      tone: {
        muted: "bg-slate-100 text-slate-400",
        error: "bg-red-50 text-red-500",
        success: "bg-green-50 text-line",
      },
    },
    defaultVariants: { tone: "muted" },
  }
);

type StateCardProps = VariantProps<typeof iconVariants> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** ปุ่มหรือ element ด้านล่าง */
  action?: ReactNode;
  className?: string;
};

/** การ์ดแสดงสถานะ: loading / empty / error */
function StateCard({
  icon,
  tone,
  title,
  description,
  action,
  className,
}: StateCardProps) {
  return (
    <Panel data-slot="state-card" className={className}>
      <PanelContent className="items-center gap-2 py-8 text-center">
        {icon && <div className={cn(iconVariants({ tone }))}>{icon}</div>}
        <h2 className="text-lg font-bold">{title}</h2>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </PanelContent>
    </Panel>
  );
}

export { StateCard };
