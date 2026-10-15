import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppHeaderProps = Omit<ComponentProps<"header">, "title"> & {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** ช่องด้านขวา เช่น StatusPill */
  action?: ReactNode;
};

function AppHeader({
  icon,
  title,
  subtitle,
  action,
  className,
  ...props
}: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        "bg-gradient-to-br from-line to-line-dark px-5 pt-6 pb-14 text-white",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-lg items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur [&_svg]:size-6">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-lg leading-tight font-bold">{title}</h1>
            {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
    </header>
  );
}

export { AppHeader };
