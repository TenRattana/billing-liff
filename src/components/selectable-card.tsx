import type { ComponentProps, ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type SelectableCardProps = Omit<ComponentProps<typeof Card>, "title"> & {
  checked: boolean;
  title: ReactNode;
  description?: ReactNode;
  /** ช่องด้านขวา เช่น ยอดเงิน */
  trailing?: ReactNode;
  /** aria-label ของ checkbox */
  label?: string;
};

/** การ์ดกดเลือกได้ทั้งใบ มี checkbox ด้านซ้าย */
function SelectableCard({
  checked,
  title,
  description,
  trailing,
  label,
  className,
  ...props
}: SelectableCardProps) {
  return (
    <Card
      data-slot="selectable-card"
      data-checked={checked || undefined}
      size="sm"
      className={cn(
        "cursor-pointer rounded-2xl shadow-none transition-all active:scale-[0.99]",
        checked
          ? "bg-green-50 ring-2 ring-line"
          : "ring-slate-200 hover:ring-slate-300",
        className
      )}
      {...props}
    >
      <CardContent className="flex-row items-center gap-3">
        <div className="pointer-events-none">
          <Checkbox checked={checked} aria-label={label} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          {description && (
            <p className="truncate text-xs text-slate-500">{description}</p>
          )}
        </div>

        {trailing && <div className="shrink-0">{trailing}</div>}
      </CardContent>
    </Card>
  );
}

export { SelectableCard };
