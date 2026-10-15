import type { ReactNode } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type SegmentedControlProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly { value: T; label: ReactNode }[];
  className?: string;
};

/** ปุ่มสลับตัวเลือกแบบแถบ ใช้ RadioGroup ข้างใต้ (กดด้วยคีย์บอร์ด/screen reader ได้) */
function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  className,
}: SegmentedControlProps<T>) {
  return (
    <RadioGroup
      data-slot="segmented-control"
      value={value}
      onValueChange={(next) => {
        const option = options.find((o) => o.value === next);
        if (option) onValueChange(option.value);
      }}
      className={cn("grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-slate-100 p-1", className)}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all",
            value === option.value
              ? "bg-white text-line shadow-sm"
              : "text-slate-500"
          )}
        >
          <RadioGroupItem value={option.value} className="sr-only" />
          {option.label}
        </label>
      ))}
    </RadioGroup>
  );
}

export { SegmentedControl };
