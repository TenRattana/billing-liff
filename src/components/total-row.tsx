import type { ComponentProps, ReactNode } from "react";

import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type TotalRowProps = ComponentProps<"div"> & {
  amount: number;
  label?: ReactNode;
  /** ข้อความเล็กเหนือ label เช่น "เลือกแล้ว 2 รายการ" */
  hint?: ReactNode;
};

function TotalRow({
  amount,
  label = "ยอดรวม",
  hint,
  className,
  ...props
}: TotalRowProps) {
  return (
    <div
      data-slot="total-row"
      className={cn("flex items-end justify-between", className)}
      {...props}
    >
      <div>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <span className="text-2xl font-bold text-line tabular-nums">
        {formatMoney(amount)}
      </span>
    </div>
  );
}

export { TotalRow };
