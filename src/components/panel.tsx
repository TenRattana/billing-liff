import type { ComponentProps } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** การ์ดหลักลอยบน header */
function Panel({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="panel"
      className={cn("rounded-2xl border-0 shadow-lg shadow-slate-900/5", className)}
      {...props}
    />
  );
}

function PanelContent(props: ComponentProps<typeof CardContent>) {
  return <CardContent data-slot="panel-content" {...props} />;
}

export { Panel, PanelContent };
