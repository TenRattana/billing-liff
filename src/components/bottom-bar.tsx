import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** แถบติดล่างจอ เว้นที่ safe-area ของ iPhone — หน้าที่ใช้ต้องเว้น padding ล่างเอง (pb-36) */
function BottomBar({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-bar"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-lg"
      {...props}
    >
      <div className={cn("mx-auto max-w-lg space-y-3", className)}>
        {children}
      </div>
    </div>
  );
}

export { BottomBar };
